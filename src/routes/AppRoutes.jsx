import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLES, ROLE_HOME_ROUTES } from '../config/constants';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { Unauthorized } from '../pages/auth/Unauthorized';
import { NotFound } from '../pages/NotFound';

// Student Pages
import { StudentDashboard } from '../pages/student/StudentDashboard';
import { 
  StudentJobs, 
  StudentApplications, 
  StudentResume, 
  StudentMentor, 
  StudentNotifications, 
  StudentMessages, 
  StudentProfile 
} from '../pages/student/StudentDashboard';

// Faculty Pages
import { 
  FacultyDashboard, 
  FacultyStudents, 
  FacultyApplications, 
  FacultyNotifications, 
  FacultyMessages, 
  FacultyProfile 
} from '../pages/faculty/FacultyDashboard';

// Management Pages
import { 
  ManagementDashboard, 
  ManagementFaculty, 
  ManagementStudents, 
  ManagementApplications, 
  ManagementMessages, 
  ManagementProfile 
} from '../pages/management/ManagementDashboard';

// Company Pages
import { 
  CompanyDashboard, 
  CompanyJobs, 
  CompanyApplicants, 
  CompanyNotifications, 
  CompanyProfile 
} from '../pages/company/CompanyDashboard';

// Admin Pages
import { 
  AdminDashboard, 
  AdminManagement, 
  AdminCompanies, 
  AdminProfile 
} from '../pages/admin/AdminDashboard';

export const AppRoutes = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-sm font-medium tracking-wide text-slate-300">
            Initializing CampusConnect...
          </div>
        </div>
      </div>
    );
  }

  const getRootRedirect = () => {
    if (isAuthenticated && role) {
      return <Navigate to={ROLE_HOME_ROUTES[role] || '/login'} replace />;
    }
    return <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={getRootRedirect()} />

      {/* Public Authentication Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Student Portal Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="jobs" element={<StudentJobs />} />
        <Route path="applications" element={<StudentApplications />} />
        <Route path="resume" element={<StudentResume />} />
        <Route path="mentor" element={<StudentMentor />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Faculty Portal Routes */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRoles={[ROLES.FACULTY]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="applications" element={<FacultyApplications />} />
        <Route path="notifications" element={<FacultyNotifications />} />
        <Route path="messages" element={<FacultyMessages />} />
        <Route path="profile" element={<FacultyProfile />} />
      </Route>

      {/* College Management Portal Routes */}
      <Route
        path="/management"
        element={
          <ProtectedRoute allowedRoles={[ROLES.MANAGEMENT]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/management/dashboard" replace />} />
        <Route path="dashboard" element={<ManagementDashboard />} />
        <Route path="faculty" element={<ManagementFaculty />} />
        <Route path="students" element={<ManagementStudents />} />
        <Route path="applications" element={<ManagementApplications />} />
        <Route path="messages" element={<ManagementMessages />} />
        <Route path="profile" element={<ManagementProfile />} />
      </Route>

      {/* Company Portal Routes */}
      <Route
        path="/company"
        element={
          <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/company/dashboard" replace />} />
        <Route path="dashboard" element={<CompanyDashboard />} />
        <Route path="jobs" element={<CompanyJobs />} />
        <Route path="applicants" element={<CompanyApplicants />} />
        <Route path="notifications" element={<CompanyNotifications />} />
        <Route path="profile" element={<CompanyProfile />} />
      </Route>

      {/* Admin Portal Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="management" element={<AdminManagement />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
