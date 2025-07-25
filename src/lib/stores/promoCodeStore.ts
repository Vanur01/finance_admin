import { create } from "zustand";
import {
  getAllPromoCodes,
  createPromoCode,
  updatePromoCode,
  deletePromoCode,
  type PromoCode,
  type PromoCodeFilters,
  type CreatePromoCodeData,
} from "@/app/api/promoCodeApi";

interface PromoCodeStore {
  promoCodes: PromoCode[];
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
  setFilters: (filters: Partial<PromoCodeStore["filters"]>) => void;
  resetFilters: () => void;
  fetchPromoCodes: (params?: { page?: number; limit?: number }) => Promise<void>;
  addPromoCode: (data: CreatePromoCodeData) => Promise<void>;
  updatePromoCode: (
    promoCodeId: string,
    data: Partial<CreatePromoCodeData>
  ) => Promise<void>;
  deletePromoCode: (promoCodeId: string) => Promise<void>;
}

const usePromoCodeStore = create<PromoCodeStore>((set, get) => ({
  promoCodes: [],
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

  fetchPromoCodes: async ({ page = 1, limit = 10 } = {}) => {
    try {
      set({ loading: true, error: null });
      const filters = get().filters;

      // Convert store filters to API filters
      const apiFilters: PromoCodeFilters = {};
      if (filters.search) {
        apiFilters.search = filters.search;
      }
      // Removed isActive filter to display all promo codes regardless of status

      const response = await getAllPromoCodes(page, limit, apiFilters);
      set({
        promoCodes: response.result.promoCodes,
        total: response.result.total,
        currentPage: response.result.page,
        totalPages: response.result.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addPromoCode: async (data) => {
    try {
      set({ loading: true, error: null });
      await createPromoCode(data);
      // Refresh the promo codes list after creating a new promo code
      await get().fetchPromoCodes({ page: 1 });
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updatePromoCode: async (promoCodeId, data) => {
    try {
      set({ loading: true, error: null });
      await updatePromoCode(promoCodeId, data);
      // Refresh the promo codes list after updating
      await get().fetchPromoCodes();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  deletePromoCode: async (promoCodeId) => {
    try {
      set({ loading: true, error: null });
      await deletePromoCode(promoCodeId);
      // Refresh the promo codes list after deletion
      await get().fetchPromoCodes();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
}));

export default usePromoCodeStore;
