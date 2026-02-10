// Analytics event tracking hook with GTM integration

export const useAnalytics = () => {
  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Push to GTM dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...properties,
      });
    }
  };

  const trackCTAClick = (ctaName: string, location: string) => {
    trackEvent("cta_clicked", {
      cta_name: ctaName,
      page_location: location,
      timestamp: new Date().toISOString(),
    });
  };

  const trackPageView = (pageName: string) => {
    trackEvent("page_view", {
      page_name: pageName,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      timestamp: new Date().toISOString(),
    });
  };

  const trackFormSubmit = (formName: string, formData?: Record<string, any>) => {
    trackEvent("form_submit", {
      form_name: formName,
      ...formData,
      timestamp: new Date().toISOString(),
    });
  };

  const trackContactClick = (
    contactType: 'phone' | 'email',
    contactValue: string,
    location: string
  ) => {
    trackEvent('contact_click', {
      contact_type: contactType,
      contact_value: contactValue,
      page_location: location,
      timestamp: new Date().toISOString(),
    });
  };

  const trackDownload = (
    fileType: 'cv' | 'csv' | 'excel' | 'pdf',
    fileName: string,
    location: string
  ) => {
    trackEvent('file_download', {
      file_type: fileType,
      file_name: fileName,
      page_location: location,
      timestamp: new Date().toISOString(),
    });
  };

  const trackScrollDepth = (
    depth: 25 | 50 | 75 | 90 | 100,
    pagePath: string
  ) => {
    trackEvent('scroll_depth', {
      scroll_percentage: depth,
      page_path: pagePath,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    trackEvent,
    trackCTAClick,
    trackPageView,
    trackFormSubmit,
    trackContactClick,
    trackDownload,
    trackScrollDepth,
  };
};
