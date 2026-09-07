import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { 
  Briefcase, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Users,
  Building2,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CompanyJobs = () => {
  const { profile, user } = useAuth();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    job_title: '',
    description: '',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$100,000 - $120,000 / yr',
    employment_type: 'full_time',
    required_skills: 'React, Node.js, PostgreSQL, TypeScript, Git',
    eligibility: 'Minimum 7.50 CGPA, B.E / B.Tech Computer Science or IT',
    minimum_cgpa: '7.50',
    allowed_departments: 'Computer Science & Engineering, Information Technology',
    graduation_year: '2024',
    experience: '0-1 years / Fresh Graduate',
    deadline: ''
  });

  const loadData = async () => {
    const comp = await companyService.getCompanyProfile(user?.id || '55555555-5555-5555-5555-555555555555');
    setCompany(comp);
    if (comp?.id) {
      const jList = await companyService.getMyJobs(comp.id);
      setJobs(jList || []);
    }
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const handleOpenAdd = () => {
    const defaultDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    setFormData({
      job_title: '',
      description: 'Join our high-performing team developing enterprise scalable software platforms.',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$100,000 - $120,000 / yr',
      employment_type: 'full_time',
      required_skills: 'React, Node.js, PostgreSQL, TypeScript, Git',
      eligibility: 'Minimum 7.50 CGPA, Computer Science or IT',
      minimum_cgpa: '7.50',
      allowed_departments: 'Computer Science & Engineering, Information Technology',
      graduation_year: '2024',
      experience: 'Fresh Graduate / Entry Level',
      deadline: defaultDate
    });
    setError('');
    setIsAddModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await companyService.createJob({
        company_id: company?.id || 'comp-001-uuid',
        company_name: company?.company_name || 'Nexus Technologies',
        ...formData
      });

      setIsAddModalOpen(false);
      setSuccess(`Job "${formData.job_title}" published! It is now live in the Student Portal.`);
      setTimeout(() => setSuccess(''), 5000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to post job.');
    }
  };

  const columns = [
    {
      header: 'Job Title & Location',
      accessor: 'job_title',
      render: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.job_title}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{row.location}</span>
            <span>•</span>
            <span className="font-semibold text-slate-700">{row.salary}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Eligibility Criteria',
      accessor: 'minimum_cgpa',
      render: (row) => (
        <div className="space-y-0.5 text-xs">
          <span className="font-bold text-slate-800">Min CGPA: {row.minimum_cgpa}</span>
          <div className="text-[11px] text-slate-500 truncate max-w-xs">
            {Array.isArray(row.allowed_departments) ? row.allowed_departments.join(', ') : row.allowed_departments}
          </div>
        </div>
      )
    },
    {
      header: 'Required Skills',
      accessor: 'required_skills',
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(row.required_skills || []).slice(0, 3).map((s, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
              {s}
            </span>
          ))}
          {(row.required_skills || []).length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
              +{row.required_skills.length - 3}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Deadline',
      accessor: 'deadline',
      render: (row) => (
        <div className="text-xs text-slate-600 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{new Date(row.deadline).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
          {row.status}
        </span>
      )
    },
    {
      header: 'Applicants',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <Link
          to="/company/applicants"
          className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-brand-600 font-semibold text-xs inline-flex items-center gap-1 transition"
        >
          <Users className="w-3.5 h-3.5" />
          <span>View Candidates</span>
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Recruitment Campaigns</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Company Recruitment Postings
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Publish recruitment posts containing skills, eligibility, and CGPA thresholds. Posts synchronize to the Student Portal.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-amber-600/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Recruitment</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={jobs}
        searchPlaceholder="Search your posted jobs by title, skills, or location..."
      />

      {/* Post Job Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Recruitment Post"
        subtitle="Once published, this job immediately syncs to the Student Portal for candidate applications."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">{error}</div>}

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Job Title</label>
            <input
              type="text"
              required
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              placeholder="e.g. Associate Software Engineer / AI Systems Intern"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Job Description</label>
            <textarea
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed responsibilities, expectations, and tech stack overview..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="San Francisco / Remote"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Salary / Package</label>
              <input
                type="text"
                required
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="$90,000 - $110,000 / yr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Job Type</label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              >
                <option value="full_time">Full-Time</option>
                <option value="internship">Internship</option>
                <option value="part_time">Part-Time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Required Skills (Comma-separated)</label>
            <input
              type="text"
              required
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              placeholder="React, TypeScript, Node.js, PostgreSQL, Docker"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
            />
            <p className="text-[10px] text-slate-400 mt-0.5">The AI Screening engine computes matching percentages against these skills.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Minimum CGPA</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={formData.minimum_cgpa}
                onChange={(e) => setFormData({ ...formData, minimum_cgpa: e.target.value })}
                placeholder="7.50"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Eligible Graduation Year</label>
              <input
                type="number"
                value={formData.graduation_year}
                onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                placeholder="2024"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Application Deadline</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Eligible Departments</label>
              <input
                type="text"
                value={formData.allowed_departments}
                onChange={(e) => setFormData({ ...formData, allowed_departments: e.target.value })}
                placeholder="Computer Science, IT, Electronics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Experience Level</label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Fresh Graduate / Entry Level"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs"
            >
              Publish Recruitment Drive
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
