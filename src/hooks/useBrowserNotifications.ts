// Simplified browser notifications hook - stub
export function useBrowserNotifications() {
  const isEnabled = false;
  const isSupported = false;
  const permission = 'default' as NotificationPermission;
  
  const showNotification = (_title: string, _options?: any) => {
    // No-op
  };

  const toggleNotifications = () => {
    // No-op
  };

  const requestPermission = async () => {
    // No-op
  };

  return { isEnabled, isSupported, permission, showNotification, toggleNotifications, requestPermission };
}
