"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import useDemoStore from "@/lib/stores/demoStore";
import { Demo, BookingStatus } from "@/app/api/demoApi";

import CreateDemoModal from "@/app/components/demo/CreateDemoModal";
import EditDemo from "@/app/components/demo/EditDemo";
import ViewDemoModal from "@/app/components/demo/ViewDemoModal";

export default function DemosPage() {
  const {
    demos,
    loading,
    fetchDemos,
    deleteDemo,
    rescheduleDemo,
    cancelDemo,
    completeDemo,
    filters,
    setFilters,
    resetFilters,
    total,
    currentPage,
    totalPages,
  } = useDemoStore();

  const { toast } = useToast();

  // State for modals and dialogs
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState<string | null>(null);
  const [demoToEdit, setDemoToEdit] = useState<Demo | null>(null);
  const [demoToDelete, setDemoToDelete] = useState<Demo | null>(null);
  const [demoToReschedule, setDemoToReschedule] = useState<Demo | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [demoToCancel, setDemoToCancel] = useState<Demo | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [demoToComplete, setDemoToComplete] = useState<Demo | null>(null);
  const [isDateOpen, setIsDateOpen] = useState(false);

  useEffect(() => {
    fetchDemos({ page: 1, limit: 10 });
  }, [fetchDemos]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchDemos({ page, limit: 10 });
    }
  };

  const handleDelete = async () => {
    if (demoToDelete) {
      try {
        await deleteDemo(demoToDelete._id);
        toast({
          title: "Demo Deleted",
          description: "The demo has been deleted successfully.",
        });
        setDemoToDelete(null);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to delete demo: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleReschedule = async () => {
    if (demoToReschedule && rescheduleDate) {
      try {
        await rescheduleDemo(demoToReschedule._id, rescheduleDate.toISOString());
        toast({
          title: "Demo Rescheduled",
          description: "The demo has been rescheduled successfully.",
        });
        setDemoToReschedule(null);
        setRescheduleDate(undefined);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to reschedule demo: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = async () => {
    if (demoToCancel) {
      try {
        await cancelDemo(demoToCancel._id, cancelReason);
        toast({
          title: "Demo Cancelled",
          description: "The demo has been cancelled successfully.",
        });
        setDemoToCancel(null);
        setCancelReason("");
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to cancel demo: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleComplete = async () => {
    if (demoToComplete) {
      try {
        await completeDemo(demoToComplete._id);
        toast({
          title: "Demo Completed",
          description: "The demo has been marked as completed successfully.",
        });
        setDemoToComplete(null);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to complete demo: ${(error as Error).message}`,
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
      case "rescheduled":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Rescheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      case "done":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Demos Management</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="ml-2 cursor-pointer"
        >
          <Plus className="mr-2 h-4 w-4" />
          Schedule Demo
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
          <CardDescription>
            Find and filter scheduled demonstrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name"
                  className="pl-8"
                  value={filters.name}
                  onChange={(e) => setFilters({ name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchDemos({ page: 1 });
                    }
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                placeholder="Search by email"
                value={filters.email}
                onChange={(e) => setFilters({ email: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchDemos({ page: 1 });
                  }
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => {
                  setFilters({ status: value === "all" ? "" : value });
                  fetchDemos({ page: 1 });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.scheduledAt && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.scheduledAt ? (
                      format(new Date(filters.scheduledAt), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.scheduledAt ? new Date(filters.scheduledAt) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        setFilters({ 
                          scheduledAt: date.toISOString().split('T')[0] 
                        });
                        fetchDemos({ page: 1 });
                      } else {
                        setFilters({ scheduledAt: "" });
                        fetchDemos({ page: 1 });
                      }
                      setIsDateOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-end">
              <Button
                className="flex-1"
                onClick={() => {
                  fetchDemos({ page: 1 });
                }}
              >
                Search
              </Button>
              <Button
                variant="outline"
                className="ml-2"
                onClick={() => {
                  resetFilters();
                  fetchDemos({ page: 1 });
                }}
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2">Loading demos...</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demos.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-24 text-center"
                        >
                          No demos found
                        </TableCell>
                      </TableRow>
                    ) : (
                      demos.map((demo) => (
                        <TableRow key={demo._id}>
                          <TableCell className="font-medium">
                            {demo.name}
                          </TableCell>
                          <TableCell>{demo.email}</TableCell>
                          <TableCell>{demo.mobile}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                <span>
                                  {format(new Date(demo.scheduledAt), "PPP")}
                                </span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="mr-2 h-4 w-4" />
                                <span>
                                  {format(new Date(demo.scheduledAt), "p")}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(demo.status)}</TableCell>
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
                                  onClick={() => setSelectedDemoId(demo._id)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDemoToEdit(demo)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                
                                {demo.status !== "cancelled" && demo.status !== "done" && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setDemoToReschedule(demo);
                                        setRescheduleDate(new Date(demo.scheduledAt));
                                      }}
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Reschedule
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem
                                      onClick={() => setDemoToComplete(demo)}
                                    >
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Mark as Completed
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem
                                      onClick={() => setDemoToCancel(demo)}
                                      className="text-amber-600"
                                    >
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Cancel
                                    </DropdownMenuItem>
                                  </>
                                )}
                                
                                <DropdownMenuItem
                                  onClick={() => setDemoToDelete(demo)}
                                  className="text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
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

              {totalPages > 1 && (
                <div className="flex flex-col items-center justify-center py-4 border-t gap-2 mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                    showFirstLast={true}
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground">
                    Showing page {currentPage} of {totalPages} ({total} total demos)
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateDemoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchDemos({ page: 1 })}
      />

      {selectedDemoId && (
        <ViewDemoModal
          isOpen={!!selectedDemoId}
          onClose={() => setSelectedDemoId(null)}
          demoId={selectedDemoId}
        />
      )}

      {demoToEdit && (
        <EditDemo
          isOpen={!!demoToEdit}
          onClose={() => setDemoToEdit(null)}
          demo={demoToEdit}
        />
      )}

      {/* Confirmation Dialogs */}
      <AlertDialog
        open={!!demoToDelete}
        onOpenChange={() => setDemoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-500">
              <Trash className="h-5 w-5 mr-2" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this demo? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!demoToReschedule}
        onOpenChange={() => {
          setDemoToReschedule(null);
          setRescheduleDate(undefined);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Reschedule Demo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select a new date and time for this demo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={rescheduleDate}
                onSelect={setRescheduleDate}
                initialFocus
              />
              <div className="flex items-center justify-center">
                <Input
                  type="time"
                  value={
                    rescheduleDate
                      ? `${String(rescheduleDate.getHours()).padStart(
                          2,
                          "0"
                        )}:${String(rescheduleDate.getMinutes()).padStart(2, "0")}`
                      : ""
                  }
                  onChange={(e) => {
                    if (rescheduleDate) {
                      const [hours, minutes] = e.target.value
                        .split(":")
                        .map(Number);
                      const newDate = new Date(rescheduleDate);
                      newDate.setHours(hours, minutes);
                      setRescheduleDate(newDate);
                    }
                  }}
                  className="max-w-[150px]"
                />
              </div>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReschedule}
              disabled={!rescheduleDate}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Reschedule
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!demoToCancel}
        onOpenChange={() => {
          setDemoToCancel(null);
          setCancelReason("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-amber-500">
              <XCircle className="h-5 w-5 mr-2" />
              Cancel Demo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for cancelling this demo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Input
              placeholder="Reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={!cancelReason.trim()}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Cancel Demo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!demoToComplete}
        onOpenChange={() => setDemoToComplete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-500">
              <CheckCircle className="h-5 w-5 mr-2" />
              Complete Demo
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this demo as completed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleComplete}
              className="bg-green-500 hover:bg-green-600"
            >
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
