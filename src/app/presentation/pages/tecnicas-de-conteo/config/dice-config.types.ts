import { DICE_COLOR_BLUE, DICE_COLOR_RED } from "../../../components/dice-roller";

/* ─── Types ─── */

export type DiceConfig = {
    count: number;
    sides: number;
    distinguishable: boolean;
    colorA: string;
    colorB: string;
};

export type DiceRollerResult = {
    d1: number;
    d2: number;
};

/* ─── Constants ─── */

export const SIDES_OPTIONS = [4, 6, 8, 10, 12, 20] as const;

export const DEFAULT_CONFIG: DiceConfig = {
    count: 2,
    sides: 6,
    distinguishable: true,
    colorA: DICE_COLOR_BLUE,
    colorB: DICE_COLOR_RED,
};

/* ─── Helpers ─── */

/** Darken a hex colour by a factor (0 = black, 1 = original). */
export function darkenHex(hex: string, factor: number): string {
    const h = hex.replace("#", "");
    const r = Math.round(parseInt(h.substring(0, 2), 16) * factor);
    const g = Math.round(parseInt(h.substring(2, 4), 16) * factor);
    const b = Math.round(parseInt(h.substring(4, 6), 16) * factor);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
