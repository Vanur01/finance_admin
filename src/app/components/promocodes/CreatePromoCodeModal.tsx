"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import usePromoCodeStore from "@/lib/stores/promoCodeStore";
import { Check } from "lucide-react";
import { DiscountType } from "@/app/api/promoCodeApi";

interface CreatePromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePromoCodeModal({
  isOpen,
  onClose,
}: CreatePromoCodeModalProps) {
  const [promocode, setPromocode] = useState("");
  const [discount, setDiscount] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("fixed");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addPromoCode } = usePromoCodeStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!promocode || !discount || !expiresAt) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const discountValue = parseFloat(discount);
    if (isNaN(discountValue) || discountValue <= 0) {
      toast({
        title: "Invalid Input",
        description: "Discount must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    // Validate discount percentage (if it's percentage type)
    if (discountType === "percentage" && discountValue > 100) {
      toast({
        title: "Invalid Input",
        description: "Percentage discount cannot be greater than 100%.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addPromoCode({
        promocode: promocode.toUpperCase(),
        discount: discountValue,
        discountType,
        expiresAt: new Date(expiresAt).toISOString(),
        isActive,
      });

      toast({
        title: "Success",
        description: "Promo code created successfully",
      });
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create promo code: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setPromocode("");
    setDiscount("");
    setDiscountType("fixed");
    setExpiresAt("");
    setIsActive(true);
  };

  // Format today's date as YYYY-MM-DD for min date in date picker
  const today = new Date().toISOString().split("T")[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Promo Code</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="promocode">Promo Code</Label>
            <Input
              id="promocode"
              placeholder="Enter promo code (e.g., SUMMER50)"
              value={promocode}
              onChange={(e) => setPromocode(e.target.value.toUpperCase())}
              className="uppercase"
              maxLength={15}
            />
            <p className="text-sm text-muted-foreground">
              Promo code will be automatically converted to uppercase
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Amount</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step={discountType === "percentage" ? "1" : "100"}
                placeholder={discountType === "percentage" ? "10" : "1000"}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={discountType}
                onValueChange={(value) => setDiscountType(value as DiscountType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiry Date</Label>
            <Input
              id="expiresAt"
              type="date"
              min={today}
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label
              htmlFor="isActive"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <span>Active Status</span>
            </Label>
            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
            <span className="text-sm text-muted-foreground ml-2">
              {isActive ? (
                <span className="text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Active
                </span>
              ) : (
                "Inactive"
              )}
            </span>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Creating..." : "Create Promo Code"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
