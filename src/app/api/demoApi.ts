import axiosInstance from "./AxiosInstance";

// Types
export type BookingStatus = "scheduled" | "rescheduled" | "cancelled" | "done";

export interface Demo {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  status: BookingStatus;
  scheduledAt: string;
  notes: string | null;
  __v?: number;
}

export interface DemosResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    total: number;
    page: number;
    totalPages: number;
    results: Demo[];
  };
}

export interface SingleDemoResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Demo;
}

export interface CreateDemoData {
  name: string;
  email: string;
  mobile: string;
  scheduledAt: string;
  notes?: string | null;
}

export interface UpdateDemoData {
  name?: string;
  email?: string;
  mobile?: string;
  scheduledAt?: string;
  notes?: string | null;
  status?: BookingStatus;
}

export interface DemoFilters {
  name?: string;
  email?: string;
  mobile?: string;
  scheduledAt?: string;
  status?: string;
}

// API Functions
export const createDemo = async (data: CreateDemoData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.post<SingleDemoResponse>(
      "/api/v1/user/createBooking",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllDemos = async (
  page: number = 1,
  limit: number = 10,
  filters?: DemoFilters
) => {
  try {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (filters) {
      // Add each filter if it has a value
      if (filters.name) queryParams.append("name", filters.name);
      if (filters.email) queryParams.append("email", filters.email);
      if (filters.mobile) queryParams.append("mobile", filters.mobile);
      if (filters.scheduledAt) queryParams.append("scheduledAt", filters.scheduledAt);
      if (filters.status) queryParams.append("status", filters.status);
    }

    const response = await axiosInstance.get<DemosResponse>(
      `/api/v1/user/getAllBookings?${queryParams.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDemoById = async (demoId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.get<SingleDemoResponse>(
      `/api/v1/user/getBookingById/${demoId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDemo = async (
  demoId: string,
  data: UpdateDemoData
) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.put<SingleDemoResponse>(
      `/api/v1/user/updateBooking/${demoId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDemo = async (demoId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.delete<{
      success: boolean;
      statusCode: number;
      message: string;
    }>(`/api/v1/user/deleteBooking/${demoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rescheduleDemo = async (demoId: string, scheduledAt: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.patch<SingleDemoResponse>(
      `/api/v1/user/bookingRescheduled/${demoId}`,
      { scheduledAt },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelDemo = async (demoId: string, reason: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.patch<SingleDemoResponse>(
      `/api/v1/user/bookingCancelled/${demoId}`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const completeDemo = async (demoId: string) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axiosInstance.patch<SingleDemoResponse>(
      `/api/v1/user/bookingCompleted/${demoId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
