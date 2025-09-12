// Direct Kafka producer with optimized serverless configuration
import { Kafka } from 'kafkajs';

// Global producer instance for connection reuse
let globalProducer = null;
let connectionPromise = null;

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
      status: 'Direct Kafka Track API is working',
      timestamp: new Date().toISOString(),
      kafka_available: !!(process.env.KAFKA_BROKERS && process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD)
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

      console.log("📊 Direct Kafka Event:", JSON.stringify(trackingEvent, null, 2));

      // Send response immediately
      res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked (direct Kafka mode)",
        timestamp: trackingEvent.timestamp
      });

      // Try direct Kafka in background with aggressive timeouts
      if (process.env.KAFKA_BROKERS && process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
        setImmediate(async () => {
          try {
            console.log('🚀 Starting direct Kafka operation...');
            
            const producer = await getOrCreateProducer();
            
            const topic = process.env.KAFKA_TOPIC || 'sibi_web_events_store';
            console.log('📤 Sending to topic:', topic);

            const sendStart = Date.now();
            
            // Use Promise.race for timeout
            const result = await Promise.race([
              producer.send({
                topic: topic,
                messages: [{
                  key: trackingEvent.id,
                  value: JSON.stringify(trackingEvent),
                  headers: {
                    'event-type': trackingEvent.event_type,
                    'source': 'portfolio-direct',
                    'timestamp': trackingEvent.timestamp
                  }
                }]
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Send timeout after 5 seconds')), 5000)
              )
            ]);
            
            const sendTime = Date.now() - sendStart;
            console.log(`✅ Message sent in ${sendTime}ms`);
            console.log('📊 Send result:', result);
            console.log('📩 Direct Kafka send successful - MESSAGE SHOULD BE IN TOPIC NOW!');

          } catch (kafkaError) {
            console.error('❌ Direct Kafka failed:', kafkaError.message);
            console.error('❌ Error type:', kafkaError.constructor.name);
            
            // Reset producer on error
            if (globalProducer) {
              try {
                await globalProducer.disconnect();
              } catch (e) {
                console.error('❌ Error disconnecting producer:', e.message);
              }
              globalProducer = null;
              connectionPromise = null;
            }
          }
        });
      } else {
        console.log('⚠️ Direct Kafka environment variables missing');
        console.log('- KAFKA_BROKERS:', process.env.KAFKA_BROKERS ? 'Set' : 'Missing');
        console.log('- KAFKA_USERNAME:', process.env.KAFKA_USERNAME ? 'Set' : 'Missing');
        console.log('- KAFKA_PASSWORD:', process.env.KAFKA_PASSWORD ? 'Set' : 'Missing');
      }

      return; // Response already sent

    } catch (error) {
      console.error("❌ Direct tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getOrCreateProducer() {
  if (globalProducer && connectionPromise) {
    console.log('🔄 Reusing existing producer connection');
    await connectionPromise;
    return globalProducer;
  }

  console.log('🔄 Creating new direct Kafka producer...');
  
  // Optimized Kafka configuration for serverless
  const kafka = new Kafka({
    clientId: 'portfolio-direct',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
    },
    // Aggressive timeouts for serverless
    connectionTimeout: 3000,
    authenticationTimeout: 3000,
    requestTimeout: 5000,
    // Reduce retries for faster failure
    retry: {
      initialRetryTime: 100,
      retries: 2
    }
  });

  globalProducer = kafka.producer({
    // Optimize for serverless
    maxInFlightRequests: 1,
    idempotent: false,
    transactionTimeout: 5000,
    // Reduce batch settings for immediate sends
    batch: {
      size: 1,
      lingerMs: 0
    }
  });

  console.log('🔌 Connecting direct producer...');
  const connectStart = Date.now();
  
  connectionPromise = Promise.race([
    globalProducer.connect(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 8 seconds')), 8000)
    )
  ]);

  await connectionPromise;
  const connectTime = Date.now() - connectStart;
  console.log(`✅ Direct producer connected in ${connectTime}ms`);
  
  return globalProducer;
}
