import axiosInstance from "./AxiosInstance";

// Types
export interface Module {
  _id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModulesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    page: number | null;
    limit: number | null;
    total: number;
    totalPages: number | null;
    modules: Module[];
  };
}

export interface SingleModuleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Module;
}

export interface ModulePriceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    totalModules: number;
    totalPrice: number;
    moduleDetails: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  };
}

// API Functions
export const createModule = async (data: {
  name: string;
  description: string;
  price: number;
}) => {
  try {
    const response = await axiosInstance.post<SingleModuleResponse>(
      "/api/v1/module/createModule",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllModules = async () => {
  try {
    const response = await axiosInstance.get<ModulesResponse>(
      "/api/v1/module/getAllModules"
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateModule = async (
  moduleId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
  }
) => {
  try {
    const response = await axiosInstance.put<SingleModuleResponse>(
      `/api/v1/module/updateModule/${moduleId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const calculateModulePrice = async (moduleIds: string[]) => {
  try {
    const response = await axiosInstance.post<ModulePriceResponse>(
      "/api/v1/module/calculatedModulePrice",
      { moduleIds }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteModule = async (moduleId: string) => {
  try {
    const response = await axiosInstance.delete<SingleModuleResponse>(
      `/api/v1/module/deleteModule/${moduleId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
