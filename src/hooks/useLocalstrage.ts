import { useState } from 'react';

export const useLocalStorage = (
  key: string
): [value: string | null, setter: (key: string, value: string) => void] => {
  const [value, setKey] = useState(localStorage.getItem(key));
  const setStorage = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };
  return [value, setStorage];
};
