"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Mail, Phone, FileText, User } from "lucide-react";

import useDemoStore from "@/lib/stores/demoStore";
import { Demo } from "@/app/api/demoApi";

interface ViewDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  demoId: string;
}

const ViewDemoModal = ({ isOpen, onClose, demoId }: ViewDemoModalProps) => {
  const { fetchDemoById } = useDemoStore();
  const { toast } = useToast();
  const [demo, setDemo] = useState<Demo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDemo = async () => {
      try {
        setLoading(true);
        const demoData = await fetchDemoById(demoId);
        setDemo(demoData);
      } catch (error) {
        toast({
          title: "Error",
          description: `Failed to load demo details: ${(error as Error).message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && demoId) {
      loadDemo();
    }
  }, [isOpen, demoId, fetchDemoById, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Scheduled</Badge>;
      case "rescheduled":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Rescheduled</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      case "done":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Demo Details</DialogTitle>
          <DialogDescription>
            View the details of this scheduled demonstration.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3">Loading...</span>
          </div>
        ) : demo ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium flex items-center">
                <User className="mr-2 h-5 w-5" />
                {demo.name}
              </h3>
              <div>{getStatusBadge(demo.status)}</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4" />
                <span className="text-muted-foreground">Email:</span>
                <span className="ml-2">{demo.email}</span>
              </div>

              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4" />
                <span className="text-muted-foreground">Mobile:</span>
                <span className="ml-2">{demo.mobile}</span>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4" />
                <span className="text-muted-foreground">Date:</span>
                <span className="ml-2">
                  {format(new Date(demo.scheduledAt), "PPP")}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4" />
                <span className="text-muted-foreground">Time:</span>
                <span className="ml-2">
                  {format(new Date(demo.scheduledAt), "p")}
                </span>
              </div>

              {demo.notes && (
                <div className="pt-3">
                  <div className="flex items-center text-sm mb-2">
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="text-muted-foreground">Notes:</span>
                  </div>
                  <div className="bg-muted p-3 rounded-md text-sm">
                    {demo.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Demo details not found
          </div>
        )}

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDemoModal;
