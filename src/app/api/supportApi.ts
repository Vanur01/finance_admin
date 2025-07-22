import axiosInstance from "./AxiosInstance";

// Types
interface User {
  _id: string;
  email: string;
  name: string;
  mobile: string;
}

interface SupportTicket {
  _id: string;
  user: User;
  category: string;
  subject: string;
  priority: "low" | "medium" | "high";
  status: "new" | "in-progress" | "resolved" | "closed";
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  statusCode: 200;
  status: "1";
  message: "successfully create a support ticket";
  data: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    tickets: SupportTicket[];
  };
}

export async function getAllSupportTickets(
  page: string = "1",
  limit: string = "10"
): Promise<PaginatedResponse> {
  try {
    const response = await axiosInstance.get<PaginatedResponse>(
      "/v1/users/getAllSupportTickets",
      {
        params: {
          page,
          limit,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error in getAllSupportTickets:", error);

    const message = error.response?.data?.message || "Internal server error";
    throw new Error(message);
  }
}

export async function getSupportTicketById(id: string): Promise<SupportTicket> {
  try {
    const response = await axiosInstance.get<SupportTicket>(
      `/v1/users/getSupportTicket/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in getSupportTicketById:", error);
    const message =
      error.response?.data?.message || "Failed to fetch support ticket";
    throw new Error(message);
  }
}

export async function updateSupportTicketStatus(
  id: string,
  status: SupportTicket["status"]
): Promise<SupportTicket> {
  try {
    const response = await axiosInstance.patch<SupportTicket>(
      `/v1/users/updateSupportTicketStatus/${id}`,
      {
        status,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in updateSupportTicketStatus:", error);
    const message =
      error.response?.data?.message || "Failed to update support ticket status";
    throw new Error(message);
  }
}

export async function createSupportTicket(
  ticketData: Omit<SupportTicket, "_id" | "createdAt" | "updatedAt">
): Promise<SupportTicket> {
  try {
    const response = await axiosInstance.post<SupportTicket>(
      "/v1/users/createSupportTicket",
      ticketData
    );
    return response.data;
  } catch (error: any) {
    console.error("Error in createSupportTicket:", error);
    const message =
      error.response?.data?.message || "Failed to create support ticket";
    throw new Error(message);
  }
}
