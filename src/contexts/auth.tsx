"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  create as CreateRequest,
  login as LoginRequest,
  decodeToken as DecodeTokenRequest,
  CreateUserDto,
  LoginUserDto,
} from "../lib/http/api/user";
import { User } from "../models/user";

interface AuthContextType {
  user: User | null;
  login: (loginUserDto: LoginUserDto) => Promise<void>;
  register: (createUserDto: CreateUserDto) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const safeGetToken = () =>
    typeof window != "undefined" ? localStorage.getItem("token") : null;

  const [isLoading, setIsLoading] = useState<boolean>(() => !!safeGetToken());
  const [user, setUser] = useState<User | null>(null);

  const login = async (loginUserDto: LoginUserDto) => {
    const result = await LoginRequest(loginUserDto);
    localStorage.setItem("token", result.token);
    setUser(result.user);
  };

  const register = async (createUserDto: CreateUserDto) => {
    const result = await CreateRequest(createUserDto);
    localStorage.setItem("token", result.token);
    setUser(result.user);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) return;

    const token = safeGetToken();
    if (!token) return setIsLoading(false);

    let cancelled = false;

    (async () => {
      try {
        const decoded = await DecodeTokenRequest(token);
        if (!cancelled) setUser(decoded);
      } catch {
        if (!cancelled) localStorage.removeItem("token");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
