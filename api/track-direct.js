// Improved Direct Kafka producer with better error handling and debugging
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
      status: 'Improved Direct Kafka Track API is working',
      timestamp: new Date().toISOString(),
      kafka_available: !!(process.env.KAFKA_BROKERS && process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD),
      topic: process.env.KAFKA_TOPIC || 'sibi_web_events_store'
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
        event_data: req.body?.event_data || {},
        // Add explicit tracking fields
        source: 'portfolio-improved',
        version: '2.0'
      };

      console.log("📊 Improved Event:", JSON.stringify(trackingEvent, null, 2));

      // Send response immediately
      res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked (improved direct Kafka mode)",
        timestamp: trackingEvent.timestamp,
        topic: process.env.KAFKA_TOPIC || 'sibi_web_events_store'
      });

      // Try direct Kafka in background with better error handling
      if (process.env.KAFKA_BROKERS && process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
        setImmediate(async () => {
          try {
            console.log('🚀 Starting improved Kafka operation...');
            
            const producer = await getOrCreateProducer();
            const topic = process.env.KAFKA_TOPIC || 'sibi_web_events_store';
            
            console.log('📤 Sending to topic:', topic);
            console.log('🔑 Message key:', trackingEvent.id);

            const sendStart = Date.now();
            
            // Improved send with explicit configuration
            const result = await Promise.race([
              producer.send({
                topic: topic,
                messages: [{
                  // Use a more predictable key for debugging
                  key: `portfolio_${trackingEvent.event_type}_${trackingEvent.id}`,
                  value: JSON.stringify(trackingEvent),
                  headers: {
                    'event-type': trackingEvent.event_type,
                    'source': 'portfolio-improved',
                    'timestamp': trackingEvent.timestamp,
                    'content-type': 'application/json',
                    'version': '2.0'
                  },
                  // Optional: specify partition if needed
                  // partition: 0
                }]
              }),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Send timeout after 8 seconds')), 8000)
              )
            ]);
            
            const sendTime = Date.now() - sendStart;
            console.log(`✅ Message sent successfully in ${sendTime}ms`);
            console.log('📊 Send result details:');
            console.log('- Topic:', result[0].topicName);
            console.log('- Partition:', result[0].partition);
            console.log('- Offset:', result[0].offset);
            console.log('- Timestamp:', result[0].timestamp);
            console.log('🎉 SUCCESS: Message is now in Kafka topic!');
            console.log(`🔍 To verify, check topic '${topic}' partition ${result[0].partition} at offset ${result[0].offset}`);

            // Log success metrics
            console.log('📈 Success metrics:');
            console.log(`- Event ID: ${trackingEvent.id}`);
            console.log(`- Topic: ${result[0].topicName}`);
            console.log(`- Partition: ${result[0].partition}`);
            console.log(`- Offset: ${result[0].offset}`);
            console.log(`- Send time: ${sendTime}ms`);

          } catch (kafkaError) {
            console.error('❌ Improved Kafka failed:', kafkaError.message);
            console.error('❌ Error details:');
            console.error('- Error type:', kafkaError.constructor.name);
            console.error('- Error code:', kafkaError.code);
            console.error('- Stack:', kafkaError.stack);
            
            // Log environment for debugging
            console.error('🔍 Environment debug:');
            console.error('- KAFKA_BROKERS:', process.env.KAFKA_BROKERS ? 'Set' : 'Missing');
            console.error('- KAFKA_USERNAME:', process.env.KAFKA_USERNAME ? 'Set' : 'Missing');
            console.error('- KAFKA_PASSWORD:', process.env.KAFKA_PASSWORD ? 'Set (length: ' + process.env.KAFKA_PASSWORD.length + ')' : 'Missing');
            console.error('- KAFKA_TOPIC:', process.env.KAFKA_TOPIC || 'Using default');
            
            // Reset producer on error for next attempt
            if (globalProducer) {
              try {
                await globalProducer.disconnect();
                console.log('🔌 Producer disconnected after error');
              } catch (e) {
                console.error('❌ Error disconnecting producer:', e.message);
              }
              globalProducer = null;
              connectionPromise = null;
            }
          }
        });
      } else {
        console.log('⚠️ Kafka environment variables missing:');
        console.log('- KAFKA_BROKERS:', process.env.KAFKA_BROKERS ? 'Set' : 'Missing');
        console.log('- KAFKA_USERNAME:', process.env.KAFKA_USERNAME ? 'Set' : 'Missing');
        console.log('- KAFKA_PASSWORD:', process.env.KAFKA_PASSWORD ? 'Set' : 'Missing');
      }

      return; // Response already sent

    } catch (error) {
      console.error("❌ Improved tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

async function getOrCreateProducer() {
  if (globalProducer && connectionPromise) {
    console.log('🔄 Reusing existing producer connection');
    try {
      await connectionPromise;
      return globalProducer;
    } catch (error) {
      console.log('❌ Existing connection failed, creating new one');
      globalProducer = null;
      connectionPromise = null;
    }
  }

  console.log('🔄 Creating new improved Kafka producer...');
  
  // Enhanced Kafka configuration
  const kafka = new Kafka({
    clientId: 'portfolio-improved-v2',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: true,
    sasl: {
      mechanism: 'plain',
      username: process.env.KAFKA_USERNAME,
      password: process.env.KAFKA_PASSWORD,
    },
    // Balanced timeouts for serverless
    connectionTimeout: 5000,
    authenticationTimeout: 5000,
    requestTimeout: 8000,
    // Retry configuration
    retry: {
      initialRetryTime: 300,
      retries: 3,
      maxRetryTime: 30000,
      factor: 2
    },
    // Add logging for debugging
    logLevel: 1 // ERROR level
  });

  globalProducer = kafka.producer({
    // Optimize for reliability
    maxInFlightRequests: 1,
    idempotent: true, // Enable idempotence for better reliability
    transactionTimeout: 10000,
    // Batch settings for immediate sends
    batch: {
      size: 1,
      lingerMs: 0
    },
    // Retry settings
    retry: {
      initialRetryTime: 100,
      retries: 3
    }
  });

  console.log('🔌 Connecting improved producer...');
  const connectStart = Date.now();
  
  connectionPromise = Promise.race([
    globalProducer.connect(),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    )
  ]);

  await connectionPromise;
  const connectTime = Date.now() - connectStart;
  console.log(`✅ Improved producer connected in ${connectTime}ms`);
  
  return globalProducer;
}