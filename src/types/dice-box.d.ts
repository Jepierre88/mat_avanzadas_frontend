declare module "@3d-dice/dice-box" {
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
  }

  interface RollOptions {
    theme?: string;
    themeColor?: string;
    newStartPoint?: boolean;
  }

  interface DiceResult {
    sides: number;
    value: number;
  }

  export default class DiceBox {
    constructor(selector: string, options?: DiceBoxOptions);

    init(): Promise<void>;

    updateConfig(options: Partial<DiceBoxOptions>): Promise<this>;

    roll(notation: string, options?: RollOptions): Promise<DiceResult[]>;

    clear(): this;
  }
}
