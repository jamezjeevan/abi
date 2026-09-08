import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { campusStore } from './campusStore.js';
import { eligibilityService } from './eligibilityService.js';
import { authService } from './authService.js';

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
   * Deterministic Hard Eligibility Check (STEP 6)
   * Evaluates student data against job requirements without calling Gemini AI.
   */
  checkHardEligibility({ student, job }) {
    return eligibilityService.checkHardEligibility({ student, job });
  },

  /**
   * Apply for a job:
   * 1. Validates authenticated user session
   * 2. Prevents student from applying using another student's ID
   * 3. Runs deterministic Hard Eligibility Check (CGPA, Dept, Year)
   * 4. If ineligible: blocks application with clear reason (zero AI/Gemini calls)
   * 5. If eligible: saves application marked as 'eligible' ready for Stage 7 (Gemini Matching)
   */
  async applyToJob({ studentId, jobId }) {
    // 1. Authenticated User Identity Check
    let authUserId = null;
    if (isSupabaseConfigured()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        authUserId = user?.id;
      } catch (e) {
        console.warn('Supabase auth.getUser error:', e);
      }
    }

    if (!authUserId) {
      const session = await authService.getInitialSession();
      authUserId = session?.user?.id;
    }

    if (!authUserId) {
      throw new Error('Authentication required. Please sign in as a student to apply.');
    }

    // 2. Fetch authenticated student profile
    const student = await this.getProfile(authUserId);
    if (!student) {
      throw new Error('Student profile not found for authenticated user.');
    }

    // 3. Security Check: Prevent applying using another student's ID
    if (studentId && student.id !== studentId) {
      throw new Error('Unauthorized: You cannot submit an application on behalf of another student ID.');
    }

    // 4. Fetch selected job requirements
    let job = null;
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*, companies(company_name, industry, location, website)')
          .eq('id', jobId)
          .single();
        if (!error && data) job = data;
      } catch (err) {
        console.warn('Supabase getJobById error:', err);
      }
    }

    if (!job) {
      const store = campusStore.getStore();
      job = store.jobs?.find(j => j.id === jobId);
    }

    if (!job) {
      throw new Error('Job posting not found.');
    }

    // 5. Run deterministic Hard Eligibility Check (STEP 6)
    const eligibility = eligibilityService.checkHardEligibility({ student, job });

    // 6. If NOT eligible: Reject immediately with clear reasons, no Gemini AI call
    if (!eligibility.isEligible) {
      const error = new Error(`Eligibility check failed: ${eligibility.reasons.join(' ')}`);
      error.eligibility = eligibility;
      throw error;
    }

    // 7. If ELIGIBLE: Record application with status = 'eligible' (prepared for Gemini matching)
    if (isSupabaseConfigured()) {
      try {
        // Check for existing application
        const { data: existingApp } = await supabase
          .from('applications')
          .select('id, status')
          .eq('job_id', jobId)
          .eq('student_id', student.id)
          .maybeSingle();

        if (existingApp) {
          throw new Error('You have already applied for this job.');
        }

        const { data: newApp, error: insertError } = await supabase
          .from('applications')
          .insert([
            {
              job_id: jobId,
              student_id: student.id,
              status: 'eligible',
              ai_match_score: null,
              ai_analysis: {
                stage: 'hard_eligibility_passed',
                hard_eligibility: eligibility,
                verified_at: new Date().toISOString()
              }
            }
          ])
          .select('*, jobs(*)')
          .single();

        if (insertError) throw insertError;

        return {
          application: newApp,
          eligibility,
          message: 'Hard eligibility verified. Application prepared for Gemini Resume Matching.'
        };
      } catch (err) {
        if (err.message?.includes('already applied') || err.message?.includes('duplicate key')) {
          throw new Error('You have already applied for this job.');
        }
        console.warn('Supabase application insertion notice, fallback to local store:', err);
      }
    }

    // Fallback store record
    return campusStore.submitApplicationHardEligible({
      studentId: student.id,
      jobId,
      eligibility
    });
  }
};
