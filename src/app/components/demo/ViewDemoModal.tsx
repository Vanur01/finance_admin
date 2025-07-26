import { X } from 'lucide-react'
import { DateTime } from 'luxon'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { getStatusIcon, getStatusText } from '@/app/utils/demoStatusUtils'
import { getBookingById, type Booking } from '@/app/api/demoApi'

interface Demo {
  id: string
  clientName: string
  email: string
  phoneNumber: string
  dateTime: DateTime
  module: string
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'done' | 'missed'
  notes: string | null
}

interface ViewDemoModalProps {
  demo: Demo | null
  onClose: () => void
  isLoading?: boolean
}

// Get the selected booking from the store
import useDemoStore from '@/lib/stores/demoStore';

export const ViewDemoModal = ({ demo, onClose, isLoading = false }: ViewDemoModalProps) => {
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (demo?.id) {
        setLoading(true);
        try {
          const response = await getBookingById(demo.id);
          setBookingData(response.result);
        } catch (error) {
          console.error('Error fetching booking:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [demo?.id]);

  return (
    <Dialog open={!!demo} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Demo Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center">Loading demo details...</div>
        ) : bookingData ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-3">{bookingData.name}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Email:</div>
              <div className="col-span-3">{bookingData.email}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Phone:</div>
              <div className="col-span-3">{bookingData.mobile}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Date:</div>
              <div className="col-span-3">
                {DateTime.fromISO(bookingData.scheduledAt).toFormat('MMM d, yyyy h:mm a')}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Status:</div>
              <div className="col-span-3 flex items-center">
                {getStatusIcon(bookingData.status)}
                <span className="ml-2">{getStatusText(bookingData.status)}</span>
              </div>
            </div>
            {bookingData.notes && (
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="font-medium">Notes:</div>
                <div className="col-span-3">{bookingData.notes}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center">No demo details available</div>
        )}

        
      </DialogContent>
    </Dialog>
  )
}
