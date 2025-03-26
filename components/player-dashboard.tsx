"use client"

import { useState } from "react"
import { PlayerQuadrantChart } from "@/components/player-quadrant-chart"
import { PlayerRadarChart } from "@/components/player-radar-chart"
import { PlayerSortedTable } from "@/components/player-sorted-table"
import { playerData } from "@/lib/player-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PlayerDashboard() {
  const [position, setPosition] = useState("WR")
  const [xMetric, setXMetric] = useState(position === "QB" ? "avgDepthOfTarget" : "manSeparation")
  const [yMetric, setYMetric] = useState(position === "QB" ? "shortCompletionPct" : "zoneSeparation")
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  // Filter players by selected position
  const filteredPlayers = playerData.filter((player) => player.position === position)

  // Get metric display names
  const getMetricName = (metric) => {
    const metricNames = {
      // WR metrics
      manSeparation: "Separation vs. Man Coverage",
      zoneSeparation: "Separation vs. Zone Coverage",
      catchRate: "Catch Rate",
      yardsPerRoute: "Yards Per Route Run",
      targetShare: "Target Share %",
      redZoneTargets: "Red Zone Targets",

      // QB metrics
      avgDepthOfTarget: "Avg. Depth of Target",
      shortCompletionPct: "Short Completion %",
      intermediateCompletionPct: "Intermediate Completion %",
      longCompletionPct: "Long Completion %",
      rushYardsPerAttempt: "Rush Yards Per Attempt",
      rushTdPct: "Rush TD %",

      // Common metrics
      overallRating: "Overall Rating",
    }
    return metricNames[metric] || metric
  }

  // Update metrics when position changes
  const handlePositionChange = (newPosition) => {
    setPosition(newPosition)

    // Set default metrics based on position
    if (newPosition === "QB") {
      setXMetric("avgDepthOfTarget")
      setYMetric("shortCompletionPct")
    } else if (newPosition === "WR") {
      setXMetric("manSeparation")
      setYMetric("zoneSeparation")
    } else if (newPosition === "RB") {
      setXMetric("yardsPerCarry")
      setYMetric("receptions")
    } else if (newPosition === "TE") {
      setXMetric("catchRate")
      setYMetric("redZoneTargets")
    }

    // Reset selected player when changing positions
    setSelectedPlayer(null)
  }

  // Get available metrics based on position
  const getAvailableMetrics = () => {
    if (position === "QB") {
      return [
        { value: "avgDepthOfTarget", label: "Avg. Depth of Target" },
        { value: "shortCompletionPct", label: "Short Completion %" },
        { value: "intermediateCompletionPct", label: "Intermediate Completion %" },
        { value: "longCompletionPct", label: "Long Completion %" },
        { value: "rushYardsPerAttempt", label: "Rush Yards Per Attempt" },
        { value: "rushTdPct", label: "Rush TD %" },
        { value: "overallRating", label: "Overall Rating" },
      ]
    } else if (position === "WR") {
      return [
        { value: "manSeparation", label: "Man Separation" },
        { value: "zoneSeparation", label: "Zone Separation" },
        { value: "catchRate", label: "Catch Rate" },
        { value: "yardsPerRoute", label: "Yards Per Route" },
        { value: "targetShare", label: "Target Share %" },
        { value: "redZoneTargets", label: "Red Zone Targets" },
        { value: "overallRating", label: "Overall Rating" },
      ]
    } else {
      // Default metrics for other positions
      return [{ value: "overallRating", label: "Overall Rating" }]
    }
  }

  const availableMetrics = getAvailableMetrics()

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 p-4 bg-background border-b">
        <Select value={position} onValueChange={handlePositionChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Position" />
          </SelectTrigger>
          <SelectContent className="min-w-[180px]">
            <SelectItem value="QB">Quarterbacks</SelectItem>
            <SelectItem value="RB">Running Backs</SelectItem>
            <SelectItem value="WR">Wide Receivers</SelectItem>
            <SelectItem value="TE">Tight Ends</SelectItem>
          </SelectContent>
        </Select>

        <Select value={xMetric} onValueChange={setXMetric}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="X-Axis Metric" />
          </SelectTrigger>
          <SelectContent className="min-w-[220px]">
            {availableMetrics.map((metric) => (
              <SelectItem key={metric.value} value={metric.value}>
                {metric.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={yMetric} onValueChange={setYMetric}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Y-Axis Metric" />
          </SelectTrigger>
          <SelectContent className="min-w-[220px]">
            {availableMetrics.map((metric) => (
              <SelectItem key={metric.value} value={metric.value}>
                {metric.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Left half - Quadrant Chart */}
        <div className="lg:col-span-1">
          <PlayerQuadrantChart
            players={filteredPlayers}
            position={position}
            xMetric={xMetric}
            yMetric={yMetric}
            getMetricName={getMetricName}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        </div>

        {/* Right half - Radar Chart */}
        <div className="lg:col-span-1">
          <PlayerRadarChart
            players={filteredPlayers}
            selectedPlayer={selectedPlayer}
            getMetricName={getMetricName}
            position={position}
          />
        </div>
      </div>

      {/* Full width - Sorted Table */}
      <div className="p-4">
        <PlayerSortedTable
          players={filteredPlayers}
          xMetric={xMetric}
          yMetric={yMetric}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
          position={position}
        />
      </div>
    </div>
  )
}

