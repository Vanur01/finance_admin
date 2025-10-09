import axiosInstance from "./AxiosInstance";

// Types
export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Plan {
  _id: string;
  name: string;
  billingCycle: {
    monthly: {
      price: number;
    };
    yearly: {
      price: number;
    };
  };
}

export interface Subscription {
  _id: string;
  user: User;
  plan: Plan;
  billingCycle: "monthly" | "yearly";
  subscriptionStatus: "pending" | "active" | "cancelled" | "expired";
  startedAt: string;
  expiresAt: string;
  price: number;
  transactionId: string;
  merchantOrderId: string;
  paymentStatus: "COMPLETED" | "PENDING" | "FAILED";
  reminder: boolean;
  redirectUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentUrl?: string;
}

export interface SubscriptionListResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    subscriptions: Subscription[];
  };
}

export interface SubscriptionDetailsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Subscription;
}

export interface SubscriptionFilters {
  userId?: string;
  status?: string;
  search?: string;
}

// API Functions
export const getAllSubscriptions = async (
  page: number = 1,
  limit: number = 10,
  filters: SubscriptionFilters = {}
) => {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.status) queryParams.append('status', filters.status);

    const response = await axiosInstance.get<SubscriptionListResponse>(
      `/api/v1/subscription/getAllSubscriptions?${queryParams}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    throw error;
  }
};

export const getSubscriptionById = async (subscriptionId: string) => {
  try {
    const response = await axiosInstance.get<SubscriptionDetailsResponse>(
      `/api/v1/subscription/getSubscriptionById/${subscriptionId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    throw error;
  }
};