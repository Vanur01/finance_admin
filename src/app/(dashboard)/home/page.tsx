'use client';

import { useState } from 'react';
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Bell,
  Search,
  Clock,
  Target,
  ArrowRight,
  CheckCircle,
  MoreHorizontal,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  subtitle?: string;
}

const metricCards: MetricCard[] = [
  {
    title: 'Total Leads',
    value: '1,234',
    change: 15.3,
    icon: <Target className="w-6 h-6 text-blue-600" />,
    trend: 'up',
    subtitle: 'Last 30 days',
  },
  {
    title: 'Demos Scheduled',
    value: '48',
    change: 8.2,
    icon: <Calendar className="w-6 h-6 text-indigo-600" />,
    trend: 'up',
    subtitle: 'Next 7 days',
  },
  {
    title: 'Trial Users',
    value: '156',
    change: 12.5,
    icon: <Users className="w-6 h-6 text-purple-600" />,
    trend: 'up',
    subtitle: '7-day active',
  },
  {
    title: 'Total Bookings',
    value: '89',
    change: -2.4,
    icon: <Clock className="w-6 h-6 text-rose-600" />,
    trend: 'down',
    subtitle: 'This month',
  },
  {
    title: 'Total Revenue',
    value: '$89,432',
    change: 4.1,
    icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
    trend: 'up',
    subtitle: 'This month',
  },
];

const funnelData = [
  { stage: 'Leads', count: 1324, color: '#3B82F6', bgColor: '#EFF6FF' },
  { stage: 'Demos', count: 214, color: '#60A5FA', bgColor: '#F0F9FF' },
  { stage: 'Trials', count: 47, color: '#93C5FD', bgColor: '#F8FAFC' },
  { stage: 'Paid', count: 22, color: '#BFDBFE', bgColor: '#F1F5F9' },
];

const demoData = [
  { week: 'Week 1', demos: 12 },
  { week: 'Week 2', demos: 19 },
  { week: 'Week 3', demos: 15 },
  { week: 'Week 4', demos: 22 },
  { week: 'Week 5', demos: 18 },
];

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 52000 },
  { month: 'Mar', revenue: 48000 },
  { month: 'Apr', revenue: 61000 },
  { month: 'May', revenue: 55000 },
  { month: 'Jun', revenue: 72000 },
];

const recentActivities = [
  {
    id: 1,
    type: 'demo',
    action: 'Raj scheduled a demo',
    time: '3 hrs ago',
    icon: <Calendar className="w-5 h-5 text-blue-600" />,
  },
  {
    id: 2,
    type: 'trial',
    action: 'Kavita started a 7-day trial',
    time: 'yesterday',
    icon: <CheckCircle className="w-5 h-5 text-green-600" />,
  },
  {
    id: 3,
    type: 'payment',
    action: '₹12,000 payment received',
    time: '2 days ago',
    icon: <DollarSign className="w-5 h-5 text-green-600" />,
  },
  {
    id: 4,
    type: 'lead',
    action: 'New lead from website',
    time: '2 days ago',
    icon: <Target className="w-5 h-5 text-blue-600" />,
  },
];

export default function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState('');

  const demoChartData = {
    labels: demoData.map(item => item.week),
    datasets: [
      {
        label: 'Demos',
        data: demoData.map(item => item.demos),
        borderColor: '#3B82F6',
        backgroundColor: '#3B82F6',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const demoChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 12,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const revenueChartData = {
    labels: revenueData.map(item => item.month),
    datasets: [
      {
        label: 'Revenue',
        data: revenueData.map(item => item.revenue),
        backgroundColor: '#3B82F6',
        borderRadius: 4,
      },
    ],
  };

  const revenueChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        bodyFont: {
          size: 12,
        },
        titleFont: {
          size: 12,
          weight: 'bold',
        },
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
            <Button variant="outline" size="icon">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metricCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${
                  index === 0 ? 'bg-blue-50' :
                  index === 1 ? 'bg-indigo-50' :
                  index === 2 ? 'bg-purple-50' :
                  index === 3 ? 'bg-rose-50' :
                  'bg-emerald-50'
                }`}>
                  {card.icon}
                </div>
                <Badge variant={card.trend === 'up' ? 'default' : 'destructive'} className="flex items-center gap-1">
                  {card.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  <span>{Math.abs(card.change)}%</span>
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">{card.title}</h3>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Leads Funnel</CardTitle>
                <CardDescription>Track your conversion rates</CardDescription>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  Total: 1,607
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  Conversion: 1.7%
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-6">
              {funnelData.map((item, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-full aspect-[3/4] rounded-xl mb-4 flex items-end justify-center p-4"
                      style={{ backgroundColor: item.bgColor }}
                    >
                      <div
                        className="w-full rounded-t-lg transition-all duration-300"
                        style={{ 
                          backgroundColor: item.color,
                          height: `${(item.count / funnelData[0].count) * 100}%`,
                          minHeight: '20px'
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold mb-1">{item.count}</p>
                      <p className="text-sm font-medium text-muted-foreground">{item.stage}</p>
                      {index < funnelData.length - 1 && (
                        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                          <ArrowRight className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Total Leads: 1,607</span>
                  <span>Conversion Rate: 1.7%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="flex items-center gap-1">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>12% from last month</span>
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Latest Activity</CardTitle>
                <CardDescription>Recent updates from your team</CardDescription>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demos Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Demos Scheduled</CardTitle>
                <CardDescription>Weekly demo bookings overview</CardDescription>
              </div>
              <Tabs defaultValue="week" className="w-[200px]">
                <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Line data={demoChartData} options={demoChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Monthly revenue overview</CardDescription>
              </div>
              <Tabs defaultValue="month" className="w-[200px]">
                <TabsList>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <Bar data={revenueChartData} options={revenueChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
