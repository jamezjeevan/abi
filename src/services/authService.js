import { supabase, isSupabaseConfigured } from '../config/supabase';
import { ROLES } from '../config/constants';
import { campusStore } from './campusStore';

/**
 * ============================================
 * AUTH SERVICE - STEP 9 INTEGRATION
 * CampusConnect
 * ============================================
 *
 * Supports:
 * - Student Register Number + Password
 * - Faculty ID + Password
 * - Management ID + Password
 * - Company Name/Email + Password
 * - Admin Email + Password
 *
 * Authentication is handled by Supabase Auth with fallback to interactive demo store.
 * User role/profile information is stored in public.profiles.
 */

// Seed demo users for immediate testing & offline fallback
export const DEMO_USERS = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin123@gmail.com',
    password: 'admin123',
    role: ROLES.ADMIN,
    full_name: 'System Administrator',
    identifier: 'admin123@gmail.com',
    status: 'active',
    is_active: true,
    meta: {
      title: 'Global System Administrator',
      department: 'Platform Operations'
    }
  },
  {
    id: '11111111-1111-1111-1111-111111111112',
    email: 'admin@campusconnect.edu',
    password: 'password123',
    role: ROLES.ADMIN,
    full_name: 'Platform Ops Admin',
    identifier: 'admin@campusconnect.edu',
    status: 'active',
    is_active: true,
    meta: {
      title: 'Platform Operations Admin',
      department: 'Platform Governance'
    }
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'management@campusconnect.edu',
    password: 'password123',
    role: ROLES.MANAGEMENT,
    full_name: 'Dean Dr. Arthur Vance',
    identifier: 'MGT-001',
    status: 'active',
    is_active: true,
    meta: {
      management_id: 'MGT-001',
      title: 'Dean of Academic & Corporate Relations',
      institution: 'St. Peter Institute of Technology'
    }
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    email: 'faculty@campusconnect.edu',
    password: 'password123',
    role: ROLES.FACULTY,
    full_name: 'Prof. Sarah Jenkins',
    identifier: 'FAC-CS-101',
    status: 'active',
    is_active: true,
    meta: {
      faculty_id: 'FAC-CS-101',
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 345-6789'
    }
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    email: 'student@campusconnect.edu',
    password: 'password123',
    role: ROLES.STUDENT,
    full_name: 'Alex Rivera',
    identifier: 'REG2024CS088',
    status: 'active',
    is_active: true,
    meta: {
      register_number: 'REG2024CS088',
      department: 'Computer Science & Engineering',
      year: 4,
      cgpa: 8.92,
      mentor_name: 'Prof. Sarah Jenkins',
      mentor_id: '33333333-3333-3333-3333-333333333333',
      phone: '+1 (555) 456-7890'
    }
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    email: 'company@nexus-tech.io',
    password: 'password123',
    role: ROLES.COMPANY,
    full_name: 'Nexus Technologies HR',
    identifier: 'company@nexus-tech.io',
    status: 'active',
    is_active: true,
    meta: {
      company_name: 'Nexus Technologies',
      industry: 'Artificial Intelligence & Cloud Systems',
      website: 'https://nexus-tech.io',
      location: 'San Francisco, CA'
    }
  }
];

const LOCAL_STORAGE_SESSION_KEY = 'campus_connect_session';

/**
 * Check if a profile record is marked active
 */
const isProfileActive = (profile) => {
  if (!profile) return false;
  if (typeof profile.status === 'string') {
    return profile.status.toLowerCase() === 'active';
  }
  if (typeof profile.is_active === 'boolean') {
    return profile.is_active;
  }
  return true;
};

// ============================================
// IDENTIFIER RESOLUTION
// ============================================

/**
 * Resolve any role-specific identifier to an authenticating email address
 * Handles:
 * - Admin: email
 * - Student: Register Number -> email
 * - Faculty: Faculty ID -> email
 * - Management: Management ID -> email
 * - Company: Company Name / Email -> email
 */
