// Simple Node.js function for Vercel with Kafka integration
import { Kafka } from 'kafkajs';

// Initialize Kafka client
let kafka = null;
let producer = null;

const initKafka = async () => {
  if (!kafka && process.env.KAFKA_BROKERS) {
    try {
      const kafkaConfig = {
        clientId: process.env.KAFKA_CLIENT_ID || 'portfolio-tracker',
        brokers: process.env.KAFKA_BROKERS.split(','),
      };

      // Add authentication if provided
      if (process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
        kafkaConfig.sasl = {
          mechanism: 'plain',
          username: process.env.KAFKA_USERNAME,
          password: process.env.KAFKA_PASSWORD,
        };
      }

      // Add SSL if required
      if (process.env.KAFKA_SSL === 'true') {
        kafkaConfig.ssl = true;
      }

      kafka = new Kafka(kafkaConfig);
      producer = kafka.producer();
      await producer.connect();
      console.log('✅ Kafka producer connected successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Kafka:', error);
      kafka = null;
      producer = null;
    }
  }
};

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
      status: 'Track API is working with ES modules',
      timestamp: new Date().toISOString(),
      message: 'Send POST request to track events',
      node_version: process.version
    });
  }

  // Handle POST requests
  if (req.method === 'POST') {
    try {
      // Initialize Kafka if not already done
      await initKafka();

      // Get client IP
      const clientIP =
        req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        'unknown';

      // Generate simple ID (since crypto.randomUUID might not be available)
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

      console.log("📊 Tracking Event:", JSON.stringify(trackingEvent, null, 2));

      let kafkaSent = false;
      let kafkaError = null;

      // Try to send to Kafka if producer is available
      if (producer) {
        try {
          const topic = process.env.KAFKA_TOPIC || 'click-events';

          await producer.send({
            topic: topic,
            messages: [
              {
                key: trackingEvent.id,
                value: JSON.stringify(trackingEvent),
                timestamp: Date.now().toString(),
                headers: {
                  'event-type': trackingEvent.event_type,
                  'source': 'portfolio-website'
                }
              }
            ]
          });

          kafkaSent = true;
          console.log("📩 Event sent to Kafka successfully");
        } catch (kafkaErr) {
          console.error("❌ Failed to send to Kafka:", kafkaErr);
          kafkaError = kafkaErr.message;
        }
      } else {
        console.log("⚠️ Kafka producer not available, logging only");
      }

      // Always log the event locally as backup
      console.log("💾 Event logged successfully");

      return res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: kafkaSent ? "Event tracked and sent to Kafka" : "Event tracked (Kafka unavailable)",
        kafka_sent: kafkaSent,
        kafka_error: kafkaError,
        timestamp: trackingEvent.timestamp
      });

    } catch (error) {
      console.error("❌ Tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message,
        kafka_sent: false
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Graceful shutdown handler for Kafka producer
process.on('SIGTERM', async () => {
  if (producer) {
    try {
      await producer.disconnect();
      console.log('🔌 Kafka producer disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting Kafka producer:', error);
    }
  }
});

process.on('SIGINT', async () => {
  if (producer) {
    try {
      await producer.disconnect();
      console.log('🔌 Kafka producer disconnected');
    } catch (error) {
      console.error('❌ Error disconnecting Kafka producer:', error);
    }
  }
});