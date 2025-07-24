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

export const getAllContacts = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axiosInstance.get<ContactsResponse>(
      `/api/v1/user/getAllContact?page=${page}&limit=${limit}`
    );
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
