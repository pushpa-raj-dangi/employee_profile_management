import { useCallback } from 'react';

type StorageOptions = {
  secure?: boolean;
  expiresIn?: number; // in seconds
};

export const useSecureStorage = () => {
  const isBrowser = typeof window !== 'undefined';

  const setItem = useCallback(async (key: string, value: string, options: StorageOptions = {}) => {
    if (!isBrowser) return;

    try {
      if (options.secure && process.env.NODE_ENV === 'production') {
        // Use httpOnly cookies in production (handled by backend)
        await fetch('/api/set-cookie', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ key, value, options }),
        });
      } else {
        // Fallback to sessionStorage
        sessionStorage.setItem(key, value);
        
        if (options.expiresIn) {
          const expiration = Date.now() + options.expiresIn * 1000;
          sessionStorage.setItem(`${key}_exp`, expiration.toString());
        }
      }
    } catch (err) {
      console.error('Secure storage set error:', err);
    }
  }, [isBrowser]);

  const getItem = useCallback(async (key: string): Promise<string | null> => {
    if (!isBrowser) return null;

    try {
      // Check expiration first
      const expiration = sessionStorage.getItem(`${key}_exp`);
      if (expiration && Date.now() > parseInt(expiration)) {
        sessionStorage.removeItem(key);
        sessionStorage.removeItem(`${key}_exp`);
        return null;
      }

      return sessionStorage.getItem(key);
    } catch (err) {
      console.error('Secure storage get error:', err);
      return null;
    }
  }, [isBrowser]);

  const removeItem = useCallback(async (key: string) => {
    if (!isBrowser) return;

    try {
      sessionStorage.removeItem(key);
      sessionStorage.removeItem(`${key}_exp`);
    } catch (err) {
      console.error('Secure storage remove error:', err);
    }
  }, [isBrowser]);

  return { setItem, getItem, removeItem };
};