export const resolveIdentifier = async (identifier, expectedRole) => {
  if (!identifier) return null;
  const trimmed = identifier.trim();

  // 1. Direct email check
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }

  // 2. Query Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      // Try stored RPC if exists
      const { data, error } = await supabase.rpc('resolve_identifier_to_email', {
        identifier_input: trimmed
      });
      if (!error && data) return data.toLowerCase();
    } catch (e) {
      console.warn('RPC resolve_identifier_to_email notice:', e?.message || e);
    }

    // Direct table lookup fallback in Supabase
    try {
      // Student register number check
      if (!expectedRole || expectedRole === ROLES.STUDENT) {
        const { data: student } = await supabase
          .from('students')
          .select('email')
          .ilike('register_number', trimmed)
          .limit(1)
          .maybeSingle();
        if (student?.email) return student.email.toLowerCase();
      }

      // Faculty ID check
      if (!expectedRole || expectedRole === ROLES.FACULTY) {
        const { data: faculty } = await supabase
          .from('faculty')
          .select('email')
          .ilike('faculty_id', trimmed)
          .limit(1)
          .maybeSingle();
        if (faculty?.email) return faculty.email.toLowerCase();
      }

      // Management ID check
      if (!expectedRole || expectedRole === ROLES.MANAGEMENT) {
        const { data: management } = await supabase
          .from('management')
          .select('email')
          .ilike('management_id', trimmed)
          .limit(1)
          .maybeSingle();
        if (management?.email) return management.email.toLowerCase();
      }

      // Company name / ID check
      if (!expectedRole || expectedRole === ROLES.COMPANY) {
        const { data: company } = await supabase
          .from('companies')
          .select('email')
          .ilike('company_name', trimmed)
          .limit(1)
          .maybeSingle();
        if (company?.email) return company.email.toLowerCase();
      }
    } catch (err) {
      console.warn('Direct database lookup notice in resolveIdentifier:', err?.message || err);
    }
  }

  // 3. Check dynamic campusStore (interactive local state)
  const store = campusStore.getStore();

  const foundStudent = store.students?.find(s =>
    (s.register_number && s.register_number.toLowerCase() === trimmed.toLowerCase()) ||
    (s.email && s.email.toLowerCase() === trimmed.toLowerCase())
  );
  if (foundStudent && (!expectedRole || expectedRole === ROLES.STUDENT)) {
    return foundStudent.email.toLowerCase();
  }

  const foundFaculty = store.faculty?.find(f =>
    (f.faculty_id && f.faculty_id.toLowerCase() === trimmed.toLowerCase()) ||
    (f.email && f.email.toLowerCase() === trimmed.toLowerCase())
  );
  if (foundFaculty && (!expectedRole || expectedRole === ROLES.FACULTY)) {
    return foundFaculty.email.toLowerCase();
  }

  const foundManagement = store.management?.find(m =>
    (m.management_id && m.management_id.toLowerCase() === trimmed.toLowerCase()) ||
    (m.email && m.email.toLowerCase() === trimmed.toLowerCase())
  );
  if (foundManagement && (!expectedRole || expectedRole === ROLES.MANAGEMENT)) {
    return foundManagement.email.toLowerCase();
  }

  const foundCompany = store.companies?.find(c =>
    (c.company_name && c.company_name.toLowerCase() === trimmed.toLowerCase()) ||
    (c.email && c.email.toLowerCase() === trimmed.toLowerCase())
  );
  if (foundCompany && (!expectedRole || expectedRole === ROLES.COMPANY)) {
    return foundCompany.email.toLowerCase();
  }

  // 4. Check DEMO_USERS registry
  const foundDemo = DEMO_USERS.find(user => {
    const idMatch = user.identifier && user.identifier.toLowerCase() === trimmed.toLowerCase();
    const emailMatch = user.email && user.email.toLowerCase() === trimmed.toLowerCase();
    const roleMatch = !expectedRole || user.role === expectedRole;
    return (idMatch || emailMatch) && roleMatch;
  });

  if (foundDemo) return foundDemo.email.toLowerCase();

  return null;
};

// ============================================
// SIGN IN / LOGIN
// ============================================

