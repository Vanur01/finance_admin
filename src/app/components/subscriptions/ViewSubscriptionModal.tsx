import { useState, useEffect } from 'react';
import { X, User, CreditCard, Calendar, DollarSign, Clock, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSubscriptionStore from "@/lib/stores/subscriptionStore";
import { Subscription } from "@/app/api/subscriptionApi";

interface ViewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptionId: string;
}

export default function ViewSubscriptionModal({ 
  isOpen, 
  onClose, 
  subscriptionId 
}: ViewSubscriptionModalProps) {
  const { 
    selectedSubscription, 
    loading, 
    fetchSubscriptionById,
    clearSelectedSubscription 
  } = useSubscriptionStore();

  useEffect(() => {
    if (isOpen && subscriptionId) {
      fetchSubscriptionById(subscriptionId);
    }
    
    return () => {
      if (!isOpen) {
        clearSelectedSubscription();
      }
    };
  }, [isOpen, subscriptionId, fetchSubscriptionById, clearSelectedSubscription]);

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
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading subscription details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!selectedSubscription) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-8">
            <span>Subscription not found</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Name</Label>
                  <p className="font-medium">{selectedSubscription.user.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Email</Label>
                  <p className="font-medium">{selectedSubscription.user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Plan Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Plan Name</Label>
                  <p className="font-medium">{selectedSubscription.plan.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Billing Cycle</Label>
                  <p className="font-medium capitalize">{selectedSubscription.billingCycle}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Monthly Price</Label>
                  <p className="font-medium">{formatCurrency(selectedSubscription.plan.billingCycle.monthly.price)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Yearly Price</Label>
                  <p className="font-medium">{formatCurrency(selectedSubscription.plan.billingCycle.yearly.price)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Subscription Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedSubscription.subscriptionStatus)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Payment Status</Label>
                  <div className="mt-1">
                    {getPaymentStatusBadge(selectedSubscription.paymentStatus)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Started At</Label>
                  <p className="font-medium">{formatDate(selectedSubscription.startedAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Expires At</Label>
                  <p className="font-medium">{formatDate(selectedSubscription.expiresAt)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Current Price</Label>
                  <p className="font-medium text-lg text-green-600">{formatCurrency(selectedSubscription.price)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Reminder</Label>
                  <p className="font-medium">{selectedSubscription.reminder ? 'Enabled' : 'Disabled'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Transaction ID</Label>
                  <p className="font-mono text-sm">{selectedSubscription.transactionId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Merchant Order ID</Label>
                  <p className="font-mono text-sm">{selectedSubscription.merchantOrderId}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Redirect URL</Label>
                  <p className="font-mono text-sm break-all">{selectedSubscription.redirectUrl}</p>
                </div>
              </div>
              {selectedSubscription.paymentUrl && (
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Payment URL</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedSubscription.paymentUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Payment URL
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Created At</Label>
                  <p className="font-medium">{formatDate(selectedSubscription.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Updated At</Label>
                  <p className="font-medium">{formatDate(selectedSubscription.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}