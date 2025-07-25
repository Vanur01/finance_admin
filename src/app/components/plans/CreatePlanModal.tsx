"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import usePlanStore from "@/lib/stores/planStore";
import useModuleStore from "@/lib/stores/moduleStore";
import { X, Plus, MinusCircle } from "lucide-react";
import { Module } from "@/app/api/moduleApi";
import { PlanName } from "@/app/api/planApi";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePlanModal({
  isOpen,
  onClose,
}: CreatePlanModalProps) {
  const [name, setName] = useState<PlanName>("Popular");
  const [description, setDescription] = useState("");
  const [maxUsers, setMaxUsers] = useState("2");
  const [maxManagers, setMaxManagers] = useState("1");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const { addPlan } = usePlanStore();
  const { modules, fetchModules } = useModuleStore();
  const { toast } = useToast();

  // Fetch modules when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchModules();
    }
  }, [isOpen, fetchModules]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setName("Popular");
      setDescription("");
      setMaxUsers("2");
      setMaxManagers("1");
      setSelectedModules([]);
      setIsSubmitting(false);
      setTotalPrice(0);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !maxUsers || !maxManagers || (name !== "Free" && selectedModules.length === 0)) {
      toast({
        title: "Validation Error",
        description: name !== "Free" 
          ? "Please fill in all required fields and select at least one module."
          : "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const maxUsersValue = parseInt(maxUsers, 10);
    const maxManagersValue = parseInt(maxManagers, 10);

    if (
      isNaN(maxUsersValue) ||
      maxUsersValue <= 0 ||
      isNaN(maxManagersValue) ||
      maxManagersValue <= 0
    ) {
      toast({
        title: "Invalid Input",
        description: "Max users and managers must be positive numbers.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await addPlan({
        name,
        description,
        isActive: true,
        maxUsers: maxUsersValue,
        maxManagers: maxManagersValue,
        modules: name === "Free" ? [] : selectedModules,
      });

      toast({
        title: "Success",
        description: "Plan created successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create plan: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules((prev) => {
      const newSelection = prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId];
      
      // Recalculate price when modules change
      calculateTotalPrice(newSelection);
      return newSelection;
    });
  };

  const calculateTotalPrice = (selectedModuleIds: string[] = selectedModules) => {
    if (name === "Free") {
      setTotalPrice(0);
      return;
    }
    
    const total = selectedModuleIds.reduce((sum, moduleId) => {
      const module = modules.find(m => m._id === moduleId);
      return sum + (module?.price || 0);
    }, 0);
    
    setTotalPrice(total);
  };

  // Calculate price when modules or plan name changes
  useEffect(() => {
    calculateTotalPrice();
  }, [modules, name]);

  const activeModules = modules.filter((module) => module.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Create New Plan
         
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Select
              value={name}
              onValueChange={(value) => setName(value as PlanName)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a plan name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Free">Free</SelectItem>
                <SelectItem value="Popular">Popular</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Plan name must be one of: Free, Popular, or Custom
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the plan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">Max Users</Label>
              <Input
                id="maxUsers"
                type="number"
                min="1"
                placeholder="2"
                value={maxUsers}
                onChange={(e) => setMaxUsers(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxManagers">Max Managers</Label>
              <Input
                id="maxManagers"
                type="number"
                min="1"
                placeholder="1"
                value={maxManagers}
                onChange={(e) => setMaxManagers(e.target.value)}
              />
            </div>
          </div>

          {name === "Free" ? (
            <div className="p-4 bg-gray-50 rounded-md border">
              <p className="text-sm text-center font-medium">
                Free plan has no modules and zero price
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Select Modules</Label>
                <p className="text-sm font-medium">
                  Total Price: {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(totalPrice)}
                </p>
              </div>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                {activeModules.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2 text-center">
                    No active modules available
                  </p>
                ) : (
                  activeModules.map((module) => (
                    <div
                      key={module._id}
                      className="flex items-center space-x-2 py-2 border-b last:border-0"
                    >
                      <Checkbox
                        id={`module-${module._id}`}
                        checked={selectedModules.includes(module._id)}
                        onCheckedChange={() => toggleModuleSelection(module._id)}
                      />
                      <div className="flex flex-col">
                        <Label
                          htmlFor={`module-${module._id}`}
                          className="font-medium cursor-pointer"
                        >
                          {module.name}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {module.description}
                        </span>
                      </div>
                      <div className="ml-auto text-sm font-medium">
                        {new Intl.NumberFormat("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        }).format(module.price)}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {selectedModules.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {selectedModules.length} module(s) selected
                </p>
              )}
            </div>
          )}

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
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
