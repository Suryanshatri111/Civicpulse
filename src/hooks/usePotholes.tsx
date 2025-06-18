
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Pothole {
  id: string;
  title: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  severity: 'low' | 'medium' | 'high' | 'critical' | null;
  status: 'reported' | 'in_progress' | 'resolved';
  reported_by: string | null;
  created_at: string;
  updated_at: string;
}

export type PotholeApiEndpoint = 'all' | 'recent' | 'by_severity' | 'by_status';

export const usePotholes = (apiEndpoint: PotholeApiEndpoint = 'all') => {
  return useQuery({
    queryKey: ['potholes', apiEndpoint],
    queryFn: async () => {
      let query = supabase.from('potholes').select('*');

      // Apply different filtering based on selected API endpoint
      switch (apiEndpoint) {
        case 'recent':
          query = query.order('created_at', { ascending: false }).limit(50);
          break;
        case 'by_severity':
          query = query.order('severity', { ascending: false }).order('created_at', { ascending: false });
          break;
        case 'by_status':
          query = query.order('status', { ascending: true }).order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        toast.error('Failed to fetch potholes');
        throw error;
      }

      return data as Pothole[];
    }
  });
};

export const useCreatePothole = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (pothole: Omit<Pothole, 'id' | 'created_at' | 'updated_at' | 'reported_by'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('potholes')
        .insert([{
          ...pothole,
          reported_by: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['potholes'] });
      toast.success('Pothole reported successfully');
    },
    onError: (error) => {
      toast.error('Failed to report pothole');
      console.error('Error creating pothole:', error);
    }
  });
};
