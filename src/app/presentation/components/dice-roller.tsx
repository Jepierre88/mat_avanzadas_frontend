
import DiceBox from "@3d-dice/dice-box"
import "@3d-dice/dice-box/dist/style.css"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

export default function DiceRoller() {
  const containerRef = useRef<HTMLDivElement>(null)
  const diceBoxRef = useRef<DiceBox | null>(null)
  const [ready, setReady] = useState(false)

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

      const box = new DiceBox("#dice-container", {
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

  const handleRoll = () => {
    if (ready && diceBoxRef.current) {
      diceBoxRef.current.roll("2d6", { themeColor })
    }
  }

  return (
    <>
      <div className="w-full">
        <div
          className="relative w-full overflow-hidden rounded-xl border border-primary/30 bg-primary/5"
          style={{ height: "520px" }}
        >
          <div
            ref={containerRef}
            id="dice-container"
            className="relative h-full w-full"
          ></div>
        </div>

        <div className="mt-3 flex w-full justify-center">
        <Button onClick={handleRoll} disabled={!ready}>
          {ready ? "Roll Dice" : "Loading..."}
        </Button>
        </div>
      </div>
    </>
  )
}