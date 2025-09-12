// Simple Node.js function for Vercel
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow GET for testing
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'Track API is working with ES modules',
      timestamp: new Date().toISOString(),
      message: 'Send POST request to track events',
      node_version: process.version
    });
  }

  // Handle POST requests
  if (req.method === 'POST') {
    try {
      // Get client IP
      const clientIP = 
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        'unknown';

      // Generate simple ID (since crypto.randomUUID might not be available)
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

      const trackingEvent = {
        id,
        timestamp: new Date().toISOString(),
        ip: clientIP,
        url: req.body?.url || '',
        referrer: req.body?.referrer || '',
        user_agent: req.body?.user_agent || '',
        host: req.body?.host || '',
        event_type: req.body?.event_type || 'unknown',
        event_data: {
          element: req.body?.element,
          text: req.body?.text,
          scroll_depth: req.body?.scroll_depth,
          time_on_page: req.body?.time_on_page,
        }
      };

      console.log("📊 Tracking Event:", JSON.stringify(trackingEvent, null, 2));

      // For now, just log the event (we'll add Kafka back later)
      console.log("💾 Event logged successfully");

      return res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked successfully (logged only for now)",
        kafka_sent: false,
        timestamp: trackingEvent.timestamp
      });

    } catch (error) {
      console.error("❌ Tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}