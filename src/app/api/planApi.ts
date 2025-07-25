import axiosInstance from "./AxiosInstance";
import { Module } from "./moduleApi";

// Types
export interface BillingCycle {
  monthly: {
    price: number;
  };
  yearly: {
    price: number;
  };
}

export interface Plan {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  maxUsers: number;
  maxManagers: number;
  modules: Module[];
  billingCycle?: BillingCycle;
  __v?: number;
}

export type PlanName = "Free" | "Popular" | "Custom";

export interface PlansResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    plans: Plan[];
  };
}

export interface SinglePlanResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: Plan;
}

export interface CreatePlanData {
  name: PlanName;
  description: string;
  isActive: boolean;
  maxUsers: number;
  maxManagers: number;
  modules: string[]; // Array of module IDs
}

// API Functions
export const createPlan = async (data: CreatePlanData) => {
  try {
    const response = await axiosInstance.post<SinglePlanResponse>(
      "/api/v1/plan/createPlan",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface PlanFilters {
  search?: string;
  isActive?: boolean;
}

export const getAllPlans = async (
  page: number = 1,
  limit: number = 10,
  filters?: PlanFilters
) => {
  try {
    let url = `/api/v1/plan/getAllPlans?page=${page}&limit=${limit}`;

    // Add filters to URL if provided
    if (filters) {
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.isActive !== undefined)
        url += `&isActive=${filters.isActive}`;
    }

    const response = await axiosInstance.get<PlansResponse>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePlan = async (
  planId: string,
  data: Partial<CreatePlanData>
) => {
  try {
    const response = await axiosInstance.put<SinglePlanResponse>(
      `/api/v1/plan/updatePlan/${planId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePlan = async (planId: string) => {
  try {
    const response = await axiosInstance.delete<SinglePlanResponse>(
      `/api/v1/plan/deletePlan/${planId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
