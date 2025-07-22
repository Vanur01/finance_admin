// src/api/authApi.ts
import axiosInstance from '@/app/api/AxiosInstance';

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  mobile: string;
  companyName: string;
  role: string;
  isActive: boolean;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  companySize: string;
}

export const defaultRegisterFormValues: RegisterFormData = {
  email: "",
  password: "",
  name: "",
  mobile: "",
  companyName: "",
  role: "SUPERADMIN",
  isActive: true,
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  },
  companySize: "11-50",
};

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  mobile: string;
  companyName: string;
  role: string;
  isActive: boolean;
  address: Address;
  companySize: string;
}

export const companySizeOptions = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
] as const;

interface RegisterResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    companyName: string;
    companySize: string;
    userType: string;
    isActive: boolean;
    address: Address;
    status: number;
    signupStatus: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface LoginResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      mobile: string;
      status: number;
      userType: string;
      tokens: string;
      refreshTokens: string;
      deviceTokens: string[];
      signupStatus: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface RefreshTokenResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    user_id: string;
    tokens: string;
    refresh_tokens: string;
  };
}

export async function login(email: string, password: string, deviceToken: string) {
  const response = await axiosInstance.post<LoginResponse>('/v1/users/login', { email, password, deviceToken });
  return response.data.data.user;
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>('/v1/users/register', {
    ...data,
    role: 'SUPERADMIN',
    isActive: true
  });
  return response.data;
};

export const logout = async (userId: string, fcmToken: string) =>
  (await axiosInstance.get(`/v1/users/logout/${userId}/${fcmToken}`)).data;

export const generateNewTokens = async (refresh_token: string) => {
  try {
    const response = await axiosInstance.post<RefreshTokenResponse>('/v1/users/generate_new_tokens', { 
      refresh_token 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


