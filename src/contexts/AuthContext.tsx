import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | Error | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | Error | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  deleteAccount: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch or initialize user profile from Supabase
  const fetchProfile = async (userId: string, email: string) => {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem(`sprint_profile_${userId}`);
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        const defaultProfile: UserProfile = {
          id: userId,
          email,
          full_name: email.split('@')[0],
          avatar_url: null,
          theme: 'dark',
          email_notifications: true,
          created_at: new Date().toISOString(),
        };
        localStorage.setItem(`sprint_profile_${userId}`, JSON.stringify(defaultProfile));
        setProfile(defaultProfile);
      }
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // Create initial profile if missing
        const newProfile: Partial<UserProfile> = {
          id: userId,
          email,
          full_name: email.split('@')[0],
          avatar_url: null,
          theme: 'dark',
          email_notifications: true,
        };
        const { data: created } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .single();
        if (created) setProfile(created as UserProfile);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
    }
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Offline / Local development fallback: check for existing dev user session
      const savedUser = localStorage.getItem('sprint_mock_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        fetchProfile(parsed.id, parsed.email);
      }
      setLoading(false);
      return;
    }

    // Real Supabase Auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.email ?? '');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email ?? '');
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'user_' + btoa(email).replace(/=/g, '').slice(0, 12),
        email,
        app_metadata: {},
        user_metadata: { full_name: email.split('@')[0] },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('sprint_mock_user', JSON.stringify(mockUser));
      await fetchProfile(mockUser.id, email);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'user_' + btoa(email).replace(/=/g, '').slice(0, 12),
        email,
        app_metadata: {},
        user_metadata: { full_name: fullName },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('sprint_mock_user', JSON.stringify(mockUser));
      const initialProf: UserProfile = {
        id: mockUser.id,
        email,
        full_name: fullName,
        avatar_url: null,
        theme: 'dark',
        email_notifications: true,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(`sprint_profile_${mockUser.id}`, JSON.stringify(initialProf));
      setProfile(initialProf);
      return { error: null };
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      const mockUser = {
        id: 'user_google_' + Math.random().toString(36).substring(2, 9),
        email: 'alex.developer@gmail.com',
        app_metadata: {},
        user_metadata: {
          full_name: 'Alex Developer',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(mockUser);
      localStorage.setItem('sprint_mock_user', JSON.stringify(mockUser));
      const prof: UserProfile = {
        id: mockUser.id,
        email: 'alex.developer@gmail.com',
        full_name: 'Alex Developer',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        theme: 'dark',
        email_notifications: true,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(`sprint_profile_${mockUser.id}`, JSON.stringify(prof));
      setProfile(prof);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/board`,
      },
    });
    return { error };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('sprint_mock_user');
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const resetPasswordForEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      return { error: null };
    }
    const { error } = await supabase.auth.updateUser({ password });
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    if (!isSupabaseConfigured) {
      const updated = { ...profile, ...updates } as UserProfile;
      setProfile(updated);
      localStorage.setItem(`sprint_profile_${user.id}`, JSON.stringify(updated));
      return { error: null };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) setProfile(data as UserProfile);
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  const deleteAccount = async () => {
    if (!user) return { error: new Error('Not authenticated') };

    if (!isSupabaseConfigured) {
      localStorage.removeItem(`sprint_profile_${user.id}`);
      localStorage.removeItem(`sprint_lists_${user.id}`);
      localStorage.removeItem(`sprint_tasks_${user.id}`);
      await signOut();
      return { error: null };
    }

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', user.id);
      if (error) throw error;
      await signOut();
      return { error: null };
    } catch (err: unknown) {
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        isConfigured: isSupabaseConfigured,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        resetPasswordForEmail,
        updatePassword,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
