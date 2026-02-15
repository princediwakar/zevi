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
      // 1. Fetch ALL Paths (not just one)
      let pathsQuery = supabase.from('learning_paths').select('*');
      
      if (slugOrId) {
        // Simple check if it looks like a UUID or slug
        if (slugOrId.includes('-')) {
             pathsQuery = pathsQuery.eq('id', slugOrId);
        } else {
             pathsQuery = pathsQuery.eq('slug', slugOrId);
        }
      }

      const { data: pathsData, error: pathsError } = await pathsQuery;
      
      if (pathsError) throw pathsError;
      if (!pathsData || pathsData.length === 0) throw new Error('No learning path found');

      // Use the first path as the main path (for backwards compatibility)
      const pathData = pathsData[0];

      // 2. Fetch Units for all paths
      const pathIds = pathsData.map(p => p.id);
      const { data: unitsData, error: unitsError } = await supabase
        .from('units')
        .select('*')
        .in('learning_path_id', pathIds)
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

      // 4. Combine units with their path info
      const unitsWithLessons = unitsData.map(unit => {
        const path = pathsData.find(p => p.id === unit.learning_path_id);
        return {
          ...unit,
          pathCategory: path?.category || 'product_sense',
          lessons: lessonsData?.filter(l => l.unit_id === unit.id) || []
        };
      });

      set({ path: pathData, units: unitsWithLessons, loading: false });

    } catch (error) {
      console.error('Error fetching learning path:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  reset: () => set({ path: null, units: [], loading: false, error: null })
}));
