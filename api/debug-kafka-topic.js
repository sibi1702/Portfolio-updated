// Enhanced debug endpoint to identify and fix Kafka topic issues
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const results = {
    timestamp: new Date().toISOString(),
    environment_check: {},
    topic_analysis: {},
    producer_test: {},
    consumer_test: {},
    recommendations: []
  };

  try {
    // 1. Environment Check
    results.environment_check = {
      KAFKA_BROKERS: process.env.KAFKA_BROKERS ? '✅ Set' : '❌ Missing',
      KAFKA_USERNAME: process.env.KAFKA_USERNAME ? '✅ Set' : '❌ Missing',
      KAFKA_PASSWORD: process.env.KAFKA_PASSWORD ? '✅ Set' : '❌ Missing',
      KAFKA_TOPIC: process.env.KAFKA_TOPIC ? `✅ Set: ${process.env.KAFKA_TOPIC}` : '❌ Missing'
    };

    if (!process.env.KAFKA_BROKERS || !process.env.KAFKA_USERNAME || !process.env.KAFKA_PASSWORD) {
      results.recommendations.push('Missing required Kafka environment variables');
      return res.status(200).json(results);
    }

    // Dynamic import for serverless
    const { Kafka } = await import('kafkajs');

    const kafka = new Kafka({
      clientId: 'debug-client',
      brokers: process.env.KAFKA_BROKERS.split(','),
      ssl: true,
      sasl: {
        mechanism: 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
      connectionTimeout: 5000,
      requestTimeout: 10000,
    });

    const admin = kafka.admin();
    const producer = kafka.producer();
    const consumer = kafka.consumer({ groupId: 'debug-group-' + Date.now() });

    try {
      // 2. Connect admin
      await admin.connect();
      console.log('✅ Admin connected');

      // 3. Topic Analysis
      const topics = await admin.listTopics();
      const targetTopic = process.env.KAFKA_TOPIC || 'sibi_web_events_store';
      
      results.topic_analysis = {
        target_topic: targetTopic,
        topic_exists: topics.includes(targetTopic),
        all_topics: topics,
        topic_count: topics.length
      };

      if (!topics.includes(targetTopic)) {
        results.recommendations.push(`Topic '${targetTopic}' does not exist. Available topics: ${topics.join(', ')}`);
        
        // Try to create the topic
        try {
          await admin.createTopics({
            topics: [{
              topic: targetTopic,
              numPartitions: 3,
              replicationFactor: 3
            }]
          });
          results.topic_analysis.topic_created = '✅ Topic created successfully';
        } catch (createError) {
          results.topic_analysis.topic_creation_error = createError.message;
        }
      } else {
        // Get topic metadata
        const metadata = await admin.fetchTopicMetadata({ topics: [targetTopic] });
        results.topic_analysis.metadata = {
          partitions: metadata.topics[0].partitions.length,
          partition_details: metadata.topics[0].partitions.map(p => ({
            partition: p.partitionId,
            leader: p.leader,
            replicas: p.replicas
          }))
        };
      }

      // 4. Producer Test with explicit partition targeting
      await producer.connect();
      console.log('✅ Producer connected');

      const testMessage = {
        id: 'debug-' + Date.now(),
        timestamp: new Date().toISOString(),
        test: true,
        debug_mode: true,
        message: 'Debug test message to verify topic writing'
      };

      // Send to multiple partitions explicitly
      const sendPromises = [];
      for (let partition = 0; partition < (results.topic_analysis.metadata?.partitions || 1); partition++) {
        sendPromises.push(
          producer.send({
            topic: targetTopic,
            messages: [{
              partition: partition,
              key: `debug-key-p${partition}`,
              value: JSON.stringify({
                ...testMessage,
                partition_target: partition
              }),
              headers: {
                'debug': 'true',
                'partition': partition.toString(),
                'timestamp': testMessage.timestamp
              }
            }]
          })
        );
      }

      const sendResults = await Promise.all(sendPromises);
      results.producer_test = {
        status: '✅ Messages sent successfully',
        partitions_targeted: sendResults.length,
        send_results: sendResults.map((result, index) => ({
          partition: index,
          offset: result[0].offset,
          timestamp: result[0].timestamp
        }))
      };

      // 5. Consumer Test - Read from all partitions
      await consumer.connect();
      await consumer.subscribe({ topic: targetTopic, fromBeginning: false });

      const messages = [];
      const messageTimeout = new Promise((resolve) => {
        setTimeout(() => resolve([]), 5000); // 5 second timeout
      });

      const messagePromise = new Promise((resolve) => {
        consumer.run({
          eachMessage: async ({ partition, message, topic }) => {
            const messageData = {
              topic,
              partition,
              offset: message.offset,
              key: message.key?.toString(),
              value: message.value?.toString(),
              headers: Object.fromEntries(
                Object.entries(message.headers || {}).map(([k, v]) => [k, v.toString()])
              ),
              timestamp: message.timestamp
            };
            messages.push(messageData);
            
            // Resolve after collecting a few messages or if we find our debug message
            if (messages.length >= 3 || messageData.key?.includes('debug-key')) {
              resolve(messages);
            }
          }
        });
      });

      const consumedMessages = await Promise.race([messagePromise, messageTimeout]);
      
      results.consumer_test = {
        status: consumedMessages.length > 0 ? '✅ Messages found' : '⚠️ No messages consumed',
        messages_count: consumedMessages.length,
        latest_messages: consumedMessages.slice(0, 5), // Show latest 5
        debug_messages_found: consumedMessages.filter(m => m.key?.includes('debug-key')).length
      };

      // 6. Offset Analysis
      const offsets = await admin.fetchOffsets({ groupId: 'debug-group-' + Date.now(), topics: [targetTopic] });
      results.topic_analysis.current_offsets = offsets;

      // 7. Generate specific recommendations
      if (results.producer_test.status.includes('✅') && results.consumer_test.messages_count === 0) {
        results.recommendations.push('Messages are being produced but not consumed. Check consumer group settings and offset positions.');
      }

      if (results.consumer_test.messages_count > 0 && results.consumer_test.debug_messages_found === 0) {
        results.recommendations.push('Topic has messages but debug messages not found. There might be a delay or partition issue.');
      }

      // Cleanup
      await consumer.disconnect();
      await producer.disconnect();
      await admin.disconnect();

    } catch (connectionError) {
      results.error = `Connection error: ${connectionError.message}`;
      results.recommendations.push(`Fix connection error: ${connectionError.message}`);
    }

  } catch (error) {
    results.error = `General error: ${error.message}`;
    results.recommendations.push(`Address general error: ${error.message}`);
  }

  // 8. Add specific fix recommendations based on findings
  if (results.producer_test.status?.includes('✅') && results.consumer_test.messages_count === 0) {
    results.recommendations.push('SOLUTION: Your messages ARE being sent to Kafka. The issue is likely:');
    results.recommendations.push('1. Check Confluent Control Center - messages should be visible there');
    results.recommendations.push('2. Verify you\'re looking at the correct topic name');
    results.recommendations.push('3. Check all partitions in the topic');
    results.recommendations.push('4. Consumer might be starting from wrong offset (try fromBeginning: true)');
  }

  return res.status(200).json(results);
}
