import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Certification {
  id: number;
  name: string;
}

export function useMachineCertifications(machineId: number | null) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!machineId) {
      setCertifications([]);
      return;
    }

    const fetchCertifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: queryError } = await supabase
          .from('machine_certifications')
          .select(`
            certification_id,
            certifications (
              id,
              name
            )
          `)
          .eq('machine_id', machineId);

        if (queryError) {
          throw queryError;
        }

        const certsData = data
          ?.map((item: any) => item.certifications)
          .filter(Boolean) || [];

        setCertifications(certsData);
      } catch (err) {
        console.error('Error fetching certifications:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setCertifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, [machineId]);

  return { certifications, loading, error };
}
