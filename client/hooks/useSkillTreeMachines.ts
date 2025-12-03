import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Machine } from "./useMachines";

export interface SkillPath {
  level1: Machine[]; // 3 Easy
  level2: Machine[]; // 2 Medium
  level3: Machine[]; // 3 Hard
  level4: Machine[]; // 2 Insane
  totalAvailable: number;
}

export const useSkillTreeMachines = (techniqueName: string | undefined, tier: number = 1) => {
  return useQuery({
    queryKey: ['skill-tree-machines', techniqueName, tier],
    queryFn: async (): Promise<SkillPath | null> => {
      if (!techniqueName) return null;

      console.log(`Fetching machines for technique: ${techniqueName} (Tier ${tier})`);

      // Fetch machines for this technique
      const { data, error } = await supabase
        .from('machine_techniques')
        .select(`
          htb_machines (
            id,
            name,
            os,
            points,
            difficulty_text,
            avatar,
            status,
            video_url,
            ip,
            release_date
          ),
          techniques!inner (name)
        `)
        .eq('techniques.name', techniqueName);

      if (error) {
        console.error("Error fetching skill tree machines:", error);
        throw error;
      }

      // Extract and filter valid machines
      // We cast to unknown first because Supabase types can be tricky with joins
      const allMachines = data
        .map(d => d.htb_machines)
        .filter(m => m !== null) as unknown as Machine[];

      // Sort by ID for stability
      allMachines.sort((a, b) => a.id - b.id);

      // Group by difficulty
      const easy = allMachines.filter(m => m.difficulty_text === 'Easy');
      const medium = allMachines.filter(m => m.difficulty_text === 'Medium');
      const hard = allMachines.filter(m => m.difficulty_text === 'Hard');
      const insane = allMachines.filter(m => m.difficulty_text === 'Insane');

      // Difficulty Distribution Logic based on Tier
      let level1: Machine[] = [];
      let level2: Machine[] = [];
      let level3: Machine[] = [];
      let level4: Machine[] = [];

      if (tier === 1) {
        // Tier 1: Pure Fundamentals (All Easy)
        level1 = easy.slice(0, 5);
      } else if (tier === 2) {
        // Tier 2: Stepping Up (Mostly Easy, some Medium)
        level1 = easy.slice(0, 3);
        level2 = medium.slice(0, 2);
      } else if (tier === 3) {
        // Tier 3: Intermediate (Medium & Hard)
        level2 = medium.slice(0, 3);
        level3 = hard.slice(0, 2);
      } else if (tier >= 4) {
        // Tier 4+: Advanced (Hard & Insane)
        level3 = hard.slice(0, 2);
        level4 = insane.slice(0, 3);
      }

      // Fallback: If not enough machines in target difficulty, fill with available ones
      if (level1.length + level2.length + level3.length + level4.length === 0) {
         return {
            level1: easy.slice(0, 5),
            level2: medium.slice(0, 5),
            level3: hard.slice(0, 5),
            level4: insane.slice(0, 5),
            totalAvailable: allMachines.length
         };
      }

      return {
        level1,
        level2,
        level3,
        level4,
        totalAvailable: allMachines.length
      };
    },
    enabled: !!techniqueName,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
