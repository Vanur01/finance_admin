"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useModuleStore from "@/lib/stores/moduleStore";
import { X, Calculator, ArrowRight } from "lucide-react";

interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PriceCalculatorModal({ isOpen, onClose }: PriceCalculatorModalProps) {
  const { 
    modules, 
    selectedModuleIds, 
    calculatedPrice, 
    calculateSelectedModulesPrice, 
    loading
  } = useModuleStore();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (isOpen && selectedModuleIds.length > 0 && !calculatedPrice) {
      handleCalculatePrice();
    }
  }, [isOpen, selectedModuleIds]);

  const handleCalculatePrice = async () => {
    if (selectedModuleIds.length === 0) {
      toast({
        title: "No Modules Selected",
        description: "Please select at least one module to calculate the price.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsCalculating(true);
      await calculateSelectedModulesPrice();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to calculate price: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calculator className="mr-2 h-5 w-5" />
            Module Price Calculator
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {loading || isCalculating ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Calculating...</span>
            </div>
          ) : calculatedPrice ? (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="font-medium text-lg mb-2">Price Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Modules:</span>
                    <span className="font-medium">{calculatedPrice.totalModules}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Price:</span>
                    <span className="text-primary">{formatCurrency(calculatedPrice.totalPrice)}</span>
                  </div>
                </div>
                <div className="space-y-3 border-t pt-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Module Breakdown</h4>
                  {calculatedPrice.moduleDetails.map((module) => (
                    <div key={module.id} className="flex justify-between items-center">
                      <span>{module.name}</span>
                      <span className="font-medium">{formatCurrency(module.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
              <Calculator className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Select modules to calculate the combined price
              </p>
              <Button 
                onClick={handleCalculatePrice} 
                disabled={selectedModuleIds.length === 0}
              >
                Calculate Price
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
