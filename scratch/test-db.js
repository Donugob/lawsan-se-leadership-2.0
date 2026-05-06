const { Client } = require('pg');
const client = new Client({
  connectionString: "postgresql://postgres.lqoshmfpqlheqedubqgl:EQkSCMaBR5EzyjPU@aws-0-eu-west-1.pooler.supabase.com:5432/postgres",
});

async function test() {
  try {
    console.log('Connecting...');
    await client.connect();
    console.log('Connected successfully!');
    const res = await client.query('SELECT NOW()');
    console.log('Query result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

test();
