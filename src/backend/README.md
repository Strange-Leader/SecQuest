# CTF Challenge Backend

This is the backend server for the CTF (Capture The Flag) challenges. It intentionally includes weak security measures for educational purposes.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- OpenSSL (for certificate generation)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate SSL certificates:

```bash
npm run generate-certs
```

3. Create a `.env` file with the following variables:

```
PORT=3000
NODE_ENV=development
JWT_SECRET=weak_secret_key_for_ctf
LICENSE_KEY=DEMO-LICENSE-KEY-123
MODEL_ACCESS_TOKEN=weak_model_access_token
```

## Running the Server

Development mode (with auto-reload):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

## Available Endpoints

### Health Check

- `GET /health` - Check server status

### API Documentation

- `GET /api-docs` - View all available endpoints

### Challenge 5 - TLS Bypass

- `POST /api/challenge5/login` - Login endpoint
- `GET /api/challenge5/profile` - Get user profile
- `GET /api/challenge5/certificate-info` - Get certificate information

### Challenge 6 - License Check

- `GET /api/challenge6/check-license` - Check license status
- `GET /api/challenge6/level/:id` - Get level content
- `POST /api/challenge6/purchase-license` - Purchase license

### Challenge 7 - AI Model

- `GET /api/challenge7/model-info` - Get model information
- `POST /api/challenge7/process-query` - Process AI query
- `GET /api/challenge7/check-access` - Check model access

### Challenge 8 - Local Storage

- `POST /api/challenge8/save-profile` - Save user profile
- `GET /api/challenge8/get-profile` - Get user profile

### Challenge 9 - Crypto Implementation

- `POST /api/challenge9/encrypt` - Encrypt data
- `POST /api/challenge9/decrypt` - Decrypt data

## Security Notes

This server intentionally includes weak security measures for CTF challenges:

- Weak TLS configuration
- Predictable token generation
- Exposed sensitive data
- Weak encryption
- No input validation
- No rate limiting

DO NOT use this server in a production environment!

## Development

The server uses:

- Express.js for the web framework
- Helmet for basic security headers
- Morgan for request logging
- Express Rate Limit for rate limiting
- Express Validator for input validation

## License

MIT License - For educational purposes only
