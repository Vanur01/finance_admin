import { useState } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, XCircle, MessageSquare } from 'lucide-react';
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
import { Button } from "@/components/ui/button";
import useSupportStore from "@/lib/stores/supportStoreNew";
import { Support, UpdateSupportRequest } from "@/app/api/supportApi";

interface UpdateSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  support: Support;
  onSuccess?: () => void;
}

export default function UpdateSupportModal({ isOpen, onClose, support, onSuccess }: UpdateSupportModalProps) {
  const { updateSupport } = useSupportStore();
  const [formData, setFormData] = useState<UpdateSupportRequest>({
    status: support.status || "Inprogress",
    reply: support.reply || ""
  });
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (value: Support['status']) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      reply: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await updateSupport(support._id, formData);
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error updating support:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "inprogress":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "resolved":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "inprogress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Support Ticket</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="flex items-center">
              Ticket ID
            </Label>
            <div className="text-sm font-medium">{support.ticket}</div>
          </div>
          
          <div className="grid gap-2">
            <Label className="flex items-center">
              Subject
            </Label>
            <div className="text-sm">{support.subject}</div>
          </div>
          
          <div className="grid gap-2">
            <Label className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              Status
            </Label>
            <Select value={formData.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  {getStatusIcon(formData.status || "Inprogress")}
                  <span className="ml-2">{formatStatusLabel(formData.status || "Inprogress")}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inprogress">
                  <div className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>In Progress</span>
                  </div>
                </SelectItem>
                <SelectItem value="resolved">
                  <div className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                    <span>Resolved</span>
                  </div>
                </SelectItem>
                <SelectItem value="closed">
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 mr-2 text-red-500" />
                    <span>Closed</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
              Reply
            </Label>
            <Textarea
              value={formData.reply}
              onChange={handleReplyChange}
              placeholder="Add a reply or resolution details..."
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
            {loading ? "Updating..." : "Update Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}