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
        body: JSON.stringify({ rawContent: rawText, filename: fileName })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Unknown error saving raw translation');
      }

      console.log(`📦 Raw translation saved to src/locales/${fileName} (latest overwrite)`);
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
    const baseURL = `${window.location.origin}/api/hf/v1/`;

    console.log('🔧 Using Hugging Face Router via proxy:', baseURL);
    console.log('🤖 Model:', this.MODEL_NAME);

    this.client = new OpenAI({
      baseURL: baseURL,
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }

  private async logTranslation(log: TranslationLog) {
    try {
      // @ts-ignore
      await supabase.from('translation_logs').insert([log]);

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
    return 0; // FREE!
  }

  async translateServicePage(pageId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n📄 Starting translation for service page: ${pageId}`);

    await this.logTranslation({
      table_name: 'service_pages',
      record_id: pageId,
      status: 'started'
    });

    try {
      const { data: page, error } = await supabase
        .from('service_pages')
        .select('*')
        .eq('id', pageId)
        .single();

      if (error || !page) {
        throw new Error('Service page not found');
      }

      console.log(`📋 Translating service page: ${page.title}`);

      // Prepare all content to translate in a single API call
      const contentToTranslate: any = {};

      // Text fields
      const textFields = [
        'title', 'hero_headline', 'hero_subheadline', 'hero_cta_text',
        'introduction_title', 'introduction_content', 'differentiator_title',
        'differentiator_content', 'consultation_title', 'consultation_description',
        'final_cta_title', 'final_cta_description', 'final_cta_button_text',
        'meta_description'
      ];

      textFields.forEach(field => {
        if (page[field]) {
          contentToTranslate[field] = page[field];
        }
      });

      // Array fields
      const arrayFields = ['core_offerings', 'benefits', 'process_steps', 'case_studies', 'tech_stack', 'why_choose_us', 'testimonials'];

      arrayFields.forEach(field => {
        if (page[field] && Array.isArray(page[field]) && page[field].length > 0) {
          contentToTranslate[field] = page[field];
        }
      });

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

      console.log(`  → Sending ${Object.keys(contentToTranslate).length} fields to translate in one API call...`);

      // Make single API call to translate all content
      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate this JSON from English to ${targetLangFull}.

CRITICAL RULES:
1. Keep ALL JSON keys EXACTLY as-is
2. Translate ONLY the string values
3. Keep technical terms in English: SAP, ERP, CRM, S/4HANA, Fiori, BTP, Ariba, API, etc.
4. Preserve ALL array items - do not skip any
5. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text
6. Ensure ALL nested objects and arrays are fully translated

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 16000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      // Parse the translated JSON
      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // Update the database with translated content
      const updatePayload: any = {
        translation_status: 'translated'
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;

      const { error: updateError } = await supabase
        .from('service_pages')
        .update(updatePayload)
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

  async translateJob(jobId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
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

      // Prepare all content to translate in a single API call
      const contentToTranslate: any = {};
      const fields = ['title', 'description', 'requirements', 'location', 'salary_range', 'specialization'];

      fields.forEach(field => {
        if (job[field]) {
          contentToTranslate[field] = job[field];
        }
      });

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

      console.log(`  → Sending ${Object.keys(contentToTranslate).length} fields to translate in one API call...`);

      // Make single API call to translate all content
      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate this JSON from English to ${targetLangFull}.

CRITICAL RULES:
1. Keep ALL JSON keys EXACTLY as-is
2. Translate ONLY the string values
3. Keep technical terms in English: SAP, ERP, CRM, S/4HANA, Fiori, BTP, Ariba, API, etc.
4. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 8000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      // Parse the translated JSON
      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      const updatePayload: any = {
        translation_status: 'translated'
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;

      const { error: updateError } = await supabase
        .from('jobs')
        .update(updatePayload)
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

  private async translateInBatches(
    dataToTranslate: any,
    pages: any[],
    jobs: any[],
    targetLanguage: 'nl' | 'de'
  ): Promise<{
    totalSuccess: number;
    totalFailed: number;
    totalTokens: number;
    totalCost: number;
  }> {
    let totalSuccess = 0;
    let totalFailed = 0;
    let totalTokens = 0;

    console.log(`📦 BATCH MODE: Translating items individually (one API call per page)\n`);

    // Translate each service page individually
    if (dataToTranslate.service_pages && Object.keys(dataToTranslate.service_pages).length > 0) {
      const pageIds = Object.keys(dataToTranslate.service_pages);
      console.log(`📚 Translating ${pageIds.length} service pages (one API call per page)...\n`);

      for (let i = 0; i < pageIds.length; i++) {
        const pageId = pageIds[i];
        const pageInfo = dataToTranslate.service_pages[pageId];

        console.log(`[${i + 1}/${pageIds.length}] Translating: ${pageInfo.title}`);

        try {
          const result = await this.translateServicePage(pageId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${pageInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${pageInfo.title} - ${result.error}\n`);
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${pageInfo.title}:`, error.message);
        }
      }
    }

    // Translate each job individually
    if (dataToTranslate.jobs && Object.keys(dataToTranslate.jobs).length > 0) {
      const jobIds = Object.keys(dataToTranslate.jobs);
      console.log(`\n💼 Translating ${jobIds.length} jobs (one API call per job)...\n`);

      for (let i = 0; i < jobIds.length; i++) {
        const jobId = jobIds[i];
        const jobInfo = dataToTranslate.jobs[jobId];

        console.log(`[${i + 1}/${jobIds.length}] Translating: ${jobInfo.title}`);

        try {
          const result = await this.translateJob(jobId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${jobInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${jobInfo.title} - ${result.error}\n`);
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${jobInfo.title}:`, error.message);
        }
      }
    }

    const totalCost = this.calculateCost(totalTokens);

    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ BATCH TRANSLATION COMPLETED                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Successful:    ${totalSuccess.toString().padEnd(30)}┃
┃  Failed:        ${totalFailed.toString().padEnd(30)}┃
┃  Total Tokens:  ${totalTokens.toString().padEnd(30)}┃
┃  Total Cost:    FREE! 🎉${' '.padEnd(21)}┃
┃  Method:        One API call per page${' '.padEnd(10)}┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);

    return {
      totalSuccess,
      totalFailed,
      totalTokens,
      totalCost
    };
  }

  async translateAll(targetLanguage: 'nl' | 'de' = 'nl'): Promise<{
    totalSuccess: number;
    totalFailed: number;
    totalTokens: number;
    totalCost: number;
  }> {
    if (!this.client) {
      throw new Error('API key not set. Please call setApiKey() first.');
    }

    const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
    const targetLangAdjective = targetLanguage === 'nl' ? 'Dutch' : 'German';

    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌍 BULK TRANSLATION STARTED (PAGE BY PAGE MODE)                  ┃
┃  Target Language: ${targetLangFull.padEnd(40)} ┃
┃  Model: ${this.MODEL_NAME.padEnd(50)} ┃
┃  Provider: Hugging Face Router + Groq (FREE!)                      ┃
┃  Method: One API call per page for reliability                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);

    try {
      // Fetch all service pages
      const { data: pages, error: pagesError } = await supabase
        .from('service_pages')
        .select('*')
        .eq('status', 'published');

      if (pagesError) throw pagesError;

      // Fetch all jobs
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

      if (jobsError) throw jobsError;

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
          dataToTranslate.service_pages[page.id] = {
            title: page.title,
            data: page
          };
        });
      }

      // Add jobs
      if (jobs && jobs.length > 0) {
        jobs.forEach(job => {
          dataToTranslate.jobs[job.id] = {
            title: job.title,
            data: job
          };
        });
      }

      // Always use batch mode (one API call per page)
      return await this.translateInBatches(dataToTranslate, pages || [], jobs || [], targetLanguage);

    } catch (error: any) {
      console.error('❌ Bulk translation failed:', error);
      return { totalSuccess: 0, totalFailed: 1, totalTokens: 0, totalCost: 0 };
    }
  }
}

export const translationService = new TranslationService();
