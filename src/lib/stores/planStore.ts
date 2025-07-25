import { create } from "zustand";
import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  type Plan,
  type PlanFilters,
  type CreatePlanData,
} from "@/app/api/planApi";

interface PlanStore {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  filters: {
    search: string;
    isActive: "all" | "active" | "inactive";
  };

  // Actions
  setFilters: (filters: Partial<PlanStore["filters"]>) => void;
  resetFilters: () => void;
  fetchPlans: (params?: { page?: number; limit?: number }) => Promise<void>;
  addPlan: (data: CreatePlanData) => Promise<void>;
  updatePlan: (
    planId: string,
    data: Partial<CreatePlanData>
  ) => Promise<void>;
  deletePlan: (planId: string) => Promise<void>;
}

const usePlanStore = create<PlanStore>((set, get) => ({
  plans: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    search: "",
    isActive: "all",
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        search: "",
        isActive: "all",
      },
    });
  },

  fetchPlans: async ({ page = 1, limit = 10 } = {}) => {
    try {
      set({ loading: true, error: null });
      const filters = get().filters;

      // Convert store filters to API filters
      const apiFilters: PlanFilters = {};
      if (filters.search) {
        apiFilters.search = filters.search;
      }
      if (filters.isActive !== "all") {
        apiFilters.isActive = filters.isActive === "active";
      }

      const response = await getAllPlans(page, limit, apiFilters);
      set({
        plans: response.result.plans,
        total: response.result.total,
        currentPage: response.result.page,
        totalPages: response.result.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addPlan: async (data) => {
    try {
      set({ loading: true, error: null });
      await createPlan(data);
      // Refresh the plans list after creating a new plan
      await get().fetchPlans({ page: 1 });
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updatePlan: async (planId, data) => {
    try {
      set({ loading: true, error: null });
      await updatePlan(planId, data);
      // Refresh the plans list after update
      const { currentPage } = get();
      await get().fetchPlans({ page: currentPage });
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  deletePlan: async (planId) => {
    try {
      set({ loading: true, error: null });
      await deletePlan(planId);
      // Refresh the plans list after deleting
      const { currentPage } = get();
      await get().fetchPlans({ page: currentPage });
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));

export default usePlanStore;
