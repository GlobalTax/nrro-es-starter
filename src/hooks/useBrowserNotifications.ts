// Simplified browser notifications hook - stub
export function useBrowserNotifications() {
  const isEnabled = false;
  
  const showNotification = (_title: string, _options?: NotificationOptions) => {
    // No-op: browser notifications disabled
  };

  return { isEnabled, showNotification };
}
