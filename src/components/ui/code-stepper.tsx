import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { useTheme } from "@/app/presentation/components/theme-provider";
import type { Walkthrough, WalkthroughStep } from "@/app/domain/types/api.types";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import {
    vscDarkPlus,
    oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";

SyntaxHighlighter.registerLanguage("python", python);

/* ────────────────────────────────────────────────────────────── */

interface CodeStepperProps {
    walkthrough: Walkthrough;
    className?: string;
}

export function CodeStepper({ walkthrough, className = "" }: CodeStepperProps) {
    const { code, steps } = walkthrough;
    const { theme } = useTheme();
    const isDark =
        theme === "dark" ||
        (theme === "system" &&
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark"));

    const [currentStep, setCurrentStep] = useState(-1);
    const [playing, setPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const codeContainerRef = useRef<HTMLDivElement>(null);
    const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
    const [flippedAbove, setFlippedAbove] = useState(false);

    const step: WalkthroughStep | null =
        currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;

    const highlightedLines = new Set(step?.lines ?? []);

    /* ── Auto-play ── */
    const stopPlay = useCallback(() => {
        setPlaying(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!playing) return;
        intervalRef.current = setInterval(() => {
            setCurrentStep((prev) => {
                const next = prev + 1;
                if (next >= steps.length) {
                    stopPlay();
                    return prev;
                }
                return next;
            });
        }, 3000);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [playing, steps.length, stopPlay]);

    /* ── Position the overlay near highlighted lines ── */
    useLayoutEffect(() => {
        if (!step || !codeContainerRef.current) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOverlayStyle({});
            return;
        }

        const container = codeContainerRef.current;
        const allLineSpans = container.querySelectorAll<HTMLElement>(
            'span[data-hl-line]'
        );

        if (allLineSpans.length === 0) {
            setOverlayStyle({});
            return;
        }

        // Use the LAST highlighted line to position overlay below it
        const firstLine = allLineSpans[0];
        const lastLine = allLineSpans[allLineSpans.length - 1];
        const containerRect = container.getBoundingClientRect();
        const firstLineRect = firstLine.getBoundingClientRect();
        const lastLineRect = lastLine.getBoundingClientRect();

        const scrollParent = container;

        // Position below the last highlighted line
        const relativeTopOfLastLine =
            lastLineRect.top - containerRect.top + scrollParent.scrollTop;
        const belowLastLine = relativeTopOfLastLine + lastLineRect.height + 4;

        // Check if placing below would push overlay past the container's scroll height
        const containerVisibleBottom = scrollParent.scrollTop + containerRect.height;
        const estimatedOverlayHeight = 120; // rough estimate for the overlay
        const fitsBelow = belowLastLine + estimatedOverlayHeight < scrollParent.scrollHeight + 60;

        let finalTop: number;
        let flipAbove = false;

        if (fitsBelow) {
            finalTop = belowLastLine;
        } else {
            // Place above the FIRST highlighted line
            const relativeTopOfFirstLine =
                firstLineRect.top - containerRect.top + scrollParent.scrollTop;
            finalTop = relativeTopOfFirstLine - estimatedOverlayHeight - 4;
            flipAbove = true;
            if (finalTop < 0) finalTop = 4; // safety
        }

        // Scroll so the highlighted lines are visible
        const relativeTopFirst =
            firstLineRect.top - containerRect.top + scrollParent.scrollTop;
        const targetScroll = Math.max(0, relativeTopFirst - 60);
        scrollParent.scrollTo({ top: targetScroll, behavior: "smooth" });

        setOverlayStyle({
            top: finalTop,
            ...(flipAbove ? { transform: "translateY(0)" } : {}),
        });
        setFlippedAbove(flipAbove);
    }, [step, currentStep]);

    const handlePrev = () => {
        stopPlay();
        setCurrentStep((p) => Math.max(0, p - 1));
    };

    const handleNext = () => {
        stopPlay();
        setCurrentStep((p) => Math.min(steps.length - 1, p + 1));
    };

    const handlePlayPause = () => {
        if (playing) {
            stopPlay();
        } else {
            if (currentStep < 0 || currentStep >= steps.length - 1) {
                setCurrentStep(0);
            }
            setPlaying(true);
        }
    };

    const handleReset = () => {
        stopPlay();
        setCurrentStep(-1);
    };

    /* ── Line props for highlighting ── */
    const lineProps = (lineNumber: number): React.HTMLProps<HTMLElement> => {
        const isActive = highlightedLines.has(lineNumber);

        const baseStyle: React.CSSProperties = {
            display: "block",
            transition: "all 0.3s ease",
        };

        if (highlightedLines.size === 0) {
            return { style: baseStyle };
        }

        return {
            style: {
                ...baseStyle,
                backgroundColor: isActive
                    ? isDark
                        ? "rgba(59, 130, 246, 0.18)"
                        : "rgba(59, 130, 246, 0.12)"
                    : undefined,
                borderLeft: isActive
                    ? "3px solid rgb(59, 130, 246)"
                    : "3px solid transparent",
                opacity: isActive ? 1 : 0.35,
            },
            ...(isActive ? { "data-hl-line": "true" } as any : {}),
        };
    };

    const variableEntries = step ? Object.entries(step.variables) : [];
    const testParamEntries = Object.entries(walkthrough.test_params ?? {});

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {/* ── Test params banner ── */}
            {testParamEntries.length > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                        Datos de prueba:
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {testParamEntries.map(([key, val]) => (
                            <span
                                key={key}
                                className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800 dark:text-amber-300"
                            >
                                {key} = {String(val)}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Controls (top) ── */}
            <div className="flex flex-wrap items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    disabled={currentStep < 0}
                >
                    ↺
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep <= 0}
                >
                    ◀
                </Button>
                <Button size="sm" onClick={handlePlayPause}>
                    {playing ? "⏸ Pausar" : "▶ Reproducir"}
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentStep >= steps.length - 1}
                >
                    ▶
                </Button>

                <span className="ml-auto text-xs text-muted-foreground">
                    {currentStep >= 0
                        ? `Paso ${currentStep + 1} / ${steps.length}`
                        : `${steps.length} pasos`}
                </span>
            </div>

            {/* ── Code viewer (relative container for overlay) ── */}
            <div
                ref={codeContainerRef}
                className="relative overflow-auto rounded-xl border shadow-sm"
                style={{ maxHeight: "70vh" }}
            >
                <SyntaxHighlighter
                    language="python"
                    style={isDark ? vscDarkPlus : oneLight}
                    customStyle={{
                        borderRadius: "0.75rem",
                        width: "100%",
                        margin: 0,
                        fontSize: "0.9rem",
                        padding: "1rem 0.75rem",
                        background: "transparent",
                        minHeight: step ? "12rem" : undefined,
                    }}
                    showLineNumbers
                    wrapLines
                    lineProps={lineProps}
                >
                    {code}
                </SyntaxHighlighter>

                {/* ── Floating explanation overlay ── */}
                {step && (
                    <div
                        className="absolute left-3 right-3 z-10 animate-in fade-in slide-in-from-top-2 duration-200"
                        style={{
                            ...overlayStyle,
                        }}
                    >
                        {/* Arrow pointing up (overlay below lines) */}
                        {!flippedAbove && (
                            <div className="ml-6 h-0 w-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-blue-500/80" />
                        )}

                        <div
                            className={`rounded-lg border shadow-lg backdrop-blur-sm ${
                                isDark
                                    ? "border-blue-500/30 bg-slate-900/95 text-slate-100"
                                    : "border-blue-500/30 bg-white/95 text-slate-900"
                            }`}
                        >
                            {/* Title bar */}
                            <div className="flex items-center gap-2 border-b border-blue-500/20 px-3 py-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                                    {currentStep + 1}
                                </span>
                                <span className="text-sm font-semibold">
                                    {step.title}
                                </span>
                            </div>

                            {/* Explanation */}
                            <div className="px-3 py-2">
                                <p className="text-xs leading-relaxed whitespace-pre-line text-muted-foreground">
                                    {step.explanation}
                                </p>
                            </div>

                            {/* Variables */}
                            {variableEntries.length > 0 && (
                                <div className={`border-t px-3 py-2 ${
                                    isDark ? "border-slate-700/50" : "border-slate-200"
                                }`}>
                                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px]">
                                        {variableEntries.map(([key, val]) => (
                                            <span key={key}>
                                                <span className="font-semibold text-blue-500">
                                                    {key}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {" "}= {val}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Arrow pointing down (overlay above lines) */}
                        {flippedAbove && (
                            <div className="ml-6 h-0 w-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-blue-500/80" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}