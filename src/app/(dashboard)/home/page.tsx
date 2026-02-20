'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  Target,
  CreditCard,
  UserCheck,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useDashboardStore from "@/lib/stores/dashboardStore";

// Define the proper types based on your actual data structure
interface DashboardData {
  totalBookings: number;
  totalUsers: number;
  totalPaidUsers: number;
  totalRevenue: number;
  totalLeads: number;
  summary?: {
    totalTrialUsers: number;
  };
  activityFeed?: ActivityItem[];
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
}

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  subtitle?: string;
}

export default function DashboardHome() {
  const { dashboardData, loading, error, fetchDashboardData } = useDashboardStore();

  console.log("Dashboard", dashboardData);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Helper function to format currency
  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
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

  // Safely access dashboard data with defaults
  const data = dashboardData as DashboardData | null;
  
  const totalBookings = data?.totalBookings ?? 0;
  const totalUsers = data?.totalUsers ?? 0;
  const totalPaidUsers = data?.totalPaidUsers ?? 0;
  const totalRevenue = data?.totalRevenue ?? 0;
  const totalLeads = data?.totalLeads ?? 0;
  const totalTrialUsers = data?.summary?.totalTrialUsers ?? 0;
  const activityFeed = data?.activityFeed ?? [];

  // Create metric cards
  const metricCards: MetricCard[] = [
    {
      title: 'Total Bookings',
      value: totalBookings.toString(),
      change: 8.2,
      icon: <Calendar className="w-6 h-6 text-indigo-600" />,
      trend: 'up',
      subtitle: 'All time',
    },
    {
      title: 'Total Users',
      value: totalUsers.toString(),
      change: 12.5,
      icon: <Users className="w-6 h-6 text-purple-600" />,
      trend: 'up',
      subtitle: 'All time',
    },
    {
      title: 'Paid Users',
      value: totalPaidUsers.toString(),
      change: 4.1,
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      trend: 'up',
      subtitle: 'Active subscriptions',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: 4.1,
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      trend: 'up',
      subtitle: 'All time',
    },
  ];

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
          <div className="text-center text-red-600">
            <p className="mb-4">Error: {error}</p>
            <Button
              variant="outline"
 onClick={() => fetchDashboardData()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${
                  index === 0 ? 'bg-blue-50' :
                  index === 1 ? 'bg-indigo-50' :
                  index === 2 ? 'bg-purple-50' :
                  'bg-green-50'
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
                <p className="text-2xl font-bold text-blue-900">{totalLeads}</p>
                <p className="text-sm text-blue-600">Total Leads</p>
              </div>
              <div className="text-center p-6 bg-indigo-50 rounded-lg">
                <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-indigo-900">{totalBookings}</p>
                <p className="text-sm text-indigo-600">Total Bookings</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-900">{totalUsers}</p>
                <p className="text-sm text-purple-600">Total Users</p>
              </div>
              <div className="text-center p-6 bg-emerald-50 rounded-lg">
                <UserCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-emerald-900">{totalPaidUsers}</p>
                <p className="text-sm text-emerald-600">Paid Users</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-green-600">Total Revenue</p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-900">{totalTrialUsers}</p>
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
              {activityFeed.length > 0 ? (
                activityFeed.map((activity, index) => (
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
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
