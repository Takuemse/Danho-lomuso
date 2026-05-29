const fs = require('fs');
const { Client } = require('pg');

const envFile = '.env.local';
const env = Object.fromEntries(
  fs.readFileSync(envFile, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'))
    .map((line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return [line, ''];
      return [line.slice(0, idx), line.slice(idx + 1).replace(/^"|"$/g, '')];
    })
);

const connectionString = env.DIRECT_URL || env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing DIRECT_URL or DATABASE_URL');
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

(async () => {
  try {
    await client.connect();
    const res = await client.query(`SELECT table_schema, table_name, column_name, data_type FROM information_schema.columns WHERE table_name = 'users' ORDER BY table_schema, table_name, ordinal_position`);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
})();
