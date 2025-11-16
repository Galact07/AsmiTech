# API Routes

This directory contains Vercel serverless functions that handle backend operations for the ASMI Tech application.

## Routes

### 1. `/api/hf/v1/chat/completions` (POST)

**Purpose:** Proxies OpenAI-compatible API requests to Hugging Face Router to avoid CORS issues in production.

**Location:** `api/hf/v1/chat/completions.js`

**Method:** POST

**Headers:**
- `Content-Type: application/json`
- `Authorization: Bearer YOUR_HF_API_KEY`

**Request Body:** OpenAI-compatible chat completion request
```json
{
  "model": "openai/gpt-oss-20b:groq",
  "messages": [
    { "role": "system", "content": "You are a translator..." },
    { "role": "user", "content": "Text to translate" }
  ],
  "temperature": 0.3,
  "max_tokens": 2000
}
```

**Response:** OpenAI-compatible chat completion response

**Notes:**
- In development, this is handled by Vite proxy (see `vite.config.js`)
- In production, this serverless function forwards requests to `https://router.huggingface.co`
- CORS headers are automatically added
- The function has a 60-second timeout and 1024MB memory allocation

---

### 2. `/api/save-translation` (POST)

**Purpose:** Saves translated content to locale files on the server.

**Location:** `api/save-translation.js`

**Method:** POST

**Request Body:**
```json
{
  "content": { /* Dutch translation object */ },
  "rawContent": "/* Raw translation text */"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Translation file saved successfully",
  "paths": {
    "content": "/path/to/nl.json",
    "raw": "/path/to/nl.raw.json"
  }
}
```

**Notes:**
- In development, this is handled by a Vite plugin (see `vite.config.js`)
- Saves to `src/locales/nl.json` and `src/locales/nl.raw.json`

## Deployment

These serverless functions are automatically deployed when you push to Vercel:

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add Hugging Face API proxy for production"
   git push
   ```

2. **Vercel will automatically:**
   - Detect the `api/` directory
   - Create serverless functions for each route
   - Apply the configuration from `vercel.json`

3. **Verify deployment:**
   - Check Vercel dashboard for function logs
   - Test the translation feature in production
   - Monitor function execution time and errors

## Configuration

The `vercel.json` file contains function-specific settings:

```json
{
  "functions": {
    "api/hf/v1/chat/completions.js": {
      "maxDuration": 60,
      "memory": 1024
    },
    "api/save-translation.js": {
      "maxDuration": 10
    }
  }
}
```

## Troubleshooting

### 405 Method Not Allowed
- **Cause:** The serverless function file is missing or not properly exported
- **Solution:** Ensure `api/hf/v1/chat/completions.js` exists and has `export default async function handler(req, res)`

### 401 Unauthorized
- **Cause:** Missing or invalid Hugging Face API key
- **Solution:** Ensure the API key is set in the admin panel and passed in the Authorization header

### 502 Bad Gateway
- **Cause:** Hugging Face API returned invalid response
- **Solution:** Check Vercel function logs for details; may indicate HF API is down or rate limited

### Timeout (504)
- **Cause:** Request took longer than 60 seconds
- **Solution:** Consider reducing the `max_tokens` parameter or splitting large translation jobs

## Testing

### Local Testing (Development)
```bash
npm run dev
```
The Vite proxy handles API requests in development mode.

### Production Testing
After deployment, test using the browser console or a tool like Postman:

```javascript
fetch('https://asmi-tech.vercel.app/api/hf/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_HF_API_KEY'
  },
  body: JSON.stringify({
    model: 'openai/gpt-oss-20b:groq',
    messages: [
      { role: 'system', content: 'You are a translator.' },
      { role: 'user', content: 'Hello world' }
    ],
    max_tokens: 100
  })
})
.then(r => r.json())
.then(console.log);
```

## Security Notes

- ✅ CORS is properly configured
- ✅ API keys are passed through Authorization headers (not exposed in client)
- ✅ Request validation is performed before proxying
- ⚠️ Ensure API keys are never committed to version control
- ⚠️ Monitor usage to prevent API key abuse

