'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useLeadStore from '@/lib/stores/leadStore';

const getStatusDisplay = (status: string) => {
  if (status == '1') return 'trial';
  return status;
};

const getStatusVariant = (status: string) => {
  if (status == '1' || status === 'trial') return 'default';
  if (status === 'bookDemo') return 'secondary';
  return 'outline';
};

const getStatusValue = (status: string) => {
  if (status === 'trial') return '1';
  return status;
};

const LeadsPage = () => {
  const { leads, loading, error, fetchLeads, total, page, limit, setPage } = useLeadStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
  });

  useEffect(() => {
    fetchLeads({
      page: 1,
      limit: 10,
    });
  }, [fetchLeads]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchLeads({
      page: 1,
      limit,
      search: value,
    });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
    
    // Convert the display status to the actual status value for the API
    const statusValue = value === 'all' ? undefined : getStatusValue(value);
    
    fetchLeads({
      page: 1,
      limit,
      status: statusValue,
    });
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
    });
    fetchLeads({
      page: 1,
      limit,
    });
  };

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span>Filters</span>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilters ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'}`}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="bookDemo">Book Demo</SelectItem>
                    <SelectItem value="trial">Trial Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell className="font-medium">{lead.name || 'N/A'}</TableCell>
                <TableCell>{lead.email || 'N/A'}</TableCell>
                <TableCell>{lead.phone || 'N/A'}</TableCell>
                <TableCell>
                  <Badge
                    variant={getStatusVariant(lead.status)}
                  >
                    {getStatusDisplay(lead.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {lead.date && lead.time ? (
                    <span>{lead.date} {lead.time}</span>
                  ) : (
                    <span>N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-blue-600"
                      title="View Lead"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-red-600"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
              <span className="font-medium">{total}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LeadsPage;
