import React, { useState, useEffect } from 'react';
import { managementService } from '../../services/managementService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { 
  GraduationCap, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Power, 
  Mail, 
  Phone,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManagementFaculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFac, setSelectedFac] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    faculty_id: '',
    department: 'Computer Science & Engineering',
    phone: '',
    password: 'password123'
  });

  const loadData = async () => {
    const list = await managementService.getFacultyList();
    setFacultyList(list || []);
  };

  useEffect(() => {
    loadData();
    const unsub = campusStore.subscribe(() => {
      loadData();
    });
    return () => unsub();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      faculty_id: `FAC-${String(facultyList.length + 101)}`,
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 345-6789',
      password: 'password123'
    });
    setError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setSelectedFac(fac);
    setFormData({
      name: fac.name,
      email: fac.email,
      faculty_id: fac.faculty_id,
      department: fac.department || 'Computer Science & Engineering',
      phone: fac.phone || '',
      password: ''
    });
    setError('');
    setIsEditModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await managementService.createFacultyAccount(formData);
      setIsAddModalOpen(false);
      setSuccess(`Faculty member "${formData.name}" provisioned successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create faculty account.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await managementService.updateFaculty(selectedFac.id, {
        name: formData.name,
        department: formData.department,
        phone: formData.phone
      });
      setIsEditModalOpen(false);
      setSuccess(`Faculty details updated successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to update faculty.');
    }
  };

  const handleToggleStatus = async (id, currentStatus, name) => {
    try {
      await managementService.toggleFacultyStatus(id);
      setSuccess(`Faculty account "${name}" ${currentStatus ? 'deactivated' : 'activated'}.`);
      setTimeout(() => setSuccess(''), 3000);
      loadData();
    } catch (err) {
      setError(err.message || 'Error toggling faculty status.');
    }
  };

  const columns = [
    {
      header: 'Faculty Member',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <span>{row.faculty_id}</span>
              <span>•</span>
              <span className="text-slate-400">Mentor Authority</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Department',
      accessor: 'department',
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-800 font-medium text-xs">
          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
          <span>{row.department}</span>
        </div>
      )
    },
    {
      header: 'Contact Info',
      accessor: 'email',
      render: (row) => (
        <div className="space-y-0.5 text-[11px]">
          <div className="text-slate-700 flex items-center gap-1">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>{row.email}</span>
          </div>
          {row.phone && (
            <div className="text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <span>{row.phone}</span>
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'is_active',
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
          row.is_active !== false 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${row.is_active !== false ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          {row.is_active !== false ? 'Active Faculty' : 'Deactivated'}
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
            to="/management/messages"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Message Faculty"
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
          <button
            onClick={() => handleToggleStatus(row.id, row.is_active !== false, row.name)}
            className={`p-1.5 rounded-lg border transition ${
              row.is_active !== false
                ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }`}
            title={row.is_active !== false ? 'Deactivate' : 'Activate'}
          >
            <Power className="w-3.5 h-3.5" />
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
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Academic Mentorship Faculty Management</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Faculty Directory & Creation
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            College Management creates Faculty members. Each faculty member provisions and mentors students.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Provision Faculty Member</span>
        </button>
      </div>

      {/* Success/Error Alerts */}
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

      {/* Faculty Table */}
      <DataTable
        columns={columns}
        data={facultyList}
        searchPlaceholder="Search faculty by name, ID, or department..."
      />

      {/* Add Faculty Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Faculty Account"
        subtitle="Faculty accounts can ONLY be created by College Management."
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Faculty Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Prof. Sarah Jenkins"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Faculty ID</label>
              <input
                type="text"
                required
                value={formData.faculty_id}
                onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })}
                placeholder="FAC-CS-101"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Institutional Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="faculty@university.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 345-6789"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Initial Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
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
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
            >
              Provision Faculty Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Faculty Details"
        subtitle={`Updating records for ${selectedFac?.name}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Faculty Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Electrical & Electronics">Electrical & Electronics</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>
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
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
