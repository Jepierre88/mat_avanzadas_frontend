import { useCallback, useState } from "react";
import { DEFAULT_CONFIG, type DiceConfig } from "./dice-config.types";

export function useDiceConfig() {
    const [config, setConfig] = useState<DiceConfig>(DEFAULT_CONFIG);

    const updateConfig = useCallback(
        <K extends keyof DiceConfig>(key: K, value: DiceConfig[K]) => {
            setConfig((prev) => ({ ...prev, [key]: value }));
        },
        [],
    );

    const resetConfig = useCallback(() => setConfig(DEFAULT_CONFIG), []);

    const isDistinct = config.distinguishable && config.count === 2;
    const diceNotation = `${config.count}d${config.sides}`;

    return { config, updateConfig, resetConfig, isDistinct, diceNotation };
}
