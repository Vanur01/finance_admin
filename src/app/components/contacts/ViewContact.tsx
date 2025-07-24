import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useContactStore from "@/lib/stores/contactStore";
import { useState } from "react";
import { Contact } from "@/app/api/contact";

interface ViewContactProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}

export default function ViewContact({ isOpen, onClose, contact }: ViewContactProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <div className="text-sm">{contact.name}</div>
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <div className="text-sm">{contact.email}</div>
          </div>
          <div className="grid gap-2">
            <Label>Mobile</Label>
            <div className="text-sm">{contact.mobile}</div>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <div className="text-sm font-medium">{contact.status}</div>
          </div>
          <div className="grid gap-2">
            <Label>Message</Label>
            <div className="text-sm">{contact.message}</div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
