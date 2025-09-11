"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, TrendingUp, TrendingDown, Clock, ThumbsUp, ThumbsDown } from "lucide-react"

interface NewsFeedDashboardProps {
  marketView: string
  timescale?: string
}

const getNewsDataByMarket = (marketView: string, timescale: string) => {
  const newsDataSets = {
    "stocks-etf": [
      {
        id: 1,
        title: "S&P 500 Reaches New All-Time High Amid Strong Earnings",
        source: "Reuters",
        time: timescale.includes("h") ? "15 min ago" : "2 hours ago",
        sentiment: "positive",
        impact: "high",
        summary: "Major indices surge as corporate earnings exceed expectations across multiple sectors...",
        tags: ["S&P 500", "Earnings", "Bull Market"],
      },
      {
        id: 2,
        title: "Federal Reserve Signals Potential Rate Cut in Q2 2024",
        source: "Bloomberg",
        time: timescale.includes("h") ? "45 min ago" : "4 hours ago",
        sentiment: "positive",
        impact: "high",
        summary: "Fed officials hint at monetary policy easing amid cooling inflation data...",
        tags: ["Fed", "Interest Rates", "Monetary Policy"],
      },
    ],
    crypto: [
      {
        id: 1,
        title: "Bitcoin ETF Sees Record Inflows as Institutional Adoption Grows",
        source: "CoinDesk",
        time: timescale.includes("h") ? "20 min ago" : "1 hour ago",
        sentiment: "positive",
        impact: "high",
        summary: "Major financial institutions pour billions into Bitcoin ETFs, signaling mainstream acceptance...",
        tags: ["Bitcoin", "ETF", "Institutional"],
      },
      {
        id: 2,
        title: "Ethereum Network Upgrade Promises Lower Transaction Fees",
        source: "CryptoNews",
        time: timescale.includes("h") ? "1 hour ago" : "3 hours ago",
        sentiment: "positive",
        impact: "medium",
        summary: "Latest Ethereum improvement proposal could reduce gas fees by up to 50%...",
        tags: ["Ethereum", "Network Upgrade", "Gas Fees"],
      },
    ],
    currency: [
      {
        id: 1,
        title: "Dollar Strengthens Against Euro Amid ECB Policy Divergence",
        source: "Financial Times",
        time: timescale.includes("h") ? "30 min ago" : "2 hours ago",
        sentiment: "neutral",
        impact: "medium",
        summary: "USD/EUR reaches multi-month highs as central bank policies diverge...",
        tags: ["USD", "EUR", "Central Banks"],
      },
    ],
    "assets-gold": [
      {
        id: 1,
        title: "Gold Prices Surge on Safe Haven Demand Amid Market Uncertainty",
        source: "MarketWatch",
        time: timescale.includes("h") ? "25 min ago" : "1 hour ago",
        sentiment: "positive",
        impact: "medium",
        summary: "Precious metals rally as investors seek safety amid geopolitical tensions...",
        tags: ["Gold", "Safe Haven", "Commodities"],
      },
    ],
    housing: [
      {
        id: 1,
        title: "Housing Market Shows Signs of Cooling as Mortgage Rates Rise",
        source: "Real Estate News",
        time: timescale.includes("d") ? "1 day ago" : "6 hours ago",
        sentiment: "negative",
        impact: "high",
        summary: "Home sales decline as higher borrowing costs impact buyer demand...",
        tags: ["Housing", "Mortgage Rates", "Real Estate"],
      },
    ],
    technology: [
      {
        id: 1,
        title: "AI Chip Demand Drives Semiconductor Sector to New Heights",
        source: "Tech Times",
        time: timescale.includes("h") ? "40 min ago" : "3 hours ago",
        sentiment: "positive",
        impact: "high",
        summary: "NVIDIA and AMD see massive gains as AI infrastructure investment accelerates...",
        tags: ["AI", "Semiconductors", "NVIDIA"],
      },
    ],
    healthcare: [
      {
        id: 1,
        title: "Breakthrough Cancer Treatment Shows Promise in Clinical Trials",
        source: "Medical News",
        time: timescale.includes("d") ? "2 days ago" : "8 hours ago",
        sentiment: "positive",
        impact: "medium",
        summary: "Biotech company announces positive Phase 3 results for innovative therapy...",
        tags: ["Biotech", "Clinical Trials", "Healthcare"],
      },
    ],
    industrial: [
      {
        id: 1,
        title: "Manufacturing PMI Shows Resilience Despite Global Headwinds",
        source: "Industrial Report",
        time: timescale.includes("d") ? "1 day ago" : "5 hours ago",
        sentiment: "positive",
        impact: "medium",
        summary: "US manufacturing sector outperforms expectations in latest survey...",
        tags: ["Manufacturing", "PMI", "Industrial"],
      },
    ],
    "life-sciences": [
      {
        id: 1,
        title: "Gene Therapy Breakthrough Opens New Treatment Possibilities",
        source: "Science Daily",
        time: timescale.includes("d") ? "3 days ago" : "12 hours ago",
        sentiment: "positive",
        impact: "high",
        summary: "Revolutionary gene editing technique shows success in treating rare diseases...",
        tags: ["Gene Therapy", "Biotech", "Medical Research"],
      },
    ],
  }

  return newsDataSets[marketView as keyof typeof newsDataSets] || newsDataSets["stocks-etf"]
}

