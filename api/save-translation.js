/**
 * Vercel Serverless Function: Save Translation File
 * 
 * This endpoint saves the translated nl.json file to the correct location
 * in the deployed application on Vercel.
 * 
 * Endpoint: POST /api/save-translation
 * Body: { content: <JSON object> }
 * 
 * Note: During local development, this is handled by the Vite plugin
 * in vite.config.js instead of this file.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, rawContent, filename } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (!content && !rawContent) {
      return res.status(400).json({ error: 'No content or rawContent provided' });
    }

    const messages = [];
    const paths = {};

    // Determine filename from parameter or default to nl.json
    const targetFilename = filename || 'nl.json';
    const baseFilename = targetFilename.replace('.json', '');

    if (typeof rawContent !== 'undefined') {
      const rawPath = path.join(__dirname, '..', 'src', 'locales', `${baseFilename}.raw.json`);
      const rawData = typeof rawContent === 'string' ? rawContent : JSON.stringify(rawContent, null, 2);
      fs.writeFileSync(rawPath, rawData, 'utf-8');
      console.log(`✅ ${baseFilename}.raw.json saved successfully to:`, rawPath);
      messages.push('Raw translation saved successfully');
      paths.raw = rawPath;
    }

    if (typeof content !== 'undefined') {
      // Validate JSON
      let jsonContent;
      try {
        jsonContent = typeof content === 'string' ? JSON.parse(content) : content;
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON content' });
      }

      // Path to save translation file
      const translationPath = path.join(__dirname, '..', 'src', 'locales', targetFilename);

      // Write the file
      fs.writeFileSync(translationPath, JSON.stringify(jsonContent, null, 2), 'utf-8');

      console.log(`✅ ${targetFilename} saved successfully to:`, translationPath);
      messages.push('Translation file saved successfully');
      paths.content = translationPath;
    }

    return res.status(200).json({
      success: true,
      message: messages.join(' & '),
      paths
    });

  } catch (error) {
    console.error('❌ Error saving translation file:', error);
    return res.status(500).json({
      error: 'Failed to save translation file',
      details: error.message
    });
  }
}

