/**
 * CampusConnect - Hard Eligibility Service (STEP 6)
 *
 * Deterministic rule engine to evaluate a student's eligibility for a job posting.
 * This service runs purely locally without calling Gemini AI or any external AI services.
 *
 * Checks at minimum:
 * 1. CGPA (student.cgpa >= job.minimum_cgpa)
 * 2. Department (student.department matches job allowed/eligible departments)
 * 3. Academic Year (student.year matches job eligible_years / graduation_year)
 *
 * Rules:
 * - If a job does not specify a particular requirement, do not reject the student based on that requirement.
 * - Do not invent missing student information.
 * - Returns structured eligibility breakdown with clear reasons.
 */

// Common department alias map for robust matching
const DEPARTMENT_ALIASES = [
  ['cse', 'computer science', 'computer science & engineering', 'computer science and engineering', 'cs'],
  ['it', 'information technology', 'info tech'],
  ['ece', 'electronics & communication', 'electronics and communication', 'electronics and communication engineering'],
  ['eee', 'electrical & electronics', 'electrical and electronics', 'electrical and electronics engineering'],
  ['mech', 'mechanical', 'mechanical engineering'],
  ['civil', 'civil engineering'],
  ['ai', 'aiml', 'ai & ds', 'ai/ml', 'artificial intelligence', 'artificial intelligence & data science', 'artificial intelligence and data science'],
  ['ds', 'data science']
];

/**
 * Normalizes academic year values (e.g. 4, "4", "Final Year", "4th Year", 2024)
 */
const normalizeYear = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).trim().toLowerCase();

  // Word & label normalization
  if (str.includes('final') || str.includes('4th') || str.includes('fourth') || str === '4') {
    return { standard: 'Final Year', numeric: 4 };
  }
  if (str.includes('3rd') || str.includes('third') || str === '3') {
    return { standard: '3rd Year', numeric: 3 };
  }
  if (str.includes('2nd') || str.includes('second') || str === '2') {
    return { standard: '2nd Year', numeric: 2 };
  }
  if (str.includes('1st') || str.includes('first') || str === '1') {
    return { standard: '1st Year', numeric: 1 };
  }

  // Handle calendar year like 2024
  const num = parseInt(str, 10);
  if (!isNaN(num)) {
    return { standard: String(num), numeric: num };
  }

  return { standard: str, numeric: null };
};

/**
 * Checks if student department matches any required department
 */
const matchDepartment = (studentDept, allowedList) => {
  if (!allowedList || allowedList.length === 0) return true;
  if (!studentDept) return false;

  const sDeptClean = studentDept.trim().toLowerCase();

  return allowedList.some((req) => {
    if (!req) return false;
    const rDeptClean = String(req).trim().toLowerCase();

    // 1. Direct equality
    if (sDeptClean === rDeptClean) return true;

    // 2. Substring inclusion
    if (sDeptClean.includes(rDeptClean) || rDeptClean.includes(sDeptClean)) return true;

    // 3. Alias dictionary check
    for (const group of DEPARTMENT_ALIASES) {
      const sMatches = group.some(alias => sDeptClean === alias || sDeptClean.includes(alias));
      const rMatches = group.some(alias => rDeptClean === alias || rDeptClean.includes(alias));
      if (sMatches && rMatches) return true;
    }

    return false;
  });
};

/**
 * Checks if student year matches required year
 */
const matchYear = (studentYear, job) => {
  // Collect all job year constraints
  let allowedYears = [];

  if (Array.isArray(job.eligible_years) && job.eligible_years.length > 0) {
    allowedYears = allowedYears.concat(job.eligible_years);
  }
  if (Array.isArray(job.allowed_years) && job.allowed_years.length > 0) {
    allowedYears = allowedYears.concat(job.allowed_years);
  }
  if (job.graduation_year) {
    allowedYears.push(job.graduation_year);
  }

  // If job does not specify year requirements, do not reject
  if (allowedYears.length === 0) return true;
  if (studentYear === null || studentYear === undefined || studentYear === '') return false;

  const stuNorm = normalizeYear(studentYear);
  if (!stuNorm) return false;

  return allowedYears.some((reqYear) => {
    const reqNorm = normalizeYear(reqYear);
    if (!reqNorm) return false;

    // Direct match by standard label
    if (stuNorm.standard.toLowerCase() === reqNorm.standard.toLowerCase()) return true;

    // Numeric match (e.g. Year 4 matches 4)
    if (stuNorm.numeric !== null && reqNorm.numeric !== null && stuNorm.numeric === reqNorm.numeric) {
      return true;
    }

    // Class of 2024 mapping for 4th / Final Year
    if (
      (stuNorm.numeric === 4 || stuNorm.standard === 'Final Year') &&
      (reqNorm.numeric === 2024 || reqNorm.standard === '2024')
    ) {
      return true;
    }

    return false;
  });
};

