"use client"

import { TableHeader } from "@/components/ui/table"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, ArrowUpDown } from "lucide-react"

export function PlayerSortedTable({ players, xMetric, yMetric, selectedPlayer, setSelectedPlayer, position }) {
  const [sortMetric, setSortMetric] = useState("overallRating")
  const [sortDirection, setSortDirection] = useState("desc")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter players by search query
  const filteredPlayers = useMemo(() => {
    return players.filter(
      (player) =>
        searchQuery === "" ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [players, searchQuery])

  // Sort players by selected metric
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      const aValue = a[sortMetric]
      const bValue = b[sortMetric]

      if (sortDirection === "asc") {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    })
  }, [filteredPlayers, sortMetric, sortDirection])

  // Toggle sort direction
  const toggleSort = (metric) => {
    if (sortMetric === metric) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortMetric(metric)
      setSortDirection("desc")
    }
  }

  // Handle player selection
  const handlePlayerSelect = (playerId) => {
    setSelectedPlayer(playerId === selectedPlayer ? null : playerId)
  }

  // Format metric value for display
  const formatMetricValue = (value, metric) => {
    if (value === undefined || value === null) {
      return "N/A"
    }

    // Format based on metric type
    if (
      metric === "catchRate" ||
      metric === "targetShare" ||
      metric === "shortCompletionPct" ||
      metric === "intermediateCompletionPct" ||
      metric === "longCompletionPct" ||
      metric === "rushTdPct"
    ) {
      return `${value.toFixed(1)}%`
    } else if (metric === "redZoneTargets" || metric.includes("Touchdowns") || metric.includes("Receptions")) {
      return Math.round(value)
    } else {
      return value.toFixed(2)
    }
  }

  // Get column headers based on position
  const getColumnHeaders = () => {
    if (position === "QB") {
      return [
        { key: "avgDepthOfTarget", label: "Avg. DepthTarget" },
        { key: "shortCompletionPct", label: "Short %" },
        { key: "intermediateCompletionPct", label: "Mid %" },
        { key: "longCompletionPct", label: "Long %" },
        { key: "rushYardsPerAttempt", label: "Rush YPA" },
        { key: "rushTdPct", label: "Rush TD" },
      ]
    } else {
      // Default to WR metrics
      return [
        { key: "catchRate", label: "Catch %" },
        { key: "yardsPerRoute", label: "YPR" },
        { key: "targetShare", label: "Target %" },
      ]
    }
  }

  const columnHeaders = getColumnHeaders()

  // Get sort options based on position
  const getSortOptions = () => {
    if (position === "QB") {
      return [
        { value: "overallRating", label: "Overall Rating" },
        { value: "avgDepthOfTarget", label: "Avg. Depth of Target" },
        { value: "shortCompletionPct", label: "Short Completion %" },
        { value: "intermediateCompletionPct", label: "Intermediate Completion %" },
        { value: "longCompletionPct", label: "Long Completion %" },
        { value: "rushYardsPerAttempt", label: "Rush Yards Per Attempt" },
        { value: "rushTdPct", label: "Rush TD %" },
      ]
    } else {
      return [
        { value: "overallRating", label: "Overall Rating" },
        { value: "manSeparation", label: "Man Separation" },
        { value: "zoneSeparation", label: "Zone Separation" },
        { value: "catchRate", label: "Catch Rate" },
        { value: "yardsPerRoute", label: "Yards Per Route" },
        { value: "targetShare", label: "Target Share" },
        { value: "redZoneTargets", label: "Red Zone Targets" },
      ]
    }
  }

  const sortOptions = getSortOptions()

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-xl">Player Rankings</CardTitle>
            <CardDescription>
              Sorted by {sortMetric} ({sortDirection === "desc" ? "highest first" : "lowest first"})
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-[150px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={sortMetric} onValueChange={setSortMetric}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="min-w-[200px]">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="max-h-[300px] overflow-y-auto overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead className="w-[200px]">Player</TableHead>
                  <TableHead className="w-[80px]">Team</TableHead>

                  {/* Display columns in the specified order for QBs */}
                  {position === "QB" ? (
                    <>
                      <TableHead
                        className="text-right cursor-pointer w-[120px]"
                        onClick={() => toggleSort("avgDepthOfTarget")}
                      >
                        <div className="flex items-center justify-end">
                          Avg. DepthTarget
                          {sortMetric === "avgDepthOfTarget" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer w-[90px]"
                        onClick={() => toggleSort("shortCompletionPct")}
                      >
                        <div className="flex items-center justify-end">
                          Short %{sortMetric === "shortCompletionPct" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer w-[90px]"
                        onClick={() => toggleSort("intermediateCompletionPct")}
                      >
                        <div className="flex items-center justify-end">
                          Mid %{sortMetric === "intermediateCompletionPct" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer w-[90px]"
                        onClick={() => toggleSort("longCompletionPct")}
                      >
                        <div className="flex items-center justify-end">
                          Long %{sortMetric === "longCompletionPct" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>
                      <TableHead
                        className="text-right cursor-pointer w-[90px]"
                        onClick={() => toggleSort("rushYardsPerAttempt")}
                      >
                        <div className="flex items-center justify-end">
                          Rush YPA
                          {sortMetric === "rushYardsPerAttempt" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer w-[90px]" onClick={() => toggleSort("rushTdPct")}>
                        <div className="flex items-center justify-end">
                          Rush TD
                          {sortMetric === "rushTdPct" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead className="text-right cursor-pointer w-[90px]" onClick={() => toggleSort(xMetric)}>
                        <div className="flex items-center justify-end">
                          {xMetric.charAt(0).toUpperCase() + xMetric.slice(1, 3)}
                          {sortMetric === xMetric && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>
                      <TableHead className="text-right cursor-pointer w-[90px]" onClick={() => toggleSort(yMetric)}>
                        <div className="flex items-center justify-end">
                          {yMetric.charAt(0).toUpperCase() + yMetric.slice(1, 3)}
                          {sortMetric === yMetric && <ArrowUpDown className="ml-1 h-3 w-3" />}
                        </div>
                      </TableHead>

                      {/* Dynamic columns based on position */}
                      {columnHeaders.map((header) =>
                        header.key !== xMetric && header.key !== yMetric ? (
                          <TableHead
                            key={header.key}
                            className="text-right cursor-pointer w-[90px]"
                            onClick={() => toggleSort(header.key)}
                          >
                            <div className="flex items-center justify-end">
                              {header.label}
                              {sortMetric === header.key && <ArrowUpDown className="ml-1 h-3 w-3" />}
                            </div>
                          </TableHead>
                        ) : null,
                      )}
                    </>
                  )}

                  <TableHead className="text-right cursor-pointer w-[80px]" onClick={() => toggleSort("overallRating")}>
                    <div className="flex items-center justify-end">
                      Rating
                      {sortMetric === "overallRating" && <ArrowUpDown className="ml-1 h-3 w-3" />}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPlayers.map((player, index) => (
                  <TableRow
                    key={player.id}
                    className={`cursor-pointer ${player.id === selectedPlayer ? "bg-emerald-50 dark:bg-emerald-950" : ""}`}
                    onClick={() => handlePlayerSelect(player.id)}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.team}</TableCell>

                    {/* Display data in the specified order for QBs */}
                    {position === "QB" ? (
                      <>
                        <TableCell className="text-right">
                          {formatMetricValue(player.avgDepthOfTarget, "avgDepthOfTarget")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatMetricValue(player.shortCompletionPct, "shortCompletionPct")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatMetricValue(player.intermediateCompletionPct, "intermediateCompletionPct")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatMetricValue(player.longCompletionPct, "longCompletionPct")}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatMetricValue(player.rushYardsPerAttempt, "rushYardsPerAttempt")}
                        </TableCell>
                        <TableCell className="text-right">{formatMetricValue(player.rushTdPct, "rushTdPct")}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="text-right">{formatMetricValue(player[xMetric], xMetric)}</TableCell>
                        <TableCell className="text-right">{formatMetricValue(player[yMetric], yMetric)}</TableCell>

                        {/* Dynamic data cells based on position */}
                        {columnHeaders.map((header) =>
                          header.key !== xMetric && header.key !== yMetric ? (
                            <TableCell key={header.key} className="text-right">
                              {formatMetricValue(player[header.key], header.key)}
                            </TableCell>
                          ) : null,
                        )}
                      </>
                    )}

                    <TableCell className="text-right font-medium">
                      {formatMetricValue(player.overallRating, "overallRating")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

