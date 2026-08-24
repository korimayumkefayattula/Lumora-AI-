import React, { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

export default function LiveVoice() {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  
  const nextStartTimeRef = useRef<number>(0);

  const pcmToBase64 = (buffer: Float32Array) => {
    let l = buffer.length;
    let buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
    }
    const bytes = new Uint8Array(buf.buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playAudioChunk = (ctx: AudioContext, base64: string) => {
    setIsSpeaking(true);
    const binaryStr = atob(base64);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryStr.charCodeAt(i);
    const int16Array = new Int16Array(bytes.buffer);
    
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 0x7fff;
    }

    const audioBuffer = ctx.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);
    
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
      nextStartTimeRef.current = currentTime;
    }
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += audioBuffer.duration;
    
    source.onended = () => {
      // Very basic check if we're done speaking
      if (ctx.currentTime >= nextStartTimeRef.current) {
        setIsSpeaking(false);
      }
    };
  };

  const toggleConnection = async () => {
    if (isActive) {
      cleanup();
      return;
    }
    
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      wsRef.current = new WebSocket(`${protocol}//${window.location.host}/live`);
      
      const inputCtx = new window.AudioContext({ sampleRate: 16000 });
      const outputCtx = new window.AudioContext({ sampleRate: 24000 });
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      
      source.connect(processor);
      processor.connect(inputCtx.destination);
      
      processor.onaudioprocess = (e) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };
      
      wsRef.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.audio) {
          playAudioChunk(outputCtx, msg.audio);
        }
        if (msg.interrupted) {
          nextStartTimeRef.current = 0;
          setIsSpeaking(false);
        }
      };
      
      setIsActive(true);
    } catch (e) {
      console.error(e);
      cleanup();
    }
  };

  const cleanup = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current && inputCtxRef.current) {
      processorRef.current.disconnect();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (inputCtxRef.current) {
      inputCtxRef.current.close();
      inputCtxRef.current = null;
    }
    if (outputCtxRef.current) {
      outputCtxRef.current.close();
      outputCtxRef.current = null;
    }
    setIsActive(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => cleanup();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-150 shadow-sm overflow-hidden flex flex-col mt-6 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 dark:text-slate-100">Voice Conversation</h2>
          <p className="text-[11px] text-slate-500">Talk to Luminati AI directly</p>
        </div>
        <button
          onClick={toggleConnection}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isActive 
              ? "bg-red-50 text-red-600 hover:bg-red-100 shadow-sm" 
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
          }`}
        >
          {isActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
      
      <div className={`p-4 rounded-xl text-center flex flex-col items-center justify-center transition-colors ${
        isActive ? "bg-blue-50 border border-blue-100" : "bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
      }`}>
        {isActive ? (
          <>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${isSpeaking ? "bg-blue-200 animate-pulse" : "bg-blue-100"}`}>
              <Volume2 className={`w-8 h-8 ${isSpeaking ? "text-blue-600" : "text-blue-400"}`} />
            </div>
            <p className="text-xs font-bold text-blue-800">
              {isSpeaking ? "AI is speaking..." : "Listening..."}
            </p>
          </>
        ) : (
          <p className="text-xs text-slate-500 font-medium">Click the microphone to start</p>
        )}
      </div>
    </div>
  );
}
