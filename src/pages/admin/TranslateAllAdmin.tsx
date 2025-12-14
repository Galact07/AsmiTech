import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Languages, Loader2, CheckCircle, XCircle, Zap, AlertCircle, 
  Sparkles, FileJson, Users, MessageSquare, Factory, Layers, 
  HelpCircle, Building, Info, Briefcase, Clock, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  translationService, 
  ModuleIdentifier, 
  MODULE_CONFIGS,
  ModuleTranslationStatus,
  ModuleTranslationResult
} from '@/services/translationService';
import { staticTranslationService } from '@/services/staticTranslationService';
import { supabase } from '@/integrations/supabase/client';
import toast from 'react-hot-toast';

// Icon mapping for modules
const MODULE_ICONS: Record<ModuleIdentifier, React.ElementType> = {
  service_pages: FileJson,
  jobs: Briefcase,
  team_members: Users,
  testimonials: MessageSquare,
  industries: Factory,
  technology_stack: Layers,
  faqs: HelpCircle,
  company_info: Info
};

// Color mapping for modules
const MODULE_COLORS: Record<ModuleIdentifier, string> = {
  service_pages: 'text-blue-600',
  jobs: 'text-purple-600',
  team_members: 'text-green-600',
  testimonials: 'text-orange-600',
  industries: 'text-red-600',
  technology_stack: 'text-cyan-600',
  faqs: 'text-yellow-600',
  company_info: 'text-slate-600'
};

interface ContentCounts {
  service_pages: number;
  jobs: number;
  team_members: number;
  testimonials: number;
  industries: number;
  technology_stack: number;
  faqs: number;
  company_info: number;
}

interface ModuleTranslationState {
  isTranslating: boolean;
  progress: number;
  currentItem: string;
  lastResult?: ModuleTranslationResult;
  lastTranslatedAt?: string;
  pendingCount?: number;
  error?: string;
}

