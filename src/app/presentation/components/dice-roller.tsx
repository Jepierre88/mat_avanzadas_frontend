
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

type DiceResult = Awaited<ReturnType<DiceBox["roll"]>>[number]

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

  const themeColor = useMemo(() => {
    if (typeof window === "undefined") return undefined
    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim()
    if (!primary) return undefined

    const color = primary.startsWith("hsl(") ? primary : `hsl(${primary})`
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return undefined
    ctx.fillStyle = color
    return String(ctx.fillStyle)
  }, [])

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

      const autoScale = Math.max(12, Math.min(20, Math.round(containerWidth / 34)))
      const resolvedScale = typeof scale === "number" ? scale : autoScale

      const box = new DiceBox({
        container: `#${containerId}`,
        assetPath: "/assets/",
        theme: "default",
        themeColor,
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
  }, [containerId, scale, themeColor])

  useEffect(() => {
    onStateChange?.({ ready, rolling })
  }, [onStateChange, ready, rolling])

  const handleRoll = useCallback(async (diceOverride?: string) => {
    if (!ready || !diceBoxRef.current || rolling) return

    const usedDice = typeof diceOverride === "string" && diceOverride.trim() !== ""
      ? diceOverride.trim()
      : resolvedDice

    try {
      setRolling(true)
      const result = await diceBoxRef.current.roll(usedDice, {
        themeColor,
      })
      console.log("Dice roll result:", result)

      const values = (result as DiceResult[]).map((d) => d.value).filter((v) => typeof v === "number")
      onRoll?.({ dice: usedDice, values })

      // Legacy 2-value callback.
      if (values.length >= 2) {
        onResult?.({ d1: values[0], d2: values[1] })
      }
    } finally {
      setRolling(false)
    }
  }, [onResult, onRoll, ready, resolvedDice, rolling, themeColor])

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