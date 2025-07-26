"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

import useDemoStore from "@/lib/stores/demoStore";
import { Demo, BookingStatus } from "@/app/api/demoApi";

interface EditDemoProps {
  isOpen: boolean;
  onClose: () => void;
  demo: Demo;
}

const EditDemo = ({ isOpen, onClose, demo }: EditDemoProps) => {
  const { updateDemo } = useDemoStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: demo.name,
    email: demo.email,
    mobile: demo.mobile,
    status: demo.status,
    scheduledAt: new Date(demo.scheduledAt),
    notes: demo.notes || "",
  });

  useEffect(() => {
    setFormData({
      name: demo.name,
      email: demo.email,
      mobile: demo.mobile,
      status: demo.status,
      scheduledAt: new Date(demo.scheduledAt),
      notes: demo.notes || "",
    });
  }, [demo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: BookingStatus) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      // Preserve the existing time
      const currentDate = formData.scheduledAt;
      newDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      setFormData((prev) => ({ ...prev, scheduledAt: newDate }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(formData.scheduledAt);
    newDate.setHours(hours, minutes);
    setFormData((prev) => ({ ...prev, scheduledAt: newDate }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateDemo(demo._id, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        status: formData.status,
        scheduledAt: formData.scheduledAt.toISOString(),
        notes: formData.notes || null,
      });

      toast({
        title: "Demo Updated",
        description: "The demo has been updated successfully.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update demo: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Demo</DialogTitle>
          <DialogDescription>
            Update the details of this demonstration.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: BookingStatus) =>
                  handleStatusChange(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="done">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Date and Time</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="scheduledAt"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.scheduledAt && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduledAt ? (
                        format(formData.scheduledAt, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.scheduledAt}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  type="time"
                  value={format(formData.scheduledAt, "HH:mm")}
                  onChange={handleTimeChange}
                  className="w-[140px]"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes or requirements"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Demo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDemo;