const sentimentData = {
  overall: { score: 68, trend: "up", change: "+5" },
  categories: [
    { name: "Market Outlook", score: 72, trend: "up" },
    { name: "Economic Policy", score: 65, trend: "down" },
    { name: "Corporate Earnings", score: 58, trend: "up" },
    { name: "Geopolitical", score: 45, trend: "down" },
  ],
}

export function NewsFeedDashboard({ marketView, timescale = "1d" }: NewsFeedDashboardProps) {
  const newsData = getNewsDataByMarket(marketView, timescale)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">News Feed & Sentiment Tracking</h2>
        <p className="text-muted-foreground">
          Stay informed with real-time financial news and sentiment analysis - {timescale.toUpperCase()} view
        </p>
      </div>

      {/* Sentiment Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Market Sentiment Overview</CardTitle>
          <CardDescription>Real-time sentiment analysis from financial news sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{sentimentData.overall.score}</div>
              <div className="flex items-center justify-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">{sentimentData.overall.change}</span>
              </div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
            {sentimentData.categories.map((category) => (
              <div key={category.name} className="text-center">
                <div className="text-xl font-semibold">{category.score}</div>
                <div
                  className={`flex items-center justify-center gap-1 ${category.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {category.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                </div>
                <div className="text-xs text-muted-foreground">{category.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* News Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Latest Financial News</CardTitle>
              <CardDescription>Curated news with sentiment analysis and market impact assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="positive">Positive</TabsTrigger>
                  <TabsTrigger value="neutral">Neutral</TabsTrigger>
                  <TabsTrigger value="negative">Negative</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="space-y-4 mt-4">
                  {newsData.map((article) => (
                    <div key={article.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                article.sentiment === "positive"
                                  ? "default"
                                  : article.sentiment === "negative"
                                    ? "destructive"
                                    : "secondary"
                              }
                              className="text-xs"
                            >
                              {article.sentiment === "positive" ? (
                                <ThumbsUp className="h-3 w-3 mr-1" />
                              ) : article.sentiment === "negative" ? (
                                <ThumbsDown className="h-3 w-3 mr-1" />
                              ) : null}
                              {article.sentiment}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {article.impact} impact
                            </Badge>
                          </div>
                          <h3 className="font-semibold mb-2 leading-tight">{article.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{article.source}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.time}
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {article.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Trending Topics */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Trending Topics</CardTitle>
              <CardDescription>Most discussed topics in financial news</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { topic: "Federal Reserve Policy", mentions: 156, trend: "up" },
                { topic: "AI & Technology", mentions: 142, trend: "up" },
                { topic: "Cryptocurrency", mentions: 98, trend: "up" },
                { topic: "Energy Transition", mentions: 87, trend: "down" },
                { topic: "Inflation Data", mentions: 76, trend: "down" },
              ].map((item) => (
                <div key={item.topic} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{item.topic}</div>
                    <div className="text-xs text-muted-foreground">{item.mentions} mentions</div>
                  </div>
                  <div className={item.trend === "up" ? "text-green-600" : "text-red-600"}>
                    {item.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-serif">News Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { source: "Reuters", articles: 23, reliability: 95 },
                { source: "Bloomberg", articles: 18, reliability: 92 },
                { source: "Financial Times", articles: 15, reliability: 90 },
                { source: "Wall Street Journal", articles: 12, reliability: 88 },
              ].map((source) => (
                <div key={source.source} className="flex items-center justify-between text-sm">
                  <span>{source.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{source.articles}</span>
                    <Badge variant="secondary" className="text-xs">
                      {source.reliability}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
