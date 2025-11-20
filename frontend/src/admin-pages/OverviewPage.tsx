import React from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  Building2,
  Calendar,
  Users,
  User,
  ChevronRight,
} from 'lucide-react';
import { revenueData, bookingStats, occupancyData, recentBookings } from './mockData';

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your dorms today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-2">
                  ฿68,000
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                  <span className="text-sm font-medium text-chart-2">
                    +12.5%
                  </span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                <DollarSign className="h-6 w-6 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Occupancy Rate
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-2">95%</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-chart-1" />
                  <span className="text-sm font-medium text-chart-1">+5.2%</span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-1/10">
                <Building2 className="h-6 w-6 text-chart-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Bookings
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-2">190</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                  <span className="text-sm font-medium text-chart-3">+8.1%</span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-3/10">
                <Calendar className="h-6 w-6 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Rating
                </p>
                <h3 className="text-2xl font-bold text-foreground mt-2">4.8</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-4 w-4 text-chart-4" />
                  <span className="text-sm font-medium text-chart-4">+0.3</span>
                  <span className="text-xs text-muted-foreground">from last month</span>
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/10">
                <Users className="h-6 w-6 text-chart-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over the last 8 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="oklch(0.488 0.243 264.376)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="oklch(0.488 0.243 264.376)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: 'oklch(0.554 0.046 257.417)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'oklch(0.554 0.046 257.417)' }}
                    tickLine={false}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.929 0.013 255.508)',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`$${value}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.488 0.243 264.376)"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Bookings</CardTitle>
            <CardDescription>Bookings for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingStats}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'oklch(0.554 0.046 257.417)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'oklch(0.554 0.046 257.417)' }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.929 0.013 255.508)',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [value, 'Bookings']}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="oklch(0.696 0.17 162.48)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Room Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle>Room Occupancy</CardTitle>
            <CardDescription>Current room distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(1 0 0)',
                      border: '1px solid oklch(0.929 0.013 255.508)',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${value}%`, 'Occupancy']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {occupancyData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Bookings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking activities</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {booking.guest}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.room}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ฿{booking.amount}
                    </p>
                    <Badge
                      variant={
                        booking.status === 'Confirmed' ? 'default' : 'secondary'
                      }
                      className="mt-1"
                    >
                      {booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
