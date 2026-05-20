import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User, LoginPayload, RegisterPayload } from '@/types/user.types';
import { authApi } from '@/api/auth.api';
import { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api.types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const response = await authApi.getMe();
        setUser(response.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const response = await authApi.login(payload);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    setUser(response.data.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    const response = await authApi.register(payload);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    setUser(response.data.user);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/** Helper to extract API error message */
export const getApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.errors && data.errors.length > 0) {
      return data.errors.join(', ');
    }
    return data?.message ?? error.message;
  }
  return 'An unexpected error occurred';
};
