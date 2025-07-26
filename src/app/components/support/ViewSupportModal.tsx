import { useState, useEffect } from 'react';
import { X, Hash, UserCheck, Mail, Building, Calendar, Clock, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Support, getSupportById } from "@/app/api/supportApi";

interface ViewSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  supportId: string;
  companyId: string;
}

export default function ViewSupportModal({ isOpen, onClose, supportId, companyId }: ViewSupportModalProps) {
  const [support, setSupport] = useState<Support | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSupportDetails = async () => {
      if (!supportId || !companyId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await getSupportById(supportId, companyId);
        setSupport(response.data);
      } catch (err) {
        console.error('Error fetching support details:', err);
        setError('Failed to load support ticket details');
      } finally {
        setLoading(false);
      }
    };
    
    if (isOpen && supportId && companyId) {
      fetchSupportDetails();
    }
  }, [isOpen, supportId, companyId]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getPriorityBadgeColor = (priority: string | undefined) => {
    if (!priority) return "text-gray-500 bg-gray-50";
    
    switch (priority.toLowerCase()) {
      case "urgent":
        return "text-red-700 bg-red-50";
      case "high":
        return "text-red-500 bg-red-50";
      case "medium":
        return "text-yellow-500 bg-yellow-50";
      case "low":
        return "text-gray-500 bg-gray-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return "text-blue-500";
    
    switch (status.toLowerCase()) {
      case "inprogress":
        return "text-yellow-500";
      case "resolved":
        return "text-green-500";
      case "closed":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const formatStatusDisplay = (status: string | undefined) => {
    if (!status) return "";
    if (status.toLowerCase() === "inprogress") return "In Progress";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Support Ticket Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-2" />
            <p className="text-sm text-muted-foreground">Loading ticket details...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-500">{error}</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Close
            </Button>
          </div>
        ) : support ? (
          <>
            <div className="grid grid-cols-2 gap-6 py-4">
              <div>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Hash className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Ticket ID</span>
                  </div>
                  <div className="text-lg font-semibold">{support.ticket}</div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <UserCheck className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">User Details</span>
                  </div>
                  <div className="text-base">{support.user.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    {support.user.email}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Company</span>
                  </div>
                  <div className="text-base">{support.companyId.companyName}</div>
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Created At</span>
                  </div>
                  <div className="text-base">{formatDate(support.createdAt)}</div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center`}>
                      <AlertTriangle className={`w-4 h-4 mr-2 }`} />
                    </span>
                    <span className="text-sm text-muted-foreground">Priority</span>
                  </div>
                  <div className={`text-sm font-medium px-2 py-1 ${getPriorityBadgeColor(support.priority)}`}>
                    {support.priority.charAt(0).toUpperCase() + support.priority.slice(1).toLowerCase()}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <span className={`inline-flex items-center`}>
                      <Clock className={`w-4 h-4 mr-2 }`} />
                    </span>
                    <span className="text-sm text-muted-foreground">Status</span>
                  </div>
                  <div className={`text-base font-medium ${getStatusColor(support.status)}`}>
                    {formatStatusDisplay(support.status)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Subject</span>
                </div>
                <h3 className="text-lg font-semibold">{support.subject}</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Description</span>
                </div>
                <div className="text-sm bg-muted p-4 rounded-md">
                  {support.description}
                </div>
              </div>
              
              {support.reply && (
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <MessageSquare className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Reply</span>
                  </div>
                  <div className="text-sm bg-muted p-4 rounded-md">
                    {support.reply}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={onClose} className='cursor-pointer'>
                Close
              </Button>
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No ticket details available</p>
            <Button variant="outline" onClick={onClose} className="mt-4 cursor-pointer">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}