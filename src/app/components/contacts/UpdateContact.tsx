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
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={handleChange('name')}
              placeholder="Contact name"
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Contact email"
            />
          </div>
          <div className="grid gap-2">
            <Label>Mobile</Label>
            <Input
              value={formData.mobile}
              onChange={handleChange('mobile')}
              placeholder="Contact mobile"
            />
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Message</Label>
            <Textarea
              value={formData.message}
              onChange={handleChange('message')}
              className="resize-none"
              placeholder="Contact message"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
