"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Calendar, TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react"

interface EarningsAnalysisDashboardProps {
  marketView: string
  timescale?: string
}

const getEarningsDataByMarket = (marketView: string) => {
  const earningsData = {
    "stocks-etf": {
      upcoming: [
        {
          symbol: "AAPL",
          company: "Apple Inc.",
          date: "2024-01-25",
          time: "After Market",
          estimate: "$2.18",
          consensus: "Beat",
        },
        {
          symbol: "MSFT",
          company: "Microsoft Corp.",
          date: "2024-01-24",
          time: "After Market",
          estimate: "$2.78",
          consensus: "Meet",
        },
        {
          symbol: "GOOGL",
          company: "Alphabet Inc.",
          date: "2024-01-23",
          time: "After Market",
          estimate: "$1.45",
          consensus: "Beat",
        },
        {
          symbol: "TSLA",
          company: "Tesla Inc.",
          date: "2024-01-24",
          time: "After Market",
          estimate: "$0.73",
          consensus: "Miss",
        },
      ],
      recent: [
        {
          symbol: "NFLX",
          company: "Netflix Inc.",
          actual: "$2.11",
          estimate: "$2.05",
          surprise: "+2.9%",
          reaction: "+8.5%",
          result: "beat",
        },
        {
          symbol: "JPM",
          company: "JPMorgan Chase",
          actual: "$3.97",
          estimate: "$3.98",
          surprise: "-0.3%",
          reaction: "-2.1%",
          result: "miss",
        },
        {
          symbol: "BAC",
          company: "Bank of America",
          actual: "$0.70",
          estimate: "$0.68",
          surprise: "+2.9%",
          reaction: "+4.2%",
          result: "beat",
        },
      ],
    },
    technology: {
      upcoming: [
        {
          symbol: "NVDA",
          company: "NVIDIA Corp.",
          date: "2024-01-26",
          time: "After Market",
          estimate: "$5.08",
          consensus: "Beat",
        },
        {
          symbol: "AMD",
          company: "Advanced Micro Devices",
          date: "2024-01-25",
          time: "After Market",
          estimate: "$0.77",
          consensus: "Meet",
        },
        {
          symbol: "CRM",
          company: "Salesforce Inc.",
          date: "2024-01-24",
          time: "After Market",
          estimate: "$2.05",
          consensus: "Beat",
        },
        {
          symbol: "ORCL",
          company: "Oracle Corp.",
          date: "2024-01-23",
          time: "After Market",
          estimate: "$1.34",
          consensus: "Meet",
        },
      ],
      recent: [
        {
          symbol: "META",
          company: "Meta Platforms",
          actual: "$5.33",
          estimate: "$4.96",
          surprise: "+7.5%",
          reaction: "+12.3%",
          result: "beat",
        },
        {
          symbol: "AMZN",
          company: "Amazon.com Inc.",
          actual: "$1.00",
          estimate: "$0.80",
          surprise: "+25.0%",
          reaction: "+8.7%",
          result: "beat",
        },
        {
          symbol: "INTC",
          company: "Intel Corp.",
          actual: "$0.54",
          estimate: "$0.60",
          surprise: "-10.0%",
          reaction: "-5.2%",
          result: "miss",
        },
      ],
    },
    healthcare: {
      upcoming: [
        {
          symbol: "JNJ",
          company: "Johnson & Johnson",
          date: "2024-01-25",
          time: "Before Market",
          estimate: "$2.80",
          consensus: "Meet",
        },
        {
          symbol: "PFE",
          company: "Pfizer Inc.",
          date: "2024-01-24",
          time: "Before Market",
          estimate: "$0.61",
          consensus: "Beat",
        },
        {
          symbol: "UNH",
          company: "UnitedHealth Group",
          date: "2024-01-23",
          time: "Before Market",
          estimate: "$6.65",
          consensus: "Beat",
        },
        {
          symbol: "ABBV",
          company: "AbbVie Inc.",
          date: "2024-01-26",
          time: "Before Market",
          estimate: "$3.60",
          consensus: "Meet",
        },
      ],
      recent: [
        {
          symbol: "LLY",
          company: "Eli Lilly and Co.",
          actual: "$2.49",
          estimate: "$2.32",
          surprise: "+7.3%",
          reaction: "+6.8%",
          result: "beat",
        },
        {
          symbol: "BMY",
          company: "Bristol Myers Squibb",
          actual: "$1.47",
          estimate: "$1.50",
          surprise: "-2.0%",
          reaction: "-3.1%",
          result: "miss",
        },
        {
          symbol: "MRK",
          company: "Merck & Co Inc.",
          actual: "$1.81",
          estimate: "$1.70",
          surprise: "+6.5%",
          reaction: "+4.2%",
          result: "beat",
        },
      ],
    },
    industrial: {
      upcoming: [
        {
          symbol: "CAT",
          company: "Caterpillar Inc.",
          date: "2024-01-25",
          time: "Before Market",
          estimate: "$3.54",
          consensus: "Meet",
        },
        {
          symbol: "BA",
          company: "Boeing Company",
          date: "2024-01-24",
          time: "Before Market",
          estimate: "$0.35",
          consensus: "Miss",
        },
        {
          symbol: "GE",
          company: "General Electric",
          date: "2024-01-23",
          time: "Before Market",
          estimate: "$0.88",
          consensus: "Beat",
        },
        {
          symbol: "MMM",
          company: "3M Company",
          date: "2024-01-26",
          time: "Before Market",
          estimate: "$2.23",
          consensus: "Meet",
        },
      ],
      recent: [
        {
          symbol: "HON",
          company: "Honeywell Intl Inc.",
          actual: "$2.09",
          estimate: "$2.05",
          surprise: "+1.9%",
          reaction: "+2.8%",
          result: "beat",
        },
        {
          symbol: "UPS",
          company: "United Parcel Service",
          actual: "$2.54",
          estimate: "$2.65",
          surprise: "-4.2%",
          reaction: "-6.1%",
          result: "miss",
        },
        {
          symbol: "LMT",
          company: "Lockheed Martin Corp.",
          actual: "$6.44",
          estimate: "$6.20",
          surprise: "+3.9%",
          reaction: "+1.5%",
          result: "beat",
        },
      ],
    },
    "life-sciences": {
      upcoming: [
        {
          symbol: "GILD",
          company: "Gilead Sciences",
          date: "2024-01-25",
          time: "After Market",
          estimate: "$1.58",
          consensus: "Meet",
        },
        {
          symbol: "AMGN",
          company: "Amgen Inc.",
          date: "2024-01-24",
          time: "After Market",
          estimate: "$4.50",
          consensus: "Beat",
        },
        {
          symbol: "BIIB",
          company: "Biogen Inc.",
          date: "2024-01-23",
          time: "After Market",
          estimate: "$3.67",
          consensus: "Miss",
        },
        {
          symbol: "REGN",
          company: "Regeneron Pharma",
          date: "2024-01-26",
          time: "Before Market",
          estimate: "$10.25",
          consensus: "Beat",
        },
      ],
      recent: [
        {
          symbol: "VRTX",
          company: "Vertex Pharmaceuticals",
          actual: "$3.25",
          estimate: "$3.10",
          surprise: "+4.8%",
          reaction: "+7.2%",
          result: "beat",
        },
        {
          symbol: "CELG",
          company: "Celgene Corp.",
          actual: "$2.05",
          estimate: "$2.15",
          surprise: "-4.7%",
          reaction: "-8.3%",
          result: "miss",
        },
        {
          symbol: "ILMN",
          company: "Illumina Inc.",
          actual: "$1.12",
          estimate: "$1.05",
          surprise: "+6.7%",
          reaction: "+5.4%",
          result: "beat",
        },
      ],
    },
  }

  return earningsData[marketView as keyof typeof earningsData] || earningsData["stocks-etf"]
}

