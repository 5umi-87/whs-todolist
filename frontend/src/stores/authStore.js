import { create } from 'zustand';
import { axiosInstance } from '../services/api';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });

    // Retry mechanism for rate limiting
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount <= maxRetries) {
      try {
        const response = await axiosInstance.post('/auth/login', {
          email,
          password
        });

        const { data } = response;
        const { accessToken, refreshToken, user } = data.data;

        // Store tokens in localStorage for now (in a real app, consider httpOnly cookies for refresh token)
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        set({
          user,
          token: accessToken,
          isAuthenticated: true,
          isLoading: false
        });

        return { success: true, user };
      } catch (error) {
        // Check if it's a rate limit error (429)
        if (error.response?.status === 429 && retryCount < maxRetries) {
          // Calculate delay with exponential backoff (1s, 2s, 4s)
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          retryCount++;
        } else {
          set({ isLoading: false });
          return {
            success: false,
            error: error.response?.data?.error?.message || '로그인에 실패했습니다'
          };
        }
      }
    }

    // If retries are exhausted
    set({ isLoading: false });
    return {
      success: false,
      error: '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.'
    };
  },

  register: async (email, password, username) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/register', {
        email,
        password,
        username
      });
      
      const { data } = response;
      const { user } = data.data;

      set({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.error?.message || '회원가입에 실패했습니다' 
      };
    }
  },

  logout: () => {
    // Remove tokens from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    set({
      user: null,
      token: null,
      isAuthenticated: false
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        // In a real app, you would validate the token with an API call
        // For now, just set the user as authenticated if token exists
        set({ token, isAuthenticated: true });

        // Optionally fetch user profile to confirm validity
        // const response = await axiosInstance.get('/users/me');
        // set({ user: response.data.data, token, isAuthenticated: true });
      } catch (error) {
        // If token validation fails, logout the user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  }
}));

export { useAuthStore };