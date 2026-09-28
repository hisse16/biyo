import React, { useState, useEffect } from 'react';
import { PhotosynthesisView } from '../types';
import { PROCESS_STEPS_DATA } from '../data/questionsData';
import { soundEngine } from '../utils/soundEngine';
import { speechService } from '../utils/speechService';
import { Sun, Droplet, Wind, Zap, ArrowRight, Play, Pause, ChevronLeft, ChevronRight, CheckCircle2, RotateCcw, Layers, Sparkles, Volume2, VolumeX } from 'lucide-react';

interface Props {
  onGoToSimulation: () => void;
}

export const PhotosynthesisSection: React.FC<Props> = ({ onGoToSimulation }) => {
  const [subView, setSubView] = useState<PhotosynthesisView>('big_picture');
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isVoiceReading, setIsVoiceReading] = useState<boolean>(false);

  const step = PROCESS_STEPS_DATA[activeStepIdx];
  const totalSteps = PROCESS_STEPS_DATA.length;

  // Subscribe to speech service state changes
  useEffect(() => {
    const unsubscribe = speechService.subscribe((speaking) => {
      setIsVoiceReading(speaking);
    });
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  // Stop speech when switching sub-views
  useEffect(() => {
    if (subView !== 'steps') {
      speechService.stop();
      setIsAutoPlaying(false);
    }
  }, [subView]);

  // Play corresponding sound on step change
  useEffect(() => {
    if (subView !== 'steps') return;

    switch (activeStepIdx) {
      case 0:
        soundEngine.play('photon');
        break;
      case 1:
        soundEngine.play('electron_excited');
        break;
      case 2:
        soundEngine.play('photolysis');
        setTimeout(() => soundEngine.play('oxygen_bubble'), 140);
        break;
      case 3:
        soundEngine.play('ets_pulse');
        break;
      case 4:
        soundEngine.play('proton_flow');
        break;
      case 5:
        soundEngine.play('atp_synthase');
        setTimeout(() => soundEngine.play('atp_synthesized'), 160);
        break;
      case 6:
        soundEngine.play('photon');
        break;
      case 7:
        soundEngine.play('nadph_formed');
        break;
      case 8:
        soundEngine.play('calvin_entry');
        break;
      case 9:
        soundEngine.play('calvin_entry');
        break;
      case 10:
        soundEngine.play('glucose_formed');
        break;
    }
  }, [activeStepIdx, subView]);

  // Auto advance & Turkish narration for step by step mode
  useEffect(() => {
    if (!isAutoPlaying || subView !== 'steps') return;

    let advanceTimer: NodeJS.Timeout;
    let hasAdvanced = false;

    const advance = () => {
      if (hasAdvanced) return;
      hasAdvanced = true;
      setActiveStepIdx((prev) => {
        if (prev >= totalSteps - 1) {
          setIsAutoPlaying(false);
          return 0;
        }
        return prev + 1;
      });
    };

    // Yalnızca beyaz açıklama metnini doğal tonda seslendir
    speechService.speak(step.description, () => {
      // Cümle tamamen bittikten sonra sınıfta dinleme payı bırak (1.4 sn) ve sonraki adıma geç
      advanceTimer = setTimeout(advance, 1400);
    });

    return () => {
      clearTimeout(advanceTimer);
    };
  }, [isAutoPlaying, activeStepIdx, subView, totalSteps, step.description]);

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
      // Yalnızca beyaz açıklama metnini seslendir
      speechService.speak(step.description);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-6xl mx-auto px-2 sm:px-6 py-3 select-none">
      {/* 1. TOP SUB-NAVIGATION TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>FOTOSENTEZ:</span>
            <span className="text-emerald-400">
              {subView === 'big_picture' && 'Büyük Resim (İki Evrenin Bağlantısı)'}
              {subView === 'light_reactions' && '1. Işığa Bağımlı Reaksiyonlar (Tilakoit)'}
              {subView === 'calvin_cycle' && '2. Calvin Döngüsü (Stroma)'}
              {subView === 'steps' && `Adım Adım Mekanizma (${activeStepIdx + 1}/${totalSteps})`}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {subView === 'big_picture' && 'Işıklı evre ile Calvin döngüsünün birbirine nasıl bağlandığını görün.'}
            {subView === 'light_reactions' && 'Güneş fotonlarının yakalanması, suyun parçalanması ve ATP-NADPH sentezi.'}
            {subView === 'calvin_cycle' && 'Karbondioksitin yakalanıp ATP enerjisiyle glikoza dönüştürülmesi.'}
            {subView === 'steps' && 'Fotosentezin 11 kilit basamağını sırayla inceleyin.'}
          </p>
        </div>

        {/* 4 Clean Sub-view Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setSubView('big_picture');
              soundEngine.play('ets_pulse');
            }}
            className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'big_picture'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Büyük Resim
          </button>
          <button
            onClick={() => {
              setSubView('light_reactions');
              soundEngine.play('photon');
            }}
            className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'light_reactions'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Işıklı Evre
          </button>
          <button
            onClick={() => {
              setSubView('calvin_cycle');
              soundEngine.play('calvin_entry');
            }}
            className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'calvin_cycle'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Calvin Döngüsü
          </button>
          <button
            onClick={() => {
              setSubView('steps');
              soundEngine.play('electron_excited');
            }}
            className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              subView === 'steps'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Adım Adım
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT BASED ON SUB-VIEW */}
      {/* ═══════════════════════════════════════════ */}
      {/* SUB-VIEW A: BÜYÜK RESİM (İki Evrenin Bağlantısı) */}
      {/* ═══════════════════════════════════════════ */}
      {subView === 'big_picture' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between my-2">
          {/* Integrated Diagram: Tilakoit on Left, Stroma on Right, Bridge in Middle */}
          <div className="aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 850 400" className="w-full h-full select-none">
              {/* Outer Chloroplast Boundary */}
              <rect x="40" y="30" width="770" height="340" rx="24" fill="#022c22" stroke="#10b981" strokeWidth="2.5" />
              <text x="60" y="60" fill="#6ee7b7" fontSize="12" fontWeight="bold">KLOROPLAST İÇİ</text>

              {/* LEFT HALF: TİLAKOİT & IŞIKLI EVRE */}
              <rect x="60" y="80" width="330" height="270" rx="16" fill="#047857" opacity="0.4" stroke="#059669" strokeWidth="2" />
              <text x="225" y="110" fill="#a7f3d0" fontSize="14" fontWeight="black" textAnchor="middle">
                IŞIĞA BAĞIMLI EVRE (Tilakoit)
              </text>

              {/* Inputs to Left: Light & Water */}
              {/* Light */}
              <g>
                <circle cx="110" cy="30" r="16" fill="#fbbf24" />
                <path d="M 110,48 L 130,85" stroke="#fde047" strokeWidth="3" strokeDasharray="3 2" />
                <polygon points="132,90 125,80 135,80" fill="#fde047" />
                <text x="110" y="20" fill="#fde047" fontSize="11" fontWeight="bold" textAnchor="middle">IŞIK</text>
              </g>

              {/* Water */}
              <g>
                <rect x="75" y="140" width="60" height="30" rx="8" fill="#0284c7" />
                <text x="105" y="160" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">H₂O (Su)</text>
                <path d="M 135,155 L 170,155" stroke="#38bdf8" strokeWidth="3" />
                <polygon points="175,155 165,150 165,160" fill="#38bdf8" />
              </g>

              {/* Output from Left: O2 */}
              <g>
                <path d="M 170,260 L 120,310" stroke="#f87171" strokeWidth="3" strokeDasharray="3 2" />
                <polygon points="115,315 125,310 120,300" fill="#f87171" />
                <rect x="65" y="315" width="90" height="28" rx="8" fill="#7f1d1d" stroke="#f87171" strokeWidth="1.5" />
                <text x="110" y="333" fill="#fecaca" fontSize="11" fontWeight="bold" textAnchor="middle">
                  O₂ (Oksijen Çıkar)
                </text>
              </g>

              {/* Thylakoid Stacks Graphic */}
              <rect x="180" y="145" width="80" height="18" rx="8" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <rect x="180" y="170" width="80" height="18" rx="8" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <rect x="180" y="195" width="80" height="18" rx="8" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <rect x="180" y="220" width="80" height="18" rx="8" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
              <text x="220" y="182" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">Granum / Tilakoit</text>

              {/* RIGHT HALF: STROMA & CALVIN DÖNGÜSÜ */}
              <rect x="460" y="80" width="330" height="270" rx="16" fill="#0369a1" opacity="0.3" stroke="#0284c7" strokeWidth="2" />
              <text x="625" y="110" fill="#7dd3fc" fontSize="14" fontWeight="black" textAnchor="middle">
                CALVIN DÖNGÜSÜ (Stroma)
              </text>

              {/* Input to Right: CO2 */}
              <g>
                <rect x="580" y="40" width="90" height="28" rx="8" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="625" y="58" fill="#bae6fd" fontSize="11" fontWeight="bold" textAnchor="middle">CO₂ (Gazı)</text>
                <path d="M 625,68 L 625,130" stroke="#38bdf8" strokeWidth="3" strokeDasharray="3 2" />
                <polygon points="625,135 620,125 630,125" fill="#38bdf8" />
              </g>

              {/* Calvin Cycle Circle */}
              <circle cx="625" cy="200" r="55" fill="none" stroke="#0284c7" strokeWidth="5" strokeDasharray="12 6" className="animate-spin-slow" />
              <text x="625" y="198" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Karbon</text>
              <text x="625" y="214" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Fiksasyonu</text>

              {/* Output from Right: Glucose (Besin) */}
              <g>
                <path d="M 625,255 L 625,295" stroke="#10b981" strokeWidth="3" />
                <polygon points="625,300 620,290 630,290" fill="#10b981" />
                <rect x="545" y="305" width="160" height="34" rx="10" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                <text x="625" y="327" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">
                  🌱 GLİKOZ (BESİN)
                </text>
              </g>

              {/* ═══════════════════════════════════════════ */}
              {/* THE CHEMICAL BRIDGE (Between Tilakoit & Stroma) */}
              {/* ═══════════════════════════════════════════ */}
              {/* Top Arrows: ATP & NADPH Going to Stroma */}
              <g>
                <path d="M 370,145 C 410,125 430,125 470,145" fill="none" stroke="#fbbf24" strokeWidth="3.5" />
                <polygon points="475,148 465,138 468,150" fill="#fbbf24" />
                <rect x="390" y="110" width="70" height="24" rx="6" fill="#78350f" stroke="#fbbf24" strokeWidth="1" />
                <text x="425" y="126" fill="#fef3c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                  ATP + NADPH
                </text>
              </g>

              {/* Bottom Arrows: ADP & NADP+ Returning to Tilakoit */}
              <g>
                <path d="M 470,250 C 430,270 410,270 370,250" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="3 3" />
                <polygon points="365,248 375,245 372,257" fill="#94a3b8" />
                <rect x="390" y="260" width="70" height="24" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                <text x="425" y="276" fill="#cbd5e1" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ADP + NADP⁺
                </text>
              </g>
            </svg>
          </div>

          {/* Bottom Explanation Banner */}
          <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">
                Temel Mantık: İki Evre Birbirini Besler
              </span>
              <p className="text-xs sm:text-sm text-slate-200">
                Tilakoit zarda ışık ve su kullanılarak <strong>ATP (enerji)</strong> ve <strong>NADPH (elektron taşıyıcı)</strong> üretilir. Bunlar stromaya geçer ve CO₂ ile birleşerek <strong>şeker</strong> üretilir. Harcanan ADP ve NADP⁺ ise tilakoite geri dönerek yeniden şarj edilir!
              </p>
            </div>

            <button
              onClick={() => setSubView('light_reactions')}
              className="h-12 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <span>1. Işıklı Evreyi İncele</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SUB-VIEW B: IŞIĞA BAĞIMLI REAKSİYONLAR (Tilakoit Zarı) */}
      {/* ═══════════════════════════════════════════ */}
      {subView === 'light_reactions' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between my-2">
          {/* Light Reactions Detailed Diagram */}
          <div className="aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 850 380" className="w-full h-full select-none">
              {/* Stroma (Top) and Lumen (Bottom) Labels */}
              <text x="60" y="30" fill="#38bdf8" fontSize="12" fontWeight="bold">STROMA SIVISI (Dış Taraf)</text>
              <text x="60" y="355" fill="#a7f3d0" fontSize="12" fontWeight="bold">TİLAKOİT LÜMEN (İç Boşluk - H⁺ Birikim Yeri)</text>

              {/* Lipid Bilayer Membrane (Center horizontal band) */}
              <rect x="40" y="140" width="770" height="90" rx="12" fill="#047857" opacity="0.6" stroke="#059669" strokeWidth="2" />
              <text x="50" y="190" fill="#6ee7b7" fontSize="10" fontWeight="bold" transform="rotate(-90 50 190)">
                TİLAKOİT ZARI
              </text>

              {/* 1. FS II (Photosystem II) */}
              <g>
                <rect x="120" y="110" width="70" height="150" rx="14" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                <text x="155" y="170" fill="#ffffff" fontSize="12" fontWeight="black" textAnchor="middle">FS II</text>
                <text x="155" y="185" fill="#a7f3d0" fontSize="8" textAnchor="middle">P680 Klorofil</text>

                {/* Sunbeam falling */}
                <line x1="155" y1="40" x2="155" y2="105" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 2" />
                <circle cx="155" cy="40" r="14" fill="#fbbf24" />
                <text x="155" y="44" fill="#78350f" fontSize="9" fontWeight="bold" textAnchor="middle">IŞIK</text>

                {/* Photolysis underneath FS II */}
                <ellipse cx="155" cy="290" rx="40" ry="20" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="155" y="294" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">H₂O Fotolizi</text>
                <text x="155" y="325" fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle">→ O₂ Salınır</text>
              </g>

              {/* 2. ETS Carriers (Plastokinon & Sitokrom b6f) */}
              <g>
                <rect x="235" y="130" width="85" height="110" rx="12" fill="#7f1d1d" stroke="#f87171" strokeWidth="2" />
                <text x="277" y="175" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">ETS</text>
                <text x="277" y="190" fill="#fecaca" fontSize="8" textAnchor="middle">Sitokrom b6f</text>

                {/* Proton pumping into lumen */}
                <path d="M 277,90 L 277,260" stroke="#fda4af" strokeWidth="2.5" strokeDasharray="3 2" />
                <polygon points="277,265 272,255 282,255" fill="#fda4af" />
                <text x="277" y="80" fill="#fda4af" fontSize="10" fontWeight="bold" textAnchor="middle">H⁺ Pompalanır</text>
              </g>

              {/* 3. FS I (Photosystem I) */}
              <g>
                <rect x="370" y="110" width="70" height="150" rx="14" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                <text x="405" y="170" fill="#ffffff" fontSize="12" fontWeight="black" textAnchor="middle">FS I</text>
                <text x="405" y="185" fill="#a7f3d0" fontSize="8" textAnchor="middle">P700 Klorofil</text>

                {/* Second Sunbeam */}
                <line x1="405" y1="40" x2="405" y2="105" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 2" />
                <circle cx="405" cy="40" r="14" fill="#fbbf24" />
                <text x="405" y="44" fill="#78350f" fontSize="9" fontWeight="bold" textAnchor="middle">IŞIK</text>
              </g>

              {/* 4. NADP+ Reductase & NADPH */}
              <g>
                <rect x="475" y="70" width="90" height="42" rx="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                <text x="520" y="90" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">NADPH</text>
                <text x="520" y="102" fill="#bae6fd" fontSize="8" textAnchor="middle">Oluşumu</text>
                <text x="520" y="55" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">NADP⁺ + H⁺ + 2e⁻</text>
              </g>

              {/* 5. ATP Synthase Rotor (Kemiozmoz) */}
              <g>
                <rect x="630" y="130" width="55" height="110" rx="10" fill="#334155" stroke="#64748b" strokeWidth="2" />
                <circle cx="657" cy="85" r="30" fill="#d97706" stroke="#fbbf24" strokeWidth="2.5" className="animate-spin-slow" />
                <text x="657" y="85" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">ATP</text>
                <text x="657" y="97" fill="#fef3c7" fontSize="8" textAnchor="middle">Sentaz</text>

                {/* Proton flowing through rotor from lumen to stroma */}
                <path d="M 657,280 L 657,125" stroke="#fb7185" strokeWidth="3.5" strokeDasharray="3 2" />
                <polygon points="657,120 652,130 662,130" fill="#fb7185" />
                <text x="657" y="300" fill="#fb7185" fontSize="10" fontWeight="bold" textAnchor="middle">H⁺ Akışı</text>

                {/* Output: ATP */}
                <text x="730" y="85" fill="#fbbf24" fontSize="12" fontWeight="bold">→ ATP Üretilir</text>
              </g>

              {/* Electron flow arrows across membrane complexes */}
              <path d="M 190,160 L 235,160 M 320,160 L 370,160 M 440,160 L 485,105" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />
              <text x="212" y="150" fill="#38bdf8" fontSize="9" fontWeight="bold">e⁻</text>
              <text x="345" y="150" fill="#38bdf8" fontSize="9" fontWeight="bold">e⁻</text>
            </svg>
          </div>

          {/* Explanation banner */}
          <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 block uppercase">
                Işıklı Evrenin 3 Temel Çıktısı:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                <strong>1. Oksijen (O₂):</strong> Suyun parçalanmasıyla atmosfere verilir. • <strong>2. ATP:</strong> H⁺ gradyanı ile ATP sentazdan üretilir. • <strong>3. NADPH:</strong> Elektronları Calvin döngüsüne taşır.
              </p>
            </div>

            <button
              onClick={() => setSubView('calvin_cycle')}
              className="h-12 px-5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <span>2. Calvin Döngüsüne Geç</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SUB-VIEW C: CALVIN DÖNGÜSÜ (Stroma) */}
      {/* ═══════════════════════════════════════════ */}
      {subView === 'calvin_cycle' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between my-2">
          {/* Calvin Cycle Diagram */}
          <div className="aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 850 380" className="w-full h-full select-none">
              {/* Outer circle */}
              <circle cx="425" cy="190" r="115" fill="none" stroke="#1e293b" strokeWidth="12" />
              <circle cx="425" cy="190" r="115" fill="none" stroke="#0284c7" strokeWidth="6" strokeDasharray="20 10" className="animate-spin-slow" />

              {/* Title inside center */}
              <text x="425" y="180" fill="#ffffff" fontSize="16" fontWeight="black" textAnchor="middle">
                CALVIN
              </text>
              <text x="425" y="200" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
                DÖNGÜSÜ
              </text>
              <text x="425" y="218" fill="#94a3b8" fontSize="9" textAnchor="middle">
                (Kloroplast Stroması)
              </text>

              {/* STAGE 1: Karbon Fiksasyonu (Top) */}
              <g>
                <rect x="365" y="20" width="120" height="34" rx="10" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
                <text x="425" y="42" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  1. CO₂ Girişi
                </text>
                <path d="M 425,54 L 425,75" stroke="#38bdf8" strokeWidth="3" />
                <polygon points="425,78 420,68 430,68" fill="#38bdf8" />
                <text x="510" y="55" fill="#bae6fd" fontSize="9">
                  (Rubisco Enzimi bağlar)
                </text>
              </g>

              {/* STAGE 2: İndirgenme / Enerji Harcanması (Right) */}
              <g>
                <rect x="570" y="165" width="160" height="50" rx="12" fill="#78350f" stroke="#fbbf24" strokeWidth="1.5" />
                <text x="650" y="186" fill="#fef3c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                  2. Enerji Tüketimi
                </text>
                <text x="650" y="202" fill="#fde68a" fontSize="9" textAnchor="middle">
                  ATP + NADPH Harcanır
                </text>
                {/* Arrow pointing to cycle */}
                <path d="M 570,190 L 545,190" stroke="#fbbf24" strokeWidth="3" />
                <polygon points="540,190 550,185 550,195" fill="#fbbf24" />
              </g>

              {/* STAGE 3: Glikoz Çıkışı (Bottom) */}
              <g>
                <path d="M 425,305 L 425,325" stroke="#10b981" strokeWidth="3" />
                <polygon points="425,330 420,320 430,320" fill="#10b981" />
                <rect x="330" y="330" width="190" height="38" rx="12" fill="#065f46" stroke="#34d399" strokeWidth="2" />
                <text x="425" y="354" fill="#ffffff" fontSize="12" fontWeight="black" textAnchor="middle">
                  3. 🌱 GLİKOZ (C₆H₁₂O₆)
                </text>
              </g>

              {/* STAGE 4: Rejenerasyon (Left) */}
              <g>
                <rect x="120" y="165" width="160" height="50" rx="12" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
                <text x="200" y="186" fill="#cbd5e1" fontSize="10" fontWeight="bold" textAnchor="middle">
                  4. RuBP Yenilenmesi
                </text>
                <text x="200" y="202" fill="#94a3b8" fontSize="9" textAnchor="middle">
                  Döngü Başa Döner
                </text>
              </g>
            </svg>
          </div>

          {/* Explanation banner */}
          <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 block uppercase">
                Calvin Döngüsünün Kilit Özelliği:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                Işık doğrudan kullanılmaz; fakat <strong>ışık yoksa ATP ve NADPH gelmeyeceği için Calvin döngüsü de durur</strong>! Bitki havadan aldığı karbonu burada şekere dönüştürür.
              </p>
            </div>

            <button
              onClick={() => setSubView('steps')}
              className="h-12 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <span>Adım Adım Mekanizmaya Bak</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* SUB-VIEW D: ADIM ADIM 11 BASAMAK */}
      {/* ═══════════════════════════════════════════ */}
      {subView === 'steps' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between my-2">
          {/* Step Visualizer */}
          <div className="aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 850 380" className="w-full h-full select-none">
              {/* Background Zones */}
              <rect x="50" y="50" width="450" height="280" rx="16" fill="#064e3b" opacity="0.3" stroke="#059669" strokeWidth="1.5" />
              <text x="65" y="75" fill="#6ee7b7" fontSize="12" fontWeight="bold">TİLAKOİT ZARI & LÜMEN</text>

              <rect x="520" y="50" width="280" height="280" rx="16" fill="#0369a1" opacity="0.2" stroke="#0284c7" strokeWidth="1.5" />
              <text x="535" y="75" fill="#38bdf8" fontSize="12" fontWeight="bold">STROMA SIVISI</text>

              {/* 1. Light source */}
              <g opacity={step.focusArea === 'light_source' ? 1 : 0.45}>
                <circle cx="110" cy="110" r="22" fill="#fbbf24" className={step.focusArea === 'light_source' ? 'animate-pulse' : ''} />
                <text x="110" y="114" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">IŞIK</text>
              </g>

              {/* 2. FS II */}
              <g opacity={step.focusArea === 'ps2' ? 1 : 0.45}>
                <rect x="150" y="145" width="60" height="100" rx="10" fill="#047857" stroke={step.focusArea === 'ps2' ? '#34d399' : '#10b981'} strokeWidth={step.focusArea === 'ps2' ? 3.5 : 1.5} />
                <text x="180" y="195" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">FS II</text>
              </g>

              {/* 3. Photolysis */}
              <g opacity={step.focusArea === 'photolysis' ? 1 : 0.45}>
                <ellipse cx="180" cy="275" rx="32" ry="16" fill="#0369a1" stroke={step.focusArea === 'photolysis' ? '#38bdf8' : '#0284c7'} strokeWidth={step.focusArea === 'photolysis' ? 3 : 1.5} />
                <text x="180" y="278" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">H₂O → O₂</text>
              </g>

              {/* 4. ETS */}
              <g opacity={step.focusArea === 'ets' ? 1 : 0.45}>
                <rect x="235" y="160" width="65" height="75" rx="8" fill="#7f1d1d" stroke={step.focusArea === 'ets' ? '#f87171' : '#b91c1c'} strokeWidth={step.focusArea === 'ets' ? 3 : 1.5} />
                <text x="267" y="200" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">ETS</text>
                <circle cx="267" cy="275" r="9" fill="#be123c" stroke="#fda4af" strokeWidth="1.5" />
                <text x="267" y="279" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">H⁺</text>
              </g>

              {/* 5. ATP Synthase */}
              <g opacity={step.focusArea === 'atp_synthase' ? 1 : 0.45}>
                <circle cx="430" cy="140" r="24" fill="#d97706" stroke={step.focusArea === 'atp_synthase' ? '#fbbf24' : '#b45309'} strokeWidth={step.focusArea === 'atp_synthase' ? 3 : 1.5} />
                <text x="430" y="143" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">ATP</text>
                <text x="430" y="153" fill="#fef3c7" fontSize="7" textAnchor="middle">Sentaz</text>
              </g>

              {/* 6. FS I */}
              <g opacity={step.focusArea === 'ps1' ? 1 : 0.45}>
                <rect x="325" y="145" width="60" height="100" rx="10" fill="#047857" stroke={step.focusArea === 'ps1' ? '#34d399' : '#10b981'} strokeWidth={step.focusArea === 'ps1' ? 3.5 : 1.5} />
                <text x="355" y="195" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">FS I</text>
              </g>

              {/* 7. NADPH */}
              <g opacity={step.focusArea === 'nadph' ? 1 : 0.45}>
                <rect x="330" y="95" width="60" height="30" rx="6" fill="#0284c7" stroke={step.focusArea === 'nadph' ? '#38bdf8' : '#0369a1'} strokeWidth={step.focusArea === 'nadph' ? 3 : 1.5} />
                <text x="360" y="114" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">NADPH</text>
              </g>

              {/* 8. Calvin */}
              <g opacity={step.focusArea === 'calvin' ? 1 : 0.45}>
                <circle cx="660" cy="180" r="60" fill="none" stroke={step.focusArea === 'calvin' ? '#38bdf8' : '#1e293b'} strokeWidth="6" />
                <text x="660" y="178" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">CALVİN</text>
                <text x="660" y="194" fill="#7dd3fc" fontSize="10" textAnchor="middle">DÖNGÜSÜ</text>
              </g>

              {/* 9. Glucose */}
              <g opacity={step.focusArea === 'glucose' ? 1 : 0.45}>
                <rect x="590" y="275" width="140" height="32" rx="8" fill="#065f46" stroke={step.focusArea === 'glucose' ? '#34d399' : '#059669'} strokeWidth={step.focusArea === 'glucose' ? 3 : 1.5} />
                <text x="660" y="295" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">🌱 GLİKOZ</text>
              </g>
            </svg>
          </div>

          {/* Step Detail Card with Voice Reading Button */}
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

              {/* Oynat / Durdur Butonu */}
              <button
                onClick={handleToggleAutoPlay}
                className={`h-11 px-3.5 rounded-xl border text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${
                  isAutoPlaying
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                }`}
                title="Tüm adımları sırayla seslendirerek otomatik oynat"
              >
                {isAutoPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                <span>{isAutoPlaying ? 'Durdur' : 'Oynat'}</span>
              </button>
            </div>
          </div>

          {/* Step Navigation Bar */}
          <div className="flex items-center justify-between gap-3 pt-3">
            <button
              disabled={activeStepIdx === 0}
              onClick={() => {
                setIsAutoPlaying(false);
                speechService.stop();
                setActiveStepIdx((p) => Math.max(0, p - 1));
              }}
              className="h-13 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Önceki Adım</span>
            </button>

            {/* Indicator Pills */}
            <div className="flex items-center gap-1">
              {PROCESS_STEPS_DATA.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    speechService.stop();
                    setActiveStepIdx(i);
                  }}
                  className={`w-7 h-8 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                    i === activeStepIdx
                      ? 'bg-emerald-400 text-slate-950 scale-110 shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {activeStepIdx === totalSteps - 1 ? (
              <button
                onClick={() => {
                  speechService.stop();
                  onGoToSimulation();
                }}
                className="h-13 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                <span>SİMÜLASYONA GEÇ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsAutoPlaying(false);
                  speechService.stop();
                  setActiveStepIdx((p) => Math.min(totalSteps - 1, p + 1));
                }}
                className="h-13 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs sm:text-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>Sonraki Adım</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
