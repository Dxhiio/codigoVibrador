import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Machine {
    id: number;
    name: string;
    os: string;
    ip: string;
    avatar: string;
    points: number;
    difficulty_text: string;
    status: 'active' | 'retired';
    release_date: string;
    user_owns_count: number;
    root_owns_count: number;
    free: boolean;
    stars: number;
    video_url?: string;
}

export function useMachines() {
    const { data: machines = [], isLoading: loading, error } = useQuery({
        queryKey: ['machines', 'landing'],
        queryFn: async () => {
            // 1. Fetch 19 active machines
            const { data: activeData, error: activeError } = await supabase
                .from('htb_machines')
                .select('*')
                .eq('status', 'active')
                .order('release_date', { ascending: false })
                .limit(19);

            if (activeError) throw activeError;

            // 2. Fetch 1 random retired machine
            // First get count of retired machines
            const { count, error: countError } = await supabase
                .from('htb_machines')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'retired');

            if (countError) throw countError;

            let retiredMachine: Machine | null = null;

            if (count && count > 0) {
                const randomOffset = Math.floor(Math.random() * count);
                const { data: retiredData, error: retiredError } = await supabase
                    .from('htb_machines')
                    .select('*')
                    .eq('status', 'retired')
                    .range(randomOffset, randomOffset)
                    .limit(1);

                if (retiredError) throw retiredError;
                if (retiredData && retiredData.length > 0) {
                    retiredMachine = retiredData[0] as Machine;
                }
            }

            // Combine results
            const combined = [...(activeData || [])] as Machine[];
            if (retiredMachine) {
                combined.push(retiredMachine);
            }

            return combined;
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
        refetchOnWindowFocus: false,
    });

    return { machines, loading, error: error ? (error as Error).message : null };
}
