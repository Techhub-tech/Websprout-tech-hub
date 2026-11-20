import React from 'react';
import { DIGITAL_SKILLS_TRACKS } from '../data/digitalSkillsData';

export default function DigitalSkillsSection({ enrollments, onEnroll }) {
  const enrolledSlugs = new Set((enrollments || []).map((e) => e.course_slug));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
            Secondary Track • Sub-Market
          </span>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            WebSprout Digital Skills Academy (Optional Companion Skills)
          </h3>
          <p className="text-xs text-slate-600">
            While Pre-University preparation is our core academy flow, you can also pick up practical digital skills alongside your studies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {DIGITAL_SKILLS_TRACKS.map((item) => {
          const isEnrolled = enrolledSlugs.has(item.slug);
          return (
            <div key={item.slug} className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <div className="text-[11px] font-semibold text-emerald-700">{item.duration}</div>
                <h4 className="mt-0.5 text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="mt-1 text-xs text-slate-600">{item.summary}</p>
              </div>
              <div className="mt-3">
                {isEnrolled ? (
                  <span className="inline-block rounded-md bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    ✓ Enrolled in Sub-Market Track
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEnroll(item.slug, item.title)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
                  >
                    + Add Skill Track
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
