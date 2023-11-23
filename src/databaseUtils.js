const { Client } = require('pg');
const dbConfig = require('./dbconfig');

async function getWebhookUrlsFromDatabase() {
  const client = new Client({
    connectionString: `postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`,
  });

  try {
    await client.connect();

    const result = await client.query('SELECT url, header FROM tc_webhook');

    if (result.rows.length === 0) {
      console.warn('No webhook URLs found in the database.');
      return [];
    }

    const webhookUrls = result.rows.map((row) => ({
      url: row.url,
      header: row.header,
    }));

    return webhookUrls;
  } catch (error) {
    console.error('Error fetching webhook URLs:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = getWebhookUrlsFromDatabase;
