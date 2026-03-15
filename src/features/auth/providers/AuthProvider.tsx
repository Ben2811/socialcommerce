"use client";
import { logout as serverLogout } from "@/actions/auth/logout";
import { User } from "@/interfaces/user.interface";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
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

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
