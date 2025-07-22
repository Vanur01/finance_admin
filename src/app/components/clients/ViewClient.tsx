import { DateTime } from "luxon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Client {
  id: string;
  companyName: string;
  crmPlan: "Starter" | "Professional" | "Enterprise";
  lastLogin: string;
  nextBillingDate?: string;
  mobileNumber: string;
  usageHours?: number;
  registeredDate: string;
}

interface ViewClientProps {
  client: Client;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getPlanBadge: (plan: Client["crmPlan"]) => any;
  getStatusBadge: (status: "Active" | "Inactive") => any;
  getRenewalBadge: (status: "Renewed" | "Not Renewed") => any;
  getUserStatus: (lastLogin: string) => "Active" | "Inactive";
  getRenewalStatus: (client: Client) => "Renewed" | "Not Renewed";
}

export function ViewClient({
  client,
  open,
  onOpenChange,
  getPlanBadge,
  getStatusBadge,
  getRenewalBadge,
  getUserStatus,
  getRenewalStatus,
}: ViewClientProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye className="h-4 w-4 " />
          View
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="space-y-6">
          <SheetHeader className="px-6">
            <SheetTitle>Client Details</SheetTitle>
            <SheetDescription>
              View detailed information about {client.companyName}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 px-6">
            <div className="grid gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Company Name</h3>
                <p className="mt-2 text-sm text-gray-900">{client.companyName}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                <p className="mt-2 text-sm text-gray-900">{client.mobileNumber}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">CRM Plan</h3>
                <div className="mt-2">{getPlanBadge(client.crmPlan)}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">User Status</h3>
                <div className="mt-2">{getStatusBadge(getUserStatus(client.lastLogin))}</div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {DateTime.fromISO(client.lastLogin).toFormat("MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {DateTime.fromISO(client.registeredDate).toFormat("MMMM d, yyyy")}{" "}
                  ({DateTime.fromISO(client.registeredDate).toRelative()})
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">CRM Usage</h3>
                <div className="mt-2 space-y-3">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{client.usageHours || 0}</span> hours total
                  </p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${Math.min(100, ((client.usageHours || 0) / 1000) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Average {Math.round((client.usageHours || 0) / DateTime.now().diff(DateTime.fromISO(client.registeredDate), 'months').months)} hours per month
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Next Billing Date</h3>
                <p className="mt-2 text-sm text-gray-900">
                  {client.nextBillingDate 
                    ? DateTime.fromISO(client.nextBillingDate).toFormat("MMMM d, yyyy")
                    : "Not available"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Renewal Status</h3>
                <div className="mt-2">{getRenewalBadge(getRenewalStatus(client))}</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}