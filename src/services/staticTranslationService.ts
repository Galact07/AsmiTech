import { OpenAI } from 'openai';

interface StaticTranslationResult {
  success: boolean;
  translatedContent?: any;
  error?: string;
  tokensUsed?: number;
  costUSD?: number;
}

class StaticTranslationService {
  private client: OpenAI | null = null;
  private readonly MODEL_NAME = 'openai/gpt-oss-20b:groq';

  private mergeWithFallback(base: any, translated: any, path: string[] = []): any {
    if (Array.isArray(base)) {
      if (!Array.isArray(translated) || translated.length !== base.length) {
        console.warn(`⚠️  Missing or mismatched array at ${path.join('.')}. Falling back to English.`);
        return base;
      }
      return base.map((item, index) =>
        this.mergeWithFallback(item, translated[index], [...path, `[${index}]`])
      );
    }

    if (base && typeof base === 'object') {
      const result: Record<string, any> = {};
      const translatedObj = translated && typeof translated === 'object' ? translated : {};

      Object.keys(base).forEach((key) => {
        if (!(key in translatedObj)) {
          console.warn(`⚠️  Missing key in translation: ${[...path, key].join('.')}. Using English fallback.`);
          result[key] = base[key];
        } else {
          result[key] = this.mergeWithFallback(base[key], translatedObj[key], [...path, key]);
        }
      });

      return result;
    }

    if (translated === undefined || translated === null || translated === '') {
      if (path.length > 0) {
        console.warn(`⚠️  Missing value at ${path.join('.')}. Using English fallback.`);
      }
      return base;
    }

    return translated;
  }

  private hydrateHomeSections(content: any) {
    if (!content || typeof content !== 'object') return;
    content.home = content.home || {};

    const candidateKeys = ['industries', 'testimonials', 'faq', 'finalCTA'];
    candidateKeys.forEach((key) => {
      if (!content.home[key] && content[key]) {
        console.warn(`ℹ️  Populating missing home.${key} from top-level translation data.`);
        content.home[key] = content[key];
      }
    });
  }

  private async saveRawTranslation(rawText: string) {
    if (!rawText || rawText.trim().length === 0) {
      return;
    }

    try {
      const response = await fetch('/api/save-translation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawContent: rawText })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Unknown error saving raw translation');
      }

      console.log('📦 Raw translation saved to nl.raw.json (development/server path)');
    } catch (error) {
      console.error('❌ Failed to save raw translation automatically:', error);
      console.log('⬇️  Downloading raw output as fallback (nl.raw.json)...');

      const blob = new Blob([rawText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nl.raw.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('📥 Raw output downloaded - you can inspect or fix it manually.');
    }
  }

  setApiKey(apiKey: string) {
    // Use Vite proxy to avoid CORS issues
    const baseURL = `${window.location.origin}/api/hf/v1/`;
    
    console.log('🔧 Using Hugging Face Router via proxy:', baseURL);
    console.log('🤖 Model:', this.MODEL_NAME);
    
    this.client = new OpenAI({
      baseURL: baseURL,
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Safe because we're using proxy
    });
  }


  async translateStaticContent(): Promise<StaticTranslationResult> {
    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌍 STATIC CONTENT TRANSLATION STARTED                            ┃
┃  Source: en.json → Target: nl.json                                ┃
┃  Model: ${this.MODEL_NAME.padEnd(49)}┃
┃  Provider: Hugging Face Router + Groq (FREE!)                     ┃
┃  Method: Single API Call (Entire File)                            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);

    try {
      // Fetch en.json
      const response = await fetch('/src/locales/en.json');
      if (!response.ok) {
        throw new Error('Failed to fetch en.json');
      }
      
      const englishContent = await response.json();
      const prettyLength = JSON.stringify(englishContent, null, 2).length;
      const jsonString = JSON.stringify(englishContent); // Minified to reduce token usage
      const minifiedLength = jsonString.length;

      console.log('📖 Loaded en.json successfully');
      console.log('📊 Pretty file size:', prettyLength, 'characters');
      console.log('📉 Minified size sent to API:', minifiedLength, 'characters');

      // Estimate token usage and dynamically set max_tokens with safe buffer
      const estimatedTokens = Math.ceil(minifiedLength / 3.5);
      const maxTokens = Math.min(64000, Math.max(32000, estimatedTokens + 4000));

      console.log(`🧮 Estimated tokens: ~${estimatedTokens}`);
      console.log(`🎯 max_tokens request: ${maxTokens}`);

      // Translate entire JSON in ONE API call
      console.log('🔄 Translating entire file in single API call...\n');
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 RAW INPUT SENT TO API:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(jsonString);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `Translate this JSON from English to Dutch. Keep keys unchanged, translate only values. Return complete valid JSON with NO extra whitespace (minified). Preserve numbers and URLs.Recheck json formatting.`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: maxTokens,
      });

