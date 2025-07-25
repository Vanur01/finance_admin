import axiosInstance from "./AxiosInstance";

// Types
export interface Manager {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Company {
  _id: string;
  companyId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  companyName: string;
  companyUniqueId: string;
  industry: string;
  size: string;
  managers: Manager[];
  users: User[];
}

export interface CompanyListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    page: number;
    totalPages: number;
    data: Company[];
  };
}

export interface CompanyDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Company;
}

// API Functions
export const getAllCompanies = async (
  page: number = 1,
  limit: number = 10,
  filters: { companyName?: string; industry?: string; size?: string } = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.companyName) queryParams.append('companyName', filters.companyName);
    if (filters.industry) queryParams.append('industry', filters.industry);
    if (filters.size) queryParams.append('size', filters.size);

    const response = await axiosInstance.get<CompanyListResponse>(
      `/api/v1/admin/getAllCompany?${queryParams}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getCompanyDetails = async (companyId: string) => {
  try {
    const response = await axiosInstance.get<CompanyDetailsResponse>(
      `/api/v1/admin/getCompanyDetails/${companyId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching company details:', error);
    throw error;
  }
};
