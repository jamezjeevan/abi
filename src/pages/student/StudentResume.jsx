import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { campusStore } from '../../services/campusStore';
import { 
  FileText, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  X, 
  Check,
  ShieldCheck
} from 'lucide-react';

export const StudentResume = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState([]);
  const [resumeName, setResumeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    const stu = await studentService.getProfile(user?.id || '44444444-4444-4444-4444-444444444444');
    setStudent(stu);
    setSkills(stu?.skills || []);
    setResumeName(stu?.resume_name || 'Alex_Rivera_Software_Resume.pdf');
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) return;
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
  };

  const handleSaveSkills = async () => {
    if (!student) return;
    await studentService.updateProfile(student.id, { skills });
    setSuccess('Technical skills updated! AI matching algorithms will use these keywords.');
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleSimulatedUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(async () => {
      setResumeName(file.name);
      await studentService.uploadResume(student.id, {
        fileName: file.name,
        skills,
        resumeText: `${student.name} - Extracted from ${file.name}. Technical skills: ${skills.join(', ')}.`
      });
      setIsUploading(false);
      setSuccess(`Resume "${file.name}" uploaded and parsed into private storage!`);
      setTimeout(() => setSuccess(''), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Resume & ATS Keyword Engine</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Resume Management & Skill Extraction
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Your uploaded resume and listed skills are used by the AI engine when comparing your profile against recruitment requirements.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center hover:border-brand-400 transition-colors shadow-xs">
        <input
          type="file"
          id="resume-file-input"
          accept=".pdf,.doc,.docx"
          onChange={handleSimulatedUpload}
          className="hidden"
        />
        <label htmlFor="resume-file-input" className="cursor-pointer flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 shadow-xs">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {isUploading ? 'Uploading & Parsing with AI...' : 'Click to Upload or Drag Resume File'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Supported formats: PDF, DOCX (Max 10MB). Stored securely in Supabase Storage with strict RLS permissions.
          </p>
          <span className="mt-3 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs rounded-xl shadow-xs">
            Select PDF File
          </span>
        </label>
      </div>

      {/* Active Resume Status */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-xs text-slate-900">{resumeName}</div>
            <div className="text-[11px] text-slate-400">Verified Active Resume for Placements</div>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active ATS Synced</span>
        </span>
      </div>

      {/* Skill Tags Management */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Extracted Technical Competencies</span>
            </h3>
            <p className="text-xs text-slate-500">Skills parsed from resume or specified for AI job matching.</p>
          </div>

          <button
            onClick={handleSaveSkills}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Save Skill Set
          </button>
        </div>

        {/* Add Skill Input */}
        <form onSubmit={handleAddSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add new skill (e.g. Docker, TypeScript, GraphQL)..."
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Skill Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="text-slate-400 hover:text-rose-600 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
