"use client"
import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MoreHorizontal, CheckCircle2, XCircle, AlertCircle, ChevronDown, Search, X } from 'lucide-react'
import { DateTime } from 'luxon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ViewDemoModal } from '@/app/components/demo/ViewDemoModal'
import useLeadStore from '@/lib/stores/leadStore'

interface Demo {
  id: string
  clientName: string
  email: string
  phoneNumber: string
  dateTime: DateTime
  module: string
  status: 'upcoming' | 'completed' | 'missed'
}

interface DemoTableProps {
  demos: Demo[]
  onAction: (action: string, demo: Demo) => void
}

interface DemoFilters {
  search: string
  status: Demo['status'] | 'all'
  dateRange: {
    start: DateTime | null
    end: DateTime | null
  }
}

export const getStatusIcon = (status: Demo['status']) => {
  switch (status) {
    case 'upcoming':
      return <Clock className="w-4 h-4 text-blue-500" />
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />
    case 'missed':
      return <XCircle className="w-4 h-4 text-red-500" />
  }
}

export const getStatusText = (status: Demo['status']) => {
  switch (status) {
    case 'upcoming':
      return 'Upcoming'
    case 'completed':
      return 'Completed'
    case 'missed':
      return 'Missed'
  }
}

const DemoTable: React.FC<DemoTableProps> = ({ demos, onAction }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {demos.map((demo) => (
            <TableRow key={demo.id}>
              <TableCell className="font-medium">{demo.clientName}</TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  {demo.dateTime.toFormat('MMM d, yyyy')}
                  <Clock className="w-4 h-4 ml-4 mr-2" />
                  {demo.dateTime.toFormat('h:mm a')}
                </div>
              </TableCell>
              <TableCell>{demo.module}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {getStatusIcon(demo.status)}
                  <span className="ml-2 text-sm text-muted-foreground">{getStatusText(demo.status)}</span>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {demo.status === 'upcoming' && (
                      <>
                        <DropdownMenuItem onClick={() => onAction('reschedule', demo)}>
                          Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction('cancel', demo)}>
                          Cancel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAction('complete', demo)}>
                          Mark as Done
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => onAction('view', demo)}>
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const DemoPage = () => {
  const { leads, loading, error, fetchLeads, total, page, limit, setPage } = useLeadStore()
  const [filters, setFilters] = useState<DemoFilters>({
    search: '',
    status: 'all',
    dateRange: {
      start: null,
      end: null
    }
  })
  const [selectedDemo, setSelectedDemo] = useState<Demo | null>(null)

  // Fetch booked demos on component mount
  useEffect(() => {
    fetchLeads({
      page: 1,
      limit: 50, // Fetch more demos initially
      status: 'bookDemo', // Filter for booked demos only
    })
  }, [fetchLeads])

  // Convert leads to demo format
  const convertLeadsToDemos = (leads: any[]): Demo[] => {
    return leads
      .filter(lead => lead.status === 'bookDemo') // Double-check filter
      .map(lead => {
        // Parse date and time from lead data
        let dateTime: DateTime
        if (lead.date && lead.time) {
          // Combine date and time strings
          const dateTimeString = `${lead.date} ${lead.time}`
          dateTime = DateTime.fromFormat(dateTimeString, 'yyyy-MM-dd HH:mm', { zone: 'local' })
        } else {
          // Fallback to current time if no date/time provided
          dateTime = DateTime.now()
        }

        // Determine status based on date/time
        let status: Demo['status'] = 'upcoming'
        if (dateTime < DateTime.now()) {
          status = 'missed' // Could be enhanced to check if it was actually completed
        }

        return {
          id: lead._id,
          clientName: lead.name || 'Unknown Client',
          email: lead.email || 'No email',
          phoneNumber: lead.phone || 'No phone',
          dateTime,
          module: 'CRM Demo', // Default module since leads don't have this field
          status
        }
      })
      .sort((a, b) => a.dateTime.toMillis() - b.dateTime.toMillis()) // Sort by date/time
  }

  const handleAction = (action: string, demo: Demo) => {
    switch (action) {
      case 'reschedule':
        // TODO: Implement reschedule logic
        console.log('Reschedule demo:', demo)
        break
      case 'cancel':
        // TODO: Implement cancel logic
        console.log('Cancel demo:', demo)
        break
      case 'complete':
        // TODO: Implement complete logic
        console.log('Complete demo:', demo)
        break
      case 'view':
        setSelectedDemo(demo)
        break
    }
  }

  // Handle search
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }))
    fetchLeads({
      page: 1,
      limit: 50,
      status: 'bookDemo',
      search: searchTerm,
    })
  }

  // Handle status filter
  const handleStatusFilter = (status: Demo['status'] | 'all') => {
    setFilters(prev => ({ ...prev, status }))
    // Note: The API only returns bookDemo status, so we filter client-side for demo status
  }

  const demos = convertLeadsToDemos(leads)

  // Apply client-side filters
  const filteredDemos = demos.filter(demo => {
    const matchesSearch = demo.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         demo.module.toLowerCase().includes(filters.search.toLowerCase())
    const matchesStatus = filters.status === 'all' || demo.status === filters.status
    const matchesDateRange = (!filters.dateRange.start || demo.dateTime >= filters.dateRange.start) &&
                            (!filters.dateRange.end || demo.dateTime <= filters.dateRange.end)
    
    return matchesSearch && matchesStatus && matchesDateRange
  })

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading demos...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Scheduled Demos</h1>
        <Button onClick={() => console.log('Schedule new demo')}>
          Schedule New Demo
        </Button>
      </div>

      <div className="mb-6 flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search demos..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={filters.status}
          onValueChange={(value) => handleStatusFilter(value as Demo['status'] | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredDemos.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No booked demos found.
        </div>
      ) : (
        <DemoTable demos={filteredDemos} onAction={handleAction} />
      )}

      <ViewDemoModal demo={selectedDemo} onClose={() => setSelectedDemo(null)} />
    </div>
  )
}

export default DemoPage
