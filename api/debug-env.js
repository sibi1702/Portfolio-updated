// Debug endpoint to check environment variables
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Security check - only allow in development or with a secret key
  const debugKey = req.query.key;
  if (process.env.NODE_ENV === 'production' && debugKey !== 'debug123') {
    return res.status(403).json({ error: 'Access denied' });
  }

  // Check all Kafka-related environment variables
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment_variables: {
      // Original Kafka variables
      KAFKA_BROKERS: process.env.KAFKA_BROKERS ? {
        status: 'Set',
        value: process.env.KAFKA_BROKERS
      } : { status: 'Missing', value: null },
      
      KAFKA_USERNAME: process.env.KAFKA_USERNAME ? {
        status: 'Set',
        value: process.env.KAFKA_USERNAME
      } : { status: 'Missing', value: null },
      
      KAFKA_PASSWORD: process.env.KAFKA_PASSWORD ? {
        status: 'Set',
        length: process.env.KAFKA_PASSWORD.length,
        preview: process.env.KAFKA_PASSWORD.substring(0, 10) + '...'
      } : { status: 'Missing', value: null },
      
      KAFKA_TOPIC: process.env.KAFKA_TOPIC ? {
        status: 'Set',
        value: process.env.KAFKA_TOPIC
      } : { status: 'Missing', value: null },
      
      KAFKA_SSL: process.env.KAFKA_SSL ? {
        status: 'Set',
        value: process.env.KAFKA_SSL
      } : { status: 'Missing', value: null },
      
      // REST API variables
      KAFKA_REST_URL: process.env.KAFKA_REST_URL ? {
        status: 'Set',
        value: process.env.KAFKA_REST_URL
      } : { status: 'Missing', value: null },
      
      KAFKA_API_KEY: process.env.KAFKA_API_KEY ? {
        status: 'Set',
        value: process.env.KAFKA_API_KEY
      } : { status: 'Missing', value: null },
      
      KAFKA_API_SECRET: process.env.KAFKA_API_SECRET ? {
        status: 'Set',
        length: process.env.KAFKA_API_SECRET?.length,
        preview: process.env.KAFKA_API_SECRET?.substring(0, 10) + '...'
      } : { status: 'Missing', value: null }
    },
    
    recommendations: []
  };

  // Add recommendations based on what's missing
  if (!process.env.KAFKA_REST_URL) {
    envCheck.recommendations.push({
      issue: 'KAFKA_REST_URL is missing',
      solution: 'Add KAFKA_REST_URL=https://pkc-619z3.us-east1.gcp.confluent.cloud:443 to Vercel environment variables',
      priority: 'HIGH'
    });
  }

  if (!process.env.KAFKA_API_KEY && !process.env.KAFKA_USERNAME) {
    envCheck.recommendations.push({
      issue: 'No API credentials found',
      solution: 'Either set KAFKA_API_KEY + KAFKA_API_SECRET or ensure KAFKA_USERNAME + KAFKA_PASSWORD are set',
      priority: 'HIGH'
    });
  }

  if (!process.env.KAFKA_TOPIC) {
    envCheck.recommendations.push({
      issue: 'KAFKA_TOPIC not set',
      solution: 'Add KAFKA_TOPIC=sibi_web_events_store to Vercel environment variables',
      priority: 'MEDIUM'
    });
  }

  // Check if we can construct a working configuration
  const restUrl = process.env.KAFKA_REST_URL;
  const apiKey = process.env.KAFKA_API_KEY || process.env.KAFKA_USERNAME;
  const apiSecret = process.env.KAFKA_API_SECRET || process.env.KAFKA_PASSWORD;
  
  envCheck.configuration_status = {
    can_use_rest_api: !!(restUrl && apiKey && apiSecret),
    missing_for_rest: []
  };

  if (!restUrl) envCheck.configuration_status.missing_for_rest.push('KAFKA_REST_URL');
  if (!apiKey) envCheck.configuration_status.missing_for_rest.push('API_KEY (KAFKA_API_KEY or KAFKA_USERNAME)');
  if (!apiSecret) envCheck.configuration_status.missing_for_rest.push('API_SECRET (KAFKA_API_SECRET or KAFKA_PASSWORD)');

  return res.status(200).json(envCheck);
}
