# Kafka Configuration for Portfolio Click Tracking

## Required Environment Variables in Vercel

Add these environment variables in your Vercel dashboard (Settings → Environment Variables):

### Basic Kafka Configuration
```
KAFKA_BROKERS=broker1:9092,broker2:9092,broker3:9092
KAFKA_CLIENT_ID=portfolio-tracker
KAFKA_TOPIC=click-events
```

### Authentication (if required)
```
KAFKA_USERNAME=your-username
KAFKA_PASSWORD=your-password
```

### SSL Configuration (if required)
```
KAFKA_SSL=true
```

## Common Kafka Service Configurations

### Confluent Cloud
```
KAFKA_BROKERS=pkc-xxxxx.us-west-2.aws.confluent.cloud:9092
KAFKA_USERNAME=your-api-key
KAFKA_PASSWORD=your-api-secret
KAFKA_SSL=true
KAFKA_CLIENT_ID=portfolio-tracker
KAFKA_TOPIC=click-events
```

### AWS MSK
```
KAFKA_BROKERS=b-1.msk-cluster.xxxxx.c2.kafka.us-west-2.amazonaws.com:9092,b-2.msk-cluster.xxxxx.c2.kafka.us-west-2.amazonaws.com:9092
KAFKA_CLIENT_ID=portfolio-tracker
KAFKA_TOPIC=click-events
```

### Apache Kafka (Self-hosted)
```
KAFKA_BROKERS=your-kafka-server:9092
KAFKA_CLIENT_ID=portfolio-tracker
KAFKA_TOPIC=click-events
```

## Event Schema

The Kafka messages will have this structure:

```json
{
  "id": "unique-event-id",
  "timestamp": "2025-01-12T10:30:00.000Z",
  "ip": "192.168.1.1",
  "url": "https://sibichandrasekar.com/",
  "referrer": "https://google.com",
  "user_agent": "Mozilla/5.0...",
  "host": "sibichandrasekar.com",
  "event_type": "page_view",
  "event_data": {
    "element": "button",
    "text": "Contact Me",
    "scroll_depth": 75,
    "time_on_page": 30000
  }
}
```

## Message Headers
- `event-type`: The type of event (page_view, click, etc.)
- `source`: Always "portfolio-website"

## Testing

1. Deploy your changes to Vercel
2. Visit your portfolio website
3. Check Vercel function logs for Kafka connection status
4. Verify messages are appearing in your Kafka topic

## Troubleshooting

### Connection Issues
- Verify broker URLs are correct and accessible
- Check if your Kafka service allows connections from Vercel's IP ranges
- Ensure firewall rules allow traffic on Kafka ports

### Authentication Issues
- Verify username/password or API key/secret are correct
- Check if your Kafka user has proper permissions to produce to the topic

### Topic Issues
- Ensure the topic exists in your Kafka cluster
- Verify your user has write permissions to the topic
- Check topic configuration (partitions, replication factor)

### SSL/TLS Issues
- Ensure SSL is properly configured if required
- Check certificate validity and trust chain
