"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimescaleSelector } from "@/components/ui/timescale-selector"
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Newspaper,
  MessageSquare,
  FileText,
  Users,
  Brain,
  DollarSign,
  Bitcoin,
  Building,
  Home,
  Stethoscope,
  Cpu,
  Microscope,
  Factory,
  ExternalLink,
} from "lucide-react"
import { MarketIndicatorDashboard } from "@/components/dashboards/market-indicator-dashboard"
import { AssetTrackingDashboard } from "@/components/dashboards/asset-tracking-dashboard"
import { NewsFeedDashboard } from "@/components/dashboards/news-feed-dashboard"
import { SocialSentimentDashboard } from "@/components/dashboards/social-sentiment-dashboard"
import { EarningsAnalysisDashboard } from "@/components/dashboards/earnings-analysis-dashboard"
import { InsiderTrackingDashboard } from "@/components/dashboards/insider-tracking-dashboard"
import { MLIndicatorDashboard } from "@/components/dashboards/ml-indicator-dashboard"

const dashboardTypes = [
  {
    id: "market-indicators",
    name: "Market Indicators",
    icon: BarChart3,
    description: "Track key market metrics",
    relevantMarkets: [
      "stocks-etf",
      "crypto",
      "currency",
      "assets-gold",
      "housing",
      "technology",
      "healthcare",
      "industrial",
      "life-sciences",
    ],
  },
  {
    id: "asset-tracking",
    name: "Asset Tracking",
    icon: TrendingUp,
    description: "Monitor specific assets",
    relevantMarkets: [
      "stocks-etf",
      "crypto",
      "currency",
      "assets-gold",
      "housing",
      "technology",
      "healthcare",
      "industrial",
      "life-sciences",
    ],
  },
  {
    id: "news-feed",
    name: "News & Sentiment",
    icon: Newspaper,
    description: "Financial news analysis",
    relevantMarkets: [
      "stocks-etf",
      "crypto",
      "currency",
      "assets-gold",
      "housing",
      "technology",
      "healthcare",
      "industrial",
      "life-sciences",
    ],
  },
  {
    id: "social-sentiment",
    name: "Social Media",
    icon: MessageSquare,
    description: "Social sentiment tracking",
    relevantMarkets: [
      "stocks-etf",
      "crypto",
      "currency",
      "assets-gold",
      "housing",
      "technology",
      "healthcare",
      "industrial",
      "life-sciences",
    ],
  },
  {
    id: "earnings-analysis",
    name: "Earnings Reports",
    icon: FileText,
    description: "Quarterly earnings data",
    relevantMarkets: ["stocks-etf", "technology", "healthcare", "industrial", "life-sciences"],
  },
  {
    id: "insider-tracking",
    name: "Insider Tracking",
    icon: Users,
    description: "Insider trading activity",
    relevantMarkets: [
      "stocks-etf",
      "crypto",
      "currency",
      "assets-gold",
      "housing",
      "technology",
      "healthcare",
      "industrial",
      "life-sciences",
    ],
  },
  {
    id: "ml-indicators",
    name: "ML Indicators",
    icon: Brain,
    description: "AI-driven insights",
    relevantMarkets: [
      "stocks-etf",
      "crypto",
      "currency",
      "assets-gold",
      "housing",
      "technology",
      "healthcare",
      "industrial",
      "life-sciences",
    ],
  },
]

const marketViews = [
  { id: "stocks-etf", name: "Stocks & ETF", icon: DollarSign },
  { id: "crypto", name: "Crypto Currency", icon: Bitcoin },
  { id: "currency", name: "Currency", icon: DollarSign },
  { id: "assets-gold", name: "Assets & Gold", icon: Building },
  { id: "housing", name: "Housing", icon: Home },
  { id: "technology", name: "Technology", icon: Cpu },
  { id: "healthcare", name: "Healthcare", icon: Stethoscope },
  { id: "industrial", name: "Industrial & Manufacturing", icon: Factory },
  { id: "life-sciences", name: "Life Sciences", icon: Microscope },
]

