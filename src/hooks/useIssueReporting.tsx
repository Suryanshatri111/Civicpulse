
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  category: 'pothole' | 'traffic_signal' | 'streetlight' | 'road_damage' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'reported' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  latitude: number | null;
  longitude: number | null;
  image_url: string | null;
  reported_by: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export const useIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching issues:', error);
        toast.error('Failed to fetch issues');
        throw error;
      }

      return data as Issue[];
    }
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (issue: Omit<Issue, 'id' | 'created_at' | 'updated_at' | 'reported_by' | 'assigned_to'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('issues')
        .insert([{
          ...issue,
          reported_by: user.id,
          status: 'reported'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating issue:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue reported successfully');
    },
    onError: (error) => {
      console.error('Error creating issue:', error);
      toast.error('Failed to report issue');
    }
  });
};

export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Issue> }) => {
      const { data, error } = await supabase
        .from('issues')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating issue:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue updated successfully');
    },
    onError: (error) => {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue');
    }
  });
};
