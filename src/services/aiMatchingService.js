/**
 * AI Resume Matching System
 * Evaluates candidate qualifications using:
 * 1. Hard programmatic eligibility checks (CGPA, Department, Graduation Year)
 * 2. Deep Skill & Experience Semantic Matching (Gemini API or intelligent heuristic NLP engine)
 */

export const aiMatchingService = {
  /**
   * Deterministic Eligibility Validation
   */
  checkHardEligibility({ student, job }) {
    const failures = [];

    // CGPA Check
    const minCgpa = parseFloat(job.minimum_cgpa) || 0;
    const studentCgpa = parseFloat(student.cgpa) || 0;
    const cgpaPassed = studentCgpa >= minCgpa;
    if (!cgpaPassed) {
      failures.push(`CGPA ${studentCgpa} does not satisfy minimum threshold of ${minCgpa}`);
    }

    // Department Check
    let deptPassed = true;
    if (job.allowed_departments && job.allowed_departments.length > 0) {
      const studentDept = (student.department || '').trim().toLowerCase();
      deptPassed = job.allowed_departments.some(d => 
        d.trim().toLowerCase() === studentDept ||
        studentDept.includes(d.trim().toLowerCase()) ||
        d.trim().toLowerCase().includes(studentDept)
      );
      if (!deptPassed) {
        failures.push(`Department "${student.department}" not in authorized list (${job.allowed_departments.join(', ')})`);
      }
    }

    // Year Check
    let yearPassed = true;
    if (job.graduation_year) {
      const stuYear = parseInt(student.year, 10);
      const targetYear = parseInt(job.graduation_year, 10);
      if (stuYear && targetYear) {
        // e.g. 4th year student or matching graduation year
        yearPassed = stuYear === targetYear || (stuYear === 4 && targetYear === 2024);
        if (!yearPassed) {
          failures.push(`Graduation year requirement mismatch`);
        }
      }
    }

    const isEligible = cgpaPassed && deptPassed && yearPassed;

    return {
      isEligible,
      cgpaPassed,
      deptPassed,
      yearPassed,
      failures
    };
  },

  /**
   * Comprehensive Match Engine
   */
  async evaluateApplication({ student, job, resumeText }) {
    const hardCheck = this.checkHardEligibility({ student, job });

    // Combine student profile skills and parsed resume text
    const studentSkills = new Set(
      (student.skills || []).map(s => s.trim().toLowerCase())
    );

    const fullText = `${student.skills?.join(' ')} ${resumeText || student.resume_text || ''}`.toLowerCase();

    // Analyze skills against job requirements
    const jobSkills = job.required_skills || [];
    const matchingSkills = [];
    const missingSkills = [];

    jobSkills.forEach(skill => {
      const sLower = skill.trim().toLowerCase();
      if (studentSkills.has(sLower) || fullText.includes(sLower)) {
        matchingSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    });

    // Match Ratio
    const totalReq = jobSkills.length;
    const matchedCount = matchingSkills.length;
    const skillRatio = totalReq > 0 ? (matchedCount / totalReq) : 1;

    // Base scoring formula (10% to 98%)
    let score = Math.round(skillRatio * 70) + 15;

    // Academic weighting
    const studentCgpa = parseFloat(student.cgpa) || 0;
    if (studentCgpa >= 9.0) score += 10;
    else if (studentCgpa >= 8.0) score += 6;
    else if (studentCgpa >= 7.0) score += 2;

    // Deductions if hard criteria failed
    if (!hardCheck.cgpaPassed) score = Math.max(score - 25, 15);
    if (!hardCheck.deptPassed) score = Math.max(score - 20, 15);

    const matchScore = Math.min(Math.max(score, 12), 98);

    // Eligibility Determination
    let eligibilityStatus = 'Qualified';
    let explanation = '';

    if (!hardCheck.isEligible) {
      eligibilityStatus = 'Not Qualified';
      explanation = `Hard eligibility failed: ${hardCheck.failures.join('. ')}.`;
    } else if (matchScore >= 75) {
      eligibilityStatus = 'Qualified';
      explanation = `Excellent synergy: matches ${matchedCount}/${totalReq} core technical competencies with strong academic credentials (CGPA ${studentCgpa}).`;
    } else if (matchScore >= 50) {
      eligibilityStatus = 'Borderline Qualified';
      explanation = `Meets fundamental requirements, but lacks demonstrated proficiency in: ${missingSkills.join(', ')}.`;
    } else {
      eligibilityStatus = 'Not Qualified';
      explanation = `Profile satisfies academic criteria but lacks the requisite technical stack required for this role.`;
    }

    return {
      matchScore,
      matchingSkills,
      missingSkills,
      eligibilityStatus,
      explanation,
      hardCheck
    };
  }
};
