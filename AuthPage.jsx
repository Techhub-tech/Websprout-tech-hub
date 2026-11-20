import React, { useState } from 'react';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload =
        mode === 'login'
          ? { email, password }
          : { full_name: fullName, email, phone, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Authentication failed.');
      } else {
        onAuthSuccess(data.token, data.user);
      }
    } catch {
      setError('Cannot reach backend server. Make sure Node/Express is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-800">
            WebSprout Hub • Rooted for Africa. Built for the Future.
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Experience University Life Before Day One.
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            WebSprout Hub’s core <strong>Pre-University Academy</strong> guides SS3 students from Science or Arts track selection and JAMB-style prep exams through 1st–4th choice institution cut-off checks, simulated admission offers, credit-unit coursework, study downloads, and exams—plus an optional <strong>Digital Skills</strong> sub-market.
          </p>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold text-emerald-700">CORE FLOW</div>
              <div className="mt-1 font-bold text-slate-900">SS3 → Prep Exam → Admission Portal</div>
              <p className="mt-1 text-xs text-slate-600">
                Choose Science or Arts, take the prep exam, select 1st–4th choice institutions, and see your portal adapt when you clear cut-offs.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold text-slate-700">SUB-MARKET TRACK</div>
              <div className="mt-1 font-bold text-slate-900">Digital Skills Academy</div>
              <p className="mt-1 text-xs text-slate-600">
                Add practical web, UI/UX, AI prompt, or content creation tracks alongside your university preparation.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-950">
            <strong>Disclaimer:</strong> WebSprout Hub is an educational preparation and simulation platform—not an accredited university, polytechnic, or official admission board.
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${
                  mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className={`w-1/2 rounded-md py-2 text-sm font-semibold transition ${
                  mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                Sign Up Free
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-600">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Amina Yusuf"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase text-slate-600">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-600">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold uppercase text-slate-600">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-700 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-60"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Enter Pre-University Portal' : 'Create Pre-University Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
