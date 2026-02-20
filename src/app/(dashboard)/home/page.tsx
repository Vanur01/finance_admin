'use client';

import { useState, useEffect } from 'react';
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
  CreditCard,
  UserCheck,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useDashboardStore from "@/lib/stores/dashboardStore";
import { ActivityFeedItem } from "@/app/api/dashboardApi";

interface MetricCard {
  title: string;
  value: any;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  subtitle?: string;
  totalUsers?: number;
}

export default function DashboardHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const { dashboardData, loading, error, fetchDashboardData } = useDashboardStore();

  console.log("Dashboard", dashboardData);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
  };

  // Helper function to get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscription':
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case 'lead':
        return <Target className="w-5 h-5 text-blue-600" />;
      case 'booking':
        return <Calendar className="w-5 h-5 text-indigo-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  // Create metric cards from API data
  const getMetricCards = (): MetricCard[] => {
    if (!dashboardData) return [];
    
    // Check the actual structure of your dashboardData
    // Based on your usage in the summary stats section, it seems the data might be structured like this:
    const data = dashboardData;
    
    return [
      {
        title: 'Total Bookings',
        value: data?.totalBookings?.toString() || '0',
        change: 8.2,
        icon: <Calendar className="w-6 h-6 text-indigo-600" />,
        trend: 'up',
        subtitle: 'All time',
      },
      {
        title: 'Total Users',
        value: data?.totalUsers?.toString() || '0',
        change: 12.5,
        icon: <Users className="w-6 h-6 text-purple-600" />,
        trend: 'up',
        subtitle: 'All time',
      },
      {
        title: 'Paid Users',
        value: data?.totalPaidUsers?.toString() || '0',
        change: 4.1,
        icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
        trend: 'up',
        subtitle: 'Active subscriptions',
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(data?.totalRevenue || 0),
        change: 4.1,
        icon: <DollarSign className="w-6 h-6 text-green-600" />,
        trend: 'up',
        subtitle: 'All time',
      },
    ];
  };

  if (loading) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-red-500">
            <p>Error: {error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => fetchDashboardData()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const metricCards = getMetricCards();

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
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
        {/* Summary Stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Business Overview</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-900">{dashboardData?.totalLeads || 0}</p>
                <p className="text-sm text-blue-600">Total Leads</p>
              </div>
              <div className="text-center p-6 bg-indigo-50 rounded-lg">
                <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-900">{dashboardData?.totalBookings || 0}</p>
                <p className="text-sm text-indigo-600">Total Bookings</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{dashboardData?.totalUsers || 0}</p>
                <p className="text-sm text-purple-600">Total Users</p>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-lg">
                <UserCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-900">{dashboardData?.totalPaidUsers || 0}</p>
                <p className="text-sm text-emerald-600">Paid Users</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{formatCurrency(dashboardData?.totalRevenue || 0)}</p>
                <p className="text-sm text-green-600">Total Revenue</p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-900">{dashboardData?.summary?.totalTrialUsers || 0}</p>
                <p className="text-sm text-yellow-600">Trial Users</p>
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {dashboardData?.activityFeed?.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors"
                >
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{formatTime(activity.time)}</p>
                  </div>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
