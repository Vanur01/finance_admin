import { create } from "zustand";
import {
  getAllCompanies,
  getCompanyDetails,
  type Company,
  type CompanyListResponse,
  type CompanyDetailsResponse,
} from "@/app/api/companyApi";

interface CompanyStore {
  companies: Company[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  selectedCompany: Company | null;
  
  // Fetch companies with optional filters
  fetchCompanies: (params: { 
    page?: number; 
    limit?: number; 
    filters?: { 
      companyName?: string; 
      industry?: string; 
      size?: string; 
    }; 
  }) => Promise<void>;
  
  // Get details for a specific company
  fetchCompanyDetails: (companyId: string) => Promise<void>;
  
  // Filters
  filters: {
    search: string;
    industry: string;
    size: string;
  };
  
  // Filter actions
  setFilters: (filters: Partial<CompanyStore['filters']>) => void;
  resetFilters: () => void;
}

const useCompanyStore = create<CompanyStore>((set, get) => ({
  companies: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  selectedCompany: null,
  
  filters: {
    search: '',
    industry: 'all',
    size: 'all',
  },
  
  fetchCompanies: async ({ page = 1, limit = 10, filters = {} }) => {
    const currentFilters = get().filters;
    
    try {
      set({ loading: true, error: null });
      
      // Apply filters from store state
      const apiFilters = {
        companyName: currentFilters.search || undefined,
        industry: currentFilters.industry !== 'all' ? currentFilters.industry : undefined,
        size: currentFilters.size !== 'all' ? currentFilters.size : undefined,
        ...filters
      };
      
      const response = await getAllCompanies(page, limit, apiFilters);
  

      if (response.success) {
        set({
          companies: response.result.data,
          total: response.result.total,
          currentPage: response.result.page,
          totalPages: response.result.totalPages,
          loading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to fetch companies',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'An error occurred while fetching companies',
        loading: false,
      });
    }
  },
  
  fetchCompanyDetails: async (companyId: string) => {
    try {
      set({ loading: true, error: null });
      
      const response = await getCompanyDetails(companyId);
      
      if (response.success) {
        set({
          selectedCompany: response.result,
          loading: false,
        });
      } else {
        set({
          error: response.message || 'Failed to fetch company details',
          loading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'An error occurred while fetching company details',
        loading: false,
      });
    }
  },
  
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },
  
  resetFilters: () => {
    set({
      filters: {
        search: '',
        industry: 'all',
        size: 'all',
      }
    });
  },
}));

export default useCompanyStore;
