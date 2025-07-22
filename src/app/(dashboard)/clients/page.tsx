"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react";
import { DateTime } from "luxon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ViewClient } from "@/app/components/clients/ViewClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRevenueStore } from "@/lib/stores/revenueStore";

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

const ClientsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState({
    crmPlan: "",
    userStatus: "",
    renewalStatus: "",
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
  });

  const { subscriptions, loading, error, fetchSubscriptions } = useRevenueStore();

  useEffect(() => {
    setIsMounted(true);
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Transform subscription data to Client interface
  const transformSubscriptionsToClients = (): Client[] => {
    return subscriptions.map((subscription) => ({
      id: subscription._id,
      companyName: subscription.user.companyName || subscription.user.name || "Unknown Company",
      crmPlan: subscription.plan.name as "Starter" | "Professional" | "Enterprise",
      lastLogin: subscription.updatedAt, // Using updatedAt as lastLogin proxy
      nextBillingDate: subscription.endDate,
      mobileNumber: subscription.user.mobile || "N/A",
      usageHours: Math.floor(Math.random() * 1000) + 50, // Mock usage hours since not in API
      registeredDate: subscription.user.createdAt,
    }));
  };

  const clients = transformSubscriptionsToClients();

  const handleSearch = () => {
    setSearchQuery(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (
    key: string,
    value: string | { from?: Date; to?: Date }
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      crmPlan: "",
      userStatus: "",
      renewalStatus: "",
      dateRange: {
        from: undefined,
        to: undefined,
      },
    });
  };

  const getUserStatus = (lastLogin: string): "Active" | "Inactive" => {
    const lastLoginDate = DateTime.fromISO(lastLogin);
    const daysSinceLastLogin = DateTime.now().diff(lastLoginDate, "days").days;
    return daysSinceLastLogin <= 7 ? "Active" : "Inactive";
  };

  const getRenewalStatus = (client: Client): "Renewed" | "Not Renewed" => {
    if (!client.nextBillingDate) return "Not Renewed";

    const nextBilling = DateTime.fromISO(client.nextBillingDate);
    return DateTime.now() < nextBilling ? "Renewed" : "Not Renewed";
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.companyName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesPlan = !filters.crmPlan || client.crmPlan === filters.crmPlan;
    const matchesUserStatus =
      !filters.userStatus ||
      getUserStatus(client.lastLogin) === filters.userStatus;
    const matchesRenewalStatus =
      !filters.renewalStatus ||
      getRenewalStatus(client) === filters.renewalStatus;

    return (
      matchesSearch && matchesPlan && matchesUserStatus && matchesRenewalStatus
    );
  });

  const getStatusBadge = (status: "Active" | "Inactive") => {
    return status === "Active" ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        Active
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        Inactive
      </span>
    );
  };

  const getRenewalBadge = (status: "Renewed" | "Not Renewed") => {
    return status === "Renewed" ? (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        ✅ Renewed
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        {" "}
        Not Renewed
      </span>
    );
  };

  const getPlanBadge = (plan: Client["crmPlan"]) => {
    const styles = {
      Starter: "bg-blue-50 text-blue-700 border border-blue-200",
      Professional: "bg-violet-50 text-violet-700 border border-violet-200",
      Enterprise: "bg-amber-50 text-amber-700 border border-amber-200",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[plan]}`}
      >
        {plan}
      </span>
    );
  };

  const formatDate = (date: Date) => {
    return DateTime.fromJSDate(date).toFormat("LLL dd, y");
  };

  if (!isMounted) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading clients: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search clients..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>
            Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span>Filters</span>
            {showFilters ? (
              <ChevronUp className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            )}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          showFilters ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">CRM Plan</label>
              <Select
                value={filters.crmPlan}
                onValueChange={(value) => handleFilterChange("crmPlan", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Plans" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">User Status</label>
              <Select
                value={filters.userStatus}
                onValueChange={(value) => handleFilterChange("userStatus", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Renewal Status</label>
              <Select
                value={filters.renewalStatus}
                onValueChange={(value) => handleFilterChange("renewalStatus", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Renewed">Renewed</SelectItem>
                  <SelectItem value="Not Renewed">Not Renewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-sm"
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Mobile Number</TableHead>
                <TableHead>CRM Plan</TableHead>
                <TableHead>User Status</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead>Renewal Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client, index) => {
                  const userStatus = getUserStatus(client.lastLogin);
                  const renewalStatus = getRenewalStatus(client);

                  return (
                    <TableRow key={client.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{client.companyName}</TableCell>
                      <TableCell>{client.mobileNumber}</TableCell>
                      <TableCell>{getPlanBadge(client.crmPlan)}</TableCell>
                      <TableCell>{getStatusBadge(userStatus)}</TableCell>
                      <TableCell>
                        {client.nextBillingDate
                          ? DateTime.fromISO(client.nextBillingDate).toFormat("MMM d, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>{getRenewalBadge(renewalStatus)}</TableCell>
                      <TableCell>
                        <ViewClient
                          client={client}
                          open={sheetOpen && selectedClient?.id === client.id}
                          onOpenChange={(open) => {
                            setSheetOpen(open);
                            if (open) {
                              setSelectedClient(client);
                            } else {
                              setSelectedClient(null);
                            }
                          }}
                          getPlanBadge={getPlanBadge}
                          getStatusBadge={getStatusBadge}
                          getRenewalBadge={getRenewalBadge}
                          getUserStatus={getUserStatus}
                          getRenewalStatus={getRenewalStatus}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default ClientsPage;
