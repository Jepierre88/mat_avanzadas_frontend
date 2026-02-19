import { useEffect, useRef, useState } from "react";

import { type DiceRollerHandle } from "../../components/dice-roller";

import { DiceActivitySection } from "./components/dice-activity-section";
import { DiceHeroSection } from "./components/dice-hero-section";
import { type DiceRollerResult } from "./config/dice-config.types";
import { useDiceConfig } from "./hooks/use-dice-config";
import { useExerciseView } from "./hooks/use-exercise-view";

export default function TecnicasDeConteoPage() {
    const [lastRoll, setLastRoll] = useState<DiceRollerResult | null>(null);
    const diceRef = useRef<DiceRollerHandle | null>(null);
    const activityRef = useRef<HTMLElement | null>(null);
    const [diceReady, setDiceReady] = useState(false);
    const [diceRolling, setDiceRolling] = useState(false);
    const didAutoRollRef = useRef(false);

    const [sheetOpen, setSheetOpen] = useState(false);
    const { config, updateConfig, resetConfig, isDistinct, diceNotation } = useDiceConfig();
    const { view, loading: viewLoading, error: viewError, statement } = useExerciseView();

    /* Auto-roll on first load */
    useEffect(() => {
        if (!diceReady || didAutoRollRef.current) return;
        didAutoRollRef.current = true;
        void diceRef.current?.roll();
    }, [diceReady]);

    const scrollToActivity = () => {
        activityRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth">
            <DiceHeroSection
                diceRef={diceRef}
                config={config}
                isDistinct={isDistinct}
                diceNotation={diceNotation}
                lastRoll={lastRoll}
                diceReady={diceReady}
                diceRolling={diceRolling}
                sheetOpen={sheetOpen}
                onSheetOpenChange={setSheetOpen}
                onResult={setLastRoll}
                onStateChange={({ ready, rolling }) => {
                    setDiceReady(ready);
                    setDiceRolling(rolling);
                }}
                onUpdate={updateConfig}
                onReset={resetConfig}
                onScrollToActivity={scrollToActivity}
            />

            <DiceActivitySection
                ref={activityRef}
                view={view}
                statement={statement}
                loading={viewLoading}
                error={viewError}
            />
        </div>
    );
}
