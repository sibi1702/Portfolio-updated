// Local debugging script to test Kafka connection
// Run with: node debug-kafka.js

import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';

// Load environment variables from .env file if it exists
dotenv.config();

async function debugKafka() {
  console.log('🔍 Kafka Debug Script Starting...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('KAFKA_BROKERS:', process.env.KAFKA_BROKERS ? '✅ Set' : '❌ Missing');
  console.log('KAFKA_USERNAME:', process.env.KAFKA_USERNAME ? '✅ Set' : '❌ Missing');
  console.log('KAFKA_PASSWORD:', process.env.KAFKA_PASSWORD ? '✅ Set (hidden)' : '❌ Missing');
  console.log('KAFKA_SSL:', process.env.KAFKA_SSL || 'Not set');
  console.log('KAFKA_TOPIC:', process.env.KAFKA_TOPIC || 'click-events (default)');
  console.log('KAFKA_CLIENT_ID:', process.env.KAFKA_CLIENT_ID || 'portfolio-tracker (default)');
  console.log('');

  if (!process.env.KAFKA_BROKERS) {
    console.log('❌ KAFKA_BROKERS is required. Please set your environment variables.');
    console.log('');
    console.log('Create a .env file with:');
    console.log('KAFKA_BROKERS=your-broker-urls');
    console.log('KAFKA_USERNAME=your-username');
    console.log('KAFKA_PASSWORD=your-password');
    console.log('KAFKA_SSL=true');
    console.log('KAFKA_TOPIC=click-events');
    return;
  }

  try {
    // Initialize Kafka
    console.log('🚀 Initializing Kafka...');
    
    const kafkaConfig = {
      clientId: process.env.KAFKA_CLIENT_ID || 'debug-client',
      brokers: process.env.KAFKA_BROKERS.split(','),
      connectionTimeout: 10000,
      requestTimeout: 10000,
    };

    // Add authentication if provided
    if (process.env.KAFKA_USERNAME && process.env.KAFKA_PASSWORD) {
      kafkaConfig.sasl = {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      };
      console.log('🔐 Using SASL authentication');
    }

    // Add SSL if required
    if (process.env.KAFKA_SSL === 'true') {
      kafkaConfig.ssl = true;
      console.log('🔒 Using SSL connection');
    }

    console.log('🌐 Brokers:', kafkaConfig.brokers);

    const kafka = new Kafka(kafkaConfig);
    const admin = kafka.admin();
    const producer = kafka.producer();

    // Test admin connection
    console.log('🔌 Connecting to Kafka admin...');
    await admin.connect();
    console.log('✅ Admin connected successfully');

    // List topics
    console.log('📋 Listing topics...');
    const topics = await admin.listTopics();
    console.log('Available topics:', topics);

    const targetTopic = process.env.KAFKA_TOPIC || 'click-events';
    if (topics.includes(targetTopic)) {
      console.log(`✅ Target topic '${targetTopic}' exists`);
    } else {
      console.log(`⚠️ Target topic '${targetTopic}' does not exist`);
      console.log('Creating topic...');
      
      try {
        await admin.createTopics({
          topics: [{
            topic: targetTopic,
            numPartitions: 3,
            replicationFactor: 1
          }]
        });
        console.log(`✅ Topic '${targetTopic}' created successfully`);
      } catch (createError) {
        console.log(`❌ Failed to create topic: ${createError.message}`);
      }
    }

    // Test producer connection
    console.log('🔌 Connecting to Kafka producer...');
    await producer.connect();
    console.log('✅ Producer connected successfully');

    // Send test message
    console.log('📤 Sending test message...');
    const testMessage = {
      id: 'debug-test-' + Date.now(),
      timestamp: new Date().toISOString(),
      message: 'Debug test from local script',
      source: 'debug-script'
    };

    await producer.send({
      topic: targetTopic,
      messages: [{
        key: testMessage.id,
        value: JSON.stringify(testMessage),
        headers: {
          'event-type': 'debug-test',
          'source': 'local-debug'
        }
      }]
    });

    console.log('✅ Test message sent successfully!');
    console.log('Message:', JSON.stringify(testMessage, null, 2));

    // Cleanup
    await producer.disconnect();
    await admin.disconnect();
    console.log('🔌 Disconnected from Kafka');

    console.log('\n🎉 Kafka connection test completed successfully!');
    console.log('If you can see this message, your Kafka setup is working.');
    console.log('The issue might be with your Vercel environment variables.');

  } catch (error) {
    console.error('❌ Kafka connection failed:', error.message);
    console.error('Full error:', error);
    
    console.log('\n🔍 Troubleshooting tips:');
    console.log('1. Check if your Kafka brokers are accessible from your network');
    console.log('2. Verify your username/password or API key/secret');
    console.log('3. Ensure SSL settings match your Kafka cluster requirements');
    console.log('4. Check if your IP is whitelisted (for cloud Kafka services)');
  }
}

// Run the debug function
debugKafka().catch(console.error);
