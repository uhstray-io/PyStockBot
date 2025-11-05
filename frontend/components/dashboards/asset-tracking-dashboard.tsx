"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Plus, Star, AlertTriangle } from "lucide-react"

interface AssetTrackingDashboardProps {
  marketView: string
  timescale?: string
}

const watchlistData = {
  "stocks-etf": [
    { symbol: "AAPL", name: "Apple Inc.", price: "$182.45", change: "+1.2%", trend: "up", alert: false },
    { symbol: "MSFT", name: "Microsoft Corp.", price: "$378.90", change: "+0.8%", trend: "up", alert: false },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: "$142.67", change: "-0.5%", trend: "down", alert: true },
    { symbol: "TSLA", name: "Tesla Inc.", price: "$248.32", change: "+2.1%", trend: "up", alert: false },
    { symbol: "SPY", name: "SPDR S&P 500 ETF", price: "$456.78", change: "+0.7%", trend: "up", alert: false },
  ],
  crypto: [
    { symbol: "BTC", name: "Bitcoin", price: "$43,567", change: "+2.4%", trend: "up", alert: false },
    { symbol: "ETH", name: "Ethereum", price: "$2,678", change: "+1.8%", trend: "up", alert: false },
    { symbol: "ADA", name: "Cardano", price: "$0.52", change: "-1.2%", trend: "down", alert: true },
    { symbol: "SOL", name: "Solana", price: "$98.45", change: "+3.5%", trend: "up", alert: false },
    { symbol: "MATIC", name: "Polygon", price: "$0.89", change: "+0.8%", trend: "up", alert: false },
  ],
  currency: [
    { symbol: "EUR/USD", name: "Euro to US Dollar", price: "1.0842", change: "+0.12%", trend: "up", alert: false },
    {
      symbol: "GBP/USD",
      name: "British Pound to US Dollar",
      price: "1.2567",
      change: "+0.05%",
      trend: "up",
      alert: false,
    },
    {
      symbol: "USD/JPY",
      name: "US Dollar to Japanese Yen",
      price: "149.23",
      change: "-0.08%",
      trend: "down",
      alert: true,
    },
    {
      symbol: "USD/CAD",
      name: "US Dollar to Canadian Dollar",
      price: "1.3456",
      change: "+0.03%",
      trend: "up",
      alert: false,
    },
  ],
  "assets-gold": [
    { symbol: "GOLD", name: "Gold Spot Price", price: "$2,034.50", change: "+0.8%", trend: "up", alert: false },
    { symbol: "SILVER", name: "Silver Spot Price", price: "$24.67", change: "-0.3%", trend: "down", alert: false },
    { symbol: "WTI", name: "Crude Oil WTI", price: "$78.45", change: "+1.2%", trend: "up", alert: false },
    { symbol: "COPPER", name: "Copper Futures", price: "$3.85", change: "+0.5%", trend: "up", alert: true },
  ],
  housing: [
    {
      symbol: "REIT",
      name: "Real Estate Investment Trust",
      price: "$89.45",
      change: "+0.3%",
      trend: "up",
      alert: false,
    },
    { symbol: "VNQ", name: "Vanguard Real Estate ETF", price: "$78.90", change: "+0.2%", trend: "up", alert: false },
    {
      symbol: "IYR",
      name: "iShares US Real Estate ETF",
      price: "$85.67",
      change: "-0.1%",
      trend: "down",
      alert: false,
    },
    { symbol: "MORT", name: "Mortgage REIT ETF", price: "$12.34", change: "-0.5%", trend: "down", alert: true },
  ],
  technology: [
    { symbol: "QQQ", name: "Invesco QQQ Trust", price: "$389.45", change: "+0.9%", trend: "up", alert: false },
    { symbol: "NVDA", name: "NVIDIA Corporation", price: "$478.23", change: "+2.1%", trend: "up", alert: false },
    { symbol: "AMD", name: "Advanced Micro Devices", price: "$145.67", change: "+1.5%", trend: "up", alert: false },
    { symbol: "CRM", name: "Salesforce Inc.", price: "$234.56", change: "-0.3%", trend: "down", alert: true },
  ],
  healthcare: [
    { symbol: "JNJ", name: "Johnson & Johnson", price: "$156.78", change: "+0.4%", trend: "up", alert: false },
    { symbol: "PFE", name: "Pfizer Inc.", price: "$34.56", change: "-0.2%", trend: "down", alert: false },
    { symbol: "UNH", name: "UnitedHealth Group", price: "$523.45", change: "+0.6%", trend: "up", alert: false },
    { symbol: "XBI", name: "SPDR S&P Biotech ETF", price: "$89.12", change: "-0.8%", trend: "down", alert: true },
  ],
  industrial: [
    { symbol: "CAT", name: "Caterpillar Inc.", price: "$267.89", change: "+0.7%", trend: "up", alert: false },
    { symbol: "BA", name: "Boeing Company", price: "$198.45", change: "-0.4%", trend: "down", alert: false },
    { symbol: "GE", name: "General Electric", price: "$123.56", change: "+0.3%", trend: "up", alert: false },
    {
      symbol: "XLI",
      name: "Industrial Select Sector SPDR",
      price: "$112.34",
      change: "+0.5%",
      trend: "up",
      alert: true,
    },
  ],
  "life-sciences": [
    { symbol: "GILD", name: "Gilead Sciences", price: "$78.90", change: "+0.5%", trend: "up", alert: false },
    { symbol: "AMGN", name: "Amgen Inc.", price: "$267.45", change: "+0.3%", trend: "up", alert: false },
    { symbol: "BIIB", name: "Biogen Inc.", price: "$234.67", change: "-0.7%", trend: "down", alert: false },
    { symbol: "IBB", name: "iShares Biotechnology ETF", price: "$123.45", change: "+0.2%", trend: "up", alert: true },
  ],
}

