"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  MessageCircle,
  Calendar as CalendarIcon,
  Clock,
  Plus,
} from "lucide-react";
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
// Select component removed as filters are no longer needed
import { 
  Card, 
  CardContent, 
  CardHeader,
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import useSupportStore from "@/lib/stores/supportStoreNew";
import { Pagination } from "@/components/ui/pagination";
// import CreateSupportModal from '@/app/components/support/CreateSupportModal';
import ViewSupportModal from "@/app/components/support/ViewSupportModal";
import UpdateSupportModal from "@/app/components/support/UpdateSupportModal";

const SupportPage = () => {
  const {
    supports = [],
    loading,
    error,
    fetchSupports,
    total,
    currentPage,
    totalPages,
  } = useSupportStore();

  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(
    null
  );
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [selectedSupport, setSelectedSupport] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  // Search functionality removed

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchSupports({ page, limit: 1 });
    }
  };

  useEffect(() => {
    fetchSupports({ page: 1, limit: 1 });
  }, [fetchSupports]);

  // We're using the supports directly as they come from the API with filters already applied
  const filteredSupports = supports || [];

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return <Badge className="bg-red-600 hover:bg-red-700">Urgent</Badge>;
      case "high":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>
        );
      case "medium":
        return <Badge className="bg-green-600 hover:bg-green-700">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "inprogress":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-600 hover:bg-green-700">Resolved</Badge>
        );
      case "closed":
        return <Badge className="bg-red-600 hover:bg-red-700">Closed</Badge>;
      default:
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>
        );
    }
  };

  // Loading will be handled inside the card content

  // We'll handle errors within the card instead of returning early

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Management</h1>
        <div className="flex space-x-2">
          {/* Keep this commented until CreateSupportModal is implemented
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="ml-2 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Support Ticket
          </Button>
          */}
        </div>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>View and manage all support tickets</CardDescription>
        </CardHeader>
        
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2">Loading tickets...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">
              <p>Error: {error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => fetchSupports({ page: 1, limit: 1 })}
              >
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
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
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  No support tickets found. Create a new ticket to get started.
                </TableCell>
              </TableRow>
            ) : (
              filteredSupports.map((support) => (
                <TableRow key={support._id}>
                  <TableCell className="font-medium">
                    {support.ticketId}
                  </TableCell>
                  <TableCell>{support.userName || "N/A"}</TableCell>
                  <TableCell>{support.subject}</TableCell>
                  <TableCell>{getPriorityBadge(support.priority)}</TableCell>
                  <TableCell>{getStatusBadge(support.status)}</TableCell>
                  <TableCell className="capitalize">
                    {(support.category || "").toString().replace("-", " ")}
                  </TableCell>
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
                          // Check if companyId exists in the old or new format
                          if (
                            typeof support.companyId === "object" &&
                            support.companyId?._id
                          ) {
                            setSelectedCompanyId(support.companyId._id);
                          } else if (typeof support.companyId === "string") {
                            setSelectedCompanyId(support.companyId);
                          }
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
              </div>
              
              {/* Pagination */}
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
                    Showing page {currentPage} of {totalPages} ({total} total tickets)
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {/* <CreateSupportModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        onSuccess={() => {
          fetchSupports({ page: 1, limit: 1 });
        }}
      /> */}

      {selectedSupportId && selectedCompanyId && (
        <ViewSupportModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSupportId(null);
            setSelectedCompanyId(null);
          }}
          supportId={selectedSupportId}
          companyId={selectedCompanyId}
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
            fetchSupports({ page: 1, limit: 1 });
          }}
          support={selectedSupport}
        />
      )}
    </div>
  );
};

export default SupportPage;
