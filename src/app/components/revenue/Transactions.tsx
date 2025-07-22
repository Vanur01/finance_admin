'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { useRevenueStore } from '@/lib/stores/revenueStore';

export default function Transactions() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [columns, setColumns] = useState({
    clientName: true,
    plan: true,
    dateOfPurchase: true,
    price: true,
    gst: true,
    transactionId: true,
  });

  // Get data from store
  const { 
    subscriptions, 
    loading, 
    error, 
    totalAmount, 
    totalSubscriptions, 
    fetchSubscriptions, 
    resetError 
  } = useRevenueStore();

  // Fetch subscriptions data - memoized to prevent unnecessary re-renders
  const handleFetchSubscriptions = useCallback(async () => {
    const params: any = {};
    
    if (dateRange?.from) {
      params.startDate = format(dateRange.from, 'yyyy-MM-dd');
    }
    if (dateRange?.to) {
      params.endDate = format(dateRange.to, 'yyyy-MM-dd');
    }
    
    await fetchSubscriptions(params);
  }, [dateRange, fetchSubscriptions]);

  // Single useEffect to handle both initial load and date range changes
  useEffect(() => {
    handleFetchSubscriptions();
  }, [handleFetchSubscriptions]);

  const handleReset = () => {
    setDateRange(undefined);
    setColumns({
      clientName: true,
      plan: true,
      dateOfPurchase: true,
      price: true,
      gst: true,
      transactionId: true,
    });
    resetError();
    // Refetch data after reset
    handleFetchSubscriptions();
  };

  // Export to Excel with selected columns and date range
  const handleExport = () => {
    const exportData = subscriptions.map(subscription => {
      const row: Record<string, any> = {};
      if (columns.clientName) row['Client Name'] = subscription.user.name;
      if (columns.plan) row['Plan'] = subscription.plan.name;
      if (columns.dateOfPurchase) row['Start Date'] = new Date(subscription.startDate).toLocaleDateString();
      if (columns.price) row['Amount'] = subscription.amount || subscription.plan.price;
      if (columns.gst) row['GST Amount'] = subscription.gstAmount || 'N/A';
      if (columns.transactionId) row['Transaction ID'] = subscription.trancationId || subscription._id;
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Subscriptions");
    XLSX.writeFile(wb, `subscription_data_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Subscription History</h2>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <span>Columns</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2">
              <div className="flex flex-col gap-2">
                {Object.entries(columns).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setColumns(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleReset}
            variant="outline"
            className="px-4 py-2 text-sm font-medium"
          >
            Reset
          </Button>

          <Button 
            onClick={handleExport} 
            className="px-4 py-2 text-sm font-medium flex items-center gap-2"
            disabled={loading}
          >
            <Download className="w-4 h-4" />
            Export Excel
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-muted-foreground">Loading subscriptions...</div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-32">
          <div className="text-red-500">Error: {error}</div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.clientName && <TableHead>Client Name</TableHead>}
              {columns.plan && <TableHead>Plan</TableHead>}
              {columns.dateOfPurchase && <TableHead>Start Date</TableHead>}
              {columns.price && <TableHead>Amount</TableHead>}
              {columns.gst && <TableHead>GST Amount</TableHead>}
              {columns.transactionId && <TableHead>Transaction ID</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No subscriptions found
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow key={subscription._id}>
                  {columns.clientName && <TableCell>{subscription.user.name}</TableCell>}
                  {columns.plan && <TableCell>{subscription.plan.name}</TableCell>}
                  {columns.dateOfPurchase && (
                    <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                  )}
                  {columns.price && (
                    <TableCell>
                      ${subscription.amount ? parseFloat(subscription.amount).toLocaleString() : subscription.plan.price.toLocaleString()}
                    </TableCell>
                  )}
                  {columns.gst && (
                    <TableCell>
                      {subscription.gstAmount ? `$${parseFloat(subscription.gstAmount).toLocaleString()}` : 'N/A'}
                    </TableCell>
                  )}
                  {columns.transactionId && (
                    <TableCell>{subscription.trancationId || subscription._id}</TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Totals</TableCell>
              <TableCell>${totalAmount.toLocaleString()}</TableCell>
              <TableCell>{totalSubscriptions}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </Card>
  );
}
