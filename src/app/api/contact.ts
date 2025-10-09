import axiosInstance from "./AxiosInstance";

// Types
export interface Contact {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  status: "new" | "converted";
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    currentPage: number;
    totalPages: number;
    contacts: Contact[];
  };
}

export interface SingleContactResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Contact;
}

// API Functions
export const createContact = async (data: {
  name: string;
  email: string;
  mobile: string;
  message: string;
  status: string;
}) => {
  try {
    const response = await axiosInstance.post<SingleContactResponse>(
      '/api/v1/user/createContact',
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface ContactFilters {
  search?: string;
  name?: string;
  email?: string;
  mobile?: string;
  status?: string;
}

export const getAllContacts = async (
  page: number = 1, 
  limit: number = 1,
  filters?: ContactFilters
) => {
  try {
    let url = `/api/v1/user/getAllContacts?page=${page}&limit=${limit}`;
    
    // Add filters to URL if provided
    if (filters) {
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.name) url += `&name=${encodeURIComponent(filters.name)}`;
      if (filters.email) url += `&email=${encodeURIComponent(filters.email)}`;
      if (filters.mobile) url += `&mobile=${encodeURIComponent(filters.mobile)}`;
      if (filters.status) url += `&status=${encodeURIComponent(filters.status)}`;
    }
    
    const response = await axiosInstance.get<ContactsResponse>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getContactById = async (id: string) => {
  try {
    const response = await axiosInstance.get<SingleContactResponse>(
      `/api/v1/user/getContactById/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateContact = async (id: string, data: {
  name?: string;
  email?: string;
  mobile?: string;
  message?: string;
  status?: string;
}) => {
  try {
    const response = await axiosInstance.put<SingleContactResponse>(
      `/api/v1/user/updateContact/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContact = async (id: string) => {
  try {
    const response = await axiosInstance.delete<{ success: boolean; message: string }>(
      `/api/v1/user/deleteContact/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