const earningsCalendarData = [
  { week: "Jan 22-26", companies: 45, sp500: 12 },
  { week: "Jan 29-Feb 2", companies: 67, sp500: 18 },
  { week: "Feb 5-9", companies: 89, sp500: 25 },
  { week: "Feb 12-16", companies: 123, sp500: 34 },
  { week: "Feb 19-23", companies: 98, sp500: 28 },
]

const surpriseRateData = [
  { quarter: "Q1 2023", beatRate: 68, missRate: 32 },
  { quarter: "Q2 2023", beatRate: 72, missRate: 28 },
  { quarter: "Q3 2023", beatRate: 65, missRate: 35 },
  { quarter: "Q4 2023", beatRate: 70, missRate: 30 },
]

export function EarningsAnalysisDashboard({ marketView, timescale = "1d" }: EarningsAnalysisDashboardProps) {
  const earningsData = getEarningsDataByMarket(marketView)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">Quarterly Earnings Report Analysis</h2>
        <p className="text-muted-foreground">
          Track earnings reports, estimates, and market reactions - {timescale.toUpperCase()} view
        </p>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">67</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Companies reporting</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Beat Rate</p>
                <p className="text-2xl font-bold text-green-600">72%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Above estimates</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Surprise</p>
                <p className="text-2xl font-bold">+4.2%</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs estimates</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Market Impact</p>
                <p className="text-2xl font-bold">+2.8%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Avg reaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Earnings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Upcoming Earnings</CardTitle>
              <CardDescription>Key earnings reports scheduled for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upcoming" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="recent">Recent Results</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-3 mt-4">
                  {earningsData.upcoming.map((earning) => (
                    <div
                      key={earning.symbol}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{earning.symbol}</div>
                          <div className="text-sm text-muted-foreground">{earning.company}</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{earning.date}</div>
                        <div className="text-xs text-muted-foreground">{earning.time}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{earning.estimate}</div>
                        <div className="text-xs text-muted-foreground">Estimate</div>
                      </div>
                      <Badge
                        variant={
                          earning.consensus === "Beat"
                            ? "default"
                            : earning.consensus === "Miss"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {earning.consensus}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="recent" className="space-y-3 mt-4">
                  {earningsData.recent.map((result) => (
                    <div key={result.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={result.result === "beat" ? "text-green-600" : "text-red-600"}>
                          {result.result === "beat" ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <AlertCircle className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{result.symbol}</div>
                          <div className="text-sm text-muted-foreground">{result.company}</div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium">{result.actual}</div>
                        <div className="text-xs text-muted-foreground">vs {result.estimate}</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-sm font-medium ${result.surprise.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                        >
                          {result.surprise}
                        </div>
                        <div className="text-xs text-muted-foreground">Surprise</div>
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-sm font-medium ${result.reaction.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                        >
                          {result.reaction}
                        </div>
                        <div className="text-xs text-muted-foreground">Reaction</div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Earnings Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Earnings Calendar</CardTitle>
              <CardDescription>Weekly earnings schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsCalendarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" angle={-45} textAnchor="end" height={60} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="companies" fill="hsl(var(--chart-1))" />
                    <Bar dataKey="sp500" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-serif">Beat/Miss Rate</CardTitle>
              <CardDescription>Quarterly earnings surprise trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={surpriseRateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="beatRate" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="missRate" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
