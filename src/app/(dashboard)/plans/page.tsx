"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  Package,
  UserCog,
  FileBarChart,
  Users,
} from "lucide-react";
import usePlanStore from "@/lib/stores/planStore";
import { useToast } from "@/components/ui/use-toast";
import CreatePlanModal from "@/app/components/plans/CreatePlanModal";
import UpdatePlanModal from "@/app/components/plans/UpdatePlanModal";
import { Plan } from "@/app/api/planApi";
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

export default function PlansPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [planToUpdate, setPlanToUpdate] = useState<Plan | null>(null);
  const [planToDeactivate, setPlanToDeactivate] = useState<Plan | null>(null);

  const { plans, loading, fetchPlans, updatePlan, total } = usePlanStore();

  const { toast } = useToast();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleDeactivate = async () => {
    if (planToDeactivate) {
      try {
        // Extract the module IDs from the plan's modules array
        const moduleIds = planToDeactivate.modules.map((module) => module._id);

        // Only include the required fields for updating isActive status
        await updatePlan(planToDeactivate._id, {
          isActive: false,
          name: planToDeactivate.name as any, // Type assertion to bypass type check
          description: planToDeactivate.description,
          modules: moduleIds, // Use module IDs array
          maxUsers: planToDeactivate.maxUsers,
          maxManagers: planToDeactivate.maxManagers,
        });
        toast({
          title: "Plan Deactivated",
          description: `${planToDeactivate.name} has been deactivated successfully.`,
        });
        setPlanToDeactivate(null);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to deactivate plan: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Plans Management</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileBarChart className="mr-2 h-5 w-5" />
            Plans
          </CardTitle>

          <CardDescription>View and manage all available plans</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3">Loading plans...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plan Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Users / Managers</TableHead>
                    <TableHead>Monthly Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No plans found
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map((plan) => (
                      <TableRow key={plan._id}>
                        <TableCell className="font-medium">
                          {plan.name}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {plan.description}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            {plan.modules?.length || 0}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center text-xs">
                              <Users className="w-3 h-3 mr-1" />
                              {plan.maxUsers} users
                            </div>
                            <div className="flex items-center text-xs">
                              <UserCog className="w-3 h-3 mr-1" />
                              {plan.maxManagers} managers
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {plan.billingCycle?.monthly
                            ? formatCurrency(plan.billingCycle.monthly.price)
                            : plan.name === "Free"
                            ? "Free"
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          {plan.isActive ? (
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
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => setPlanToUpdate(plan)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              {plan.isActive && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => setPlanToDeactivate(plan)}
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
        {!loading && plans.length > 0 && (
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Showing {plans.length} of {total} plans
            </p>
          </CardFooter>
        )}
      </Card>

      {isCreateModalOpen && (
        <CreatePlanModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {planToUpdate && (
        <UpdatePlanModal
          isOpen={!!planToUpdate}
          onClose={() => setPlanToUpdate(null)}
          plan={planToUpdate}
        />
      )}

      <AlertDialog
        open={!!planToDeactivate}
        onOpenChange={() => setPlanToDeactivate(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-500">
              <Trash className="h-5 w-5 mr-2" />
              Confirm Deactivation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate the plan
              <strong> {planToDeactivate?.name}</strong>? This will make it
              unavailable for new subscriptions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeactivate}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
