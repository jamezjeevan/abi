import { ROLES } from '../config/constants';
import { supabase, isSupabaseConfigured } from '../config/supabase';

const STORE_STORAGE_KEY = 'campus_connect_data_store_v1';

// Default Initial Seed Data matching the normalized PostgreSQL schema
const INITIAL_STORE = {
  profiles: [
    {
      id: '11111111-1111-1111-1111-111111111111',
      role: ROLES.ADMIN,
      full_name: 'System Administrator',
      email: 'admin123@gmail.com',
      is_active: true,
      created_at: new Date('2024-01-01').toISOString()
    },
    {
      id: '11111111-1111-1111-1111-111111111112',
      role: ROLES.ADMIN,
      full_name: 'Platform Ops Admin',
      email: 'admin@campusconnect.edu',
      is_active: true,
      created_at: new Date('2024-01-01').toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      role: ROLES.MANAGEMENT,
      full_name: 'Dean Dr. Arthur Vance',
      email: 'management@campusconnect.edu',
      is_active: true,
      created_at: new Date('2024-01-15').toISOString()
    },
    {
      id: '22222222-2222-2222-2222-222222222223',
      role: ROLES.MANAGEMENT,
      full_name: 'Dr. Eleanor Foster',
      email: 'eleanor.foster@campusconnect.edu',
      is_active: true,
      created_at: new Date('2024-02-01').toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      role: ROLES.FACULTY,
      full_name: 'Prof. Sarah Jenkins',
      email: 'faculty@campusconnect.edu',
      is_active: true,
      created_at: new Date('2024-02-10').toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333334',
      role: ROLES.FACULTY,
      full_name: 'Dr. Rajesh Raman',
      email: 'rajesh.raman@campusconnect.edu',
      is_active: true,
      created_at: new Date('2024-02-12').toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444444',
      role: ROLES.STUDENT,
      full_name: 'Alex Rivera',
      email: 'student@campusconnect.edu',
      is_active: true,
      created_at: new Date('2024-03-01').toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444445',
      role: ROLES.STUDENT,
      full_name: 'Priya Sharma',
      email: 'priya.sharma@campusconnect.edu',
      is_active: true,
      created_at: new Date('2024-03-05').toISOString()
    },
    {
      id: '55555555-5555-5555-5555-555555555555',
      role: ROLES.COMPANY,
      full_name: 'Nexus Technologies HR',
      email: 'company@nexus-tech.io',
      is_active: true,
      created_at: new Date('2024-02-20').toISOString()
    },
    {
      id: '55555555-5555-5555-5555-555555555556',
      role: ROLES.COMPANY,
      full_name: 'Quantum Innovations',
      email: 'careers@quantuminnovate.com',
      is_active: true,
      created_at: new Date('2024-02-25').toISOString()
    }
  ],

  management: [
    {
      id: 'mgt-001-uuid',
      user_id: '22222222-2222-2222-2222-222222222222',
      management_id: 'MGT-001',
      name: 'Dean Dr. Arthur Vance',
      email: 'management@campusconnect.edu',
      institution: 'St. Peter Institute of Technology',
      title: 'Dean of Academic & Corporate Affairs',
      phone: '+1 (555) 234-5678',
      is_active: true,
      created_by_admin: '11111111-1111-1111-1111-111111111111',
      created_at: new Date('2024-01-15').toISOString()
    },
    {
      id: 'mgt-002-uuid',
      user_id: '22222222-2222-2222-2222-222222222223',
      management_id: 'MGT-002',
      name: 'Dr. Eleanor Foster',
      email: 'eleanor.foster@campusconnect.edu',
      institution: 'St. Peter Institute of Technology',
      title: 'Director of Career Services & Governance',
      phone: '+1 (555) 321-9876',
      is_active: true,
      created_by_admin: '11111111-1111-1111-1111-111111111111',
      created_at: new Date('2024-02-01').toISOString()
    }
  ],

  faculty: [
    {
      id: 'fac-101-uuid',
      user_id: '33333333-3333-3333-3333-333333333333',
      faculty_id: 'FAC-CS-101',
      name: 'Prof. Sarah Jenkins',
      email: 'faculty@campusconnect.edu',
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 345-6789',
      is_active: true,
      created_by_management: 'mgt-001-uuid',
      created_at: new Date('2024-02-10').toISOString()
    },
    {
      id: 'fac-102-uuid',
      user_id: '33333333-3333-3333-3333-333333333334',
      faculty_id: 'FAC-ECE-202',
      name: 'Dr. Rajesh Raman',
      email: 'rajesh.raman@campusconnect.edu',
      department: 'Electronics & Communication',
      phone: '+1 (555) 876-5432',
      is_active: true,
      created_by_management: 'mgt-001-uuid',
      created_at: new Date('2024-02-12').toISOString()
    }
  ],

  students: [
    {
      id: 'stu-088-uuid',
      user_id: '44444444-4444-4444-4444-444444444444',
      register_number: 'REG2024CS088',
      name: 'Alex Rivera',
      email: 'student@campusconnect.edu',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 4,
      semester: 8,
      cgpa: 8.92,
      phone: '+1 (555) 456-7890',
      skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Git', 'Tailwind CSS', 'Docker'],
      resume_name: 'Alex_Rivera_Software_Resume.pdf',
      resume_url: '#demo-resume-alex',
      resume_text: 'Alex Rivera - Full Stack Developer with experience in React, JavaScript, Node.js, PostgreSQL, Git, Tailwind CSS, REST APIs, and Docker. CGPA 8.92, Computer Science.',
      mentor_id: 'fac-101-uuid',
      mentor_name: 'Prof. Sarah Jenkins',
      profile_status: 'Verified',
      created_by: 'fac-101-uuid',
      created_at: new Date('2024-03-01').toISOString()
    },
    {
      id: 'stu-089-uuid',
      user_id: '44444444-4444-4444-4444-444444444445',
      register_number: 'REG2024CS089',
      name: 'Priya Sharma',
      email: 'priya.sharma@campusconnect.edu',
      department: 'Computer Science & Engineering',
      course: 'B.Tech Computer Science',
      year: 4,
      semester: 8,
      cgpa: 9.35,
      phone: '+1 (555) 567-8901',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'FastAPI', 'SQL', 'React'],
      resume_name: 'Priya_Sharma_AI_Resume.pdf',
      resume_url: '#demo-resume-priya',
      resume_text: 'Priya Sharma - AI/ML Researcher & Developer. Skills: Python, Machine Learning, Deep Learning, TensorFlow, FastAPI, SQL. CGPA 9.35.',
      mentor_id: 'fac-101-uuid',
      mentor_name: 'Prof. Sarah Jenkins',
      profile_status: 'Verified',
      created_by: 'fac-101-uuid',
      created_at: new Date('2024-03-05').toISOString()
    }
  ],

  companies: [
    {
      id: 'comp-001-uuid',
      user_id: '55555555-5555-5555-5555-555555555555',
      company_name: 'Nexus Technologies',
      email: 'company@nexus-tech.io',
      industry: 'Artificial Intelligence & Cloud Systems',
      website: 'https://nexus-tech.io',
      location: 'San Francisco, CA (Hybrid)',
      description: 'Enterprise AI and distributed systems scaling infrastructure for global applications.',
      is_active: true,
      created_by_admin: '11111111-1111-1111-1111-111111111111',
      created_at: new Date('2024-02-20').toISOString()
    },
    {
      id: 'comp-002-uuid',
      user_id: '55555555-5555-5555-5555-555555555556',
      company_name: 'Quantum Innovations',
      email: 'careers@quantuminnovate.com',
      industry: 'FinTech & High-Frequency Systems',
      website: 'https://quantuminnovate.com',
      location: 'New York, NY (On-site)',
      description: 'Next-generation quantitative trading and financial infrastructure platform.',
      is_active: true,
      created_by_admin: '11111111-1111-1111-1111-111111111111',
      created_at: new Date('2024-02-25').toISOString()
    }
  ],

  jobs: [
    {
      id: 'job-001-uuid',
      company_id: 'comp-001-uuid',
      company_name: 'Nexus Technologies',
      job_title: 'Junior Full Stack Engineer',
      description: 'Join our flagship web infrastructure group building scalable micro-frontends with React, TypeScript, and high-performance Node.js/PostgreSQL microservices.',
      location: 'San Francisco, CA (Hybrid)',
      salary: '$95,000 - $115,000 / yr',
      employment_type: 'full_time',
      required_skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Git', 'Docker'],
      eligibility: 'Minimum 7.50 CGPA, B.E / B.Tech Computer Science or Information Technology',
      minimum_cgpa: 7.50,
      allowed_departments: ['Computer Science & Engineering', 'Information Technology'],
      graduation_year: 2024,
      experience: '0-1 years / Fresh Graduate',
      deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'published',
      created_at: new Date('2024-03-02').toISOString()
    },
    {
      id: 'job-002-uuid',
      company_id: 'comp-001-uuid',
      company_name: 'Nexus Technologies',
      job_title: 'Cloud DevOps Associate',
      description: 'Automate deployment pipelines, Docker container orchestration, and Kubernetes clusters supporting millions of cloud transactions.',
      location: 'Remote',
      salary: '$90,000 - $110,000 / yr',
      employment_type: 'full_time',
      required_skills: ['Docker', 'Kubernetes', 'Linux', 'AWS', 'Git', 'Python'],
      eligibility: 'Minimum 7.00 CGPA, All Engineering Branches',
      minimum_cgpa: 7.00,
      allowed_departments: ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'],
      graduation_year: 2024,
      experience: 'Fresh Graduate',
      deadline: new Date(Date.now() + 25 * 86400000).toISOString(),
      status: 'published',
      created_at: new Date('2024-03-04').toISOString()
    },
    {
      id: 'job-003-uuid',
      company_id: 'comp-002-uuid',
      company_name: 'Quantum Innovations',
      job_title: 'AI/ML Engineering Intern',
      description: 'Develop algorithmic models, data ingestion pipelines, and automated feature extraction systems using Python and PyTorch.',
      location: 'New York, NY (Hybrid)',
      salary: '$45 / hr ($85,000 annualized)',
      employment_type: 'internship',
      required_skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'FastAPI'],
      eligibility: 'Minimum 8.00 CGPA, CSE or Data Science',
      minimum_cgpa: 8.00,
      allowed_departments: ['Computer Science & Engineering'],
      graduation_year: 2024,
      experience: 'Internship / Student',
      deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
      status: 'published',
      created_at: new Date('2024-03-06').toISOString()
    }
  ],

  applications: [
    {
      id: 'app-001-uuid',
      job_id: 'job-001-uuid',
      student_id: 'stu-088-uuid',
      student_name: 'Alex Rivera',
      register_number: 'REG2024CS088',
      department: 'Computer Science & Engineering',
      cgpa: 8.92,
      skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Git', 'Tailwind CSS', 'Docker'],
      resume_name: 'Alex_Rivera_Software_Resume.pdf',
      resume_url: '#demo-resume-alex',
      job_title: 'Junior Full Stack Engineer',
      company_name: 'Nexus Technologies',
      company_id: 'comp-001-uuid',
      mentor_id: 'fac-101-uuid',
      status: 'shortlisted', // Applied, AI Screening, Qualified, Rejected, Under Review, Shortlisted, Interview, Selected, Not Selected
      ai_match_score: 95,
      eligibility: 'Qualified',
      ai_analysis: {
        match_score: 95,
        eligibility_status: 'Qualified',
        matching_skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL', 'Git', 'Docker'],
        missing_skills: [],
        explanation: 'Excellent candidate profile: CGPA 8.92 exceeds minimum 7.50 threshold. Student possesses 100% of required technical skills including React, Node.js, and PostgreSQL.'
      },
      applied_at: new Date('2024-03-03T10:00:00Z').toISOString(),
      updated_at: new Date('2024-03-05T14:30:00Z').toISOString()
    }
  ],

  notifications: [
    {
      id: 'notif-001',
      user_id: '44444444-4444-4444-4444-444444444444', // Alex Rivera
      type: 'SHORTLISTED',
      title: 'Application Shortlisted!',
      message: 'Nexus Technologies shortlisted your application for Junior Full Stack Engineer.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'notif-002',
      user_id: '55555555-5555-5555-5555-555555555555', // Nexus Tech
      type: 'ELIGIBLE',
      title: 'New Eligible Applicant Received',
      message: 'Alex Rivera (REG2024CS088) applied for Junior Full Stack Engineer with a 95% AI Match Score.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
      id: 'notif-003',
      user_id: '33333333-3333-3333-3333-333333333333', // Prof. Jenkins
      type: 'SHORTLISTED',
      title: 'Mentee Placement Progress',
      message: 'Your mentee Alex Rivera has been shortlisted by Nexus Technologies.',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],

  conversations: [
    {
      id: 'conv-001',
      title: 'Academic & Placement Mentoring',
      is_group: false,
      participants: [
        { user_id: '44444444-4444-4444-4444-444444444444', name: 'Alex Rivera', role: 'student' },
        { user_id: '33333333-3333-3333-3333-333333333333', name: 'Prof. Sarah Jenkins', role: 'faculty' }
      ],
      created_at: new Date('2024-03-01').toISOString(),
      updated_at: new Date('2024-03-06T12:00:00Z').toISOString()
    },
    {
      id: 'conv-002',
      title: 'Department Placement Review',
      is_group: false,
      participants: [
        { user_id: '33333333-3333-3333-3333-333333333333', name: 'Prof. Sarah Jenkins', role: 'faculty' },
        { user_id: '22222222-2222-2222-2222-222222222222', name: 'Dean Dr. Arthur Vance', role: 'management' }
      ],
      created_at: new Date('2024-03-02').toISOString(),
      updated_at: new Date('2024-03-06T15:30:00Z').toISOString()
    }
  ],

  messages: [
    {
      id: 'msg-001',
      conversation_id: 'conv-001',
      sender_id: '33333333-3333-3333-3333-333333333333',
      sender_name: 'Prof. Sarah Jenkins',
      content: 'Alex, your resume for Nexus Technologies looks solid. Make sure you revise Docker container fundamentals and indexing in PostgreSQL before any technical rounds.',
      created_at: new Date('2024-03-05T09:15:00Z').toISOString(),
      is_read: true
    },
    {
      id: 'msg-002',
      conversation_id: 'conv-001',
      sender_id: '44444444-4444-4444-4444-444444444444',
      sender_name: 'Alex Rivera',
      content: 'Thank you, Prof. Jenkins! I am reviewing the system design notes you shared. I noticed Nexus Technologies shortlisted my profile today!',
      created_at: new Date('2024-03-05T10:45:00Z').toISOString(),
      is_read: true
    },
    {
      id: 'msg-003',
      conversation_id: 'conv-002',
      sender_id: '22222222-2222-2222-2222-222222222222',
      sender_name: 'Dean Dr. Arthur Vance',
      content: 'Prof. Jenkins, how is the CSE batch preparation for the upcoming Nexus Technologies & Quantum Innovations campus drives?',
      created_at: new Date('2024-03-06T14:10:00Z').toISOString(),
      is_read: true
    },
    {
      id: 'msg-004',
      conversation_id: 'conv-002',
      sender_id: '33333333-3333-3333-3333-333333333333',
      sender_name: 'Prof. Sarah Jenkins',
      content: 'Dean Vance, 94% of eligible CSE students have completed their AI resume screening. Several students have already qualified for initial technical rounds.',
      created_at: new Date('2024-03-06T15:30:00Z').toISOString(),
      is_read: false
    }
  ]
};

