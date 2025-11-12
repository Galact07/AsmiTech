import { OpenAI } from 'openai';
import { supabase } from '@/integrations/supabase/client';

interface TranslationResult {
  success: boolean;
  translatedContent?: any;
  error?: string;
  tokensUsed?: number;
  costUSD?: number;
}

interface TranslationLog {
  table_name: string;
  record_id: string;
  status: 'started' | 'completed' | 'failed';
  tokens_used?: number;
  cost_usd?: number;
  error_message?: string;
}

class TranslationService {
  private client: OpenAI | null = null;
  private readonly MODEL_NAME = 'openai/gpt-oss-20b:groq';

  private async saveRawTranslation(rawText: string, fileName: string = 'dynamic.raw.json') {
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

      console.log(`📦 Raw translation saved to src/locales/nl.raw.json (latest overwrite)`);
    } catch (error) {
      console.error('❌ Failed to save raw translation automatically:', error);
      console.log(`⬇️  Downloading raw output as fallback (${fileName})...`);

      const blob = new Blob([rawText], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('📥 Raw output downloaded - you can inspect or fix it manually.');
    }
  }

  setApiKey(apiKey: string) {
    // Use Vite proxy to avoid CORS issues - OpenAI SDK needs absolute URL
    const baseURL = `${window.location.origin}/api/hf/v1/`;
    
    console.log('🔧 Using Hugging Face Router via proxy:', baseURL);
    console.log('🤖 Model:', this.MODEL_NAME);
    
    this.client = new OpenAI({
      baseURL: baseURL,
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Safe because we're using proxy
    });
  }

  private async logTranslation(log: TranslationLog) {
    try {
      await supabase.from('translation_logs').insert([log]);
      
      // Console logging with colors
      const timestamp = new Date().toISOString();
      const emoji = log.status === 'completed' ? '✅' : log.status === 'failed' ? '❌' : '🔄';
      
      console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${emoji} TRANSLATION LOG - ${timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Table:        ${log.table_name}
Record ID:    ${log.record_id}
Status:       ${log.status.toUpperCase()}
${log.tokens_used ? `Tokens Used:  ${log.tokens_used}` : ''}
${log.cost_usd ? `Cost (USD):   $${log.cost_usd.toFixed(6)}` : ''}
${log.error_message ? `Error:        ${log.error_message}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
    } catch (error) {
      console.error('Failed to log translation:', error);
    }
  }

  private calculateCost(tokens: number): number {
    // Hugging Face is FREE for inference API (with rate limits)
    // Or very cheap for Pro ($9/month unlimited)
    return 0; // FREE!
  }

  async translateText(text: string, context: string = ''): Promise<string> {
    if (!this.client) {
      throw new Error('Hugging Face API key not set');
    }

    console.log(`\n🔄 Translating: "${text.substring(0, 50)}..."`);

    try {
      const chatCompletion = await this.client.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator specializing in business and technology content. Translate the following English text to Dutch (Netherlands).

Rules:
- Maintain the original formatting (e.g., markdown, HTML tags, bullet points)
- Ensure technical terms are translated accurately or kept in English if commonly used
- The translation should be natural and fluent for a Dutch business audience
- If the text is a list of items, translate each item individually while preserving the list structure
- If the text is a JSON string, translate only the values, keeping the keys and structure intact
- If the text is a URL, keep it as is
- If the text is a number, keep it as is
- ONLY return the translated text, nothing else
${context ? `\nAdditional context: ${context}` : ''}`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      });

      const translated = chatCompletion.choices[0]?.message?.content || text;
      const tokensUsed = chatCompletion.usage?.total_tokens || 0;
      
      console.log(`✅ Translation completed: ${tokensUsed} tokens used (FREE!)`);
      
      return translated;
    } catch (error: any) {
      console.error(`❌ Translation failed:`, error.message);
      throw error;
    }
  }

