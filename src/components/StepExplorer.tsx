import React, { useState, useEffect } from 'react';
import { PROCESS_STEPS_DATA } from '../data/questionsData';
import { ProcessStep } from '../types';
import { speechService } from '../utils/speechService';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, MapPin, Sparkles, Volume2, VolumeX } from 'lucide-react';

export const StepExplorer: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isVoiceReading, setIsVoiceReading] = useState<boolean>(false);

  const step: ProcessStep = PROCESS_STEPS_DATA[currentStepIndex];
  const total = PROCESS_STEPS_DATA.length;

  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsVoiceReading(speaking);
    });
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  // Auto advance and narration if playing
  useEffect(() => {
    if (!isAutoPlaying) return;

    let timer: NodeJS.Timeout;
    let hasAdvanced = false;

    const advance = () => {
      if (hasAdvanced) return;
      hasAdvanced = true;
      setCurrentStepIndex((prev) => {
        if (prev >= total - 1) {
          setIsAutoPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    };

    // Sadece beyaz açıklama metnini doğal tonda seslendir
    speechService.speak(step.description, () => {
      timer = setTimeout(advance, 1400);
    });

    return () => {
      clearTimeout(timer);
    };
  }, [isAutoPlaying, currentStepIndex, total, step.description]);

  const nextStep = () => {
    setIsAutoPlaying(false);
    speechService.stop();
    setCurrentStepIndex((prev) => Math.min(total - 1, prev + 1));
  };

  const prevStep = () => {
    setIsAutoPlaying(false);
    speechService.stop();
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  };

  const handleToggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
      speechService.stop();
    } else {
      setIsAutoPlaying(true);
    }
  };

  const handleToggleVoiceRead = () => {
    if (isVoiceReading) {
      speechService.stop();
    } else {
      speechService.speak(step.description);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-5xl mx-auto px-2 sm:px-6 py-3 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            SÜRECİ KEŞFET (Adım Adım Mekanizma)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Işığın pigmente çarpmasından şekerin oluşmasına kadar 11 kilit basamağı sırayla inceleyin.
          </p>
        </div>

        {/* Play/Pause & Step Count */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isAutoPlaying ? 'Durdur' : 'Otomatik Oynat'}</span>
          </button>

          <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800">
            Adım {currentStepIndex + 1} / {total}
          </span>
        </div>
      </div>

      {/* Main Visual Stage with Interactive Focal Highlights */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl relative my-2 flex-1 flex flex-col justify-between">
        {/* SVG Mechanism Diagram with Dynamic Focal Highlighting */}
        <div className="aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800/80 p-3 sm:p-4 relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 850 380" className="w-full h-full select-none">
            {/* Background compartments */}
            <rect x="50" y="50" width="450" height="280" rx="16" fill="#064e3b" opacity="0.3" stroke="#059669" strokeWidth="1.5" />
            <text x="65" y="75" fill="#6ee7b7" fontSize="12" fontWeight="bold">TİLAKOİT ZARI & LÜMEN</text>

            <rect x="520" y="50" width="280" height="280" rx="16" fill="#0369a1" opacity="0.2" stroke="#0284c7" strokeWidth="1.5" />
            <text x="535" y="75" fill="#38bdf8" fontSize="12" fontWeight="bold">STROMA SIVISI</text>

            {/* Step 1: Sun / Light */}
            <g opacity={step.focusArea === 'light_source' ? 1 : 0.45}>
              <circle cx="110" cy="110" r="22" fill="#fbbf24" className={step.focusArea === 'light_source' ? 'animate-pulse' : ''} />
              <text x="110" y="114" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">IŞIK</text>
              <line x1="130" y1="125" x2="160" y2="155" stroke="#fde047" strokeWidth="3" strokeDasharray="3 2" />
            </g>

            {/* Step 2: FS II */}
            <g opacity={step.focusArea === 'ps2' ? 1 : 0.45}>
              <rect x="150" y="145" width="60" height="100" rx="10" fill="#047857" stroke={step.focusArea === 'ps2' ? '#34d399' : '#10b981'} strokeWidth={step.focusArea === 'ps2' ? 3.5 : 1.5} />
              <text x="180" y="195" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">FS II</text>
            </g>

            {/* Step 3: Photolysis */}
            <g opacity={step.focusArea === 'photolysis' ? 1 : 0.45}>
              <ellipse cx="180" cy="275" rx="30" ry="16" fill="#0369a1" stroke={step.focusArea === 'photolysis' ? '#38bdf8' : '#0284c7'} strokeWidth={step.focusArea === 'photolysis' ? 3 : 1.5} />
              <text x="180" y="278" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">H₂O → O₂</text>
            </g>

            {/* Step 4 & 5: ETS & Protons */}
            <g opacity={step.focusArea === 'ets' ? 1 : 0.45}>
              <rect x="235" y="160" width="65" height="75" rx="8" fill="#7f1d1d" stroke={step.focusArea === 'ets' ? '#f87171' : '#b91c1c'} strokeWidth={step.focusArea === 'ets' ? 3 : 1.5} />
              <text x="267" y="200" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">ETS</text>
              <circle cx="267" cy="275" r="9" fill="#be123c" stroke="#fda4af" strokeWidth="1.5" />
              <text x="267" y="279" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">H⁺</text>
            </g>

            {/* Step 6: ATP Synthase */}
            <g opacity={step.focusArea === 'atp_synthase' ? 1 : 0.45}>
              <circle cx="430" cy="140" r="24" fill="#d97706" stroke={step.focusArea === 'atp_synthase' ? '#fbbf24' : '#b45309'} strokeWidth={step.focusArea === 'atp_synthase' ? 3 : 1.5} />
              <text x="430" y="143" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">ATP</text>
              <text x="430" y="153" fill="#fef3c7" fontSize="7" textAnchor="middle">Sentaz</text>
            </g>

            {/* Step 7: FS I */}
            <g opacity={step.focusArea === 'ps1' ? 1 : 0.45}>
              <rect x="325" y="145" width="60" height="100" rx="10" fill="#047857" stroke={step.focusArea === 'ps1' ? '#34d399' : '#10b981'} strokeWidth={step.focusArea === 'ps1' ? 3.5 : 1.5} />
              <text x="355" y="195" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">FS I</text>
            </g>

            {/* Step 8: NADPH */}
            <g opacity={step.focusArea === 'nadph' ? 1 : 0.45}>
              <rect x="330" y="95" width="60" height="30" rx="6" fill="#0284c7" stroke={step.focusArea === 'nadph' ? '#38bdf8' : '#0369a1'} strokeWidth={step.focusArea === 'nadph' ? 3 : 1.5} />
              <text x="360" y="114" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">NADPH</text>
            </g>

            {/* Step 9 & 10: Calvin Cycle & CO2 */}
            <g opacity={step.focusArea === 'calvin' ? 1 : 0.45}>
              <circle cx="660" cy="180" r="60" fill="none" stroke={step.focusArea === 'calvin' ? '#38bdf8' : '#1e293b'} strokeWidth="6" />
              <text x="660" y="178" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">CALVİN</text>
              <text x="660" y="194" fill="#7dd3fc" fontSize="10" textAnchor="middle">DÖNGÜSÜ</text>
              {/* CO2 entering */}
              <text x="660" y="95" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">CO₂</text>
              <line x1="660" y1="102" x2="660" y2="120" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
            </g>

            {/* Step 11: Glucose Output */}
            <g opacity={step.focusArea === 'glucose' ? 1 : 0.45}>
              <rect x="590" y="275" width="140" height="32" rx="8" fill="#065f46" stroke={step.focusArea === 'glucose' ? '#34d399' : '#059669'} strokeWidth={step.focusArea === 'glucose' ? 3 : 1.5} />
              <text x="660" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">🌱 GLİKOZ</text>
            </g>
          </svg>
        </div>

        {/* Step Narrative Card (Brief, crisp, 10th-grade appropriate) */}
        <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 font-mono block">
                {step.title}
              </span>
              {isVoiceReading && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] text-emerald-300 font-semibold animate-pulse">
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>Seslendiriliyor (tr-TR)</span>
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {step.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sesli Oku Butonu (Web Speech API) */}
            <button
              onClick={handleToggleVoiceRead}
              className={`h-11 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                isVoiceReading
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-800'
              }`}
              title={isVoiceReading ? 'Sesli Okumayı Durdur' : 'Bu adımı Türkçe sesli oku (Web Speech API)'}
            >
              {isVoiceReading ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-400" />
                  <span>Durdur</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>Sesli Oku</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls (Large 55px touch buttons for Smartboard) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          disabled={currentStepIndex === 0}
          onClick={prevStep}
          className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2 font-bold text-xs sm:text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Önceki Adım</span>
        </button>

        {/* Step indicator pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-sm sm:max-w-none">
          {PROCESS_STEPS_DATA.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentStepIndex(idx);
              }}
              className={`w-7 h-9 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                idx === currentStepIndex
                  ? 'bg-emerald-400 text-slate-950 scale-110 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {s.id}
            </button>
          ))}
        </div>

        <button
          disabled={currentStepIndex === total - 1}
          onClick={nextStep}
          className="h-14 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Sonraki Adım</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