/**
 * Unified login supporting all 5 roles:
 * - admin, management, faculty, student, company
 */
export const login = async ({ identifier, password, selectedRole }) => {
  if (!identifier || !password) {
    throw new Error('Please enter both your identifier and password.');
  }

  // 1. Resolve identifier to authenticating email
  let email = await resolveIdentifier(identifier, selectedRole);

  if (!email) {
    if (identifier.includes('@')) {
      email = identifier.trim().toLowerCase();
    } else {
      throw new Error('Invalid email/ID or password.');
    }
  }

  // Helper function to authenticate demo/sample accounts
  const tryDemoLogin = () => {
    let matchedUser = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    // Check dynamic campusStore if not in static DEMO_USERS
    if (!matchedUser) {
      const store = campusStore.getStore();
      const profile = store.profiles?.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (profile) {
        let roleItem = null;
        if (profile.role === ROLES.MANAGEMENT) {
          roleItem = store.management?.find(m => m.user_id === profile.id || m.email === profile.email);
        } else if (profile.role === ROLES.FACULTY) {
          roleItem = store.faculty?.find(f => f.user_id === profile.id || f.email === profile.email);
        } else if (profile.role === ROLES.STUDENT) {
          roleItem = store.students?.find(s => s.user_id === profile.id || s.email === profile.email);
        } else if (profile.role === ROLES.COMPANY) {
          roleItem = store.companies?.find(c => c.user_id === profile.id || c.email === profile.email);
        }

        const expectedPwd = roleItem?.password || 'password123';
        if (password === expectedPwd || password === 'password123') {
          matchedUser = {
            id: profile.id,
            email: profile.email,
            role: profile.role,
            full_name: profile.full_name,
            status: profile.status || (profile.is_active ? 'active' : 'inactive'),
            is_active: profile.is_active !== false,
            meta: roleItem || {}
          };
        }
      }
    }

    if (matchedUser) {
      if (!isProfileActive(matchedUser)) {
        throw new Error('Your account is currently inactive. Please contact the administrator.');
      }

      if (selectedRole && matchedUser.role !== selectedRole) {
        throw new Error('This account does not belong to the selected role.');
      }

      const sessionPayload = {
        user: {
          id: matchedUser.id,
          email: matchedUser.email,
        },
        profile: {
          id: matchedUser.id,
          role: matchedUser.role,
          full_name: matchedUser.full_name,
          email: matchedUser.email,
          status: 'active',
          is_active: true,
          meta: matchedUser.meta || {}
        },
        role: matchedUser.role,
        session: null
      };

      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(sessionPayload));
      return sessionPayload;
    }

    return null;
  };

  // 2. Supabase Authentication
  if (isSupabaseConfigured()) {
    let authResult = null;
    try {
      authResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } catch (networkErr) {
      // If network fails, check demo accounts before failing
      const demoSession = tryDemoLogin();
      if (demoSession) return demoSession;
      throw new Error('Unable to connect to the authentication service. Please check your network connection.');
    }

    const { data, error } = authResult || {};

    // If Supabase authentication fails (e.g. demo account not yet created in Supabase Auth), try demo fallback
    if (error || !data?.user) {
      const demoSession = tryDemoLogin();
      if (demoSession) return demoSession;

      if (
        error?.message?.toLowerCase().includes('invalid login credentials') ||
        error?.message?.toLowerCase().includes('invalid grant') ||
        error?.status === 400
      ) {
        throw new Error('Invalid email/ID or password.');
      }
      throw new Error(error?.message || 'Invalid email/ID or password.');
    }

    // Fetch profile from public.profiles
    let profile = null;
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profileData) {
        // If user is in Supabase Auth but profile table row is missing, check demo fallback
        const demoSession = tryDemoLogin();
        if (demoSession) return demoSession;

        await supabase.auth.signOut();
        throw new Error('Your account profile could not be found. Please contact the administrator.');
      }
      profile = profileData;
    } catch (err) {
      const demoSession = tryDemoLogin();
      if (demoSession) return demoSession;

      await supabase.auth.signOut();
      if (err.message?.includes('Your account profile could not be found')) {
        throw err;
      }
      throw new Error('Your account profile could not be found. Please contact the administrator.');
    }

    // Check account status
    if (!isProfileActive(profile)) {
      await supabase.auth.signOut();
      throw new Error('Your account is currently inactive. Please contact the administrator.');
    }

    // Verify role matches selected role
    if (selectedRole && profile.role !== selectedRole) {
      await supabase.auth.signOut();
      throw new Error('This account does not belong to the selected role.');
    }

    return {
      user: data.user,
      profile,
      role: profile.role,
      session: data.session,
    };
  }

  // 3. Fallback Demo/Interactive Sandbox Mode (if Supabase not configured)
  const demoSession = tryDemoLogin();
  if (demoSession) return demoSession;

  throw new Error('Invalid email/ID or password.');
};

