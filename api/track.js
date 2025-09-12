const { randomUUID } = require('crypto');

module.exports = async function handler(req, res) {
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
      status: 'Track API is working',
      timestamp: new Date().toISOString(),
      message: 'Send POST request to track events',
      environment: {
        node_version: process.version,
        kafka_configured: !!(process.env.KAFKA_BROKER && process.env.KAFKA_KEY)
      }
    });
  }

  // Handle POST requests
  if (req.method === 'POST') {
    try {
      // Get client IP
      const clientIP = 
        (req.headers['x-forwarded-for'] && req.headers['x-forwarded-for'].split(',')[0]) ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        'unknown';

      const trackingEvent = {
        id: randomUUID(),
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

      // Try Kafka if environment variables are set
      let kafkaSent = false;
      
      if (process.env.KAFKA_BROKER && process.env.KAFKA_KEY && process.env.KAFKA_SECRET) {
        try {
          console.log("🚀 Attempting Kafka connection...");
          
          // Dynamic import for Kafka
          const { Kafka, Partitioners } = require('kafkajs');
          
          const kafka = new Kafka({
            clientId: "vercel-tracking",
            brokers: [process.env.KAFKA_BROKER],
            ssl: true,
            sasl: {
              mechanism: "plain",
              username: process.env.KAFKA_KEY,
              password: process.env.KAFKA_SECRET,
            },
            connectionTimeout: 5000,
            authenticationTimeout: 5000,
            retry: {
              initialRetryTime: 100,
              retries: 2,
            },
          });

          const producer = kafka.producer({
            createPartitioner: Partitioners.LegacyPartitioner,
            maxInFlightRequests: 1,
            idempotent: false,
          });

          await producer.connect();
          console.log("✅ Kafka producer connected");
          
          await producer.send({
            topic: process.env.KAFKA_TOPIC || "sibi_web_events_store",
            messages: [{ value: JSON.stringify(trackingEvent) }],
          });
          
          await producer.disconnect();
          kafkaSent = true;
          console.log("📩 Event sent to Kafka successfully");
          
        } catch (kafkaError) {
          console.error("❌ Kafka send failed:", kafkaError.message);
          console.error("🔍 Kafka error details:", kafkaError);
          // Continue anyway - don't fail the request
        }
      } else {
        console.log("⚠️ Kafka environment variables not set:");
        console.log("- KAFKA_BROKER:", !!process.env.KAFKA_BROKER);
        console.log("- KAFKA_KEY:", !!process.env.KAFKA_KEY);
        console.log("- KAFKA_SECRET:", !!process.env.KAFKA_SECRET);
      }

      return res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked successfully",
        kafka_sent: kafkaSent,
        timestamp: trackingEvent.timestamp,
        debug: {
          method: req.method,
          content_type: req.headers['content-type'],
          body_received: !!req.body,
          event_type: trackingEvent.event_type
        }
      });

    } catch (error) {
      console.error("❌ Tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};