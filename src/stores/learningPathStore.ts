import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import { LearningPath, Unit, Lesson } from '../types';

interface UnitWithLessons extends Unit {
  lessons: Lesson[];
}

interface LearningPathState {
  path: LearningPath | null;
  units: UnitWithLessons[];
  loading: boolean;
  error: string | null;

  fetchPath: (slugOrId?: string) => Promise<void>;
  reset: () => void;
}

export const useLearningPathStore = create<LearningPathState>((set, get) => ({
  path: null,
  units: [],
  loading: false,
  error: null,

  fetchPath: async (slugOrId) => {
    set({ loading: true, error: null });
    try {
      // 1. Fetch Path
      let query = supabase.from('learning_paths').select('*');
      
      if (slugOrId) {
        // Simple check if it looks like a UUID or slug
        if (slugOrId.includes('-')) {
             query = query.eq('id', slugOrId);
        } else {
             query = query.eq('slug', slugOrId);
        }
      } else {
        // Fallback: fetch the first one
        query = query.limit(1);
      }

      const { data: pathData, error: pathError } = await query.single();
      
      if (pathError) throw pathError;
      if (!pathData) throw new Error('No learning path found');

      // 2. Fetch Units
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .eq('learning_path_id', pathData.id)
        .order('order_index', { ascending: true });

      if (unitsError) throw unitsError;

      // 3. Fetch Lessons
      if (!unitsData || unitsData.length === 0) {
          set({ path: pathData, units: [], loading: false });
          return;
      }

      const unitIds = unitsData.map(u => u.id);
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .in('unit_id', unitIds)
        .order('order_index', { ascending: true });

      if (lessonsError) throw lessonsError;

      // 4. Combine
      const unitsWithLessons = unitsData.map(unit => ({
        ...unit,
        lessons: lessonsData?.filter(l => l.unit_id === unit.id) || []
      }));

      set({ path: pathData, units: unitsWithLessons, loading: false });

    } catch (error) {
      console.error('Error fetching learning path:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  reset: () => set({ path: null, units: [], loading: false, error: null })
}));
