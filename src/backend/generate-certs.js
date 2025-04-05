const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

// Create certs directory if it doesn't exist
const certsDir = path.join(__dirname, 'certs');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir);
}

// Generate a keypair
const keys = forge.pki.rsa.generateKeyPair(2048);

// Create a certificate
const cert = forge.pki.createCertificate();
cert.publicKey = keys.publicKey;
cert.serialNumber = '01';
cert.validity.notBefore = new Date();
cert.validity.notAfter = new Date();
cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);

// Add subject and issuer
const attrs = [
  {
    name: 'commonName',
    value: 'localhost',
  },
  {
    name: 'organizationName',
    value: 'CTF Challenge',
  },
  {
    shortName: 'ST',
    value: 'Virginia',
  },
  {
    name: 'countryName',
    value: 'US',
  },
];

cert.setSubject(attrs);
cert.setIssuer(attrs);

// Sign the certificate
cert.sign(keys.privateKey);

// Convert to PEM format
const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
const certificatePem = forge.pki.certificateToPem(cert);

// Save the files
fs.writeFileSync(path.join(certsDir, 'private.key'), privateKeyPem);
fs.writeFileSync(path.join(certsDir, 'certificate.crt'), certificatePem);

console.log('SSL certificates generated successfully!');
console.log('Private key: certs/private.key');
console.log('Certificate: certs/certificate.crt');
