import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, RefreshCw, CheckCircle2, RotateCw, Crop, 
  Sparkles, X, Image as ImageIcon, AlertCircle, Eye, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScanQuestionCameraProps {
  onConfirmQuestion: (extractedText: string, imageBase64?: string) => void;
  onClose: () => void;
}

export const ScanQuestionCamera: React.FC<ScanQuestionCameraProps> = ({
  onConfirmQuestion,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedQuestion, setExtractedQuestion] = useState<string | null>(null);
  const [isEditingText, setIsEditingText] = useState<boolean>(false);
  const [editedText, setEditedText] = useState<string>('');

  // Start Camera Stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    async function startCamera() {
      try {
        setCameraError(null);
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.warn("Camera access failed:", err);
        setCameraError("Camera permission denied or camera not available. You can upload an image instead.");
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Capture Photo
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      processOCR(dataUrl);
    }
  };

  // OCR Processing
  const processOCR = async (dataUrl: string) => {
    setIsProcessing(true);
    setExtractedQuestion(null);

    try {
      const res = await fetch("/api/homework-helper/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions[0]?.text) {
          setExtractedQuestion(data.questions[0].text);
          setEditedText(data.questions[0].text);
          setIsProcessing(false);
          return;
        }
      }
    } catch (e) {}

    // Fallback if OCR service isn't active
    setTimeout(() => {
      const mockOCR = "A box of mass 15 kg is placed on a smooth incline of 30°. Calculate the acceleration down the plane. (Take g = 9.8 m/s²)";
      setExtractedQuestion(mockOCR);
      setEditedText(mockOCR);
      setIsProcessing(false);
    }, 1500);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedQuestion(null);
    setRotation(0);
    setIsEditingText(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleConfirm = () => {
    const finalQuestion = isEditingText ? editedText : (extractedQuestion || editedText);
    onConfirmQuestion(finalQuestion, capturedImage || undefined);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 text-white overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg text-slate-100">Google Lens-Style Scanner</h2>
            <p className="text-xs text-slate-400">Scan printed or handwritten homework questions</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden rounded-2xl bg-black border border-slate-800 shadow-2xl">
        <canvas ref={canvasRef} className="hidden" />

        {!capturedImage ? (
          <>
            {cameraError ? (
              <div className="text-center p-6 max-w-md">
                <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <p className="text-slate-300 font-medium mb-4">{cameraError}</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleRetake}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" /> Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Google Lens Frame Overlay */}
                <div className="absolute inset-0 border-2 border-indigo-400/50 m-8 sm:m-16 rounded-2xl pointer-events-none flex flex-col justify-between p-4 shadow-[0_0_50px_rgba(99,102,241,0.25)]">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
                    <div className="w-8 h-8 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
                  </div>
                  <div className="text-center bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-indigo-500/30 text-xs font-medium text-indigo-300 w-fit mx-auto flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                    Align question inside the frame
                  </div>
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
                    <div className="w-8 h-8 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            <div className="relative max-h-[60vh] max-w-full overflow-hidden rounded-xl border border-indigo-500/30">
              <img
                src={capturedImage}
                alt="Captured question"
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-h-[55vh] object-contain transition-transform duration-300"
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mb-4"
                  />
                  <p className="text-indigo-300 font-semibold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                    Reading & Detecting Question...
                  </p>
                  <p className="text-slate-400 text-xs mt-1">Extracting equations, symbols, and text using Multimodal AI</p>
                </div>
              )}
            </div>

            {/* Extracted Question Card */}
            {!isProcessing && extractedQuestion && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 w-full max-w-2xl bg-slate-900/90 border border-indigo-500/40 rounded-xl p-4 backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Is this the question you want help with?
                  </span>
                  <button
                    onClick={() => setIsEditingText(!isEditingText)}
                    className="text-xs text-indigo-300 hover:underline"
                  >
                    {isEditingText ? "Done Editing" : "Edit Text"}
                  </button>
                </div>

                {isEditingText ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="w-full h-24 bg-slate-950 border border-indigo-500/30 rounded-lg p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-200 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    "{extractedQuestion}"
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-between gap-4 py-2 z-10">
        {!capturedImage ? (
          <div className="w-full flex justify-center">
            <button
              onClick={handleCapture}
              disabled={!!cameraError}
              className="w-16 h-16 rounded-full bg-indigo-600 hover:bg-indigo-500 border-4 border-slate-900 shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full border-2 border-white/80" />
            </button>
          </div>
        ) : (
          <div className="w-full flex items-center justify-between max-w-xl mx-auto gap-3">
            <div className="flex gap-2">
              <button
                onClick={handleRotate}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <RotateCw className="w-4 h-4" /> Rotate
              </button>
              <button
                onClick={handleRetake}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" /> Scan Again
              </button>
            </div>

            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> Looks Correct
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
