
import DiceBox from "@3d-dice/dice-box"
import "@3d-dice/dice-box/dist/style.css"
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/ui/button"

/**
 * Resolve a CSS custom-property (e.g. "--primary") to a hex color string
 * that canvas / dice-box can consume, regardless of the colour format
 * stored in the stylesheet (oklch, hsl, rgb, hex …).
 */
function cssVarToHex(varName: string): string | undefined {
  if (typeof window === "undefined") return undefined
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim()
  if (!raw) return undefined

  const canvas = document.createElement("canvas")
  canvas.width = canvas.height = 1
  const ctx = canvas.getContext("2d")
  if (!ctx) return undefined

  // sentinel: lets us detect whether the browser accepted the value
  const SENTINEL = "#03fca5"
  ctx.fillStyle = SENTINEL

  // 1. Try the raw value as-is (handles oklch, hsl(), rgb(), hex, etc.)
  ctx.fillStyle = raw
  if (ctx.fillStyle !== SENTINEL) return ctx.fillStyle

  // 2. Bare HSL numbers (e.g. "222 47% 11%") – legacy shadcn themes
  ctx.fillStyle = SENTINEL
  ctx.fillStyle = `hsl(${raw})`
  if (ctx.fillStyle !== SENTINEL) return ctx.fillStyle

  // 3. Last resort: use a temporary DOM element (browser always resolves to rgb)
  const el = document.createElement("div")
  el.style.display = "none"
  el.style.color = raw
  document.body.appendChild(el)
  const resolved = getComputedStyle(el).color
  el.remove()
  const rgbMatch = resolved.match(/rgba?\(\s*([\d.]+),?\s*([\d.]+),?\s*([\d.]+)/)
  if (rgbMatch) {
    const r = Math.round(parseFloat(rgbMatch[1]))
    const g = Math.round(parseFloat(rgbMatch[2]))
    const b = Math.round(parseFloat(rgbMatch[3]))
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`
  }

  return undefined
}

type DiceResult = Awaited<ReturnType<DiceBox["roll"]>>[number]

/** Default vivid dice colors – exported so consumers can reuse them. */
export const DICE_COLOR_BLUE = "#1E90FF"
export const DICE_COLOR_RED  = "#E53935"

export type DiceRollerResult = {
  d1: number
  d2: number
}

export type DiceRollerRoll = {
  dice: string
  values: number[]
}

export type DiceRollerHandle = {
  roll: (diceOverride?: string) => Promise<void>
  ready: boolean
  rolling: boolean
}

interface DiceRollerProps {
  /** Legacy callback for 2d6-style usage (kept for backward compatibility). */
  onResult?: (result: DiceRollerResult) => void

  /** Generic callback for any dice/quantity. */
  onRoll?: (result: DiceRollerRoll) => void

  onStateChange?: (state: { ready: boolean; rolling: boolean }) => void

  /** Dice notation like "2d6", "4d8", "1d20". */
  dice?: string
  /** Convenience: if provided with sides, builds dice as `${count}d${sides}` (ignored when dice is set). */
  count?: number
  sides?: number

  /** When true and rolling 2d6, roll two distinguishable dice: Azul (primary) and Rojo (destructive). */
  distinguishable?: boolean

  showButton?: boolean
  buttonLabel?: string
  height?: number | string
  scale?: number
  framed?: boolean
  className?: string
}

const DiceRoller = forwardRef<DiceRollerHandle, DiceRollerProps>(
  (
    {
      onResult,
      onRoll,
      onStateChange,
      dice,
      count,
      sides,
      distinguishable = false,
      showButton = true,
      buttonLabel = "Roll Dice",
      height = 520,
      scale,
      framed = true,
      className,
    },
    ref
  ) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const diceBoxRef = useRef<DiceBox | null>(null)
  const [ready, setReady] = useState(false)
  const [rolling, setRolling] = useState(false)
  const containerId = useId()

  const primaryThemeColor = useMemo(() => cssVarToHex("--primary"), [])
  const destructiveThemeColor = useMemo(() => cssVarToHex("--destructive"), [])

  // Vivid colors for distinguishable dice – theme vars are too muted for 3D objects
  const VIVID_BLUE = "#1E90FF"
  const VIVID_RED  = "#E53935"

  const resolvedDice = useMemo(() => {
    if (typeof dice === "string" && dice.trim() !== "") return dice.trim()
    if (typeof count === "number" && typeof sides === "number" && count > 0 && sides > 0) {
      return `${count}d${sides}`
    }
    return "2d6"
  }, [count, dice, sides])

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (diceBoxRef.current) return

      // Avoid multiple canvases when React StrictMode remounts in dev.
      const container = containerRef.current
      if (container) container.innerHTML = ""

      const containerWidth =
        container?.getBoundingClientRect().width ??
        (typeof window !== "undefined" ? window.innerWidth : 1024)

      const autoScale = Math.max(6, Math.min(10, Math.round(containerWidth / 60)))
      const resolvedScale = typeof scale === "number" ? scale : autoScale

      const box = new DiceBox({
        container: `#${containerId}`,
        assetPath: "/assets/",
        theme: "default",
        themeColor: primaryThemeColor,
        gravity: 9.81,
        strength: 1,
        scale: resolvedScale,
        lightIntensity: 1,
        throwForce: 1,
      })
      diceBoxRef.current = box

      try {
        await box.init()
        if (!cancelled) setReady(true)
      } catch {
        // Keep component mounted even if init fails.
        if (!cancelled) setReady(false)
      }
    }

    init()

    return () => {
      cancelled = true
      setReady(false)
      diceBoxRef.current = null
    }
  }, [containerId, primaryThemeColor, scale])

  useEffect(() => {
    onStateChange?.({ ready, rolling })
  }, [onStateChange, ready, rolling])

  const handleRoll = useCallback(async (diceOverride?: string) => {
    if (!ready || !diceBoxRef.current || rolling) return

    const usedDice = typeof diceOverride === "string" && diceOverride.trim() !== ""
      ? diceOverride.trim()
      : resolvedDice

    const isTwoD6 = usedDice === "2d6"
    const shouldUseDistinctDice = distinguishable && isTwoD6 && !diceOverride

    try {
      setRolling(true)
      let result: DiceResult[]
      if (shouldUseDistinctDice) {
        try {
          result = await diceBoxRef.current.roll(
            [
              { qty: 1, sides: 6, themeColor: distinguishable ? VIVID_BLUE : primaryThemeColor }, // Azul
              { qty: 1, sides: 6, themeColor: distinguishable ? VIVID_RED : destructiveThemeColor }, // Rojo
            ],
            { newStartPoint: true }
          )
        } catch {
          // Fallback to non-distinct roll if the notation isn't supported by the runtime library.
          result = await diceBoxRef.current.roll(usedDice, {
            themeColor: primaryThemeColor,
          })
        }
      } else {
        result = await diceBoxRef.current.roll(usedDice, {
          themeColor: primaryThemeColor,
        })
      }
      console.log("Dice roll result:", result)

      const values = (result as DiceResult[])
        .map((d) => d.value)
        .filter((v) => typeof v === "number")
      onRoll?.({ dice: usedDice, values })

      // Legacy 2-value callback.
      if (values.length >= 2) {
        if (shouldUseDistinctDice) {
          const normalize = (c?: string) => (c ?? "").trim().toLowerCase().replace(/\s+/g, "")
          const blueTarget = distinguishable ? VIVID_BLUE : primaryThemeColor
          const redTarget = distinguishable ? VIVID_RED : destructiveThemeColor
          const blue = (result as DiceResult[]).find(
            (d) => normalize(d.themeColor as string | undefined) === normalize(blueTarget)
          )
          const red = (result as DiceResult[]).find(
            (d) => normalize(d.themeColor as string | undefined) === normalize(redTarget)
          )

          const d1 = typeof blue?.value === "number" ? blue.value : values[0]
          const d2 = typeof red?.value === "number" ? red.value : values[1]
          onResult?.({ d1, d2 })
        } else {
          onResult?.({ d1: values[0], d2: values[1] })
        }
      }
    } finally {
      setRolling(false)
    }
  }, [distinguishable, destructiveThemeColor, onResult, onRoll, primaryThemeColor, ready, resolvedDice, rolling])

  useImperativeHandle(
    ref,
    () => ({
      roll: handleRoll,
      ready,
      rolling,
    }),
    [handleRoll, ready, rolling]
  )

  const resolvedHeight = typeof height === "number" ? `${height}px` : height

  return (
    <>
      <div className={className ?? "w-full"}>
        <div
          className={
            framed
              ? "relative w-full overflow-hidden rounded-xl border border-primary/30 bg-primary/5"
              : "relative w-full overflow-hidden"
          }
          style={{ height: resolvedHeight }}
        >
          <div ref={containerRef} id={containerId} className="relative h-full w-full"></div>
        </div>

        {showButton ? (
          <div className="mt-3 flex w-full flex-col items-center gap-2">
            <Button onClick={() => void handleRoll()} disabled={!ready || rolling}>
              {!ready ? "Loading..." : rolling ? "Rolling..." : buttonLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </>
  )
  }
)

DiceRoller.displayName = "DiceRoller"

export default DiceRoller