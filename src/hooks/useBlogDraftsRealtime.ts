import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useBrowserNotifications } from './useBrowserNotifications';
import { useNotificationSound } from './useNotificationSound';
import { toast } from 'sonner';

export function useBlogDraftsRealtime() {
  const { showNotification, isEnabled } = useBrowserNotifications();
  const queryClient = useQueryClient();
  const playNotificationSound = useNotificationSound();

  useEffect(() => {
    const channel = supabase
      .channel('blog-drafts-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'blog_posts',
      }, (payload) => {
        const newPost = payload.new as { status: string; title_es: string; id: string };
        
        // Only notify for drafts
        if (newPost.status !== 'draft') return;
        
        // In-app toast notification
        toast.info('📝 Nuevo artículo generado', {
          description: newPost.title_es,
          action: {
            label: 'Revisar',
            onClick: () => window.location.href = '/admin/blog'
          },
          duration: 10000,
        });

        // Browser notification if tab is inactive
        if (document.hidden && isEnabled) {
          showNotification({
            title: '📝 Artículo pendiente de revisión',
            body: newPost.title_es,
            data: { url: '/admin/blog' }
          });
        }

        playNotificationSound();
        
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['pending-drafts'] });
        queryClient.invalidateQueries({ queryKey: ['pending-drafts-count'] });
        queryClient.invalidateQueries({ queryKey: ['blog-search'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, showNotification, isEnabled, playNotificationSound]);
}