      const translatedText = chatCompletion.choices[0]?.message?.content || '';
      const tokensUsed = chatCompletion.usage?.total_tokens || 0;
      const finishReason = chatCompletion.choices[0]?.finish_reason;
      
      console.log(`✅ API call completed!`);
      console.log(`   Tokens used: ${tokensUsed} (FREE!)`);
      console.log(`   Finish reason: ${finishReason}`);
      
      await this.saveRawTranslation(translatedText);

      // Check if response was truncated
      if (finishReason === 'length') {
        console.error('⚠️  WARNING: Response was truncated even after dynamic max_tokens adjustment!');
        console.error('   Try reducing the source content size or split translations by sections if this persists.');
        throw new Error('Response truncated - model token limit reached');
      }
      
      if (!translatedText || translatedText.trim().length === 0) {
        console.error('❌ API returned empty content!');
        console.error('📋 Full API response:', JSON.stringify(chatCompletion, null, 2));
        throw new Error('API returned empty response - check API key or model availability');
      }
      
      console.log(`   Content length: ${translatedText.length} characters\n`);
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📥 RAW OUTPUT RECEIVED FROM API:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(translatedText);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
      const normalizeJsonString = (text: string): string => {
        const start = text.indexOf('{');
        if (start === -1) {
          throw new Error('No JSON object found in response');
        }
        let depth = 0;
        let inString = false;
        let escape = false;
        let normalized = '';

        for (let i = start; i < text.length; i++) {
          const char = text[i];

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
                const remaining = text.slice(i + 1).trim();
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

        return normalized;
      };

      // Parse the translated JSON
      let translatedContent;
      try {
        // Remove markdown code blocks if present
        let cleanedText = translatedText.trim();
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        }
        
        // Check if response is empty
        if (!cleanedText || cleanedText.length === 0) {
          throw new Error('API returned empty response');
        }
        
        console.log('📝 Cleaned text length:', cleanedText.length);

        const jsonPayload = normalizeJsonString(cleanedText);
        translatedContent = JSON.parse(jsonPayload);
        console.log('✅ JSON parsed successfully');
        console.log('✅ Translation contains', Object.keys(translatedContent).length, 'top-level keys');
      } catch (parseError) {
        console.error('❌ Failed to parse translated JSON:', parseError);
        console.error('📏 Response length:', translatedText.length);
        console.error('📄 First 1000 chars:', translatedText.substring(0, 1000));
        console.error('📄 Last 1000 chars:', translatedText.substring(Math.max(0, translatedText.length - 1000)));
        console.error('');
        console.error('💡 SOLUTION: The response was truncated. Try again - increased max_tokens should fix this.');
        console.error('📁 Raw translation has been saved to src/locales/nl.raw.json (or downloaded). Inspect and fix manually if needed.');
        throw new Error(`Translation returned invalid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
      }

      this.hydrateHomeSections(translatedContent);

      const mergedContent = this.mergeWithFallback(englishContent, translatedContent);
      translatedContent = mergedContent;

      // Save to nl.json via API
      console.log('\n💾 Saving translations to nl.json...');
      
      try {
        const saveResponse = await fetch('/api/save-translation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: mergedContent }),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          throw new Error(errorData.error || 'Failed to save translation file');
        }

        const saveResult = await saveResponse.json();
        console.log('✅ File saved successfully:', saveResult.message);
      } catch (saveError) {
        console.error('❌ Failed to save nl.json via API:', saveError);
        console.log('⬇️  Downloading as fallback...');
        
        // Fallback: Download the file
        const blob = new Blob([JSON.stringify(mergedContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nl.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📥 File downloaded - please place it in src/locales/ manually');
      }

      console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ STATIC CONTENT TRANSLATION COMPLETED!                         ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Tokens Used:  ${tokensUsed.toString().padEnd(48)}┃
┃  Cost:         FREE! 🎉${' '.padEnd(37)}┃
┃  Method:       Single API Call${' '.padEnd(33)}┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ nl.json automatically saved to src/locales/
`);

      return {
        success: true,
        translatedContent,
        tokensUsed: tokensUsed,
        costUSD: 0 // FREE!
      };
    } catch (error: any) {
      console.error('❌ Static translation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export const staticTranslationService = new StaticTranslationService();

