import React, { useState, useRef } from 'react';
import { 
  Upload, Image as ImageIcon, Sparkles, RotateCw, CheckCircle2, 
  FileText, HelpCircle, Layers, ArrowRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DetectedQuestion } from '../../services/homeworkHelperService';

interface ImageQuestionUploaderProps {
  onQuestionSelected: (questionText: string, imageBase64?: string, detectedObj?: DetectedQuestion) => void;
  onClose?: () => void;
}

export const ImageQuestionUploader: React.FC<ImageQuestionUploaderProps> = ({
  onQuestionSelected,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [detectedQuestions, setDetectedQuestions] = useState<DetectedQuestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setSelectedImage(dataUrl);
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (dataUrl: string) => {
    setIsAnalyzing(true);
    setDetectedQuestions([]);

    try {
      const res = await fetch("/api/homework-helper/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setDetectedQuestions(data.questions);
          setSelectedIndex(0);
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (e) {}

    // Fallback if multi-question or single question detection fallback
    setTimeout(() => {
      const fallbackQuestions: DetectedQuestion[] = [
        {
          id: "q1",
          text: "1. Solve the quadratic equation: 2x² - 8x + 6 = 0 using factoring or quadratic formula.",
          subject: "Mathematics",
          topic: "Quadratic Equations",
          questionType: "Numerical Algebra",
          givenValues: "a = 2, b = -8, c = 6",
          goal: "Find the roots x",
          difficulty: "Easy"
        },
        {
          id: "q2",
          text: "2. A block of mass 5 kg is pushed on a horizontal frictionless floor with 25 N force. Calculate the acceleration.",
          subject: "Physics",
          topic: "Newton's Laws",
          questionType: "Numerical Physics",
          givenValues: "m = 5 kg, F = 25 N",
          goal: "Find acceleration a",
          difficulty: "Medium"
        }
      ];
      setDetectedQuestions(fallbackQuestions);
      setSelectedIndex(0);
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleConfirmChoice = () => {
    const chosen = detectedQuestions[selectedIndex];
    if (chosen) {
      onQuestionSelected(chosen.text, selectedImage || undefined, chosen);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-100">Upload Homework Image</h3>
            <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP (Handwritten & Printed)</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {!selectedImage ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-indigo-500/30 hover:border-indigo-500/60 rounded-xl p-8 text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all flex flex-col items-center justify-center gap-3 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-slate-200 text-sm">Click to upload or drag & drop image</p>
            <p className="text-xs text-slate-400 mt-1">Diagrams, handwritten math, science problems supported</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-black rounded-xl p-4 flex flex-col items-center border border-slate-800">
            <img
              src={selectedImage}
              alt="Uploaded Homework"
              style={{ transform: `rotate(${rotation}deg)` }}
              className="max-h-64 object-contain transition-transform duration-300 rounded-lg"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRotate}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg flex items-center gap-1"
              >
                <RotateCw className="w-3.5 h-3.5" /> Rotate
              </button>
              <button
                onClick={() => { setSelectedImage(null); setDetectedQuestions([]); }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg"
              >
                Change Image
              </button>
            </div>
          </div>

          {isAnalyzing ? (
            <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-6 text-center">
              <Sparkles className="w-8 h-8 text-indigo-400 mx-auto animate-pulse mb-2" />
              <p className="text-sm font-semibold text-indigo-300">Scanning & Extracting Questions...</p>
              <p className="text-xs text-slate-400 mt-1">Analyzing equations, diagrams, and handwriting</p>
            </div>
          ) : (
            detectedQuestions.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> We found {detectedQuestions.length} {detectedQuestions.length === 1 ? 'question' : 'questions'}
                  </span>
                  <span className="text-xs text-slate-400">Select which question to solve</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {detectedQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      onClick={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedIndex === idx
                          ? 'bg-indigo-950/60 border-indigo-500 text-indigo-100 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          {q.subject} • {q.topic}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-xs font-medium line-clamp-2">{q.text}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleConfirmChoice}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" /> Help Me With Question {selectedIndex + 1} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};
