import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BoardProvider } from './contexts/BoardContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { BoardPage } from './pages/BoardPage';
import { Skeleton } from './components/ui/Skeleton';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Synchronize browser history and back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0e11] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white text-xl animate-pulse">
          ⚡
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-24 h-4 rounded-md" />
        </div>
      </div>
    );
  }

  // Routing Logic
  // 1. Password reset flow
  if (currentPath === '/reset-password' || window.location.hash.includes('type=recovery')) {
    return <ResetPasswordPage onNavigateLogin={() => navigate('/login')} />;
  }

  // 2. Unauthenticated flows
  if (!user) {
    if (currentPath === '/login') {
      return (
        <LoginPage
          onNavigateSignup={() => navigate('/signup')}
          onNavigateForgotPassword={() => navigate('/reset-password')}
          onSuccess={() => navigate('/board')}
        />
      );
    }

    if (currentPath === '/signup') {
      return (
        <SignupPage
          onNavigateLogin={() => navigate('/login')}
          onSuccess={() => navigate('/board')}
        />
      );
    }

    // Default for unauthenticated users is the Landing page
    return (
      <LandingPage
        onNavigateLogin={() => navigate('/login')}
        onNavigateSignup={() => navigate('/signup')}
      />
    );
  }

  // 3. Authenticated flows: redirect landing / login / signup to /board
  if (currentPath === '/' || currentPath === '/login' || currentPath === '/signup') {
    window.history.replaceState({}, '', '/board');
  }

  return (
    <BoardProvider>
      <BoardPage />
    </BoardProvider>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
