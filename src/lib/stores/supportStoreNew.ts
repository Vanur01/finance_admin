import { create } from "zustand";
import {
  createSupport,
  getAllSupports,
  getSupportById,
  updateSupport,
  deleteSupport,
  type Support,
  type CreateSupportRequest,
  type UpdateSupportRequest,
} from "@/app/api/supportApi";

interface SupportStore {
  supports: Support[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  selectedSupport: Support | null;
  
  fetchSupports: (params: { page?: number; limit?: number }) => Promise<void>;
  fetchSupportById: (supportId: string) => Promise<void>;
  createSupport: (data: CreateSupportRequest) => Promise<void>;
  updateSupport: (
    supportId: string,
    data: UpdateSupportRequest
  ) => Promise<void>;
  deleteSupport: (supportId: string) => Promise<void>;
  
  // Filters
  filters: {
    search: string;
    status: string;
    priority: string;
    category: string;
  };
  setFilters: (filters: Partial<SupportStore['filters']>) => void;
  resetFilters: () => void;
}

const useSupportStore = create<SupportStore>((set, get) => ({
  supports: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  selectedSupport: null,
  
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
  },

  fetchSupports: async ({ page = 1, limit = 10 }) => {
    try {
      set({ loading: true, error: null });
      const response = await getAllSupports(page, limit);
      
      set({
        supports: response.data,
        total: response.total,
        currentPage: response.page,
        totalPages: response.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error fetching supports:', error);
    }
  },

  fetchSupportById: async (supportId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await getSupportById(supportId);
      set({ selectedSupport: response.data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error fetching support details:', error);
    }
  },

  createSupport: async (data) => {
    try {
      set({ loading: true, error: null });
      await createSupport(data);
      
      // Refresh the supports list after creating a new support ticket
      const { fetchSupports } = get();
      await fetchSupports({ page: 1 });
      
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error creating support ticket:', error);
      throw error;
    }
  },

  updateSupport: async (supportId: string, data) => {
    try {
      set({ loading: true, error: null });
      await updateSupport(supportId, data);
      
      // Refresh the list after updating a support ticket
      const { fetchSupports, currentPage } = get();
      await fetchSupports({ page: currentPage });
      
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error updating support ticket:', error);
      throw error;
    }
  },

  deleteSupport: async (supportId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteSupport(supportId);
      
      // Refresh the list after deleting a support ticket
      const { fetchSupports, currentPage } = get();
      await fetchSupports({ page: currentPage });
      
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      console.error('Error deleting support ticket:', error);
      throw error;
    }
  },
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  resetFilters: () => set({
    filters: {
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
    }
  }),
}));

export default useSupportStore;
