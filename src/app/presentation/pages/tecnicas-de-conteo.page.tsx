import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import DiceRoller, { type DiceRollerHandle } from "../components/dice-roller";
import { AuroraText } from "@/components/ui/aurora-text";

type DiceRollerResult = {
    d1: number;
    d2: number;
};

export default function TecnicasDeConteoPage() {
    const [lastRoll, setLastRoll] = useState<DiceRollerResult | null>(null);
    const diceRef = useRef<DiceRollerHandle | null>(null);
    const [diceReady, setDiceReady] = useState(false);
    const [diceRolling, setDiceRolling] = useState(false);
    const didAutoRollRef = useRef(false);

    const bg = useMemo(() => {
        if (!lastRoll) {
            return {
                left: "D1",
                right: "D2",
            };
        }

        return {
            left: String(lastRoll.d1),
            right: String(lastRoll.d2),
        };
    }, [lastRoll]);

    useEffect(() => {
        if (!diceReady || didAutoRollRef.current) return;
        didAutoRollRef.current = true;
        void diceRef.current?.roll();
    }, [diceReady]);

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory">
            <section className="relative isolate h-full snap-start overflow-hidden border-b">
                <div className="absolute inset-0 -z-20">
                    <DiceRoller
                        ref={diceRef}
                        onResult={setLastRoll}
                        onStateChange={({ ready, rolling }) => {
                            setDiceReady(ready);
                            setDiceRolling(rolling);
                        }}
                        showButton={false}
                        framed={false}
                        height="100%"
                        className="h-full w-full opacity-75 dark:opacity-95 dark:brightness-125 dark:contrast-110"
                    />
                </div>

                <div className="pointer-events-none absolute inset-0 -z-10 select-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 dark:from-background/55 dark:via-background/25 dark:to-background/55" />
                    <div className="absolute inset-0 grid place-items-center">
                        <div className="flex items-center gap-10 opacity-10 sm:gap-16">
                            <div className="text-[96px] font-black leading-none tracking-tighter text-foreground sm:text-[140px] md:text-[200px]">
                                {bg.left}
                            </div>
                            <div className="text-[96px] font-black leading-none tracking-tighter text-foreground sm:text-[140px] md:text-[200px]">
                                {bg.right}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex h-full w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
                    <div className="rounded-full border border-border bg-secondary/30 px-3 py-1 text-[11px] font-medium tracking-wide text-secondary-foreground">
                        Técnicas de Conteo
                    </div>

                    <AuroraText className="mt-4 text-5xl font-black tracking-tight text-primary sm:text-7xl lg:text-8xl">
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
                                ? "Loading..."
                                : diceRolling
                                  ? "Rolling..."
                                  : "Rodar Dados"}
                        </Button>
                    </div>

                </div>
            </section>

            <section className="h-full snap-start">
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
