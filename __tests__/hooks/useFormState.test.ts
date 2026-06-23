import { renderHook, act } from '@testing-library/react';
import { useFormState } from '@/hooks/useFormState';

describe('useFormState', () => {
  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useFormState({ name: '' }));
    expect(result.current.values).toEqual({ name: '' });
    expect(result.current.errors).toEqual({});
  });

  it('should update values correctly on handleChange', () => {
    const { result } = renderHook(() => useFormState({ name: '' }));
    act(() => {
      result.current.handleChange('name', 'John');
    });
    expect(result.current.values.name).toBe('John');
  });

  it('should clear error when value changes', () => {
    const { result } = renderHook(() => useFormState({ name: '' }));
    act(() => {
      result.current.setErrors({ name: 'Required' });
    });
    expect(result.current.errors.name).toBe('Required');

    act(() => {
      result.current.handleChange('name', 'John');
    });
    expect(result.current.errors.name).toBeUndefined();
  });
});
