import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  category: string | null;
  action_url: string | null;
  entity_type: string | null;
  entity_id: string | null;
  read: boolean;
  read_at: string | null;
  created_at: string;
  expires_at: string | null;
}

interface UseNotificationsParams {
  type?: string;
  read?: boolean | null;
  category?: string;
  search?: string;
}

export function useNotifications(params: UseNotificationsParams = {}) {
  const { type, read, category, search } = params;

  return useQuery({
    queryKey: ['notifications', type, read, category, search],
    queryFn: async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (type) {
        query = query.eq('type', type);
      }

      if (read !== null && read !== undefined) {
        query = query.eq('read', read);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (search) {
        query = query.or(`title.ilike.%${search}%,message.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Notification[];
    },
  });
}

export function useNotificationStats() {
  return useQuery({
    queryKey: ['notifications-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('id, read, created_at, expires_at');
      
      if (error) throw error;

      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const total = data?.length || 0;
      const unread = data?.filter(n => !n.read).length || 0;
      const thisWeek = data?.filter(n => new Date(n.created_at) >= oneWeekAgo).length || 0;
      const expired = data?.filter(n => n.expires_at && new Date(n.expires_at) < now).length || 0;

      return { total, unread, thisWeek, expired };
    },
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] });
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
      toast.error('Error al marcar como leída');
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('read', false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] });
      toast.success('Todas las notificaciones marcadas como leídas');
    },
    onError: (error) => {
      console.error('Error marking all as read:', error);
      toast.error('Error al marcar todas como leídas');
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] });
      toast.success('Notificación eliminada');
    },
    onError: (error) => {
      console.error('Error deleting notification:', error);
      toast.error('Error al eliminar la notificación');
    },
  });
}

export function useBulkDeleteNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .in('id', ids);

      if (error) throw error;
    },
    onSuccess: (_, ids) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] });
      toast.success(`${ids.length} notificaciones eliminadas`);
    },
    onError: (error) => {
      console.error('Error deleting notifications:', error);
      toast.error('Error al eliminar las notificaciones');
    },
  });
}

export function useDeleteExpiredNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-stats'] });
      toast.success('Notificaciones expiradas eliminadas');
    },
    onError: (error) => {
      console.error('Error deleting expired notifications:', error);
      toast.error('Error al eliminar notificaciones expiradas');
    },
  });
}
