"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  MessageCircle,
  Calendar as CalendarIcon,
  Clock,
  Plus,
} from 'lucide-react';
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import useSupportStore from '@/lib/stores/supportStoreNew';
// import CreateSupportModal from '@/app/components/support/CreateSupportModal';
import ViewSupportModal from '@/app/components/support/ViewSupportModal';
import UpdateSupportModal from '@/app/components/support/UpdateSupportModal';

const SupportPage = () => {
  const { 
    supports = [],
    loading, 
    error, 
    fetchSupports,
    filters,
    setFilters,
    resetFilters 
  } = useSupportStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(null);
  const [selectedSupport, setSelectedSupport] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleSearch = () => {
    setFilters({ search: searchInput });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchSupports({ page: 1, limit: 10 });
  }, [fetchSupports, filters]);

  // Filter supports based on search and filters
  const filteredSupports = (supports || []).filter((support) => {
    const matchesSearch = 
      (support.userName?.toLowerCase().includes(filters.search.toLowerCase()) || false) ||
      (support.subject?.toLowerCase().includes(filters.search.toLowerCase()) || false) ||
      (support._id?.toLowerCase().includes(filters.search.toLowerCase()) || false);
    
    const matchesStatus = filters.status === 'all' || support.status === filters.status;
    const matchesPriority = filters.priority === 'all' || support.priority === filters.priority;
    const matchesCategory = filters.category === 'all' || 
      support.category.toLowerCase() === filters.category.toLowerCase();

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500 hover:bg-green-600">Resolved</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => fetchSupports({ page: 1, limit: 10 })}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Support Tickets</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Create Support
          </Button> */}
          <div className="relative w-full md:w-80">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  className="pl-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="shrink-0"
              >
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
          <Button
            variant="outline"
            onClick={() => {
              setSearchInput('');
              resetFilters();
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={cn("grid gap-4", !showFilters && "hidden")}>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters({ status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={filters.priority}
                  onValueChange={(value) => setFilters({ priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => setFilters({ category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature-request">Feature Request</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Removed date filter since it's not in the current store */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSupports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No support tickets found. Create a new ticket to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredSupports.map((support) => (
                <TableRow key={support._id}>
                  <TableCell className="font-medium">{support.ticketId || support._id}</TableCell>
                  <TableCell>{support.userName || 'N/A'}</TableCell>
                  <TableCell>{support.subject}</TableCell>
                  <TableCell>{getPriorityBadge(support.priority)}</TableCell>
                  <TableCell>{getStatusBadge(support.status)}</TableCell>
                  <TableCell className="capitalize">{(support.category || '').toString().replace('-', ' ')}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {format(new Date(support.createdAt), "MMM d, yyyy")}
                      <Clock className="w-4 h-4 ml-4 mr-2" />
                      {format(new Date(support.createdAt), "h:mm a")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-blue-600"
                        title="View Support Ticket"
                        onClick={() => {
                          setSelectedSupportId(support._id);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-green-600"
                        title="Update Support Ticket"
                        onClick={() => {
                          setSelectedSupport(support);
                          setIsUpdateModalOpen(true);
                        }}
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      
      {/* Modals */}
      {/* <CreateSupportModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        onSuccess={() => {
          fetchSupports({ page: 1, limit: 10 });
        }}
      /> */}

      {selectedSupportId && (
        <ViewSupportModal 
          isOpen={isViewModalOpen} 
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSupportId(null);
          }} 
          supportId={selectedSupportId} 
        />
      )}

      {selectedSupport && (
        <UpdateSupportModal 
          isOpen={isUpdateModalOpen} 
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedSupport(null);
          }}
          onSuccess={() => {
            fetchSupports({ page: 1, limit: 10 });
          }}
          support={selectedSupport} 
        />
      )}
    </div>
  );
};

export default SupportPage;