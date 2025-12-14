import { OpenAI } from 'openai';
import { supabase } from '@/integrations/supabase/client';

// Module identifier type for granular translation
export type ModuleIdentifier = 
  | 'service_pages' 
  | 'jobs' 
  | 'team_members' 
  | 'testimonials' 
  | 'industries' 
  | 'technology_stack' 
  | 'faqs' 
  | 'client_logos' 
  | 'company_info';

// Module configuration for translation
export interface ModuleConfig {
  tableName: string;
  displayName: string;
  activeField: string;
  activeValue: boolean | string;
  titleField: string;
  icon: string;
}

// Module configurations
export const MODULE_CONFIGS: Record<ModuleIdentifier, ModuleConfig> = {
  service_pages: {
    tableName: 'service_pages',
    displayName: 'Service Pages',
    activeField: 'status',
    activeValue: 'published',
    titleField: 'title',
    icon: 'FileJson'
  },
  jobs: {
    tableName: 'jobs',
    displayName: 'Jobs',
    activeField: 'status',
    activeValue: 'active',
    titleField: 'title',
    icon: 'Briefcase'
  },
  team_members: {
    tableName: 'team_members',
    displayName: 'Team Members',
    activeField: 'is_active',
    activeValue: true,
    titleField: 'name',
    icon: 'Users'
  },
  testimonials: {
    tableName: 'testimonials',
    displayName: 'Testimonials',
    activeField: 'is_active',
    activeValue: true,
    titleField: 'author_name',
    icon: 'MessageSquare'
  },
  industries: {
    tableName: 'industries',
    displayName: 'Industries',
    activeField: 'is_active',
    activeValue: true,
    titleField: 'name',
    icon: 'Factory'
  },
  technology_stack: {
    tableName: 'technology_stack',
    displayName: 'Technologies',
    activeField: 'is_active',
    activeValue: true,
    titleField: 'name',
    icon: 'Layers'
  },
  faqs: {
    tableName: 'faqs',
    displayName: 'FAQs',
    activeField: 'is_active',
    activeValue: true,
    titleField: 'question',
    icon: 'HelpCircle'
  },
  client_logos: {
    tableName: 'client_logos',
    displayName: 'Client Logos',
    activeField: 'is_active',
    activeValue: true,
    titleField: 'company_name',
    icon: 'Building'
  },
  company_info: {
    tableName: 'company_info',
    displayName: 'Company Info',
    activeField: '',
    activeValue: true,
    titleField: 'company_name',
    icon: 'Info'
  }
};

interface TranslationResult {
  success: boolean;
  translatedContent?: any;
  error?: string;
  tokensUsed?: number;
  costUSD?: number;
}

// Result for module-specific translation
export interface ModuleTranslationResult {
  success: boolean;
  totalItems: number;
  translatedItems: number;
  skippedItems: number;
  failedItems: number;
  totalTokens: number;
  errors: string[];
  lastTranslatedAt?: string;
}

// Module status for tracking translation state
export interface ModuleTranslationStatus {
  module: ModuleIdentifier;
  isTranslating: boolean;
  lastTranslatedAt?: string;
  totalItems: number;
  pendingItems: number;
  error?: string;
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

  // ============================================
  // MODULE-SPECIFIC TRANSLATION (GRANULAR)
  // ============================================

