import axiosInstance from "./AxiosInstance";

// Types
export interface Company {
  companyId: string;
  companyName: string;
  industry: string;
  size: string;
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
  result: {
    company: Company;
  };
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
