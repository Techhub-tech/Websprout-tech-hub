import React, { useState } from 'react';
import { UNI_SEMESTER_COURSES_BY_TRACK } from '../data/preUniData';

export default function AdmittedUniPortal({ profile, institution, onToggleCourse }) {
  const isAdmitted = profile?.admission_status === 'ADMITTED_SIMULATION' && institution;
  const track = profile?.track || 'Science';
  const courses = UNI_SEMESTER_COURSES_BY_TRACK[track] || UNI_SEMESTER_COURSES_BY_TRACK.Science;
  const completedList = profile?.completed_courses || [];

  const [activeCourse, setActiveCourse] = useState(courses[0]);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  if (!isAdmitted) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h3 className="text-lg font-bold text-slate-800">
          Simulated University Course & Credit-Unit Portal (Locked Until Admission Offer)
        </h3>
        <p className="mx-auto mt-1 max-w-xl text-sm text-slate-600">
          Once you complete your prep exam and meet the cut-off mark for one of your chosen institutions, this portal unlocks your simulated 100-level courses, credit units, downloadable study guides, and course readiness checks.
        </p>
      </div>
    );
  }

  const totalUnits = courses.reduce((sum, c) => sum + c.units, 0);
  const earnedUnits = courses
    .filter((c) => completedList.includes(c.code))
    .reduce((sum, c) => sum + c.units, 0);

  const handleSelectCourse = (course) => {
    setActiveCourse(course);
    setSelectedQuizOption(null);
    setQuizResult(null);
  };

  const handleCheckQuiz = () => {
    if (selectedQuizOption === null) return;
    const isCorrect = selectedQuizOption === activeCourse.quizAnswer;
    setQuizResult(isCorrect);
    if (isCorrect && !completedList.includes(activeCourse.code)) {
      onToggleCourse(activeCourse.code);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span
            className="inline-block rounded-full px-3 py-0.5 text-xs font-bold text-white"
            style={{ backgroundColor: institution.primaryColor }}
          >
            {institution.shortName} • Simulated 100L Student Workspace
          </span>
          <h3 className="mt-1 text-xl font-bold text-slate-900">
            Registered Prep Courses & Credit Units
          </h3>
          <p className="text-xs text-slate-500">
            Track: <strong>{track}</strong> • Programme: <strong>{profile.target_course || 'General Studies'}</strong>
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 px-4 py-2 text-right">
          <div className="text-xs text-slate-500">Simulated Credit Units</div>
          <div className="text-base font-extrabold text-slate-900">
            {earnedUnits} / {totalUnits} Units Completed
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-2.5 lg:col-span-5">
          {courses.map((course) => {
            const isSelected = activeCourse.code === course.code;
            const isDone = completedList.includes(course.code);
            return (
              <button
                key={course.code}
                type="button"
                onClick={() => handleSelectCourse(course)}
                className={`w-full rounded-lg border p-3.5 text-left transition ${
                  isSelected
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{course.code} • {course.units} Credit Units</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isSelected
                          ? 'bg-white/15 text-slate-200'
                          : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isDone ? 'Completed' : course.semester}
                  </span>
                </div>
                <div className="mt-1 text-sm font-semibold">{course.title}</div>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {activeCourse.code} • {activeCourse.units} Credit Units • {activeCourse.semester}
              </span>
              <h4 className="text-lg font-bold text-slate-900">{activeCourse.title}</h4>
            </div>

            <a
              href={activeCourse.pdfFile}
              download={`${activeCourse.code}-Study-Guide.txt`}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-slate-100"
            >
              ⬇ Download Study Guide / PDF
            </a>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-700">{activeCourse.summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onToggleCourse(activeCourse.code)}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-100"
            >
              {completedList.includes(activeCourse.code) ? '✓ Marked Complete (Click to Undo)' : 'Mark Course Complete'}
            </button>
          </div>

          <div className="mt-5 rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Course Readiness Exam Question
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-900">{activeCourse.quizQuestion}</p>

            <div className="mt-2.5 space-y-1.5">
              {activeCourse.quizOptions.map((opt, idx) => (
                <label
                  key={idx}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name={`quiz-${activeCourse.code}`}
                    checked={selectedQuizOption === idx}
                    onChange={() => setSelectedQuizOption(idx)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCheckQuiz}
              className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              Submit Course Quiz
            </button>

            {quizResult !== null && (
              <div
                className={`mt-2.5 rounded-md p-2.5 text-xs font-medium ${
                  quizResult ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                }`}
              >
                {quizResult
                  ? 'Correct! You demonstrated core mastery for this topic and earned completion credit.'
                  : 'Not quite — review the study guide above and try again.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
