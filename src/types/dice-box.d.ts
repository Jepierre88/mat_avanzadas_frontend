declare module "@3d-dice/dice-box" {
  type DiceNotation =
    | string
    | RollNotation
    | Array<string | RollNotation>

  interface RollNotation {
    qty: number
    sides: number
    theme?: string
    themeColor?: string
    // allow extra fields used by the library/themes without blocking
    [key: string]: unknown
  }

  interface DiceBoxOptions {
    id?: string;
    container?: string | null;
    assetPath?: string;
    theme?: string;
    themeColor?: string;
    enableShadows?: boolean;
    shadowTransparency?: number;
    delay?: number;
    offscreen?: boolean;
    preloadThemes?: string[];
    externalThemes?: Record<string, unknown>;
    suspendSimulation?: boolean;
    gravity?: number;
    strength?: number;
    scale?: number;
    lightIntensity?: number;
    throwForce?: number;

    // Callbacks (documented in v1.1)
    onRollResult?: (result: DiceResult) => void;
    onRollComplete?: (results: DiceResult[]) => void;
    onThemeLoaded?: (themeId: string) => void;
    onInitComplete?: () => void;
  }

  interface RollOptions {
    theme?: string;
    themeColor?: string;
    newStartPoint?: boolean;
  }

  interface RerollOptions {
    remove?: boolean;
    hide?: boolean;
    newStartPoint?: boolean;
  }

  interface DiceResult {
    // groupId/rollId are useful for reroll/remove in v1.1
    groupId?: number;
    rollId?: number;
    sides: number;
    value: number;
    theme?: string;
    themeColor?: string;
    [key: string]: unknown;
  }

  export default class DiceBox {
    // v1.1+ API: constructor takes a single config object
    constructor(options: DiceBoxOptions & { container: string });

    // Backwards-compatible old API (still works but logs a warning)
    constructor(selector: string, options?: DiceBoxOptions);

    init(): Promise<void>;

    updateConfig(options: Partial<DiceBoxOptions>): Promise<this>;

    roll(notation: DiceNotation, options?: RollOptions): Promise<DiceResult[]>;

    add(notation: DiceNotation, options?: RollOptions): Promise<DiceResult[]>;

    reroll(notation: DiceResult | DiceResult[], options?: RerollOptions): Promise<DiceResult[]>;

    remove(notation: DiceResult | DiceResult[]): Promise<DiceResult[]>;

    getRollResults(): DiceResult[];

    hide(className?: string): this;

    show(): this;

    clear(): this;
  }
}
