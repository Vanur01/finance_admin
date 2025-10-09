"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Calendar, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useSubscriptionStore from "@/lib/stores/subscriptionStore";
import ViewSubscriptionModal from "@/app/components/subscriptions/ViewSubscriptionModal";

const SubscriptionsPage = () => {
  const {
    subscriptions = [],
    loading,
    error,
    fetchSubscriptions,
    total,
    currentPage,
    totalPages,
  } = useSubscriptionStore();

  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    fetchSubscriptions({ page: 1, limit: 10 });
  }, [fetchSubscriptions]);



  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Pending
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Cancelled
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
            Expired
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            {status}
          </Badge>
        );
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Completed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
            Pending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Failed
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchSubscriptions({ page });
    }
  };

  if (loading && subscriptions.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  if (error && subscriptions.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fetchSubscriptions({ page: 1 })}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
      </div>

      {/* Subscriptions Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Billing Cycle</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No subscriptions found.
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((subscription) => (
                <TableRow key={subscription._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30">
                        <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{subscription.user.name}</p>
                        <p className="text-sm text-muted-foreground">{subscription.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{subscription.plan.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{subscription.billingCycle}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(subscription.subscriptionStatus)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(subscription.paymentStatus)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      {formatCurrency(subscription.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatDate(subscription.expiresAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 cursor-pointer hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        title="View Subscription"
                        onClick={() => {
                          setSelectedSubscriptionId(subscription._id);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-center py-4 border-t gap-2">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
              isLoading={loading}
              showFirstLast={true}
              className="mt-2"
            />
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages} ({total} total subscriptions)
            </div>
          </div>
        )}
      </Card>

      {/* View Subscription Modal */}
      {selectedSubscriptionId && (
        <ViewSubscriptionModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSubscriptionId(null);
          }}
          subscriptionId={selectedSubscriptionId}
        />
      )}
    </div>
  );
};

export default SubscriptionsPage;