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
    const kafkaAvailable = !!(process.env.KAFKA_REST_URL &&
                             (process.env.KAFKA_API_KEY || process.env.KAFKA_USERNAME) &&
                             (process.env.KAFKA_API_SECRET || process.env.KAFKA_PASSWORD));

    return res.status(200).json({
      status: 'REST Track API is working',
      timestamp: new Date().toISOString(),
      kafka_available: kafkaAvailable,
      debug: {
        rest_url_set: !!process.env.KAFKA_REST_URL,
        api_key_set: !!process.env.KAFKA_API_KEY,
        username_set: !!process.env.KAFKA_USERNAME,
        password_set: !!process.env.KAFKA_PASSWORD,
        secret_set: !!process.env.KAFKA_API_SECRET,
        topic_set: !!process.env.KAFKA_TOPIC
      }
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

      // Try Kafka REST API in background - check multiple variable name patterns
      const restUrl = process.env.KAFKA_REST_URL;
      const apiKey = process.env.KAFKA_API_KEY || process.env.KAFKA_USERNAME;
      const apiSecret = process.env.KAFKA_API_SECRET || process.env.KAFKA_PASSWORD;

      console.log('🔍 Environment variable debug:');
      console.log('- KAFKA_REST_URL:', process.env.KAFKA_REST_URL ? 'Set' : 'Missing');
      console.log('- KAFKA_API_KEY:', process.env.KAFKA_API_KEY ? 'Set' : 'Missing');
      console.log('- KAFKA_API_SECRET:', process.env.KAFKA_API_SECRET ? 'Set' : 'Missing');
      console.log('- KAFKA_USERNAME:', process.env.KAFKA_USERNAME ? 'Set' : 'Missing');
      console.log('- KAFKA_PASSWORD:', process.env.KAFKA_PASSWORD ? 'Set' : 'Missing');
      console.log('- KAFKA_BROKERS:', process.env.KAFKA_BROKERS ? 'Set' : 'Missing');
      console.log('- KAFKA_TOPIC:', process.env.KAFKA_TOPIC ? 'Set' : 'Missing');

      if (restUrl && apiKey && apiSecret) {
        setImmediate(async () => {
          try {
            console.log('🚀 Starting Kafka REST operation...');
            console.log('📋 Using credentials:');
            console.log('- REST URL:', restUrl);
            console.log('- API Key:', apiKey ? 'Set' : 'Missing');
            console.log('- API Secret:', apiSecret ? 'Set (length: ' + apiSecret.length + ')' : 'Missing');

            const topic = process.env.KAFKA_TOPIC || 'click-events';
            const topicUrl = `${restUrl}/topics/${topic}`;

            // Create Basic Auth header
            const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

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

            console.log('📤 Sending to REST URL:', topicUrl);
            console.log('📦 REST Payload:', JSON.stringify(payload, null, 2));
            console.log('🔐 Auth header length:', auth.length);

            const fetchStart = Date.now();
            const response = await Promise.race([
              fetch(topicUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/vnd.kafka.json.v2+json',
                  'Accept': 'application/vnd.kafka.v2+json',
                  'Authorization': `Basic ${auth}`
                },
                body: JSON.stringify(payload)
              }),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('REST API timeout after 10 seconds')), 10000)
              )
            ]);
            const fetchTime = Date.now() - fetchStart;

            console.log(`📡 REST Response received in ${fetchTime}ms`);
            console.log('📡 REST Response status:', response.status);
            console.log('📡 REST Response statusText:', response.statusText);
            console.log('📡 REST Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
              const errorText = await response.text();
              console.error('❌ REST API error response:', errorText);
              console.error('❌ Full response details:', {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries(response.headers.entries()),
                body: errorText
              });
              throw new Error(`REST API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ REST API success:', result);
            console.log('📩 Kafka REST send successful - MESSAGE SHOULD BE IN TOPIC NOW!');

          } catch (restError) {
            console.error('❌ Kafka REST failed:', restError.message);
            console.error('❌ Full REST error:', restError);
          }
        });
      } else {
        console.log('⚠️ Kafka REST environment variables missing:');
        console.log('- Need KAFKA_REST_URL:', restUrl ? '✅' : '❌');
        console.log('- Need API Key (KAFKA_API_KEY or KAFKA_USERNAME):', apiKey ? '✅' : '❌');
        console.log('- Need API Secret (KAFKA_API_SECRET or KAFKA_PASSWORD):', apiSecret ? '✅' : '❌');
        console.log('');
        console.log('💡 To fix: Add KAFKA_REST_URL to your Vercel environment variables');
        console.log('💡 Example: https://pkc-619z3.us-east1.gcp.confluent.cloud:443');
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
