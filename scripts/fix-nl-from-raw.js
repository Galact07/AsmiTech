import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const localeDir = path.join(rootDir, 'src', 'locales');
const rawPath = path.join(localeDir, 'nl.raw.json');
const outputPath = path.join(localeDir, 'nl.json');
const englishPath = path.join(localeDir, 'en.json');

if (!fs.existsSync(rawPath)) {
  console.error('❌ nl.raw.json not found. Run the translation first.');
  process.exit(1);
}

const raw = fs.readFileSync(rawPath, 'utf-8');
const start = raw.indexOf('{');

if (start === -1) {
  throw new Error('No JSON object found in nl.raw.json');
}

let depth = 0;
let inString = false;
let escape = false;
let normalized = '';

for (let i = start; i < raw.length; i++) {
  const char = raw[i];

  if (inString) {
    normalized += char;
    if (escape) {
      escape = false;
    } else if (char === '\\') {
      escape = true;
    } else if (char === '"') {
      inString = false;
    }
  } else {
    if (char === '"') {
      inString = true;
      normalized += char;
    } else if (char === '{') {
      depth++;
      normalized += char;
    } else if (char === '}') {
      depth = Math.max(0, depth - 1);
      normalized += char;
      if (depth === 0) {
        const remaining = raw.slice(i + 1).trim();
        if (remaining.length === 0) {
          break;
        }
      }
    } else {
      normalized += char;
    }
  }
}

if (depth > 0) {
  console.warn(`⚠️  JSON appears truncated (${depth} unmatched braces). Auto-closing to attempt recovery.`);
  normalized += '}'.repeat(depth);
}

const translated = JSON.parse(normalized);
const english = JSON.parse(fs.readFileSync(englishPath, 'utf-8'));

const hydrateHomeSections = (content) => {
  if (!content || typeof content !== 'object') return;
  content.home = content.home || {};
  ['industries', 'testimonials', 'faq', 'finalCTA'].forEach((key) => {
    if (!content.home[key] && content[key]) {
      console.warn(`ℹ️  Populating missing home.${key} from top-level raw data.`);
      content.home[key] = content[key];
    }
  });
};

hydrateHomeSections(translated);

const mergeWithFallback = (base, translatedValue, pathSegments = []) => {
  if (Array.isArray(base)) {
    if (!Array.isArray(translatedValue) || translatedValue.length !== base.length) {
      console.warn(`⚠️  Missing or mismatched array at ${pathSegments.join('.')}. Falling back to English.`);
      return base;
    }
    return base.map((item, index) =>
      mergeWithFallback(item, translatedValue[index], [...pathSegments, `[${index}]`])
    );
  }

  if (base && typeof base === 'object') {
    const result = {};
    const translatedObj = translatedValue && typeof translatedValue === 'object' ? translatedValue : {};

    Object.keys(base).forEach((key) => {
      if (!(key in translatedObj)) {
        console.warn(`⚠️  Missing key in translation: ${[...pathSegments, key].join('.')}. Using English fallback.`);
        result[key] = base[key];
      } else {
        result[key] = mergeWithFallback(base[key], translatedObj[key], [...pathSegments, key]);
      }
    });

    return result;
  }

  if (translatedValue === undefined || translatedValue === null || translatedValue === '') {
    if (pathSegments.length > 0) {
      console.warn(`⚠️  Missing value at ${pathSegments.join('.')}. Using English fallback.`);
    }
    return base;
  }

  return translatedValue;
};

const merged = mergeWithFallback(english, translated);
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf-8');

console.log('✅ nl.json regenerated from nl.raw.json');

