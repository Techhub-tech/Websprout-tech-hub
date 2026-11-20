import React, { useState } from 'react';
import AuthPage from './pages/AuthPage';
import AcademyDashboard from './pages/AcademyDashboard';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('wsh_token') || '');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wsh_user') || 'null');
    } catch {
      return null;
    }
  });

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('wsh_token', newToken);
    localStorage.setItem('wsh_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('wsh_token');
    localStorage.removeItem('wsh_user');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-sm font-black text-white">
              WS
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                WebSprout<span className="text-emerald-700">Hub</span>
              </span>
              <span className="ml-2 hidden rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 sm:inline">
                Pre-University Academy
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Simulation & Skill Prep • Not an Official University
          </div>
        </div>
      </header>

      <main>
        {token && user ? (
          <AcademyDashboard token={token} user={user} onLogout={handleLogout} />
        ) : (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}
      </main>
    </div>
  );
}
