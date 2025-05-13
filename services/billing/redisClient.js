const { createClient } = require('redis');

const client = createClient();

client.on('error', (err) => console.error('❌ Redis Error:', err));

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect();
        console.log('✅ Redis connected (billing-service)');
    }
}

module.exports = { client, connectRedis };
