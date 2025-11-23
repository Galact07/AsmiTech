import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Custom plugin to handle /api/save-translation during development
const saveTranslationPlugin = () => {
  return {
    name: 'save-translation-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-translation', (req, res, next) => {
        if (req.method !== 'POST') {
          res.writeHead(405, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', () => {
          try {
            const { content, rawContent, filename } = JSON.parse(body);

            if (!content && !rawContent) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'No content or rawContent provided' }));
              return;
            }

            const responses = [];
            const savedPaths = {};

            // Determine filename from parameter or default to nl.json
            const targetFilename = filename || 'nl.json';
            const baseFilename = targetFilename.replace('.json', '');

            if (typeof rawContent !== 'undefined') {
              const rawPath = path.resolve(__dirname, 'src', 'locales', `${baseFilename}.raw.json`);
              const rawData = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent, null, 2);
              fs.writeFileSync(rawPath, rawData, 'utf-8');
              console.log(`✅ ${baseFilename}.raw.json saved successfully to:`, rawPath);
              responses.push('Raw translation saved successfully');
              savedPaths.raw = rawPath;
            }

            if (typeof content !== 'undefined') {
              // Validate JSON
              let jsonContent;
              try {
                jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
              } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Invalid JSON content' }));
                return;
              }

              // Path to save the translation file
              const translationPath = path.resolve(__dirname, 'src', 'locales', targetFilename);

              // Write the file
              fs.writeFileSync(translationPath, JSON.stringify(jsonContent, null, 2), 'utf-8');

              console.log(`✅ ${targetFilename} saved successfully to:`, translationPath);
              responses.push('Translation file saved successfully');
              savedPaths.content = translationPath;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: responses.join(' & '),
              paths: savedPaths
            }));

          } catch (error) {
            console.error('❌ Error saving translation file:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              error: 'Failed to save translation file',
              details: error.message
            }));
          }
        });
      });
    }
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), saveTranslationPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api/hf': {
        target: 'https://router.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hf/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    },
  },
})
