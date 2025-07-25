"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import useModuleStore from "@/lib/stores/moduleStore";
import { X } from "lucide-react";

interface CreateModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModuleModal({ isOpen, onClose }: CreateModuleModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { addModule } = useModuleStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setName("");
      setDescription("");
      setPrice("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

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
      await addModule({
        name,
        description,
        price: priceValue,
      });

      toast({
        title: "Success",
        description: "Module created successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create module: ${(error as Error).message}`,
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
            Create New Module
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
              {isSubmitting ? "Creating..." : "Create Module"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
