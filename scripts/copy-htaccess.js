import { copyFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = join(__dirname, '..');
const htaccessSource = join(rootDir, '.htaccess');
const htaccessDest = join(rootDir, 'dist', '.htaccess');

try {
  if (!existsSync(htaccessSource)) {
    console.warn('⚠️  .htaccess file not found in root directory');
    process.exit(0);
  }

  copyFileSync(htaccessSource, htaccessDest);
  console.log('✅ .htaccess copied to dist folder');
} catch (error) {
  console.error('❌ Error copying .htaccess:', error.message);
  process.exit(1);
}

