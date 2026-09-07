import { supabase, isSupabaseConfigured } from '../config/supabase';
import { campusStore } from './campusStore';

export const managementService = {
  /**
   * Get list of faculty members created under or associated with this institution
   */
  async getFacultyList() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('faculty')
          .select('*, profiles:user_id(full_name, email, is_active, created_at)')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getFacultyList failed:', err);
      }
    }
    return campusStore.getFacultyList();
  },

  /**
   * College Management creates a Faculty account
   */
  async createFacultyAccount(payload) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('management_create_faculty', payload);
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createFacultyAccount RPC failed:', err);
      }
    }
    return campusStore.createFacultyAccount(payload);
  },

  /**
   * Edit Faculty details
   */
  async updateFaculty(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('faculty')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateFaculty failed:', err);
      }
    }
    return campusStore.updateFaculty(id, updates);
  },

  /**
   * Activate / Deactivate Faculty account
   */
  async toggleFacultyStatus(id) {
    return campusStore.toggleFacultyStatus(id);
  },

  /**
   * View students through faculty relationships (Hierarchical reporting)
   */
  async getStudentsThroughFaculty() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select(`
            *,
            faculty:mentor_id(name, email, department),
            applications(id, status, ai_match_score)
          `);
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getStudentsThroughFaculty failed:', err);
      }
    }
    return campusStore.getStudentsThroughFaculty();
  },

  /**
   * Get placement and academic overview for College Management
   */
  async getManagementStats() {
    const faculty = await this.getFacultyList();
    const students = await this.getStudentsThroughFaculty();
    const store = campusStore.getStore();
    const apps = store.applications;

    const placedCount = students.filter(s => s.placement_status === 'Placed').length;
    const interviewCount = students.filter(s => s.placement_status === 'In Interview / Shortlisted').length;

    return {
      totalFaculty: faculty.length,
      activeFaculty: faculty.filter(f => f.is_active !== false).length,
      totalStudentsEnrolled: students.length,
      placedStudents: placedCount,
      studentsInProcess: interviewCount,
      placementRate: students.length > 0 ? Math.round((placedCount / students.length) * 100) : 0,
      activeCorporateDrives: store.jobs.filter(j => j.status === 'published').length,
      totalApplicationsProcessed: apps.length
    };
  }
};
