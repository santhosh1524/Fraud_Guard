import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  readableUserId: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [readableUserId, setReadableUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------
     Fetch readable user id from profiles
  ------------------------------------------------ */

  const fetchReadableId = async (authId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("readable_user_id")
        .eq("auth_id", authId)
        .maybeSingle();   // 🔥 FIXED

      if (error) {
        console.error("Profile fetch error:", error);
        setReadableUserId(null);
        return;
      }

      setReadableUserId(data?.readable_user_id ?? null);
    } catch (err) {
      console.error("Unexpected profile error:", err);
      setReadableUserId(null);
    }
  };

  /* ------------------------------------------------
     Initialize Auth Session
  ------------------------------------------------ */

  useEffect(() => {
    const initializeAuth = async () => {
      const { data } = await supabase.auth.getSession();

      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchReadableId(currentUser.id);
      }

      setIsLoading(false);
    };

    initializeAuth();

    /* ------------------------------------------------
       Listen for login/logout changes
    ------------------------------------------------ */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        fetchReadableId(currentUser.id); // ⚡ removed await
      } else {
        setReadableUserId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ------------------------------------------------
     AUTH FUNCTIONS
  ------------------------------------------------ */

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setReadableUserId(null);
  };

  /* ------------------------------------------------
     CONTEXT PROVIDER
  ------------------------------------------------ */

  return (
    <AuthContext.Provider
      value={{
        user,
        readableUserId,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ------------------------------------------------
   HOOK
------------------------------------------------ */

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};