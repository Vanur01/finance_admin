import  axiosInstance  from "./AxiosInstance";

// Types
export interface Booking {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  status: "scheduled" | "done";
  scheduledAt: string;
  notes: string | null;
}

export interface BookingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    page: number;
    totalPages: number;
    results: Booking[];
  };
}

export interface SingleBookingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Booking;
}

// API Functions
export const createBooking = async (data: {
  name: string;
  email: string;
  mobile: string;
  scheduledAt: string;
}) => {
  try {
    const response = await axiosInstance.post<SingleBookingResponse>(
      '/api/v1/user/createBooking',
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllBookings = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await axiosInstance.get<BookingsResponse>(
      `/api/v1/user/getAllBookings?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookingById = async (bookingId: string) => {
  try {
    const response = await axiosInstance.get<SingleBookingResponse>(
      `/api/v1/user/getBookingById/${bookingId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateBooking = async (bookingId: string, data: {
  name: string;
  email: string;
  mobile: string;
  scheduledAt: string;
}) => {
  try {
    const response = await axiosInstance.put<SingleBookingResponse>(
      `/api/v1/user/updateBooking/${bookingId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    const response = await axiosInstance.delete(
      `/api/v1/user/deleteBooking/${bookingId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
