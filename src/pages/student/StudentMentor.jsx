import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { GraduationCap, Mail, Phone, BookOpen, MessageSquare, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentMentor = () => {
  const { user, profile } = useAuth();
  const [student, setStudent] = useState(null);
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const stu = await studentService.getProfile(user?.id || '44444444-4444-4444-4444-444444444444');
      setStudent(stu);
      const m = await studentService.getMentor(stu?.mentor_id);
      setMentor(m);
    };
    loadData();
  }, [user]);

  const mentorName = student?.mentor_name || mentor?.name || 'Prof. Sarah Jenkins';

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Assigned Academic & Placement Mentor</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            My Mentor: {mentorName}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Faculty mentor responsible for academic advising, placement eligibility, and interview coaching.
          </p>
        </div>

        <Link
          to="/student/messages"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/30 self-start md:self-auto"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Chat with Mentor</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mentor Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>Faculty Profile</span>
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Mentor Name</span>
              <span className="font-bold text-slate-900 text-sm">{mentorName}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Department</span>
              <span className="font-semibold text-slate-800">{mentor?.department || 'Computer Science & Engineering'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Institutional Email</span>
              <span className="font-semibold text-slate-800">{mentor?.email || 'faculty@campusconnect.edu'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Office Contact</span>
              <span className="font-semibold text-slate-800">{mentor?.phone || '+1 (555) 345-6789'}</span>
            </div>
          </div>
        </div>

        {/* Mentorship Program Notes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mentorship Benefits</span>
          </h2>

          <div className="space-y-2 text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Resume & Application Review:</strong>
              Your mentor receives instant notifications whenever you apply to recruitment drives.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Interview Preparation:</strong>
              Direct messaging channel enables feedback on mock interviews and domain questions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
