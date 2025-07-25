import { X, User, Mail, Phone, MessageSquare, Clock, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useContactStore from "@/lib/stores/contactStore";
import { useState } from "react";
import { Contact } from "@/app/api/contact";

interface UpdateContactProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact;
}

export default function UpdateContact({ isOpen, onClose, contact }: UpdateContactProps) {
  const { updateContact } = useContactStore();
  const [formData, setFormData] = useState({
    name: contact.name,
    email: contact.email,
    mobile: contact.mobile,
    message: contact.message,
    status: contact.status as 'new' | 'converted'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleStatusChange = (value: 'new' | 'converted') => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateContact(contact._id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating contact:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Contact</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="flex items-center">
              <User className="w-4 h-4 mr-2 text-muted-foreground" />
              Name
            </Label>
            <Input
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Contact name"
            />
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
              Email
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Contact email"
            />
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              Mobile
            </Label>
            <Input
              value={formData.mobile}
              onChange={handleChange('mobile')}
              placeholder="Contact mobile"
            />
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              Status
            </Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span>New</span>
                  </div>
                </SelectItem>
                <SelectItem value="converted">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    <span>Converted</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
              Message
            </Label>
            <Textarea
              value={formData.message}
              onChange={handleChange('message')}
              placeholder="Contact message"
              rows={5}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} className='cursor-pointer'>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="ml-2 cursor-pointer">
            {loading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
