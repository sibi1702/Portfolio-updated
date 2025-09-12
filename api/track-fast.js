// Fast tracking endpoint - prioritizes speed over Kafka reliability
export default async function handler(req, res) {
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
      status: 'Fast Track API is working',
      timestamp: new Date().toISOString(),
      message: 'Send POST request to track events',
      kafka_enabled: !!process.env.KAFKA_BROKERS
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

      // Generate simple ID
      const id = Date.now().toString(36) + Math.random().toString(36).substring(2);

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

      console.log("📊 Fast Track Event:", JSON.stringify(trackingEvent, null, 2));

      // Respond immediately to avoid timeout
      const response = {
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked successfully (fast mode)",
        kafka_sent: false,
        timestamp: trackingEvent.timestamp
      };

      // Send response first
      res.status(200).json(response);

      // Try Kafka in background (fire and forget)
      if (process.env.KAFKA_BROKERS) {
        setImmediate(async () => {
          try {
            const { Kafka } = await import('kafkajs');
            
            const kafka = new Kafka({
              clientId: 'portfolio-fast-tracker',
              brokers: process.env.KAFKA_BROKERS.split(','),
              connectionTimeout: 2000,
              requestTimeout: 3000,
              retry: { retries: 0 }
            });

            if (process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
              kafka.sasl = {
                mechanism: 'plain',
                username: process.env.KAFKA_USERNAME,
                password: process.env.KAFKA_PASSWORD,
              };
            }

            if (process.env.KAFKA_SSL === 'true') {
              kafka.ssl = true;
            }

            const producer = kafka.producer();
            await producer.connect();
            
            await producer.send({
              topic: process.env.KAFKA_TOPIC || 'click-events',
              messages: [{
                key: trackingEvent.id,
                value: JSON.stringify(trackingEvent),
                headers: {
                  'event-type': trackingEvent.event_type,
                  'source': 'portfolio-website-fast'
                }
              }]
            });

            await producer.disconnect();
            console.log("📩 Background Kafka send successful");
          } catch (kafkaError) {
            console.error("❌ Background Kafka failed:", kafkaError.message);
          }
        });
      }

      // Don't return here since we already sent the response
      return;

    } catch (error) {
      console.error("❌ Fast tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
