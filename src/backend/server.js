require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Request size limits
const MAX_REQUEST_SIZE = '10mb';
app.use(express.json({limit: MAX_REQUEST_SIZE}));
app.use(express.urlencoded({extended: true, limit: MAX_REQUEST_SIZE}));

// Load data files with error handling
let users, aiModelData, licenseData;
try {
  users = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'),
  );
  aiModelData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'ai-model.json'), 'utf8'),
  );
  licenseData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'license.json'), 'utf8'),
  );
} catch (error) {
  console.error('Failed to load data files:', error);
  process.exit(1);
}

// Middleware
app.use(compression());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for CTF challenges
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: {policy: 'cross-origin'},
    referrerPolicy: {policy: 'unsafe-url'},
  }),
);
app.use(morgan('dev'));
app.use(
  cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Create HTTP server instead of HTTPS
const server = http.createServer(app);

// Test endpoint for connectivity
app.get('/test', (req, res) => {
  res.json({
    message: 'Server is reachable!',
    timestamp: new Date().toISOString(),
    clientIP: req.ip,
    headers: req.headers
  });
});

// Rate limiting for CTF challenges
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    hint: 'Can you bypass the rate limiting?',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipFailedRequests: false,
  keyGenerator: req => {
    return req.ip || req.headers['x-forwarded-for'] || 'unknown';
  },
});

// Rate limit error handler
app.use((err, req, res, next) => {
  if (err.name === 'RateLimitError') {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many requests from this IP',
      hint: 'Try to bypass the rate limiting!',
    });
  }
  next(err);
});

app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({status: 'healthy'});
});

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      challenge5: {
        login: 'POST /api/challenge5/login',
        profile: 'GET /api/challenge5/profile',
        certificate: 'GET /api/challenge5/certificate-info',
      },
      challenge6: {
        checkLicense: 'GET /api/challenge6/check-license',
        getLevel: 'GET /api/challenge6/level/:id',
        purchaseLicense: 'POST /api/challenge6/purchase-license',
      },
      challenge7: {
        modelInfo: 'GET /api/challenge7/model-info',
        processQuery: 'POST /api/challenge7/process-query',
        checkAccess: 'GET /api/challenge7/check-access',
      },
      challenge8: {
        saveProfile: 'POST /api/challenge8/save-profile',
        getProfile: 'GET /api/challenge8/get-profile',
      },
      challenge9: {
        encrypt: 'POST /api/challenge9/encrypt',
        decrypt: 'POST /api/challenge9/decrypt',
      },
    },
  });
});

// Challenge 1 - Basic Auth Bypass endpoints
app.post(
  '/api/challenge1/login',
  [body('username').notEmpty().trim(), body('password').notEmpty().trim()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const {username, password} = req.body;

      // Store flag in environment variable
      const FLAG =
        process.env.CHALLENGE_ONE_FLAG || 'CTF{Basic_Auth_Bypass_123}';

      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (username === '111' && password === '111') {
        res.status(200).json({
          success: true,
          message: 'Login successful!',
          flag: FLAG,
          hint: 'The credentials were hidden in plain sight. Try to find them in the network traffic!',
        });
      } else {
        res.status(401).json({
          error: 'Invalid credentials',
          hint: 'Try to find the correct credentials!',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },
);

// Challenge 5 - TLS Bypass endpoints
app.post(
  '/api/challenge5/login',
  [body('username').notEmpty().trim(), body('password').notEmpty().trim()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }

      const {username, password} = req.body;

      if (users[username]) {
        const isValidPassword = await bcrypt.compare(
          password,
          users[username].password,
        );
        if (isValidPassword) {
          // Weak token generation
          const token = Buffer.from(
            `${users[username].id}:${Date.now()}:weak_secret_key`,
          ).toString('base64');
          res.status(200).json({
            token,
            message: 'Login successful!',
            hint: 'The token is base64 encoded and contains user ID and timestamp. Can you predict the next token?',
          });
        } else {
          res.status(401).json({error: 'Invalid credentials'});
        }
      } else {
        res.status(401).json({error: 'Invalid credentials'});
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  },
);

app.get('/api/challenge5/profile', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({error: 'No token provided'});
    }

    const decoded = Buffer.from(token, 'base64').toString();
    const [userId, timestamp] = decoded.split(':');

    // Check if token is expired (30 seconds)
    if (Date.now() - parseInt(timestamp) > 30000) {
      return res.status(401).json({
        error: 'Token expired',
        hint: 'The token expires after 30 seconds. Can you predict the next token?',
      });
    }

    const user = Object.values(users).find(u => u.id === parseInt(userId));
    if (user) {
      res.json({
        username: user.email.split('@')[0],
        email: user.email,
        role: user.role,
        flag: 'CTF{TLS_BYPASS_SUCCESS}',
        hint: 'The server uses weak TLS configuration. Try intercepting the traffic!',
      });
    } else {
      res.status(401).json({error: 'Invalid token'});
    }
  } catch (error) {
    res.status(401).json({
      error: 'Invalid token format',
      hint: 'The token should be base64 encoded and contain user ID and timestamp',
    });
  }
});

