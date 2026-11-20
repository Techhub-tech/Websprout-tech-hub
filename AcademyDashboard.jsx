import React, { useState, useEffect, useCallback } from 'react';
import { INSTITUTIONS_CATALOG } from '../data/preUniData';
import UniversityBanner from '../components/UniversityBanner';
import PreUniOnboarding from '../components/PreUniOnboarding';
import JambPrepExam from '../components/JambPrepExam';
import InstitutionChoicesForm from '../components/InstitutionChoicesForm';
import AdmittedUniPortal from '../components/AdmittedUniPortal';
import DigitalSkillsSection from '../components/DigitalSkillsSection';

export default function AcademyDashboard({ token, user, onLogout }) {
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('journey');

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadState = useCallback(async () => {
    try {
      const res = await fetch('/api/pre-uni/state', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }
      const data = await res.json();
      setStateData(data);
    } catch {
      notify('Could not sync with server.');
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const handleSaveOnboarding = async (payload) => {
    setSaving(true);
    try {
      const res = await fetch('/api/pre-uni/onboarding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        await loadState();
        notify('SS3 profile & track saved!');
      } else {
        notify(data.error || 'Error saving profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitExamScore = async (score) => {
    setSaving(true);
    try {
      const res = await fetch('/api/pre-uni/exam-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score })
      });
      const data = await res.json();
      if (res.ok) {
        await loadState();
        notify(`Prep exam submitted! Score: ${data.exam_score}/400`);
        return true;
      } else {
        notify(data.error || 'Failed to save exam score.');
        return false;
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitChoices = async (payload) => {
    setSaving(true);
    try {
      const res = await fetch('/api/pre-uni/choices-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        await loadState();
        if (data.admitted) {
          setActiveTab('uni-portal');
          notify(`Admission granted to ${data.admitted_inst_name}!`);
        } else {
          notify('Choices evaluated — check cut-off feedback.');
        }
        return data;
      } else {
        notify(data.error || 'Could not submit choices.');
        return null;
      }
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCourse = async (courseCode) => {
    const res = await fetch('/api/pre-uni/course-toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ courseCode })
    });
    if (res.ok) {
      await loadState();
      notify('Course progress updated.');
    }
  };

  const handleEnrollSkill = async (course_slug, course_title) => {
    const res = await fetch('/api/digital-skills/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ course_slug, course_title })
    });
    if (res.ok) {
      await loadState();
      notify(`Added ${course_title} to your learning list.`);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-slate-600">
        Loading your Pre-University Academy dashboard...
      </div>
    );
  }

  const profile = stateData?.profile;
  const admittedInstitution =
    profile?.admission_status === 'ADMITTED_SIMULATION' && profile?.admitted_inst_id
      ? INSTITUTIONS_CATALOG.find((i) => i.id === profile.admitted_inst_id)
      : null;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pre-University Academy Dashboard
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome back, {user?.full_name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {profile?.ss3_school && (
            <span className="hidden rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 sm:inline-block">
              SS3: <strong>{profile.ss3_school}</strong>
            </span>
          )}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Log Out
          </button>
        </div>
      </div>

      <UniversityBanner
        institution={admittedInstitution}
        admissionStatus={profile?.admission_status}
        admissionRef={profile?.admission_ref}
        targetCourse={profile?.target_course}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500">Academic Track</div>
          <div className="mt-0.5 text-base font-bold text-slate-900">{profile?.track || 'Not Selected'}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500">JAMB Prep Score</div>
          <div className="mt-0.5 text-base font-bold text-slate-900">
            {profile?.exam_completed ? `${profile.exam_score} / 400` : 'Pending'}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500">Admission Status</div>
          <div className="mt-0.5 text-sm font-bold text-emerald-700">
            {profile?.admission_status === 'ADMITTED_SIMULATION' ? 'Admitted (Prep)' : 'In Progress'}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5">
          <div className="text-[11px] font-semibold uppercase text-slate-500">Skill Tracks</div>
          <div className="mt-0.5 text-base font-bold text-slate-900">
            {stateData?.digitalSkills?.length || 0} Active
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'journey', label: '1. SS3, Prep Exam & Choices' },
          { id: 'uni-portal', label: '2. Admitted University & Courses' },
          { id: 'digital-skills', label: '3. Digital Skills (Sub-Market)' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition sm:text-sm ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'journey' && (
        <div className="space-y-6">
          <PreUniOnboarding profile={profile} onSave={handleSaveOnboarding} saving={saving} />
          <JambPrepExam profile={profile} onSubmitScore={handleSubmitExamScore} submitting={saving} />
          <InstitutionChoicesForm profile={profile} onSubmitChoices={handleSubmitChoices} submitting={saving} />
        </div>
      )}

      {activeTab === 'uni-portal' && (
        <AdmittedUniPortal
          profile={profile}
          institution={admittedInstitution}
          onToggleCourse={handleToggleCourse}
        />
      )}

      {activeTab === 'digital-skills' && (
        <DigitalSkillsSection
          enrollments={stateData?.digitalSkills || []}
          onEnroll={handleEnrollSkill}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
