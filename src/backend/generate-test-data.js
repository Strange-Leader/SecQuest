const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Generate users data
const users = {
  admin: {
    password: bcrypt.hashSync('admin123', 8),
    id: 1,
    role: 'admin',
    email: 'admin@example.com',
    apiKey: 'admin-key-123',
    premium: true,
  },
  user: {
    password: bcrypt.hashSync('user123', 8),
    id: 2,
    role: 'user',
    email: 'user@example.com',
    apiKey: 'user-key-456',
    premium: false,
  },
  premium: {
    password: bcrypt.hashSync('premium123', 8),
    id: 3,
    role: 'user',
    email: 'premium@example.com',
    apiKey: 'premium-key-789',
    premium: true,
  },
};

// Generate license data
const license = {
  key: 'PREMIUM-LICENSE-KEY',
  signature: 'valid_signature',
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
};

// Generate AI model data
const aiModel = {
  name: 'CTF-GPT',
  version: '1.0.0',
  endpoint: '/api/challenge7/process-query',
  accessToken: 'model-access-token-123',
  capabilities: [
    'text-generation',
    'code-completion',
    'vulnerability-detection',
  ],
  securityMeasures: {
    rateLimit: '100 requests/hour',
    authentication: 'Bearer token',
    inputValidation: 'Basic sanitization',
  },
};

// Save data to files
fs.writeFileSync(
  path.join(__dirname, 'users.json'),
  JSON.stringify(users, null, 2),
);

fs.writeFileSync(
  path.join(__dirname, 'license.json'),
  JSON.stringify(license, null, 2),
);

fs.writeFileSync(
  path.join(__dirname, 'ai-model.json'),
  JSON.stringify(aiModel, null, 2),
);

console.log('Test data generated successfully!');
console.log('Files created:');
console.log('- users.json');
console.log('- license.json');
console.log('- ai-model.json');