app.get('/api/challenge5/certificate-info', (req, res) => {
  try {
    res.json({
      message: 'Certificate info not available in HTTP mode',
      hint: 'This endpoint is more relevant for HTTPS connections',
    });
  } catch (error) {
    res.status(500).json({error: 'Failed to get certificate info'});
  }
});

// Challenge 6 - License Check endpoints
const levels = [
  {
    id: 1,
    name: 'Tutorial Level',
    isLocked: false,
    description: 'Learn the basics of the game',
    content: 'Welcome to the tutorial level! Learn the basics here.',
  },
  {
    id: 2,
    name: 'Level 1',
    isLocked: false,
    description: 'First real challenge',
    content: 'Complete this level to progress!',
  },
  {
    id: 3,
    name: 'Level 2',
    isLocked: false,
    description: 'Increasing difficulty',
    content: 'The challenge gets harder!',
  },
  {
    id: 4,
    name: 'Premium Level 1',
    isLocked: true,
    description: 'Premium content - requires license',
    content:
      'This is premium content! The flag is: CTF{LICENSE_BYPASS_SUCCESS}',
  },
  {
    id: 5,
    name: 'Premium Level 2',
    isLocked: true,
    description: 'More premium content',
    content: 'Another premium level with hidden content!',
  },
];

app.get('/api/challenge6/check-license', (req, res) => {
  try {
    const hasLicense =
      licenseData && licenseData.signature === 'valid_signature';
    const isExpired =
      hasLicense && new Date(licenseData.expiresAt) < new Date();

    res.json({
      hasLicense: hasLicense && !isExpired,
      isExpired,
      levels: levels.map(level => ({
        ...level,
        isLocked: level.isLocked && (!hasLicense || isExpired),
      })),
      hint: 'The license validation is weak. Try to bypass it!',
    });
  } catch (error) {
    res.status(500).json({error: 'Failed to check license'});
  }
});

app.get('/api/challenge6/level/:id', (req, res) => {
  try {
    const levelId = parseInt(req.params.id);
    const level = levels.find(l => l.id === levelId);

    if (!level) {
      return res.status(404).json({error: 'Level not found'});
    }

    if (level.isLocked) {
      const licensePath = path.join(__dirname, 'license.json');
      if (!fs.existsSync(licensePath)) {
        return res.status(403).json({
          error: 'This level requires a license',
          hint: 'The license check is weak. Try to bypass it!',
        });
      }
    }

    res.json(level.content);
  } catch (error) {
    res.status(500).json({error: 'Failed to get level content'});
  }
});

app.post('/api/challenge6/purchase-license', (req, res) => {
  try {
    const {paymentId, amount} = req.body;
    if (!paymentId || amount !== 9.99) {
      return res.status(400).json({
        error: 'Invalid purchase data',
        hint: 'The payment validation is weak. Try to bypass it!',
      });
    }

    const newLicenseData = {
      ...licenseData,
      signature: 'valid_signature',
      purchaseDate: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      paymentId,
    };

    fs.writeFileSync(
      path.join(__dirname, 'license.json'),
      JSON.stringify(newLicenseData, null, 2),
    );

    res.json({
      success: true,
      message: 'License purchased successfully',
      hint: 'The license validation is weak. Try to bypass it!',
    });
  } catch (error) {
    res.status(500).json({error: 'Failed to purchase license'});
  }
});

// Challenge 7 - AI Model endpoints
app.get('/api/challenge7/model-info', (req, res) => {
  try {
    res.json({
      ...aiModelData,
      hint: 'The model data is stored in the app binary. Look for base64 encoded data. The model architecture is exposed in the parameters.',
    });
  } catch (error) {
    res.status(500).json({error: 'Failed to get model info'});
  }
});