export const eligibilityService = {
  /**
   * Deterministic Hard Eligibility Check
   *
   * @param {Object} params
   * @param {Object} params.student Student data (cgpa, department, year)
   * @param {Object} params.job Job requirements (minimum_cgpa, allowed_departments/eligible_departments, eligible_years/graduation_year)
   * @returns {Object} Structured eligibility result
   */
  checkHardEligibility({ student, job }) {
    if (!job) {
      return {
        isEligible: false,
        checks: {},
        failures: ['Job details not provided'],
        reasons: ['Job details not provided'],
        summary: 'Invalid job details'
      };
    }

    if (!student) {
      return {
        isEligible: false,
        checks: {},
        failures: ['Student profile not provided'],
        reasons: ['Student profile not provided'],
        summary: 'Invalid student profile'
      };
    }

    const failures = [];
    const reasons = [];

    // ----------------------------------------------------
    // 1. CGPA CHECK
    // ----------------------------------------------------
    const minCgpa = job.minimum_cgpa !== undefined && job.minimum_cgpa !== null && job.minimum_cgpa !== ''
      ? parseFloat(job.minimum_cgpa)
      : null;

    const studentCgpa = student.cgpa !== undefined && student.cgpa !== null && student.cgpa !== ''
      ? parseFloat(student.cgpa)
      : null;

    let cgpaPassed = true;
    let cgpaMessage = 'No minimum CGPA required';

    if (minCgpa !== null && !isNaN(minCgpa) && minCgpa > 0) {
      if (studentCgpa === null || isNaN(studentCgpa)) {
        cgpaPassed = false;
        cgpaMessage = `Student CGPA is missing (minimum required: ${minCgpa.toFixed(2)})`;
        failures.push('CGPA_MISSING');
        reasons.push(`Student CGPA is not recorded (minimum required is ${minCgpa.toFixed(2)}).`);
      } else if (studentCgpa < minCgpa) {
        cgpaPassed = false;
        cgpaMessage = `CGPA ${studentCgpa.toFixed(2)} is below minimum cutoff of ${minCgpa.toFixed(2)}`;
        failures.push('CGPA_BELOW_CUTOFF');
        reasons.push(`Your CGPA of ${studentCgpa.toFixed(2)} is below the required minimum of ${minCgpa.toFixed(2)}.`);
      } else {
        cgpaMessage = `CGPA ${studentCgpa.toFixed(2)} satisfies cutoff (≥ ${minCgpa.toFixed(2)})`;
      }
    } else if (studentCgpa !== null && !isNaN(studentCgpa)) {
      cgpaMessage = `CGPA ${studentCgpa.toFixed(2)} (no cutoff specified)`;
    }

    // ----------------------------------------------------
    // 2. DEPARTMENT CHECK
    // ----------------------------------------------------
    const allowedDepts = Array.isArray(job.eligible_departments) && job.eligible_departments.length > 0
      ? job.eligible_departments
      : Array.isArray(job.allowed_departments) && job.allowed_departments.length > 0
        ? job.allowed_departments
        : typeof job.allowed_departments === 'string' && job.allowed_departments.trim()
          ? job.allowed_departments.split(',').map(d => d.trim()).filter(Boolean)
          : [];

    let deptPassed = true;
    let deptMessage = 'All departments eligible';

    if (allowedDepts.length > 0) {
      const studentDept = student.department ? String(student.department).trim() : '';
      if (!studentDept) {
        deptPassed = false;
        deptMessage = `Student department is not specified`;
        failures.push('DEPARTMENT_MISSING');
        reasons.push(`Your department is missing in your profile. Eligible departments: ${allowedDepts.join(', ')}.`);
      } else {
        deptPassed = matchDepartment(studentDept, allowedDepts);
        if (!deptPassed) {
          deptMessage = `Department "${studentDept}" is not in eligible list`;
          failures.push('DEPARTMENT_MISMATCH');
          reasons.push(`Your department "${studentDept}" does not match eligible departments (${allowedDepts.join(', ')}).`);
        } else {
          deptMessage = `Department "${studentDept}" is eligible`;
        }
      }
    }

    // ----------------------------------------------------
    // 3. ACADEMIC YEAR CHECK
    // ----------------------------------------------------
    const targetYears = Array.isArray(job.eligible_years) && job.eligible_years.length > 0
      ? job.eligible_years
      : Array.isArray(job.allowed_years) && job.allowed_years.length > 0
        ? job.allowed_years
        : job.graduation_year
          ? [job.graduation_year]
          : [];

    let yearPassed = true;
    let yearMessage = 'All academic years eligible';

    if (targetYears.length > 0) {
      const studentYear = student.year !== undefined && student.year !== null ? student.year : '';
      if (studentYear === '' || studentYear === null) {
        yearPassed = false;
        yearMessage = `Student academic year is not specified`;
        failures.push('YEAR_MISSING');
        reasons.push(`Your academic year is missing in your profile. Eligible years: ${targetYears.join(', ')}.`);
      } else {
        yearPassed = matchYear(studentYear, job);
        if (!yearPassed) {
          const normStu = normalizeYear(studentYear)?.standard || studentYear;
          yearMessage = `Academic year "${normStu}" does not match requirement`;
          failures.push('YEAR_MISMATCH');
          reasons.push(`Your academic year (${normStu}) does not match the eligible graduation year (${targetYears.join(', ')}).`);
        } else {
          const normStu = normalizeYear(studentYear)?.standard || studentYear;
          yearMessage = `Academic year "${normStu}" is eligible`;
        }
      }
    }

    // ----------------------------------------------------
    // OVERALL ELIGIBILITY
    // ----------------------------------------------------
    const isEligible = cgpaPassed && deptPassed && yearPassed;

    return {
      isEligible,
      checks: {
        cgpa: {
          passed: cgpaPassed,
          studentValue: studentCgpa,
          requiredValue: minCgpa,
          message: cgpaMessage
        },
        department: {
          passed: deptPassed,
          studentValue: student.department || null,
          requiredValue: allowedDepts.length > 0 ? allowedDepts : null,
          message: deptMessage
        },
        year: {
          passed: yearPassed,
          studentValue: student.year !== undefined ? student.year : null,
          requiredValue: targetYears.length > 0 ? targetYears : null,
          message: yearMessage
        }
      },
      failures,
      reasons,
      summary: isEligible
        ? 'Satisfies all hard academic requirements (CGPA, Department, Academic Year).'
        : `Hard eligibility check failed: ${reasons.join(' ')}`
    };
  }
};
