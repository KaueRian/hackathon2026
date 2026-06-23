'use client';

import { useState, ChangeEvent } from 'react';

type FormValues = Record<string, string | boolean | number>;

export function useFormState<T extends FormValues>(initialState: T) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const parsed: T[keyof T] =
      type === 'checkbox'
        ? ((e.target as HTMLInputElement).checked as T[keyof T])
        : (value as T[keyof T]);
    handleChange(name as keyof T, parsed);
  };

  return { values, setValues, errors, setErrors, handleChange, handleInputChange };
}
