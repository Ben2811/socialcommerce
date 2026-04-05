"use client";
import { logout as serverLogout } from "@/actions/auth/logout";
import { getAuthToken } from "@/actions/auth/getToken";
import { User } from "@/features/profile/types/user.interface";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  getToken: async () => null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

export default function AuthProvider({
  initialUser = null,
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const logout = async () => {
    setUser(null);
    await serverLogout();
  };

  const getToken = async () => {
    return getAuthToken();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}