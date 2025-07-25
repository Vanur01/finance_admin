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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  Calculator,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";
import useModuleStore from "@/lib/stores/moduleStore";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import CreateModuleModal from "@/app/components/modules/CreateModuleModal";
import UpdateModuleModal from "@/app/components/modules/UpdateModuleModal";
import PriceCalculatorModal from "@/app/components/modules/PriceCalculatorModal";
import { Module } from "@/app/api/moduleApi";
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

export default function ModulesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [moduleToUpdate, setModuleToUpdate] = useState<Module | null>(null);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);

  const {
    modules,
    loading,
    fetchModules,
    toggleModuleSelection,
    selectedModuleIds,
    clearModuleSelection,
    updateModule: updateModuleAction,
  } = useModuleStore();

  const { toast } = useToast();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleDelete = async () => {
    if (moduleToDelete) {
      try {
        await updateModuleAction(moduleToDelete._id, { isActive: false });
        toast({
          title: "Module Deactivated",
          description: `${moduleToDelete.name} has been deactivated successfully.`,
        });
        setModuleToDelete(null);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to deactivate module: ${
            (error as Error).message
          }`,
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

  const filteredModules = modules.filter((module) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return module.isActive;
    if (activeTab === "inactive") return !module.isActive;
    return true;
  });

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modules Management</h1>
        <div className="flex space-x-2">
          {selectedModuleIds.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setIsCalculatorModalOpen(true)}
              className="flex items-center cursor-pointer"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Price ({selectedModuleIds.length})
            </Button>
          )}
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Module
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Modules</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                All Modules
              </CardTitle>
              <CardDescription>
                View and manage all available modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3">Loading modules...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedModuleIds.length > 0 &&
                              selectedModuleIds.length ===
                                filteredModules.filter((m) => m.isActive).length
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Only select active modules
                                const activeModuleIds = filteredModules
                                  .filter((m) => m.isActive)
                                  .map((m) => m._id);

                                activeModuleIds.forEach((id) => {
                                  if (!selectedModuleIds.includes(id)) {
                                    toggleModuleSelection(id);
                                  }
                                });
                              } else {
                                clearModuleSelection();
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No modules found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredModules.map((module) => (
                          <TableRow key={module._id}>
                            <TableCell>
                              {module.isActive && (
                                <Checkbox
                                  checked={selectedModuleIds.includes(
                                    module._id
                                  )}
                                  onCheckedChange={() =>
                                    toggleModuleSelection(module._id)
                                  }
                                />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {module.name}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {module.description}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(module.price)}
                            </TableCell>
                            <TableCell>
                              {module.isActive ? (
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
                                    onClick={() => setModuleToUpdate(module)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  {module.isActive && (
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => setModuleToDelete(module)}
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
            {!loading && filteredModules.length > 0 && (
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredModules.length} modules
                </p>
                {selectedModuleIds.length > 0 && (
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearModuleSelection}
                      className="cursor-pointer"
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsCalculatorModalOpen(true)}
                      className="cursor-pointer"
                    >
                      <Calculator className="mr-1 h-4 w-4" />
                      Calculate Price
                    </Button>
                  </div>
                )}
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                Active Modules
              </CardTitle>
              <CardDescription>
                View all currently active modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3">Loading modules...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={
                              selectedModuleIds.length > 0 &&
                              selectedModuleIds.length ===
                                filteredModules.filter((m) => m.isActive).length
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                // Only select active modules
                                const activeModuleIds = filteredModules
                                  .filter((m) => m.isActive)
                                  .map((m) => m._id);

                                activeModuleIds.forEach((id) => {
                                  if (!selectedModuleIds.includes(id)) {
                                    toggleModuleSelection(id);
                                  }
                                });
                              } else {
                                clearModuleSelection();
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No modules found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredModules.map((module) => (
                          <TableRow key={module._id}>
                            <TableCell>
                              {module.isActive && (
                                <Checkbox
                                  checked={selectedModuleIds.includes(
                                    module._id
                                  )}
                                  onCheckedChange={() =>
                                    toggleModuleSelection(module._id)
                                  }
                                />
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {module.name}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {module.description}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(module.price)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                              >
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Active
                              </Badge>
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
                                    onClick={() => setModuleToUpdate(module)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => setModuleToDelete(module)}
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </DropdownMenuItem>
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
            {!loading && filteredModules.length > 0 && (
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredModules.length} modules
                </p>
                {selectedModuleIds.length > 0 && (
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearModuleSelection}
                      className="cursor-pointer"
                    >
                      Clear Selection
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setIsCalculatorModalOpen(true)}
                      className="cursor-pointer"
                    >
                      <Calculator className="mr-1 h-4 w-4" />
                      Calculate Price
                    </Button>
                  </div>
                )}
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="mr-2 h-5 w-5 text-gray-500" />
                Inactive Modules
              </CardTitle>
              <CardDescription>
                View all currently inactive modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3">Loading modules...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModules.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            No inactive modules found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredModules.map((module) => (
                          <TableRow key={module._id}>
                            <TableCell className="font-medium">
                              {module.name}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {module.description}
                            </TableCell>
                            <TableCell>
                              {formatCurrency(module.price)}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"
                              >
                                <XCircle className="mr-1 h-3 w-3" />
                                Inactive
                              </Badge>
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
                                    onClick={() => setModuleToUpdate(module)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
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
        </TabsContent>
      </Tabs>

      {isCreateModalOpen && (
        <CreateModuleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {moduleToUpdate && (
        <UpdateModuleModal
          isOpen={!!moduleToUpdate}
          onClose={() => setModuleToUpdate(null)}
          module={moduleToUpdate}
        />
      )}

      <AlertDialog
        open={!!moduleToDelete}
        onOpenChange={() => setModuleToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-500">
              <Trash className="h-5 w-5 mr-2" />
              Confirm Deactivation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate the module
              <strong> {moduleToDelete?.name}</strong>? This will make it
              unavailable for purchase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer" >Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 cursor-pointer "
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PriceCalculatorModal
        isOpen={isCalculatorModalOpen}
        onClose={() => setIsCalculatorModalOpen(false)}
      />

      <Toaster />
    </div>
  );
}
