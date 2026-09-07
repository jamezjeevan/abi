import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { aiMatchingService } from '../../services/aiMatchingService';
import { campusStore } from '../../services/campusStore';
import { Modal } from '../../components/common/Modal';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText,
  Building2,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

export const StudentJobs = () => {
  const { profile, user } = useAuth();
  const [student, setStudent] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
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

  const handleOpenApply = async (job) => {
    setSelectedJob(job);
    setError('');
    // Run instant AI Matching Evaluation preview
    const evalData = await aiMatchingService.evaluateApplication({
      student: student || {
        cgpa: profile?.meta?.cgpa || 8.92,
        department: profile?.meta?.department || 'Computer Science & Engineering',
        year: profile?.meta?.year || 4,
        skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Git']
      },
      job,
      resumeText: student?.resume_text
    });
    setEvaluationResult(evalData);
    setIsApplyModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!selectedJob || !student) return;
    setIsSubmitting(true);
    setError('');

    try {
      await studentService.applyToJob({
        studentId: student.id,
        jobId: selectedJob.id
      });
      setIsApplyModalOpen(false);
      setSuccess(`Application for "${selectedJob.job_title}" submitted! AI Match: ${evaluationResult.matchScore}% (${evaluationResult.eligibilityStatus}).`);
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
            <Briefcase className="w-4 h-4" />
            <span>AI-Assisted Recruitment Board</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Campus Placement Drives
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Verified corporate hiring drives. The AI engine analyzes your resume against job requirements in real time.
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
          const minCgpa = parseFloat(job.minimum_cgpa) || 0;
          const stuCgpa = parseFloat(student?.cgpa) || 0;
          const isEligible = stuCgpa >= minCgpa;

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
                        isEligible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isEligible ? `Eligible (CGPA ≥ ${job.minimum_cgpa})` : `CGPA Below ${job.minimum_cgpa}`}
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
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Apply with AI Screening</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {job.description}
              </p>

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

      {/* AI Resume Screening & Submission Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="AI Resume Screening & Application"
        subtitle={`Applying for ${selectedJob?.job_title} at ${selectedJob?.company_name}`}
      >
        <div className="space-y-5 text-xs">
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">{error}</div>}

          {/* AI Score Badge Banner */}
          {evaluationResult && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Evaluation Score</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-400">
                  {evaluationResult.matchScore}% Match
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    evaluationResult.matchScore >= 75
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : evaluationResult.matchScore >= 50
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                        : 'bg-rose-500'
                  }`}
                  style={{ width: `${evaluationResult.matchScore}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-300">Eligibility Result:</span>
                <span className={`font-bold px-2 py-0.5 rounded-md ${
                  evaluationResult.eligibilityStatus.includes('Qualified') && !evaluationResult.eligibilityStatus.includes('Not')
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}>
                  {evaluationResult.eligibilityStatus}
                </span>
              </div>
            </div>
          )}

          {/* Hard Checks Breakdown */}
          {evaluationResult?.hardCheck && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-700 text-xs flex items-center justify-between">
                <span>Programmatic Eligibility Rules</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Deterministic Check</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5">
                  {evaluationResult.hardCheck.cgpaPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>CGPA ({student?.cgpa}) ≥ {selectedJob?.minimum_cgpa}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {evaluationResult.hardCheck.deptPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Department Match</span>
                </div>
              </div>
            </div>
          )}

          {/* Skills Comparison */}
          {evaluationResult && (
            <div className="space-y-3">
              <div>
                <div className="font-bold text-slate-700 mb-1.5">Matching Competencies:</div>
                <div className="flex flex-wrap gap-1.5">
                  {evaluationResult.matchingSkills.length > 0 ? (
                    evaluationResult.matchingSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{s}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 text-xs">No direct matching keywords detected.</span>
                  )}
                </div>
              </div>

              {evaluationResult.missingSkills.length > 0 && (
                <div>
                  <div className="font-bold text-slate-700 mb-1.5">Missing Recommended Skills:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluationResult.missingSkills.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Explanation Text */}
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 text-indigo-900 leading-relaxed">
                <span className="font-bold block mb-0.5">AI Analysis Summary:</span>
                {evaluationResult.explanation}
              </div>
            </div>
          )}

          {/* Active Resume Indicator */}
          <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-brand-600" />
              <div>
                <div className="font-bold text-slate-900">{student?.resume_name || 'Verified_Resume.pdf'}</div>
                <div className="text-[10px] text-slate-400">Attached from your Student Profile</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              Ready
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsApplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleConfirmSubmit}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold shadow-md shadow-brand-600/25 transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Application...</span>
              ) : (
                <>
                  <span>Submit Application to {selectedJob?.company_name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
