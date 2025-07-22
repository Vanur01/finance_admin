import axiosInstance from './AxiosInstance';

interface Lead {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  date?: string;
  time?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadListResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Lead[];
  };
}

export const getLeadList = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<LeadListResponse> => {
  try {
    const response = await axiosInstance.get<LeadListResponse>('/v1/users/leadList', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};
