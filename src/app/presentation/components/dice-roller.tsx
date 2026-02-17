
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

type DiceRollerResult = {
  d1: number
  d2: number
}

export type DiceRollerHandle = {
  roll: () => Promise<void>
  ready: boolean
  rolling: boolean
}

interface DiceRollerProps {
  onResult?: (result: DiceRollerResult) => void

  onStateChange?: (state: { ready: boolean; rolling: boolean }) => void

  showButton?: boolean
  buttonLabel?: string
  height?: number | string
  framed?: boolean
  className?: string
}

const DiceRoller = forwardRef<DiceRollerHandle, DiceRollerProps>(
  (
    {
      onResult,
      onStateChange,
      showButton = true,
      buttonLabel = "Roll Dice",
      height = 520,
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

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (diceBoxRef.current) return

      // Avoid multiple canvases when React StrictMode remounts in dev.
      const container = containerRef.current
      if (container) container.innerHTML = ""

      const box = new DiceBox({
        container: `#${containerId}`,
        assetPath: "/assets/",
        theme: "default",
        themeColor,
        gravity: 9.81,
        strength: 1,
        scale: 20,
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
  }, [themeColor])

  useEffect(() => {
    onStateChange?.({ ready, rolling })
  }, [onStateChange, ready, rolling])

  const handleRoll = useCallback(async () => {
    if (!ready || !diceBoxRef.current || rolling) return

    try {
      setRolling(true)
      const result = await diceBoxRef.current.roll("2d6", {
        themeColor,
      })
      console.log("Dice roll result:", result)

      const [d1, d2] = (result as DiceResult[]).map((d) => d.value)
      if (typeof d1 === "number" && typeof d2 === "number") {
        onResult?.({ d1, d2 })
      } else {
        console.warn("Unexpected dice result shape:", result)
      }
    } finally {
      setRolling(false)
    }
  }, [onResult, ready, rolling, themeColor])

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
            <Button onClick={handleRoll} disabled={!ready || rolling}>
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