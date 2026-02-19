import { useCallback, useRef, useState } from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  /** Current hex colour value (e.g. "#1E90FF"). */
  value: string;
  /** Called with the new hex string on every change. */
  onChange: (color: string) => void;
  /** Optional label rendered next to the swatch. */
  label?: string;
  /** Extra classes for the trigger wrapper. */
  className?: string;
}

/** Preset swatches for quick selection. */
const PRESETS = [
  "#E53935", // red
  "#D81B60", // pink
  "#8E24AA", // purple
  "#5E35B1", // deep purple
  "#1E88E5", // blue
  "#1E90FF", // dodger blue
  "#00ACC1", // cyan
  "#00897B", // teal
  "#43A047", // green
  "#7CB342", // light green
  "#FDD835", // yellow
  "#FB8C00", // orange
  "#6D4C41", // brown
  "#546E7A", // blue-grey
  "#FFFFFF", // white
  "#000000", // black
] as const;

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handlePreset = useCallback(
    (c: string) => {
      onChange(c);
    },
    [onChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          className={cn(
            "flex h-9 items-center gap-2 px-3",
            className,
          )}
        >
          <span
            className="inline-block h-5 w-5 shrink-0 rounded-sm border"
            style={{ backgroundColor: value }}
          />
          {label && <span className="text-sm font-medium">{label}</span>}
          <span className="ml-auto font-mono text-xs text-muted-foreground uppercase">
            {value}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3" align="start" sideOffset={8}>
        <div className="flex flex-col gap-3">
          {/* Colour picker area */}
          <HexColorPicker
            color={value}
            onChange={onChange}
            style={{ width: "100%" }}
          />

          {/* Hex input */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">HEX</span>
            <HexColorInput
              color={value}
              onChange={onChange}
              prefixed
              className="h-8 flex-1 rounded-md border bg-transparent px-2 font-mono text-sm uppercase outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Preset swatches */}
          <div className="grid grid-cols-8 gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                className={cn(
                  "h-6 w-6 rounded-sm border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                  value.toLowerCase() === preset.toLowerCase() && "ring-2 ring-ring ring-offset-1",
                )}
                style={{ backgroundColor: preset }}
                onClick={() => handlePreset(preset)}
                aria-label={`Seleccionar color ${preset}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
