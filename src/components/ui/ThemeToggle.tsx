import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark and light theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={`theme-toggle-btn ${className}`}
    >
      {theme === 'dark' ? '☾' : '☀'}
    </button>
  );
};
