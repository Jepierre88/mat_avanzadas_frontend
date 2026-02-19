import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
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
import { RotateCcw, Settings2 } from "lucide-react";

import { SIDES_OPTIONS, type DiceConfig } from "../config/dice-config.types";

interface DiceConfigSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    config: DiceConfig;
    onUpdate: <K extends keyof DiceConfig>(key: K, value: DiceConfig[K]) => void;
    onReset: () => void;
    diceNotation: string;
}

export function DiceConfigSheet({
    open,
    onOpenChange,
    config,
    onUpdate,
    onReset,
    diceNotation,
}: DiceConfigSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
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
                                onClick={() => onUpdate("count", Math.max(1, config.count - 1))}
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
                                    if (!isNaN(v) && v >= 1 && v <= 10) onUpdate("count", v);
                                }}
                                className="h-8 w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 shrink-0"
                                disabled={config.count >= 10}
                                onClick={() => onUpdate("count", Math.min(10, config.count + 1))}
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
                                    onClick={() => onUpdate("sides", s)}
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
                            onClick={() => onUpdate("distinguishable", !config.distinguishable)}
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
                                        onChange={(c) => onUpdate("colorA", c)}
                                        label="Dado A"
                                    />
                                    <ColorPicker
                                        value={config.colorB}
                                        onChange={(c) => onUpdate("colorB", c)}
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
                        <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restaurar
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
