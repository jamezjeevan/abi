import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/companyService';
import { campusStore } from '../../services/campusStore';
import { Briefcase, Globe, MapPin, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CompanyProfile = () => {
  const { user, profile } = useAuth();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const loadComp = async () => {
      const comp = await companyService.getCompanyProfile(user?.id || '55555555-5555-5555-5555-555555555555');
      setCompany(comp);
    };
    loadComp();
  }, [user]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 font-extrabold flex items-center justify-center text-2xl shadow-xs">
          {company?.company_name?.charAt(0) || 'C'}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">{company?.company_name || 'Nexus Technologies'}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase">
              Verified Partner
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-0.5">
            {company?.industry || 'Enterprise Computing'} • {company?.location || 'San Francisco, CA'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-600" />
            <span>Corporate Identity</span>
          </h2>

          <div className="space-y-3">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Company Name</span>
              <span className="font-bold text-slate-900">{company?.company_name || 'Nexus Technologies'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Official Recruiter Email</span>
              <span className="font-semibold text-slate-800">{company?.email || profile?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Industry Domain</span>
              <span className="font-semibold text-slate-800">{company?.industry || 'Artificial Intelligence & Cloud Systems'}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Website</span>
              <a href={company?.website || '#'} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline font-semibold flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{company?.website || 'https://nexus-tech.io'}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Recruiter Authority & Security</span>
          </h2>

          <div className="space-y-2 text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Admin Authorized:</strong>
              Corporate partner profile verified by platform administration.
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-slate-900 block mb-0.5">Automated Candidate Filtering:</strong>
              Students applying to your postings are pre-screened by hard criteria and AI resume analysis.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
