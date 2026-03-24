import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api, type AuthUser } from "@/lib/api";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Storage helper that uses BOTH localStorage and Telegram CloudStorage
// localStorage works everywhere, CloudStorage persists in Telegram Mini App
const storage = {
  async getItem(key: string): Promise<string | null> {
    // Try localStorage first (works in all environments)
    const localValue = localStorage.getItem(key);
    if (localValue) {
      console.log('[Storage] Found token in localStorage');
      return localValue;
    }

    // If in Telegram, also try CloudStorage
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.CloudStorage) {
      console.log('[Storage] Checking Telegram CloudStorage');
      return new Promise((resolve) => {
        tg.CloudStorage.getItem(key, (_err: any, value: string | null) => {
          if (value) {
            console.log('[Storage] Found token in CloudStorage, syncing to localStorage');
            localStorage.setItem(key, value);
          }
          resolve(value || null);
        });
      });
    }
    
    return null;
  },
  
  async setItem(key: string, value: string): Promise<void> {
    // Always save to localStorage
    localStorage.setItem(key, value);
    console.log('[Storage] Saved to localStorage');
    
    // Also save to CloudStorage if in Telegram
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.CloudStorage) {
      console.log('[Storage] Also saving to Telegram CloudStorage');
      return new Promise((resolve) => {
        tg.CloudStorage.setItem(key, value, () => {
          console.log('[Storage] Saved to CloudStorage');
          resolve();
        });
      });
    }
  },
  
  async removeItem(key: string): Promise<void> {
    // Remove from both
    localStorage.removeItem(key);
    console.log('[Storage] Removed from localStorage');
    
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.CloudStorage) {
      return new Promise((resolve) => {
        tg.CloudStorage.removeItem(key, () => {
          console.log('[Storage] Removed from CloudStorage');
          resolve();
        });
      });
    }
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load token from storage on mount
    storage.getItem("ryuu_token").then((savedToken) => {
      if (!savedToken) {
        setLoading(false);
        return;
      }
      setToken(savedToken);
      api.me()
        .then((u) => setUser(u))
        .catch(() => {
          storage.removeItem("ryuu_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    });
  }, []);

  const getTelegramId = (): string | undefined => {
    try {
      const tg = (window as any).Telegram?.WebApp;
      if (!tg) {
        console.log('[Auth] Telegram WebApp not available');
        return undefined;
      }
      
      // Wait for Telegram SDK to be ready
      if (tg.initDataUnsafe?.user?.id) {
        const id = String(tg.initDataUnsafe.user.id);
        console.log('[Auth] Telegram ID found:', id);
        return id;
      }
      
      console.log('[Auth] Telegram ID not found in initDataUnsafe');
      return undefined;
    } catch (err) {
      console.error('[Auth] Error getting Telegram ID:', err);
      return undefined;
    }
  };

  const login = async (username: string, password: string) => {
    const res = await api.login(username, password, getTelegramId());
    await storage.setItem("ryuu_token", res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (username: string, password: string) => {
    const res = await api.register(username, password, getTelegramId());
    await storage.setItem("ryuu_token", res.token);
    setToken(res.token);
    setUser(res.user);
  };

  const refreshUser = async () => {
    const u = await api.me();
    setUser(u);
  };

  const logout = async () => {
    await storage.removeItem("ryuu_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
