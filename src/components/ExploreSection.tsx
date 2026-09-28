import React, { useState } from 'react';
import { ExploreStep, AppTab } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Layers, Sun, Info, CheckCircle2 } from 'lucide-react';

interface Props {
  onGoToPhotosynthesis: () => void;
}

export const ExploreSection: React.FC<Props> = ({ onGoToPhotosynthesis }) => {
  const [step, setStep] = useState<ExploreStep>('cell');
  const [selectedOrganelle, setSelectedOrganelle] = useState<string>('chloroplast');
  const [selectedChloroplastPart, setSelectedChloroplastPart] = useState<'thylakoid' | 'granum' | 'stroma'>('thylakoid');

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-5xl mx-auto px-2 sm:px-6 py-3 select-none">
      {/* 1. TOP STEPPER BREADCRUMB (Touch-friendly & clear) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <span>KEŞFET:</span>
            <span className="text-emerald-400">
              {step === 'cell' && '1. Bitki Hücresi'}
              {step === 'chloroplast_anatomy' && '2. Kloroplasta Yakından Bakış'}
              {step === 'two_regions' && '3. Kloroplastın İki Ana Bölgesi'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            {step === 'cell' && 'Fotosentezin gerçekleştiği kloroplast organelini bitki hücresi içinde keşfedin.'}
            {step === 'chloroplast_anatomy' && 'Çift zarlı kloroplastın iç mimarisini inceleyin.'}
            {step === 'two_regions' && 'Işıklı evrenin ve Calvin döngüsünün gerçekleştiği iki temel bölgeyi tanıyın.'}
          </p>
        </div>

        {/* 3 Step Indicator Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep('cell')}
            className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              step === 'cell'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1. Hücre
          </button>
          <button
            onClick={() => setStep('chloroplast_anatomy')}
            className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              step === 'chloroplast_anatomy'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            2. Kloroplast
          </button>
          <button
            onClick={() => setStep('two_regions')}
            className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              step === 'two_regions'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3. İki Bölge
          </button>
        </div>
      </div>

      {/* 2. DYNAMIC STAGE BASED ON STEP */}
      {step === 'cell' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between my-2">
          {/* Plant Cell Interactive Canvas */}
          <div className="aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 750 380" className="w-full h-full select-none">
              {/* Outer Cell Wall */}
              <polygon
                points="80,40 670,40 730,190 670,340 80,340 20,190"
                fill="#022c22"
                stroke="#047857"
                strokeWidth="12"
              />
              <polygon
                points="84,48 666,48 722,190 666,332 84,332 28,190"
                fill="#064e3b"
                opacity="0.5"
                stroke="#10b981"
                strokeWidth="3"
              />

              {/* Vacuole */}
              <path
                d="M 280,100 Q 420,90 480,160 Q 520,250 400,290 Q 260,310 250,220 Z"
                fill="#0284c7"
                opacity="0.45"
                stroke="#38bdf8"
                strokeWidth="2"
                onClick={() => setSelectedOrganelle('vacuole')}
                className="cursor-pointer hover:opacity-70 transition-opacity"
              />
              <text x="360" y="195" fill="#bae6fd" fontSize="13" fontWeight="bold" textAnchor="middle">
                Merkezi Koful
              </text>

              {/* Nucleus */}
              <g onClick={() => setSelectedOrganelle('nucleus')} className="cursor-pointer hover:scale-105 transition-transform">
                <circle cx="570" cy="140" r="45" fill="#581c87" stroke="#c084fc" strokeWidth="2.5" />
                <circle cx="570" cy="140" r="16" fill="#a855f7" />
                <text x="570" y="200" fill="#f3e8ff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Çekirdek
                </text>
              </g>

              {/* Mitochondria */}
              <g onClick={() => setSelectedOrganelle('mitochondria')} className="cursor-pointer hover:scale-105 transition-transform">
                <ellipse cx="530" cy="270" rx="40" ry="20" fill="#7f1d1d" stroke="#f87171" strokeWidth="2" transform="rotate(-15 530 270)" />
                <text x="530" y="274" fill="#fecaca" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Mitokondri
                </text>
              </g>

              {/* Main Glowing Chloroplast (Focal Organelle) */}
              <g
                onClick={() => setSelectedOrganelle('chloroplast')}
                className="cursor-pointer group"
              >
                <ellipse
                  cx="160"
                  cy="140"
                  rx="75"
                  ry="46"
                  fill="#047857"
                  stroke={selectedOrganelle === 'chloroplast' ? '#34d399' : '#10b981'}
                  strokeWidth={selectedOrganelle === 'chloroplast' ? 4 : 2}
                  className="transition-all"
                />
                {/* Internal thylakoid disks preview */}
                <ellipse cx="140" cy="130" rx="16" ry="6" fill="#10b981" />
                <ellipse cx="140" cy="140" rx="16" ry="6" fill="#10b981" />
                <ellipse cx="180" cy="135" rx="16" ry="6" fill="#10b981" />
                <ellipse cx="180" cy="145" rx="16" ry="6" fill="#10b981" />

                <text x="160" y="170" fill="#ffffff" fontSize="13" fontWeight="black" textAnchor="middle">
                  KLOROPLAST ★
                </text>

                {/* Animated ripple ring */}
                <circle cx="160" cy="140" r="55" fill="none" stroke="#34d399" strokeWidth="2" className="animate-ping" opacity="0.5" />
              </g>

              {/* Secondary Chloroplast */}
              <g onClick={() => setSelectedOrganelle('chloroplast')} className="cursor-pointer">
                <ellipse cx="160" cy="265" rx="55" ry="34" fill="#047857" stroke="#10b981" strokeWidth="2" />
                <text x="160" y="270" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Kloroplast
                </text>
              </g>
            </svg>
          </div>

          {/* Organelle Description Bar */}
          <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">
                {selectedOrganelle === 'chloroplast' && 'Seçilen Organel: Kloroplast (Hedef Organel)'}
                {selectedOrganelle === 'vacuole' && 'Seçilen Organel: Merkezi Koful'}
                {selectedOrganelle === 'nucleus' && 'Seçilen Organel: Çekirdek'}
                {selectedOrganelle === 'mitochondria' && 'Seçilen Organel: Mitokondri'}
              </span>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                {selectedOrganelle === 'chloroplast' && 'Bitki hücrelerinde fotosentezin gerçekleştiği, klorofil içeren çift zarlı organeldir. Şimdi içine girelim!'}
                {selectedOrganelle === 'vacuole' && 'Bitki hücresinde su, mineral ve atık maddeleri depolayan büyük kofuktur. Turgor basıncını sağlar.'}
                {selectedOrganelle === 'nucleus' && 'Hücrenin yönetim ve kalıtım merkezidir; DNA moleküllerini barındırır.'}
                {selectedOrganelle === 'mitochondria' && 'Hücresel solunum ile organik besinlerden ATP enerjisi üreten organeldir.'}
              </p>
            </div>

            <button
              onClick={() => setStep('chloroplast_anatomy')}
              className="h-13 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm shrink-0 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <span>Kloroplastın İçine Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 'chloroplast_anatomy' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between my-2">
          {/* Zoomed-in Chloroplast Model */}
          <div className="aspect-[16/8] bg-slate-950 rounded-2xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 750 380" className="w-full h-full select-none">
              {/* Outer Membrane */}
              <ellipse cx="375" cy="190" rx="350" ry="165" fill="#022c22" stroke="#10b981" strokeWidth="4" />
              {/* Inner Membrane */}
              <ellipse cx="375" cy="190" rx="335" ry="150" fill="#064e3b" opacity="0.75" stroke="#34d399" strokeWidth="2.5" />

              {/* Labels for Membranes */}
              <text x="375" y="55" fill="#6ee7b7" fontSize="12" fontWeight="bold" textAnchor="middle">
                Çift Zar (Dış Zar + İç Zar)
              </text>
              <text x="375" y="72" fill="#94a3b8" fontSize="10" textAnchor="middle">
                Kloroplastı sitoplazmadan izole eder ve madde geçişini düzenler
              </text>

              {/* Stroma Background Liquid */}
              <text x="610" y="160" fill="#38bdf8" fontSize="14" fontWeight="black" textAnchor="middle">
                STROMA
              </text>
              <text x="610" y="178" fill="#bae6fd" fontSize="10" textAnchor="middle">
                (Kloroplast Sıvısı)
              </text>

              {/* Circular DNA & Ribosomes representation in Stroma */}
              <circle cx="590" cy="220" r="14" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
              <text x="590" y="245" fill="#fde047" fontSize="8" textAnchor="middle">Halkasal DNA</text>
              <circle cx="640" cy="220" r="3" fill="#cbd5e1" />
              <circle cx="650" cy="230" r="3" fill="#cbd5e1" />
              <text x="645" y="245" fill="#cbd5e1" fontSize="8" textAnchor="middle">Ribozomlar</text>

              {/* Granum Tower 1 (Stack of Thylakoids) */}
              <g className="cursor-pointer">
                <rect x="150" y="120" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="150" y="140" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="150" y="160" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="150" y="180" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="150" y="200" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <text x="185" y="240" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">
                  GRANUM 1
                </text>
              </g>

              {/* Connecting Lamella (Ara Lamel) */}
              <line x1="220" y1="165" x2="280" y2="165" stroke="#059669" strokeWidth="4" />

              {/* Granum Tower 2 */}
              <g className="cursor-pointer">
                <rect x="280" y="110" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="280" y="130" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="280" y="150" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="280" y="170" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="280" y="190" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="280" y="210" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <text x="315" y="250" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">
                  GRANUM 2
                </text>
              </g>

              {/* Connecting Lamella 2 */}
              <line x1="350" y1="175" x2="410" y2="175" stroke="#059669" strokeWidth="4" />

              {/* Granum Tower 3 */}
              <g className="cursor-pointer">
                <rect x="410" y="130" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="410" y="150" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="410" y="170" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <rect x="410" y="190" width="70" height="15" rx="7" fill="#059669" stroke="#34d399" strokeWidth="1.5" />
                <text x="445" y="230" fill="#a7f3d0" fontSize="11" fontWeight="bold" textAnchor="middle">
                  GRANUM 3
                </text>
              </g>
            </svg>
          </div>

          {/* Subtitle & Advance */}
          <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 block uppercase">
                Temel Kloroplast Mimarisi
              </span>
              <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                Kloroplastın içi rastgele bir çorba değildir: <strong>Tilakoit kuleleri (Granumlar)</strong> ve onları çevreleyen <strong>Stroma sıvısı</strong> olmak üzere iki özel bölgeye ayrılmıştır.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setStep('cell')}
                className="h-12 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold cursor-pointer"
              >
                Geri
              </button>
              <button
                onClick={() => setStep('two_regions')}
                className="h-12 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <span>İki Bölgeyi İncele</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'two_regions' && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl flex-1 flex flex-col justify-between my-2">
          {/* Comparison Cards for the 2 Key Compartments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* COMPARTMENT 1: TİLAKOİT & GRANUM */}
            <div
              onClick={() => {
                setSelectedChloroplastPart('thylakoid');
                soundEngine.play('photon');
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedChloroplastPart === 'thylakoid'
                  ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono text-[11px] font-bold">
                    1. BÖLGE: ZAR SİSTEMİ
                  </span>
                  <Sun className="w-5 h-5 text-amber-400" />
                </div>

                <h3 className="text-xl font-black text-white mt-2">
                  Tilakoit Zar & Granum
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Yassı kesecikler (tilakoit) ve bunların kuleler halinde üst üste dizilmesi (granum).
                </p>
              </div>

              {/* What happens here? */}
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-900/50 space-y-1.5">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Burada Gerçekleşen Olay: IŞIĞA BAĞIMLI EVRE
                </span>
                <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                  <li>Güneş fotonları klorofiller tarafından yakalanır.</li>
                  <li>Su fotoliz ile parçalanır: <strong>H₂O → 2H⁺ + 2e⁻ + ½O₂</strong></li>
                  <li>Atmosfere verilen <strong>Oksijen (O₂)</strong> burada üretilir.</li>
                  <li>ETS ve ATP Sentaz ile <strong>ATP ve NADPH</strong> sentezlenir.</li>
                </ul>
              </div>
            </div>

            {/* COMPARTMENT 2: STROMA */}
            <div
              onClick={() => {
                setSelectedChloroplastPart('stroma');
                soundEngine.play('calvin_entry');
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                selectedChloroplastPart === 'stroma'
                  ? 'bg-sky-950/60 border-sky-400 ring-2 ring-sky-500/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 border border-sky-700 font-mono text-[11px] font-bold">
                    2. BÖLGE: SIVI MATRİKS
                  </span>
                  <Layers className="w-5 h-5 text-sky-400" />
                </div>

                <h3 className="text-xl font-black text-white mt-2">
                  Stroma Sıvısı
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Kloroplastın içini dolduran, enzimler, DNA, RNA ve ribozom bakımından zengin jelimsi sıvı.
                </p>
              </div>

              {/* What happens here? */}
              <div className="p-3 bg-slate-900 rounded-xl border border-sky-900/50 space-y-1.5">
                <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  Burada Gerçekleşen Olay: CALVIN DÖNGÜSÜ
                </span>
                <ul className="text-xs text-slate-300 space-y-1 pl-4 list-disc">
                  <li>Doğrudan ışık gerektirmez ancak ışıklı evrenin ürünlerine muhtaçtır.</li>
                  <li>Havadan <strong>CO₂ (Karbondioksit)</strong> bağlanır.</li>
                  <li>Işıklı evreden gelen <strong>ATP ve NADPH</strong> tüketilir.</li>
                  <li>Sonuçta canlıların temel besini olan <strong>Glikoz (Şeker)</strong> üretilir.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action to switch to Photosynthesis section */}
          <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-slate-300">
              <strong className="text-white block font-bold">Harika! Mekanları öğrendik.</strong>
              Şimdi bu iki bölgedeki reaksiyonların adım adım nasıl çalıştığını keşfedelim.
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setStep('chloroplast_anatomy')}
                className="h-13 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold cursor-pointer"
              >
                Geri
              </button>
              <button
                onClick={onGoToPhotosynthesis}
                className="h-13 px-7 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-xl active:scale-95 transition-all"
              >
                <span>FOTOSENTEZ EVRELERİNE GEÇ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
