import { useEffect, useState } from 'react';
import { Dog } from '../types/models';
import { dogService } from '../services';

export const useDogs = (zone: string, skip: boolean = false) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (skip || !zone) return;

    const fetchDogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const dogsData = await dogService.getDogsByZone(zone);
        setDogs(dogsData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error cargando perros';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [zone, skip]);

  return { dogs, loading, error };
};

export const useOwnerDogs = (ownerId: string | undefined) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ownerId) return;

    const fetchDogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const dogsData = await dogService.getOwnerDogs(ownerId);
        setDogs(dogsData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error cargando perros';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [ownerId]);

  return { dogs, loading, error };
};