  /**
   * Get items that need translation for a specific module
   * Implements delta logic: only returns items modified since last translation
   */
  async getItemsNeedingTranslation(
    module: ModuleIdentifier, 
    targetLanguage: 'nl' | 'de',
    forceAll: boolean = false
  ): Promise<{ items: any[]; totalCount: number; pendingCount: number }> {
    const config = MODULE_CONFIGS[module];
    const lastTranslatedColumn = `last_translated_at_${targetLanguage}`;
    
    try {
      // Build base query
      // @ts-ignore - dynamic table access with config.tableName
      let query = supabase.from(config.tableName).select('*');
      
      // Add active filter if applicable
      if (config.activeField) {
        // @ts-ignore - dynamic field access
        query = query.eq(config.activeField, config.activeValue);
      }

      const { data: allItems, error: allError } = await query;
      
      if (allError) throw allError;
      
      const totalCount = allItems?.length || 0;
      
      if (forceAll || totalCount === 0) {
        return { items: allItems || [], totalCount, pendingCount: totalCount };
      }

      // Filter items that need translation (delta logic)
      // An item needs translation if:
      // 1. It has never been translated (last_translated_at is null)
      // 2. It was updated significantly after the last translation (updated_at > last_translated_at + tolerance)
      // Items with no updated_at but with last_translated_at are considered up-to-date
      //
      // We use a 5-second tolerance because database triggers may auto-update
      // the updated_at column slightly after we set last_translated_at during translation saves.
      const TIMESTAMP_TOLERANCE_MS = 5000; // 5 seconds tolerance
      
      const pendingItems = (allItems || []).filter((item: any) => {
        const lastTranslated = item[lastTranslatedColumn];
        const updatedAt = item.updated_at;
        
        // Never translated - needs translation
        if (!lastTranslated) return true;
        
        // Has been translated - check if content was modified since
        if (updatedAt) {
          const updatedAtTime = new Date(updatedAt).getTime();
          const lastTranslatedTime = new Date(lastTranslated).getTime();
          
          // Content was modified significantly after last translation - needs re-translation
          // We add tolerance to handle the race condition where database triggers
          // update updated_at slightly after we set last_translated_at
          if (updatedAtTime > lastTranslatedTime + TIMESTAMP_TOLERANCE_MS) return true;
        }
        
        // Already translated and either:
        // - no updated_at field (trust the translation)
        // - not modified since last translation (within tolerance)
        return false;
      });

      return { 
        items: pendingItems, 
        totalCount, 
        pendingCount: pendingItems.length 
      };
    } catch (error: any) {
      console.error(`Error fetching items for ${module}:`, error);
      return { items: [], totalCount: 0, pendingCount: 0 };
    }
  }

  /**
   * Translate a specific module (granular translation)
   * Only translates items that have been modified since last translation (delta)
   */
  async translateModule(
    module: ModuleIdentifier,
    targetLanguage: 'nl' | 'de',
    forceAll: boolean = false,
    onProgress?: (current: number, total: number, itemName: string) => void
  ): Promise<ModuleTranslationResult> {
    if (!this.client) {
      throw new Error('API key not set. Please call setApiKey() first.');
    }

    const config = MODULE_CONFIGS[module];
    const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
    
    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌍 MODULE TRANSLATION: ${config.displayName.padEnd(38)} ┃
┃  Target Language: ${targetLangFull.padEnd(43)} ┃
┃  Mode: ${forceAll ? 'Force All' : 'Delta (modified items only)'.padEnd(52)} ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);

    const result: ModuleTranslationResult = {
      success: true,
      totalItems: 0,
      translatedItems: 0,
      skippedItems: 0,
      failedItems: 0,
      totalTokens: 0,
      errors: []
    };

    try {
      // Get items needing translation
      const { items, totalCount, pendingCount } = await this.getItemsNeedingTranslation(
        module, 
        targetLanguage, 
        forceAll
      );

      result.totalItems = totalCount;
      result.skippedItems = totalCount - pendingCount;

      console.log(`📊 Total items: ${totalCount}, Pending translation: ${pendingCount}, Skipping: ${result.skippedItems}`);

      if (pendingCount === 0) {
        console.log('✅ No items need translation. All content is up to date!');
        // Don't set lastTranslatedAt here - no translations actually occurred
        // The UI will display the existing last translation timestamp from the database
        return result;
      }

      // Translate each item
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemTitle = item[config.titleField] || item.id;
        
        console.log(`[${i + 1}/${pendingCount}] Translating: ${itemTitle}`);
        
        if (onProgress) {
          onProgress(i + 1, pendingCount, itemTitle);
        }

        try {
          let translateResult: TranslationResult;

          // Call the appropriate individual translation method
          switch (module) {
            case 'service_pages':
              translateResult = await this.translateServicePage(item.id, targetLanguage);
              break;
            case 'jobs':
              translateResult = await this.translateJob(item.id, targetLanguage);
              break;
            case 'team_members':
              translateResult = await this.translateTeamMember(item.id, targetLanguage);
              break;
            case 'testimonials':
              translateResult = await this.translateTestimonial(item.id, targetLanguage);
              break;
            case 'industries':
              translateResult = await this.translateIndustry(item.id, targetLanguage);
              break;
            case 'technology_stack':
              translateResult = await this.translateTechnology(item.id, targetLanguage);
              break;
            case 'faqs':
              translateResult = await this.translateFAQ(item.id, targetLanguage);
              break;
            case 'client_logos':
              translateResult = await this.translateClientLogo(item.id, targetLanguage);
              break;
            case 'company_info':
              translateResult = await this.translateCompanyInfo(item.id, targetLanguage);
              break;
            default:
              throw new Error(`Unknown module: ${module}`);
          }

          if (translateResult.success) {
            result.translatedItems++;
            result.totalTokens += translateResult.tokensUsed || 0;
            console.log(`✅ Completed: ${itemTitle}`);
          } else {
            result.failedItems++;
            result.errors.push(`${itemTitle}: ${translateResult.error}`);
            console.error(`❌ Failed: ${itemTitle} - ${translateResult.error}`);
          }

          // Rate limiting delay
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          result.failedItems++;
          result.errors.push(`${itemTitle}: ${error.message}`);
          console.error(`❌ Error translating ${itemTitle}:`, error.message);
        }
      }

