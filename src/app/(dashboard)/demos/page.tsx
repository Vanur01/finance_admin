"use client";
import React, { useState, useEffect } from 'react';
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewDemoModal } from "@/app/components/demo/ViewDemoModal";
import { CreateDemoModal } from "@/app/components/demo/CreateDemoModal";
import useDemoStore from "@/lib/stores/demoStore";
import { Booking, createBooking, updateBooking, getBookingById } from "@/app/api/demoApi";

interface Demo {
  id: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  dateTime: DateTime;
  module: string;
  status: "scheduled" | "done" | "missed";
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

export const getStatusIcon = (status: Demo["status"]) => {
  switch (status) {
    case "scheduled":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "done":
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case "missed":
      return <XCircle className="w-4 h-4 text-red-500" />;
  }
};

export const getStatusText = (status: Demo["status"]) => {
  switch (status) {
    case "scheduled":
      return "Scheduled";
    case "done":
      return "Done";
    case "missed":
      return "Missed";
  }
};

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
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {demo.status === "done" && (
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
                    <DropdownMenuItem onClick={() => onAction("cancel", demo)}>
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
    page 
  } = useDemoStore();
  const [filters, setFilters] = useState<DemoFilters>({
    search: "",
    status: "all",
    dateRange: {
      start: null,
      end: null,
    },
  });
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null);
  const [isViewModalLoading, setIsViewModalLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingDemo, setEditingDemo] = useState<Demo | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'update'>('create');

  const handleDemoAction = async (data: {
    name: string;
    email: string;
    mobile: string;
    scheduledAt: string;
  }) => {
    try {
      if (modalMode === 'create') {
        await createBooking(data);
      } else if (modalMode === 'update' && editingDemo) {
        await updateBooking(editingDemo.id, data);
      }
      setIsCreateModalOpen(false);
      setEditingDemo(null);
      // Refresh the bookings list
      fetchBookings({
        page: 1,
        limit: 50,
      });
    } catch (error) {
      console.error('Failed to handle booking:', error);
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
        notes: bookingData.notes
      });
      setModalMode('update');
      setIsCreateModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      alert('Failed to fetch booking details. Please try again.');
    }
  };

  // Fetch booked demos on component mount
  useEffect(() => {
    fetchBookings({
      page: 1,
      limit: 50, // Fetch more demos initially
    });
  }, [fetchBookings]);

  // Convert bookings to demo format
  const convertBookingsToDemos = (bookings: Booking[]): Demo[] => {
    return bookings
      .map((booking) => {
        const dateTime = DateTime.fromISO(booking.scheduledAt);

        // Determine status - use API status if it's 'done', otherwise check if missed
        let status: Demo["status"] = booking.status as "scheduled" | "done";
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
          status: booking.status,
          notes: booking.notes,
        };
      })
      .sort((a, b) => a.dateTime.toMillis() - b.dateTime.toMillis());
  };

  const handleAction = async (action: string, demo: Demo) => {
    switch (action) {
      case "reschedule":
        // TODO: Implement reschedule logic
        console.log("Reschedule demo:", demo);
        break;
      case "cancel":
        if (confirm("Are you sure you want to delete this demo?")) {
          useDemoStore.getState().deleteBooking(demo.id);
        }
        break;
      case "complete":
        // Mark as completed (This would require an additional API endpoint)
        console.log("Mark as completed:", demo);
        break;
      case "view":
        setSelectedDemo(demo);
        break;
      case "edit":
        handleEditClick(demo);
        break;
    }
  };

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    fetchBookings({
      page: 1,
      limit: 50,
    });
  };

  // Handle status filter
  const handleStatusFilter = (status: Demo["status"] | "all") => {
    setFilters((prev) => ({ ...prev, status }));
    // Filter client-side for demo status
  };

  const demos = convertBookingsToDemos(bookings);

  // Apply client-side filters
  const filteredDemos = demos.filter((demo: Demo) => {
    const matchesSearch =
      demo.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
      demo.module.toLowerCase().includes(filters.search.toLowerCase());
    const matchesStatus =
      filters.status === "all" || demo.status === filters.status;
    const matchesDateRange =
      (!filters.dateRange.start || demo.dateTime >= filters.dateRange.start) &&
      (!filters.dateRange.end || demo.dateTime <= filters.dateRange.end);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Scheduled Demos</h1>
        <Button onClick={() => {
          setModalMode('create');
          setEditingDemo(null);
          setIsCreateModalOpen(true);
        }}>
          Schedule New Demo
        </Button>
      </div>

      <CreateDemoModal 
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingDemo(null);
          setModalMode('create');
        }}
        onSubmit={handleDemoAction}
        mode={modalMode}
        initialData={editingDemo ? {
          name: editingDemo.clientName,
          email: editingDemo.email,
          mobile: editingDemo.phoneNumber,
          scheduledAt: editingDemo.dateTime.toISO() || '',
          id: editingDemo.id
        } : undefined}
      />

      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search demos..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            handleStatusFilter(value as Demo["status"] | "all")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDemos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No booked demos found.
        </div>
      ) : (
        <DemoTable demos={filteredDemos} onAction={handleAction} />
      )}

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
