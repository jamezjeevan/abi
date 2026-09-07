import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { campusStore } from '../../services/campusStore';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Mail, 
  Phone, 
  FileText, 
  Award, 
  CheckCircle2, 
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentProfile = () => {
  const { user, profile } = useAuth();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    course: '',
    semester: '8'
  });
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    const stu = await studentService.getProfile(user?.id || '44444444-4444-4444-4444-444444444444');
    setStudent(stu);
    setFormData({
      phone: stu?.phone || '',
      course: stu?.course || 'B.Tech Computer Science',
      semester: String(stu?.semester || 8)
    });
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!student) return;
    await studentService.updateProfile(student.id, {
      phone: formData.phone,
      course: formData.course,
      semester: parseInt(formData.semester, 10)
    });
    setIsEditing(false);
    setSuccess('Student profile updated successfully!');
    setTimeout(() => setSuccess(''), 4000);
    loadData();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header Profile Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-50 to-indigo-50 border border-brand-200 text-brand-700 font-extrabold flex items-center justify-center text-2xl shadow-xs">
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{student?.name || 'Alex Rivera'}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
                {student?.profile_status || 'Verified'}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              Register No: <span className="font-bold text-slate-700">{student?.register_number || 'REG2024CS088'}</span> • Student ID: {student?.id?.slice(0, 8)}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition self-start sm:self-auto"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Contact Details'}</span>
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Academic Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <span>Academic Standing</span>
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Department</span>
              <span className="font-semibold text-slate-800">{student?.department || 'Computer Science & Engineering'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Course Degree</span>
              <span className="font-semibold text-slate-800">{student?.course || 'B.Tech Computer Science'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Graduation Year</span>
                <span className="font-semibold text-slate-800">Year {student?.year || 4}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">Current Semester</span>
                <span className="font-semibold text-slate-800">Semester {student?.semester || 8}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Cumulative CGPA</span>
              <span className="font-extrabold text-emerald-600 text-base">{student?.cgpa || '8.92'} / 10.00</span>
            </div>
          </div>
        </div>

        {/* Mentorship & Contact Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Mentor & Communications</span>
          </h2>

          <div className="space-y-3">
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200">
              <span className="text-[10px] font-bold text-indigo-600 uppercase block">My Mentor</span>
              <span className="font-bold text-indigo-950 text-sm">{student?.mentor_name || 'Prof. Sarah Jenkins'}</span>
              <Link to="/student/mentor" className="text-[11px] text-indigo-600 font-semibold hover:underline block mt-0.5">
                View Mentor Profile & Chat →
              </Link>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Institutional Email</span>
              <span className="font-semibold text-slate-800">{student?.email || 'student@campusconnect.edu'}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Phone Contact</span>
              <span className="font-semibold text-slate-800">{student?.phone || '+1 (555) 456-7890'}</span>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Active Resume File</span>
              <Link to="/student/resume" className="text-brand-600 hover:underline font-semibold flex items-center gap-1 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{student?.resume_name || 'Resume.pdf'}</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Form Modal/Drawer */}
      {isEditing && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Update Personal Information</h3>
          <form onSubmit={handleSave} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Degree Course</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Semester</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-brand-500 text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold shadow-xs hover:bg-brand-700"
              >
                Save Details
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
