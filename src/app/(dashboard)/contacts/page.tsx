"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
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
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  MessageSquare,
  X,
  Plus,
} from "lucide-react";
import useContactStore from "@/lib/stores/contactStore";
import ViewContact from "@/app/components/contacts/ViewContact";
import UpdateContact from "@/app/components/contacts/UpdateContact";
import CreateContactModal from "@/app/components/contacts/CreateContactModal";
import { Contact } from "@/app/api/contact";

export default function ContactsPage() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [contactToUpdate, setContactToUpdate] = useState<Contact | null>(null);
  const [deleteContact, setDeleteContact] = useState<Contact | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    contacts,
    loading,
    total,
    totalPages,
    currentPage,
    fetchContacts,
    deleteContact: deleteContactAction,
    filters,
    setFilters,
    resetFilters,
  } = useContactStore();

  useEffect(() => {
    fetchContacts({ page: 1 });
  }, [fetchContacts]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchContacts({ page: page });
    }
  };

  const handleDelete = async () => {
    if (deleteContact) {
      await deleteContactAction(deleteContact._id);
      setDeleteContact(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "converted":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // We're now using the contacts directly from the store
  // as filtering is done on the server side

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts Management</h1>
        <div className="flex space-x-2">
          {/* {selectedModuleIds.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setIsCalculatorModalOpen(true)}
              className="flex items-center cursor-pointer"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Price ({selectedModuleIds.length})
            </Button>
          )} */}

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="ml-2 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
          <CardTitle className="flex items-center">Contacts</CardTitle>
          <CardDescription>
            View and manage all available modules
          </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="w-[200px] pl-8"
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchContacts({ page: 1 });
                  }
                }}
              />
              {filters.search && (
                <X
                  className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground cursor-pointer"
                  onClick={() => {
                    setFilters({ search: "" });
                    fetchContacts({ page: 1 });
                  }}
                />
              )}
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => {
                setFilters({ status: value });
                fetchContacts({ page: 1 });
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center">Loading contacts...</div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact._id}>
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 mr-2" />
                            {contact.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 mr-2" />
                            {contact.mobile}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusIcon(contact.status)}
                            <span className="ml-2 text-sm text-muted-foreground capitalize">
                              {contact.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(contact.createdAt)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  setSelectedContactId(contact._id)
                                }
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setContactToUpdate(contact)}
                              >
                                Update Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => setDeleteContact(contact)}
                              >
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
                    Showing page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {selectedContactId && (
        <ViewContact
          isOpen={!!selectedContactId}
          onClose={() => setSelectedContactId(null)}
          contactId={selectedContactId}
        />
      )}

      {contactToUpdate && (
        <UpdateContact
          isOpen={!!contactToUpdate}
          onClose={() => setContactToUpdate(null)}
          contact={contactToUpdate}
        />
      )}

      <AlertDialog
        open={!!deleteContact}
        onOpenChange={() => setDeleteContact(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-500">
              <X className="h-5 w-5 mr-2" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact
              <strong> {deleteContact?.name}</strong>.
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

      <CreateContactModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
