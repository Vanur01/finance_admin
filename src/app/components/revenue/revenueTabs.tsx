'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Line } from "react-chartjs-2";
import { cn } from "@/lib/utils";
import type { ChartData, ChartOptions } from 'chart.js';
import Transactions from './Transactions';

interface RevenueTabsProps {
  monthlyRevenueData: Array<{ month: string; revenue: number }>;
  planRevenueData: Array<{ plan: string; revenue: number; subscribers: number }>;
  transactionData: Array<{
    name: string;
    plan: string;
    dateOfPurchase: string;
    price: number;
    gst: number;
    transactionId: string;
  }>;
  chartData: ChartData<'line'>;
  chartOptions: ChartOptions<'line'>;
}

export default function RevenueTabs({
  monthlyRevenueData,
  planRevenueData,
  transactionData,
  chartData,
  chartOptions
}: RevenueTabsProps) {
  const [activeTab, setActiveTab] = useState('monthly');

  return (
    <div className="mb-4">
      <div className="border-b flex gap-4 mb-4">
        <button
          onClick={() => setActiveTab('monthly')}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === 'monthly'
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          Monthly Revenue
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === 'plans'
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          Revenue by Plan
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === 'transactions'
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground"
          )}
        >
          Transactions
        </button>
      </div>

      {activeTab === 'monthly' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h2>
          {monthlyRevenueData.length > 0 ? (
            <div className="h-[400px]">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">No monthly revenue data available</p>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'plans' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Revenue by Plan</h2>
          {planRevenueData.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Subscribers</TableHead>
                  <TableHead>Average Revenue/User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {planRevenueData.map((plan) => (
                  <TableRow key={plan.plan}>
                    <TableCell>{plan.plan}</TableCell>
                    <TableCell>${plan.revenue.toLocaleString()}</TableCell>
                    <TableCell>{plan.subscribers}</TableCell>
                    <TableCell>
                      ${plan.subscribers > 0 ? (plan.revenue / plan.subscribers).toLocaleString() : '0'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center h-32">
              <p className="text-muted-foreground">No plan revenue data available</p>
            </div>
          )}
        </Card>
      )}

      {activeTab === 'transactions' && <Transactions />}
    </div>
  );
}