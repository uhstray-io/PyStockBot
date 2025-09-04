"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Slider } from "@/components/ui/slider"

export interface TimescaleOption {
  value: string
  label: string
  category: "intraday" | "short" | "medium" | "long"
}

export const timescaleOptions: TimescaleOption[] = [
  { value: "1h", label: "1 Hour", category: "intraday" },
  { value: "6h", label: "6 Hours", category: "intraday" },
  { value: "12h", label: "12 Hours", category: "intraday" },
  { value: "1d", label: "1 Day", category: "short" },
  { value: "3d", label: "3 Days", category: "short" },
  { value: "5d", label: "5 Days", category: "short" },
  { value: "7d", label: "1 Week", category: "short" },
  { value: "14d", label: "2 Weeks", category: "short" },
  { value: "1m", label: "1 Month", category: "medium" },
  { value: "3m", label: "3 Months", category: "medium" },
  { value: "6m", label: "6 Months", category: "medium" },
  { value: "1y", label: "1 Year", category: "long" },
  { value: "2y", label: "2 Years", category: "long" },
  { value: "3y", label: "3 Years", category: "long" },
  { value: "4y", label: "4 Years", category: "long" },
  { value: "5y", label: "5 Years", category: "long" },
  { value: "7y", label: "7 Years", category: "long" },
  { value: "10y", label: "10 Years", category: "long" },
  { value: "max", label: "Max", category: "long" },
]

interface TimescaleSelectorProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function TimescaleSelector({ value, onValueChange, className }: TimescaleSelectorProps) {
  const [tooltipPosition, setTooltipPosition] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)
  const currentIndex = timescaleOptions.findIndex((option) => option.value === value)

  const handleSliderChange = (values: number[]) => {
    const index = values[0]
    const selectedOption = timescaleOptions[index]
    onValueChange(selectedOption.value)
    setTooltipPosition(index)
  }

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect()
      const percentage = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
      const index = Math.round(percentage * (timescaleOptions.length - 1))
      setTooltipPosition(index)
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <div className={`relative ${className}`}>
      {isHovering && (
        <div
          className="absolute -top-12 bg-gray-900/95 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap z-10 leading-tight transform -translate-x-1/2 transition-all duration-150"
          style={{
            left: `${(tooltipPosition / (timescaleOptions.length - 1)) * 100}%`,
          }}
        >
          {timescaleOptions[tooltipPosition]?.label}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95"></div>
        </div>
      )}

      <div
        className="px-2 py-2"
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Slider
          value={[currentIndex]}
          onValueChange={handleSliderChange}
          max={timescaleOptions.length - 1}
          min={0}
          step={1}
          className="w-full"
        />

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{timescaleOptions[0].value}</span>
          <span className="text-center font-medium">Timeframe</span>
          <span>{timescaleOptions[timescaleOptions.length - 1].value}</span>
        </div>
      </div>
    </div>
  )
}
