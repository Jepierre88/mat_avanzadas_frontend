import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowDown, Settings2, RotateCcw } from "lucide-react";

import DiceRoller, { DICE_COLOR_BLUE, DICE_COLOR_RED, type DiceRollerHandle } from "../components/dice-roller";
import { AuroraText } from "@/components/ui/aurora-text";
import { ColorPicker } from "@/components/ui/color-picker";

type DiceRollerResult = {
    d1: number;
    d2: number;
};

/* ─── Dice configuration ─── */

type DiceConfig = {
    count: number;
    sides: number;
    distinguishable: boolean;
    colorA: string;
    colorB: string;
};

const SIDES_OPTIONS = [4, 6, 8, 10, 12, 20] as const;

const DEFAULT_CONFIG: DiceConfig = {
    count: 2,
    sides: 6,
    distinguishable: true,
    colorA: DICE_COLOR_BLUE,
    colorB: DICE_COLOR_RED,
};

/** Darken a hex colour by a factor (0 = black, 1 = original). */
function darkenHex(hex: string, factor: number): string {
    const h = hex.replace("#", "");
    const r = Math.round(parseInt(h.substring(0, 2), 16) * factor);
    const g = Math.round(parseInt(h.substring(2, 4), 16) * factor);
    const b = Math.round(parseInt(h.substring(4, 6), 16) * factor);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export default function TecnicasDeConteoPage() {
    const [lastRoll, setLastRoll] = useState<DiceRollerResult | null>(null);
    const diceRef = useRef<DiceRollerHandle | null>(null);
    const activityRef = useRef<HTMLElement | null>(null);
    const [diceReady, setDiceReady] = useState(false);
    const [diceRolling, setDiceRolling] = useState(false);
    const didAutoRollRef = useRef(false);

    const [config, setConfig] = useState<DiceConfig>(DEFAULT_CONFIG);
    const [sheetOpen, setSheetOpen] = useState(false);

    const isDistinct = config.distinguishable && config.count === 2;

    const auroraColors = useMemo(
        () => [
            config.colorA,
            darkenHex(config.colorA, 0.55),
            config.colorB,
            darkenHex(config.colorB, 0.55),
        ],
        [config.colorA, config.colorB],
    );

    const bg = useMemo(() => {
        if (!lastRoll) return { left: "Dado A", right: "Dado B" };
        return { left: String(lastRoll.d1), right: String(lastRoll.d2) };
    }, [lastRoll]);

    useEffect(() => {
        if (!diceReady || didAutoRollRef.current) return;
        didAutoRollRef.current = true;
        void diceRef.current?.roll();
    }, [diceReady]);

    const scrollToActivity = () => {
        activityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const updateConfig = useCallback(
        <K extends keyof DiceConfig>(key: K, value: DiceConfig[K]) => {
            setConfig((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const resetConfig = useCallback(() => setConfig(DEFAULT_CONFIG), []);

    const diceNotation = `${config.count}d${config.sides}`;

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth">
            {/* ────────── HERO SECTION ────────── */}
            <section className="relative isolate h-full snap-start overflow-hidden border-b">
                {/* 3-D dice background */}
                <div className="absolute inset-0 -z-20">
                    <DiceRoller
                        ref={diceRef}
                        onResult={setLastRoll}
                        onStateChange={({ ready, rolling }) => {
                            setDiceReady(ready);
                            setDiceRolling(rolling);
                        }}
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
                <div className="pointer-events-none absolute inset-0 -z-10 select-none">
                    <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/70 to-background/90 dark:from-background/55 dark:via-background/25 dark:to-background/55" />

                    {isDistinct && (
                        <div className="absolute inset-x-0 top-0 flex justify-center pt-4">
                            <div className="flex items-center gap-10 opacity-10 sm:gap-16">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-[10px] font-semibold tracking-wide" style={{ color: config.colorA }}>
                                        {bg.left}
                                    </div>
                                    <div
                                        className="text-[96px] font-black leading-none tracking-tighter sm:text-[140px] md:text-[200px]"
                                        style={{ color: config.colorA }}
                                    >
                                        {lastRoll ? String(lastRoll.d1) : "?"}
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-[10px] font-semibold tracking-wide" style={{ color: config.colorB }}>
                                        {bg.right}
                                    </div>
                                    <div
                                        className="text-[96px] font-black leading-none tracking-tighter sm:text-[140px] md:text-[200px]"
                                        style={{ color: config.colorB }}
                                    >
                                        {lastRoll ? String(lastRoll.d2) : "?"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ⚙ Config Sheet trigger (top-left) */}
                <div className="absolute top-4 left-4 z-20">
                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border border-border/60 bg-background/40 backdrop-blur supports-backdrop-filter:bg-background/30"
                                aria-label="Configurar dados"
                            >
                                <Settings2 className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-80 overflow-y-auto sm:w-96">
                            <SheetHeader>
                                <SheetTitle>Configuración de Dados</SheetTitle>
                                <SheetDescription>
                                    Personaliza la cantidad, caras y colores de los dados.
                                </SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-6 px-1">
                                {/* ── Cantidad ── */}
                                <div className="space-y-2">
                                    <Label htmlFor="dice-count">Cantidad de dados</Label>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 shrink-0"
                                            disabled={config.count <= 1}
                                            onClick={() => updateConfig("count", Math.max(1, config.count - 1))}
                                        >
                                            −
                                        </Button>
                                        <Input
                                            id="dice-count"
                                            type="number"
                                            min={1}
                                            max={10}
                                            value={config.count}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value);
                                                if (!isNaN(v) && v >= 1 && v <= 10) updateConfig("count", v);
                                            }}
                                            className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 shrink-0"
                                            disabled={config.count >= 10}
                                            onClick={() => updateConfig("count", Math.min(10, config.count + 1))}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                {/* ── Caras ── */}
                                <div className="space-y-2">
                                    <Label>Caras por dado</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {SIDES_OPTIONS.map((s) => (
                                            <Button
                                                key={s}
                                                variant={config.sides === s ? "default" : "outline"}
                                                size="sm"
                                                className="min-w-[3rem]"
                                                onClick={() => updateConfig("sides", s)}
                                            >
                                                d{s}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* ── Distinguibles ── */}
                                <div className="space-y-2">
                                    <Label>Dados distinguibles</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Cada dado tiene su propio color. Solo aplica con 2 dados.
                                    </p>
                                    <Button
                                        variant={config.distinguishable ? "default" : "outline"}
                                        size="sm"
                                        disabled={config.count !== 2}
                                        onClick={() => updateConfig("distinguishable", !config.distinguishable)}
                                    >
                                        {config.distinguishable ? "Activado" : "Desactivado"}
                                    </Button>
                                </div>

                                {/* ── Colores ── */}
                                {config.distinguishable && config.count === 2 && (
                                    <>
                                        <Separator />
                                        <div className="space-y-3">
                                            <Label>Colores</Label>
                                            <div className="flex flex-col gap-2">
                                                <ColorPicker
                                                    value={config.colorA}
                                                    onChange={(c) => updateConfig("colorA", c)}
                                                    label="Dado A"
                                                />
                                                <ColorPicker
                                                    value={config.colorB}
                                                    onChange={(c) => updateConfig("colorB", c)}
                                                    label="Dado B"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <Separator />

                                {/* ── Vista previa & restaurar ── */}
                                <div className="flex items-center justify-between">
                                    <div className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-sm font-semibold tracking-wide">
                                        {diceNotation}
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={resetConfig} className="gap-1.5">
                                        <RotateCcw className="h-3.5 w-3.5" />
                                        Restaurar
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* ↓ Scroll to activity */}
                <div className="absolute bottom-6 right-6 z-20">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={scrollToActivity}
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

            {/* ────────── ACTIVITY SECTION ────────── */}
            <section ref={activityRef} className="h-full snap-start">
                <div className="mx-auto flex h-full w-full max-w-7xl flex-col px-4 py-10">
                    <Card className="flex flex-1 flex-col">
                        <CardHeader className="py-4">
                            <CardTitle className="text-lg">Actividad</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="h-full w-full rounded-lg border border-dashed bg-muted/10" />
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
