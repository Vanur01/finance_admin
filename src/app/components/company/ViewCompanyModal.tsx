"use client";

import { useState, useEffect } from "react";
import {
  X,
  Building,
  Briefcase,
  Users,
  User,
  UserCog,
  Mail,
  AtSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCompanyDetails, Company } from "@/app/api/companyApi";

interface ViewCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
}

export default function ViewCompanyModal({
  isOpen,
  onClose,
  companyId,
}: ViewCompanyModalProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!companyId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getCompanyDetails(companyId);
        if (response.success) {
          // Now the type is correct - result directly contains Company data
          setCompany(response.result);
          console.log("Company data:", response.result); // For debugging
        } else {
          setError(response.message || "Failed to fetch company details");
        }
      } catch (error: any) {
        setError(
          error.message || "An error occurred while fetching company details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && companyId) {
      fetchCompanyDetails();
    }
  }, [isOpen, companyId]);

  const getSizeBadge = (size: string) => {
    switch (size?.toLowerCase()) {
      case "small":
        return <Badge variant="outline">Small</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      case "large":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Large</Badge>;
      case "enterprise":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">
            Enterprise
          </Badge>
        );
      default:
        return <Badge variant="outline">{size}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Company Details</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading company details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setError(null);
                setLoading(true);
                // Retry fetching details
                getCompanyDetails(companyId)
                  .then((response) => {
                    if (response.success) {
                      setCompany(response.result);
                    } else {
                      setError(response.message);
                    }
                  })
                  .catch((err) => setError(err.message))
                  .finally(() => setLoading(false));
              }}
            >
              Retry
            </Button>
          </div>
        ) : company ? (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-500" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Company Name
                    </p>
                    <p className="text-base font-medium mt-1">
                      {company.companyName}
                    </p>
                  </div>
                  {/* <div>
                    <p className="text-sm font-medium text-muted-foreground">Company ID</p>
                    <p className="text-base font-mono mt-1 text-muted-foreground">{company.companyId}</p>
                  </div> */}
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Industry
                      </p>
                      <p className="text-base font-medium mt-1">
                        {company.industry}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Company Size
                      </p>
                      <div className="mt-1">{getSizeBadge(company.size)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Role
                      </p>
                      <div className="mt-1 text-sm">{company.role}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Admin Name
                      </p>
                      <p className="text-base font-medium mt-1">
                        {company.userName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Admin Email
                      </p>
                      <p className="text-base font-medium mt-1">
                        {company.userEmail}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="managers">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="managers" className="cursor-pointer">
                  <UserCog className="h-4 w-4 mr-2" />
                  Managers ({company.managers?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="users" className="cursor-pointer">
                  <Users className="h-4 w-4 mr-2" />
                  Users ({company.users?.length || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="managers">
                <Card>
                  <CardContent className="pt-6">
                    {company.managers && company.managers.length > 0 ? (
                      <div className="space-y-4">
                        {company.managers.map((manager) => (
                          <div
                            key={manager._id}
                            className="border rounded-lg p-4 flex items-start gap-3"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-50 text-purple-500">
                              <UserCog className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{manager.name}</p>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                {manager.email}
                              </div>
                            
                            </div>
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 mt-2">
                                {manager.role}
                              </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No managers found for this company.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card>
                  <CardContent className="pt-6">
                    {company.users && company.users.length > 0 ? (
                      <div className="space-y-4">
                        {company.users.map((user) => (
                          <div
                            key={user._id}
                            className="border rounded-lg p-4 flex items-start gap-3"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-500">
                              <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{user.name}</p>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                {user.email}
                              </div>
                            
                            </div>
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 mt-2">
                                {user.role}
                              </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        No users found for this company.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No company details found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
