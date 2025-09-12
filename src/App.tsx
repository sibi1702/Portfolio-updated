import React, { useEffect } from 'react';
import Home from './pages/home';
import VideoBackground from './components/common/VideoBackground';

const App: React.FC = () => {
  useEffect(() => {
    // Check if we're in production (deployed) or development
    const isDev = process.env.NODE_ENV === 'development';
    const baseUrl = isDev ? 'http://localhost:3000' : '';

    const TRACKING_URL = `${baseUrl}/api/track-rest`;

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

    // Track initial page view
    sendEvent('page_view', {
      section: window.location.hash || '#home',
      timestamp: Date.now()
    });

    // Track hash changes (navigation between sections)
    const handleHashChange = () => {
      const section = window.location.hash || '#home';
      sendEvent('section_view', {
        section: section,
        previous_section: document.referrer,
        timestamp: Date.now()
      });
    };

    // Track clicks on navigation and interactive elements
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const href = target.getAttribute('href');
      const text = target.textContent?.trim() || '';

      // Track navigation clicks
      if (href && href.startsWith('#')) {
        sendEvent('navigation_click', {
          section: href,
          element: tagName,
          text: text,
          timestamp: Date.now()
        });
      }

      // Track button clicks
      if (tagName === 'button' || target.closest('button')) {
        const button = tagName === 'button' ? target : target.closest('button');
        sendEvent('button_click', {
          button_text: button?.textContent?.trim() || '',
          button_class: button?.className || '',
          section: window.location.hash || '#home',
          timestamp: Date.now()
        });
      }

      // Track link clicks
      if (tagName === 'a' || target.closest('a')) {
        const link = tagName === 'a' ? target : target.closest('a');
        const linkHref = link?.getAttribute('href') || '';
        sendEvent('link_click', {
          url: linkHref,
          text: link?.textContent?.trim() || '',
          section: window.location.hash || '#home',
          external: !linkHref.startsWith('#') && !linkHref.startsWith('/'),
          timestamp: Date.now()
        });
      }
    };

    // Track scroll depth
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScrollDepth && scrollPercent % 25 === 0) {
        maxScrollDepth = scrollPercent;
        sendEvent('scroll_depth', {
          depth_percent: scrollPercent,
          section: window.location.hash || '#home',
          timestamp: Date.now()
        });
      }
    };

    // Track section visibility using Intersection Observer
    const observeSections = () => {
      const sections = ['home', 'about', 'timeline', 'projects', 'honors', 'skills', 'contact'];
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              const sectionId = entry.target.id;
              sendEvent('section_visible', {
                section: `#${sectionId}`,
                visibility_ratio: Math.round(entry.intersectionRatio * 100),
                timestamp: Date.now()
              });
            }
          });
        },
        { threshold: [0.5] }
      );

      // Observe all sections
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          observer.observe(element);
        }
      });

      return observer;
    };

    // Start observing sections after a short delay to ensure DOM is ready
    const sectionObserver = setTimeout(() => {
      const observer = observeSections();

      // Store observer for cleanup
      (window as any).sectionObserver = observer;
    }, 1000);

    // Add event listeners
    window.addEventListener('hashchange', handleHashChange);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    // Cleanup function
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);

      // Cleanup section observer
      if ((window as any).sectionObserver) {
        (window as any).sectionObserver.disconnect();
      }
      clearTimeout(sectionObserver);
    };

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