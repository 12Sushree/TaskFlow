import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { User } from "@/features/auth/domain/entities/User";
import { STORAGE_KEYS } from "@/config/api.config";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthenticatedUser: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<
  AuthContextValue | undefined
>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
          AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load stored auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,

      setAuthenticatedUser: async (user: User, token: string) => {
        try {
          await Promise.all([
            AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
            AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
          ]);
          setUser(user);
        } catch (error) {
          console.error("Failed to save auth data:", error);
        }
      },

      logout: async () => {
        try {
          await Promise.all([
            AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
            AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
          ]);
          setUser(null);
        } catch (error) {
          console.error("Failed to clear auth data:", error);
        }
      },
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}