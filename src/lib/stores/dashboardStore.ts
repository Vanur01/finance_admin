import { create } from "zustand";
import {
  getSuperAdminDashboard,
  type DashboardData,
  type DashboardSummary,
  type ActivityFeedItem,
} from "@/app/api/dashboardApi";

interface DashboardStore {
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchDashboardData: () => Promise<void>;
  clearError: () => void;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardData: null,
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    try {
      set({ loading: true, error: null });
      
      const response = await getSuperAdminDashboard();
      
      console.log("Repsonse Super Admin Dashboard",response)
      if (response.status === 'success') {
        set({
          dashboardData: response.data,
          loading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to fetch dashboard data',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch dashboard data',
        loading: false,
      });
      console.error('Error fetching dashboard data:', error);
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useDashboardStore;