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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import usePlanStore from "@/lib/stores/planStore";
import useModuleStore from "@/lib/stores/moduleStore";
import { X, Check } from "lucide-react";
import { Module } from "@/app/api/moduleApi";
import { Plan, PlanName } from "@/app/api/planApi";

interface UpdatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan;
}

export default function UpdatePlanModal({
  isOpen,
  onClose,
  plan,
}: UpdatePlanModalProps) {
  const [name, setName] = useState<PlanName>("Popular");
  const [description, setDescription] = useState("");
  const [maxUsers, setMaxUsers] = useState("");
  const [maxManagers, setMaxManagers] = useState("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const { updatePlan } = usePlanStore();
  const { modules, fetchModules } = useModuleStore();
  const { toast } = useToast();

  // Fetch modules when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchModules();
    }
  }, [isOpen, fetchModules]);

  // Set initial values
  useEffect(() => {
    if (plan) {
      setName(plan.name as PlanName);
      setDescription(plan.description || "");
      setMaxUsers(plan.maxUsers?.toString() || "");
      setMaxManagers(plan.maxManagers?.toString() || "");
      setIsActive(plan.isActive);
      setSelectedModules(
        plan.modules?.map((module) => module._id) || []
      );
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !maxUsers || !maxManagers || selectedModules.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and select at least one module.",
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
      await updatePlan(plan._id, {
        name,
        description,
        isActive,
        maxUsers: maxUsersValue,
        maxManagers: maxManagersValue,
        modules: selectedModules, // Use selected modules for all plan types
      });

      toast({
        title: "Success",
        description: "Plan updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update plan: ${(error as Error).message}`,
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
      // For Free plan, always set price to 0 regardless of selected modules
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            Update Plan
          
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

          <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Select Modules</Label>
                <p className="text-sm font-medium">
                  Total Price: {name === "Free" ? "Free" : new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(totalPrice)}
                </p>
              </div>
              <div className="border rounded-md p-4 space-y-2 max-h-60 overflow-y-auto">
                {modules.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2 text-center">
                    No modules available
                  </p>
                ) : (
                  modules.map((module) => (
                    <div
                      key={module._id}
                      className="flex items-center space-x-2 py-2 border-b last:border-0"
                    >
                      <Checkbox
                        id={`module-${module._id}`}
                        checked={selectedModules.includes(module._id)}
                        onCheckedChange={() => toggleModuleSelection(module._id)}
                        disabled={!module.isActive}
                      />
                      <div className="flex flex-col">
                        <Label
                          htmlFor={`module-${module._id}`}
                          className={`font-medium cursor-pointer ${!module.isActive && "text-gray-400"}`}
                        >
                          {module.name}
                        </Label>
                        <span className={`text-xs ${!module.isActive ? "text-gray-400" : "text-muted-foreground"}`}>
                          {module.description}
                          {!module.isActive && " (Inactive)"}
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
              {isSubmitting ? "Updating..." : "Update Plan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
