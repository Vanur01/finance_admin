import { create } from "zustand";
import {
  getAllModules,
  createModule,
  updateModule,
  deleteModule,
  calculateModulePrice,
  type Module,
} from "@/app/api/moduleApi";

interface ModuleStore {
  modules: Module[];
  loading: boolean;
  error: string | null;
  selectedModuleIds: string[];
  calculatedPrice: {
    totalModules: number;
    totalPrice: number;
    moduleDetails: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  } | null;
  
  // Actions
  fetchModules: () => Promise<void>;
  addModule: (data: { name: string; description: string; price: number }) => Promise<void>;
  updateModule: (moduleId: string, data: { name?: string; description?: string; price?: number; isActive?: boolean }) => Promise<void>;
  deleteModule: (moduleId: string) => Promise<void>;
  toggleModuleSelection: (moduleId: string) => void;
  clearModuleSelection: () => void;
  calculateSelectedModulesPrice: () => Promise<void>;
}

const useModuleStore = create<ModuleStore>((set, get) => ({
  modules: [],
  loading: false,
  error: null,
  selectedModuleIds: [],
  calculatedPrice: null,
  
  fetchModules: async () => {
    try {
      set({ loading: true, error: null });
      const response = await getAllModules();
      set({
        modules: response.result.modules,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  addModule: async (data) => {
    try {
      set({ loading: true, error: null });
      await createModule(data);
      // Refresh the modules list after creating a new module
      await get().fetchModules();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  updateModule: async (moduleId, data) => {
    try {
      set({ loading: true, error: null });
      await updateModule(moduleId, data);
      // Refresh the modules list after updating
      await get().fetchModules();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
  
  deleteModule: async (moduleId) => {
    try {
      set({ loading: true, error: null });
      await deleteModule(moduleId);
      // Refresh the modules list after deleting
      await get().fetchModules();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },
  
  toggleModuleSelection: (moduleId) => {
    set((state) => {
      const isSelected = state.selectedModuleIds.includes(moduleId);
      
      if (isSelected) {
        return {
          selectedModuleIds: state.selectedModuleIds.filter(id => id !== moduleId),
          calculatedPrice: null, // Reset calculated price when selection changes
        };
      } else {
        return {
          selectedModuleIds: [...state.selectedModuleIds, moduleId],
          calculatedPrice: null, // Reset calculated price when selection changes
        };
      }
    });
  },
  
  clearModuleSelection: () => {
    set({ 
      selectedModuleIds: [],
      calculatedPrice: null
    });
  },
  
  calculateSelectedModulesPrice: async () => {
    const { selectedModuleIds } = get();
    
    if (selectedModuleIds.length === 0) {
      set({ calculatedPrice: null });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      const response = await calculateModulePrice(selectedModuleIds);
      set({
        calculatedPrice: response.result,
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));

export default useModuleStore;
