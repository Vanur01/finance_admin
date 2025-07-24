//src/stores/useAuthStore.ts

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { login, logout, generateNewTokens } from '@/app/api/authApi';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthActions {
  loginUser: (email: string, password: string, deviceToken: string) => Promise<void>;
  logoutUser: (fcmToken?: string) => Promise<void>;
  refreshTokens: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

type AuthStore = AuthState & AuthActions;

// Cookie options
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const
};

// Initialize state from cookies
const getInitialState = (): AuthState => ({
  token: Cookies.get('token') || null,
  refreshToken: Cookies.get('refreshToken') || null,
  isAuthenticated: !!Cookies.get('token'),
  user: Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null,
});


export const useAuthStore = create<AuthStore>()((set) => ({
  ...getInitialState(),

  setTokens: (accessToken: string, refreshToken: string) => {
    Cookies.set('token', accessToken, COOKIE_OPTIONS);
    Cookies.set('refreshToken', refreshToken, COOKIE_OPTIONS);
    set({ token: accessToken, refreshToken, isAuthenticated: true });
  },

  loginUser: async (email, password, deviceToken) => {
    try {
      const user = await login(email, password, deviceToken);
      console.log('Login response:', user);
      
      if (!user || !user.token) {
        throw new Error('Invalid login response');
      }

      // Set cookies
      Cookies.set('token', user.token, COOKIE_OPTIONS);
      Cookies.set('refreshToken', user.refreshToken, COOKIE_OPTIONS);
      Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
      
      set({
        token: user.token,
        refreshToken: user.refreshToken,
        isAuthenticated: true,
        user
      });
    } catch (error) {
      console.error('Login error in store:', error);
      throw error;
    }
  },

  logoutUser: async (deviceToken?: string) => {
    const currentUser = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;

    if (!currentUser?._id) {
      // User not found, just clear cookies and state
      Cookies.remove('token');
      Cookies.remove('refreshToken');
      Cookies.remove('user');
      set({
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        user: null
      });
      return;
    }

    await logout(currentUser._id, deviceToken || '');

    // Remove cookies
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('user');

    set({
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      user: null
    });
  },

  refreshTokens: async () => {
    try {
      const currentRefreshToken = Cookies.get('refreshToken');
      
      if (!currentRefreshToken) {
        await useAuthStore.getState().logoutUser();
        return;
      }

      const response = await generateNewTokens(currentRefreshToken);

      if (response.statusCode !== 200 || !response.data) {
        await useAuthStore.getState().logoutUser();
        return;
      }

      const { token, refreshToken } = response.data;
      
      // Update cookies with new tokens
      Cookies.set('token', token, COOKIE_OPTIONS);
      Cookies.set('refreshToken', refreshToken, COOKIE_OPTIONS);
      
      // Update store state
      set({ 
        token,
        refreshToken,
        isAuthenticated: true 
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      await useAuthStore.getState().logoutUser();
    }
  },
}));

