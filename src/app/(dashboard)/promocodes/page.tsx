"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  CheckCircle2,
  XCircle,
  Ticket,
} from "lucide-react";
import usePromoCodeStore from "@/lib/stores/promoCodeStore";
import { useToast } from "@/components/ui/use-toast";
import CreatePromoCodeModal from "@/app/components/promocodes/CreatePromoCodeModal";
import UpdatePromoCodeModal from "@/app/components/promocodes/UpdatePromoCodeModal";
import { PromoCode } from "@/app/api/promoCodeApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PromoCodesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [promoCodeToUpdate, setPromoCodeToUpdate] = useState<PromoCode | null>(null);
  const [promoCodeToDeactivate, setPromoCodeToDeactivate] = useState<PromoCode | null>(null);

  const {
    promoCodes,
    loading,
    fetchPromoCodes,
    updatePromoCode,
    total,
  } = usePromoCodeStore();

  const { toast } = useToast();

  useEffect(() => {
    fetchPromoCodes();
  }, [fetchPromoCodes]);

  const handleDeactivate = async () => {
    if (promoCodeToDeactivate) {
      try {
        await updatePromoCode(promoCodeToDeactivate._id, { isActive: false });
        toast({
          title: "Promo Code Deactivated",
          description: `${promoCodeToDeactivate.promocode} has been deactivated successfully.`,
        });
        setPromoCodeToDeactivate(null);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to deactivate promo code: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const formatExpiryDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDiscount = (amount: number, type: string) => {
    if (type === "percentage") {
      return `${amount}%`;
    } else {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amount);
    }
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promo Codes Management</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Promo Code
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="mr-2 h-5 w-5" />
            Promo Codes
          </CardTitle>
          <CardDescription>
            Manage discount promo codes for your subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Loading promo codes...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Promo Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {promoCodes.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center"
                      >
                        No promo codes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    promoCodes.map((promoCode) => (
                      <TableRow key={promoCode._id}>
                        <TableCell className="font-medium">
                          {promoCode.promocode}
                        </TableCell>
                        <TableCell>
                          {formatDiscount(promoCode.discount, promoCode.discountType)}
                          <span className="text-xs ml-1 text-muted-foreground">
                            ({promoCode.discountType === "percentage" ? "percentage" : "fixed amount"})
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{formatExpiryDate(promoCode.expiresAt)}</span>
                            {isExpired(promoCode.expiresAt) && (
                              <span className="text-xs text-red-500">Expired</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {promoCode.isActive ? (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                            >
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Active
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Inactive
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setPromoCodeToUpdate(promoCode)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {promoCode.isActive && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setPromoCodeToDeactivate(promoCode)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isCreateModalOpen && (
        <CreatePromoCodeModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {promoCodeToUpdate && (
        <UpdatePromoCodeModal
          isOpen={!!promoCodeToUpdate}
          onClose={() => setPromoCodeToUpdate(null)}
          promoCode={promoCodeToUpdate}
        />
      )}

      <AlertDialog
        open={!!promoCodeToDeactivate}
        onOpenChange={() => setPromoCodeToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-500">
              <Trash className="h-5 w-5 mr-2" />
              Confirm Deactivation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate the promo code
              <strong> {promoCodeToDeactivate?.promocode}</strong>? Users will no longer be able to use this code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-red-500 hover:bg-red-600"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
