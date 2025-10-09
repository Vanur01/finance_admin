import { create } from "zustand";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  type Contact,
  type ContactFilters,
} from "@/app/api/contact";

interface ContactStore {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  selectedContact: Contact | null;
  filters: {
    search: string;
    name: string;
    email: string;
    status: string;
  };
  setFilters: (filters: Partial<ContactStore['filters']>) => void;
  resetFilters: () => void;
  fetchContacts: (params: { page?: number; limit?: number }) => Promise<void>;
  fetchContactById: (contactId: string) => Promise<void>;
  createContact: (data: {
    name: string;
    email: string;
    mobile: string;
    message: string;
    status: string;
  }) => Promise<void>;
  updateContact: (
    contactId: string,
    data: {
      name?: string;
      email?: string;
      mobile?: string;
      message?: string;
      status?: string;
    }
  ) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
}

const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  totalPages: 1,
  selectedContact: null,
  filters: {
    search: '',
    name: '',
    email: '',
    status: 'all',
  },
  
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },
  
  resetFilters: () => {
    set({
      filters: {
        search: '',
        name: '',
        email: '',
        status: 'all',
      }
    });
  },

  fetchContacts: async ({ page = 1, limit = 10 }) => {
    try {
      set({ loading: true, error: null });
      const filters = get().filters;
      
      // Convert store filters to API filters
      const apiFilters: ContactFilters = {};
      
      // Add each filter if it has a value
      if (filters.search) {
        apiFilters.search = filters.search;
      }
      if (filters.name) {
        apiFilters.name = filters.name;
      }
      if (filters.email) {
        apiFilters.email = filters.email;
      }
      if (filters.status && filters.status !== 'all') {
        apiFilters.status = filters.status;
      }
      
      const response = await getAllContacts(page, limit, apiFilters);
      set({
        contacts: response.result.contacts,
        total: response.result.total,
        currentPage: response.result.currentPage,
        totalPages: response.result.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchContactById: async (contactId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await getContactById(contactId);
      set({ selectedContact: response.result, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createContact: async (data) => {
    try {
      set({ loading: true, error: null });
      await createContact(data);
      // Refresh the contacts list after creating a new contact
      const { currentPage } = useContactStore.getState();
      await useContactStore.getState().fetchContacts({ page: currentPage });
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateContact: async (contactId, data) => {
    try {
      set({ loading: true, error: null });
      await updateContact(contactId, data);
      // Refresh the contacts list and selected contact after update
      const { currentPage } = useContactStore.getState();
      await Promise.all([
        useContactStore.getState().fetchContacts({ page: currentPage }),
        useContactStore.getState().fetchContactById(contactId),
      ]);
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteContact: async (contactId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteContact(contactId);
      // Refresh the contacts list after deletion
      const { currentPage } = useContactStore.getState();
      await useContactStore.getState().fetchContacts({ page: currentPage });
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

export default useContactStore;
