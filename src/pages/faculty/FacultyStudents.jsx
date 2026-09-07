import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { facultyService } from '../../services/facultyService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  BookOpen, 
  FileText, 
  Mail, 
  Phone,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FacultyStudents = () => {
  const { profile, user } = useAuth();
  const [students, setStudents] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    register_number: '',
    name: '',
    email: '',
    department: profile?.meta?.department || 'Computer Science & Engineering',
    course: 'B.Tech Computer Science',
    year: '4',
    semester: '8',
    cgpa: '8.50',
    phone: '',
    skills: 'React, Node.js, JavaScript, SQL',
    password: 'password123'
  });

  const loadData = async () => {
    const list = await facultyService.getMyStudents(user?.id || '33333333-3333-3333-3333-333333333333');
    setStudents(list || []);
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(loadData);
    return () => unsub();
  }, [user]);

  const handleOpenAdd = () => {
    setFormData({
      register_number: `REG2024CS${String(students.length + 90).padStart(3, '0')}`,
      name: '',
      email: '',
      department: profile?.meta?.department || 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: '4',
      semester: '8',
      cgpa: '8.50',
      phone: '+1 (555) 456-7890',
      skills: 'React, JavaScript, Node.js, PostgreSQL, Git',
      password: 'password123'
    });
    setError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (stu) => {
    setSelectedStudent(stu);
    setFormData({
      register_number: stu.register_number,
      name: stu.name,
      email: stu.email,
      department: stu.department || 'Computer Science & Engineering',
      course: stu.course || 'B.Tech Computer Science',
      year: String(stu.year || 4),
      semester: String(stu.semester || 8),
      cgpa: String(stu.cgpa || 7.5),
      phone: stu.phone || '',
      skills: Array.isArray(stu.skills) ? stu.skills.join(', ') : (stu.skills || ''),
      password: ''
    });
    setError('');
    setIsEditModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Rule: faculty creates student -> automatically store faculty's ID as student.mentor_id
      await facultyService.createStudentAccount({
        facultyId: user?.id || '33333333-3333-3333-3333-333333333333',
        facultyName: profile?.full_name || 'Prof. Sarah Jenkins',
        ...formData
      });
      setIsAddModalOpen(false);
      setSuccess(`Student "${formData.name}" enrolled! You are assigned as their permanent academic mentor.`);
      setTimeout(() => setSuccess(''), 5000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to enroll student.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await facultyService.updateStudent(selectedStudent.id, {
        name: formData.name,
        department: formData.department,
        course: formData.course,
        year: parseInt(formData.year, 10),
        semester: parseInt(formData.semester, 10),
        cgpa: parseFloat(formData.cgpa),
        phone: formData.phone,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      setIsEditModalOpen(false);
      setSuccess(`Student records updated successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to update student records.');
    }
  };

  const columns = [
    {
      header: 'Student Name & ID',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-500 font-mono">
              {row.register_number} • Year {row.year} (Sem {row.semester})
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Academic Standing',
      accessor: 'cgpa',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-xs text-slate-900 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>CGPA: {row.cgpa}</span>
          </div>
          <div className="text-[11px] text-slate-500">{row.department}</div>
        </div>
      )
    },
    {
      header: 'Key Skills',
      accessor: 'skills',
      render: (row) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(row.skills || []).slice(0, 3).map((skill, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
              {skill}
            </span>
          ))}
          {(row.skills || []).length > 3 && (
            <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px]">
              +{row.skills.length - 3}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Placement Status',
      accessor: 'placement_status',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          row.placement_status === 'Placed'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : row.placement_status === 'In Interview'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          {row.placement_status || 'Registered'}
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to="/faculty/messages"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Chat with Mentee"
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Edit Details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Assigned Mentee Cohort</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Mentee Students Directory
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Enrolling a student automatically assigns you as their mentor (<strong className="font-mono text-emerald-700">mentor_id = {user?.id?.slice(0, 8) || 'FAC-101'}</strong>).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-emerald-600/20 cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Enroll New Mentee</span>
        </button>
      </div>

      {/* Auto-Mentorship Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold text-emerald-900">Automatic Mentorship Rule:</strong> When you enroll a student, your faculty ID is automatically bound as their <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded text-emerald-900">mentor_id</code>. Their student portal will prominently display <strong className="text-emerald-900">"My Mentor: {profile?.full_name || 'Prof. Sarah Jenkins'}"</strong>.
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search mentees by name, register number, skills..."
      />

      {/* Enroll Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Enroll Student under your Mentorship"
        subtitle={`Faculty creator (${profile?.full_name || 'Prof. Jenkins'}) is automatically assigned as academic mentor.`}
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Register Number</label>
              <input
                type="text"
                required
                value={formData.register_number}
                onChange={(e) => setFormData({ ...formData, register_number: e.target.value })}
                placeholder="REG2024CS099"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Students can log in using this Register Number.</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Student Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Student Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@university.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Year & Sem</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="Year"
                  className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-center"
                />
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  placeholder="Sem"
                  className="w-1/2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-center"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Cumulative CGPA</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="8.50"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Core Skills (Comma separated)</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="React, JavaScript, Node.js, PostgreSQL, Docker"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">Used by AI Resume Matching Engine to calculate qualification match percentages.</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Initial Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">Default is <code className="font-mono">password123</code>.</p>
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
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              Enroll & Assign as Mentee
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Mentee Student Records"
        subtitle={`Updating academic profile for ${selectedStudent?.name}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Student Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">CGPA</label>
              <input
                type="number"
                step="0.01"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
