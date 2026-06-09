const { Client } = require('pg');

const conn = process.argv[2] || process.env.CONN;
if (!conn) {
  console.error('No connection string provided (pass as argument or set CONN env)');
  process.exit(1);
}

(async () => {
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const res = await client.query('SELECT id, name, email, created_at FROM users ORDER BY id DESC LIMIT 50');
    console.log(JSON.stringify(res.rows, null, 2));
    await client.end();
  } catch (err) {
    console.error('Query error:', err && err.message ? err.message : err);
    try { await client.end(); } catch (e) {}
    process.exit(1);
  }
})();