// Helper: load stored state or initialize
function getStoredStore() {
  try {
    const raw = localStorage.getItem(STORE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Could not read campusConnectStore from localStorage:', e);
  }
  localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(INITIAL_STORE));
  return JSON.parse(JSON.stringify(INITIAL_STORE));
}

// In-memory working copy
let store = getStoredStore();

// Subscribers for reactive UI updates
const subscribers = new Set();

function notifySubscribers() {
  try {
    localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving store to localStorage:', e);
  }
  subscribers.forEach(cb => {
    try {
      cb(store);
    } catch (err) {
      console.error('Subscriber notification error:', err);
    }
  });
}

export const campusStore = {
  getStore() {
    return store;
  },

  subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  },

  resetToDefault() {
    store = JSON.parse(JSON.stringify(INITIAL_STORE));
    notifySubscribers();
    return store;
  },

  // ----------------------------------------------------
  // ADMIN OPERATIONS
  // ----------------------------------------------------
  getAdminStats() {
    return {
      totalManagement: store.management.length,
      activeManagement: store.management.filter(m => m.is_active !== false).length,
      totalCompanies: store.companies.length,
      activeCompanies: store.companies.filter(c => c.is_active !== false).length,
      totalStudents: store.students.length,
      totalFaculty: store.faculty.length,
      activeRecruitments: store.jobs.filter(j => j.status === 'published').length,
      totalApplications: store.applications.length
    };
  },

  getManagementList() {
    return [...store.management];
  },

  createManagementAccount({ name, email, management_id, title, institution, phone, password }) {
    // Check duplicates
    if (store.management.some(m => m.email.toLowerCase() === email.toLowerCase() || m.management_id.toUpperCase() === management_id.toUpperCase())) {
      throw new Error(`Management account with ID "${management_id}" or email "${email}" already exists.`);
    }

    const newUserId = 'user-' + Date.now();
    const newMgtId = 'mgt-' + Date.now();

    const newProfile = {
      id: newUserId,
      role: ROLES.MANAGEMENT,
      full_name: name,
      email: email.toLowerCase(),
      is_active: true,
      created_at: new Date().toISOString()
    };

    const newManagement = {
      id: newMgtId,
      user_id: newUserId,
      management_id: management_id.toUpperCase(),
      name,
      email: email.toLowerCase(),
      title: title || 'Dean of Administration',
      institution: institution || 'CampusConnect University',
      phone: phone || '',
      is_active: true,
      password: password || 'password123',
      created_at: new Date().toISOString()
    };

    store.profiles.push(newProfile);
    store.management.push(newManagement);
    notifySubscribers();
    return newManagement;
  },

  updateManagementAccount(id, updates) {
    const idx = store.management.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Management account not found.');
    store.management[idx] = { ...store.management[idx], ...updates, updated_at: new Date().toISOString() };
    
    // Also update associated profile full_name if name changed
    if (updates.name) {
      const pIdx = store.profiles.findIndex(p => p.id === store.management[idx].user_id);
      if (pIdx !== -1) store.profiles[pIdx].full_name = updates.name;
    }

    notifySubscribers();
    return store.management[idx];
  },

  toggleManagementStatus(id) {
    const idx = store.management.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Management account not found.');
    const newStatus = !store.management[idx].is_active;
    store.management[idx].is_active = newStatus;

    const pIdx = store.profiles.findIndex(p => p.id === store.management[idx].user_id);
    if (pIdx !== -1) store.profiles[pIdx].is_active = newStatus;

    notifySubscribers();
    return store.management[idx];
  },

  getCompanyList() {
    return [...store.companies];
  },

  createCompanyAccount({ company_name, email, industry, website, location, description, password }) {
    if (store.companies.some(c => c.email.toLowerCase() === email.toLowerCase() || c.company_name.toLowerCase() === company_name.toLowerCase())) {
      throw new Error(`Company with name "${company_name}" or email "${email}" already exists.`);
    }

    const newUserId = 'user-comp-' + Date.now();
    const newCompId = 'comp-' + Date.now();

    const newProfile = {
      id: newUserId,
      role: ROLES.COMPANY,
      full_name: company_name,
      email: email.toLowerCase(),
      is_active: true,
      created_at: new Date().toISOString()
    };

    const newCompany = {
      id: newCompId,
      user_id: newUserId,
      company_name,
      email: email.toLowerCase(),
      industry: industry || 'Technology & Innovation',
      website: website || 'https://example.com',
      location: location || 'Campus Placement Partner',
      description: description || 'Verified Corporate Partner',
      is_active: true,
      password: password || 'password123',
      created_at: new Date().toISOString()
    };

    store.profiles.push(newProfile);
    store.companies.push(newCompany);
    notifySubscribers();
    return newCompany;
  },

  updateCompanyAccount(id, updates) {
    const idx = store.companies.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Company account not found.');
    store.companies[idx] = { ...store.companies[idx], ...updates, updated_at: new Date().toISOString() };

    if (updates.company_name) {
      const pIdx = store.profiles.findIndex(p => p.id === store.companies[idx].user_id);
      if (pIdx !== -1) store.profiles[pIdx].full_name = updates.company_name;
    }

    notifySubscribers();
    return store.companies[idx];
  },

  toggleCompanyStatus(id) {
    const idx = store.companies.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Company account not found.');
    const newStatus = !store.companies[idx].is_active;
    store.companies[idx].is_active = newStatus;

    const pIdx = store.profiles.findIndex(p => p.id === store.companies[idx].user_id);
    if (pIdx !== -1) store.profiles[pIdx].is_active = newStatus;

    notifySubscribers();
    return store.companies[idx];
  },

  // ----------------------------------------------------
  // COLLEGE MANAGEMENT OPERATIONS
  // ----------------------------------------------------
  getFacultyList() {
    return [...store.faculty];
  },

  createFacultyAccount({ name, email, faculty_id, department, phone, password, managementId }) {
    if (store.faculty.some(f => f.email.toLowerCase() === email.toLowerCase() || f.faculty_id.toUpperCase() === faculty_id.toUpperCase())) {
      throw new Error(`Faculty member with ID "${faculty_id}" or email "${email}" already exists.`);
    }

    const newUserId = 'user-fac-' + Date.now();
    const newFacId = 'fac-' + Date.now();

    const newProfile = {
      id: newUserId,
      role: ROLES.FACULTY,
      full_name: name,
      email: email.toLowerCase(),
      is_active: true,
      created_at: new Date().toISOString()
    };

    const newFaculty = {
      id: newFacId,
      user_id: newUserId,
      faculty_id: faculty_id.toUpperCase(),
      name,
      email: email.toLowerCase(),
      department: department || 'Computer Science & Engineering',
      phone: phone || '',
      created_by_management: managementId || 'mgt-001-uuid',
      is_active: true,
      password: password || 'password123',
      created_at: new Date().toISOString()
    };

    store.profiles.push(newProfile);
    store.faculty.push(newFaculty);
    notifySubscribers();
    return newFaculty;
  },

  updateFaculty(id, updates) {
    const idx = store.faculty.findIndex(f => f.id === id);
    if (idx === -1) throw new Error('Faculty account not found.');
    store.faculty[idx] = { ...store.faculty[idx], ...updates, updated_at: new Date().toISOString() };

    if (updates.name) {
      const pIdx = store.profiles.findIndex(p => p.id === store.faculty[idx].user_id);
      if (pIdx !== -1) store.profiles[pIdx].full_name = updates.name;
    }

    notifySubscribers();
    return store.faculty[idx];
  },

  toggleFacultyStatus(id) {
    const idx = store.faculty.findIndex(f => f.id === id);
    if (idx === -1) throw new Error('Faculty not found.');
    const newStatus = !store.faculty[idx].is_active;
    store.faculty[idx].is_active = newStatus;

    const pIdx = store.profiles.findIndex(p => p.id === store.faculty[idx].user_id);
    if (pIdx !== -1) store.profiles[pIdx].is_active = newStatus;

    notifySubscribers();
    return store.faculty[idx];
  },

  getStudentsThroughFaculty() {
    // Management views students organized through faculty relationships
    return store.students.map(s => {
      const facultyObj = store.faculty.find(f => f.id === s.mentor_id);
      const studentApps = store.applications.filter(a => a.student_id === s.id);
      return {
        ...s,
        faculty_name: facultyObj ? facultyObj.name : (s.mentor_name || 'Assigned Faculty'),
        faculty_email: facultyObj ? facultyObj.email : '',
        total_applications: studentApps.length,
        placement_status: studentApps.some(a => a.status === 'accepted' || a.status === 'selected') 
          ? 'Placed' 
          : studentApps.some(a => a.status === 'shortlisted' || a.status === 'interview') 
            ? 'In Interview / Shortlisted' 
            : 'Active Applicant'
      };
    });
  },

  // ----------------------------------------------------
  // FACULTY OPERATIONS (Mentor Students)
  // ----------------------------------------------------
  getFacultyStudents(facultyIdOrUserId) {
    // Look up faculty record by user_id or id
    const fac = store.faculty.find(f => f.id === facultyIdOrUserId || f.user_id === facultyIdOrUserId);
    const facId = fac ? fac.id : facultyIdOrUserId;

    return store.students
      .filter(s => s.mentor_id === facId || s.created_by === facId)
      .map(s => {
        const apps = store.applications.filter(a => a.student_id === s.id);
        return {
          ...s,
          applications_count: apps.length,
          placement_status: apps.some(a => a.status === 'accepted' || a.status === 'selected') 
            ? 'Placed' 
            : apps.some(a => a.status === 'shortlisted' || a.status === 'interview') 
              ? 'In Interview' 
              : 'Registered'
        };
      });
  },

  createStudentAccount({
    facultyId,
    facultyName,
    register_number,
    name,
    email,
    department,
    course,
    year,
    semester,
    cgpa,
    phone,
    skills,
    password
  }) {
    if (store.students.some(s => s.register_number.toUpperCase() === register_number.toUpperCase() || s.email.toLowerCase() === email.toLowerCase())) {
      throw new Error(`Student with Register Number "${register_number}" or email "${email}" already exists.`);
    }

    const newUserId = 'user-stu-' + Date.now();
    const newStuId = 'stu-' + Date.now();

    const parsedSkills = Array.isArray(skills) 
      ? skills 
      : (skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : ['JavaScript', 'Problem Solving']);

    const newProfile = {
      id: newUserId,
      role: ROLES.STUDENT,
      full_name: name,
      email: email.toLowerCase(),
      is_active: true,
      created_at: new Date().toISOString()
    };

    const newStudent = {
      id: newStuId,
      user_id: newUserId,
      register_number: register_number.toUpperCase(),
      name,
      email: email.toLowerCase(),
      department: department || 'Computer Science & Engineering',
      course: course || 'B.Tech Computer Science',
      year: parseInt(year, 10) || 4,
      semester: parseInt(semester, 10) || 8,
      cgpa: parseFloat(cgpa) || 7.50,
      phone: phone || '',
      skills: parsedSkills,
      resume_name: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
      resume_url: '#resume-auto',
      resume_text: `${name} - Student at ${department}. Skills: ${parsedSkills.join(', ')}. CGPA: ${cgpa}. Course: ${course}.`,
      // Hierarchical assignment: Creator faculty automatically becomes student's mentor
      mentor_id: facultyId || 'fac-101-uuid',
      mentor_name: facultyName || 'Prof. Sarah Jenkins',
      profile_status: 'Verified',
      created_by: facultyId || 'fac-101-uuid',
      password: password || 'password123',
      created_at: new Date().toISOString()
    };

    store.profiles.push(newProfile);
    store.students.push(newStudent);

    // Auto-create initial mentoring conversation
    const convId = 'conv-' + Date.now();
    store.conversations.push({
      id: convId,
      title: `${name} & ${facultyName || 'Mentor'} Mentoring`,
      is_group: false,
      participants: [
        { user_id: newUserId, name, role: 'student' },
        { user_id: facultyId, name: facultyName || 'Mentor', role: 'faculty' }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    store.messages.push({
      id: 'msg-' + Date.now(),
      conversation_id: convId,
      sender_id: facultyId,
      sender_name: facultyName || 'Mentor',
      content: `Welcome to CampusConnect, ${name}! I am your faculty mentor. Feel free to reach out here regarding placements and academic advice.`,
      created_at: new Date().toISOString(),
      is_read: false
    });

    notifySubscribers();
    return newStudent;
  },

  updateStudentDetails(id, updates) {
    const idx = store.students.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Student not found.');
    store.students[idx] = { ...store.students[idx], ...updates, updated_at: new Date().toISOString() };

    if (updates.name) {
      const pIdx = store.profiles.findIndex(p => p.id === store.students[idx].user_id);
      if (pIdx !== -1) store.profiles[pIdx].full_name = updates.name;
    }

    notifySubscribers();
    return store.students[idx];
  },

  getFacultyMenteeApplications(facultyId) {
    const menteeStudentIds = store.students
      .filter(s => s.mentor_id === facultyId || s.created_by === facultyId)
      .map(s => s.id);

    return store.applications.filter(a => menteeStudentIds.includes(a.student_id));
  },

  // ----------------------------------------------------
  // STUDENT OPERATIONS
  // ----------------------------------------------------
  getStudentByUserId(userId) {
    return store.students.find(s => s.user_id === userId) || store.students[0];
  },

  updateStudentSelfProfile(studentId, updates) {
    return this.updateStudentDetails(studentId, updates);
  },

  getStudentMentor(mentorId) {
    const fac = store.faculty.find(f => f.id === mentorId);
    if (fac) return fac;
    return {
      name: 'Prof. Sarah Jenkins',
      email: 'faculty@campusconnect.edu',
      department: 'Computer Science & Engineering',
      phone: '+1 (555) 345-6789'
    };
  },

  getStudentApplications(studentId) {
    return store.applications.filter(a => a.student_id === studentId);
  },

  uploadStudentResume(studentId, { fileName, skills, resumeText }) {
    const idx = store.students.findIndex(s => s.id === studentId);
    if (idx === -1) throw new Error('Student not found.');

    store.students[idx].resume_name = fileName;
    store.students[idx].resume_url = '#resume-' + Date.now();
    if (skills && skills.length > 0) {
      store.students[idx].skills = skills;
    }
    if (resumeText) {
      store.students[idx].resume_text = resumeText;
    }
    store.students[idx].updated_at = new Date().toISOString();

    notifySubscribers();
    return store.students[idx];
  },

  // ----------------------------------------------------
  // COMPANY & RECRUITMENT OPERATIONS
  // ----------------------------------------------------
  getCompanyByUserId(userId) {
    return store.companies.find(c => c.user_id === userId) || store.companies[0];
  },

  getCompanyJobs(companyId) {
    return store.jobs.filter(j => j.company_id === companyId);
  },

  createRecruitmentJob({
    company_id,
    company_name,
    job_title,
    description,
    location,
    salary,
    employment_type,
    required_skills,
    eligibility,
    minimum_cgpa,
    allowed_departments,
    graduation_year,
    experience,
    deadline
  }) {
    const newJobId = 'job-' + Date.now();
    const newJob = {
      id: newJobId,
      company_id,
      company_name,
      job_title,
      description,
      location: location || 'Remote / Hybrid',
      salary: salary || 'Competitive Package',
      employment_type: employment_type || 'full_time',
      required_skills: Array.isArray(required_skills) ? required_skills : (required_skills || '').split(',').map(s => s.trim()).filter(Boolean),
      eligibility: eligibility || `Minimum ${minimum_cgpa || '7.0'} CGPA`,
      minimum_cgpa: parseFloat(minimum_cgpa) || 7.00,
      allowed_departments: Array.isArray(allowed_departments) ? allowed_departments : (allowed_departments || 'Computer Science & Engineering').split(',').map(d => d.trim()).filter(Boolean),
      graduation_year: parseInt(graduation_year, 10) || 2024,
      experience: experience || 'Fresh Graduate',
      deadline: deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'published',
      created_at: new Date().toISOString()
    };

    store.jobs.unshift(newJob);

    // Broadcast notification to eligible students
    store.students.forEach(stu => {
      store.notifications.push({
        id: 'notif-' + Date.now() + '-' + stu.id.slice(-4),
        user_id: stu.user_id,
        type: 'NEW_JOB',
        title: `New Drive: ${company_name}`,
        message: `${company_name} is hiring for "${job_title}". Deadline: ${new Date(newJob.deadline).toLocaleDateString()}.`,
        reference_id: newJobId,
        is_read: false,
        created_at: new Date().toISOString()
      });
    });

    notifySubscribers();
    return newJob;
  },

  getCompanyApplicants(companyId) {
    return store.applications.filter(a => a.company_id === companyId);
  },

  updateApplicationStatus(applicationId, newStatus) {
    const idx = store.applications.findIndex(a => a.id === applicationId);
    if (idx === -1) throw new Error('Application not found.');
    const app = store.applications[idx];
    app.status = newStatus;
    app.updated_at = new Date().toISOString();

    // Trigger Notification for Student
    const student = store.students.find(s => s.id === app.student_id);
    if (student) {
      store.notifications.push({
        id: 'notif-status-' + Date.now(),
        user_id: student.user_id,
        type: newStatus.toUpperCase().replace(/\s+/g, '_'),
        title: `Application Update: ${app.job_title}`,
        message: `${app.company_name} updated your application status to "${newStatus.toUpperCase()}".`,
        is_read: false,
        created_at: new Date().toISOString()
      });

      // Also notify Faculty Mentor
      if (student.mentor_id) {
        const fac = store.faculty.find(f => f.id === student.mentor_id);
        if (fac) {
          store.notifications.push({
            id: 'notif-fac-' + Date.now(),
            user_id: fac.user_id,
            type: 'SHORTLISTED',
            title: `Mentee Status Update`,
            message: `${student.name} was moved to "${newStatus.toUpperCase()}" by ${app.company_name}.`,
            is_read: false,
            created_at: new Date().toISOString()
          });
        }
      }
    }

    notifySubscribers();
    return app;
  },

  // ----------------------------------------------------
  // HARD ELIGIBILITY VERIFICATION (STEP 6)
  // ----------------------------------------------------
  submitApplicationHardEligible({ studentId, jobId, eligibility }) {
    const student = store.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student profile not found.');

    const job = store.jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Recruitment post not found.');

    // Check existing application
    const existing = store.applications.find(a => a.job_id === jobId && a.student_id === studentId);
    if (existing) {
      throw new Error('You have already submitted an application for this recruitment.');
    }

    if (!eligibility || !eligibility.isEligible) {
      const msg = eligibility?.reasons?.join(' ') || 'Student does not meet hard eligibility criteria.';
      throw new Error(`Hard eligibility check failed: ${msg}`);
    }

    const newApplication = {
      id: 'app-' + Date.now(),
      job_id: jobId,
      student_id: studentId,
      student_name: student.name,
      register_number: student.register_number,
      department: student.department,
      cgpa: student.cgpa,
      year: student.year,
      skills: student.skills || [],
      resume_name: student.resume_name || 'Resume.pdf',
      resume_url: student.resume_url || '#resume',
      job_title: job.job_title,
      company_name: job.company_name,
      company_id: job.company_id,
      mentor_id: student.mentor_id,
      status: 'eligible', // Step 6: Hard eligibility verified
      ai_match_score: null, // Zero Gemini dependency in Step 6
      eligibility: 'Eligible (Hard Check Passed)',
      ai_analysis: {
        stage: 'hard_eligibility_passed',
        hard_eligibility: eligibility,
        verified_at: new Date().toISOString()
      },
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.applications.unshift(newApplication);

    // Notify Student of eligibility clearance
    store.notifications.push({
      id: 'notif-stu-' + Date.now(),
      user_id: student.user_id,
      type: 'ELIGIBLE',
      title: 'Hard Eligibility Verified',
      message: `You meet all deterministic criteria for ${job.job_title} at ${job.company_name}. Prepared for Gemini Matching.`,
      reference_id: newApplication.id,
      is_read: false,
      created_at: new Date().toISOString()
    });

    notifySubscribers();
    return {
      application: newApplication,
      eligibility,
      message: 'Hard eligibility verified. Application prepared for Gemini Resume Matching.'
    };
  },

  // ----------------------------------------------------
  // AI RESUME MATCHING & APPLICATION SUBMISSION
  // ----------------------------------------------------
  submitApplicationWithAI({ studentId, jobId }) {
    const student = store.students.find(s => s.id === studentId);
    if (!student) throw new Error('Student profile not found.');

    const job = store.jobs.find(j => j.id === jobId);
    if (!job) throw new Error('Recruitment post not found.');

    // Check existing application
    const existing = store.applications.find(a => a.job_id === jobId && a.student_id === studentId);
    if (existing) {
      throw new Error('You have already submitted an application for this recruitment.');
    }

    // 1. Deterministic Programmatic Checks
    const cgpaPass = (student.cgpa || 0) >= (job.minimum_cgpa || 0);
    const deptPass = !job.allowed_departments || job.allowed_departments.length === 0 || 
      job.allowed_departments.some(d => d.toLowerCase() === (student.department || '').toLowerCase());
    const yearPass = !job.graduation_year || student.year === job.graduation_year || (student.year === 4 && job.graduation_year === 2024);

    const isDeterministicEligible = cgpaPass && deptPass;

    // 2. AI Skill Matching Analysis
    const studentSkills = (student.skills || []).map(s => s.toLowerCase());
    const jobSkills = (job.required_skills || []).map(s => s.toLowerCase());

    const matchingSkills = job.required_skills.filter(req => 
      studentSkills.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))
    );

    const missingSkills = job.required_skills.filter(req => 
      !studentSkills.some(s => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))
    );

    // Compute skill match ratio
    const skillRatio = jobSkills.length > 0 ? (matchingSkills.length / jobSkills.length) : 1;
    let baseScore = Math.round(skillRatio * 75) + 15; // base 15-90%

    // Bonus for high CGPA
    if (student.cgpa >= 8.5) baseScore += 8;
    else if (student.cgpa >= 7.5) baseScore += 5;

    const matchScore = Math.min(Math.max(baseScore, 20), 98);

    let eligibilityResult = 'Qualified';
    let explanation = '';

    if (!cgpaPass) {
      eligibilityResult = 'Not Qualified (CGPA Below Cutoff)';
      explanation = `Student CGPA (${student.cgpa}) does not meet the minimum requirement of ${job.minimum_cgpa}.`;
    } else if (!deptPass) {
      eligibilityResult = 'Not Qualified (Department Mismatch)';
      explanation = `Student department (${student.department}) is not included in eligible departments list.`;
    } else if (matchScore >= 75) {
      eligibilityResult = 'Qualified';
      explanation = `Strong applicant profile with high skill synergy (${matchScore}% match). Possesses ${matchingSkills.length}/${job.required_skills.length} core competencies.`;
    } else if (matchScore >= 50) {
      eligibilityResult = 'Borderline Qualified';
      explanation = `Eligible by academics, but missing key competencies (${missingSkills.join(', ')}).`;
    } else {
      eligibilityResult = 'Low Skill Match';
      explanation = `Academic criteria satisfied, but candidate profile lacks majority of required competencies (${missingSkills.join(', ')}).`;
    }

    const applicationStatus = isDeterministicEligible && matchScore >= 60 ? 'applied' : 'screening';

    const newApplication = {
      id: 'app-' + Date.now(),
      job_id: jobId,
      student_id: studentId,
      student_name: student.name,
      register_number: student.register_number,
      department: student.department,
      cgpa: student.cgpa,
      skills: student.skills || [],
      resume_name: student.resume_name || 'Resume.pdf',
      resume_url: student.resume_url || '#resume',
      job_title: job.job_title,
      company_name: job.company_name,
      company_id: job.company_id,
      mentor_id: student.mentor_id,
      status: applicationStatus,
      ai_match_score: matchScore,
      eligibility: eligibilityResult,
      ai_analysis: {
        match_score: matchScore,
        eligibility_status: eligibilityResult,
        matching_skills: matchingSkills,
        missing_skills: missingSkills,
        explanation
      },
      applied_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.applications.unshift(newApplication);

    // If eligible, notify Company
    if (isDeterministicEligible) {
      const comp = store.companies.find(c => c.id === job.company_id);
      if (comp) {
        store.notifications.push({
          id: 'notif-comp-' + Date.now(),
          user_id: comp.user_id,
          type: 'ELIGIBLE',
          title: 'New Eligible Applicant Received',
          message: `${student.name} (${student.register_number}) applied for ${job.job_title} with AI Match Score ${matchScore}%.`,
          reference_id: newApplication.id,
          is_read: false,
          created_at: new Date().toISOString()
        });
      }
    }

    // Notify Student
    store.notifications.push({
      id: 'notif-stu-' + Date.now(),
      user_id: student.user_id,
      type: 'AI_SCREENING_COMPLETED',
      title: 'Application & AI Screening Completed',
      message: `Your application for ${job.job_title} at ${job.company_name} was processed. AI Match Score: ${matchScore}% (${eligibilityResult}).`,
      reference_id: newApplication.id,
      is_read: false,
      created_at: new Date().toISOString()
    });

    // Notify Faculty Mentor
    if (student.mentor_id) {
      const fac = store.faculty.find(f => f.id === student.mentor_id);
      if (fac) {
        store.notifications.push({
          id: 'notif-fac-app-' + Date.now(),
          user_id: fac.user_id,
          type: 'APPLICATION_SUBMITTED',
          title: 'Mentee Submitted Application',
          message: `${student.name} applied for ${job.job_title} at ${job.company_name} (AI Score: ${matchScore}%).`,
          reference_id: newApplication.id,
          is_read: false,
          created_at: new Date().toISOString()
        });
      }
    }

    notifySubscribers();
    return newApplication;
  },

  // ----------------------------------------------------
  // NOTIFICATIONS
  // ----------------------------------------------------
  getUserNotifications(userId) {
    return store.notifications
      .filter(n => n.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  markNotificationRead(notificationId) {
    const idx = store.notifications.findIndex(n => n.id === notificationId);
    if (idx !== -1) {
      store.notifications[idx].is_read = true;
      notifySubscribers();
    }
  },

  markAllNotificationsRead(userId) {
    store.notifications.forEach(n => {
      if (n.user_id === userId) n.is_read = true;
    });
    notifySubscribers();
  },

  // ----------------------------------------------------
  // MESSAGING & REALTIME CHAT
  // ----------------------------------------------------
  getUserConversations(userId) {
    return store.conversations.filter(c => 
      c.participants.some(p => p.user_id === userId)
    );
  },

  getConversationMessages(conversationId) {
    return store.messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  },

  sendMessage({ conversationId, senderId, senderName, content }) {
    if (!content || !content.trim()) return null;

    const newMsg = {
      id: 'msg-' + Date.now(),
      conversation_id: conversationId,
      sender_id: senderId,
      sender_name: senderName,
      content: content.trim(),
      created_at: new Date().toISOString(),
      is_read: false
    };

    store.messages.push(newMsg);

    // Update conversation timestamp
    const cIdx = store.conversations.findIndex(c => c.id === conversationId);
    if (cIdx !== -1) {
      store.conversations[cIdx].updated_at = new Date().toISOString();
    }

    // Send notification to other participants
    const conv = store.conversations.find(c => c.id === conversationId);
    if (conv) {
      conv.participants.forEach(p => {
        if (p.user_id !== senderId) {
          store.notifications.push({
            id: 'notif-msg-' + Date.now() + '-' + p.user_id.slice(-4),
            user_id: p.user_id,
            type: 'NEW_MESSAGE',
            title: `New Message from ${senderName}`,
            message: content.length > 50 ? content.slice(0, 50) + '...' : content,
            reference_id: conversationId,
            is_read: false,
            created_at: new Date().toISOString()
          });
        }
      });
    }

    notifySubscribers();
    return newMsg;
  },

  startOrGetDirectConversation({ userA, userB, title }) {
    // Check if direct conversation between userA and userB exists
    const existing = store.conversations.find(c => 
      !c.is_group && 
      c.participants.some(p => p.user_id === userA.id) &&
      c.participants.some(p => p.user_id === userB.id)
    );

    if (existing) return existing;

    const newConv = {
      id: 'conv-' + Date.now(),
      title: title || `${userA.name} & ${userB.name}`,
      is_group: false,
      participants: [
        { user_id: userA.id, name: userA.name, role: userA.role },
        { user_id: userB.id, name: userB.name, role: userB.role }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    store.conversations.push(newConv);
    notifySubscribers();
    return newConv;
  }
};
