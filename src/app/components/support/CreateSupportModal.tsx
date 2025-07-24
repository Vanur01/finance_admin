import { useState } from 'react';
import { X, AlertTriangle, MessageSquare } from 'lucide-react';
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
import useSupportStore from "@/lib/stores/supportStoreNew";
import { CreateSupportRequest } from "@/app/api/supportApi";

interface CreateSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateSupportModal({ isOpen, onClose, onSuccess }: CreateSupportModalProps) {
  const { createSupport } = useSupportStore();
  const [formData, setFormData] = useState<CreateSupportRequest>({
    subject: "",
    description: "",
    category: "Technical",
    priority: "medium"
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateSupportRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectChange = (field: keyof CreateSupportRequest) => (value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await createSupport(formData);
      setFormData({
        subject: "",
        description: "",
        category: "Technical",
        priority: "medium"
      });
      // Call onSuccess to refresh data if provided
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error creating support ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="flex items-center">
              Subject
            </Label>
            <Input
              value={formData.subject}
              onChange={handleChange('subject')}
              placeholder="Enter ticket subject"
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={handleSelectChange('category')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-muted-foreground" />
              Priority
            </Label>
            <Select value={formData.priority} onValueChange={handleSelectChange('priority')}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-green-500" />
                    <span>Low</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>Medium</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                    <span>High</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Describe the issue in detail..."
              rows={5}
              className="min-h-[120px] resize-none"
            />
          </div>
        </div>
        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="ml-2">
            {loading ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
