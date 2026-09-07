import { supabase, isSupabaseConfigured } from '../config/supabase';
import { campusStore } from './campusStore';

export const facultyService = {
  /**
   * Get students mentored / added by this faculty member
   */
  async getMyStudents(facultyIdOrUserId) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*, applications(*)')
          .or(`mentor_id.eq.${facultyIdOrUserId},created_by.eq.${facultyIdOrUserId}`);
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getMyStudents failed:', err);
      }
    }
    return campusStore.getFacultyStudents(facultyIdOrUserId);
  },

  /**
   * Faculty provisions a Student account.
   * Automatic rule: faculty_id -> student.mentor_id
   */
  async createStudentAccount(payload) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.rpc('faculty_create_student', payload);
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase createStudentAccount RPC failed:', err);
      }
    }
    return campusStore.createStudentAccount(payload);
  },

  /**
   * Edit student academic details, CGPA, skills, etc.
   */
  async updateStudent(id, updates) {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('students')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase updateStudent failed:', err);
      }
    }
    return campusStore.updateStudentDetails(id, updates);
  },

  /**
   * View all applications submitted by mentees
   */
  async getMenteeApplications(facultyId) {
    return campusStore.getFacultyMenteeApplications(facultyId);
  },

  /**
   * Get faculty stats for dashboard
   */
  async getFacultyStats(facultyId) {
    const students = await this.getMyStudents(facultyId);
    const applications = await this.getMenteeApplications(facultyId);

    const placedCount = students.filter(s => s.placement_status === 'Placed').length;
    const interviewingCount = students.filter(s => s.placement_status === 'In Interview').length;
    const avgCgpa = students.length > 0 
      ? (students.reduce((acc, s) => acc + (parseFloat(s.cgpa) || 0), 0) / students.length).toFixed(2)
      : '0.00';

    return {
      totalMentees: students.length,
      placedMentees: placedCount,
      interviewingMentees: interviewingCount,
      totalApplications: applications.length,
      averageCgpa: avgCgpa
    };
  }
};
