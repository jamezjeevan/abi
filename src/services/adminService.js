import { supabase, isSupabaseConfigured } from '../config/supabase';
import { campusStore } from './campusStore';

export const adminService = {
  /**
   * Get overall platform statistics
   */
  async getStats() {
    if (isSupabaseConfigured()) {
      try {
        const [
          { count: mgtCount },
          { count: compCount },
          { count: stuCount },
          { count: facCount },
          { count: jobCount },
          { count: appCount }
        ] = await Promise.all([
          supabase.from('management').select('*', { count: 'exact', head: true }),
          supabase.from('companies').select('*', { count: 'exact', head: true }),
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('faculty').select('*', { count: 'exact', head: true }),
          supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('applications').select('*', { count: 'exact', head: true })
        ]);

        return {
          totalManagement: mgtCount || 0,
          totalCompanies: compCount || 0,
          totalStudents: stuCount || 0,
          totalFaculty: facCount || 0,
          activeRecruitments: jobCount || 0,
          totalApplications: appCount || 0
        };
      } catch (err) {
        console.warn('Supabase getStats query failed, falling back to local store:', err);
      }
    }

    return campusStore.getAdminStats();
  },

  /**
   * Get list of all College Management accounts
   */
  async getManagementList() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('management')
          .select('*, profiles:user_id(full_name, email, is_active, created_at)')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getManagementList failed, falling back:', err);
      }
    }
    return campusStore.getManagementList();
  },

  /**
   * Admin creates a College Management account
   */
  async createManagementAccount(payload) {
    if (isSupabaseConfigured()) {
      try {
        // In Supabase production, call Edge Function or auth admin API
        const { data, error } = await supabase.rpc('admin_create_management', payload);
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createManagementAccount RPC failed, falling back to local store:', err);
      }
    }
    return campusStore.createManagementAccount(payload);
  },

  /**
   * Edit College Management details
   */
  async updateManagement(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('management')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateManagement failed:', err);
      }
    }
    return campusStore.updateManagementAccount(id, updates);
  },

  /**
   * Activate / Deactivate Management account
   */
  async toggleManagementStatus(id) {
    return campusStore.toggleManagementStatus(id);
  },

  /**
   * Get list of all Corporate Company accounts
   */
  async getCompanyList() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*, profiles:user_id(full_name, email, is_active, created_at)')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getCompanyList failed, falling back:', err);
      }
    }
    return campusStore.getCompanyList();
  },

  /**
   * Admin creates a Corporate Company account
   */
  async createCompanyAccount(payload) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('admin_create_company', payload);
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createCompanyAccount RPC failed, falling back to local store:', err);
      }
    }
    return campusStore.createCompanyAccount(payload);
  },

  /**
   * Edit Company details
   */
  async updateCompany(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('companies')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateCompany failed:', err);
      }
    }
    return campusStore.updateCompanyAccount(id, updates);
  },

  /**
   * Activate / Deactivate Company account
   */
  async toggleCompanyStatus(id) {
    return campusStore.toggleCompanyStatus(id);
  }
};
