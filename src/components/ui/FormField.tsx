import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string | null;
  touched?: boolean;
  children: React.ReactNode;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, touched, children, required }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-zinc-400">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {touched && error && (
      <p className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
        <AlertCircle className="w-3 h-3" /> {error}
      </p>
    )}
  </div>
);
