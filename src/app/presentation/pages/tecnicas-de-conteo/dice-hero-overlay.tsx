import type { DiceRollerResult } from "./dice-config.types";

interface DiceHeroOverlayProps {
    isDistinct: boolean;
    colorA: string;
    colorB: string;
    lastRoll: DiceRollerResult | null;
}

export function DiceHeroOverlay({ isDistinct, colorA, colorB, lastRoll }: DiceHeroOverlayProps) {
    const leftLabel = lastRoll ? String(lastRoll.d1) : "Dado A";
    const rightLabel = lastRoll ? String(lastRoll.d2) : "Dado B";

    return (
        <div className="pointer-events-none absolute inset-0 -z-10 select-none">
            {/* Gradient veil */}
            <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/70 to-background/90 dark:from-background/55 dark:via-background/25 dark:to-background/55" />

            {/* Big background numbers (only when 2 distinguishable dice) */}
            {isDistinct && (
                <div className="absolute inset-x-0 top-0 flex justify-center pt-4">
                    <div className="flex items-center gap-10 opacity-10 sm:gap-16">
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-[10px] font-semibold tracking-wide" style={{ color: colorA }}>
                                {leftLabel}
                            </div>
                            <div
                                className="text-[96px] font-black leading-none tracking-tighter sm:text-[140px] md:text-[200px]"
                                style={{ color: colorA }}
                            >
                                {lastRoll ? String(lastRoll.d1) : "?"}
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="text-[10px] font-semibold tracking-wide" style={{ color: colorB }}>
                                {rightLabel}
                            </div>
                            <div
                                className="text-[96px] font-black leading-none tracking-tighter sm:text-[140px] md:text-[200px]"
                                style={{ color: colorB }}
                            >
                                {lastRoll ? String(lastRoll.d2) : "?"}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
