import React, { useState, useEffect } from 'react';
import { TARGET_COURSES_BY_TRACK } from '../data/preUniData';

export default function PreUniOnboarding({ profile, onSave, saving }) {
  const [track, setTrack] = useState(profile?.track || 'Science');
  const [ss3School, setSs3School] = useState(profile?.ss3_school || '');
  const [graduationYear, setGraduationYear] = useState(profile?.graduation_year || '2026');
  const [stateOfOrigin, setStateOfOrigin] = useState(profile?.state_of_origin || '');

  useEffect(() => {
    if (profile) {
      if (profile.track) setTrack(profile.track);
      if (profile.ss3_school) setSs3School(profile.ss3_school);
      if (profile.graduation_year) setGraduationYear(profile.graduation_year);
      if (profile.state_of_origin) setStateOfOrigin(profile.state_of_origin);
    }
  }, [profile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      track,
      ss3_school: ss3School,
      graduation_year: graduationYear,
      state_of_origin: stateOfOrigin
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Step 1 • SS3 Candidate Setup</span>
          <h3 className="text-lg font-bold text-slate-900">Select Academic Track & SS3 School Details</h3>
        </div>
        {profile?.track && (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
            Track: {profile.track}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Are you a Science or Arts student?
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {['Science', 'Arts'].map((option) => {
              const selected = track === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTrack(option)}
                  className={`rounded-lg border p-3.5 text-left transition ${
                    selected
                      ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-slate-900">{option} Track</div>
                  <div className="mt-0.5 text-xs text-slate-600">
                    {option === 'Science'
                      ? 'Prep exam & courses in English, Maths, Physics, Chemistry, Biology & 100L STEM.'
                      : 'Prep exam & courses in English, Literature, Government, Economics & 100L Humanities.'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              SS3 Secondary School Graduated From *
            </label>
            <input
              type="text"
              required
              value={ss3School}
              onChange={(e) => setSs3School(e.target.value)}
              placeholder="e.g., Government Secondary School, Wuse II"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">SS3 Year</label>
            <input
              type="text"
              value={graduationYear}
              onChange={(e) => setGraduationYear(e.target.value)}
              placeholder="2026"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">State of Origin / Residence</label>
          <input
            type="text"
            value={stateOfOrigin}
            onChange={(e) => setStateOfOrigin(e.target.value)}
            placeholder="e.g., FCT Abuja / Lagos / Kano"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
          <span className="font-semibold text-slate-800">Sample {track} Programmes Available: </span>
          {TARGET_COURSES_BY_TRACK[track].join(' • ')}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save SS3 Profile & Continue to Prep Exam'}
        </button>
      </form>
    </div>
  );
}
