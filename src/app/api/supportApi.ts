import axiosInstance from "./AxiosInstance";

// Types
export interface Support {
  _id: string;
  ticketId: string;
  subject: string;
  description: string;
  category: "Technical" | "Billing" | "General" | "Feature Request";
  priority: "low" | "medium" | "high";
  status: "new" | "in-progress" | "resolved" | "closed";
  reply?: string;
  createdAt: string;
  updatedAt: string;
  userName: string;
  userEmail: string;
  userId: string;
  companyName: string;
  companyId: string;
}

export interface SupportsResponse {
  message: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Support[];
}

export interface SingleSupportResponse {
  message: string;
  data: Support;
}

export interface CreateSupportRequest {
  category: Support['category'];
  subject: string;
  priority: Support['priority'];
  description: string;
}

export interface UpdateSupportRequest {
  status?: Support['status'];
  reply?: string;
}

// API Functions
export const createSupport = async (data: CreateSupportRequest) => {
  try {
    const response = await axiosInstance.post<SingleSupportResponse>(
      '/api/v1/support/createSupport',
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

export const getAllSupports = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axiosInstance.get<SupportsResponse>(
      `/api/v1/support/getAllSupports?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
};

export const getSupportById = async (id: string) => {
  try {
    const response = await axiosInstance.get<SingleSupportResponse>(
      `/api/v1/support/getSupportById/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching support ticket details:', error);
    throw error;
  }
};

export const updateSupport = async (id: string, data: UpdateSupportRequest) => {
  try {
    const response = await axiosInstance.put<SingleSupportResponse>(
      `/api/v1/support/updateSupport/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating support ticket:', error);
    throw error;
  }
};

export const deleteSupport = async (id: string) => {
  try {
    const response = await axiosInstance.delete<{ message: string }>(
      `/api/v1/support/deleteSupport/${id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting support ticket:', error);
    throw error;
  }
};
