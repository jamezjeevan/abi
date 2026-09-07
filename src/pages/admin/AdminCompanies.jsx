import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { campusStore } from '../../services/campusStore';
import { DataTable } from '../../components/common/DataTable';
import { Modal } from '../../components/common/Modal';
import { 
  Briefcase, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Power, 
  Globe, 
  MapPin, 
  Mail,
  Building
} from 'lucide-react';

export const AdminCompanies = () => {
  const [companyList, setCompanyList] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedComp, setSelectedComp] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    industry: '',
    website: '',
    location: '',
    description: '',
    password: ''
  });

  const loadData = async () => {
    const list = await adminService.getCompanyList();
    setCompanyList(list || []);
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
      company_name: '',
      email: '',
      industry: 'Enterprise Software & Cloud Platforms',
      website: 'https://',
      location: 'Bangalore / Hybrid',
      description: 'Campus hiring partner recruiting across engineering and design verticals.',
      password: 'password123'
    });
    setError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (comp) => {
    setSelectedComp(comp);
    setFormData({
      company_name: comp.company_name,
      email: comp.email,
      industry: comp.industry || '',
      website: comp.website || '',
      location: comp.location || '',
      description: comp.description || '',
      password: ''
    });
    setError('');
    setIsEditModalOpen(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.createCompanyAccount(formData);
      setIsAddModalOpen(false);
      setSuccess(`Company partner "${formData.company_name}" provisioned successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to provision company account.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await adminService.updateCompany(selectedComp.id, {
        company_name: formData.company_name,
        industry: formData.industry,
        website: formData.website,
        location: formData.location,
        description: formData.description
      });
      setIsEditModalOpen(false);
      setSuccess(`Company details updated successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      loadData();
    } catch (err) {
      setError(err.message || 'Failed to update company account.');
    }
  };

  const handleToggleStatus = async (id, currentStatus, name) => {
    try {
      await adminService.toggleCompanyStatus(id);
      setSuccess(`Corporate account "${name}" ${currentStatus ? 'deactivated' : 'activated'}.`);
      setTimeout(() => setSuccess(''), 3000);
      loadData();
    } catch (err) {
      setError(err.message || 'Error toggling company status.');
    }
  };

  const columns = [
    {
      header: 'Company Partner',
      accessor: 'company_name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold flex items-center justify-center text-xs">
            {row.company_name.charAt(0)}
          </div>
          <div>
            <div className="font-bold text-slate-900">{row.company_name}</div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <span>{row.industry || 'Technology'}</span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Location & Web',
      accessor: 'location',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="text-slate-900 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{row.location || 'Flexible'}</span>
          </div>
          <div className="text-[11px] text-brand-600 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-slate-400" />
            <a href={row.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {row.website || 'No URL'}
            </a>
          </div>
        </div>
      )
    },
    {
      header: 'Recruiter Email',
      accessor: 'email',
      render: (row) => (
        <div className="text-slate-700 font-mono text-[11px] flex items-center gap-1.5">
          <Mail className="w-3 h-3 text-slate-400" />
          <span>{row.email}</span>
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
          {row.is_active !== false ? 'Authorized Recruiter' : 'Access Suspended'}
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
            title="Edit Company Details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleToggleStatus(row.id, row.is_active !== false, row.company_name)}
            className={`p-1.5 rounded-lg border transition ${
              row.is_active !== false
                ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }`}
            title={row.is_active !== false ? 'Deactivate Company' : 'Activate Company'}
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
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Corporate Placement Partner Governance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Corporate Recruitment Partners
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Admin authorizes verified hiring companies to publish recruitment drives and access screened student candidates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md shadow-amber-600/20 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Authorize New Company</span>
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
        data={companyList}
        searchPlaceholder="Search companies by name, industry, or email..."
      />

      {/* Add Company Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Authorize Corporate Recruiter Account"
        subtitle="Companies create recruitment posts and view AI-screened candidate applications."
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          {error && <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Company / Organization Name</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="e.g. Nexus Technologies"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Recruiter / Official Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="careers@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Industry Vertical</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Artificial Intelligence & Cloud"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Company Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://nexus-tech.io"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Office Location / Primary Worksite</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="San Francisco, CA / Hybrid"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Description / Mission</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief summary of company domain and technologies used..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
            />
            <p className="text-[11px] text-slate-500 mt-1">Company recruiters will use this password and their email to access their portal.</p>
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
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Authorize Company
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Company Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Company Details"
        subtitle={`Updating records for ${selectedComp?.company_name}`}
      >
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Company Name</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none text-slate-800"
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
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
