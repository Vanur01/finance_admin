import { X, User, Mail, Phone, MessageSquare, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Contact, getContactById } from "@/app/api/contact";

interface ViewContactProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
}

export default function ViewContact({ isOpen, onClose, contactId }: ViewContactProps) {
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContactDetails = async () => {
      if (!contactId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getContactById(contactId);
        setContact(response.result);
      } catch (err) {
        console.error('Error fetching contact details:', err);
        setError('Failed to load contact details');
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && contactId) {
      fetchContactDetails();
    }
  }, [isOpen, contactId]);

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
};

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case "new":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "converted":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading contact details...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : contact ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium flex items-center">
                  <User className="w-4 h-4 mr-2 text-muted-foreground" />
                  Name:
                </div>
                <div className="col-span-3">{contact.name}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                  Email:
                </div>
                <div className="col-span-3">{contact.email}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  Mobile:
                </div>
                <div className="col-span-3">{contact.mobile}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-3 flex items-center">
                  {getStatusIcon(contact.status)}
                  <span className="ml-2 capitalize">{contact.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium flex items-center">
                  Message:
                </div>
                
                <div className="col-span-3">
                  <div className="text-sm bg-muted p-3 rounded-md">{contact.message}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Created:</div>
                <div className="col-span-3">{formatDate(contact.createdAt)}</div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No contact details available</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
