import { useEffect, useState } from 'react';

/**
 * Returns a debounced version of `value` that only updates after `delay` ms of inactivity.
 * Use to throttle API calls triggered by fast user input (e.g. search fields).
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 */
export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