const getQuickStats = (marketView: string, dashboard: string) => {
  const baseStats = {
    "stocks-etf": [
      { label: "S&P 500", value: "+0.8%", trend: "up" },
      { label: "NASDAQ", value: "-0.3%", trend: "down" },
      { label: "VIX", value: "18.4", trend: "neutral" },
    ],
    crypto: [
      { label: "Bitcoin", value: "+2.1%", trend: "up" },
      { label: "Ethereum", value: "+1.8%", trend: "up" },
      { label: "Fear & Greed", value: "72", trend: "neutral" },
    ],
    currency: [
      { label: "USD/EUR", value: "1.0842", trend: "up" },
      { label: "USD/JPY", value: "149.23", trend: "down" },
      { label: "DXY", value: "103.45", trend: "up" },
    ],
    "assets-gold": [
      { label: "Gold", value: "+0.5%", trend: "up" },
      { label: "Silver", value: "-0.2%", trend: "down" },
      { label: "Oil (WTI)", value: "+1.2%", trend: "up" },
    ],
    housing: [
      { label: "Case-Shiller", value: "+4.2%", trend: "up" },
      { label: "Mortgage Rate", value: "7.12%", trend: "up" },
      { label: "Housing Starts", value: "1.35M", trend: "down" },
    ],
    technology: [
      { label: "NASDAQ 100", value: "+0.9%", trend: "up" },
      { label: "SOX Index", value: "+1.4%", trend: "up" },
      { label: "Tech P/E", value: "28.3", trend: "neutral" },
    ],
    healthcare: [
      { label: "XLV ETF", value: "+0.6%", trend: "up" },
      { label: "Biotech Index", value: "-0.4%", trend: "down" },
      { label: "Healthcare P/E", value: "16.8", trend: "neutral" },
    ],
    industrial: [
      { label: "Dow Jones", value: "+0.4%", trend: "up" },
      { label: "Industrial PMI", value: "48.7", trend: "down" },
      { label: "Copper", value: "+0.8%", trend: "up" },
    ],
    "life-sciences": [
      { label: "IBB ETF", value: "+0.3%", trend: "up" },
      { label: "Pharma Index", value: "+0.7%", trend: "up" },
      { label: "R&D Spending", value: "$198B", trend: "up" },
    ],
  }

  return baseStats[marketView as keyof typeof baseStats] || baseStats["stocks-etf"]
}

export default function FinancialOpsCenter() {
  const [selectedDashboard, setSelectedDashboard] = useState("market-indicators")
  const [selectedMarketView, setSelectedMarketView] = useState("stocks-etf")
  const [timescale, setTimescale] = useState("1d")

  const getRelevantDashboards = () => {
    return dashboardTypes.filter((dashboard) => dashboard.relevantMarkets.includes(selectedMarketView))
  }

  const ensureValidDashboard = (marketView: string) => {
    const relevantDashboards = dashboardTypes.filter((dashboard) => dashboard.relevantMarkets.includes(marketView))

    if (!relevantDashboards.find((d) => d.id === selectedDashboard)) {
      setSelectedDashboard(relevantDashboards[0]?.id || "market-indicators")
    }
  }

  const handleMarketViewChange = (newMarketView: string) => {
    setSelectedMarketView(newMarketView)
    ensureValidDashboard(newMarketView)
  }

  const handlePopout = () => {
    const popoutUrl = `/dashboard-popout?dashboard=${selectedDashboard}&marketView=${selectedMarketView}&timescale=${timescale}`
    window.open(popoutUrl, "_blank", "width=1200,height=800,scrollbars=yes,resizable=yes")
  }

  const renderDashboard = () => {
    const props = { marketView: selectedMarketView, timescale }

    switch (selectedDashboard) {
      case "market-indicators":
        return <MarketIndicatorDashboard {...props} />
      case "asset-tracking":
        return <AssetTrackingDashboard {...props} />
      case "news-feed":
        return <NewsFeedDashboard {...props} />
      case "social-sentiment":
        return <SocialSentimentDashboard {...props} />
      case "earnings-analysis":
        return <EarningsAnalysisDashboard {...props} />
      case "insider-tracking":
        return <InsiderTrackingDashboard {...props} />
      case "ml-indicators":
        return <MLIndicatorDashboard {...props} />
      default:
        return <MarketIndicatorDashboard {...props} />
    }
  }

  const quickStats = getQuickStats(selectedMarketView, selectedDashboard)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Financial Operations Center</h1>
              <p className="text-sm text-muted-foreground">
                Professional wealth management and investment tracking platform
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedMarketView} onValueChange={handleMarketViewChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select market view" />
                </SelectTrigger>
                <SelectContent>
                  {marketViews.map((view) => (
                    <SelectItem key={view.id} value={view.id}>
                      <div className="flex items-center gap-2">
                        <view.icon className="h-4 w-4" />
                        {view.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">Dashboard Types</CardTitle>
                <CardDescription>
                  Select a dashboard to analyze different aspects of your financial operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {getRelevantDashboards().map((dashboard) => (
                  <Button
                    key={dashboard.id}
                    variant={selectedDashboard === dashboard.id ? "default" : "ghost"}
                    className="w-full justify-start gap-3 h-auto p-3 text-left"
                    onClick={() => setSelectedDashboard(dashboard.id)}
                  >
                    <dashboard.icon className="h-5 w-5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-sm leading-tight">{dashboard.name}</div>
                      <div className="text-xs text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                        {dashboard.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-serif">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Market Status</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Open
                  </Badge>
                </div>
                {quickStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-1">
                      {stat.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                      {stat.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      <span className="text-sm font-medium">{stat.value}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Area */}
          <div className="lg:col-span-3">
            {/* Dashboard Controls Bar */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <h2 className="text-xl font-serif font-semibold">
                      {dashboardTypes.find((d) => d.id === selectedDashboard)?.name}
                    </h2>
                    <Badge variant="outline">{marketViews.find((v) => v.id === selectedMarketView)?.name}</Badge>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-48">
                      <TimescaleSelector value={timescale} onValueChange={setTimescale} />
                    </div>
                    <div className="relative group">
                      <Button variant="outline" size="sm" onClick={handlePopout} className="p-2 bg-transparent">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900/95 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                        Popout
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900/95"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {renderDashboard()}
          </div>
        </div>
      </div>
    </div>
  )
}
