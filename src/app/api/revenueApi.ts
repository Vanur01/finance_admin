import axiosInstance from './AxiosInstance';

interface User {
  _id: string;
  email: string;
  name: string;
  mobile: string;
  companyName: string;
  userType: string;
  isActive: boolean;
  status: number;
  profilePic: string | null;
  signupStatus: number;
  createdAt: string;
  updatedAt: string;
}

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  features: Record<string, any>;
  isActive: boolean;
  isFree?: boolean;
  trialDays?: number;
}

interface Subscription {
  _id: string;
  user: User;
  plan: Plan;
  startDate: string;
  endDate: string;
  trialEndDate?: string;
  status: string;
  paymentStatus: string;
  billingCycle: string;
  amount?: string;
  trancationId?: string;
  gstAmount?: string;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionListResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
    subscriptions: Subscription[];
  };
}

interface MonthlyRevenue {
  month: number;
  revenue: number;
}

interface RevenueByPlan {
  _id: string;
  totalRevenue: number;
  totalSubscriptions: number;
  planName: string;
}

interface SubscriptionAnalytics {
  totalRevenue: number;
  monthlyRevenue: MonthlyRevenue[];
  revenueByPlan: RevenueByPlan[];
  MRR: number;
  churnRate: string;
  activeSubscriptions: number;
}

interface SubscriptionAnalyticsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: SubscriptionAnalytics;
}

export const getAllSubscriptions = async (params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}): Promise<SubscriptionListResponse> => {
  try {
    const response = await axiosInstance.get<SubscriptionListResponse>('/v1/users/getAllSubscriptions', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionAnalytics = async (): Promise<SubscriptionAnalyticsResponse> => {
  try {
    const response = await axiosInstance.get<SubscriptionAnalyticsResponse>('/v1/users/getSubscriptionAnalytics');
    return response.data;
  } catch (error) {
    throw error;
  }
};
