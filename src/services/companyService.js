import { supabase, isSupabaseConfigured } from '../config/supabase';
import { campusStore } from './campusStore';

export const companyService = {
  /**
   * Get company profile by authenticated user ID
   */
  async getCompanyProfile(userId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getCompanyProfile failed:', err);
      }
    }
    return campusStore.getCompanyByUserId(userId);
  },

  /**
   * Get list of jobs posted by this company
   */
  async getMyJobs(companyId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getMyJobs failed:', err);
      }
    }
    return campusStore.getCompanyJobs(companyId);
  },

  /**
   * Post a new recruitment drive
   */
  async createJob(payload) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .insert([payload])
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createJob failed:', err);
      }
    }
    return campusStore.createRecruitmentJob(payload);
  },

  /**
   * Get applicants who applied to this company's postings
   */
  async getApplicants(companyId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            student:student_id(register_number, name, email, department, cgpa, skills, resume_url),
            job:job_id(job_title, minimum_cgpa, required_skills)
          `)
          .eq('jobs.company_id', companyId)
          .order('applied_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getApplicants failed:', err);
      }
    }
    return campusStore.getCompanyApplicants(companyId);
  },

  /**
   * Update applicant stage (Applied, AI Screening, Qualified, Rejected, Under Review, Shortlisted, Interview, Selected, Not Selected)
   */
  async updateApplicationStatus(applicationId, newStatus) {
    return campusStore.updateApplicationStatus(applicationId, newStatus);
  }
};
