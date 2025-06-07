'use client';

import { deleteCookie, getCookie, setCookie } from 'cookies-next/client';
import { createContext, useContext, useEffect, useState } from 'react';

import { Team } from '@/components/team-switcher';
import apiClient, { type ApiResponse } from '@/services/api-client';
import { AxiosError } from 'axios';

export interface User {
  id: string;
  name: string | undefined;
  email: string;
  avatar: string | undefined;
  role: 'Creator' | 'Admin' | 'Member';
  teams: Team[];
  canCreateTeams: boolean;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<ApiResponse<LoginResponse | null> | null>;
  signup: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<ApiResponse<LoginResponse | null> | null>;
  logout: () => void;

  activeTeamId: string | null;
  setActiveTeam: (teamId: string) => void;
  loadUser: () => Promise<void>;
  tags: string[];
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const getStoredActiveTeam = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('activeTeamId') || null;
  };

  const storeActiveTeam = (teamId: string | null) => {
    if (typeof window === 'undefined') return;
    if (teamId) {
      localStorage.setItem('activeTeamId', teamId);
    } else {
      localStorage.removeItem('activeTeamId');
    }
  };

  const loadUser = async () => {
    try {
      const authCookie = getCookie('authToken');
      if (!authCookie) {
        setUser(null);
        return;
      }
      const { data } = await apiClient.get<ApiResponse<User>>('/auth/me');
      const fetchedUser = data.responseObject;
      setUser(fetchedUser);
      if (Number(fetchedUser?.teams.length) > 0) {
        const storedTeam = getStoredActiveTeam();
        const activeTeam =
          storedTeam && fetchedUser?.teams.some(t => t.id === storedTeam)
            ? storedTeam
            : fetchedUser?.teams[0].id;
        if (activeTeam) {
          setActiveTeamId(activeTeam);
          storeActiveTeam(activeTeam);
          const role = fetchedUser!.teams.find(t => t.id === activeTeam)!.role;
          setUser({ ...fetchedUser!, role });
          getTags(activeTeam);
        }
      } else {
        setActiveTeamId(null);
        storeActiveTeam(null);
      }
    } catch (error) {
      setUser(null);
      setActiveTeamId(null);
      storeActiveTeam(null);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setActiveTeam = (teamId: string) => {
    if (user?.teams?.some(t => t.id === teamId)) {
      setActiveTeamId(teamId);
      storeActiveTeam(teamId);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        {
          email,
          password,
        }
      );

      const token = data.responseObject?.token;
      if (token) {
        await setCookie('authToken', token.token, {
          expires: new Date(token.expiresAt),
        });
        await loadUser();
      }
      return data;
    } catch (error) {
      const e = error as AxiosError<ApiResponse<null>>;
      if (e.response) return e.response.data!;
      return null;
    }
  };

  const signup = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
        '/auth/signup',
        {
          email,
          password,
          confirmPassword,
        }
      );

      const token = data.responseObject?.token;
      if (token) {
        await setCookie('authToken', token.token, {
          expires: new Date(token.expiresAt),
        });
        await loadUser();
      }

      return data;
    } catch (error) {
      const e = error as AxiosError<ApiResponse<null>>;
      if (e.response) return e.response.data!;
      return null;
    }
  };

  const logout = async () => {
    const token = await getCookie('authToken');
    if (token) {
      await apiClient.post('/auth/logout');
      deleteCookie('authToken');
      setUser(null);
    }
  };

  const getTags = async (teamId?: string) => {
    try {
      const { data } = await apiClient.get<ApiResponse<string[]>>(
        '/teams/tags',
        {
          headers: {
            'x-team-id': teamId || activeTeamId,
          },
        }
      );
      setTags(data.responseObject!);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        activeTeamId,
        loadUser,
        setActiveTeam,
        tags,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

interface LoginResponse {
  createdAt: Date;
  email: string;
  id: string;
  token: Token;
  updatedAt: Date;
}

interface Token {
  abilities: string[];
  expiresAt: string;
  lastUsedAt: string | null;
  name: string;
  token: string;
  type: string;
}
