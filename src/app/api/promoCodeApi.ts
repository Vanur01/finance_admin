import axiosInstance from "./AxiosInstance";

// Types
export type DiscountType = "percentage" | "fixed";

export interface PromoCode {
  _id: string;
  promocode: string;
  discount: number;
  discountType: DiscountType;
  expiresAt: string;
  isActive: boolean;
  __v?: number;
}

export interface PromoCodesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    page: number;
    total: number;
    totalPages: number;
    promoCodes: PromoCode[];
  };
}

export interface SinglePromoCodeResponse {
  success: boolean;
  statusCode: number;
  message: string;
  result: PromoCode;
}

export interface CreatePromoCodeData {
  promocode: string;
  discount: number;
  discountType: DiscountType;
  expiresAt: string;
  isActive: boolean;
}

// API Functions
export const createPromoCode = async (data: CreatePromoCodeData) => {
  try {
    const response = await axiosInstance.post<SinglePromoCodeResponse>(
      "/api/v1/promocode/createPromoCode",
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export interface PromoCodeFilters {
  search?: string;
  isActive?: boolean;
}

export const getAllPromoCodes = async (
  page: number = 1,
  limit: number = 10,
  filters?: PromoCodeFilters
) => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (filters) {
      if (filters.search) {
        queryParams.append("search", filters.search);
      }
      // Removed isActive filter to show all promo codes regardless of status
    }

    const response = await axiosInstance.get<PromoCodesResponse>(
      `/api/v1/promocode/getAllPromoCodes?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePromoCode = async (
  promoCodeId: string,
  data: Partial<CreatePromoCodeData>
) => {
  try {
    const response = await axiosInstance.put<SinglePromoCodeResponse>(
      `/api/v1/promocode/updatePromoCodes/${promoCodeId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePromoCode = async (promoCodeId: string) => {
  try {
    const response = await axiosInstance.delete<{
      success: boolean;
      statusCode: number;
      message: string;
    }>(`/api/v1/promocode/deletePromoCodes/${promoCodeId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
