import axiosInstance from "./AxiosInstance";

// Types
export interface DashboardSummary {
  totalLeads: number;
  totalBookings: number;
  totalUsers: number;
  totalRevenue: number;
  totalPaidUsers: number;
  totalTrialUsers: number;
}

export interface ActivityFeedItem {
  message: string;
  time: string;
  type: "subscription" | "lead" | "booking";
}

export interface DashboardData {
  summary: DashboardSummary;
  filters: {
    period: string;
  };
  activityFeed: ActivityFeedItem[];
}

export interface SuperAdminDashboardResponse {
  status: string;
  message: string;
  data: DashboardData;
}

// API Function
export const getSuperAdminDashboard = async () => {
  try {
    const response = await axiosInstance.get<SuperAdminDashboardResponse>(
      '/api/v1/subscription/getSuperAdminDashBoard'
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching super admin dashboard:', error);
    throw error;
  }
};