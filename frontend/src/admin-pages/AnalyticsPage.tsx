import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { revenueData } from './mockData';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Detailed insights and performance metrics
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Average Booking Value
              </p>
              <h3 className="text-3xl font-bold text-foreground">$758</h3>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-chart-2" />
                <span className="text-sm text-chart-2">+15.3% vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Cancellation Rate
              </p>
              <h3 className="text-3xl font-bold text-foreground">2.4%</h3>
              <div className="flex items-center gap-1">
                <TrendingDown className="h-4 w-4 text-chart-2" />
                <span className="text-sm text-chart-2">-0.8% vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Return Rate
              </p>
              <h3 className="text-3xl font-bold text-foreground">68%</h3>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-chart-2" />
                <span className="text-sm text-chart-2">+5.2% vs last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Width Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Bookings Comparison</CardTitle>
          <CardDescription>
            Track revenue and booking trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'oklch(0.554 0.046 257.417)' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: 'oklch(0.554 0.046 257.417)' }}
                  tickLine={false}
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: 'oklch(0.554 0.046 257.417)' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(1 0 0)',
                    border: '1px solid oklch(0.929 0.013 255.508)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.488 0.243 264.376)"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="oklch(0.696 0.17 162.48)"
                  strokeWidth={2}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
