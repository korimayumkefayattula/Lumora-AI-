import React, { useState, useRef } from "react";
import { FileUp, FileText, Loader2, Download } from "lucide-react";
import { jsPDF } from "jspdf";

export default function DocumentAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setSummary("");
      setError("");
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError("");
    setSummary("");

    try {
      const base64Data = await toBase64(file);
      
      const response = await fetch("/api/analyze-document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData: base64Data,
          mimeType: file.type,
          promptText: "Analyze this document and provide a comprehensive summary of its contents."
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to analyze document");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!summary) return;
    const doc = new jsPDF();
    const splitText = doc.splitTextToSize(summary, 180);
    doc.text(splitText, 15, 15);
    doc.save(`summary-${file?.name || 'document'}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col mt-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 shrink-0 flex items-center justify-between">
        <h2 className="text-white font-bold font-display flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-100" />
          Document Analyzer
        </h2>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <FileUp className="w-8 h-8 text-blue-400 mb-2" />
          <p className="text-sm font-bold text-slate-700">Click to upload document</p>
          <p className="text-xs text-slate-500 mt-1">Supports PDF, PNG, JPG, TXT (Max 20MB)</p>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,image/png,image/jpeg,text/plain"
          />
        </div>

        {file && (
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
            <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
            <span className="text-[10px] text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!file || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl text-sm font-bold flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full shadow-md shadow-blue-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze & Summarize"
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Summary</h3>
              <button onClick={downloadPDF} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold bg-blue-50 px-2 py-1 rounded-md transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100 dark:border-slate-700 max-h-60 overflow-y-auto">
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
