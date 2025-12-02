import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Technique {
  id: number;
  name: string;
  category: string;
}

export function useMachineTechniques(machineId: number | null) {
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!machineId) {
      setTechniques([]);
      return;
    }

    const fetchTechniques = async () => {
      try {
        setLoading(true);
        setError(null);

        // Query machine_techniques joined with techniques
        const { data, error: queryError } = await supabase
          .from('machine_techniques')
          .select(`
            technique_id,
            techniques (
              id,
              name,
              category
            )
          `)
          .eq('machine_id', machineId);

        if (queryError) {
          throw queryError;
        }

        // Extract techniques from the join result
        const techniquesData = data
          ?.map((item: any) => item.techniques)
          .filter(Boolean) || [];

        setTechniques(techniquesData);
      } catch (err) {
        console.error('Error fetching techniques:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setTechniques([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechniques();
  }, [machineId]);

  return { techniques, loading, error };
}
