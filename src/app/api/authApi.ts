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
  role: "superadmin",
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
  success: boolean;
  statusCode: number;
  message: string;
  result: {
    user: {
      _id: string;
      name: string;
      email: string;
      mobile: string;
      role: string;
      isActive: boolean;
      deviceTokens: string[];
      tokens: string;
      refreshTokens: string;
      createdAt: string;
      updatedAt: string;
      lastLoginDate: string;
      profilePic: string | null;
      company: any;
    };
  };
}

interface RefreshTokenResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    user_id: string;
    token: string;
    refreshToken: string;
  };
}

export async function login(email: string, password: string, deviceToken: string) {
  try {
    const response = await axiosInstance.post<LoginResponse>('/api/v1/user/login', { 
      email, 
      password, 
      deviceToken 
    });
    
    if (response.data.success) {
      const user = response.data.result.user;
      return {
        ...user,
        token: user.tokens,         // Map tokens to token
        refreshToken: user.refreshTokens  // Map refreshTokens to refreshToken
      };
    } else {
      throw new Error(response.data.message || 'Login failed');
    }
  } catch (error: any) {
    console.error('Login error:', error.response?.data || error);
    throw error;
  }
}

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>('/api/v1/user/register', {
    name: data.name,
    email: data.email,
    password: data.password,
    mobile: data.mobile,
    role: data.role || 'superadmin'
  });
  return response.data;
};

export const logout = async (userId: string, deviceToken: string) =>
  (await axiosInstance.post('/api/v1/user/logout', { userId, deviceToken })).data;

export const generateNewTokens = async (refresh_token: string) => {
  try {
    const response = await axiosInstance.post<RefreshTokenResponse>('/api/v1/user/generatedAuthNewToken', { 
      refresh_token 
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


