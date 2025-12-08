#!/usr/bin/env node
// Simple cross-platform waiter that attempts to connect to MongoDB using mongoose
// Usage: node db/scripts/wait-for-mongo.js [mongodb-uri] [maxRetries]

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.argv[2] || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devfolio';
const maxRetries = parseInt(process.argv[3] || '30', 10); // try up to 30 times (~30s)
let attempts = 0;

async function wait() {
  attempts++;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log('✓ Connected to MongoDB');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.log(`Waiting for MongoDB (${attempts}/${maxRetries})...`);
    if (attempts >= maxRetries) {
      console.error('✗ Timed out waiting for MongoDB.');
      console.error(err && err.message ? err.message : err);
      process.exit(1);
    }
    setTimeout(wait, 1000);
  }
}

wait();
