import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '../services/auth';
import { notificationService } from '../services/notifications';
import { auth } from '../services/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ...existing code...
    const unsubscribe = auth.onAuthStateChanged(
      async (currentUser) => {
        setUser(currentUser);
        setLoading(false);
        if (currentUser) {
          const token = await notificationService.registerForPushNotificationsAsync();
          if (token) await authService.savePushToken(currentUser.uid, token);
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string, zone: string) => {
    try {
      setError(null);
      await authService.register(email, password, name, zone);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al registrarse';
      setError(message);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await authService.login(email, password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión';
      setError(message);
      throw err;
    }
  };

  return { user, loading, error, register, login, logout };
};
