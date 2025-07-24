import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTime } from 'luxon';

interface CreateDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name: string;
    email: string;
    mobile: string;
    scheduledAt: string;
  };
  onSubmit: (data: {
    name: string;
    email: string;
    mobile: string;
    scheduledAt: string;
  }) => void;
  mode: 'create' | 'update';
}

export const CreateDemoModal: React.FC<CreateDemoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    mobile: initialData?.mobile || '',
    scheduledAt: initialData?.scheduledAt 
      ? DateTime.fromISO(initialData.scheduledAt).toFormat("yyyy-MM-dd'T'HH:mm")
      : DateTime.now().toFormat("yyyy-MM-dd'T'HH:mm"),
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        mobile: initialData.mobile,
        scheduledAt: DateTime.fromISO(initialData.scheduledAt).toFormat("yyyy-MM-dd'T'HH:mm"),
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      scheduledAt: DateTime.fromFormat(formData.scheduledAt, "yyyy-MM-dd'T'HH:mm").toUTC().toISO() || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Schedule New Demo' : 'Update Demo Details'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Client Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <Input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
              Schedule Date & Time
            </label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              required
              value={formData.scheduledAt}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Demo
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
