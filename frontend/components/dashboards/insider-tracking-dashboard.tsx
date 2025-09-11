"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Building, Users, TrendingUp, TrendingDown, AlertTriangle, ExternalLink } from "lucide-react"

interface InsiderTrackingDashboardProps {
  marketView: string
  timescale?: string
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 text-white p-3 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
        <p className="font-medium mb-2 leading-tight">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm leading-tight" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const generateTimeLabels = (timescale: string, dataLength: number) => {
  const now = new Date()
  const labels = []

  switch (timescale) {
    case "1h":
    case "6h":
    case "12h":
    case "1d":
      for (let i = dataLength - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        labels.unshift(date.toLocaleDateString("en-US", { weekday: "short" }))
      }
      break
    case "3d":
    case "5d":
    case "7d":
    case "14d":
      for (let i = dataLength - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
        labels.unshift(`Week ${dataLength - i}`)
      }
      break
    case "1m":
    case "3m":
    case "6m":
      for (let i = dataLength - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000)
        labels.unshift(date.toLocaleDateString("en-US", { month: "short" }))
      }
      break
    case "1y":
    case "2y":
    case "3y":
    case "4y":
    case "5y":
    case "7y":
    case "10y":
    case "max":
      for (let i = dataLength - 1; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 90 * 24 * 60 * 60 * 1000)
        labels.unshift(`Q${dataLength - i}`)
      }
      break
    default:
      return ["Sep", "Oct", "Nov", "Dec", "Jan"]
  }

  return labels
}

const congressTrades = [
  {
    id: 1,
    name: "Nancy Pelosi",
    party: "D",
    position: "House Speaker",
    symbol: "NVDA",
    action: "Buy",
    amount: "$1M-$5M",
    date: "2024-01-15",
    disclosure: "2024-01-20",
    performance: "+12.5%",
  },
  {
    id: 2,
    name: "Dan Crenshaw",
    party: "R",
    position: "Representative",
    symbol: "TSLA",
    action: "Sell",
    amount: "$500K-$1M",
    date: "2024-01-12",
    disclosure: "2024-01-18",
    performance: "-3.2%",
  },
  {
    id: 3,
    name: "Josh Gottheimer",
    party: "D",
    position: "Representative",
    symbol: "MSFT",
    action: "Buy",
    amount: "$250K-$500K",
    date: "2024-01-10",
    disclosure: "2024-01-16",
    performance: "+8.1%",
  },
]

const executiveTrades = [
  {
    id: 1,
    name: "Tim Cook",
    company: "Apple Inc.",
    position: "CEO",
    symbol: "AAPL",
    action: "Sell",
    shares: "511,000",
    value: "$87.8M",
    date: "2024-01-18",
    type: "Scheduled",
  },
  {
    id: 2,
    name: "Satya Nadella",
    company: "Microsoft Corp.",
    position: "CEO",
    symbol: "MSFT",
    action: "Sell",
    shares: "25,000",
    value: "$9.5M",
    date: "2024-01-16",
    type: "Scheduled",
  },
  {
    id: 3,
    name: "Jensen Huang",
    company: "NVIDIA Corp.",
    position: "CEO",
    symbol: "NVDA",
    action: "Sell",
    shares: "120,000",
    value: "$103.2M",
    date: "2024-01-14",
    type: "Scheduled",
  },
]

const insiderActivityData = [
  { month: "Sep", buys: 45, sells: 123, ratio: 0.37 },
  { month: "Oct", buys: 52, sells: 134, ratio: 0.39 },
  { month: "Nov", buys: 38, sells: 156, ratio: 0.24 },
  { month: "Dec", buys: 67, sells: 145, ratio: 0.46 },
  { month: "Jan", buys: 78, sells: 132, ratio: 0.59 },
]

const sectorInsiderActivity = [
  { sector: "Technology", buys: 23, sells: 67, net: -44 },
  { sector: "Healthcare", buys: 18, sells: 34, net: -16 },
  { sector: "Financial", buys: 15, sells: 28, net: -13 },
  { sector: "Energy", buys: 12, sells: 19, net: -7 },
  { sector: "Consumer", buys: 10, sells: 15, net: -5 },
]

export function InsiderTrackingDashboard({ marketView, timescale = "1m" }: InsiderTrackingDashboardProps) {
  const timeLabels = generateTimeLabels(timescale, insiderActivityData.length)
  const updatedInsiderActivityData = insiderActivityData.map((item, index) => ({
    ...item,
    month: timeLabels[index],
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">Insider Tracking & Analysis</h2>
        <p className="text-muted-foreground">
          Monitor insider trading activity from Congress members and corporate executives - {timescale.toUpperCase()}{" "}
          view
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Congress Trades</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Building className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-sm">+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Executive Trades</p>
                <p className="text-2xl font-bold">132</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-red-600">
              <TrendingDown className="h-3 w-3" />
              <span className="text-sm">-8% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Buy/Sell Ratio</p>
                <p className="text-2xl font-bold">0.59</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">More buying activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alert Level</p>
                <p className="text-2xl font-bold text-amber-600">Medium</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unusual activity detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trades */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Recent Insider Trades</CardTitle>
              <CardDescription>Latest trading activity from Congress and executives</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="congress" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="congress">Congress</TabsTrigger>
                  <TabsTrigger value="executives">Executives</TabsTrigger>
                </TabsList>

                <TabsContent value="congress" className="space-y-3 mt-4">
                  {congressTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {trade.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{trade.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {trade.position} ({trade.party})
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge variant={trade.action === "Buy" ? "default" : "destructive"}>
                          {trade.action} {trade.symbol}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">{trade.amount}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm">{trade.date}</div>
                        <div className="text-xs text-muted-foreground">Disclosed: {trade.disclosure}</div>
                      </div>
                      <div
                        className={`text-sm font-medium ${trade.performance.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                      >
                        {trade.performance}
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="executives" className="space-y-3 mt-4">
                  {executiveTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {trade.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{trade.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {trade.position}, {trade.company}
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge variant={trade.action === "Buy" ? "default" : "destructive"}>
                          {trade.action} {trade.symbol}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-1">{trade.shares} shares</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{trade.value}</div>
                        <div className="text-xs text-muted-foreground">{trade.date}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {trade.type}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Activity Charts */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Insider Activity Trend</CardTitle>
              <CardDescription>Monthly buy/sell activity - {timescale.toUpperCase()} timeframe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={updatedInsiderActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="buys" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="sells" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-serif">Sector Activity</CardTitle>
              <CardDescription>Net insider activity by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectorInsiderActivity} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="sector" type="category" width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="net" fill="hsl(var(--chart-3))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
