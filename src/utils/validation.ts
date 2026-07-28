export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export const required = (msg?: string): ValidationRule => ({
  validate: (v: string) => v.trim().length > 0,
  message: msg || 'This field is required',
});

export const minLength = (min: number, msg?: string): ValidationRule => ({
  validate: (v: string) => v.trim().length >= min,
  message: msg || `Must be at least ${min} characters`,
});

export const maxLength = (max: number, msg?: string): ValidationRule => ({
  validate: (v: string) => v.length <= max,
  message: msg || `Must be at most ${max} characters`,
});

export const email = (msg?: string): ValidationRule => ({
  validate: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  message: msg || 'Enter a valid email address',
});

export const numeric = (msg?: string): ValidationRule => ({
  validate: (v: string) => /^\d+$/.test(v),
  message: msg || 'Enter a valid number',
});

export const minValue = (min: number, msg?: string): ValidationRule => ({
  validate: (v: string) => Number(v) >= min,
  message: msg || `Must be at least ${min}`,
});

export function validateField(value: string, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) return rule.message;
  }
  return null;
}

export function validateForm<T extends Record<string, string>>(
  fields: T,
  rules: Record<keyof T, ValidationRule[]>,
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const key of Object.keys(rules) as (keyof T)[]) {
    const error = validateField(fields[key] as string, rules[key]);
    if (error) errors[key] = error;
  }
  return errors;
}