const getChartDataByTimescale = (timescale: string) => {
  const chartDataSets = {
    "1h": [
      { time: "9:30", value: 100 },
      { time: "9:45", value: 100.5 },
      { time: "10:00", value: 101.2 },
      { time: "10:15", value: 100.8 },
      { time: "10:30", value: 101.5 },
    ],
    "1d": [
      { time: "9:30", value: 100 },
      { time: "12:00", value: 101.2 },
      { time: "3:00", value: 100.8 },
      { time: "4:00", value: 101.5 },
    ],
    "1w": [
      { time: "Mon", value: 100 },
      { time: "Tue", value: 102 },
      { time: "Wed", value: 101 },
      { time: "Thu", value: 103 },
      { time: "Fri", value: 101.5 },
    ],
    "1m": [
      { time: "Week 1", value: 100 },
      { time: "Week 2", value: 102 },
      { time: "Week 3", value: 108 },
      { time: "Week 4", value: 101.5 },
    ],
    "1y": [
      { time: "Q1", value: 100 },
      { time: "Q2", value: 115 },
      { time: "Q3", value: 122 },
      { time: "Q4", value: 135 },
    ],
  }

  return chartDataSets[timescale as keyof typeof chartDataSets] || chartDataSets["1d"]
}

export function AssetTrackingDashboard({ marketView, timescale = "1d" }: AssetTrackingDashboardProps) {
  const watchlist = watchlistData[marketView as keyof typeof watchlistData] || watchlistData["stocks-etf"]
  const chartData = getChartDataByTimescale(timescale)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold mb-2">Asset & Symbol Tracking</h2>
          <p className="text-muted-foreground">
            Monitor your selected assets and symbols in real-time - {timescale.toUpperCase()} view
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input placeholder="Search symbols (e.g., AAPL, BTC, SPY)" className="flex-1" />
            <Button variant="outline">Search</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Watchlist */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Your Watchlist</CardTitle>
              <CardDescription>Track your selected assets and receive alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {watchlist.map((asset) => (
                  <div
                    key={asset.symbol}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Button variant="ghost" size="sm" className="p-1">
                        <Star className="h-4 w-4" />
                      </Button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{asset.symbol}</span>
                          {asset.alert && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        </div>
                        <span className="text-sm text-muted-foreground">{asset.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{asset.price}</div>
                      <div
                        className={`flex items-center gap-1 text-sm ${asset.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {asset.trend === "up" ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {asset.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">{watchlist[0]?.symbol} Details</CardTitle>
              <CardDescription>
                {watchlist[0]?.name} - {timescale.toUpperCase()} timeframe
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{watchlist[0]?.price}</div>
                <div
                  className={`flex items-center justify-center gap-1 ${watchlist[0]?.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {watchlist[0]?.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{watchlist[0]?.change}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Day Range</span>
                  <span className="text-sm">$180.12 - $183.45</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">52W Range</span>
                  <span className="text-sm">$164.08 - $199.62</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Volume</span>
                  <span className="text-sm">45.2M</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Market Cap</span>
                  <span className="text-sm">$2.85T</span>
                </div>
              </div>

              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-serif">Price Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">GOOGL Below $140</span>
                <Badge variant="destructive">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">BTC Above $45k</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
