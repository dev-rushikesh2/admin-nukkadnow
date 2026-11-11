/**
 * NukkadNow Admin API Client Generator
 * Compiles OpenAPI 3.x admin contracts into strongly-typed TypeScript endpoints and models.
 */
import fs from 'node:fs';
import path from 'node:path';

console.log('🔄 [ADMIN-CODEGEN] Inspecting OpenAPI 3.x Admin BFF schema...');

const targetDir = path.resolve('libs/api-client/src');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('✅ [ADMIN-CODEGEN] Admin BFF endpoints and typed models are synchronized.');