      result.success = result.failedItems === 0;
      result.lastTranslatedAt = new Date().toISOString();

      console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✅ MODULE TRANSLATION COMPLETED                  ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  Module:        ${config.displayName.padEnd(30)}┃
┃  Translated:    ${result.translatedItems.toString().padEnd(30)}┃
┃  Skipped:       ${result.skippedItems.toString().padEnd(30)}┃
┃  Failed:        ${result.failedItems.toString().padEnd(30)}┃
┃  Total Tokens:  ${result.totalTokens.toString().padEnd(30)}┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
`);

      return result;
    } catch (error: any) {
      console.error(`❌ Module translation failed:`, error);
      result.success = false;
      result.errors.push(error.message);
      return result;
    }
  }

  /**
   * Get translation status for all modules
   */
  async getModuleStatuses(targetLanguage: 'nl' | 'de'): Promise<Record<ModuleIdentifier, ModuleTranslationStatus>> {
    const statuses: Record<string, ModuleTranslationStatus> = {};
    
    for (const module of Object.keys(MODULE_CONFIGS) as ModuleIdentifier[]) {
      try {
        const { items, totalCount, pendingCount } = await this.getItemsNeedingTranslation(module, targetLanguage);
        
        // Get last translation timestamp from any translated item
        const config = MODULE_CONFIGS[module];
        const lastTranslatedColumn = `last_translated_at_${targetLanguage}`;
        
        // @ts-ignore - dynamic table access with config.tableName
        const { data: lastTranslated } = await supabase.from(config.tableName)
          .select(lastTranslatedColumn)
          .not(lastTranslatedColumn, 'is', null)
          .order(lastTranslatedColumn, { ascending: false })
          .limit(1);

        statuses[module] = {
          module,
          isTranslating: false,
          lastTranslatedAt: lastTranslated?.[0]?.[lastTranslatedColumn] || undefined,
          totalItems: totalCount,
          pendingItems: pendingCount
        };
      } catch (error) {
        statuses[module] = {
          module,
          isTranslating: false,
          totalItems: 0,
          pendingItems: 0,
          error: 'Failed to fetch status'
        };
      }
    }
    
    return statuses as Record<ModuleIdentifier, ModuleTranslationStatus>;
  }

  // ============================================
  // INDIVIDUAL ITEM TRANSLATION METHODS
  // ============================================

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

      // Update the database with translated content and timestamp
      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: page.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

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

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: job.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

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

  // ============================================
  // ADDITIONAL MODULE TRANSLATION METHODS
  // ============================================

  async translateTeamMember(memberId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n👤 Starting translation for team member: ${memberId}`);

    await this.logTranslation({
      table_name: 'team_members',
      record_id: memberId,
      status: 'started'
    });

    try {
      // @ts-ignore - table exists in database
      const { data: member, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (error || !member) {
        throw new Error('Team member not found');
      }

      console.log(`📋 Translating team member: ${member.name}`);

      const contentToTranslate: any = {};
      const fields = ['name', 'role', 'bio'];

      fields.forEach(field => {
        if (member[field]) {
          contentToTranslate[field] = member[field];
        }
      });

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate this JSON from English to ${targetLangFull}.

CRITICAL RULES:
1. Keep ALL JSON keys EXACTLY as-is
2. Translate ONLY the string values
3. Keep proper names (person names) in original form
4. Translate job titles/roles appropriately
5. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: member.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

      // @ts-ignore
      const { error: updateError } = await supabase
        .from('team_members')
        .update(updatePayload)
        .eq('id', memberId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'team_members',
        record_id: memberId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Team member translation completed! Tokens: ${totalTokens}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'team_members',
        record_id: memberId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateTestimonial(testimonialId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n💬 Starting translation for testimonial: ${testimonialId}`);

    await this.logTranslation({
      table_name: 'testimonials',
      record_id: testimonialId,
      status: 'started'
    });

    try {
      // @ts-ignore
      const { data: testimonial, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('id', testimonialId)
        .single();

      if (error || !testimonial) {
        throw new Error('Testimonial not found');
      }

      console.log(`📋 Translating testimonial from: ${testimonial.author_name}`);

      const contentToTranslate: any = {};
      const fields = ['quote', 'author_role', 'company_name'];

      fields.forEach(field => {
        if (testimonial[field]) {
          contentToTranslate[field] = testimonial[field];
        }
      });

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate this JSON from English to ${targetLangFull}.

CRITICAL RULES:
1. Keep ALL JSON keys EXACTLY as-is
2. Translate ONLY the string values
3. Keep company names in original form unless they have well-known translations
4. Translate job titles/roles appropriately
5. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: testimonial.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

      // @ts-ignore
      const { error: updateError } = await supabase
        .from('testimonials')
        .update(updatePayload)
        .eq('id', testimonialId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'testimonials',
        record_id: testimonialId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Testimonial translation completed! Tokens: ${totalTokens}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'testimonials',
        record_id: testimonialId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateIndustry(industryId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n🏭 Starting translation for industry: ${industryId}`);

    await this.logTranslation({
      table_name: 'industries',
      record_id: industryId,
      status: 'started'
    });

    try {
      // @ts-ignore
      const { data: industry, error } = await supabase
        .from('industries')
        .select('*')
        .eq('id', industryId)
        .single();

      if (error || !industry) {
        throw new Error('Industry not found');
      }

      console.log(`📋 Translating industry: ${industry.name}`);

      const contentToTranslate: any = {};
      
      if (industry.name) contentToTranslate.name = industry.name;
      if (industry.description) contentToTranslate.description = industry.description;
      if (industry.features && Array.isArray(industry.features) && industry.features.length > 0) {
        contentToTranslate.features = industry.features;
      }
      if (industry.content_sections) {
        contentToTranslate.content_sections = industry.content_sections;
      }

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

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

      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: industry.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

      // @ts-ignore
      const { error: updateError } = await supabase
        .from('industries')
        .update(updatePayload)
        .eq('id', industryId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'industries',
        record_id: industryId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Industry translation completed! Tokens: ${totalTokens}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'industries',
        record_id: industryId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateTechnology(techId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n🔧 Starting translation for technology: ${techId}`);

    await this.logTranslation({
      table_name: 'technology_stack',
      record_id: techId,
      status: 'started'
    });

    try {
      // @ts-ignore
      const { data: tech, error } = await supabase
        .from('technology_stack')
        .select('*')
        .eq('id', techId)
        .single();

      if (error || !tech) {
        throw new Error('Technology not found');
      }

      console.log(`📋 Translating technology: ${tech.name}`);

      const contentToTranslate: any = {};
      
      if (tech.name) contentToTranslate.name = tech.name;
      if (tech.description) contentToTranslate.description = tech.description;

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate this JSON from English to ${targetLangFull}.

CRITICAL RULES:
1. Keep ALL JSON keys EXACTLY as-is
2. Translate ONLY the string values
3. Keep technical terms in English: SAP, ERP, CRM, S/4HANA, Fiori, BTP, Ariba, API, HANA, etc.
4. Keep product names like "SAP S/4HANA", "SAP Fiori" unchanged
5. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: tech.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

      // @ts-ignore
      const { error: updateError } = await supabase
        .from('technology_stack')
        .update(updatePayload)
        .eq('id', techId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'technology_stack',
        record_id: techId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Technology translation completed! Tokens: ${totalTokens}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'technology_stack',
        record_id: techId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateFAQ(faqId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n❓ Starting translation for FAQ: ${faqId}`);

    await this.logTranslation({
      table_name: 'faqs',
      record_id: faqId,
      status: 'started'
    });

    try {
      // @ts-ignore
      const { data: faq, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('id', faqId)
        .single();

      if (error || !faq) {
        throw new Error('FAQ not found');
      }

      console.log(`📋 Translating FAQ: ${faq.question.substring(0, 50)}...`);

      const contentToTranslate: any = {};
      
      if (faq.question) contentToTranslate.question = faq.question;
      if (faq.answer) contentToTranslate.answer = faq.answer;

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

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
4. Maintain the question-answer format appropriately
5. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: faq.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

      // @ts-ignore
      const { error: updateError } = await supabase
        .from('faqs')
        .update(updatePayload)
        .eq('id', faqId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'faqs',
        record_id: faqId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ FAQ translation completed! Tokens: ${totalTokens}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'faqs',
        record_id: faqId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateClientLogo(logoId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n🏢 Starting translation for client logo: ${logoId}`);

    await this.logTranslation({
      table_name: 'client_logos',
      record_id: logoId,
      status: 'started'
    });

    try {
      // @ts-ignore
      const { data: logo, error } = await supabase
        .from('client_logos')
        .select('*')
        .eq('id', logoId)
        .single();

      if (error || !logo) {
        throw new Error('Client logo not found');
      }

      console.log(`📋 Translating client logo: ${logo.company_name}`);

      const contentToTranslate: any = {};
      
      if (logo.company_name) contentToTranslate.company_name = logo.company_name;

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate this JSON from English to ${targetLangFull}.

CRITICAL RULES:
1. Keep ALL JSON keys EXACTLY as-is
2. Keep company names in their original form (do not translate brand names)
3. Only translate if there's a well-known local name
4. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: logo.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

      // @ts-ignore
      const { error: updateError } = await supabase
        .from('client_logos')
        .update(updatePayload)
        .eq('id', logoId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'client_logos',
        record_id: logoId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Client logo translation completed! Tokens: ${totalTokens}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'client_logos',
        record_id: logoId,
        status: 'failed',
        error_message: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  async translateCompanyInfo(infoId: string, targetLanguage: 'nl' | 'de'): Promise<TranslationResult> {
    console.log(`\n🏛️ Starting translation for company info: ${infoId}`);

    await this.logTranslation({
      table_name: 'company_info',
      record_id: infoId,
      status: 'started'
    });

    try {
      // @ts-ignore
      const { data: info, error } = await supabase
        .from('company_info')
        .select('*')
        .eq('id', infoId)
        .single();

      if (error || !info) {
        throw new Error('Company info not found');
      }

      console.log(`📋 Translating company info: ${info.company_name}`);

      const contentToTranslate: any = {};
      
      if (info.company_name) contentToTranslate.company_name = info.company_name;
      if (info.netherlands_address) contentToTranslate.netherlands_address = info.netherlands_address;
      if (info.india_address) contentToTranslate.india_address = info.india_address;
      if (info.copyright_text) contentToTranslate.copyright_text = info.copyright_text;

      const targetLangFull = targetLanguage === 'nl' ? 'Dutch (Netherlands)' : 'German (Germany)';
      const jsonString = JSON.stringify(contentToTranslate);

      const chatCompletion = await this.client!.chat.completions.create({
        model: this.MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate this JSON from English to ${targetLangFull}.

CRITICAL RULES:
1. Keep ALL JSON keys EXACTLY as-is
2. Keep company names in their original form
3. Keep actual address details (street names, city names, postal codes) unchanged
4. Translate generic terms like "All Rights Reserved" appropriately
5. Return ONLY valid, complete JSON with NO markdown, NO comments, NO extra text

Return the complete translated JSON starting with { and ending with }`
          },
          {
            role: 'user',
            content: jsonString
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      });

      let translatedText: string =
        (chatCompletion as any).choices?.[0]?.message?.content ??
        (chatCompletion as any).choices?.[0]?.text ??
        (chatCompletion as any).generated_text ??
        '';

      const totalTokens = chatCompletion.usage?.total_tokens || 0;

      let cleanedText = translatedText.trim();
      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      }

      const translatedContent = JSON.parse(cleanedText);

      // IMPORTANT: Preserve the original updated_at so it only changes when actual content changes
      const updatePayload: any = {
        translation_status: 'translated',
        updated_at: info.updated_at // Preserve original updated_at
      };
      updatePayload[`content_${targetLanguage}`] = translatedContent;
      updatePayload[`last_translated_at_${targetLanguage}`] = new Date().toISOString();

      // @ts-ignore
      const { error: updateError } = await supabase
        .from('company_info')
        .update(updatePayload)
        .eq('id', infoId);

      if (updateError) throw updateError;

      const costUSD = this.calculateCost(totalTokens);

      await this.logTranslation({
        table_name: 'company_info',
        record_id: infoId,
        status: 'completed',
        tokens_used: totalTokens,
        cost_usd: costUSD
      });

      console.log(`✅ Company info translation completed! Tokens: ${totalTokens}`);

      return {
        success: true,
        translatedContent,
        tokensUsed: totalTokens,
        costUSD
      };
    } catch (error: any) {
      await this.logTranslation({
        table_name: 'company_info',
        record_id: infoId,
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

    console.log(`📦 BATCH MODE: Translating items individually (one API call per item)\n`);

    // Translate each service page individually
    if (dataToTranslate.service_pages && Object.keys(dataToTranslate.service_pages).length > 0) {
      const pageIds = Object.keys(dataToTranslate.service_pages);
      console.log(`📚 Translating ${pageIds.length} service pages...\n`);

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
      console.log(`\n💼 Translating ${jobIds.length} jobs...\n`);

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

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${jobInfo.title}:`, error.message);
        }
      }
    }

    // Translate team members
    if (dataToTranslate.team_members && Object.keys(dataToTranslate.team_members).length > 0) {
      const memberIds = Object.keys(dataToTranslate.team_members);
      console.log(`\n👤 Translating ${memberIds.length} team members...\n`);

      for (let i = 0; i < memberIds.length; i++) {
        const memberId = memberIds[i];
        const memberInfo = dataToTranslate.team_members[memberId];

        console.log(`[${i + 1}/${memberIds.length}] Translating: ${memberInfo.title}`);

        try {
          const result = await this.translateTeamMember(memberId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${memberInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${memberInfo.title} - ${result.error}\n`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${memberInfo.title}:`, error.message);
        }
      }
    }

    // Translate testimonials
    if (dataToTranslate.testimonials && Object.keys(dataToTranslate.testimonials).length > 0) {
      const testimonialIds = Object.keys(dataToTranslate.testimonials);
      console.log(`\n💬 Translating ${testimonialIds.length} testimonials...\n`);

      for (let i = 0; i < testimonialIds.length; i++) {
        const testimonialId = testimonialIds[i];
        const testimonialInfo = dataToTranslate.testimonials[testimonialId];

        console.log(`[${i + 1}/${testimonialIds.length}] Translating: ${testimonialInfo.title}`);

        try {
          const result = await this.translateTestimonial(testimonialId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${testimonialInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${testimonialInfo.title} - ${result.error}\n`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${testimonialInfo.title}:`, error.message);
        }
      }
    }

    // Translate industries
    if (dataToTranslate.industries && Object.keys(dataToTranslate.industries).length > 0) {
      const industryIds = Object.keys(dataToTranslate.industries);
      console.log(`\n🏭 Translating ${industryIds.length} industries...\n`);

      for (let i = 0; i < industryIds.length; i++) {
        const industryId = industryIds[i];
        const industryInfo = dataToTranslate.industries[industryId];

        console.log(`[${i + 1}/${industryIds.length}] Translating: ${industryInfo.title}`);

        try {
          const result = await this.translateIndustry(industryId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${industryInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${industryInfo.title} - ${result.error}\n`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${industryInfo.title}:`, error.message);
        }
      }
    }

    // Translate technology stack
    if (dataToTranslate.technology_stack && Object.keys(dataToTranslate.technology_stack).length > 0) {
      const techIds = Object.keys(dataToTranslate.technology_stack);
      console.log(`\n🔧 Translating ${techIds.length} technologies...\n`);

      for (let i = 0; i < techIds.length; i++) {
        const techId = techIds[i];
        const techInfo = dataToTranslate.technology_stack[techId];

        console.log(`[${i + 1}/${techIds.length}] Translating: ${techInfo.title}`);

        try {
          const result = await this.translateTechnology(techId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${techInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${techInfo.title} - ${result.error}\n`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${techInfo.title}:`, error.message);
        }
      }
    }

    // Translate FAQs
    if (dataToTranslate.faqs && Object.keys(dataToTranslate.faqs).length > 0) {
      const faqIds = Object.keys(dataToTranslate.faqs);
      console.log(`\n❓ Translating ${faqIds.length} FAQs...\n`);

      for (let i = 0; i < faqIds.length; i++) {
        const faqId = faqIds[i];
        const faqInfo = dataToTranslate.faqs[faqId];

        console.log(`[${i + 1}/${faqIds.length}] Translating: ${faqInfo.title}`);

        try {
          const result = await this.translateFAQ(faqId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${faqInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${faqInfo.title} - ${result.error}\n`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${faqInfo.title}:`, error.message);
        }
      }
    }

    // Translate client logos
    if (dataToTranslate.client_logos && Object.keys(dataToTranslate.client_logos).length > 0) {
      const logoIds = Object.keys(dataToTranslate.client_logos);
      console.log(`\n🏢 Translating ${logoIds.length} client logos...\n`);

      for (let i = 0; i < logoIds.length; i++) {
        const logoId = logoIds[i];
        const logoInfo = dataToTranslate.client_logos[logoId];

        console.log(`[${i + 1}/${logoIds.length}] Translating: ${logoInfo.title}`);

        try {
          const result = await this.translateClientLogo(logoId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${logoInfo.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${logoInfo.title} - ${result.error}\n`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${logoInfo.title}:`, error.message);
        }
      }
    }

    // Translate company info
    if (dataToTranslate.company_info && Object.keys(dataToTranslate.company_info).length > 0) {
      const infoIds = Object.keys(dataToTranslate.company_info);
      console.log(`\n🏛️ Translating ${infoIds.length} company info records...\n`);

      for (let i = 0; i < infoIds.length; i++) {
        const infoId = infoIds[i];
        const infoData = dataToTranslate.company_info[infoId];

        console.log(`[${i + 1}/${infoIds.length}] Translating: ${infoData.title}`);

        try {
          const result = await this.translateCompanyInfo(infoId, targetLanguage);
          if (result.success) {
            totalSuccess++;
            totalTokens += result.tokensUsed || 0;
            console.log(`✅ Completed: ${infoData.title}\n`);
          } else {
            totalFailed++;
            console.error(`❌ Failed: ${infoData.title} - ${result.error}\n`);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error: any) {
          totalFailed++;
          console.error(`❌ Error translating ${infoData.title}:`, error.message);
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
┃  Method:        One API call per item${' '.padEnd(10)}┃
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

    console.log(`
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌍 BULK TRANSLATION STARTED (ALL MODULES)                        ┃
┃  Target Language: ${targetLangFull.padEnd(40)} ┃
┃  Model: ${this.MODEL_NAME.padEnd(50)} ┃
┃  Provider: Hugging Face Router + Groq (FREE!)                      ┃
┃  Method: One API call per item for reliability                     ┃
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

      // Fetch team members
      // @ts-ignore
      const { data: teamMembers, error: teamMembersError } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true);

      if (teamMembersError) console.warn('Could not fetch team members:', teamMembersError);

      // Fetch testimonials
      // @ts-ignore
      const { data: testimonials, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true);

      if (testimonialsError) console.warn('Could not fetch testimonials:', testimonialsError);

      // Fetch industries
      // @ts-ignore
      const { data: industries, error: industriesError } = await supabase
        .from('industries')
        .select('*')
        .eq('is_active', true);

      if (industriesError) console.warn('Could not fetch industries:', industriesError);

      // Fetch technology stack
      // @ts-ignore
      const { data: techStack, error: techStackError } = await supabase
        .from('technology_stack')
        .select('*')
        .eq('is_active', true);

      if (techStackError) console.warn('Could not fetch technology stack:', techStackError);

      // Fetch FAQs
      // @ts-ignore
      const { data: faqs, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true);

      if (faqsError) console.warn('Could not fetch FAQs:', faqsError);

      // Fetch client logos
      // @ts-ignore
      const { data: clientLogos, error: clientLogosError } = await supabase
        .from('client_logos')
        .select('*')
        .eq('is_active', true);

      if (clientLogosError) console.warn('Could not fetch client logos:', clientLogosError);

      // Fetch company info
      // @ts-ignore
      const { data: companyInfo, error: companyInfoError } = await supabase
        .from('company_info')
        .select('*')
        .limit(1);

      if (companyInfoError) console.warn('Could not fetch company info:', companyInfoError);

      // Count total items
      const totalItems = 
        (pages?.length || 0) + 
        (jobs?.length || 0) + 
        (teamMembers?.length || 0) + 
        (testimonials?.length || 0) + 
        (industries?.length || 0) + 
        (techStack?.length || 0) + 
        (faqs?.length || 0) + 
        (clientLogos?.length || 0) + 
        (companyInfo?.length || 0);

      if (totalItems === 0) {
        console.log('⚠️  No content to translate');
        return { totalSuccess: 0, totalFailed: 0, totalTokens: 0, totalCost: 0 };
      }

      console.log(`\n📊 CONTENT SUMMARY:`);
      console.log(`   📚 Service Pages: ${pages?.length || 0}`);
      console.log(`   💼 Jobs: ${jobs?.length || 0}`);
      console.log(`   👤 Team Members: ${teamMembers?.length || 0}`);
      console.log(`   💬 Testimonials: ${testimonials?.length || 0}`);
      console.log(`   🏭 Industries: ${industries?.length || 0}`);
      console.log(`   🔧 Technologies: ${techStack?.length || 0}`);
      console.log(`   ❓ FAQs: ${faqs?.length || 0}`);
      console.log(`   🏢 Client Logos: ${clientLogos?.length || 0}`);
      console.log(`   🏛️ Company Info: ${companyInfo?.length || 0}`);
      console.log(`   ─────────────────────`);
      console.log(`   📦 TOTAL ITEMS: ${totalItems}`);
      console.log(`\n🔄 Preparing data for translation...\n`);

      // Prepare data structure for translation
      const dataToTranslate: any = {
        service_pages: {},
        jobs: {},
        team_members: {},
        testimonials: {},
        industries: {},
        technology_stack: {},
        faqs: {},
        client_logos: {},
        company_info: {}
      };

      // Add service pages
      if (pages && pages.length > 0) {
        pages.forEach((page: any) => {
          dataToTranslate.service_pages[page.id] = {
            title: page.title,
            data: page
          };
        });
      }

      // Add jobs
      if (jobs && jobs.length > 0) {
        jobs.forEach((job: any) => {
          dataToTranslate.jobs[job.id] = {
            title: job.title,
            data: job
          };
        });
      }

      // Add team members
      if (teamMembers && teamMembers.length > 0) {
        teamMembers.forEach((member: any) => {
          dataToTranslate.team_members[member.id] = {
            title: member.name,
            data: member
          };
        });
      }

      // Add testimonials
      if (testimonials && testimonials.length > 0) {
        testimonials.forEach((testimonial: any) => {
          dataToTranslate.testimonials[testimonial.id] = {
            title: `${testimonial.author_name} - ${testimonial.company_name}`,
            data: testimonial
          };
        });
      }

      // Add industries
      if (industries && industries.length > 0) {
        industries.forEach((industry: any) => {
          dataToTranslate.industries[industry.id] = {
            title: industry.name,
            data: industry
          };
        });
      }

      // Add technology stack
      if (techStack && techStack.length > 0) {
        techStack.forEach((tech: any) => {
          dataToTranslate.technology_stack[tech.id] = {
            title: tech.name,
            data: tech
          };
        });
      }

      // Add FAQs
      if (faqs && faqs.length > 0) {
        faqs.forEach((faq: any) => {
          dataToTranslate.faqs[faq.id] = {
            title: faq.question.substring(0, 50) + '...',
            data: faq
          };
        });
      }

      // Add client logos
      if (clientLogos && clientLogos.length > 0) {
        clientLogos.forEach((logo: any) => {
          dataToTranslate.client_logos[logo.id] = {
            title: logo.company_name,
            data: logo
          };
        });
      }

      // Add company info
      if (companyInfo && companyInfo.length > 0) {
        companyInfo.forEach((info: any) => {
          dataToTranslate.company_info[info.id] = {
            title: info.company_name,
            data: info
          };
        });
      }

      // Use batch mode (one API call per item)
      return await this.translateInBatches(dataToTranslate, pages || [], jobs || [], targetLanguage);

    } catch (error: any) {
      console.error('❌ Bulk translation failed:', error);
      return { totalSuccess: 0, totalFailed: 1, totalTokens: 0, totalCost: 0 };
    }
  }
}

export const translationService = new TranslationService();