  async translateServicePage(pageId: string): Promise<TranslationResult> {
    console.log(`\n📄 Starting translation for service page: ${pageId}`);
    
    await this.logTranslation({
      table_name: 'service_pages',
      record_id: pageId,
      status: 'started'
    });

    try {
      // Fetch the service page
      const { data: page, error } = await supabase
        .from('service_pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error || !page) {
        throw new Error('Service page not found');
      }

      console.log(`📖 Translating service page: ${page.title}`);

      // Translate all text fields
      const translatedContent: any = {};
      let totalTokens = 0;

      // Simple text fields
      const textFields = [
        'title',
        'hero_headline',
        'hero_subheadline',
        'hero_cta_text',
        'introduction_title',
        'introduction_content',
        'differentiator_title',
        'differentiator_content',
        'consultation_title',
        'consultation_description',
        'final_cta_title',
        'final_cta_description',
        'final_cta_button_text',
        'meta_description'
      ];

      for (const field of textFields) {
        if (page[field]) {
          console.log(`  → Translating ${field}...`);
          translatedContent[field] = await this.translateText(
            page[field],
            `Service page field: ${field}`
          );
          totalTokens += 100; // Estimate
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Translate JSON arrays
      const arrayFields = ['core_offerings', 'benefits', 'process_steps', 'case_studies', 'tech_stack', 'why_choose_us', 'testimonials'];
      
      for (const field of arrayFields) {
        if (page[field] && Array.isArray(page[field]) && page[field].length > 0) {
          console.log(`  → Translating ${field} array (${page[field].length} items)...`);
          translatedContent[field] = await Promise.all(
            page[field].map(async (item: any) => {
              const translatedItem: any = {};
              for (const key of Object.keys(item)) {
                if (typeof item[key] === 'string' && item[key].length > 0) {
                  translatedItem[key] = await this.translateText(
                    item[key],
                    `Service page ${field}.${key}`
                  );
                  await new Promise(resolve => setTimeout(resolve, 300));
                } else {
                  translatedItem[key] = item[key];
                }
              }
              return translatedItem;
            })
          );
          totalTokens += page[field].length * 150; // Estimate
        }
      }

      // Update the database with translated content
      const { error: updateError } = await supabase
        .from('service_pages')
        .update({
          content_nl: translatedContent,
          translation_status: 'translated'
        })
        .eq('id', pageId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'service_pages',
        record_id: pageId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Service page translation completed!`);
      console.log(`   Total tokens: ${totalTokens}, Cost: $${costUSD.toFixed(6)}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'service_pages',
        record_id: pageId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateJob(jobId: string): Promise<TranslationResult> {
    console.log(`\n💼 Starting translation for job: ${jobId}`);
    
    await this.logTranslation({
      table_name: 'jobs',
      record_id: jobId,
      status: 'started'
    });

    try {
      const { data: job, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (error || !job) {
        throw new Error('Job not found');
      }

      console.log(`📋 Translating job: ${job.title}`);

      const translatedContent: any = {};
      let totalTokens = 0;

      const fields = ['title', 'description', 'requirements', 'location', 'salary_range', 'specialization'];

      for (const field of fields) {
        if (job[field]) {
          console.log(`  → Translating ${field}...`);
          translatedContent[field] = await this.translateText(
            job[field],
            `Job posting field: ${field}`
          );
          totalTokens += 100;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      const { error: updateError } = await supabase
        .from('jobs')
        .update({
          content_nl: translatedContent,
          translation_status: 'translated'
        })
        .eq('id', jobId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'jobs',
        record_id: jobId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Job translation completed! Tokens: ${totalTokens}, Cost: $${costUSD.toFixed(6)}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'jobs',
        record_id: jobId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateAll(): Promise<{
    totalSuccess: number;
    totalFailed: number;
    totalTokens: number;
    totalCost: number;
  }> {
    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌍 BULK TRANSLATION STARTED (SINGLE API CALL)                    ┃
┃  Target Language: Dutch (NL)                                       ┃
┃  Model: ${this.MODEL_NAME.padEnd(49)}┃
┃  Provider: Hugging Face Router + Groq (FREE!)                      ┃
┃  Method: All data in ONE request                                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);

    let totalSuccess = 0;
    let totalFailed = 0;
    let totalTokens = 0;
    let totalCost = 0;

    try {
      // Fetch all service pages
      const { data: pages } = await supabase
        .from('service_pages')
        .select('*')
        .eq('status', 'published');

      // Fetch all jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

      if ((!pages || pages.length === 0) && (!jobs || jobs.length === 0)) {
        console.log('⚠️  No content to translate');
        return { totalSuccess: 0, totalFailed: 0, totalTokens: 0, totalCost: 0 };
      }

      console.log(`\n📚 Found ${pages?.length || 0} service pages`);
      console.log(`💼 Found ${jobs?.length || 0} jobs`);
      console.log(`\n🔄 Preparing data for translation...\n`);

      // Prepare data structure for translation
      const dataToTranslate: any = {
        service_pages: {},
        jobs: {}
      };

      // Add service pages
      if (pages && pages.length > 0) {
        pages.forEach(page => {
          const textFields = [
            'title', 'hero_headline', 'hero_subheadline', 'hero_cta_text',
            'introduction_title', 'introduction_content', 'differentiator_title',
            'differentiator_content', 'consultation_title', 'consultation_description',
            'final_cta_title', 'final_cta_description', 'final_cta_button_text',
            'meta_description'
          ];

          const arrayFields = [
            'core_offerings', 'benefits', 'process_steps', 'case_studies',
            'tech_stack', 'why_choose_us', 'testimonials'
          ];

          const pageData: any = {};

          // Add text fields
          textFields.forEach(field => {
            if (page[field]) {
              pageData[field] = page[field];
            }
          });

          // Add array fields
          arrayFields.forEach(field => {
            if (page[field] && Array.isArray(page[field]) && page[field].length > 0) {
              pageData[field] = page[field];
            }
          });

          if (Object.keys(pageData).length > 0) {
            dataToTranslate.service_pages[page.id] = {
              title: page.title,
              data: pageData
            };
          }
        });
      }

      // Add jobs
      if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
          const jobData: any = {};
          const fields = ['title', 'description', 'requirements', 'location', 'salary_range', 'specialization'];

          fields.forEach(field => {
            if (job[field]) {
              jobData[field] = job[field];
            }
          });

          if (Object.keys(jobData).length > 0) {
            dataToTranslate.jobs[job.id] = {
              title: job.title,
              data: jobData
            };
          }
        });
      }

      const prettyLength = JSON.stringify(dataToTranslate, null, 2).length;
      const jsonString = JSON.stringify(dataToTranslate);
      const minifiedLength = jsonString.length;

      console.log(`📊 Data prepared. Pretty size: ${prettyLength} characters`);
      console.log(`📉 Minified size sent to API: ${minifiedLength} characters`);
      
      const estimatedTokens = Math.ceil(minifiedLength / 3.5);
      const maxTokens = Math.min(64000, Math.max(32000, estimatedTokens + 4000));

      console.log(`🧮 Estimated tokens: ~${estimatedTokens}`);
      console.log(`🎯 max_tokens request: ${maxTokens}`);
      console.log(`🚀 Sending to AI for translation...\n`);

      // Send everything in ONE API call
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
            content: `Translate this JSON from English to Dutch. Keep keys and IDs unchanged, translate only values. Keep SAP/ERP/CRM in English. Return complete valid JSON with NO extra whitespace (minified).`
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
      totalTokens = chatCompletion.usage?.total_tokens || 0;
      const finishReason = chatCompletion.choices[0]?.finish_reason;

      console.log(`✅ API call completed!`);
      console.log(`   Tokens used: ${totalTokens} (FREE!)`);
      console.log(`   Finish reason: ${finishReason}`);
      
      await this.saveRawTranslation(translatedText, 'dynamic.raw.json');

      // Check if response was truncated
      if (finishReason === 'length') {
        console.error('⚠️  WARNING: Response was truncated even after dynamic max_tokens adjustment!');
        console.error('   Try reducing dataset size or running translations per section if this persists.');
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
      let translatedData;
      try {
        let cleanedText = translatedText.trim();
        if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        }
        
        if (!cleanedText || cleanedText.length === 0) {
          throw new Error('API returned empty response');
        }
        
        console.log('📝 Cleaned text length:', cleanedText.length);

        const jsonPayload = normalizeJsonString(cleanedText);
        translatedData = JSON.parse(jsonPayload);
        console.log('✅ JSON parsed successfully\n');
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

      // Update service pages in database
      if (translatedData.service_pages) {
        console.log(`💾 Updating ${Object.keys(translatedData.service_pages).length} service pages...\n`);
        
        for (const [pageId, pageData] of Object.entries(translatedData.service_pages) as any[]) {
          try {
            const { error } = await supabase
              .from('service_pages')
              .update({
                content_nl: pageData.data,
                translation_status: 'translated'
              })
              .eq('id', pageId);

            if (error) {
              console.error(`❌ Failed to update service page ${pageId}:`, error.message);
              totalFailed++;
              
              await this.logTranslation({
                table_name: 'service_pages',
                record_id: pageId,
                status: 'failed',
                error_message: error.message
              });
            } else {
              console.log(`✅ Updated: ${pageData.title}`);
              totalSuccess++;
              
              await this.logTranslation({
                table_name: 'service_pages',
                record_id: pageId,
                status: 'completed',
                tokens_used: Math.floor(totalTokens / (Object.keys(translatedData.service_pages).length + Object.keys(translatedData.jobs || {}).length)),
                cost_usd: 0
              });
            }
          } catch (err: any) {
            console.error(`❌ Error updating service page ${pageId}:`, err.message);
            totalFailed++;
          }
        }
      }

      // Update jobs in database
      if (translatedData.jobs) {
        console.log(`\n💾 Updating ${Object.keys(translatedData.jobs).length} jobs...\n`);
        
        for (const [jobId, jobData] of Object.entries(translatedData.jobs) as any[]) {
          try {
            const { error } = await supabase
              .from('jobs')
              .update({
                content_nl: jobData.data,
                translation_status: 'translated'
              })
              .eq('id', jobId);

            if (error) {
              console.error(`❌ Failed to update job ${jobId}:`, error.message);
              totalFailed++;
              
              await this.logTranslation({
                table_name: 'jobs',
                record_id: jobId,
                status: 'failed',
                error_message: error.message
              });
            } else {
              console.log(`✅ Updated: ${jobData.title}`);
              totalSuccess++;
              
              await this.logTranslation({
                table_name: 'jobs',
                record_id: jobId,
                status: 'completed',
                tokens_used: Math.floor(totalTokens / (Object.keys(translatedData.service_pages || {}).length + Object.keys(translatedData.jobs).length)),
                cost_usd: 0
              });
            }
          } catch (err: any) {
            console.error(`❌ Error updating job ${jobId}:`, err.message);
            totalFailed++;
          }
        }
      }

    } catch (error: any) {
      console.error('❌ Bulk translation failed:', error);
      totalFailed = 1;
    }

    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ BULK TRANSLATION COMPLETED                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Successful:    ${totalSuccess.toString().padEnd(30)}┃
┃  Failed:        ${totalFailed.toString().padEnd(30)}┃
┃  Total Tokens:  ${totalTokens.toString().padEnd(30)}┃
┃  Total Cost:    FREE! 🎉${' '.padEnd(21)}┃
┃  Method:        Single API Call${' '.padEnd(17)}┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);

    return {
      totalSuccess,
      totalFailed,
      totalTokens,
      totalCost
    };
  }
}

export const translationService = new TranslationService();

