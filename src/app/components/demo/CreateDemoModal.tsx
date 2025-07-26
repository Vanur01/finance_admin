"use client";

import { useState } from "react";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import useDemoStore from "@/lib/stores/demoStore";
import { CreateDemoData } from "@/app/api/demoApi";

interface CreateDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateDemoModal = ({ isOpen, onClose, onSuccess }: CreateDemoModalProps) => {
  const { addDemo } = useDemoStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState<CreateDemoData>({
    name: "",
    email: "",
    mobile: "",
    scheduledAt: "",
    notes: null
  });

  const handleChange = (field: keyof CreateDemoData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedDate) {
      const [hours, minutes] = e.target.value.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      setSelectedDate(newDate);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // If there was already a selected date with time, preserve the time
      if (selectedDate) {
        date.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      }
      setSelectedDate(date);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedDate) {
        toast({
          title: "Error",
          description: "Please select a date and time for the demo",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      await addDemo({
        ...formData,
        scheduledAt: selectedDate.toISOString()
      });

      toast({
        title: "Demo Created",
        description: "The demo has been scheduled successfully.",
      });

      // Call onSuccess to refresh data if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        scheduledAt: "",
        notes: null
      });
      setSelectedDate(undefined);
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create demo: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule New Demo</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input 
              placeholder="Enter customer name" 
              value={formData.name}
              onChange={handleChange('name')}
            />
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input 
              placeholder="Enter email address" 
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
            />
          </div>

          <div className="grid gap-2">
            <Label>Mobile Number</Label>
            <Input 
              placeholder="Enter mobile number" 
              type="tel"
              value={formData.mobile}
              onChange={handleChange('mobile')}
            />
          </div>

          <div className="grid gap-2">
            <Label>Date and Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  {selectedDate ? (
                    format(selectedDate, "PPP p")
                  ) : (
                    <span>Pick a date and time</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
                <div className="p-3 border-t">
                  <Input
                    type="time"
                    onChange={handleTimeChange}
                    value={
                      selectedDate
                        ? `${String(selectedDate.getHours()).padStart(
                            2,
                            "0"
                          )}:${String(selectedDate.getMinutes()).padStart(
                            2,
                            "0"
                          )}`
                        : ""
                    }
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Add any additional notes or requirements"
              value={formData.notes || ""}
              onChange={handleChange('notes')}
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="ml-2">
            {loading ? "Scheduling..." : "Schedule Demo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDemoModal;
