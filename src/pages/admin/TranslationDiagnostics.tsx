import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface DiagnosticResult {
  id: string;
  title: string;
  slug?: string;
  type: 'service_page' | 'job';
  translation_status: string;
  has_content_nl: boolean;
  missing_fields: string[];
  empty_arrays: string[];
  issues: string[];
}

export default function TranslationDiagnostics() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    fullyTranslated: 0,
    partiallyTranslated: 0,
    notTranslated: 0,
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setLoading(true);
    const diagnosticResults: DiagnosticResult[] = [];

    try {
      // Check service pages
      const { data: servicePages } = await supabase
        .from('service_pages')
        .select('*')
        .eq('status', 'published');

      if (servicePages) {
        for (const page of servicePages) {
          const result = analyzeServicePage(page);
          diagnosticResults.push(result);
        }
      }

      // Check jobs
      const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active');

      if (jobs) {
        for (const job of jobs) {
          const result = analyzeJob(job);
          diagnosticResults.push(result);
        }
      }

      setResults(diagnosticResults);

      // Calculate summary
      const fullyTranslated = diagnosticResults.filter(r => r.issues.length === 0).length;
      const partiallyTranslated = diagnosticResults.filter(
        r => r.has_content_nl && r.issues.length > 0
      ).length;
      const notTranslated = diagnosticResults.filter(r => !r.has_content_nl).length;

      setSummary({
        total: diagnosticResults.length,
        fullyTranslated,
        partiallyTranslated,
        notTranslated,
      });

      console.log('🔍 Translation Diagnostics Complete');
      console.log(`Total: ${diagnosticResults.length}`);
      console.log(`Fully Translated: ${fullyTranslated}`);
      console.log(`Partially Translated: ${partiallyTranslated}`);
      console.log(`Not Translated: ${notTranslated}`);
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error('Failed to run diagnostics');
    } finally {
      setLoading(false);
    }
  };

  const analyzeServicePage = (page: any): DiagnosticResult => {
    const issues: string[] = [];
    const missing_fields: string[] = [];
    const empty_arrays: string[] = [];

    const nlContent = typeof page.content_nl === 'string' 
      ? JSON.parse(page.content_nl) 
      : page.content_nl;

    const has_content_nl = nlContent && Object.keys(nlContent).length > 0;

    if (!has_content_nl) {
      issues.push('No Dutch translation available');
      return {
        id: page.id,
        title: page.title,
        slug: page.slug,
        type: 'service_page',
        translation_status: page.translation_status || 'not_translated',
        has_content_nl: false,
        missing_fields: [],
        empty_arrays: [],
        issues,
      };
    }

    // Check required text fields
    const requiredTextFields = [
      'title',
      'hero_headline',
      'hero_subheadline',
      'introduction_title',
      'introduction_content',
      'differentiator_title',
      'differentiator_content',
    ];

    requiredTextFields.forEach(field => {
      if (!nlContent[field] || nlContent[field].trim().length === 0) {
        missing_fields.push(field);
        issues.push(`Missing: ${field}`);
      }
    });

    // Check array fields
    const arrayFields = [
      'process_steps',
      'tech_stack',
      'why_choose_us',
      'core_offerings',
      'benefits',
      'case_studies',
      'testimonials',
    ];

    arrayFields.forEach(field => {
      const enArray = page[field];
      const nlArray = nlContent[field];

      if (enArray && Array.isArray(enArray) && enArray.length > 0) {
        if (!nlArray) {
          missing_fields.push(field);
          issues.push(`Missing array: ${field} (${enArray.length} items in English)`);
        } else if (!Array.isArray(nlArray)) {
          issues.push(`Invalid: ${field} is not an array`);
        } else if (nlArray.length === 0) {
          empty_arrays.push(field);
          issues.push(`Empty array: ${field} (${enArray.length} items in English)`);
        } else if (nlArray.length !== enArray.length) {
          issues.push(`Length mismatch: ${field} (EN: ${enArray.length}, NL: ${nlArray.length})`);
        }
      }
    });

    return {
      id: page.id,
      title: page.title,
      slug: page.slug,
      type: 'service_page',
      translation_status: page.translation_status || 'unknown',
      has_content_nl,
      missing_fields,
      empty_arrays,
      issues,
    };
  };

  const analyzeJob = (job: any): DiagnosticResult => {
    const issues: string[] = [];
    const missing_fields: string[] = [];

    const nlContent = typeof job.content_nl === 'string' 
      ? JSON.parse(job.content_nl) 
      : job.content_nl;

    const has_content_nl = nlContent && Object.keys(nlContent).length > 0;

    if (!has_content_nl) {
      issues.push('No Dutch translation available');
      return {
        id: job.id,
        title: job.title,
        type: 'job',
        translation_status: job.translation_status || 'not_translated',
        has_content_nl: false,
        missing_fields: [],
        empty_arrays: [],
        issues,
      };
    }

    // Check required fields
    const requiredFields = ['title', 'description', 'requirements'];

    requiredFields.forEach(field => {
      if (!nlContent[field] || nlContent[field].trim().length === 0) {
        missing_fields.push(field);
        issues.push(`Missing: ${field}`);
      }
    });

    return {
      id: job.id,
      title: job.title,
      type: 'job',
      translation_status: job.translation_status || 'unknown',
      has_content_nl,
      missing_fields,
      empty_arrays: [],
      issues,
    };
  };

  const getStatusIcon = (result: DiagnosticResult) => {
    if (result.issues.length === 0) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (!result.has_content_nl) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (result: DiagnosticResult) => {
    if (result.issues.length === 0) return 'border-green-200 bg-green-50';
    if (!result.has_content_nl) return 'border-red-200 bg-red-50';
    return 'border-yellow-200 bg-yellow-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Translation Diagnostics</h1>
        <Button onClick={runDiagnostics} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-2">
          <div className="text-sm text-slate-600 mb-1">Total Items</div>
          <div className="text-3xl font-bold text-slate-800">{summary.total}</div>
        </Card>
        <Card className="p-4 border-2 border-green-200 bg-green-50">
          <div className="text-sm text-green-700 mb-1">Fully Translated</div>
          <div className="text-3xl font-bold text-green-800">{summary.fullyTranslated}</div>
        </Card>
        <Card className="p-4 border-2 border-yellow-200 bg-yellow-50">
          <div className="text-sm text-yellow-700 mb-1">Partial Translation</div>
          <div className="text-3xl font-bold text-yellow-800">{summary.partiallyTranslated}</div>
        </Card>
        <Card className="p-4 border-2 border-red-200 bg-red-50">
          <div className="text-sm text-red-700 mb-1">Not Translated</div>
          <div className="text-3xl font-bold text-red-800">{summary.notTranslated}</div>
        </Card>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-800">Detailed Results</h2>
        {results.map((result) => (
          <Card key={result.id} className={`p-4 border-2 ${getStatusColor(result)}`}>
            <div className="flex items-start gap-4">
              <div className="mt-1">{getStatusIcon(result)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">{result.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="capitalize">{result.type.replace('_', ' ')}</span>
                      {result.slug && <span>• {result.slug}</span>}
                      <span>• Status: {result.translation_status}</span>
                    </div>
                  </div>
                </div>

                {result.issues.length > 0 ? (
                  <div className="space-y-2 mt-3">
                    <div className="text-sm font-medium text-slate-700">Issues Found:</div>
                    <ul className="space-y-1">
                      {result.issues.map((issue, index) => (
                        <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="text-sm text-green-700 mt-2">✓ All translations complete</div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {results.length === 0 && !loading && (
        <Card className="p-8 text-center">
          <p className="text-slate-600">No content found to analyze</p>
        </Card>
      )}
    </div>
  );
}

