"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"
import { generateTimeLabels, generateQuarterLabels } from "@/lib/chart-utils"

interface MarketIndicatorDashboardProps {
  marketView: string
  timescale?: string
  isPopout?: boolean // Added isPopout prop to interface
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 text-white p-3 rounded-lg shadow-lg border border-gray-700 backdrop-blur-sm">
        <p className="font-medium mb-2 leading-tight">{`Time: ${label}`}</p>
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

const generateChartData = (baseData: any[], timescale: string) => {
  const timeLabels = generateTimeLabels(timescale, baseData.length)
  return baseData.map((item, index) => ({
    ...item,
    time: timeLabels[index],
  }))
}

const QuarterLabels = () => {
  const quarters = generateQuarterLabels()
  return (
    <div className="flex justify-between text-xs text-muted-foreground mt-1 px-12">
      {quarters.map((quarter, index) => (
        <span key={index} className="text-center">
          {quarter}
        </span>
      ))}
    </div>
  )
}

const marketData = {
  "stocks-etf": {
    indicators: [
      { name: "S&P 500", value: "4,567.89", change: "+0.8%", trend: "up" },
      { name: "NASDAQ", value: "14,234.56", change: "-0.3%", trend: "down" },
      { name: "DOW", value: "34,567.12", change: "+0.5%", trend: "up" },
      { name: "VIX", value: "18.4", change: "-2.1%", trend: "down" },
    ],
    chartData: {
      "1h": [
        { time: "9:30", sp500: 4520, nasdaq: 14100, dow: 34400 },
        { time: "9:45", sp500: 4525, nasdaq: 14120, dow: 34420 },
        { time: "10:00", sp500: 4535, nasdaq: 14150, dow: 34450 },
        { time: "10:15", sp500: 4540, nasdaq: 14170, dow: 34470 },
        { time: "10:30", sp500: 4568, nasdaq: 14235, dow: 34567 },
      ],
      "1d": [
        { time: "9:30", sp500: 4520, nasdaq: 14100, dow: 34400 },
        { time: "11:00", sp500: 4545, nasdaq: 14180, dow: 34480 },
        { time: "1:00", sp500: 4560, nasdaq: 14200, dow: 34520 },
        { time: "3:00", sp500: 4568, nasdaq: 14235, dow: 34567 },
      ],
      "1w": [
        { time: "Mon", sp500: 4450, nasdaq: 13900, dow: 34200 },
        { time: "Tue", sp500: 4480, nasdaq: 14000, dow: 34300 },
        { time: "Wed", sp500: 4520, nasdaq: 14100, dow: 34400 },
        { time: "Thu", sp500: 4550, nasdaq: 14180, dow: 34500 },
        { time: "Fri", sp500: 4568, nasdaq: 14235, dow: 34567 },
      ],
      "1m": [
        { time: "Week 1", sp500: 4200, nasdaq: 13500, dow: 33800 },
        { time: "Week 2", sp500: 4350, nasdaq: 13800, dow: 34100 },
        { time: "Week 3", sp500: 4450, nasdaq: 14000, dow: 34300 },
        { time: "Week 4", sp500: 4568, nasdaq: 14235, dow: 34567 },
      ],
    },
  },
  crypto: {
    indicators: [
      { name: "Bitcoin", value: "$43,567", change: "+2.4%", trend: "up" },
      { name: "Ethereum", value: "$2,678", change: "+1.8%", trend: "up" },
      { name: "BNB", value: "$312.45", change: "-0.5%", trend: "down" },
      { name: "Crypto Fear & Greed", value: "67", change: "+5", trend: "up" },
    ],
    chartData: {
      "1h": [
        { time: "00:00", bitcoin: 42800, ethereum: 2620, bnb: 315 },
        { time: "00:15", bitcoin: 43000, ethereum: 2635, bnb: 314 },
        { time: "00:30", bitcoin: 43200, ethereum: 2650, bnb: 313 },
        { time: "00:45", bitcoin: 43400, ethereum: 2665, bnb: 312 },
        { time: "01:00", bitcoin: 43567, ethereum: 2678, bnb: 312 },
      ],
      "1d": [
        { time: "00:00", bitcoin: 42800, ethereum: 2620, bnb: 315 },
        { time: "06:00", bitcoin: 43200, ethereum: 2650, bnb: 314 },
        { time: "12:00", bitcoin: 43400, ethereum: 2665, bnb: 313 },
        { time: "18:00", bitcoin: 43567, ethereum: 2678, bnb: 312 },
      ],
      "1w": [
        { time: "Mon", bitcoin: 41000, ethereum: 2500, bnb: 320 },
        { time: "Wed", bitcoin: 42500, ethereum: 2600, bnb: 315 },
        { time: "Fri", bitcoin: 43567, ethereum: 2678, bnb: 312 },
      ],
      "1m": [
        { time: "Week 1", bitcoin: 38000, ethereum: 2300, bnb: 340 },
        { time: "Week 2", bitcoin: 40500, ethereum: 2450, bnb: 330 },
        { time: "Week 3", bitcoin: 42000, ethereum: 2550, bnb: 320 },
        { time: "Week 4", bitcoin: 43567, ethereum: 2678, bnb: 312 },
      ],
    },
  },
  currency: {
    indicators: [
      { name: "USD/EUR", value: "1.0842", change: "+0.12%", trend: "up" },
      { name: "USD/JPY", value: "149.23", change: "-0.08%", trend: "down" },
      { name: "GBP/USD", value: "1.2567", change: "+0.05%", trend: "up" },
      { name: "DXY", value: "103.45", change: "+0.15%", trend: "up" },
    ],
    chartData: {
      "1h": [
        { time: "9:00", usdeur: 1.082, usdjpy: 149.5, gbpusd: 1.255 },
        { time: "9:15", usdeur: 1.0825, usdjpy: 149.4, gbpusd: 1.2555 },
        { time: "9:30", usdeur: 1.0835, usdjpy: 149.3, gbpusd: 1.256 },
        { time: "9:45", usdeur: 1.084, usdjpy: 149.25, gbpusd: 1.2565 },
        { time: "10:00", usdeur: 1.0842, usdjpy: 149.23, gbpusd: 1.2567 },
      ],
      "1d": [
        { time: "Asia", usdeur: 1.082, usdjpy: 149.5, gbpusd: 1.255 },
        { time: "London", usdeur: 1.0835, usdjpy: 149.3, gbpusd: 1.256 },
        { time: "NY", usdeur: 1.0842, usdjpy: 149.23, gbpusd: 1.2567 },
      ],
      "1w": [
        { time: "Mon", usdeur: 1.08, usdjpy: 150.0, gbpusd: 1.25 },
        { time: "Wed", usdeur: 1.082, usdjpy: 149.6, gbpusd: 1.253 },
        { time: "Fri", usdeur: 1.0842, usdjpy: 149.23, gbpusd: 1.2567 },
      ],
      "1m": [
        { time: "Week 1", usdeur: 1.075, usdjpy: 151.0, gbpusd: 1.24 },
        { time: "Week 2", usdeur: 1.078, usdjpy: 150.5, gbpusd: 1.245 },
        { time: "Week 3", usdeur: 1.081, usdjpy: 150.0, gbpusd: 1.25 },
        { time: "Week 4", usdeur: 1.0842, usdjpy: 149.23, gbpusd: 1.2567 },
      ],
    },
  },
  "assets-gold": {
    indicators: [
      { name: "Gold", value: "$2,034.50", change: "+0.8%", trend: "up" },
      { name: "Silver", value: "$24.67", change: "-0.3%", trend: "down" },
      { name: "Oil (WTI)", value: "$78.45", change: "+1.2%", trend: "up" },
      { name: "Copper", value: "$3.85", change: "+0.5%", trend: "up" },
    ],
    chartData: {
      "1h": [
        { time: "9:00", gold: 2025, silver: 24.8, oil: 77.5 },
        { time: "9:15", gold: 2028, silver: 24.75, oil: 77.8 },
        { time: "9:30", gold: 2030, silver: 24.7, oil: 78.0 },
        { time: "9:45", gold: 2032, silver: 24.68, oil: 78.2 },
        { time: "10:00", gold: 2034, silver: 24.67, oil: 78.45 },
      ],
      "1d": [
        { time: "Asia", gold: 2025, silver: 24.8, oil: 77.5 },
        { time: "London", gold: 2030, silver: 24.7, oil: 78.0 },
        { time: "NY", gold: 2034, silver: 24.67, oil: 78.45 },
      ],
      "1w": [
        { time: "Mon", gold: 2010, silver: 25.0, oil: 76.0 },
        { time: "Wed", gold: 2020, silver: 24.8, oil: 77.0 },
        { time: "Fri", gold: 2034, silver: 24.67, oil: 78.45 },
      ],
      "1m": [
        { time: "Week 1", gold: 1980, silver: 25.5, oil: 74.0 },
        { time: "Week 2", gold: 2000, silver: 25.2, oil: 75.5 },
        { time: "Week 3", gold: 2015, silver: 24.9, oil: 77.0 },
        { time: "Week 4", gold: 2034, silver: 24.67, oil: 78.45 },
      ],
    },
  },
  housing: {
    indicators: [
      { name: "Case-Shiller Index", value: "312.4", change: "+4.2%", trend: "up" },
      { name: "Mortgage Rate", value: "7.12%", change: "+0.05%", trend: "up" },
      { name: "Housing Starts", value: "1.35M", change: "-2.1%", trend: "down" },
      { name: "Pending Sales", value: "98.5", change: "-1.8%", trend: "down" },
    ],
    chartData: {
      "1m": [
        { time: "Jan", caseShiller: 305, mortgageRate: 6.8, housingStarts: 1.45 },
        { time: "Feb", caseShiller: 308, mortgageRate: 6.9, housingStarts: 1.42 },
        { time: "Mar", caseShiller: 310, mortgageRate: 7.0, housingStarts: 1.38 },
        { time: "Apr", caseShiller: 312, mortgageRate: 7.12, housingStarts: 1.35 },
      ],
      "1y": [
        { time: "Q1", caseShiller: 290, mortgageRate: 6.2, housingStarts: 1.65 },
        { time: "Q2", caseShiller: 298, mortgageRate: 6.5, housingStarts: 1.55 },
        { time: "Q3", caseShiller: 305, mortgageRate: 6.8, housingStarts: 1.45 },
        { time: "Q4", caseShiller: 312, mortgageRate: 7.12, housingStarts: 1.35 },
      ],
    },
  },
  technology: {
    indicators: [
      { name: "NASDAQ 100", value: "16,234.56", change: "+0.9%", trend: "up" },
      { name: "SOX Index", value: "3,456.78", change: "+1.4%", trend: "up" },
      { name: "Tech P/E Ratio", value: "28.3", change: "+0.2", trend: "up" },
      { name: "Cloud Index", value: "1,234.56", change: "+0.7%", trend: "up" },
    ],
    chartData: {
      "1d": [
        { time: "9:30", nasdaq100: 16100, sox: 3400, cloud: 1220 },
        { time: "11:00", nasdaq100: 16180, sox: 3430, cloud: 1225 },
        { time: "1:00", nasdaq100: 16200, sox: 3445, cloud: 1230 },
        { time: "3:00", nasdaq100: 16235, sox: 3457, cloud: 1235 },
      ],
      "1w": [
        { time: "Mon", nasdaq100: 15900, sox: 3350, cloud: 1200 },
        { time: "Wed", nasdaq100: 16050, sox: 3400, cloud: 1215 },
        { time: "Fri", nasdaq100: 16235, sox: 3457, cloud: 1235 },
      ],
    },
  },
  healthcare: {
    indicators: [
      { name: "XLV ETF", value: "$134.56", change: "+0.6%", trend: "up" },
      { name: "Biotech Index", value: "4,567.89", change: "-0.4%", trend: "down" },
      { name: "Healthcare P/E", value: "16.8", change: "+0.1", trend: "up" },
      { name: "Pharma Index", value: "2,345.67", change: "+0.3%", trend: "up" },
    ],
    chartData: {
      "1d": [
        { time: "9:30", xlv: 133.8, biotech: 4580, pharma: 2340 },
        { time: "11:00", xlv: 134.2, biotech: 4570, pharma: 2342 },
        { time: "1:00", xlv: 134.4, biotech: 4568, pharma: 2344 },
        { time: "3:00", xlv: 134.56, biotech: 4568, pharma: 2346 },
      ],
      "1w": [
        { time: "Mon", xlv: 133.0, biotech: 4600, pharma: 2330 },
        { time: "Wed", xlv: 133.8, biotech: 4580, pharma: 2338 },
        { time: "Fri", xlv: 134.56, biotech: 4568, pharma: 2346 },
      ],
    },
  },
  industrial: {
    indicators: [
      { name: "Dow Jones", value: "34,567.12", change: "+0.4%", trend: "up" },
      { name: "Industrial PMI", value: "48.7", change: "-0.3", trend: "down" },
      { name: "Copper Price", value: "$3.85", change: "+0.8%", trend: "up" },
      { name: "Manufacturing Index", value: "52.3", change: "+0.5", trend: "up" },
    ],
    chartData: {
      "1d": [
        { time: "9:30", dow: 34450, copper: 3.8, manufacturing: 52.0 },
        { time: "11:00", dow: 34500, copper: 3.82, manufacturing: 52.1 },
        { time: "1:00", dow: 34540, copper: 3.84, manufacturing: 52.2 },
        { time: "3:00", dow: 34567, copper: 3.85, manufacturing: 52.3 },
      ],
      "1w": [
        { time: "Mon", dow: 34300, copper: 3.75, manufacturing: 51.8 },
        { time: "Wed", dow: 34450, copper: 3.8, manufacturing: 52.0 },
        { time: "Fri", dow: 34567, copper: 3.85, manufacturing: 52.3 },
      ],
    },
  },
  "life-sciences": {
    indicators: [
      { name: "IBB ETF", value: "$123.45", change: "+0.3%", trend: "up" },
      { name: "Pharma Index", value: "2,345.67", change: "+0.7%", trend: "up" },
      { name: "R&D Spending", value: "$198B", change: "+5.2%", trend: "up" },
      { name: "Clinical Trials", value: "3,456", change: "+12", trend: "up" },
    ],
    chartData: {
      "1d": [
        { time: "9:30", ibb: 123.2, pharma: 2340, trials: 3440 },
        { time: "11:00", ibb: 123.3, pharma: 2342, trials: 3445 },
        { time: "1:00", ibb: 123.4, pharma: 2344, trials: 3450 },
        { time: "3:00", ibb: 123.45, pharma: 2346, trials: 3456 },
      ],
      "1w": [
        { time: "Mon", ibb: 122.8, pharma: 2330, trials: 3420 },
        { time: "Wed", ibb: 123.1, pharma: 2338, trials: 3440 },
        { time: "Fri", ibb: 123.45, pharma: 2346, trials: 3456 },
      ],
    },
  },
}

export function MarketIndicatorDashboard({
  marketView,
  timescale = "1d",
  isPopout = false,
}: MarketIndicatorDashboardProps) {
  const data = marketData[marketView as keyof typeof marketData] || marketData["stocks-etf"]

  const getChartData = () => {
    const availableTimescales = Object.keys(data.chartData)
    let chartData
    if (data.chartData[timescale as keyof typeof data.chartData]) {
      chartData = data.chartData[timescale as keyof typeof data.chartData]
    } else {
      // Fallback to first available timescale
      chartData = data.chartData[availableTimescales[0] as keyof typeof data.chartData]
    }

    return generateChartData(chartData, timescale)
  }

  const chartData = getChartData()

  return (
    <div className="space-y-6">
      {isPopout && (
        <div>
          <h2 className="text-2xl font-serif font-bold mb-2">Market Indicator Tracking</h2>
          <p className="text-muted-foreground">
            Real-time market indicators and key metrics for {marketView.replace("-", " & ").toUpperCase()} -{" "}
            {timescale.toUpperCase()} view
          </p>
        </div>
      )}

      {!isPopout && (
        <div>
          <h2 className="text-2xl font-serif font-bold mb-2">Market Indicator Tracking</h2>
          <p className="text-muted-foreground">
            Real-time market indicators and key metrics for {marketView.replace("-", " & ").toUpperCase()} -{" "}
            {timescale.toUpperCase()} view
          </p>
        </div>
      )}

      {/* Key Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.indicators.map((indicator, index) => (
          <Card key={indicator.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{indicator.name}</p>
                  <p className="text-2xl font-bold">{indicator.value}</p>
                </div>
                <div
                  className={`flex items-center gap-1 ${indicator.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {indicator.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">{indicator.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Market Performance</CardTitle>
          <CardDescription>Performance tracking - {timescale.toUpperCase()} timeframe</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey={Object.keys(chartData[0])[1]}
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey={Object.keys(chartData[0])[2]}
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey={Object.keys(chartData[0])[3]}
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {timescale === "1y" && <QuarterLabels />}
        </CardContent>
      </Card>

      {/* Market Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Market Sentiment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Bull/Bear Ratio</span>
                <span className="text-sm font-medium">68%</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Volume Strength</span>
                <span className="text-sm font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Momentum</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Key Levels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Resistance</span>
              <Badge variant="outline" className="text-red-600">
                4,580
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current</span>
              <Badge variant="secondary">4,567</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Support</span>
              <Badge variant="outline" className="text-green-600">
                4,520
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">50-Day MA</span>
              <Badge variant="outline">4,545</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
