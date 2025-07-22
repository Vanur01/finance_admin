'use client';

import { useState, useEffect } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ChartData, ChartOptions, TooltipItem } from 'chart.js';
import RevenueTabs from '@/app/components/revenue/revenueTabs';
import { useRevenueStore } from '@/lib/stores/revenueStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock transaction data
const transactionData = [
  { 
    name: 'Acme Corp',
    plan: 'Enterprise',
    dateOfPurchase: '2025-06-01',
    price: 10000,
    gst: 1800,
    transactionId: 'TRX-001-2025'
  },
  { 
    name: 'Tech Solutions Inc',
    plan: 'Pro',
    dateOfPurchase: '2025-05-15',
    price: 1500,
    gst: 270,
    transactionId: 'TRX-002-2025'
  },
  { 
    name: 'Digital Dynamics',
    plan: 'Basic',
    dateOfPurchase: '2025-05-01',
    price: 300,
    gst: 54,
    transactionId: 'TRX-003-2025'
  },
  { 
    name: 'Global Services Ltd',
    plan: 'Enterprise',
    dateOfPurchase: '2025-04-28',
    price: 10000,
    gst: 1800,
    transactionId: 'TRX-004-2025'
  },
  { 
    name: 'StartUp Co',
    plan: 'Pro',
    dateOfPurchase: '2025-04-15',
    price: 1500,
    gst: 270,
    transactionId: 'TRX-005-2025'
  },
];

export default function RevenuePage() {
  const [timeRange, setTimeRange] = useState('6m');
  const { analytics, analyticsLoading, analyticsError, fetchAnalytics } = useRevenueStore();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Convert analytics data to chart format
  const monthlyRevenueData = analytics?.monthlyRevenue.map(item => ({
    month: new Date(2024, item.month - 1).toLocaleDateString('en-US', { month: 'short' }),
    revenue: item.revenue
  })) || [];

  const planRevenueData = analytics?.revenueByPlan.map(item => ({
    plan: item.planName,
    revenue: item.totalRevenue,
    subscribers: item.totalSubscriptions
  })) || [];

  // Chart.js configuration
  const chartData: ChartData<'line'> = {
    labels: monthlyRevenueData.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenueData.map(item => item.revenue),
        fill: false,
        borderColor: '#3b82f6',
        backgroundColor: '#3b82f6',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#1e293b',
        bodyColor: '#1e293b',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (context: TooltipItem<'line'>) => `Revenue: $${context.parsed.y.toLocaleString()}`
        }
      },
    },
    scales: {
      x: {
        type: 'category',
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
        },
      },
      y: {
        type: 'linear',
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
          callback: function(value) {
            if (typeof value === 'number') {
              return `$${value.toLocaleString()}`;
            }
            return value;
          }
        },
      },
    },
  };

  if (analyticsLoading) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Error: {analyticsError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto  min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Revenue Analytics</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Total MRR</p>
          <p className="text-2xl font-bold">${analytics?.MRR.toLocaleString() || '0'}</p>
          <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Churn Rate</p>
          <p className="text-2xl font-bold">{analytics?.churnRate || '0%'}</p>
          <p className="text-xs text-muted-foreground">Customer churn rate</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
          <p className="text-2xl font-bold">${analytics?.totalRevenue.toLocaleString() || '0'}</p>
          <p className="text-xs text-muted-foreground">Total revenue to date</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground mb-2">Active Subscribers</p>
          <p className="text-2xl font-bold">{analytics?.activeSubscriptions || '0'}</p>
          <p className="text-xs text-muted-foreground">Active subscriptions</p>
        </Card>
      </div>

      <RevenueTabs
        monthlyRevenueData={monthlyRevenueData}
        planRevenueData={planRevenueData}
        transactionData={transactionData}
        chartData={chartData}
        chartOptions={chartOptions}
      />
    </div>
  );
}
