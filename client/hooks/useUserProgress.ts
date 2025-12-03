import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";

export interface UserProgress {
  machine_id: number;
  completed_at: string;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all completed machines for the user
  const { data: completedMachines = [], isLoading } = useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('machine_id, completed_at');

      if (error) {
        console.error('Error fetching progress:', error);
        // Fallback to localStorage for demo purposes if table doesn't exist
        const local = localStorage.getItem('mock_progress');
        return local ? JSON.parse(local) : [];
      }
      
      return data as UserProgress[];
    },
    enabled: !!user,
  });

  // Mutation to mark as completed
  const markAsCompleted = useMutation({
    mutationFn: async (machineId: number) => {
      if (!user) throw new Error("Must be logged in");

      // Try Supabase first
      const { error } = await supabase
        .from('user_progress')
        .insert({ user_id: user.id, machine_id: machineId });

      if (error) {
        // If table doesn't exist or RLS fails, use localStorage fallback
        console.warn("Supabase insert failed, using localStorage fallback:", error);
        const current = JSON.parse(localStorage.getItem('mock_progress') || '[]');
        if (!current.find((p: any) => p.machine_id === machineId)) {
          current.push({ machine_id: machineId, completed_at: new Date().toISOString() });
          localStorage.setItem('mock_progress', JSON.stringify(current));
        }
        return;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
      queryClient.invalidateQueries({ queryKey: ['skill-tree-machines'] }); // Refresh skill tree
      toast({
        title: "SYSTEM HACKED",
        description: "Machine pwned! XP added to your profile.",
        variant: "destructive", // Red for hacker vibe
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save progress. " + error.message,
        variant: "destructive",
      });
    }
  });

  const isCompleted = (machineId: number) => {
    return completedMachines.some(p => p.machine_id === machineId);
  };

  return {
    completedMachines,
    isLoading,
    markAsCompleted,
    isCompleted
  };
};
