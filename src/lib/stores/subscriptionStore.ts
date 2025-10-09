import { create } from "zustand";
import {
  getAllSubscriptions,
  getSubscriptionById,
  type Subscription,
  type SubscriptionFilters,
} from "@/app/api/subscriptionApi";

interface SubscriptionStore {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  selectedSubscription: Subscription | null;
  filters: SubscriptionFilters;

  // Actions
  fetchSubscriptions: (params: { page?: number; limit?: number }) => Promise<void>;
  fetchSubscriptionById: (subscriptionId: string) => Promise<void>;
  setFilters: (filters: Partial<SubscriptionFilters>) => void;
  resetFilters: () => void;
  clearSelectedSubscription: () => void;
}

const initialFilters: SubscriptionFilters = {
  userId: "",
  status: "",
  search: "",
};

const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscriptions: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 0,
  selectedSubscription: null,
  filters: initialFilters,

  fetchSubscriptions: async ({ page = 1, limit = 10 } = {}) => {
    try {
      set({ loading: true, error: null });
      const { filters } = get();
      
      const response = await getAllSubscriptions(page, limit, filters);
      
      if (response.success) {
        set({
          subscriptions: response.result.subscriptions,
          total: response.result.total,
          currentPage: response.result.page,
          totalPages: response.result.totalPages,
          loading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to fetch subscriptions',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch subscriptions',
        loading: false,
      });
      console.error('Error fetching subscriptions:', error);
    }
  },

  fetchSubscriptionById: async (subscriptionId: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await getSubscriptionById(subscriptionId);
      
      if (response.success) {
        set({
          selectedSubscription: response.result,
          loading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to fetch subscription details',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch subscription details',
        loading: false,
      });
      console.error('Error fetching subscription details:', error);
    }
  },

  setFilters: (newFilters: Partial<SubscriptionFilters>) => {
    const { filters, fetchSubscriptions } = get();
    const updatedFilters = { ...filters, ...newFilters };
    set({ filters: updatedFilters });
    
    // Re-fetch data with new filters
    fetchSubscriptions({ page: 1 });
  },

  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchSubscriptions({ page: 1 });
  },

  clearSelectedSubscription: () => {
    set({ selectedSubscription: null });
  },
}));

export default useSubscriptionStore;