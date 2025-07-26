import { create } from "zustand";
import { 
  getAllBookings, 
  getBookingById, 
  deleteBooking,
  updateBooking,
  rescheduleBooking,
  cancelBooking,
  completeBooking,
  type Booking,
  type BookingFilters 
} from "@/app/api/demoApi";

interface DemoStore {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  selectedBooking: Booking | null;
  filters: BookingFilters;
  fetchBookings: (params: { page?: number; limit?: number }) => Promise<void>;
  fetchBookingById: (bookingId: string) => Promise<void>;
  deleteBooking: (bookingId: string) => Promise<void>;
  updateBooking: (bookingId: string, data: { name: string; email: string; mobile: string; scheduledAt: string }) => Promise<void>;
  rescheduleBooking: (bookingId: string, scheduledAt: string) => Promise<void>;
  cancelBooking: (bookingId: string, reason: string) => Promise<void>;
  completeBooking: (bookingId: string) => Promise<void>;
  setFilters: (newFilters: Partial<BookingFilters>) => void;
  resetFilters: () => void;
}

const useDemoStore = create<DemoStore>((set, get) => ({
  bookings: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,
  selectedBooking: null,
  filters: {
    name: '',
    email: '',
    scheduledAt: '',
    status: ''
  },

  setFilters: (newFilters: Partial<BookingFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  resetFilters: () => {
    set({
      filters: {
        name: '',
        email: '',
        scheduledAt: '',
        status: ''
      }
    });
  },

  fetchBookings: async ({ page = 1, limit = 10 }) => {
    try {
      set({ loading: true, error: null });
      const filters = get().filters;
      const response = await getAllBookings(page, limit, filters);
      set({
        bookings: response.result.results,
        total: response.result.total,
        page: response.result.page,
        totalPages: response.result.totalPages,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  fetchBookingById: async (bookingId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await getBookingById(bookingId);
      set({ selectedBooking: response.result, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteBooking: async (bookingId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteBooking(bookingId);
      // Refresh the bookings list after deletion
      const currentPage = useDemoStore.getState().page;
      await useDemoStore.getState().fetchBookings({ page: currentPage });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateBooking: async (bookingId: string, data: { name: string; email: string; mobile: string; scheduledAt: string }) => {
    try {
      set({ loading: true, error: null });
      await updateBooking(bookingId, data);
      // Refresh the booking details and list after update
      await useDemoStore.getState().fetchBookingById(bookingId);
      const currentPage = useDemoStore.getState().page;
      await useDemoStore.getState().fetchBookings({ page: currentPage });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  rescheduleBooking: async (bookingId: string, scheduledAt: string) => {
    try {
      set({ loading: true, error: null });
      await rescheduleBooking(bookingId, scheduledAt);
      // Refresh the booking details and list after rescheduling
      await useDemoStore.getState().fetchBookingById(bookingId);
      const currentPage = useDemoStore.getState().page;
      await useDemoStore.getState().fetchBookings({ page: currentPage });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  cancelBooking: async (bookingId: string, reason: string) => {
    try {
      set({ loading: true, error: null });
      await cancelBooking(bookingId, reason);
      // Refresh the booking details and list after cancellation
      await useDemoStore.getState().fetchBookingById(bookingId);
      const currentPage = useDemoStore.getState().page;
      await useDemoStore.getState().fetchBookings({ page: currentPage });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  completeBooking: async (bookingId: string) => {
    try {
      set({ loading: true, error: null });
      await completeBooking(bookingId);
      // Refresh the booking details and list after completion
      await useDemoStore.getState().fetchBookingById(bookingId);
      const currentPage = useDemoStore.getState().page;
      await useDemoStore.getState().fetchBookings({ page: currentPage });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

export default useDemoStore;
