// Ultra-simple tracking endpoint with minimal Kafka overhead
import { Kafka } from 'kafkajs';

// Global producer instance to reuse connections
let globalProducer = null;
let isConnecting = false;

const getProducer = async () => {
  if (globalProducer) {
    return globalProducer;
  }

  if (isConnecting) {
    // Wait for existing connection attempt
    await new Promise(resolve => setTimeout(resolve, 100));
    return globalProducer;
  }

  if (!process.env.KAFKA_BROKERS) {
    return null;
  }

  try {
    isConnecting = true;
    console.log('🔄 Creating new Kafka producer...');

    const kafka = new Kafka({
      clientId: 'portfolio-simple',
      brokers: process.env.KAFKA_BROKERS.split(','),
      connectionTimeout: 5000,  // Increase for TLS handshake
      requestTimeout: 8000,
      authenticationTimeout: 5000,
      retry: {
        initialRetryTime: 100,
        retries: 1  // Allow one retry for TLS issues
      },
      sasl: process.env.KAFKA_USERNAME ? {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      } : undefined,
      ssl: process.env.KAFKA_SSL === 'true' || process.env.KAFKA_BROKERS.includes('confluent.cloud') ? {
        rejectUnauthorized: true,
        // Add specific TLS options for Confluent Cloud
        servername: process.env.KAFKA_BROKERS.split(',')[0].split(':')[0],
        checkServerIdentity: () => undefined  // Disable hostname verification for serverless
      } : false
    });

    const producer = kafka.producer({
      maxInFlightRequests: 1,
      idempotent: false
    });

    // Connect with timeout (longer for TLS handshake)
    await Promise.race([
      producer.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 8000))
    ]);

    globalProducer = producer;
    console.log('✅ Global producer connected');
    return producer;

  } catch (error) {
    console.error('❌ Failed to create producer:', error.message);
    return null;
  } finally {
    isConnecting = false;
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'Simple Track API is working',
      timestamp: new Date().toISOString(),
      kafka_available: !!process.env.KAFKA_BROKERS,
      producer_ready: !!globalProducer
    });
  }

  if (req.method === 'POST') {
    try {
      // Create event data
      const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const trackingEvent = {
        id,
        timestamp: new Date().toISOString(),
        ip: req.headers['x-forwarded-for']?.split(',')[0] || req.headers['x-real-ip'] || 'unknown',
        url: req.body?.url || '',
        referrer: req.body?.referrer || '',
        user_agent: req.body?.user_agent || '',
        host: req.body?.host || '',
        event_type: req.body?.event_type || 'unknown',
        event_data: req.body?.event_data || {}
      };

      console.log("📊 Simple Track Event:", JSON.stringify(trackingEvent, null, 2));

      // Send response immediately
      res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked (simple mode)",
        timestamp: trackingEvent.timestamp
      });

      // Try Kafka in background (non-blocking)
      setImmediate(async () => {
        try {
          const producer = await getProducer();
          if (!producer) {
            console.log('⚠️ No Kafka producer available');
            return;
          }

          const topic = process.env.KAFKA_TOPIC || 'click-events';
          
          // Send with timeout
          await Promise.race([
            producer.send({
              topic: topic,
              messages: [{
                key: trackingEvent.id,
                value: JSON.stringify(trackingEvent),
                headers: {
                  'event-type': trackingEvent.event_type,
                  'source': 'portfolio-simple'
                }
              }]
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Send timeout')), 2000))
          ]);

          console.log('📩 Simple Kafka send successful');
        } catch (kafkaError) {
          console.error('❌ Simple Kafka failed:', kafkaError.message);
          
          // Reset producer on error
          if (globalProducer) {
            try {
              await globalProducer.disconnect();
            } catch (e) {
              // Ignore disconnect errors
            }
            globalProducer = null;
          }
        }
      });

      return; // Response already sent

    } catch (error) {
      console.error("❌ Simple tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// Cleanup on process termination
process.on('SIGTERM', async () => {
  if (globalProducer) {
    try {
      await globalProducer.disconnect();
      console.log('🔌 Global producer disconnected on SIGTERM');
    } catch (error) {
      console.error('❌ Error disconnecting on SIGTERM:', error);
    }
  }
});

process.on('SIGINT', async () => {
  if (globalProducer) {
    try {
      await globalProducer.disconnect();
      console.log('🔌 Global producer disconnected on SIGINT');
    } catch (error) {
      console.error('❌ Error disconnecting on SIGINT:', error);
    }
  }
});
