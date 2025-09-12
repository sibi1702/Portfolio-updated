import React, { useEffect } from 'react';
import Home from './pages/home';
import VideoBackground from './components/common/VideoBackground';

const App: React.FC = () => {
  useEffect(() => {
    // Check if we're in production (deployed) or development
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://localhost:3000' : '';
    
    const TRACKING_URL = `${baseUrl}/api/track`;

    const sendEvent = (eventType: string, additionalData: Record<string, unknown> = {}) => {
      const eventData = {
        url: window.location.href,
        referrer: document.referrer || '',
        user_agent: navigator.userAgent,
        host: window.location.hostname,
        event_time: new Date().toISOString(),
        event_type: eventType,
        ...additionalData
      };

      console.log('🚀 Sending tracking event to:', TRACKING_URL);
      console.log('📦 Event data:', eventData);

      fetch(TRACKING_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      })
      .then(response => {
        console.log('📡 Response status:', response.status);
        console.log('🔗 Response URL:', response.url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return response.json();
      })
      .then(data => {
        console.log('✅ Tracking success:', data);
        if (data.kafka_sent) {
          console.log('📩 Data sent to Kafka');
        } else {
          console.log('⚠️ Kafka not available, data logged only');
        }
      })
      .catch(error => {
        console.error('❌ Tracking failed:', error);
        console.error('🔍 Check if /api/track endpoint exists');
        console.error('🔍 Verify file structure: /api/track.ts in project root');
      });
    };

    // Track page view when app loads
    sendEvent('page_view');

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