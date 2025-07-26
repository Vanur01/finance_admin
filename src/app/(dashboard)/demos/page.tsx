"use client";
import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  Search,
  X,
  Filter,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewDemoModal } from "@/app/components/demo/ViewDemoModal";
import { CreateDemoModal } from "@/app/components/demo/CreateDemoModal";
import useDemoStore from "@/lib/stores/demoStore";
import {
  Booking,
  BookingFilters,
  createBooking,
  getBookingById,
} from "@/app/api/demoApi";

interface Demo {
  id: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  dateTime: DateTime;
  module: string;
  status: "scheduled" | "rescheduled" | "cancelled" | "done" | "missed";
  notes: string | null;
}

interface DemoTableProps {
  demos: Demo[];
  onAction: (action: string, demo: Demo) => void;
}

interface DemoFilters {
  search: string;
  status: Demo["status"] | "all";
  dateRange: {
    start: DateTime | null;
    end: DateTime | null;
  };
}

// Import the utility functions instead of defining them here
import { getStatusIcon, getStatusText } from "@/app/utils/demoStatusUtils";

const DemoTable: React.FC<DemoTableProps> = ({ demos, onAction }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demos.map((demo) => (
            <TableRow key={demo.id}>
              <TableCell className="font-medium">{demo.clientName}</TableCell>
              <TableCell className="font-medium">{demo.email}</TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {demo.dateTime.toFormat("MMM d, yyyy")}
                  <Clock className="w-4 h-4 ml-4 mr-2" />
                  {demo.dateTime.toFormat("h:mm a")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusIcon(demo.status)}
                  <span className="ml-2 text-sm text-muted-foreground">
                    {demo.status}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {demo.status !== "cancelled" && demo.status !== "done" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => onAction("reschedule", demo)}
                        >
                          Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("cancel", demo)}
                        >
                          Cancel
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAction("complete", demo)}
                        >
                          Mark as Done
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onAction("edit", demo)}>
                      Update Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("view", demo)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onAction("delete", demo)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const DemoPage = () => {
  const {
    bookings,
    loading,
    error,
    fetchBookings,
    total,
    page,
    totalPages,
    filters: apiFilters,
    setFilters: setApiFilters,
    resetFilters: resetApiFilters,
  } = useDemoStore();
  const [filters, setFilters] = useState<DemoFilters>({
    search: "",
    status: "all",
    dateRange: {
      start: null,
      end: null,
    },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [isViewModalLoading, setIsViewModalLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<Demo | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");

  const handleDemoAction = async (data: {
    name: string;
    email: string;
    mobile: string;
    scheduledAt: string;
  }) => {
    try {
      if (modalMode === "create") {
        await createBooking(data);
      } else if (modalMode === "update" && editingDemo) {
        await useDemoStore.getState().updateBooking(editingDemo.id, data);
      }
      setIsCreateModalOpen(false);
      setEditingDemo(null);
      // Refresh the bookings list
      fetchBookings({
        page: 1,
        limit: 1,
      });
    } catch (error) {
      console.error("Failed to handle booking:", error);
      alert(`Failed to ${modalMode} booking. Please try again.`);
    }
  };

  const handleEditClick = async (demo: Demo) => {
    try {
      const response = await getBookingById(demo.id);
      const bookingData = response.result;
      setEditingDemo({
        id: bookingData._id,
        clientName: bookingData.name,
        email: bookingData.email,
        phoneNumber: bookingData.mobile,
        dateTime: DateTime.fromISO(bookingData.scheduledAt),
        module: "CRM Demo",
        status: bookingData.status,
        notes: bookingData.notes,
      });
      setModalMode("update");
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
      alert("Failed to fetch booking details. Please try again.");
    }
  };

  // Fetch booked demos on component mount
  useEffect(() => {
    fetchBookings({
      page: 1,
      limit: 1, // Use a reasonable page size
    });
  }, [fetchBookings]);

  // Convert bookings to demo format
  const convertBookingsToDemos = (bookings: Booking[]): Demo[] => {
    return bookings
      .map((booking) => {
        const dateTime = DateTime.fromISO(booking.scheduledAt);

        // Determine status - use API status if it's not 'scheduled', otherwise check if missed
        let status: Demo["status"] = booking.status as any;
        if (booking.status === "scheduled" && dateTime < DateTime.now()) {
          status = "missed";
        }

        return {
          id: booking._id,
          clientName: booking.name,
          email: booking.email,
          phoneNumber: booking.mobile,
          dateTime,
          module: "CRM Demo",
          status,
          notes: booking.notes,
        };
      })
      .sort((a, b) => a.dateTime.toMillis() - b.dateTime.toMillis());
  };

  const handleAction = async (action: string, demo: Demo) => {
    switch (action) {
      case "reschedule":
        const newScheduleDate = prompt("Enter new date and time (YYYY-MM-DDTHH:MM:SS):", demo.dateTime.toISO() || "");
        if (newScheduleDate) {
          try {
            await useDemoStore.getState().rescheduleBooking(demo.id, newScheduleDate);
            alert("Demo successfully rescheduled!");
          } catch (error) {
            console.error("Failed to reschedule demo:", error);
            alert("Failed to reschedule demo. Please try again.");
          }
        }
        break;
      case "cancel":
        if (confirm("Are you sure you want to cancel this demo?")) {
          const reason = prompt("Please provide a reason for cancellation:", "");
          if (reason !== null) {
            try {
              await useDemoStore.getState().cancelBooking(demo.id, reason);
              alert("Demo successfully cancelled!");
            } catch (error) {
              console.error("Failed to cancel demo:", error);
              alert("Failed to cancel demo. Please try again.");
            }
          }
        }
        break;
      case "complete":
        if (confirm("Mark this demo as completed?")) {
          try {
            await useDemoStore.getState().completeBooking(demo.id);
            alert("Demo marked as completed!");
          } catch (error) {
            console.error("Failed to mark demo as completed:", error);
            alert("Failed to mark demo as completed. Please try again.");
          }
        }
        break;
      case "delete":
        if (confirm("Are you sure you want to delete this demo?")) {
          useDemoStore.getState().deleteBooking(demo.id);
        }
        break;
      case "view":
        setSelectedDemo(demo);
        break;
      case "edit":
        handleEditClick(demo);
        break;
    }
  };

  // Handle page change for pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchBookings({
        page: newPage,
        limit: 1,
      });
    }
  };

  // Apply server-side filters
  const applyFilters = () => {
    // Update the API filters based on UI filters
    const apiFilterUpdates: Partial<BookingFilters> = {
      name: filters.search || undefined,
      email: filters.search || undefined, // Also search in emails
      // Use empty string for 'all' status to simulate blank value
      status: filters.status !== "all" ? filters.status : "",
    };

    // Only add the date if it exists
    const dateStart = filters.dateRange.start;
    if (dateStart) {
      apiFilterUpdates.scheduledAt = dateStart.toFormat("yyyy-MM-dd");
    }

    setApiFilters(apiFilterUpdates);

    fetchBookings({
      page: 1, // Reset to first page when filtering
      limit: 1,
    });
  };

  // Reset all filters
  const resetAllFilters = () => {
    setFilters({
      search: "",
      status: "all", // Using "all" to represent blank/empty value
      dateRange: {
        start: null,
        end: null,
      },
    });
    resetApiFilters();
    fetchBookings({
      page: 1,
      limit: 1,
    });
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  };

  // These handlers are no longer used directly as we apply filters immediately in the onChange handlers
  // But we'll keep them in case we need them elsewhere
  const handleStatusFilter = (status: Demo["status"] | "all") => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleDateChange = (date: DateTime | null) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        start: date,
      },
    }));
  };

  // Convert bookings to demos format for display
  const filteredDemos = convertBookingsToDemos(bookings);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading demos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Demo Management</h1>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setModalMode("create");
              setEditingDemo(null);
              setIsCreateModalOpen(true);
            }}
            className="ml-2 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule New Demo
          </Button>
        </div>
      </div>

      <CreateDemoModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingDemo(null);
          setModalMode("create");
        }}
        onSubmit={handleDemoAction}
        mode={modalMode}
        initialData={
          editingDemo
            ? {
                name: editingDemo.clientName,
                email: editingDemo.email,
                mobile: editingDemo.phoneNumber,
                scheduledAt: editingDemo.dateTime.toISO() || "",
                id: editingDemo.id,
              }
            : undefined
        }
      />

      <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full md:w-80">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search demos..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      applyFilters();
                    }
                  }}
                  className="pl-8"
                />
              </div>
              <Button onClick={applyFilters} className="shrink-0">
                Search
              </Button>
            </div>
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button variant="outline" onClick={resetAllFilters}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className={cn("grid gap-4 mb-6", !showFilters && "hidden")}>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Demo Status
                </label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => {
                    // Update filter state and then apply filters immediately
                    setFilters((prev) => ({
                      ...prev,
                      status: value as Demo["status"] | "all",
                    }));

                    // Apply filters with the new status value directly
                    const apiFilterUpdates: Partial<BookingFilters> = {
                      ...apiFilters,
                      name: filters.search || undefined,
                      email: filters.search || undefined,
                      status: value !== "all" ? (value as Demo["status"]) : "",
                    };

                    // Apply date if exists
                    const dateStart = filters.dateRange.start;
                    if (dateStart) {
                      apiFilterUpdates.scheduledAt =
                        dateStart.toFormat("yyyy-MM-dd");
                    }

                    setApiFilters(apiFilterUpdates);
                    fetchBookings({ page: 1, limit: 1 });
                  }}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="missed">Missed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Demo Date
                </label>
                <Input
                  type="date"
                  value={
                    filters.dateRange.start
                      ? filters.dateRange.start.toFormat("yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? DateTime.fromFormat(e.target.value, "yyyy-MM-dd")
                      : null;

                    // Update filter state
                    setFilters((prev) => ({
                      ...prev,
                      dateRange: {
                        ...prev.dateRange,
                        start: date,
                      },
                    }));

                    // Apply filters with the new date directly
                    const apiFilterUpdates: Partial<BookingFilters> = {
                      ...apiFilters,
                      name: filters.search || undefined,
                      email: filters.search || undefined,
                      status: filters.status !== "all" ? filters.status : "",
                    };

                    // Add the newly selected date
                    if (date) {
                      apiFilterUpdates.scheduledAt =
                        date.toFormat("yyyy-MM-dd");
                    }

                    setApiFilters(apiFilterUpdates);
                    fetchBookings({ page: 1, limit: 1 });
                  }}
                  className="w-full bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* {filteredDemos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No booked demos found.
        </div>
      ) : (
        <DemoTable demos={filteredDemos} onAction={handleAction} />
      )} */}

      <Card>
        <CardHeader>
          <CardTitle>Scheduled Demos</CardTitle>
          <CardDescription>View and manage all scheduled demos</CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Loading demos...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              <p>Error: {error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => fetchBookings({ page: 1, limit: 1 })}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                {filteredDemos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No booked demos found.
                  </div>
                ) : (
                  <DemoTable demos={filteredDemos} onAction={handleAction} />
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center justify-center py-4 border-t gap-2 mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    isLoading={loading}
                    showFirstLast={true}
                    className="mt-2"
                  />
                  <div className="text-sm text-muted-foreground">
                    Showing page {page} of {totalPages} ({total} total demos)
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <ViewDemoModal
        demo={selectedDemo}
        onClose={() => {
          setSelectedDemo(null);
        }}
        isLoading={isViewModalLoading}
      />
    </div>
  );
};

export default DemoPage;
