// Kafka tracking using Confluent Cloud REST Proxy API
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
      status: 'REST Track API is working',
      timestamp: new Date().toISOString(),
      kafka_available: !!(process.env.KAFKA_REST_URL && process.env.KAFKA_API_KEY)
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

      console.log("📊 REST Track Event:", JSON.stringify(trackingEvent, null, 2));

      // Send response immediately
      res.status(200).json({
        success: true,
        eventId: trackingEvent.id,
        message: "Event tracked (REST mode)",
        timestamp: trackingEvent.timestamp
      });

      // Try Kafka REST API in background
      if (process.env.KAFKA_REST_URL && process.env.KAFKA_API_KEY) {
        setImmediate(async () => {
          try {
            console.log('🚀 Starting Kafka REST operation...');
            console.log('📋 REST Environment check:');
            console.log('- KAFKA_REST_URL:', process.env.KAFKA_REST_URL ? 'Set' : 'Missing');
            console.log('- KAFKA_API_KEY:', process.env.KAFKA_API_KEY ? 'Set' : 'Missing');
            console.log('- KAFKA_API_SECRET:', process.env.KAFKA_API_SECRET ? 'Set' : 'Missing');
            console.log('- KAFKA_TOPIC:', process.env.KAFKA_TOPIC || 'click-events (default)');

            const topic = process.env.KAFKA_TOPIC || 'click-events';
            const restUrl = `${process.env.KAFKA_REST_URL}/topics/${topic}`;
            
            // Create Basic Auth header
            const auth = Buffer.from(`${process.env.KAFKA_API_KEY}:${process.env.KAFKA_API_SECRET}`).toString('base64');
            
            const payload = {
              records: [
                {
                  key: trackingEvent.id,
                  value: trackingEvent,
                  headers: {
                    'event-type': trackingEvent.event_type,
                    'source': 'portfolio-rest'
                  }
                }
              ]
            };

            console.log('📤 Sending to REST URL:', restUrl);
            console.log('📦 REST Payload:', JSON.stringify(payload, null, 2));

            const response = await fetch(restUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/vnd.kafka.json.v2+json',
                'Accept': 'application/vnd.kafka.v2+json',
                'Authorization': `Basic ${auth}`
              },
              body: JSON.stringify(payload)
            });

            console.log('📡 REST Response status:', response.status);
            console.log('📡 REST Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
              const errorText = await response.text();
              console.error('❌ REST API error response:', errorText);
              throw new Error(`REST API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ REST API success:', result);
            console.log('📩 Kafka REST send successful');

          } catch (restError) {
            console.error('❌ Kafka REST failed:', restError.message);
            console.error('❌ Full REST error:', restError);
          }
        });
      } else {
        console.log('⚠️ Kafka REST environment variables not set');
        console.log('Required: KAFKA_REST_URL, KAFKA_API_KEY, KAFKA_API_SECRET');
      }

      return; // Response already sent

    } catch (error) {
      console.error("❌ REST tracking error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to process tracking event",
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
