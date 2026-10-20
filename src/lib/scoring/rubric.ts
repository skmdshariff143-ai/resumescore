export const CAREER_LEVELS = {
  student: 'Student / Fresher',
  internship: 'Internship Applicant',
  entry: 'Entry-Level Professional',
  experienced: 'Experienced Professional',
  senior: 'Senior Professional',
  switcher: 'Career Switcher',
} as const;
export type CareerLevel = keyof typeof CAREER_LEVELS;

// Editorial rubric, not calibrated hiring probabilities. Order matches dimensions.
export const RUBRIC_WEIGHTS: Record<CareerLevel, readonly number[]> = {
  student: [0.15, 0.20, 0.10, 0.10, 0.25, 0.15, 0.05],
  internship: [0.15, 0.20, 0.10, 0.10, 0.25, 0.15, 0.05],
  entry: [0.15, 0.25, 0.15, 0.15, 0.15, 0.10, 0.05],
  experienced: [0.15, 0.25, 0.20, 0.15, 0.10, 0.10, 0.05],
  senior: [0.15, 0.20, 0.25, 0.20, 0.05, 0.10, 0.05],
  switcher: [0.15, 0.20, 0.15, 0.15, 0.20, 0.10, 0.05],
};
