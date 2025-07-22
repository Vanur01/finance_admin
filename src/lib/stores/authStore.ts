//src/stores/useAuthStore.ts

import { create } from 'zustand';
import Cookies from 'js-cookie';
import { login, logout, generateNewTokens } from '@/app/api/authApi';

interface User {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  status: number;
  userType: string;
  signupStatus: number;
  deviceTokens: string[];
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
    const user = await login(email, password, deviceToken);
    // Set cookies
    Cookies.set('token', user.tokens, COOKIE_OPTIONS);
    Cookies.set('refreshToken', user.refreshTokens, COOKIE_OPTIONS);
    Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);
    set({
      token: user.tokens,
      refreshToken: user.refreshTokens,
      isAuthenticated: true,
      user
    });
    console.log(user)
  },

  logoutUser: async (fcmToken?: string) => {
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

    await logout(currentUser._id, fcmToken || currentUser.deviceTokens[0] || '');

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

      const { tokens, refresh_tokens } = response.data;
      
      // Update cookies with new tokens
      Cookies.set('token', tokens, COOKIE_OPTIONS);
      Cookies.set('refresh_token', refresh_tokens, COOKIE_OPTIONS);
      
      // Update store state
      set({ 
        token: tokens,
        refreshToken: refresh_tokens,
        isAuthenticated: true 
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      await useAuthStore.getState().logoutUser();
    }
  },
}));

