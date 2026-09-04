import {
  createContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { User } from "@/features/auth/domain/entities/User";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  setAuthenticatedUser: (user: User) => void;
  logout: () => void;
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

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,

      setAuthenticatedUser: (user: User) => {
        setUser(user);
      },

      logout: () => {
        setUser(null);
      },
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}