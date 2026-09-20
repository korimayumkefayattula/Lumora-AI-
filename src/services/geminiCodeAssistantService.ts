export interface CodeSuggestion {
  type: 'bug' | 'enhancement' | 'syntax' | 'performance';
  title: string;
  description: string;
  file: 'html' | 'css' | 'js' | 'all';
}

export interface AnalyzeCodeResponse {
  success: boolean;
  summary: string;
  suggestions: CodeSuggestion[];
  improvedHtml: string;
  improvedCss: string;
  improvedJs: string;
  explanation: string;
  error?: string;
}

export async function analyzeCodeWithGemini(params: {
  html: string;
  css: string;
  js: string;
  mode: 'fix-bugs' | 'refactor' | 'explain' | 'optimize' | 'custom';
  instruction?: string;
  activeFile?: 'html' | 'css' | 'js' | 'all';
}): Promise<AnalyzeCodeResponse> {
  try {
    const res = await fetch('/api/builder/analyze-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with status ${res.status}`);
    }

    const data: AnalyzeCodeResponse = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      summary: 'Analysis could not be completed',
      suggestions: [
        {
          type: 'bug',
          title: 'Network or Server Communication',
          description: err?.message || 'Could not communicate with AI Code Assistant service.',
          file: 'all'
        }
      ],
      improvedHtml: params.html,
      improvedCss: params.css,
      improvedJs: params.js,
      explanation: `**Error:** ${err?.message || 'Please check your connection and try again.'}`,
      error: err?.message
    };
  }
}
