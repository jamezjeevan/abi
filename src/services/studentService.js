import { supabase, isSupabaseConfigured } from '../config/supabase';
import { campusStore } from './campusStore';

export const studentService = {
  /**
   * Get student profile by user ID or student ID
   */
  async getProfile(userId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*, faculty:mentor_id(name, email, department, phone)')
          .eq('user_id', userId)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getProfile failed, fallback to local store:', err);
      }
    }
    return campusStore.getStudentByUserId(userId);
  },

  /**
   * Update student profile (skills, phone, etc.)
   */
  async updateProfile(studentId, updates) {
    return campusStore.updateStudentSelfProfile(studentId, updates);
  },

  /**
   * Get student's assigned mentor details
   */
  async getMentor(mentorId) {
    return campusStore.getStudentMentor(mentorId);
  },

  /**
   * Get list of all published jobs/recruitment drives
   */
  async getAvailableJobs() {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies(company_name, industry, location, website)')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getAvailableJobs failed, fallback to local store:', err);
      }
    }
    const store = campusStore.getStore();
    return store.jobs.filter(j => j.status === 'published');
  },

  /**
   * Get student's submitted applications
   */
  async getMyApplications(studentId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('applications')
          .select('*, jobs(*)')
          .eq('student_id', studentId)
          .order('applied_at', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getMyApplications failed, fallback to local store:', err);
      }
    }
    return campusStore.getStudentApplications(studentId);
  },

  /**
   * Upload resume and parse extracted text/skills
   */
  async uploadResume(studentId, { fileName, skills, resumeText }) {
    return campusStore.uploadStudentResume(studentId, { fileName, skills, resumeText });
  },

  /**
   * Apply for a job: triggers deterministic validation + AI matching
   */
  async applyToJob({ studentId, jobId }) {
    return campusStore.submitApplicationWithAI({ studentId, jobId });
  }
};
