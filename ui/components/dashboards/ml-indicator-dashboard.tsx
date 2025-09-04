"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Brain, TrendingUp, TrendingDown, Zap, Target, AlertTriangle } from "lucide-react"

interface MLIndicatorDashboardProps {
  marketView: string
}

const mlSignals = [
  {
    name: "Momentum Predictor",
    confidence: 87,
    signal: "Bullish",
    strength: "Strong",
    timeframe: "5-10 days",
    accuracy: "78%",
  },
  {
    name: "Volatility Forecast",
    confidence: 92,
    signal: "Low Vol",
    strength: "High",
    timeframe: "1-3 days",
    accuracy: "85%",
  },
  {
    name: "Sentiment Analyzer",
    confidence: 74,
    signal: "Neutral",
    strength: "Medium",
    timeframe: "2-5 days",
    accuracy: "72%",
  },
  {
    name: "Pattern Recognition",
    confidence: 89,
    signal: "Bearish",
    strength: "Strong",
    timeframe: "3-7 days",
    accuracy: "81%",
  },
]

const predictionData = [
  { time: "Now", actual: 4567, predicted: 4567, confidence: 95 },
  { time: "+1D", actual: null, predicted: 4580, confidence: 87 },
  { time: "+2D", actual: null, predicted: 4595, confidence: 82 },
  { time: "+3D", actual: null, predicted: 4610, confidence: 78 },
  { time: "+5D", actual: null, predicted: 4625, confidence: 71 },
  { time: "+7D", actual: null, predicted: 4640, confidence: 65 },
]

const modelPerformance = [
  { model: "LSTM Neural Network", accuracy: 78, precision: 82, recall: 75 },
  { model: "Random Forest", accuracy: 74, precision: 79, recall: 71 },
  { model: "Gradient Boosting", accuracy: 81, precision: 85, recall: 78 },
  { model: "Transformer Model", accuracy: 85, precision: 88, recall: 82 },
]

const riskFactors = [
  { factor: "Market Volatility", impact: 85, trend: "increasing" },
  { factor: "Economic Indicators", impact: 72, trend: "stable" },
  { factor: "Geopolitical Events", impact: 68, trend: "increasing" },
  { factor: "Sector Rotation", impact: 45, trend: "decreasing" },
  { factor: "Liquidity Conditions", impact: 38, trend: "stable" },
]

const radarData = [
  { subject: "Momentum", A: 85, fullMark: 100 },
  { subject: "Volume", A: 72, fullMark: 100 },
  { subject: "Volatility", A: 68, fullMark: 100 },
  { subject: "Sentiment", A: 78, fullMark: 100 },
  { subject: "Technical", A: 82, fullMark: 100 },
  { subject: "Fundamental", A: 65, fullMark: 100 },
]

export function MLIndicatorDashboard({ marketView }: MLIndicatorDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">Smart Machine Learning Indicators</h2>
        <p className="text-muted-foreground">AI-powered market predictions and intelligent trading signals</p>
      </div>

      {/* ML Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="text-2xl font-bold text-primary">87%</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center gap-1 mt-2 text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="text-sm">High confidence</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Running predictions</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-bold text-green-600">81%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className="text-2xl font-bold text-amber-600">Medium</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Market conditions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Signals */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">AI Trading Signals</CardTitle>
              <CardDescription>Machine learning generated market predictions and signals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mlSignals.map((signal, index) => (
                <div key={signal.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                      <Brain className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{signal.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Accuracy: {signal.accuracy} • {signal.timeframe}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant={
                        signal.signal === "Bullish"
                          ? "default"
                          : signal.signal === "Bearish"
                            ? "destructive"
                            : "secondary"
                      }
                      className="mb-1"
                    >
                      {signal.signal}
                    </Badge>
                    <div className="text-xs text-muted-foreground">{signal.strength}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{signal.confidence}%</div>
                    <Progress value={signal.confidence} className="w-16 h-2 mt-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prediction Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="font-serif">AI Price Predictions</CardTitle>
              <CardDescription>Machine learning forecast with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["dataMin - 20", "dataMax + 20"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={3}
                      connectNulls={false}
                      name="Actual Price"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="AI Prediction"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Model Performance & Risk */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Model Performance</CardTitle>
              <CardDescription>AI model accuracy metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {modelPerformance.map((model) => (
                <div key={model.model} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{model.model}</span>
                    <Badge variant="outline">{model.accuracy}%</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Precision</span>
                      <span>{model.precision}%</span>
                    </div>
                    <Progress value={model.precision} className="h-1" />
                    <div className="flex justify-between text-xs">
                      <span>Recall</span>
                      <span>{model.recall}%</span>
                    </div>
                    <Progress value={model.recall} className="h-1" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-serif">Market Analysis Radar</CardTitle>
              <CardDescription>Multi-factor market assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Market Factors"
                      dataKey="A"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="font-serif">Risk Factors</CardTitle>
              <CardDescription>AI-identified market risks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {riskFactors.map((risk) => (
                <div key={risk.factor} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{risk.factor}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={risk.impact} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-8">{risk.impact}%</span>
                    </div>
                  </div>
                  <div
                    className={`ml-2 ${risk.trend === "increasing" ? "text-red-600" : risk.trend === "decreasing" ? "text-green-600" : "text-gray-600"}`}
                  >
                    {risk.trend === "increasing" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : risk.trend === "decreasing" ? (
                      <TrendingDown className="h-4 w-4" />
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-gray-400" />
                    )}
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
