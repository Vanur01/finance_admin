import { create } from "zustand";
import {
  getAllDemos,
  getDemoById,
  createDemo,
  updateDemo,
  deleteDemo,
  rescheduleDemo,
  cancelDemo,
  completeDemo,
  type Demo,
  type DemoFilters,
  type CreateDemoData,
  type UpdateDemoData,
} from "@/app/api/demoApi";

interface DemoStore {
  demos: Demo[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  selectedDemo: Demo | null;
  filters: {
    name: string;
    email: string;
    mobile: string;
    status: string;
    scheduledAt: string;
  };

  // Actions
  setFilters: (filters: Partial<DemoStore["filters"]>) => void;
  resetFilters: () => void;
  fetchDemos: (params?: { page?: number; limit?: number }) => Promise<void>;
  fetchDemoById: (demoId: string) => Promise<Demo>;
  addDemo: (data: CreateDemoData) => Promise<void>;
  updateDemo: (demoId: string, data: UpdateDemoData) => Promise<void>;
  deleteDemo: (demoId: string) => Promise<void>;
  rescheduleDemo: (demoId: string, scheduledAt: string) => Promise<void>;
  cancelDemo: (demoId: string, reason: string) => Promise<void>;
  completeDemo: (demoId: string) => Promise<void>;
  setSelectedDemo: (demo: Demo | null) => void;
}

const useDemoStore = create<DemoStore>((set, get) => ({
  demos: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  selectedDemo: null,
  filters: {
    name: "",
    email: "",
    mobile: "",
    status: "",
    scheduledAt: "",
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        name: "",
        email: "",
        mobile: "",
        status: "",
        scheduledAt: "",
      },
    });
  },

  fetchDemos: async ({ page = 1, limit = 10 } = {}) => {
    try {
      set({ loading: true, error: null });
      const filters = get().filters;

      // Convert store filters to API filters
      const apiFilters: DemoFilters = {};
      if (filters.name) apiFilters.name = filters.name;
      if (filters.email) apiFilters.email = filters.email;
      if (filters.mobile) apiFilters.mobile = filters.mobile;
      if (filters.status && filters.status !== 'all') apiFilters.status = filters.status;
      if (filters.scheduledAt) apiFilters.scheduledAt = filters.scheduledAt;

      const response = await getAllDemos(page, limit, apiFilters);
      set({
        demos: response.result.results,
        total: response.result.total,
        currentPage: response.result.page,
        totalPages: response.result.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchDemoById: async (demoId) => {
    try {
      set({ loading: true, error: null });
      const response = await getDemoById(demoId);
      const demo = response.result;
      set({ loading: false });
      return demo;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  addDemo: async (data) => {
    try {
      set({ loading: true, error: null });
      await createDemo(data);
      // Refresh the demo list after creating a new demo
      await get().fetchDemos({ page: 1 });
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updateDemo: async (demoId, data) => {
    try {
      set({ loading: true, error: null });
      await updateDemo(demoId, data);
      // Refresh the demo list after updating
      await get().fetchDemos();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  deleteDemo: async (demoId) => {
    try {
      set({ loading: true, error: null });
      await deleteDemo(demoId);
      // Refresh the demo list after deletion
      await get().fetchDemos();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  rescheduleDemo: async (demoId, scheduledAt) => {
    try {
      set({ loading: true, error: null });
      await rescheduleDemo(demoId, scheduledAt);
      // Refresh the demo list after rescheduling
      await get().fetchDemos();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  cancelDemo: async (demoId, reason) => {
    try {
      set({ loading: true, error: null });
      await cancelDemo(demoId, reason);
      // Refresh the demo list after cancellation
      await get().fetchDemos();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  completeDemo: async (demoId) => {
    try {
      set({ loading: true, error: null });
      await completeDemo(demoId);
      // Refresh the demo list after completion
      await get().fetchDemos();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  setSelectedDemo: (demo) => {
    set({ selectedDemo: demo });
  },
}));

export default useDemoStore;
