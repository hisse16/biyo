import React, { useState, useEffect } from 'react';
import { SimulationParams } from '../types';
import { Sun, Droplet, Wind, Zap, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';
import { SoundControl } from './SoundControl';

interface Props {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

export const MainChloroplastSimulation: React.FC<Props> = ({ params, setParams }) => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [pulseTick, setPulseTick] = useState<number>(0);

  // Animation ticker based on speed
  useEffect(() => {
    if (!isRunning) return;
    const speedMs = params.speed === 'slow' ? 1200 : params.speed === 'fast' ? 400 : 750;
    const interval = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, speedMs);
    return () => clearInterval(interval);
  }, [isRunning, params.speed]);

  // Compute limiting factor & photosynthesis rate qualitatively
  const lightScore = params.light;
  const waterScore = params.water;
  const co2Score = params.co2;

  // The lowest factor dictates the rate
  const minScore = Math.min(lightScore, waterScore, co2Score);

  // Synchronized biological sound events driven by pulseTick
  useEffect(() => {
    if (!isRunning) return;
    const phase = pulseTick % 8;

    switch (phase) {
      case 0:
        // 1. Işık / Foton klorofile ulaşır
        if (params.light > 15) {
          soundEngine.play('photon');
        }
        break;
      case 1:
        // 2. Elektron uyarılması
        if (params.light > 20) {
          soundEngine.play('electron_excited');
        }
        break;
      case 2:
        // 3. Suyun fotolizi & O2 kabarcığı
        if (params.water > 15) {
          soundEngine.play('photolysis');
          setTimeout(() => soundEngine.play('oxygen_bubble'), 140);
        }
        break;
      case 3:
        // 4. Elektronlar ETS boyunca ilerler & Proton gradyanı
        if (params.light > 20 && params.water > 15) {
          soundEngine.play('ets_pulse');
          if (params.showProtons) {
            setTimeout(() => soundEngine.play('proton_flow'), 150);
          }
        }
        break;
      case 4:
        // 5. ATP Sentaz çalışır & ATP sentezlenir
        if (minScore > 20) {
          soundEngine.play('atp_synthase');
          setTimeout(() => soundEngine.play('atp_synthesized'), 180);
        }
        break;
      case 5:
        // 6. PSI ve NADPH oluşumu
        if (minScore > 25) {
          soundEngine.play('nadph_formed');
        }
        break;
      case 6:
        // 7. CO2 Calvin döngüsüne girer
        if (params.co2 > 15) {
          soundEngine.play('calvin_entry');
        }
        break;
      case 7:
        // 8. Organik besin (Glikoz) sentezlenir
        if (minScore > 25) {
          soundEngine.play('glucose_formed');
        }
        break;
    }
  }, [pulseTick, isRunning, params.light, params.water, params.co2, params.showProtons, minScore]);

  let rateLabel = 'Orta Hız';
  let rateColor = 'text-amber-400 bg-amber-950/80 border-amber-600/50';
  let ratePercent = 55;

  if (minScore < 35) {
    rateLabel = 'Düşük Hız';
    rateColor = 'text-rose-400 bg-rose-950/80 border-rose-600/50';
    ratePercent = 25;
  } else if (minScore >= 70) {
    rateLabel = 'Yüksek Hız';
    rateColor = 'text-emerald-400 bg-emerald-950/80 border-emerald-600/50';
    ratePercent = 90;
  }

  // Identify limiting factor for explanation
  let limitingFactorName = 'Koşullar Dengeli';
  if (minScore < 70) {
    if (minScore === lightScore) limitingFactorName = 'Işık Şiddeti';
    else if (minScore === waterScore) limitingFactorName = 'Su Miktarı';
    else limitingFactorName = 'CO₂ Miktarı';
  }

  // Animation intensities derived from params
  const photonBeamOpacity = Math.max(0.1, params.light / 100);
  const electronSpeedStyle = params.light > 30 && params.water > 20 ? 'animate-pulse' : 'opacity-30';
  const protonCount = Math.round((params.water / 100) * 8);

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto px-2 sm:px-6 py-2 select-none">
      {/* 1. TOP STATUS & RATE DISPLAY */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-white block">
              CANLI KLOROPLAST SİMÜLASYONU
            </span>
            <span className="text-[11px] text-slate-400">
              Tilakoit Zarı (Işıklı Evre) & Stroma (Calvin Döngüsü)
            </span>
          </div>
        </div>

        {/* Photosynthesis Rate Meter (SADE VE NET) */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            FOTOSENTEZ HIZI:
          </span>
          <div className="w-28 sm:w-36 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                ratePercent > 60 ? 'bg-emerald-400' : ratePercent > 30 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${ratePercent}%` }}
            />
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${rateColor}`}>
            {rateLabel}
          </span>
        </div>
      </div>

      {/* 2. THE LARGE INTERACTIVE CHLOROPLAST CANVAS (Approx 65-70% of screen) */}
      <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-3 sm:p-5 shadow-2xl relative my-2 flex-1 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 900 480" className="w-full h-full max-h-[55vh] select-none">
          <defs>
            {/* Chloroplast background radial gradient */}
            <radialGradient id="simChloroBg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#022c22" stopOpacity="0.85" />
            </radialGradient>

            {/* Sunbeam gradient */}
            <linearGradient id="simSunBeam" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#fde047" stopOpacity={photonBeamOpacity} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>

            {/* Thylakoid membrane gradient */}
            <linearGradient id="simMembrane" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#065f46" />
              <stop offset="50%" stopColor="#022c22" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
          </defs>

          {/* Chloroplast Big Outer Envelope */}
          <ellipse
            cx="450"
            cy="240"
            rx="435"
            ry="225"
            fill="url(#simChloroBg)"
            stroke="#10b981"
            strokeWidth="3.5"
          />

          {/* ═══════════════════════════════════════════ */}
          {/* SECTION A: TİLAKOİT ZARI & LÜMEN (LEFT 60%) */}
          {/* ═══════════════════════════════════════════ */}
          <g>
            {/* Sunbeam falling onto PS II */}
            <polygon
              points="100,20 180,20 190,200 130,200"
              fill="url(#simSunBeam)"
            />
            {/* Sun Icon Indicator */}
            <circle cx="140" cy="40" r="18" fill="#fbbf24" opacity={Math.max(0.3, params.light / 100)} />
            <text x="140" y="44" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">
              IŞIK
            </text>

            {/* Thylakoid Membrane Strip (Y: 200 to 280) */}
            <rect x="60" y="200" width="460" height="80" rx="12" fill="url(#simMembrane)" stroke="#059669" strokeWidth="2" />
            <text x="75" y="245" fill="#6ee7b7" fontSize="11" fontWeight="bold">
              TİLAKOİT ZARI
            </text>

            {/* Thylakoid Lumen (Bottom area inside membrane) */}
            <rect x="70" y="310" width="440" height="80" rx="16" fill="#0f172a" opacity="0.65" stroke="#1e293b" strokeWidth="1" />
            <text x="85" y="355" fill="#a7f3d0" fontSize="12" fontWeight="bold">
              TİLAKOİT LÜMEN (İç Boşluk)
            </text>

            {/* 1. PHOTOSYSTEM II (FS II) */}
            <g>
              <rect x="135" y="170" width="65" height="120" rx="14" fill="#047857" stroke="#34d399" strokeWidth="2" />
              <text x="167" y="225" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                FS II
              </text>
              <text x="167" y="240" fill="#a7f3d0" fontSize="8" textAnchor="middle">
                (Klorofil)
              </text>
            </g>

            {/* 2. SUYUN FOTOLİZİ (Under FS II in Lumen) */}
            <g>
              <ellipse cx="167" cy="335" rx="36" ry="18" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="167" y="339" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                H₂O Fotolizi
              </text>

              {/* Water entering, O2 released */}
              {params.water > 10 && (
                <g>
                  <text x="105" y="340" fill="#38bdf8" fontSize="11" fontWeight="bold">H₂O</text>
                  <path d="M 125,335 L 135,335" stroke="#38bdf8" strokeWidth="2" />
                  <text x="167" y="375" fill="#f87171" fontSize="11" fontWeight="bold" textAnchor="middle">
                    → O₂ (Çıkar)
                  </text>
                  <path d="M 167,355 L 167,363" stroke="#f87171" strokeWidth="2" strokeDasharray="2 2" />
                </g>
              )}
            </g>

            {/* 3. ETS CARRIERS & PROTON PUMP */}
            <g>
              <rect x="235" y="185" width="70" height="95" rx="12" fill="#7f1d1d" stroke="#f87171" strokeWidth="2" />
              <text x="270" y="228" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                ETS
              </text>
              <text x="270" y="242" fill="#fecaca" fontSize="8" textAnchor="middle">
                (H⁺ Pompalar)
              </text>
            </g>

            {/* 4. PHOTOSYSTEM I (FS I) */}
            <g>
              <rect x="335" y="170" width="65" height="120" rx="14" fill="#047857" stroke="#34d399" strokeWidth="2" />
              <text x="367" y="225" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                FS I
              </text>
              <text x="367" y="240" fill="#a7f3d0" fontSize="8" textAnchor="middle">
                (2. Işık)
              </text>
            </g>

            {/* 5. NADPH FORMATION (Stroma side of FS I) */}
            <g>
              <rect x="335" y="105" width="75" height="38" rx="8" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="372" y="128" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                NADPH
              </text>
              {/* Animated NADPH migrating to Calvin Cycle */}
              {minScore > 20 && (
                <circle
                  cx={420 + ((pulseTick % 10) / 10) * 150}
                  cy={125 + Math.sin(pulseTick) * 10}
                  r="6"
                  fill="#38bdf8"
                  className="animate-ping"
                />
              )}
            </g>

            {/* 6. ATP SYNTHASE ROTOR & MOTOR */}
            <g>
              <rect x="445" y="200" width="45" height="80" rx="6" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
              <circle
                cx="467"
                cy="155"
                r="28"
                fill="#d97706"
                stroke="#fbbf24"
                strokeWidth="2.5"
                className={params.speed === 'slow' ? 'animate-spin-slow' : 'animate-spin'}
              />
              <text x="467" y="158" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                ATP
              </text>
              <text x="467" y="169" fill="#fef3c7" fontSize="7" textAnchor="middle">
                Sentaz
              </text>

              {/* H+ flow through ATP synthase */}
              <path d="M 467,310 L 467,190" stroke="#fb7185" strokeWidth="3" strokeDasharray="3 2" />
              <polygon points="467,185 462,195 472,195" fill="#fb7185" />

              {/* ATP Produced migrating to Stroma */}
              <text x="495" y="145" fill="#fbbf24" fontSize="11" fontWeight="bold">
                → ATP
              </text>
              {minScore > 20 && (
                <circle
                  cx={495 + ((pulseTick % 10) / 10) * 120}
                  cy={155 + Math.cos(pulseTick) * 10}
                  r="7"
                  fill="#fbbf24"
                  className="animate-ping"
                />
              )}
            </g>

            {/* 7. VISIBLE ELECTRONS MOVING (IF TOGGLED ON) */}
            {params.showElectrons && (
              <g className={electronSpeedStyle}>
                <circle cx={210} cy={225} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <circle cx={315} cy={225} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                <text x="210" y="215" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">e⁻</text>
              </g>
            )}

            {/* 8. VISIBLE PROTONS IN LUMEN (IF TOGGLED ON) */}
            {params.showProtons && (
              <g>
                {Array.from({ length: protonCount }).map((_, i) => (
                  <circle
                    key={i}
                    cx={220 + (i % 4) * 50}
                    cy={330 + Math.floor(i / 4) * 25}
                    r="8"
                    fill="#be123c"
                    stroke="#fda4af"
                    strokeWidth="1.5"
                    className="animate-pulse"
                  />
                ))}
              </g>
            )}
          </g>

          {/* ═══════════════════════════════════════════ */}
          {/* SECTION B: STROMA & CALVIN DÖNGÜSÜ (RIGHT) */}
          {/* ═══════════════════════════════════════════ */}
          <g>
            {/* Stroma Title */}
            <text x="680" y="70" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">
              STROMA SIVISI
            </text>
            <text x="680" y="90" fill="#94a3b8" fontSize="10" textAnchor="middle">
              (Calvin Döngüsü · Şeker Sentezi)
            </text>

            {/* CO2 Entering Stroma from top */}
            <g>
              <text x="680" y="130" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                CO₂ Girdisi
              </text>
              <path d="M 680,138 L 680,165" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 2" />
              <polygon points="680,170 675,160 685,160" fill="#38bdf8" />
            </g>

            {/* Calvin Cycle Animated Rotating Wheel */}
            <circle
              cx="680"
              cy="255"
              r="75"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
            />
            <circle
              cx="680"
              cy="255"
              r="75"
              fill="none"
              stroke="#0284c7"
              strokeWidth="5"
              strokeDasharray="16 10"
              className={params.speed === 'slow' ? 'animate-spin-slow' : 'animate-spin'}
            />

            <text x="680" y="250" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
              CALVİN
            </text>
            <text x="680" y="266" fill="#7dd3fc" fontSize="10" textAnchor="middle">
              DÖNGÜSÜ
            </text>

            {/* Output: Glucose (Besin) */}
            <g>
              <path d="M 680,335 L 680,375" stroke="#10b981" strokeWidth="3" />
              <polygon points="680,380 675,370 685,370" fill="#10b981" />
              <rect x="600" y="385" width="160" height="36" rx="10" fill="#065f46" stroke="#34d399" strokeWidth="2" />
              <text x="680" y="408" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                🌱 GLİKOZ (BESİN)
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* 3. BOTTOM CONTROL PANEL (Sliders + Scenarios + Buttons with >= 50px touch targets) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-xl">
        {/* Quick Classroom Preset Scenarios */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
          <span className="text-xs font-mono font-bold text-slate-400">
            HIZLI DENEY SENARYOLARI:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setParams((p) => ({ ...p, light: 15, water: 85, co2: 85 }))}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-amber-300 border border-amber-900/60 text-xs font-bold cursor-pointer transition-all active:scale-95"
            >
              🌑 Az Işık
            </button>
            <button
              onClick={() => setParams((p) => ({ ...p, light: 85, water: 15, co2: 85 }))}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-sky-300 border border-sky-900/60 text-xs font-bold cursor-pointer transition-all active:scale-95"
            >
              💧 Kuraklık (Az Su)
            </button>
            <button
              onClick={() => setParams((p) => ({ ...p, light: 85, water: 85, co2: 15 }))}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-cyan-300 border border-cyan-900/60 text-xs font-bold cursor-pointer transition-all active:scale-95"
            >
              🍃 Az CO₂
            </button>
            <button
              onClick={() => setParams((p) => ({ ...p, light: 80, water: 80, co2: 80 }))}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-850 text-emerald-300 border border-emerald-800/60 text-xs font-bold cursor-pointer transition-all active:scale-95"
            >
              ⭐ Dengeli (Optimum)
            </button>
          </div>
        </div>

        {/* The 3 Main Environmental Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Slider 1: Işık */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sun className="w-5 h-5 text-amber-400" />
                <span>Işık Şiddeti</span>
              </span>
              <span className="font-mono text-amber-400 font-bold">%{params.light}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.light}
              onChange={(e) => setParams((prev) => ({ ...prev, light: Number(e.target.value) }))}
              className="w-full h-4 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Karanlık</span>
              <span>Orta</span>
              <span>Kuvvetli</span>
            </div>
          </div>

          {/* Slider 2: Su */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-sky-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-sky-300 flex items-center gap-1.5">
                <Droplet className="w-5 h-5 text-sky-400" />
                <span>Su (H₂O)</span>
              </span>
              <span className="font-mono text-sky-400 font-bold">%{params.water}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.water}
              onChange={(e) => setParams((prev) => ({ ...prev, water: Number(e.target.value) }))}
              className="w-full h-4 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Kurak</span>
              <span>Yeterli</span>
              <span>Bol</span>
            </div>
          </div>

          {/* Slider 3: CO2 */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-900/40 space-y-2">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                <Wind className="w-5 h-5 text-cyan-400" />
                <span>Karbondioksit (CO₂)</span>
              </span>
              <span className="font-mono text-cyan-400 font-bold">%{params.co2}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.co2}
              onChange={(e) => setParams((prev) => ({ ...prev, co2: Number(e.target.value) }))}
              className="w-full h-4 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Az CO₂</span>
              <span>Normal</span>
              <span>Yüksek</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Layer Toggles (Touch Friendly Buttons >= 50px) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Play / Pause & Speed */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="h-12 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Durdur' : 'Başlat'}</span>
            </button>

            <button
              onClick={() => {
                setParams((prev) => ({
                  ...prev,
                  speed: prev.speed === 'slow' ? 'normal' : prev.speed === 'normal' ? 'fast' : 'slow'
                }));
              }}
              className="h-12 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Hız: {params.speed === 'slow' ? '🐢 Yavaş' : params.speed === 'normal' ? '▶ Normal' : '⚡ Hızlı'}
            </button>
          </div>

          {/* Interactive Layer Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setParams((prev) => ({ ...prev, showElectrons: !prev.showElectrons }))}
              className={`h-12 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                params.showElectrons
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Elektronları {params.showElectrons ? 'Gizle' : 'Göster'}</span>
            </button>

            <button
              onClick={() => setParams((prev) => ({ ...prev, showProtons: !prev.showProtons }))}
              className={`h-12 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                params.showProtons
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Droplet className="w-4 h-4" />
              <span>H⁺ İyonlarını {params.showProtons ? 'Gizle' : 'Göster'}</span>
            </button>
          </div>

          {/* Sound Control for Smartboard */}
          <SoundControl variant="simulation" />

          {/* Sınırlayıcı Faktör İpucu */}
          <div className="text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-500">Sınırlayıcı Faktör: </span>
            <strong className="text-amber-300 font-semibold">{limitingFactorName}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
