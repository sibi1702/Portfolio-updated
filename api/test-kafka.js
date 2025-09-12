// Test endpoint to verify Kafka connection
import { Kafka } from 'kafkajs';

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

  const testResults = {
    timestamp: new Date().toISOString(),
    environment_variables: {},
    kafka_connection: null,
    topic_test: null,
    errors: []
  };

  try {
    // Check environment variables
    testResults.environment_variables = {
      KAFKA_BROKERS: process.env.KAFKA_BROKERS ? '✅ Set' : '❌ Missing',
      KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID ? '✅ Set' : '⚠️ Using default',
      KAFKA_TOPIC: process.env.KAFKA_TOPIC ? '✅ Set' : '⚠️ Using default',
      KAFKA_USERNAME: process.env.KAFKA_USERNAME ? '✅ Set' : '⚠️ Not set',
      KAFKA_PASSWORD: process.env.KAFKA_PASSWORD ? '✅ Set' : '⚠️ Not set',
      KAFKA_SSL: process.env.KAFKA_SSL ? '✅ Set' : '⚠️ Not set'
    };

    if (!process.env.KAFKA_BROKERS) {
      testResults.errors.push('KAFKA_BROKERS environment variable is required');
      return res.status(200).json(testResults);
    }

    // Test Kafka connection
    const kafkaConfig = {
      clientId: process.env.KAFKA_CLIENT_ID || 'portfolio-test',
      brokers: process.env.KAFKA_BROKERS.split(','),
      connectionTimeout: 3000,  // 3 seconds for serverless
      requestTimeout: 5000,     // 5 seconds for serverless
      retry: {
        initialRetryTime: 100,
        retries: 1  // Minimal retries for testing
      }
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

    const kafka = new Kafka(kafkaConfig);
    const admin = kafka.admin();
    const producer = kafka.producer();

    try {
      // Test admin connection with timeout
      const adminConnectPromise = admin.connect();
      const adminTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Admin connection timeout after 4 seconds')), 4000);
      });
      await Promise.race([adminConnectPromise, adminTimeout]);
      testResults.kafka_connection = '✅ Admin connected successfully';

      // Test producer connection with timeout
      const producerConnectPromise = producer.connect();
      const producerTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Producer connection timeout after 4 seconds')), 4000);
      });
      await Promise.race([producerConnectPromise, producerTimeout]);
      testResults.kafka_connection += ' | ✅ Producer connected successfully';

      // Test topic existence
      const topic = process.env.KAFKA_TOPIC || 'click-events';
      const topics = await admin.listTopics();
      
      if (topics.includes(topic)) {
        testResults.topic_test = `✅ Topic '${topic}' exists`;
      } else {
        testResults.topic_test = `⚠️ Topic '${topic}' does not exist`;
        testResults.errors.push(`Topic '${topic}' not found. Available topics: ${topics.join(', ')}`);
      }

      // Test sending a message
      try {
        await producer.send({
          topic: topic,
          messages: [
            {
              key: 'test-key',
              value: JSON.stringify({
                test: true,
                timestamp: new Date().toISOString(),
                message: 'Kafka connection test from portfolio'
              }),
              headers: {
                'event-type': 'test',
                'source': 'portfolio-test'
              }
            }
          ]
        });
        testResults.topic_test += ' | ✅ Test message sent successfully';
      } catch (sendError) {
        testResults.topic_test += ' | ❌ Failed to send test message';
        testResults.errors.push(`Send error: ${sendError.message}`);
      }

      // Cleanup
      await producer.disconnect();
      await admin.disconnect();

    } catch (connectionError) {
      testResults.kafka_connection = `❌ Connection failed: ${connectionError.message}`;
      testResults.errors.push(`Connection error: ${connectionError.message}`);
    }

  } catch (error) {
    testResults.errors.push(`General error: ${error.message}`);
  }

  return res.status(200).json(testResults);
}
