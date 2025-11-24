// /server/rag/db/client.js

import pg from 'pg';
// Assuming you are using dotenv for config as per the roadmap
import 'dotenv/config';

// Create a new client instance
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// Connect to the database
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Connection error', err.stack));

// Export the client instance for use in insertDoc.js and searchDocs.js
export default db;