export default function TranslateAllAdmin() {
  const [apiKey, setApiKey] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<'nl' | 'de'>('nl');
  const [translatingStatic, setTranslatingStatic] = useState(false);
  const [staticResults, setStaticResults] = useState<any>(null);
  const [contentCounts, setContentCounts] = useState<ContentCounts>({
    service_pages: 0,
    jobs: 0,
    team_members: 0,
    testimonials: 0,
    industries: 0,
    technology_stack: 0,
    faqs: 0,
    company_info: 0
  });
  const [loadingCounts, setLoadingCounts] = useState(true);
  
  // Per-module translation state
  const [moduleStates, setModuleStates] = useState<Record<ModuleIdentifier, ModuleTranslationState>>({
    service_pages: { isTranslating: false, progress: 0, currentItem: '' },
    jobs: { isTranslating: false, progress: 0, currentItem: '' },
    team_members: { isTranslating: false, progress: 0, currentItem: '' },
    testimonials: { isTranslating: false, progress: 0, currentItem: '' },
    industries: { isTranslating: false, progress: 0, currentItem: '' },
    technology_stack: { isTranslating: false, progress: 0, currentItem: '' },
    faqs: { isTranslating: false, progress: 0, currentItem: '' },
    company_info: { isTranslating: false, progress: 0, currentItem: '' }
  });

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    module: ModuleIdentifier | null;
    forceAll: boolean;
  }>({
    isOpen: false,
    module: null,
    forceAll: false
  });

  // Fetch content counts and translation status
  const fetchContentData = useCallback(async () => {
    setLoadingCounts(true);
    try {
      // Fetch counts for all modules
      const [
        { count: servicePages },
        { count: jobs },
        { count: teamMembers },
        { count: testimonials },
        { count: industries },
        { count: techStack },
        { count: faqs },
        { count: companyInfo }
      ] = await Promise.all([
        supabase.from('service_pages').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        // @ts-ignore
        supabase.from('team_members').select('*', { count: 'exact', head: true }).eq('is_active', true),
        // @ts-ignore
        supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', true),
        // @ts-ignore
        supabase.from('industries').select('*', { count: 'exact', head: true }).eq('is_active', true),
        // @ts-ignore
        supabase.from('technology_stack').select('*', { count: 'exact', head: true }).eq('is_active', true),
        // @ts-ignore
        supabase.from('faqs').select('*', { count: 'exact', head: true }).eq('is_active', true),
        // @ts-ignore
        supabase.from('company_info').select('*', { count: 'exact', head: true })
      ]);

      setContentCounts({
        service_pages: servicePages || 0,
        jobs: jobs || 0,
        team_members: teamMembers || 0,
        testimonials: testimonials || 0,
        industries: industries || 0,
        technology_stack: techStack || 0,
        faqs: faqs || 0,
        company_info: companyInfo || 0
      });

      // Fetch translation status for each module
      await fetchModuleStatuses();
    } catch (error) {
      console.error('Error fetching content counts:', error);
    } finally {
      setLoadingCounts(false);
    }
  }, [targetLanguage]);

  // Fetch translation status for all modules
  const fetchModuleStatuses = async () => {
    const modules = Object.keys(MODULE_CONFIGS) as ModuleIdentifier[];
    
    for (const module of modules) {
      try {
        const config = MODULE_CONFIGS[module];
        const lastTranslatedColumn = `last_translated_at_${targetLanguage}`;
        
        // Get pending items count
        let query = supabase.from(config.tableName).select('*');
        if (config.activeField) {
          query = query.eq(config.activeField, config.activeValue);
        }
        // @ts-ignore
        const { data: allItems } = await query;
        
        // Use a tolerance to handle race condition where updated_at gets set
        // slightly after last_translated_at during the same save operation
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

        // Get last translation timestamp
        // @ts-ignore
        const { data: lastTranslated } = await supabase
          .from(config.tableName)
          .select(lastTranslatedColumn)
          .not(lastTranslatedColumn, 'is', null)
          .order(lastTranslatedColumn, { ascending: false })
          .limit(1);

        setModuleStates(prev => ({
          ...prev,
          [module]: {
            ...prev[module],
            lastTranslatedAt: lastTranslated?.[0]?.[lastTranslatedColumn] || undefined,
            pendingCount: pendingItems.length
          }
        }));
      } catch (error) {
        console.error(`Error fetching status for ${module}:`, error);
      }
    }
  };

  useEffect(() => {
    fetchContentData();
  }, [fetchContentData]);

  // Refresh statuses when language changes
  useEffect(() => {
    fetchModuleStatuses();
  }, [targetLanguage]);

  const totalItems = Object.values(contentCounts).reduce((a, b) => a + b, 0);

  // Handle static content translation
  const handleTranslateStatic = async () => {
    if (!apiKey) {
      toast.error('Please enter your Hugging Face API key');
      return;
    }

    if (!confirm(`This will translate the static content (en.json) to ${targetLanguage === 'nl' ? 'Dutch (nl.json)' : 'German (de.json)'}. This may take a few minutes. Continue?`)) {
      return;
    }

    setTranslatingStatic(true);
    setStaticResults(null);

    try {
      staticTranslationService.setApiKey(apiKey);
      toast.success('Static translation started! Check browser console for detailed logs.');
      const result = await staticTranslationService.translateStaticContent(targetLanguage);
      setStaticResults(result);

      if (result.success) {
        toast.success(`Static content translated! Download ${targetLanguage}.json and place it in src/locales/`);
      } else {
        toast.error(`Translation failed: ${result.error}`);
      }
    } catch (error: any) {
      console.error('Static translation error:', error);
      toast.error(error.message || 'Static translation failed');
    } finally {
      setTranslatingStatic(false);
    }
  };

  // Open confirmation modal for module translation
  const openTranslateModal = (module: ModuleIdentifier, forceAll: boolean = false) => {
    if (!apiKey) {
      toast.error('Please enter your Hugging Face API key first');
      return;
    }
    setConfirmModal({ isOpen: true, module, forceAll });
  };

  // Handle module translation after confirmation
  const handleTranslateModule = async () => {
    const { module, forceAll } = confirmModal;
    if (!module) return;

    setConfirmModal({ isOpen: false, module: null, forceAll: false });

    const config = MODULE_CONFIGS[module];
    
    // Update state to show translation in progress
    setModuleStates(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        isTranslating: true,
        progress: 0,
        currentItem: 'Starting...',
        error: undefined
      }
    }));

    try {
      translationService.setApiKey(apiKey);
      
      toast.success(`Started translating ${config.displayName}...`);

      const result = await translationService.translateModule(
        module,
        targetLanguage,
        forceAll,
        (current, total, itemName) => {
          const progress = Math.round((current / total) * 100);
          setModuleStates(prev => ({
            ...prev,
            [module]: {
              ...prev[module],
              progress,
              currentItem: itemName
            }
          }));
        }
      );

      // Update state with results
      setModuleStates(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          isTranslating: false,
          progress: 100,
          currentItem: '',
          lastResult: result,
          // Only update lastTranslatedAt if translations actually occurred
          lastTranslatedAt: result.lastTranslatedAt || prev[module].lastTranslatedAt,
          // Set pending to failed items count (items that still need attention)
          pendingCount: result.failedItems,
          error: result.success ? undefined : result.errors.join(', ')
        }
      }));

      if (result.success) {
        if (result.translatedItems === 0) {
          toast.success(`${config.displayName}: All content is already up to date!`);
        } else {
          toast.success(`${config.displayName} translated successfully! (${result.translatedItems} items)`);
        }
      } else {
        toast.error(`${config.displayName} translation completed with ${result.failedItems} errors`);
      }

      // Refresh module statuses
      await fetchModuleStatuses();
    } catch (error: any) {
      console.error(`Translation error for ${module}:`, error);
      
      setModuleStates(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          isTranslating: false,
          error: error.message
        }
      }));

      toast.error(`Failed to translate ${config.displayName}: ${error.message}`);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Check if any module is currently translating
  const isAnyModuleTranslating = Object.values(moduleStates).some(s => s.isTranslating);

  // Render module card with translation button
  const renderModuleCard = (module: ModuleIdentifier) => {
    const config = MODULE_CONFIGS[module];
    const Icon = MODULE_ICONS[module];
    const colorClass = MODULE_COLORS[module];
    const state = moduleStates[module];
    const count = contentCounts[module];
    const pendingCount = state.pendingCount ?? count;

    return (
      <motion.div
        key={module}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
      >
        {/* Header with icon and count */}
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`h-5 w-5 ${colorClass}`} />
          <div className="flex-1">
            <div className="text-sm font-medium">{config.displayName}</div>
            <div className={`text-lg font-bold ${colorClass}`}>{count}</div>
          </div>
        </div>

        {/* Translation status */}
        <div className="text-xs text-muted-foreground mb-3 space-y-1">
          {state.lastTranslatedAt && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last: {formatTimestamp(state.lastTranslatedAt)}</span>
            </div>
          )}
          {pendingCount > 0 && !state.isTranslating && (
            <Badge variant="secondary" className="text-xs">
              {pendingCount} pending
            </Badge>
          )}
          {pendingCount === 0 && count > 0 && !state.isTranslating && (
            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Up to date
            </Badge>
          )}
        </div>

        {/* Progress bar when translating */}
        {state.isTranslating && (
          <div className="mb-3 space-y-2">
            <Progress value={state.progress} className="h-2" />
            <div className="text-xs text-muted-foreground truncate">
              {state.currentItem}
            </div>
          </div>
        )}

        {/* Error display */}
        {state.error && (
          <div className="mb-3 text-xs text-red-600 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span className="truncate">{state.error}</span>
          </div>
        )}

        {/* Translate button */}
        <Button
          size="sm"
          variant={pendingCount > 0 ? 'default' : 'outline'}
          className="w-full gap-1 text-xs"
          disabled={count === 0 || state.isTranslating || isAnyModuleTranslating || !apiKey}
          onClick={() => openTranslateModal(module, false)}
        >
          {state.isTranslating ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Translating...
            </>
          ) : (
            <>
              <Languages className="h-3 w-3" />
              Translate {config.displayName}
            </>
          )}
        </Button>

        {/* Force retranslate option */}
        {count > 0 && pendingCount === 0 && !state.isTranslating && (
          <Button
            size="sm"
            variant="ghost"
            className="w-full gap-1 text-xs mt-1 text-muted-foreground"
            disabled={isAnyModuleTranslating || !apiKey}
            onClick={() => openTranslateModal(module, true)}
          >
            <RefreshCw className="h-3 w-3" />
            Force Retranslate All
          </Button>
        )}
      </motion.div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Translate Content - ASMI Admin</title>
      </Helmet>

      <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Languages className="h-8 w-8 text-primary" />
            Translate Content
          </h1>
          <p className="text-muted-foreground mt-2">
            Translate website content to {targetLanguage === 'nl' ? 'Dutch' : 'German'} using AI. 
            Select individual modules to translate only what you need.
          </p>
        </motion.div>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target Language</CardTitle>
            <CardDescription>Select the language you want to translate to. This applies to all module translations below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={targetLanguage === 'nl' ? 'default' : 'outline'}
                onClick={() => setTargetLanguage('nl')}
                className="w-32"
                disabled={isAnyModuleTranslating}
              >
                Dutch (NL)
              </Button>
              <Button
                variant={targetLanguage === 'de' ? 'default' : 'outline'}
                onClick={() => setTargetLanguage('de')}
                className="w-32"
                disabled={isAnyModuleTranslating}
              >
                German (DE)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* API Key Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-600" />
              Hugging Face API Configuration
            </CardTitle>
            <CardDescription>
              Enter your Hugging Face API key to enable FREE AI translation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Hugging Face API Key *</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="hf_..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  disabled={isAnyModuleTranslating || translatingStatic}
                />
                <p className="text-xs text-muted-foreground">
                  Get your FREE API key from{' '}
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Hugging Face Settings
                  </a>
                  {' '}(No credit card required!)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Static Content Translation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileJson className="h-5 w-5 text-blue-600" />
              Static Content Translation
            </CardTitle>
            <CardDescription>
              Translate static UI text (navigation, buttons, labels) stored in en.json
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleTranslateStatic}
              disabled={!apiKey || translatingStatic || isAnyModuleTranslating}
              className="gap-2"
            >
              {translatingStatic ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Translating Static Content...
                </>
              ) : (
                <>
                  <FileJson className="h-4 w-4" />
                  Translate Static Content
                </>
              )}
            </Button>

            {staticResults && !translatingStatic && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Static content translated! The {targetLanguage}.json file has been downloaded. 
                  Place it in <code className="bg-muted px-1 rounded">src/locales/</code>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Dynamic Content Overview with Per-Module Translation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Dynamic Content Translation
            </CardTitle>
            <CardDescription>
              Translate database content module by module. Only modified content will be translated (delta mode).
              {loadingCounts ? ' Loading...' : ` ${totalItems} total items across all modules.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingCounts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(MODULE_CONFIGS) as ModuleIdentifier[]).map(renderModuleCard)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="border-green-200 bg-green-50">
          <Sparkles className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>Smart Delta Translation:</strong> The system automatically detects which content has been 
            modified since the last translation and only translates those items. This reduces API usage and 
            speeds up the translation process. Use "Force Retranslate All" to translate everything regardless 
            of modification status.
          </AlertDescription>
        </Alert>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How Granular Translation Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Module-by-Module Translation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <div>
                      <strong>Select a Module:</strong> Click the "Translate" button on any content module above
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <div>
                      <strong>Confirm Translation:</strong> Review the details and confirm to start translation
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <div>
                      <strong>Delta Detection:</strong> Only items modified since last translation are processed
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">4.</span>
                    <div>
                      <strong>Auto-Save:</strong> Translations are saved to database immediately
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-primary">Benefits of Granular Translation</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Reduced API usage - only translate what's needed</li>
                  <li>Faster translation times - no waiting for unchanged content</li>
                  <li>Better control - translate modules independently</li>
                  <li>Progress tracking - see real-time status for each module</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm">
              <div>
                <strong className="text-muted-foreground">Model:</strong> GPT-OSS-20B via Groq (fast, high-quality)
              </div>
              <div>
                <strong className="text-muted-foreground">Provider:</strong> Hugging Face Router + Groq (100% FREE)
              </div>
              <div>
                <strong className="text-muted-foreground">Delta Detection:</strong> Compares <code className="bg-muted px-1 rounded">updated_at</code> with <code className="bg-muted px-1 rounded">last_translated_at_{targetLanguage}</code>
              </div>
              <div>
                <strong className="text-muted-foreground">Content Storage:</strong>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(Object.keys(MODULE_CONFIGS) as ModuleIdentifier[]).map(module => (
                    <Badge key={module} variant="outline">
                      {MODULE_CONFIGS[module].tableName}.content_{targetLanguage}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={confirmModal.isOpen} onOpenChange={(open) => !open && setConfirmModal({ isOpen: false, module: null, forceAll: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-primary" />
              Confirm Translation
            </DialogTitle>
            <DialogDescription>
              Review the translation details before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          {confirmModal.module && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Module</div>
                  <div className="font-medium">{MODULE_CONFIGS[confirmModal.module].displayName}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Target Language</div>
                  <div className="font-medium">{targetLanguage === 'nl' ? 'Dutch (NL)' : 'German (DE)'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Items</div>
                  <div className="font-medium">{contentCounts[confirmModal.module]}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Items to Translate</div>
                  <div className="font-medium">
                    {confirmModal.forceAll 
                      ? contentCounts[confirmModal.module] + ' (all)'
                      : (moduleStates[confirmModal.module].pendingCount ?? contentCounts[confirmModal.module]) + ' (pending)'
                    }
                  </div>
                </div>
              </div>

              {confirmModal.forceAll && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Force Retranslate:</strong> This will translate ALL items in this module, 
                    even if they haven't been modified. Use this if you need to refresh all translations.
                  </AlertDescription>
                </Alert>
              )}

              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription>
                  Translation may take a few minutes depending on the number of items. 
                  Progress will be shown on the module card.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmModal({ isOpen: false, module: null, forceAll: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleTranslateModule} className="gap-2">
              <Languages className="h-4 w-4" />
              Start Translation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
