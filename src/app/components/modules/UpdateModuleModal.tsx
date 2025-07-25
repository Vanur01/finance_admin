"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useModuleStore from "@/lib/stores/moduleStore";
import { X, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Module } from "@/app/api/moduleApi";

interface UpdateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: Module;
}

export default function UpdateModuleModal({ isOpen, onClose, module }: UpdateModuleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateModule } = useModuleStore();
  const { toast } = useToast();

  useEffect(() => {
    if (module) {
      setName(module.name || "");
      setDescription(module.description || "");
      setPrice(module.price?.toString() || "");
      setIsActive(module.isActive);
    }
  }, [module]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be a positive number.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateModule(module._id, {
        name,
        description,
        price: priceValue,
        isActive,
      });

      toast({
        title: "Success",
        description: "Module updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update module: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Update Module
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Module Name</Label>
            <Input
              id="name"
              placeholder="e.g., CRM, IVR, Sales Tracking"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the module functionality..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              type="number"
              placeholder="499"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="isActive" className="flex items-center space-x-2 cursor-pointer">
              <span>Active Status</span>
            </Label>
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <span className="text-sm text-muted-foreground ml-2">
              {isActive ? (
                <span className="text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Active
                </span>
              ) : (
                <span className="text-gray-500 flex items-center">
                  <X className="w-4 h-4 mr-1" />
                  Inactive
                </span>
              )}
            </span>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? "Updating..." : "Update Module"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
