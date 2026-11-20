import React, { useState, useEffect } from 'react';
import { INSTITUTIONS_CATALOG, TARGET_COURSES_BY_TRACK } from '../data/preUniData';

export default function InstitutionChoicesForm({ profile, onSubmitChoices, submitting }) {
  const track = profile?.track || 'Science';
  const courseOptions = TARGET_COURSES_BY_TRACK[track] || TARGET_COURSES_BY_TRACK.Science;

  const [choice1, setChoice1] = useState(profile?.choice_1_inst || INSTITUTIONS_CATALOG[0].id);
  const [choice2, setChoice2] = useState(profile?.choice_2_inst || INSTITUTIONS_CATALOG[1].id);
  const [choice3, setChoice3] = useState(profile?.choice_3_inst || INSTITUTIONS_CATALOG[2].id);
  const [choice4, setChoice4] = useState(profile?.choice_4_inst || INSTITUTIONS_CATALOG[5].id);
  const [targetCourse, setTargetCourse] = useState(profile?.target_course || courseOptions[0]);
  const [outcomeBanner, setOutcomeBanner] = useState(null);

  useEffect(() => {
    if (profile) {
      if (profile.choice_1_inst) setChoice1(profile.choice_1_inst);
      if (profile.choice_2_inst) setChoice2(profile.choice_2_inst);
      if (profile.choice_3_inst) setChoice3(profile.choice_3_inst);
      if (profile.choice_4_inst) setChoice4(profile.choice_4_inst);
      if (profile.target_course) setTargetCourse(profile.target_course);
    }
  }, [profile]);

  useEffect(() => {
    if (!courseOptions.includes(targetCourse)) {
      setTargetCourse(courseOptions[0]);
    }
  }, [track]);

  const getInst = (id) => INSTITUTIONS_CATALOG.find((i) => i.id === id);
  const selectedIds = [choice1, choice2, choice3, choice4].filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await onSubmitChoices({
      choice_1_inst: choice1,
      choice_2_inst: choice2,
      choice_3_inst: choice3,
      choice_4_inst: choice4,
      target_course: targetCourse,
      institutionsCatalog: INSTITUTIONS_CATALOG
    });
    if (res) setOutcomeBanner(res);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Step 3 • Choice of Institution & Cut-Off Check</span>
        <h3 className="text-lg font-bold text-slate-900">
          Select 1st, 2nd, 3rd & 4th Choice Institutions
        </h3>
        <p className="text-xs text-slate-500">
          Each institution displays its illustrative preparatory cut-off mark below. Your exam score ({profile?.exam_score ?? 'Not taken yet'}) is checked in priority order (1st to 4th choice).
        </p>
      </div>

      <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {INSTITUTIONS_CATALOG.map((inst) => {
          const isPicked = selectedIds.includes(inst.id);
          const qualifies = profile?.exam_score != null && profile.exam_score >= inst.cutoffMark;
          return (
            <div
              key={inst.id}
              className={`rounded-lg border p-3 text-xs ${
                isPicked ? 'border-emerald-600 bg-emerald-50/60' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{inst.shortName}</span>
                <span className="rounded bg-slate-900 px-2 py-0.5 text-[11px] text-white">
                  Pass/Cut-off: {inst.cutoffMark}
                </span>
              </div>
              <div className="mt-1 text-slate-600">{inst.name}</div>
              {profile?.exam_score != null && (
                <div className={`mt-1.5 font-semibold ${qualifies ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {qualifies ? '✓ Your score meets this cut-off' : '• Needs higher score than yours'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { label: '1st Choice Institution *', val: choice1, set: setChoice1 },
            { label: '2nd Choice Institution', val: choice2, set: setChoice2 },
            { label: '3rd Choice Institution', val: choice3, set: setChoice3 },
            { label: '4th Choice Institution', val: choice4, set: setChoice4 }
          ].map((slot) => {
            const chosenObj = getInst(slot.val);
            return (
              <div key={slot.label}>
                <label className="mb-1 flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>{slot.label}</span>
                  {chosenObj && (
                    <span className="text-xs font-bold text-emerald-700">
                      Cut-off: {chosenObj.cutoffMark}
                    </span>
                  )}
                </label>
                <select
                  value={slot.val}
                  onChange={(e) => slot.set(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                >
                  {INSTITUTIONS_CATALOG.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} (Cut-off: {inst.cutoffMark})
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Preferred University Course ({track} Track) *
          </label>
          <select
            value={targetCourse}
            onChange={(e) => setTargetCourse(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
          >
            {courseOptions.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        {outcomeBanner && (
          <div
            className={`rounded-lg border p-4 text-sm ${
              outcomeBanner.admitted
                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                : 'border-amber-300 bg-amber-50 text-amber-950'
            }`}
          >
            {outcomeBanner.admitted ? (
              <div>
                <p className="font-bold">
                  Simulated Admission Offered: {outcomeBanner.admitted_inst_name}!
                </p>
                <p className="mt-1">
                  Your exam score (<strong>{outcomeBanner.exam_score}</strong>) met or exceeded the cut-off mark (<strong>{outcomeBanner.required_cutoff}</strong>). Reference: <code className="font-mono">{outcomeBanner.admission_ref}</code>. Your portal crest and university course view have updated below.
                </p>
              </div>
            ) : (
              <div>
                <p className="font-bold">Not Yet Qualified for Selected Cut-Offs</p>
                <p className="mt-1">
                  Your current prep score is <strong>{outcomeBanner.exam_score}/400</strong>. Retake the prep exam for a higher score or select an institution whose cut-off mark matches your current score.
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !profile?.exam_completed}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {!profile?.exam_completed
            ? 'Complete Step 2 Prep Exam First'
            : submitting
              ? 'Checking Cut-Offs...'
              : 'Submit Choices & Check Admission Offer'}
        </button>
      </form>
    </div>
  );
}
