-- ==========================================================
-- CAMPUS CONNECT — Seed Demo Data for 5 Roles
-- ==========================================================

-- UUID Constants for Demo Users
-- Admin: 11111111-1111-1111-1111-111111111111
-- Management: 22222222-2222-2222-2222-222222222222
-- Faculty: 33333333-3333-3333-3333-333333333333
-- Student: 44444444-4444-4444-4444-444444444444
-- Company: 55555555-5555-5555-5555-555555555555

-- Seed Profiles
INSERT INTO public.profiles (id, role, full_name, email, is_active)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin', 'System Administrator', 'admin@campusconnect.edu', true),
    ('22222222-2222-2222-2222-222222222222', 'management', 'Dean Dr. Arthur Vance', 'management@campusconnect.edu', true),
    ('33333333-3333-3333-3333-333333333333', 'faculty', 'Prof. Sarah Jenkins', 'faculty@campusconnect.edu', true),
    ('44444444-4444-4444-4444-444444444444', 'student', 'Alex Rivera', 'student@campusconnect.edu', true),
    ('55555555-5555-5555-5555-555555555555', 'company', 'Nexus Technologies HR', 'company@nexus-tech.io', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Management
INSERT INTO public.management (id, user_id, management_id, name, email, phone, created_by_admin)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'MGT-001', 'Dean Dr. Arthur Vance', 'management@campusconnect.edu', '+1 (555) 234-5678', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (management_id) DO NOTHING;

-- Seed Faculty
INSERT INTO public.faculty (id, user_id, faculty_id, name, email, department, phone, created_by_management)
VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'FAC-CS-101', 'Prof. Sarah Jenkins', 'faculty@campusconnect.edu', 'Computer Science & Engineering', '+1 (555) 345-6789', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')
ON CONFLICT (faculty_id) DO NOTHING;

-- Seed Student
INSERT INTO public.students (id, user_id, register_number, name, email, department, year, phone, cgpa, mentor_id, created_by)
VALUES
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'REG2024CS088', 'Alex Rivera', 'student@campusconnect.edu', 'Computer Science & Engineering', 4, '+1 (555) 456-7890', 8.92, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
ON CONFLICT (register_number) DO NOTHING;

-- Seed Company
INSERT INTO public.companies (id, user_id, company_name, email, industry, website, description, created_by_admin)
VALUES
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', '55555555-5555-5555-5555-555555555555', 'Nexus Technologies', 'company@nexus-tech.io', 'Artificial Intelligence & Cloud Systems', 'https://nexus-tech.io', 'Global engineering platform solving enterprise computing scale.', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (email) DO NOTHING;

-- Seed Sample Job
INSERT INTO public.jobs (id, company_id, job_title, description, location, salary, employment_type, required_skills, eligibility, minimum_cgpa, allowed_departments, graduation_year, deadline, status)
VALUES
    ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Junior Full Stack Engineer', 'Join our core platform team building distributed microservices and modern React applications.', 'San Francisco, CA (Hybrid)', '$95,000 - $115,000 / yr', 'full_time', ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Git'], 'Minimum 7.5 CGPA, B.E / B.Tech Computer Science / IT', 7.50, ARRAY['Computer Science & Engineering', 'Information Technology'], 2024, NOW() + INTERVAL '30 days', 'published')
ON CONFLICT (id) DO NOTHING;
