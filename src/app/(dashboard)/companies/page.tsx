"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Building, Briefcase, Users, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import useCompanyStore from "@/lib/stores/companyStore";
import ViewCompanyModal from "@/app/components/company/ViewCompanyModal";

const CompanyPage = () => {
  const {
    companies = [],
    loading,
    error,
    fetchCompanies,
    filters,
    setFilters,
    resetFilters,
    total,
    currentPage,
    totalPages,
  } = useCompanyStore();

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleSearch = () => {
    setFilters({ search: searchInput });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    fetchCompanies({ page: 1, limit: 10 });
  }, [fetchCompanies, filters]);

  const getIndustryOptions = () => [
    { value: "all", label: "All Industries" },
    { value: "IT", label: "IT" },
    { value: "Healthcare", label: "Healthcare" },
    { value: "Finance", label: "Finance" },
    { value: "Education", label: "Education" },
    { value: "Retail", label: "Retail" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Consulting", label: "Consulting" },
    { value: "Other", label: "Other" },
  ];

  const getSizeOptions = () => [
    { value: "all", label: "All Sizes" },
    { value: "small", label: "Small" },
    { value: "medium", label: "Medium" },
    { value: "large", label: "Large" },
    { value: "enterprise", label: "Enterprise" },
  ];

  const getSizeBadge = (size: string) => {
    switch (size?.toLowerCase()) {
      case "small":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            Small
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600 text-white">
            Medium
          </Badge>
        );
      case "large":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            Large
          </Badge>
        );
      case "enterprise":
        return (
          <Badge className="bg-red-500 hover:bg-red-600 text-white">
            Enterprise
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600 text-white">
            {size}
          </Badge>
        );
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchCompanies({ page });
    }
  };

  if (loading && companies.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error && companies.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => fetchCompanies({ page: 1 })}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Companies</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full md:w-80">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search companies..."
                  className="pl-8"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button onClick={handleSearch} className="shrink-0">
                Search
              </Button>
            </div>
          </div>
          <Button
            variant={showFilters ? "secondary" : "outline"}
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSearchInput("");
              resetFilters();
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={cn("grid gap-4", !showFilters && "hidden")}>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Industry Type
                </label>{" "}
                <Select
                  value={filters.industry}
                  onValueChange={(value) => setFilters({ industry: value })}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {getIndustryOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Size
                </label>{" "}
                <Select
                  value={filters.size}
                  onValueChange={(value) => setFilters({ size: value })}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                    <SelectValue placeholder="Select Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSizeOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Companies Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-gray-500"
                >
                  No companies found. Try adjusting your search filters.
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.companyId}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30">
                        <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">{company.companyName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      {company.industry}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {getSizeBadge(company.size)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3 ">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 cursor-pointer hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        title="View Company"
                        onClick={() => {
                          setSelectedCompanyId(company.companyId);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center justify-center py-4 border-t gap-2">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
              isLoading={loading}
              showFirstLast={true}
              className="mt-2"
            />
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </Card>

      {/* View Company Modal */}
      {selectedCompanyId && (
        <ViewCompanyModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedCompanyId(null);
          }}
          companyId={selectedCompanyId}
        />
      )}
    </div>
  );
};

export default CompanyPage;
