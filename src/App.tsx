import React, { useEffect } from 'react';
import Home from './pages/home';
import VideoBackground from './components/common/VideoBackground';

const App: React.FC = () => {
  useEffect(() => {
    // Use same domain API route - no CORS issues!
    const TRACKING_URL = '/api/track';
    
    const sendEvent = (eventType: string, additionalData: Record<string, unknown> = {}) => {
      const eventData = {
        url: window.location.href,
        referrer: document.referrer || '',
        user_agent: navigator.userAgent,
        host: window.location.hostname, // Dynamic hostname instead of hardcoded
        event_time: new Date().toISOString(),
        event_type: eventType,
        ...additionalData
      };
      
      fetch(TRACKING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      }).catch(error => {
        console.debug('Tracking failed:', error);
      });
    };

    // Track page view when app loads - this captures who's visiting
    sendEvent('page_view');

    // No cleanup needed since we're only tracking page views
  }, []);

  return (
    <div className="min-h-screen">
      <VideoBackground />
      <div className="fixed inset-0 bg-black/50 z-10" />
      <div className="relative z-20">
        <Home />
      </div>
    </div>
  );
};

export default App;