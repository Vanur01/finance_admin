import { create } from 'zustand';
import { getAllSubscriptions, getSubscriptionAnalytics } from '@/app/api/revenueApi';

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

interface RevenueStore {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  totalAmount: number;
  totalSubscriptions: number;
  analytics: SubscriptionAnalytics | null;
  analyticsLoading: boolean;
  analyticsError: string | null;
  fetchSubscriptions: (params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }) => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  resetError: () => void;
}

export const useRevenueStore = create<RevenueStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,
  totalAmount: 0,
  totalSubscriptions: 0,
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,

  fetchSubscriptions: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getAllSubscriptions({
        page: 1,
        limit: 100,
        ...params
      });
      
      const subscriptions = response.data.subscriptions || [];
      const totalAmount = subscriptions.reduce((sum, sub) => {
        const amount = sub.amount ? parseFloat(sub.amount) : 0;
        return sum + amount;
      }, 0);
      const totalSubscriptions = subscriptions.length;

      set({
        subscriptions,
        totalAmount,
        totalSubscriptions,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subscriptions'
      });
    }
  },

  fetchAnalytics: async () => {
    set({ analyticsLoading: true, analyticsError: null });
    try {
      const response = await getSubscriptionAnalytics();
      set({
        analytics: response.data,
        analyticsLoading: false,
        analyticsError: null
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      set({
        analyticsLoading: false,
        analyticsError: error instanceof Error ? error.message : 'Failed to fetch analytics'
      });
    }
  },

  resetError: () => {
    set({ error: null, analyticsError: null });
  }
}));
