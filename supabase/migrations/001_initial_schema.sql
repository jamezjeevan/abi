-- ==========================================================
-- CAMPUS CONNECT — Complete Database Schema & RLS Policies
-- ==========================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'management', 'faculty', 'student', 'company');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE app_status AS ENUM ('applied', 'screening', 'eligible', 'not_eligible', 'shortlisted', 'rejected', 'accepted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE employment_type AS ENUM ('full_time', 'internship', 'part_time');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE notif_type AS ENUM (
        'NEW_JOB', 
        'APPLICATION_SUBMITTED', 
        'AI_SCREENING_COMPLETED', 
        'ELIGIBLE', 
        'NOT_ELIGIBLE', 
        'SHORTLISTED', 
        'ACCEPTED', 
        'REJECTED', 
        'NEW_MESSAGE'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. CORE IDENTITY & PROFILES TABLE
-- Directly connected to Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MANAGEMENT TABLE (Created only by Admin)
CREATE TABLE IF NOT EXISTS public.management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    management_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_by_admin UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FACULTY TABLE (Created only by College Management)
CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    faculty_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    phone TEXT,
    created_by_management UUID REFERENCES public.management(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. STUDENTS TABLE (Created only by Faculty; Creator becomes mentor)
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    register_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    year INT NOT NULL,
    phone TEXT,
    cgpa NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    resume_url TEXT,
    mentor_id UUID REFERENCES public.faculty(id),
    created_by UUID REFERENCES public.faculty(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMPANIES TABLE (Created only by Admin)
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    industry TEXT,
    website TEXT,
    description TEXT,
    created_by_admin UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. JOBS TABLE (Created by Company)
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    job_title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    salary TEXT,
    employment_type employment_type NOT NULL DEFAULT 'full_time',
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    eligibility TEXT,
    minimum_cgpa NUMERIC(4, 2) NOT NULL DEFAULT 6.00,
    allowed_departments TEXT[] NOT NULL DEFAULT '{}',
    graduation_year INT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    status job_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. RESUMES TABLE (Uploaded to private Supabase Storage)
CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INT,
    parsed_skills TEXT[] DEFAULT '{}',
    parsed_text TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. APPLICATIONS TABLE (Student applies, AI evaluates match)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES public.resumes(id),
    status app_status NOT NULL DEFAULT 'applied',
    ai_match_score NUMERIC(5, 2),
    ai_analysis JSONB DEFAULT '{}',
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_job_student UNIQUE(job_id, student_id)
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notif_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    reference_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. MESSAGING: CONVERSATIONS, MEMBERS & MESSAGES
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    is_group BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_conv_user UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_students_reg_no ON public.students(register_number);
CREATE INDEX IF NOT EXISTS idx_students_mentor ON public.students(mentor_id);
CREATE INDEX IF NOT EXISTS idx_students_user ON public.students(user_id);
CREATE INDEX IF NOT EXISTS idx_faculty_fid ON public.faculty(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_mgmt ON public.faculty(created_by_management);
CREATE INDEX IF NOT EXISTS idx_management_mid ON public.management(management_id);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON public.messages(conversation_id);

-- 14. ROW LEVEL SECURITY (RLS) ACTIVATION
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.management ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper functions for RLS checks
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (id = auth.uid() OR public.get_auth_role() = 'admin');

CREATE POLICY "Admin can update profiles" ON public.profiles
    FOR UPDATE USING (public.get_auth_role() = 'admin' OR id = auth.uid());

-- Management Policies
CREATE POLICY "Admin can manage management" ON public.management
    FOR ALL USING (public.get_auth_role() = 'admin');

CREATE POLICY "Management can view own profile" ON public.management
    FOR SELECT USING (user_id = auth.uid());

-- Faculty Policies
CREATE POLICY "Faculty can view own profile" ON public.faculty
    FOR SELECT USING (user_id = auth.uid() OR public.get_auth_role() IN ('admin', 'management'));

CREATE POLICY "Management can manage faculty" ON public.faculty
    FOR ALL USING (
        public.get_auth_role() = 'management' 
        AND created_by_management IN (SELECT id FROM public.management WHERE user_id = auth.uid())
    );

-- Student Policies
CREATE POLICY "Student can view own record" ON public.students
    FOR SELECT USING (
        user_id = auth.uid() 
        OR public.get_auth_role() IN ('faculty', 'management')
    );

CREATE POLICY "Faculty can create and manage their students" ON public.students
    FOR ALL USING (
        public.get_auth_role() = 'faculty'
        AND (created_by IN (SELECT id FROM public.faculty WHERE user_id = auth.uid())
             OR mentor_id IN (SELECT id FROM public.faculty WHERE user_id = auth.uid()))
    );

-- Company Policies
CREATE POLICY "Company can view own profile" ON public.companies
    FOR SELECT USING (user_id = auth.uid() OR public.get_auth_role() = 'admin');

CREATE POLICY "Admin can manage companies" ON public.companies
    FOR ALL USING (public.get_auth_role() = 'admin');

-- Jobs Policies
CREATE POLICY "Anyone authenticated can view published jobs" ON public.jobs
    FOR SELECT USING (status = 'published' OR company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Company can manage own jobs" ON public.jobs
    FOR ALL USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

-- Applications Policies
CREATE POLICY "Student can view own applications" ON public.applications
    FOR SELECT USING (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
        OR job_id IN (SELECT id FROM public.jobs WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()))
        OR public.get_auth_role() IN ('faculty', 'management')
    );

CREATE POLICY "Student can insert own application" ON public.applications
    FOR INSERT WITH CHECK (
        student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    );

CREATE POLICY "Company can update application status for their jobs" ON public.applications
    FOR UPDATE USING (
        job_id IN (SELECT id FROM public.jobs WHERE company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()))
    );

-- Notifications Policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (user_id = auth.uid());

-- Messaging Policies
CREATE POLICY "Members can view conversations" ON public.conversations
    FOR SELECT USING (
        id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Members can view messages" ON public.messages
    FOR SELECT USING (
        conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid())
    );

CREATE POLICY "Members can insert messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() 
        AND conversation_id IN (SELECT conversation_id FROM public.conversation_members WHERE user_id = auth.uid())
    );

-- 15. RESOLVE IDENTIFIER RPC FUNCTION (Student Reg No / Faculty ID / Mgmt ID / Email)
CREATE OR REPLACE FUNCTION public.resolve_identifier_to_email(identifier_input TEXT)
RETURNS TEXT AS $$
DECLARE
    found_email TEXT;
BEGIN
    -- Check if it's already an email
    IF identifier_input LIKE '%@%' THEN
        RETURN identifier_input;
    END IF;

    -- Check Student Register Number
    SELECT email INTO found_email FROM public.students WHERE UPPER(register_number) = UPPER(identifier_input) LIMIT 1;
    IF found_email IS NOT NULL THEN
        RETURN found_email;
    END IF;

    -- Check Faculty ID
    SELECT email INTO found_email FROM public.faculty WHERE UPPER(faculty_id) = UPPER(identifier_input) LIMIT 1;
    IF found_email IS NOT NULL THEN
        RETURN found_email;
    END IF;

    -- Check Management ID
    SELECT email INTO found_email FROM public.management WHERE UPPER(management_id) = UPPER(identifier_input) LIMIT 1;
    IF found_email IS NOT NULL THEN
        RETURN found_email;
    END IF;

    -- Check Company Name or ID
    SELECT email INTO found_email FROM public.companies WHERE UPPER(company_name) = UPPER(identifier_input) LIMIT 1;
    IF found_email IS NOT NULL THEN
        RETURN found_email;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
