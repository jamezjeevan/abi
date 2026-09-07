import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { 
  Building2, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Power, 
  ShieldCheck,
  Phone,
  Mail,
  School
} from 'lucide-react';

export const AdminManagement = () => {
  const [managementList, setManagementList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMgt, setSelectedMgt] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    management_id: '',
    title: '',
    institution: '',
    phone: '',
    password: ''
  });

  const loadData = async () => {
    const list = await adminService.getManagementList();
    setManagementList(list || []);
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
      management_id: `MGT-${String(managementList.length + 1).padStart(3, '0')}`,
      title: 'Dean of Academic & Corporate Relations',
      institution: 'St. Peter Institute of Technology',
      phone: '+1 (555) 000-0000',
      password: 'password123'
    });
    setError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (mgt) => {
    setSelectedMgt(mgt);
    setFormData({
      name: mgt.name,
      email: mgt.email,
      management_id: mgt.management_id,
      title: mgt.title || '',
      institution: mgt.institution || '',
      phone: mgt.phone || '',
      password: ''
    });
    setError('');
    setIsEditModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.createManagementAccount(formData);
      setIsAddModalOpen(false);
      setSuccess(`Management account for "${formData.name}" created successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to create management account.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.updateManagement(selectedMgt.id, {
        name: formData.name,
        title: formData.title,
        institution: formData.institution,
        phone: formData.phone
      });
      setIsEditModalOpen(false);
      setSuccess(`Management account updated successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to update management account.');
    }
  };

  const handleToggleStatus = async (id, currentStatus, name) => {
    try {
      await adminService.toggleManagementStatus(id);
      setSuccess(`Account for "${name}" ${currentStatus ? 'deactivated' : 'activated'}.`);
      setTimeout(() => setSuccess(''), 3000);
      loadData();
    } catch (err) {
      setError(err.message || 'Error toggling account status.');
    }
  };

  const columns = [
    {
      header: 'Management Official',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-xs">
            {row.name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.name}</div>
            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
              <span>{row.management_id}</span>
              <span>•</span>
              <span className="text-slate-400">{row.title || 'Dean'}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Institution & Contact',
      accessor: 'institution',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-slate-900 font-medium flex items-center gap-1.5">
            <School className="w-3.5 h-3.5 text-slate-400" />
            <span>{row.institution || 'University'}</span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>{row.email}</span>
          </div>
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
          {row.is_active !== false ? 'Active Authority' : 'Deactivated'}
        </span>
      )
    },
    {
      header: 'Hierarchy Level',
      render: () => (
        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
          Admin → Management
        </span>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
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
            title={row.is_active !== false ? 'Deactivate Account' : 'Activate Account'}
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
            <Building2 className="w-4 h-4" />
            <span>Institutional Governance Tier</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            College Management Accounts
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Admin provisions Deans and Directors. Management oversees Faculty, who in turn mentor Students.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-indigo-600/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Provision New Management</span>
        </button>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={managementList}
        searchPlaceholder="Search management officials by name, ID, or institution..."
      />

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision College Management Account"
        subtitle="Only Admin can create College Management authorities. Once created, Management can provision Faculty."
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Official Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dean Dr. Arthur Vance"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Management ID</label>
              <input
                type="text"
                required
                value={formData.management_id}
                onChange={(e) => setFormData({ ...formData, management_id: e.target.value })}
                placeholder="e.g. MGT-003"
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
                placeholder="dean@university.edu"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Title / Designation</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Dean of Academic & Corporate Relations"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">College / Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="St. Peter Institute of Technology"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Initial Account Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Minimum 8 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1">Management will use this password and their ID/email to log in.</p>
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
              Provision Account
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Management Official"
        subtitle={`Updating profile records for ${selectedMgt?.name}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Official Full Name</label>
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
              <label className="block font-bold text-slate-700 uppercase mb-1">Title / Role</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Institution</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
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