/**
 * Standard alias for login
 */
export const signIn = async (emailOrIdentifier, password, selectedRole) => {
  return login({ identifier: emailOrIdentifier, password, selectedRole });
};

// ============================================
// SIGN UP
// ============================================

export const signUp = async ({
  email,
  password,
  name,
  role = ROLES.STUDENT,
}) => {
  if (!email || !password || !name) {
    throw new Error('Name, email and password are required.');
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
          role,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Sandbox mode mock registration
  return {
    user: {
      id: 'usr_' + Date.now(),
      email: email.trim().toLowerCase(),
      user_metadata: { name: name.trim(), role }
    }
  };
};

// ============================================
// SESSION RESTORATION & GETTERS
// ============================================

/**
 * Restore stored session on page load / browser refresh
 */
export const getInitialSession = async () => {
  if (isSupabaseConfigured()) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Supabase getSession notice:', error.message);
      }

      if (session?.user) {
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && !profileErr && isProfileActive(profile)) {
          return {
            user: session.user,
            profile,
            role: profile.role,
            session
          };
        } else {
          // Stale, inactive, or profile missing — log out to prevent corrupted state
          await supabase.auth.signOut();
        }
      }
    } catch (e) {
      console.warn('Error verifying Supabase session:', e);
    }
  }

  // Check Local Storage Fallback
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.user && parsed?.profile && isProfileActive(parsed.profile)) {
        return parsed;
      }
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    }
  } catch (e) {
    console.warn('Error reading local stored session:', e);
  }

  return null;
};

/**
 * Alias for session retrieval
 */
export const getSession = async () => {
  return getInitialSession();
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  if (isSupabaseConfigured()) {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
  }
  const session = await getInitialSession();
  return session?.user || null;
};

/**
 * Get current user profile from public.profiles
 */
export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  if (isSupabaseConfigured()) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw new Error(error.message);
    return profile;
  }

  const session = await getInitialSession();
  return session?.profile || null;
};

// ============================================
// LOGOUT / SIGN OUT
// ============================================

export const logout = async () => {
  if (isSupabaseConfigured()) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
  return true;
};

export const signOut = async () => {
  return logout();
};

// ============================================
// PASSWORD RESET
// ============================================

export const sendPasswordReset = async (email) => {
  if (!email) {
    throw new Error('Please enter your email address.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (isSupabaseConfigured()) {
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  // Demo Mode Reset Simulation
  const exists = DEMO_USERS.some(u => u.email.toLowerCase() === normalizedEmail);
  if (!exists) {
    throw new Error('No registered account found with this email address.');
  }
  return true;
};

// ============================================
// AUTH STATE LISTENER
// ============================================

export const onAuthStateChange = (callback) => {
  if (isSupabaseConfigured() && supabase?.auth?.onAuthStateChange) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        callback(event, session);
      }
    );
    return subscription;
  }

  return {
    unsubscribe: () => {}
  };
};

// ============================================
// AUTH SERVICE OBJECT
// ============================================

export const authService = {
  resolveIdentifier,
  login,
  signIn,
  signUp,
  getInitialSession,
  getSession,
  getCurrentUser,
  getCurrentProfile,
  logout,
  signOut,
  sendPasswordReset,
  onAuthStateChange
};

export default authService;
