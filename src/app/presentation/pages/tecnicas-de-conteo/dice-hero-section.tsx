import { type RefObject, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

import DiceRoller, { type DiceRollerHandle } from "../../components/dice-roller";
import { AuroraText } from "@/components/ui/aurora-text";

import { DiceConfigSheet } from "./dice-config-sheet";
import { DiceHeroOverlay } from "./dice-hero-overlay";
import { darkenHex, type DiceConfig, type DiceRollerResult } from "./dice-config.types";

interface DiceHeroSectionProps {
    diceRef: RefObject<DiceRollerHandle | null>;
    config: DiceConfig;
    isDistinct: boolean;
    diceNotation: string;
    lastRoll: DiceRollerResult | null;
    diceReady: boolean;
    diceRolling: boolean;
    sheetOpen: boolean;
    onSheetOpenChange: (open: boolean) => void;
    onResult: (result: DiceRollerResult) => void;
    onStateChange: (state: { ready: boolean; rolling: boolean }) => void;
    onUpdate: <K extends keyof DiceConfig>(key: K, value: DiceConfig[K]) => void;
    onReset: () => void;
    onScrollToActivity: () => void;
}

export function DiceHeroSection({
    diceRef,
    config,
    isDistinct,
    diceNotation,
    lastRoll,
    diceReady,
    diceRolling,
    sheetOpen,
    onSheetOpenChange,
    onResult,
    onStateChange,
    onUpdate,
    onReset,
    onScrollToActivity,
}: DiceHeroSectionProps) {
    const auroraColors = useMemo(
        () => [
            config.colorA,
            darkenHex(config.colorA, 0.55),
            config.colorB,
            darkenHex(config.colorB, 0.55),
        ],
        [config.colorA, config.colorB],
    );

    return (
        <section className="relative isolate h-full snap-start overflow-hidden border-b">
            {/* 3-D dice background */}
            <div className="absolute inset-0 -z-20">
                <DiceRoller
                    ref={diceRef}
                    onResult={onResult}
                    onStateChange={onStateChange}
                    count={config.count}
                    sides={config.sides}
                    distinguishable={isDistinct}
                    diceColorA={config.colorA}
                    diceColorB={config.colorB}
                    showButton={false}
                    framed={false}
                    height="100%"
                    className="h-full w-full opacity-95 brightness-110 contrast-105 dark:brightness-125 dark:contrast-110"
                />
            </div>

            {/* Gradient + big-numbers overlay */}
            <DiceHeroOverlay
                isDistinct={isDistinct}
                colorA={config.colorA}
                colorB={config.colorB}
                lastRoll={lastRoll}
            />

            {/* ⚙ Config Sheet trigger (top-left) */}
            <div className="absolute top-4 left-4 z-20">
                <DiceConfigSheet
                    open={sheetOpen}
                    onOpenChange={onSheetOpenChange}
                    config={config}
                    onUpdate={onUpdate}
                    onReset={onReset}
                    diceNotation={diceNotation}
                />
            </div>

            {/* ↓ Scroll to activity */}
            <div className="absolute bottom-6 right-6 z-20">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onScrollToActivity}
                    aria-label="Ir a la actividad"
                    className="h-auto flex-col gap-1 rounded-full border border-border/60 bg-background/40 px-4 py-3 backdrop-blur supports-backdrop-filter:bg-background/30"
                >
                    <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                        Actividad
                    </span>
                    <ArrowDown className="h-5 w-5 text-muted-foreground animate-bounce" />
                </Button>
            </div>

            {/* Center content */}
            <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
                <div className="rounded-full border border-border bg-secondary/30 px-3 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground">
                    Técnicas de Conteo
                </div>

                <AuroraText
                    colors={auroraColors}
                    className="mt-4 text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl"
                >
                    DADOS
                </AuroraText>

                <div className="mt-6">
                    <Button
                        size="lg"
                        className="px-8"
                        onClick={() => void diceRef.current?.roll()}
                        disabled={!diceReady || diceRolling}
                    >
                        {!diceReady
                            ? "Cargando..."
                            : diceRolling
                              ? "Lanzando..."
                              : "Lanzar Dados"}
                    </Button>
                </div>
            </div>
        </section>
    );
}
