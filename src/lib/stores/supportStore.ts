import { create } from 'zustand';
import { 
  getAllSupportTickets, 
  getSupportTicketById, 
  updateSupportTicketStatus, 
  createSupportTicket 
} from '@/app/api/supportApi';

// Types
interface User {
  _id: string;
  email: string;
  name: string;
  mobile: string;
}

interface SupportTicket {
  _id: string;
  user: User;
  category: string;
  subject: string;
  priority: 'low' | 'medium' | 'high';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  tickets: SupportTicket[];
}

interface SupportStore {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters: {
    search: string;
    status: string;
    priority: string;
    category: string;
    date: Date | undefined;
  };
  fetchTickets: (page?: number, limit?: number) => Promise<void>;
  fetchTicketById: (id: string) => Promise<void>;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => Promise<void>;
  createTicket: (ticketData: Omit<SupportTicket, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  setError: (error: string | null) => void;
  clearSelectedTicket: () => void;
  setFilters: (filters: Partial<SupportStore['filters']>) => void;
  resetFilters: () => void;
}

const useSupportStore = create<SupportStore>((set) => ({
  tickets: [],
  selectedTicket: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    date: undefined,
  },

  fetchTickets: async (page = 1, limit = 10) => {
    try {
      set({ loading: true, error: null });
      
      const data = await getAllSupportTickets(page.toString(), limit.toString());
      
      set({
        tickets: data.data.tickets,
        pagination: {
          total: data.data.total,
          page: data.data.page,
          limit: data.data.limit,
          totalPages: data.data.totalPages,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch support tickets',
        loading: false,
      });
    }
  },

  fetchTicketById: async (id: string) => {
    try {
      set({ loading: true, error: null });
      const ticket = await getSupportTicketById(id);
      set({ selectedTicket: ticket, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch ticket',
        loading: false,
      });
    }
  },

  updateTicketStatus: async (id: string, status: SupportTicket['status']) => {
    try {
      set({ loading: true, error: null });
      const updatedTicket = await updateSupportTicketStatus(id, status);
      
      // Update the ticket in the list if it exists
      set((state) => ({
        tickets: state.tickets.map((ticket) => 
          ticket._id === id ? updatedTicket : ticket
        ),
        selectedTicket: state.selectedTicket?._id === id ? updatedTicket : state.selectedTicket,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update ticket status',
        loading: false,
      });
    }
  },

  createTicket: async (ticketData) => {
    try {
      set({ loading: true, error: null });
      const newTicket = await createSupportTicket(ticketData);
      
      // Add the new ticket to the list
      set((state) => ({
        tickets: [newTicket, ...state.tickets],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create ticket',
        loading: false,
      });
    }
  },

  setError: (error: string | null) => set({ error }),
  
  clearSelectedTicket: () => set({ selectedTicket: null }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  resetFilters: () => set((state) => ({
    filters: {
      search: '',
      status: 'all',
      priority: 'all',
      category: 'all',
      date: undefined,
    }
  })),
}));

export default useSupportStore;