app.post('/api/challenge7/process-query', (req, res) => {
  try {
    const {query} = req.body;
    if (!query) {
      return res.status(400).json({error: 'Query is required'});
    }

    // Simulate model processing
    const response = {
      query,
      modelName: aiModelData.name,
      version: aiModelData.version,
      capabilities: aiModelData.capabilities,
      securityMeasures: aiModelData.securityMeasures,
      hint: 'The model parameters are exposed in the app memory. Look for the model architecture details.',
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({error: 'Failed to process query'});
  }
});

app.get('/api/challenge7/check-access', (req, res) => {
  try {
    res.json({
      message: 'Model access check completed',
      hint: 'The model data is stored in the app binary. Look for base64 encoded data. The model architecture is exposed in the parameters.',
      technicalDetails: aiModelData.parameters.technicalDetails,
    });
  } catch (error) {
    res.status(500).json({error: 'Failed to check model access'});
  }
});

// Challenge 8 - Local Storage endpoints
const SQLITE_DB_PATH = path.join(__dirname, 'profiles.db');
const SQLITE_SCHEMA = `
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    data TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Initialize SQLite database
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(SQLITE_DB_PATH);
db.serialize(() => {
  db.run(SQLITE_SCHEMA);
});

app.post('/api/challenge8/save-profile', (req, res) => {
  try {
    const {profile} = req.body;
    if (!profile || !profile.name || !profile.email) {
      return res.status(400).json({
        error: 'Invalid profile data',
        hint: 'The profile validation is weak. Try to bypass it!',
      });
    }

    // Weak encryption for profile data
    const encryptedData = Buffer.from(JSON.stringify(profile)).toString(
      'base64',
    );

    db.run(
      'INSERT INTO profiles (name, email, phone, data) VALUES (?, ?, ?, ?)',
      [profile.name, profile.email, profile.phone, encryptedData],
      function (err) {
        if (err) {
          return res.status(500).json({error: 'Failed to save profile'});
        }
        res.json({
          success: true,
          message: 'Profile saved successfully',
          profileId: this.lastID,
          hint: 'The profile data is stored in SQLite with weak encryption. Try to extract it!',
        });
      },
    );
  } catch (error) {
    res.status(500).json({error: 'Failed to save profile'});
  }
});

app.get('/api/challenge8/get-profile', (req, res) => {
  try {
    const {id} = req.query;
    if (!id) {
      return res.status(400).json({
        error: 'Profile ID is required',
        hint: 'Try to find the profile ID in the app!',
      });
    }

    db.get('SELECT * FROM profiles WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({error: 'Failed to get profile'});
      }
      if (!row) {
        return res.status(404).json({error: 'Profile not found'});
      }

      // Weak decryption
      const decryptedData = Buffer.from(row.data, 'base64').toString();
      const profile = JSON.parse(decryptedData);

      res.json({
        ...profile,
        hint: 'The profile data is stored in SQLite with weak encryption. Try to extract it!',
      });
    });
  } catch (error) {
    res.status(500).json({error: 'Failed to get profile'});
  }
});

// Challenge 9 - Crypto Implementation endpoints
const ENCRYPTION_KEY = 'weak_encryption_key_123'; // Intentionally weak key

app.post('/api/challenge9/encrypt', (req, res) => {
  try {
    const {data} = req.body;
    if (!data) {
      return res.status(400).json({error: 'Data is required'});
    }

    // Weak encryption using static IV
    const cipher = crypto.createCipheriv(
      'aes-128-ecb',
      Buffer.from(ENCRYPTION_KEY).slice(0, 16),
      '',
    );
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    res.json({
      encrypted,
      hint: 'The encryption uses AES-ECB mode with a static key and no IV',
    });
  } catch (error) {
    res.status(500).json({error: 'Failed to encrypt data'});
  }
});

app.post('/api/challenge9/decrypt', (req, res) => {
  try {
    const {encrypted} = req.body;
    if (!encrypted) {
      return res.status(400).json({error: 'Encrypted data is required'});
    }

    // Weak decryption using static IV
    const decipher = crypto.createDecipheriv(
      'aes-128-ecb',
      Buffer.from(ENCRYPTION_KEY).slice(0, 16),
      '',
    );
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    res.json({
      decrypted,
      hint: 'The decryption uses the same weak key. Try to find it in the app!',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to decrypt data',
      hint: 'Make sure the data is properly base64 encoded and encrypted with the correct key',
    });
  }
});

// Challenge 4 - 2FA Bypass endpoints
app.post('/api/challenge4/login', (req, res) => {
  const { username, password } = req.body;
  // For demo, accept any username/password
  if (username && password) {
    // Simulate issuing a token (insecure, for CTF)
    const token = Buffer.from(`${username}:authtoken`).toString('base64');
    res.json({ success: true, token, message: 'Login successful (Challenge 4)!' });
  } else {
    res.status(400).json({ error: 'Username and password required' });
  }
});

app.post('/api/challenge4/verify-2fa', (req, res) => {
  const { code } = req.body;
  // For demo, accept any code
  if (code) {
    res.json({ success: true, message: '2FA verified (Challenge 4)!' });
  } else {
    res.status(400).json({ error: '2FA code required' });
  }
});

app.get('/api/challenge4/flag', (req, res) => {
  // For demo, return a static flag
  res.json({ flag: 'CTF{CHALLENGE4_2FA_BYPASS}' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);

  // Different error responses based on error type
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      hint: 'Check your input format and try again',
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message,
      hint: 'Try to bypass the authentication mechanism',
    });
  }

  if (err.name === 'DatabaseError') {
    return res.status(500).json({
      error: 'Database Error',
      message: 'Failed to access the database',
      hint: 'The database connection might be vulnerable',
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal Server Error',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Something went wrong',
    hint: 'Check the server logs for more details',
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    hint: 'Try to find hidden endpoints',
  });
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('\nReceived shutdown signal');
  db.close(err => {
    if (err) {
      console.error('Error closing database:', err);
    }
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error(
        'Could not close connections in time, forcefully shutting down',
      );
      process.exit(1);
    }, 10000);
  });
};

// Uncaught exception handler
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown();
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  gracefulShutdown();
});

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server running on port ${PORT}`);
  console.log('Server is accessible at:');
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://YOUR_IP:${PORT}`);
  console.log(
    'Warning: This server uses intentionally weak security for CTF challenges!',
  );
});
