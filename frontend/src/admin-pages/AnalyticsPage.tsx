import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown } from 'lucide-react';
import api from '@/api';
import Loader from '@/components/shared/loader';

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/analytics/detailed');
      setData(response.data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.error || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center max-w-md">
          <p className="text-destructive font-semibold mb-4">{error}</p>
          <Button onClick={fetchAnalyticsData}>Retry</Button>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { averageBookingValue, cancellationRate, successRate, revenueBookingsComparison } = data;

  const formatCurrency = (value: number) => `฿${value.toLocaleString()}`;
  const getTrendIcon = (change: number) => change >= 0 ? TrendingUp : TrendingDown;
  const getTrendColor = (change: number, inverse = false) => {
    if (inverse) {
      return change <= 0 ? 'text-chart-2' : 'text-destructive';
    }
    return change >= 0 ? 'text-chart-2' : 'text-destructive';
  };

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
              <h3 className="text-3xl font-bold text-foreground">
                {formatCurrency(averageBookingValue.current)}
              </h3>
              <div className="flex items-center gap-1">
                {React.createElement(getTrendIcon(averageBookingValue.change), {
                  className: `h-4 w-4 ${getTrendColor(averageBookingValue.change)}`
                })}
                <span className={`text-sm ${getTrendColor(averageBookingValue.change)}`}>
                  {averageBookingValue.change >= 0 ? '+' : ''}{averageBookingValue.change}% vs last {averageBookingValue.period}
                </span>
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
              <h3 className="text-3xl font-bold text-foreground">
                {cancellationRate.current}%
              </h3>
              <div className="flex items-center gap-1">
                {React.createElement(getTrendIcon(cancellationRate.change), {
                  className: `h-4 w-4 ${getTrendColor(cancellationRate.change, true)}`
                })}
                <span className={`text-sm ${getTrendColor(cancellationRate.change, true)}`}>
                  {cancellationRate.change >= 0 ? '+' : ''}{cancellationRate.change}% vs last {cancellationRate.period}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Success Rate
              </p>
              <h3 className="text-3xl font-bold text-foreground">
                {successRate.current}%
              </h3>
              <div className="flex items-center gap-1">
                {React.createElement(getTrendIcon(successRate.change), {
                  className: `h-4 w-4 ${getTrendColor(successRate.change)}`
                })}
                <span className={`text-sm ${getTrendColor(successRate.change)}`}>
                  {successRate.change >= 0 ? '+' : ''}{successRate.change}% vs last {successRate.period}
                </span>
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
              <LineChart data={revenueBookingsComparison}>
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
                  tickFormatter={(value) => `฿${value / 1000}k`}
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
                  formatter={(value: any, name: string) => {
                    if (name === 'Revenue (฿)') {
                      return [`฿${value.toLocaleString()}`, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="oklch(0.488 0.243 264.376)"
                  strokeWidth={2}
                  name="Revenue (฿)"
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
