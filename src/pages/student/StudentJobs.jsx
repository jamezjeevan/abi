import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { eligibilityService } from '../../services/eligibilityService';
import { campusStore } from '../../services/campusStore';
import { Modal } from '../../components/common/Modal';
import { 
  Search, 
  MapPin, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  ShieldAlert 
} from 'lucide-react';

export const StudentJobs = () => {
  const { profile, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    const stu = await studentService.getProfile(user?.id || '44444444-4444-4444-4444-444444444444');
    setStudent(stu);

    const jobList = await studentService.getAvailableJobs();
    setJobs(jobList || []);

    if (stu?.id) {
      const myApps = await studentService.getMyApplications(stu.id);
      setAppliedJobIds(new Set(myApps.map(a => a.job_id)));
    }
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  /**
   * Deterministic Hard Eligibility Check (STEP 6)
   * Runs locally BEFORE any application submission or Gemini AI interaction.
   */
  const handleOpenApply = (job) => {
    setSelectedJob(job);
    setError('');

    const currentStudent = student || {
      id: profile?.id || user?.id,
      cgpa: profile?.meta?.cgpa || 8.92,
      department: profile?.meta?.department || 'Computer Science & Engineering',
      year: profile?.meta?.year || 4
    };

    // Run deterministic hard check (CGPA, Department, Year)
    const result = eligibilityService.checkHardEligibility({
      student: currentStudent,
      job
    });

    setEligibilityResult(result);
    setIsApplyModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedJob || !student) return;

    // Safety guard: reject if hard eligibility failed
    if (!eligibilityResult?.isEligible) {
      setError('Cannot proceed: Hard eligibility criteria not satisfied.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await studentService.applyToJob({
        studentId: student.id,
        jobId: selectedJob.id
      });
      setIsApplyModalOpen(false);
      setSuccess(`Application for "${selectedJob.job_title}" recorded! Hard eligibility check passed. Ready for Stage 7: Gemini Resume ↔ Job Matching.`);
      setTimeout(() => setSuccess(''), 6000);
      loadData();
    } catch (err) {
      setError(err.message || 'Error submitting application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      job.job_title?.toLowerCase().includes(term) ||
      job.company_name?.toLowerCase().includes(term) ||
      job.description?.toLowerCase().includes(term) ||
      (job.required_skills || []).some(s => s.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Deterministic Recruitment Screening</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Placement Drives
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Active corporate hiring drives. Hard eligibility (CGPA, Department, Academic Year) is verified deterministically before application submission.
          </p>
        </div>

        {/* Student Academic Standing Pill */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center gap-3 self-start sm:self-auto">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Your CGPA</span>
            <span className="font-extrabold text-slate-900 text-sm">{student?.cgpa || '8.92'}</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
            <span className="font-semibold text-slate-700">{student?.department || 'CSE'}</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Academic Year</span>
            <span className="font-semibold text-slate-700">Year {student?.year || 4}</span>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title, company name, or technology (e.g. React, Python, PostgreSQL)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>
      </div>

      {/* Job Cards Feed */}
      <div className="space-y-4">
        {filteredJobs.map((job) => {
          const hasApplied = appliedJobIds.has(job.id);
          const stuData = student || {
            cgpa: profile?.meta?.cgpa || 8.92,
            department: profile?.meta?.department || 'Computer Science & Engineering',
            year: profile?.meta?.year || 4
          };
          const cardEligibility = eligibilityService.checkHardEligibility({
            student: stuData,
            job
          });

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:border-brand-300 hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-50 to-indigo-50 border border-brand-200 text-brand-700 flex items-center justify-center font-extrabold text-base shadow-xs flex-shrink-0">
                    {job.company_name?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">{job.job_title}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cardEligibility.isEligible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {cardEligibility.isEligible
                          ? `Eligible (CGPA ≥ ${job.minimum_cgpa})`
                          : `Not Eligible (${cardEligibility.failures[0]?.replace(/_/g, ' ') || 'Requirement Mismatch'})`
                        }
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-slate-900 font-bold">{job.company_name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <DollarSign className="w-3 h-3" />
                        {job.salary}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-auto">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                  </div>

                  {hasApplied ? (
                    <span className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-600" />
                      <span>Application Submitted</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleOpenApply(job)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Check Eligibility & Apply</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {job.description}
              </p>

              {/* Criteria Summary Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-600">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Criteria:</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  Min CGPA: {job.minimum_cgpa}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  Depts: {Array.isArray(job.allowed_departments) ? job.allowed_departments.join(', ') : (job.allowed_departments || 'All Engineering')}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                  Graduation Year: {job.graduation_year || 'Any'}
                </span>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Required Skills:</span>
                {(job.required_skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deterministic Hard Eligibility Modal (STEP 6) */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Hard Eligibility Verification"
        subtitle={`Deterministic qualification check for ${selectedJob?.job_title} at ${selectedJob?.company_name}`}
      >
        <div className="space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Hard Eligibility Banner */}
          {eligibilityResult && (
            <div className={`p-4 rounded-2xl border text-white space-y-2 ${
              eligibilityResult.isEligible
                ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-emerald-800'
                : 'bg-gradient-to-r from-rose-950 via-slate-900 to-slate-950 border-rose-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {eligibilityResult.isEligible ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Step 6: Hard Eligibility Result
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                  eligibilityResult.isEligible
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {eligibilityResult.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {eligibilityResult.isEligible
                  ? 'Your profile satisfies all deterministic academic requirements (CGPA, Department, and Academic Year). You are qualified to proceed.'
                  : 'Your profile does not satisfy one or more deterministic job requirements. Submission is strictly blocked before invoking Gemini AI.'}
              </p>
            </div>
          )}

          {/* Detailed 3-Criteria Breakdown */}
          {eligibilityResult?.checks && (
            <div className="space-y-3">
              <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                <span>Deterministic Academic Checklist</span>
                <span className="text-[10px] text-slate-400 font-mono">NON-AI CRITERIA</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {/* 1. CGPA CHECK */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  eligibilityResult.checks.cgpa.passed
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/50 border-rose-200 text-rose-950'
                }`}>
                  {eligibilityResult.checks.cgpa.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>1. Minimum CGPA Requirement</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        eligibilityResult.checks.cgpa.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {eligibilityResult.checks.cgpa.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Your CGPA: <span className="font-bold text-slate-900">{eligibilityResult.checks.cgpa.studentValue || '0.00'}</span>
                      {' • '}
                      Minimum Required: <span className="font-bold text-slate-900">{eligibilityResult.checks.cgpa.requiredValue || 'None'}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      {eligibilityResult.checks.cgpa.message}
                    </div>
                  </div>
                </div>

                {/* 2. DEPARTMENT CHECK */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  eligibilityResult.checks.department.passed
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/50 border-rose-200 text-rose-950'
                }`}>
                  {eligibilityResult.checks.department.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>2. Eligible Department Requirement</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        eligibilityResult.checks.department.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {eligibilityResult.checks.department.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Your Department: <span className="font-bold text-slate-900">{eligibilityResult.checks.department.studentValue || 'Unspecified'}</span>
                      {' • '}
                      Authorized: <span className="font-bold text-slate-900">{Array.isArray(eligibilityResult.checks.department.requiredValue) ? eligibilityResult.checks.department.requiredValue.join(', ') : (eligibilityResult.checks.department.requiredValue || 'All Departments')}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      {eligibilityResult.checks.department.message}
                    </div>
                  </div>
                </div>

                {/* 3. ACADEMIC YEAR CHECK */}
                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                  eligibilityResult.checks.year.passed
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/50 border-rose-200 text-rose-950'
                }`}>
                  {eligibilityResult.checks.year.passed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>3. Academic Year / Cohort Requirement</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        eligibilityResult.checks.year.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {eligibilityResult.checks.year.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Your Year: <span className="font-bold text-slate-900">{eligibilityResult.checks.year.studentValue !== null ? `Year ${eligibilityResult.checks.year.studentValue}` : 'Unspecified'}</span>
                      {' • '}
                      Eligible Cohorts: <span className="font-bold text-slate-900">{Array.isArray(eligibilityResult.checks.year.requiredValue) ? eligibilityResult.checks.year.requiredValue.join(', ') : (eligibilityResult.checks.year.requiredValue || 'All Years')}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      {eligibilityResult.checks.year.message}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specific Failure Reasons Alert (If Ineligible) */}
          {eligibilityResult && !eligibilityResult.isEligible && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Eligibility Blockers Detected:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px] text-rose-700">
                {eligibilityResult.reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
              <div className="text-[10px] text-rose-600 pt-1 border-t border-rose-200/60 mt-1.5">
                Per placement compliance rules, candidate resumes are NOT sent to Gemini AI if hard eligibility requirements are unmet.
              </div>
            </div>
          )}

          {/* Next Step Preview (If Eligible) */}
          {eligibilityResult && eligibilityResult.isEligible && (
            <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-indigo-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-xs text-indigo-800">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>Ready for Next Stage:</span>
              </div>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                Clicking <strong>Confirm & Proceed</strong> will mark your application as <strong>Verified Eligible</strong>. It will be scheduled for Stage 7: Gemini Resume ↔ Job Matching.
              </p>
            </div>
          )}

          {/* Active Student Identity Verification Pill */}
          <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50 text-[11px]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span className="text-slate-600">Authenticated Student:</span>
              <span className="font-bold text-slate-800">{student?.name || 'Current Student'} ({student?.register_number || 'REG-ID'})</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Identity Verified</span>
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Close
            </button>

            {eligibilityResult?.isEligible ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmSubmit}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-brand-600/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Recording Application...</span>
                ) : (
                  <>
                    <span>Confirm & Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled={true}
                className="px-5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs cursor-not-allowed flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Ineligible to Apply</span>
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
