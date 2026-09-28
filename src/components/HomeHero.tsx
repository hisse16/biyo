import React from 'react';
import { AppTab } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { ArrowRight, Compass, Sun, Droplet, Wind, Zap, Play, Sparkles, Layers } from 'lucide-react';

interface Props {
  onStartExplore: () => void;
  onNavigateTab: (tab: AppTab) => void;
}

export const HomeHero: React.FC<Props> = ({ onStartExplore, onNavigateTab }) => {
  const handleStart = () => {
    soundEngine.play('photon');
    onStartExplore();
  };
  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6 py-4 select-none">
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-2 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>10. Sınıf Biyoloji Dersi Akıllı Tahta Modeli</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          FOTOSENTEZ
        </h1>
        <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200 bg-clip-text text-transparent">
          Bitkinin ışığı besine dönüştürme yolculuğu
        </p>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-1">
          Fotosentezin nerede ve nasıl gerçekleştiğini hücreden başlayarak keşfet.
        </p>
      </div>

      {/* 2. LARGE INTERACTIVE PLANT CELL ILLUSTRATION */}
      <div className="my-4 relative bg-slate-900/80 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
        {/* SVG Plant Cell Model */}
        <div className="w-full max-w-2xl aspect-[16/9] relative flex items-center justify-center">
          <svg viewBox="0 0 700 400" className="w-full h-full select-none">
            <defs>
              {/* Plant cell wall & cytoplasm gradient */}
              <radialGradient id="cellBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#064e3b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#022c22" stopOpacity="0.8" />
              </radialGradient>

              {/* Vacuole gradient */}
              <radialGradient id="vacuoleBg" cx="40%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
              </radialGradient>

              {/* Chloroplast glow */}
              <filter id="chloroplastGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Plant Cell Wall (Rigid Polygon) */}
            <polygon
              points="100,50 600,50 660,200 600,350 100,350 40,200"
              fill="none"
              stroke="#047857"
              strokeWidth="12"
              strokeLinejoin="round"
            />
            {/* Plasma Membrane */}
            <polygon
              points="104,58 596,58 652,200 596,342 104,342 48,200"
              fill="url(#cellBg)"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Label: Hücre Çeperi */}
            <text x="60" y="85" fill="#6ee7b7" fontSize="10" fontWeight="bold">
              Hücre Çeperi & Zarı
            </text>

            {/* Large Central Vacuole (Merkezi Koful) */}
            <path
              d="M 260,110 Q 380,100 440,160 Q 480,240 380,280 Q 250,300 240,220 Z"
              fill="url(#vacuoleBg)"
              stroke="#38bdf8"
              strokeWidth="2"
              opacity="0.85"
            />
            <text x="340" y="200" fill="#bae6fd" fontSize="12" fontWeight="bold" textAnchor="middle">
              Merkezi Koful
            </text>

            {/* Nucleus (Çekirdek) */}
            <circle cx="520" cy="150" r="42" fill="#3b0764" stroke="#c084fc" strokeWidth="2.5" />
            <circle cx="520" cy="150" r="14" fill="#a855f7" />
            <text x="520" y="210" fill="#e9d5ff" fontSize="11" fontWeight="bold" textAnchor="middle">
              Çekirdek
            </text>

            {/* Mitochondria */}
            <ellipse cx="480" cy="270" rx="35" ry="18" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" transform="rotate(-15 480 270)" />
            <text x="480" y="274" fill="#fecaca" fontSize="9" fontWeight="bold" textAnchor="middle">
              Mitokondri
            </text>

            {/* 3 Prominent Chloroplasts (Clickable with glowing animation) */}
            {/* Chloroplast 1 (Main interactive highlight) */}
            <g
              onClick={onStartExplore}
              className="cursor-pointer group hover:scale-105 transition-transform"
              filter="url(#chloroplastGlow)"
            >
              <ellipse
                cx="170"
                cy="140"
                rx="60"
                ry="36"
                fill="#047857"
                stroke="#34d399"
                strokeWidth="3"
                transform="rotate(10 170 140)"
              />
              {/* Internal Thylakoids preview */}
              <ellipse cx="155" cy="135" rx="14" ry="5" fill="#10b981" />
              <ellipse cx="155" cy="142" rx="14" ry="5" fill="#10b981" />
              <ellipse cx="185" cy="138" rx="14" ry="5" fill="#10b981" />
              <ellipse cx="185" cy="145" rx="14" ry="5" fill="#10b981" />

              <text x="170" y="166" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                KLOROPLAST
              </text>
              <text x="170" y="120" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                (Fotosentez Yeri)
              </text>

              {/* Pulse ripple */}
              <circle cx="170" cy="140" r="45" fill="none" stroke="#34d399" strokeWidth="1.5" className="animate-ping" opacity="0.4" />
            </g>

            {/* Chloroplast 2 */}
            <g
              onClick={onStartExplore}
              className="cursor-pointer group hover:scale-105 transition-transform"
            >
              <ellipse
                cx="180"
                cy="260"
                rx="50"
                ry="30"
                fill="#047857"
                stroke="#10b981"
                strokeWidth="2"
                transform="rotate(-15 180 260)"
              />
              <text x="180" y="264" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                Kloroplast
              </text>
            </g>

            {/* Chloroplast 3 */}
            <g
              onClick={onStartExplore}
              className="cursor-pointer group hover:scale-105 transition-transform"
            >
              <ellipse
                cx="340"
                cy="90"
                rx="45"
                ry="26"
                fill="#047857"
                stroke="#10b981"
                strokeWidth="2"
              />
              <text x="340" y="94" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                Kloroplast
              </text>
            </g>

            {/* Sun rays pointing towards the cell */}
            <g opacity="0.6">
              <circle cx="40" cy="40" r="14" fill="#fbbf24" />
              <line x1="60" y1="55" x2="120" y2="105" stroke="#fde047" strokeWidth="2.5" strokeDasharray="3 3" />
              <text x="40" y="20" fill="#fde047" fontSize="10" fontWeight="bold">Güneş Işığı</text>
            </g>
          </svg>
        </div>

        {/* Interactive hint tag */}
        <div className="mt-2 text-center">
          <span className="text-xs text-emerald-400 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-800 font-semibold inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Yeşil kloroplastlara dokunarak hücrenin içine yolculuğa başlayın
          </span>
        </div>
      </div>

      {/* 3. MAIN ACTION CALLOUT (Prominent "KEŞFETMEYE BAŞLA" Button) */}
      <div className="flex flex-col items-center justify-center space-y-3 pb-2">
        <button
          onClick={handleStart}
          className="h-16 px-10 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 active:scale-95 text-slate-950 font-black text-lg sm:text-xl shadow-2xl shadow-emerald-500/30 transition-all cursor-pointer flex items-center gap-3"
        >
          <span>KEŞFETMEYE BAŞLA</span>
          <ArrowRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Small subtitle sequence */}
        <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
          Bitki hücresi → Kloroplast → Fotosentez → Simülasyon
        </p>

        {/* Quick-jump navigation pills for classroom presentation */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onNavigateTab('explore')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            1. Keşfet
          </button>
          <button
            onClick={() => onNavigateTab('photosynthesis')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            2. Fotosentez Evreleri
          </button>
          <button
            onClick={() => onNavigateTab('simulation')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            3. Canlı Simülasyon
          </button>
          <button
            onClick={() => onNavigateTab('questions')}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold cursor-pointer transition-colors"
          >
            4. Sınıf Soruları
          </button>
        </div>
      </div>
    </div>
  );
};
