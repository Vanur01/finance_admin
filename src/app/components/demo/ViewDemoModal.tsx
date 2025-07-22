import { X } from 'lucide-react'
import { DateTime } from 'luxon'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { getStatusIcon, getStatusText } from '@/app/(dashboard)/demos/page'

interface Demo {
  id: string
  clientName: string
  email: string
  phoneNumber: string
  dateTime: DateTime
  module: string
  status: 'upcoming' | 'completed' | 'missed'
}

interface ViewDemoModalProps {
  demo: Demo | null
  onClose: () => void
}

export const ViewDemoModal = ({ demo, onClose }: ViewDemoModalProps) => {
  return (
    <Dialog open={!!demo} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Demo Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>
        {demo && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Name:</div>
              <div className="col-span-3">{demo.clientName}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Email:</div>
              <div className="col-span-3">{demo.email}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Phone:</div>
              <div className="col-span-3">{demo.phoneNumber}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Module:</div>
              <div className="col-span-3">{demo.module}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Date:</div>
              <div className="col-span-3">
                {demo.dateTime.toFormat('MMM d, yyyy h:mm a')}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Status:</div>
              <div className="col-span-3 flex items-center">
                {getStatusIcon(demo.status)}
                <span className="ml-2">{getStatusText(demo.status)}</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
