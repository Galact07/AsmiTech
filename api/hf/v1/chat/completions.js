/**
 * Vercel Serverless Function: Hugging Face Router Proxy
 * 
 * This endpoint proxies requests to Hugging Face Router API
 * to avoid CORS issues in production.
 * 
 * Endpoint: POST /api/hf/v1/chat/completions
 * 
 * In development, this is handled by the Vite proxy instead.
 */

export const config = {
  api: {
    bodyParser: true,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests for chat completions
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      method: req.method,
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

  try {
    // Parse body if it's a string
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      try {
        requestBody = JSON.parse(requestBody);
      } catch (e) {
        console.error('❌ Failed to parse request body:', e);
        return res.status(400).json({ 
          error: 'Invalid JSON in request body' 
        });
      }
    }

    // Extract authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.error('❌ Missing authorization header');
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Authorization header is required' 
      });
    }

    // Proxy request to Hugging Face Router
    const huggingFaceUrl = 'https://router.huggingface.co/v1/chat/completions';
    
    console.log('🔄 Proxying request to Hugging Face Router...');
    console.log('📦 Model:', requestBody.model);
    console.log('📏 Messages count:', requestBody.messages?.length || 0);

    const response = await fetch(huggingFaceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(requestBody),
    });

    // Get response text first for better error handling
    const responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('❌ Failed to parse Hugging Face response:', e);
      console.error('Response status:', response.status);
      console.error('Response text:', responseText.substring(0, 500));
      
      return res.status(502).json({ 
        error: 'Invalid response from Hugging Face',
        status: response.status,
        details: responseText.substring(0, 500)
      });
    }

    if (!response.ok) {
      console.error('❌ Hugging Face API error:', response.status, data);
      return res.status(response.status).json(data);
    }

    console.log('✅ Successfully proxied request to Hugging Face');
    console.log('📊 Tokens used:', data.usage?.total_tokens || 'unknown');

    // Return the response from Hugging Face
    return res.status(200).json(data);

  } catch (error) {
    console.error('❌ Error proxying to Hugging Face:', error);
    return res.status(500).json({ 
      error: 'Proxy error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      details: 'Failed to communicate with Hugging Face Router'
    });
  }
}

