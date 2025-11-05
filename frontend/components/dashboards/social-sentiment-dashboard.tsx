"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Twitter, MessageCircle, TrendingUp, Hash, Users } from "lucide-react"

interface SocialSentimentDashboardProps {
  marketView: string
  timescale?: string
}

const getSentimentTrendData = (timescale: string) => {
  const dataSets = {
    "1h": [
      { time: "9:00", positive: 45, negative: 25, neutral: 30 },
      { time: "9:15", positive: 48, negative: 23, neutral: 29 },
      { time: "9:30", positive: 52, negative: 22, neutral: 26 },
      { time: "9:45", positive: 55, negative: 20, neutral: 25 },
      { time: "10:00", positive: 58, negative: 18, neutral: 24 },
    ],
    "1d": [
      { time: "00:00", positive: 45, negative: 25, neutral: 30 },
      { time: "04:00", positive: 52, negative: 22, neutral: 26 },
      { time: "08:00", positive: 48, negative: 28, neutral: 24 },
      { time: "12:00", positive: 55, negative: 20, neutral: 25 },
      { time: "16:00", positive: 58, negative: 18, neutral: 24 },
      { time: "20:00", positive: 62, negative: 15, neutral: 23 },
    ],
    "1w": [
      { time: "Mon", positive: 45, negative: 30, neutral: 25 },
      { time: "Tue", positive: 50, negative: 28, neutral: 22 },
      { time: "Wed", positive: 55, negative: 25, neutral: 20 },
      { time: "Thu", positive: 58, negative: 22, neutral: 20 },
      { time: "Fri", positive: 62, negative: 18, neutral: 20 },
    ],
    "1m": [
      { time: "Week 1", positive: 40, negative: 35, neutral: 25 },
      { time: "Week 2", positive: 48, negative: 30, neutral: 22 },
      { time: "Week 3", positive: 55, negative: 25, neutral: 20 },
      { time: "Week 4", positive: 62, negative: 18, neutral: 20 },
    ],
  }

  return dataSets[timescale as keyof typeof dataSets] || dataSets["1d"]
}

const trendingHashtags = [
  { tag: "#FedRate", mentions: 15420, sentiment: "positive", change: "+12%" },
  { tag: "#TechEarnings", mentions: 12350, sentiment: "neutral", change: "+8%" },
  { tag: "#CryptoNews", mentions: 9870, sentiment: "positive", change: "+25%" },
  { tag: "#MarketCrash", mentions: 8450, sentiment: "negative", change: "-5%" },
  { tag: "#AIStocks", mentions: 7230, sentiment: "positive", change: "+18%" },
]

const influencerPosts = [
  {
    id: 1,
    author: "@MarketGuru",
    followers: "2.3M",
    content:
      "The Fed's dovish stance could signal a major shift in market dynamics. Watching key support levels closely. #FedRate #Markets",
    sentiment: "positive",
    engagement: 1250,
    time: "2h ago",
  },
  {
    id: 2,
    author: "@CryptoWhale",
    followers: "1.8M",
    content:
      "Bitcoin showing strong institutional accumulation patterns. This could be the beginning of the next major cycle. #Bitcoin #Crypto",
    sentiment: "positive",
    engagement: 980,
    time: "4h ago",
  },
  {
    id: 3,
    author: "@TechAnalyst",
    followers: "1.2M",
    content:
      "Mixed earnings results across tech sector. Some winners, some losers. Market seems to be pricing in a lot already. #TechEarnings",
    sentiment: "neutral",
    engagement: 750,
    time: "6h ago",
  },
]

const platformData = [
  { name: "Twitter", value: 45, color: "#1DA1F2" },
  { name: "Reddit", value: 25, color: "#FF4500" },
  { name: "Discord", value: 15, color: "#7289DA" },
  { name: "Telegram", value: 10, color: "#0088CC" },
  { name: "Others", value: 5, color: "#6B7280" },
]

export function SocialSentimentDashboard({ marketView, timescale = "1d" }: SocialSentimentDashboardProps) {
  const sentimentTrendData = getSentimentTrendData(timescale)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">Social Media & Sentiment Tracking</h2>
        <p className="text-muted-foreground">
          Monitor social media sentiment and trending discussions across platforms - {timescale.toUpperCase()} view
        </p>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Sentiment</p>
                <p className="text-2xl font-bold text-green-600">Positive</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">68% positive mentions</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mentions</p>
                <p className="text-2xl font-bold">47.2K</p>
              </div>
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-sm">+15% vs yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Rate</p>
                <p className="text-2xl font-bold">8.4%</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-sm">+2.1% vs avg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trending Score</p>
                <p className="text-2xl font-bold">92</p>
              </div>
              <Hash className="h-8 w-8 text-secondary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-sm">High activity</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Trend Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Sentiment Trends ({timescale.toUpperCase()})</CardTitle>
              <CardDescription>Real-time sentiment analysis across social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sentimentTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="positive"
                      stackId="1"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="neutral"
                      stackId="1"
                      stroke="#6b7280"
                      fill="#6b7280"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="negative"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Distribution */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Platform Distribution</CardTitle>
              <CardDescription>Mention distribution across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platform.color }} />
                      <span>{platform.name}</span>
                    </div>
                    <span className="font-medium">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trending Hashtags and Influencer Posts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Trending Hashtags</CardTitle>
            <CardDescription>Most mentioned hashtags in financial discussions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingHashtags.map((hashtag, index) => (
              <div key={hashtag.tag} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                  <div>
                    <div className="font-medium">{hashtag.tag}</div>
                    <div className="text-sm text-muted-foreground">{hashtag.mentions.toLocaleString()} mentions</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      hashtag.sentiment === "positive"
                        ? "default"
                        : hashtag.sentiment === "negative"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {hashtag.sentiment}
                  </Badge>
                  <div className="text-sm text-green-600 mt-1">{hashtag.change}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Influencer Posts</CardTitle>
            <CardDescription>Key posts from financial influencers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {influencerPosts.map((post) => (
              <div key={post.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">{post.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {post.followers}
                    </Badge>
                  </div>
                  <Badge
                    variant={
                      post.sentiment === "positive"
                        ? "default"
                        : post.sentiment === "negative"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-xs"
                  >
                    {post.sentiment}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{post.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.engagement} engagements</span>
                  <span>{post.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
