import { useState, useEffect, useCallback } from "react";

interface BrowserNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
}

export const useBrowserNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // Cargar preferencias del localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('browser-notifications-enabled');
    setIsEnabled(savedPreference === 'true');
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Solicitar permisos
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        setIsEnabled(true);
        localStorage.setItem('browser-notifications-enabled', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      return false;
    }
  }, []);

  // Mostrar notificación
  const showNotification = useCallback((options: BrowserNotificationOptions) => {
    if (!isEnabled || permission !== 'granted') {
      return;
    }

    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon || '/favicon.svg',
      badge: options.badge || '/favicon.svg',
      tag: options.tag || 'default',
      data: options.data,
      requireInteraction: false,
      silent: false,
    });

    // Manejar click en la notificación
    notification.onclick = () => {
      window.focus();
      if (options.data?.url) {
        window.location.href = options.data.url;
      }
      notification.close();
    };

    return notification;
  }, [isEnabled, permission]);

  // Toggle de notificaciones
  const toggleNotifications = useCallback(async () => {
    if (!isEnabled && permission !== 'granted') {
      const granted = await requestPermission();
      return granted;
    }

    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('browser-notifications-enabled', String(newState));
    return newState;
  }, [isEnabled, permission, requestPermission]);

  return {
    permission,
    isEnabled,
    isSupported: 'Notification' in window,
    requestPermission,
    showNotification,
    toggleNotifications,
  };
};
