import { create } from 'zustand';
import { getLeadList } from '@/app/api/leadApi';

interface Lead {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  status: string;
  date?: string;
  time?: string;
  createdAt: string;
  updatedAt: string;
}

interface LeadListResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    total: number;
    page: number;
    limit: number;
    data: Lead[];
  };
}

interface LeadStore {
  leads: Lead[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  fetchLeads: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => Promise<void>;
  setPage: (page: number) => void;
  setLeads: (leads: Lead[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,

  fetchLeads: async (params) => {
    try {
      set({ loading: true, error: null });
      const response = await getLeadList(params);
      set({
        leads: response.data.data,
        total: response.data.total,
        page: response.data.page,
        limit: response.data.limit,
        loading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch leads',
        loading: false,
      });
    }
  },

  setPage: (page) => {
    set({ page });
    const { limit } = get();
    get().fetchLeads({ page, limit });
  },

  setLeads: (leads) => set({ leads }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export default useLeadStore;
