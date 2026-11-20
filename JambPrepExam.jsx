import React, { useState } from 'react';
import { EXAM_QUESTIONS_BY_TRACK } from '../data/preUniData';

export default function JambPrepExam({ profile, onSubmitScore, submitting }) {
  const track = profile?.track || 'Science';
  const questions = EXAM_QUESTIONS_BY_TRACK[track] || EXAM_QUESTIONS_BY_TRACK.Science;
  const [answers, setAnswers] = useState({});
  const [lastFeedback, setLastFeedback] = useState(null);

  const handleSelect = (qId, optionIdx) => {
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correctCount += 1;
    });

    const baseScore = 150 + correctCount * 32;
    const result = await onSubmitScore(baseScore);
    setLastFeedback({ correctCount, total: questions.length, score: baseScore, ok: result });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Step 2 • JAMB-Style Prep Exam</span>
          <h3 className="text-lg font-bold text-slate-900">
            {track} Diagnostic Practice Test
          </h3>
          <p className="text-xs text-slate-500">
            Answer the {questions.length} diagnostic questions below. Your score scales to a 400-point practice score for cut-off evaluation.
          </p>
        </div>
        {profile?.exam_completed ? (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            Latest Score: {profile.exam_score} / 400
          </span>
        ) : null}
      </div>

      <form onSubmit={handleExamSubmit} className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
            <div className="text-xs font-semibold text-emerald-800">
              Question {idx + 1} • {q.subject}
            </div>
            <p className="mt-1 text-sm font-medium text-slate-900">{q.question}</p>
            <div className="mt-2.5 space-y-1.5">
              {q.options.map((opt, optIdx) => {
                const checked = answers[q.id] === optIdx;
                return (
                  <label
                    key={optIdx}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-3 py-2 text-sm ${
                      checked
                        ? 'border-emerald-600 bg-emerald-50 font-medium text-emerald-950'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      checked={checked}
                      onChange={() => handleSelect(q.id, optIdx)}
                      className="text-emerald-700"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {lastFeedback && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            You answered <strong>{lastFeedback.correctCount}</strong> of <strong>{lastFeedback.total}</strong> practice questions accurately — simulated score: <strong>{lastFeedback.score}/400</strong>.
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || Object.keys(answers).length < questions.length}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? 'Grading Prep Exam...'
            : Object.keys(answers).length < questions.length
              ? `Answer All ${questions.length} Questions to Submit`
              : 'Submit Prep Exam & Get Score'}
        </button>
      </form>
    </div>
  );
}
