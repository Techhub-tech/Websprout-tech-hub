import React from 'react';

export default function UniversityBanner({ institution, admissionStatus, admissionRef, targetCourse }) {
  const isAdmitted = admissionStatus === 'ADMITTED_SIMULATION' && institution;

  if (!isAdmitted) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-800 p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-200">
              WebSprout Hub • Pre-University Academy (Simulation Mode)
            </span>
            <h2 className="mt-1.5 text-xl font-bold">
              SS3-to-University Readiness & Admission Simulator
            </h2>
            <p className="mt-1 text-sm text-emerald-100">
              Complete your SS3 track, take the prep exam, and select your 1st–4th choice institutions. When you meet a cut-off mark, your portal adapts to that university’s simulated crest and course view.
            </p>
          </div>
          <div className="rounded-lg bg-black/25 px-4 py-2.5 text-xs text-emerald-100">
            <div className="font-semibold text-amber-300">Academic Integrity Notice</div>
            <div>Preparatory simulation only — not an official university or JAMB portal.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6 text-white shadow-md transition-all duration-300"
      style={{
        background: `linear-gradient(120deg, ${institution.primaryColor} 0%, #0f172a 100%)`,
        borderLeft: `8px solid ${institution.secondaryColor}`
      }}
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-lg font-black tracking-tight shadow-inner"
            style={{
              backgroundColor: institution.secondaryColor,
              color: '#0f172a'
            }}
          >
            {institution.shortName.split(' ')[0]}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-3 py-0.5 text-xs font-semibold tracking-wide text-white">
                {institution.badgeText}
              </span>
              {admissionRef && (
                <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 text-xs font-mono text-amber-200">
                  Ref: {admissionRef}
                </span>
              )}
            </div>
            <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight">
              {institution.name}
            </h2>
            <p className="text-sm text-slate-200">
              {institution.location} • <em>“{institution.motto}”</em>
            </p>
            {targetCourse && (
              <p className="mt-1 text-sm font-medium text-amber-300">
                Simulated Programme Offer: {targetCourse}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/15 bg-black/30 p-3 text-xs text-slate-200 md:max-w-xs">
          <p className="font-semibold text-amber-300">Simulated Admission Granted</p>
          <p className="mt-0.5">
            Portal branding adapted for practice. WebSprout Hub does not issue official university admission or accredited degrees.
          </p>
        </div>
      </div>
    </div>
  );
}
