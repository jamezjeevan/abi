// User roles enum
export const ROLES = {
  ADMIN: 'admin',
  MANAGEMENT: 'management',
  FACULTY: 'faculty',
  STUDENT: 'student',
  COMPANY: 'company'
};

// Application status enum & configuration
export const APPLICATION_STATUS = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  ELIGIBLE: 'eligible',
  NOT_ELIGIBLE: 'not_eligible',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted'
};

export const STATUS_META = {
  applied: { label: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  screening: { label: 'AI Screening', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  eligible: { label: 'Eligible', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  not_eligible: { label: 'Not Eligible', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  shortlisted: { label: 'Shortlisted', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  rejected: { label: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  accepted: { label: 'Offer Extended', color: 'bg-green-50 text-green-700 border-green-200' },
};

// Role Portal Base Paths
export const ROLE_HOME_ROUTES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.MANAGEMENT]: '/management/dashboard',
  [ROLES.FACULTY]: '/faculty/dashboard',
  [ROLES.STUDENT]: '/student/dashboard',
  [ROLES.COMPANY]: '/company/dashboard',
};

// Role labels for display
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'System Administrator',
  [ROLES.MANAGEMENT]: 'College Management',
  [ROLES.FACULTY]: 'Faculty & Mentor',
  [ROLES.STUDENT]: 'Student',
  [ROLES.COMPANY]: 'Recruiter / Company',
};
