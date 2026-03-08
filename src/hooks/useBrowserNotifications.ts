export function useBrowserNotifications() {
  const isEnabled = false;
  const isSupported = false;
  const permission = 'default' as NotificationPermission;
  
  const showNotification = (_title: string, _options?: any) => {
    // No-op
  };

  const toggleNotifications = async (): Promise<boolean> => {
    return false;
  };

  const requestPermission = async (): Promise<boolean> => {
    return false;
  };

  return { isEnabled, isSupported, permission, showNotification, toggleNotifications, requestPermission };
}
