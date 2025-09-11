"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { TimescaleSelector } from "@/components/ui/timescale-selector"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { MarketIndicatorDashboard } from "@/components/dashboards/market-indicator-dashboard"
import { AssetTrackingDashboard } from "@/components/dashboards/asset-tracking-dashboard"
import { NewsFeedDashboard } from "@/components/dashboards/news-feed-dashboard"
import { SocialSentimentDashboard } from "@/components/dashboards/social-sentiment-dashboard"
import { EarningsAnalysisDashboard } from "@/components/dashboards/earnings-analysis-dashboard"
import { InsiderTrackingDashboard } from "@/components/dashboards/insider-tracking-dashboard"
import { MLIndicatorDashboard } from "@/components/dashboards/ml-indicator-dashboard"

export default function DashboardPopout() {
  const searchParams = useSearchParams()
  const [timescale, setTimescale] = useState("1d")

  const dashboard = searchParams.get("dashboard") || "market-indicators"
  const marketView = searchParams.get("marketView") || "stocks-etf"
  const initialTimescale = searchParams.get("timescale") || "1d"

  useEffect(() => {
    setTimescale(initialTimescale)
  }, [initialTimescale])

  const renderDashboard = () => {
    const props = {
      marketView,
      timescale,
      isPopout: true,
    }

    switch (dashboard) {
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

  const handleClose = () => {
    window.close()
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-card/95 backdrop-blur-sm border rounded-lg p-2 shadow-lg">
        <TimescaleSelector value={timescale} onValueChange={setTimescale} className="w-32" />
        <Button variant="ghost" size="sm" onClick={handleClose} className="hover:bg-destructive/10">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Full Dashboard Content */}
      <div className="p-4">{renderDashboard()}</div>
    </div>
  )
}
