import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Languages, Loader2, CheckCircle, XCircle, Zap, AlertCircle, Sparkles, FileJson } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { translationService } from '@/services/translationService';
import { staticTranslationService } from '@/services/staticTranslationService';
import toast from 'react-hot-toast';

export default function TranslateAllAdmin() {
  const [apiKey, setApiKey] = useState('');
  const [targetLanguage, setTargetLanguage] = useState<'nl' | 'de'>('nl');
  const [translating, setTranslating] = useState(false);
  const [translatingStatic, setTranslatingStatic] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [staticResults, setStaticResults] = useState<any>(null);

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
      // Set API key
      staticTranslationService.setApiKey(apiKey);

      // Start static translation
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

  const handleTranslateAll = async () => {
    if (!apiKey) {
      toast.error('Please enter your OpenAI API key');
      return;
    }

    if (!confirm(`This will translate ALL service pages and job postings to ${targetLanguage === 'nl' ? 'Dutch' : 'German'}. This may take several minutes and will use OpenAI API credits. Continue?`)) {
      return;
    }

    setTranslating(true);
    setResults(null);

    try {
      // Set API key
      translationService.setApiKey(apiKey);

      // Start bulk translation
      toast.success('Translation started! Check browser console for detailed logs.');

      const result = await translationService.translateAll(targetLanguage);

      setResults(result);

      if (result.totalFailed === 0) {
        toast.success(`Successfully translated ${result.totalSuccess} items!`);
      } else {
        toast.error(`Completed with ${result.totalFailed} failures. Check console for details.`);
      }
    } catch (error: any) {
      console.error('Bulk translation error:', error);
      toast.error(error.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Translate Content - ASMI Admin</title>
      </Helmet>

      <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Languages className="h-8 w-8 text-primary" />
            Translate All Content to Dutch
          </h1>
          <p className="text-muted-foreground mt-2">
            Translate all service pages and job postings from English to {targetLanguage === 'nl' ? 'Dutch' : 'German'} using AI
          </p>
        </motion.div>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Target Language</CardTitle>
            <CardDescription>Select the language you want to translate to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                variant={targetLanguage === 'nl' ? 'default' : 'outline'}
                onClick={() => setTargetLanguage('nl')}
                className="w-32"
              >
                Dutch (NL)
              </Button>
              <Button
                variant={targetLanguage === 'de' ? 'default' : 'outline'}
                onClick={() => setTargetLanguage('de')}
                className="w-32"
              >
                German (DE)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert className="border-green-200 bg-green-50">
          <Sparkles className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong>Now using Hugging Face Router (FREE!):</strong> This will translate ALL published service pages and active job postings to {targetLanguage === 'nl' ? 'Dutch' : 'German'}.
            Using GPT-OSS-20B via Groq - fast, high-quality translations at no cost!
          </AlertDescription>
        </Alert>

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
                  disabled={translating || translatingStatic}
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

              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  onClick={handleTranslateStatic}
                  disabled={!apiKey || translatingStatic || translating}
                  size="lg"
                  variant="outline"
                  className="w-full gap-2"
                >
                  {translatingStatic ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Translating Static...
                    </>
                  ) : (
                    <>
                      <FileJson className="h-5 w-5" />
                      Translate Static Content
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleTranslateAll}
                  disabled={!apiKey || translating || translatingStatic}
                  size="lg"
                  className="w-full gap-2"
                >
                  {translating ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Translating Dynamic...
                    </>
                  ) : (
                    <>
                      <Languages className="h-5 w-5" />
                      Translate Dynamic Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Static Translation Progress */}
        {translatingStatic && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Static Content Translation in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ⏳ Translating en.json to {targetLanguage}.json... This may take a few minutes.
                </p>
                <p className="text-sm text-muted-foreground">
                  📊 Check your browser console (F12) for detailed logs
                </p>
                <p className="text-sm text-muted-foreground">
                  💾 The {targetLanguage}.json file will be downloaded automatically
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dynamic Translation Progress */}
        {translating && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Dynamic Content Translation in Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  ⏳ Translating database content... This may take several minutes.
                </p>
                <p className="text-sm text-muted-foreground">
                  📊 Check your browser console (F12) for detailed logs
                </p>
                <p className="text-sm text-muted-foreground">
                  💰 API usage and costs are tracked in real-time
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Static Translation Results */}
        {staticResults && !translatingStatic && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Static Content Translation Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      ✅ The {targetLanguage}.json file has been downloaded. Place it in the <code className="bg-muted px-1 rounded">src/locales/</code> folder.
                    </p>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Next Steps:</strong>
                      <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li>Find the downloaded {targetLanguage}.json file in your Downloads folder</li>
                        <li>Move it to <code className="bg-muted px-1 rounded">src/locales/{targetLanguage}.json</code></li>
                        <li>Refresh the website and test the language switcher</li>
                      </ol>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Dynamic Translation Results */}
        {results && !translating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Dynamic Content Translation Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Successful</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {results.totalSuccess}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium">Failed</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      {results.totalFailed}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Tokens</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.totalTokens.toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Cost</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      FREE! 🎉
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    ✅ All translations have been stored in the database. The language switcher will now display {targetLanguage === 'nl' ? 'Dutch' : 'German'} content when selected.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How the Translation System Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Static Content (Pages, Navigation, etc.)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <div>
                      <strong>Source:</strong> All static text is stored in <code className="bg-muted px-1 rounded">src/locales/en.json</code>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <div>
                      <strong>AI Translation:</strong> Click "Translate Static Content" to translate en.json to {targetLanguage}.json (FREE!)
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <div>
                      <strong>Download & Place:</strong> The {targetLanguage}.json file is downloaded; place it in <code className="bg-muted px-1 rounded">src/locales/</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-primary">Dynamic Content (Services, Jobs from Database)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <div>
                      <strong>Source:</strong> Service pages and jobs are stored in the database with English as primary language
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <div>
                      <strong>AI Translation:</strong> Click "Translate Dynamic Content" to translate all database content (FREE!)
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <div>
                      <strong>Storage:</strong> {targetLanguage === 'nl' ? 'Dutch' : 'German'} translations are stored in <code className="bg-muted px-1 rounded">content_{targetLanguage}</code> JSONB field
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-primary font-bold">4.</span>
                    <div>
                      <strong>Auto-translate New Items:</strong> When you add new services/jobs, they can be translated individually
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2 text-primary">Language Switching</h4>
                <p className="text-sm text-muted-foreground">
                  Users can toggle between English, Dutch, and German using the language switcher. If translated content is missing, it automatically falls back to English.
                </p>
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
                <strong className="text-muted-foreground">Translation Database:</strong>
                <code className="ml-2 bg-muted px-2 py-1 rounded">translation_logs</code>
              </div>
              <div>
                <strong className="text-muted-foreground">Content Storage:</strong>
                <code className="ml-2 bg-muted px-2 py-1 rounded">service_pages.content_nl</code>,{' '}
                <code className="bg-muted px-2 py-1 rounded">jobs.content_nl</code>
              </div>
              <div>
                <strong className="text-muted-foreground">Status Tracking:</strong> Each record has a{' '}
                <code className="bg-muted px-2 py-1 rounded">translation_status</code> field
              </div>
              <div>
                <strong className="text-muted-foreground">Cost:</strong> 100% FREE (Hugging Face Inference API)
              </div>
              <div>
                <strong className="text-muted-foreground">Logging:</strong> Real-time console logs + database logs
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

