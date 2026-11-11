/**
 * Mandatory Administrative Security Headers Verifier
 * Validates nginx.conf and deployment configurations for production zero-trust compliance.
 */
import fs from 'node:fs';
import path from 'node:path';

console.log('🔒 [SECURITY-VERIFY] Checking security headers in nginx.conf...');

const nginxPath = path.resolve('nginx.conf');
if (!fs.existsSync(nginxPath)) {
  console.error('❌ nginx.conf is missing!');
  process.exit(1);
}

const nginxContent = fs.readFileSync(nginxPath, 'utf-8');

const requiredHeaders = [
  'X-Frame-Options "DENY"',
  'X-Content-Type-Options "nosniff"',
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'Permissions-Policy',
  'Referrer-Policy "strict-origin-when-cross-origin"',
];

const missing = [];
for (const header of requiredHeaders) {
  if (!nginxContent.includes(header)) {
    missing.push(header);
  }
}

if (missing.length > 0) {
  console.error('❌ Missing mandatory security headers in nginx.conf:');
  missing.forEach((m) => console.error(`  - ${m}`));
  process.exit(1);
}

console.log('✅ [SECURITY-VERIFY] All mandatory security headers (CSP, HSTS, X-Frame-Options, etc.) verified successfully.');
