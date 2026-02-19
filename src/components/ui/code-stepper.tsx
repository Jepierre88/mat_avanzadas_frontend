import { useCallback, useEffect, useRef, useState } from "react";

import { useTheme } from "@/app/presentation/components/theme-provider";
import type { Walkthrough, WalkthroughStep } from "@/app/domain/types/api.types";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import python from "react-syntax-highlighter/dist/esm/languages/prism/python";
import {
    vscDarkPlus,
    oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

    const [currentStep, setCurrentStep] = useState(-1); // -1 = no step selected
    const [playing, setPlaying] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
        }, 2500);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [playing, steps.length, stopPlay]);

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
        if (highlightedLines.size === 0) return {};

        const isActive = highlightedLines.has(lineNumber);
        return {
            style: {
                display: "block",
                backgroundColor: isActive
                    ? isDark
                        ? "rgba(59, 130, 246, 0.18)"
                        : "rgba(59, 130, 246, 0.12)"
                    : undefined,
                borderLeft: isActive ? "3px solid rgb(59, 130, 246)" : "3px solid transparent",
                opacity: isActive ? 1 : 0.4,
                transition: "all 0.3s ease",
            },
        };
    };

    const variableEntries = step ? Object.entries(step.variables) : [];

    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {/* ── Code viewer ── */}
            <div className="overflow-auto rounded-xl border shadow-sm">
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
                    }}
                    showLineNumbers
                    wrapLines
                    lineProps={lineProps}
                >
                    {code}
                </SyntaxHighlighter>
            </div>

            {/* ── Controls ── */}
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

            {/* ── Step info panel ── */}
            {step && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="flex flex-col gap-3 py-4">
                        <div>
                            <p className="text-sm font-semibold">{step.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                                {step.explanation}
                            </p>
                        </div>

                        {variableEntries.length > 0 && (
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                    Variables
                                </p>
                                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-md bg-muted/30 px-3 py-2 font-mono text-xs">
                                    {variableEntries.map(([key, val]) => (
                                        <div key={key} className="contents">
                                            <span className="font-semibold text-primary">
                                                {key}
                                            </span>
                                            <span className="text-muted-foreground truncate">
                                                = {val}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
