'use client';

import { useState, ChangeEvent } from 'react';

export function useFormState<T extends Record<string, any>>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear error when field changes
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue = value;
    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked as any;
    }

    handleChange(name as keyof T, parsedValue);
  };

  return { values, setValues, errors, setErrors, handleChange, handleInputChange };
}
