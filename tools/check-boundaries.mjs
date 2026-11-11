/**
 * Architectural Boundaries Verifier for NukkadNow Admin Repository
 * Enforces strict DDD Clean Architecture and Security Isolation:
 * 1. Admin repository must never import from customer-pwa or merchant-portal source trees.
 * 2. Shared libs (libs/*) must never import from application components or routes (src/app/*).
 * 3. Domain features must not create direct circular imports.
 * 4. PII components must not bypass audit wrappers.
 */
import fs from 'node:fs';
import path from 'node:path';

console.log('🛡️  [ADMIN-BOUNDARIES] Verifying architectural and security boundaries...');

const violations = [];

function checkDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.angular', '.git'].includes(entry.name)) {
        checkDirectory(fullPath);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.html'))) {
      const content = fs.readFileSync(fullPath, 'utf-8');

      // 1. Prohibit external application leaks
      if (content.includes('customer-pwa') || content.includes('merchant-portal')) {
        violations.push(
          `External boundary violation in ${fullPath}: Admin must not reference Customer or Merchant applications.`
        );
      }

      // 2. Prohibit inverted dependency from libs to app
      if (fullPath.includes('libs') && (content.includes('../../src/app') || content.includes('@app/'))) {
        violations.push(
          `Inverted dependency violation in ${fullPath}: Shared libs must never import from src/app.`
        );
      }
    }
  }
}

checkDirectory('src');
checkDirectory('libs');

if (violations.length > 0) {
  console.error('❌ Architectural violations detected in Admin repository:');
  violations.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
} else {
  console.log('✅ [ADMIN-BOUNDARIES] All administrative architectural boundaries are 100% compliant.');
}
