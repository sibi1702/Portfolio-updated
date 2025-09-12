// Minimal tracking endpoint with basic Kafka configuration
import { Kafka } from 'kafkajs';

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
      status: 'Minimal Track API is working',
      timestamp: new Date().toISOString(),
      kafka_available: !!process.env.KAFKA_BROKERS
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

      console.log("📊 Minimal Track Event:", JSON.stringify(trackingEvent, null, 2));

      // Send response immediately
      res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked (minimal mode)",
        timestamp: trackingEvent.timestamp
      });

      // Try Kafka in background with minimal config
      if (process.env.KAFKA_BROKERS) {
        setImmediate(async () => {
          try {
            console.log('🚀 Starting minimal Kafka operation...');
            console.log('📋 Environment check:');
            console.log('- KAFKA_BROKERS:', process.env.KAFKA_BROKERS ? 'Set' : 'Missing');
            console.log('- KAFKA_USERNAME:', process.env.KAFKA_USERNAME ? 'Set' : 'Missing');
            console.log('- KAFKA_PASSWORD:', process.env.KAFKA_PASSWORD ? 'Set (length: ' + process.env.KAFKA_PASSWORD.length + ')' : 'Missing');
            console.log('- KAFKA_TOPIC:', process.env.KAFKA_TOPIC || 'click-events (default)');

            // Use the most basic Kafka configuration
            const kafka = new Kafka({
              clientId: 'portfolio-minimal',
              brokers: process.env.KAFKA_BROKERS.split(','),
              ssl: true,  // Simple SSL for Confluent Cloud
              sasl: {
                mechanism: 'plain',
                username: process.env.KAFKA_USERNAME,
                password: process.env.KAFKA_PASSWORD,
              },
              // Silence the partitioner warning
              logLevel: 1  // ERROR level only
            });

            const producer = kafka.producer();

            console.log('🔌 Connecting with minimal config...');
            const connectStart = Date.now();
            await producer.connect();
            const connectTime = Date.now() - connectStart;
            console.log(`✅ Minimal producer connected in ${connectTime}ms`);

            const topic = process.env.KAFKA_TOPIC || 'click-events';
            console.log('📤 Sending to topic:', topic);
            console.log('📦 Message payload:', {
              key: trackingEvent.id,
              valueLength: JSON.stringify(trackingEvent).length,
              headers: {
                'event-type': trackingEvent.event_type,
                'source': 'portfolio-minimal'
              }
            });

            const sendStart = Date.now();
            const result = await producer.send({
              topic: topic,
              messages: [{
                key: trackingEvent.id,
                value: JSON.stringify(trackingEvent),
                headers: {
                  'event-type': trackingEvent.event_type,
                  'source': 'portfolio-minimal'
                }
              }]
            });
            const sendTime = Date.now() - sendStart;

            console.log(`✅ Message sent in ${sendTime}ms`);
            console.log('📊 Send result:', result);

            const disconnectStart = Date.now();
            await producer.disconnect();
            const disconnectTime = Date.now() - disconnectStart;
            console.log(`🔌 Disconnected in ${disconnectTime}ms`);

            console.log('📩 Minimal Kafka send successful - COMPLETE');

          } catch (kafkaError) {
            console.error('❌ Minimal Kafka failed:', kafkaError.message);
            console.error('❌ Error type:', kafkaError.constructor.name);
            console.error('❌ Full error:', kafkaError);
            if (kafkaError.stack) {
              console.error('❌ Stack trace:', kafkaError.stack);
            }
          }
        });
      } else {
        console.log('⚠️ KAFKA_BROKERS not set');
      }

      return; // Response already sent

    } catch (error) {
      console.error("❌ Minimal tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
