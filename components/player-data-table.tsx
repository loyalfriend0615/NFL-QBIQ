"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import { playerData } from "@/lib/player-data"

export function PlayerDataTable() {
  const [position, setPosition] = useState("WR")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter players by position and search query
  const filteredPlayers = playerData.filter(
    (player) =>
      player.position === position &&
      (searchQuery === "" ||
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.team.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Sort players by overall rating (descending)
  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.overallRating - a.overallRating)

  // Handle CSV export
  const handleExport = () => {
    // In a real implementation, this would generate and download a CSV file
    alert("In a real implementation, this would download the data as a CSV file")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">2024 {position} Performance Data</CardTitle>
            <CardDescription>Detailed metrics for all {position}s</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search players or teams..."
                className="pl-8 w-[200px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QB">Quarterbacks</SelectItem>
                <SelectItem value="RB">Running Backs</SelectItem>
                <SelectItem value="WR">Wide Receivers</SelectItem>
                <SelectItem value="TE">Tight Ends</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Player</TableHead>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">Man Sep.</TableHead>
                <TableHead className="text-right">Zone Sep.</TableHead>
                <TableHead className="text-right">Catch Rate</TableHead>
                <TableHead className="text-right">YPR</TableHead>
                <TableHead className="text-right">Target %</TableHead>
                <TableHead className="text-right">RZ Targets</TableHead>
                <TableHead className="text-right">Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player) => (
                <TableRow key={player.id}>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.team}</TableCell>
                  <TableCell className="text-right">{player.manSeparation.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{player.zoneSeparation.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{player.catchRate.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{player.yardsPerRoute.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{player.targetShare.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{player.redZoneTargets}</TableCell>
                  <TableCell className="text-right font-medium">{player.overallRating.toFixed(1)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

