import React, { useState } from 'react';
import { EXPERIMENT_SCENARIOS } from '../data/questionsData';
import { ExperimentScenario, SimulationParams } from '../types';
import { Sliders, Sun, Droplet, Wind, Play, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface Props {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
}

export const ExperimentMode: React.FC<Props> = ({ params, setParams }) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [userPrediction, setUserPrediction] = useState<'Düşük' | 'Orta' | 'Yüksek' | null>(null);
  const [hasTested, setHasTested] = useState<boolean>(false);

  // Apply a preset scenario
  const handleApplyScenario = (scenario: ExperimentScenario) => {
    setSelectedScenario(scenario.id);
    setParams((prev) => ({
      ...prev,
      light: scenario.light,
      water: scenario.water,
      co2: scenario.co2
    }));
    setUserPrediction(null);
    setHasTested(false);
  };

  // Run the experiment and reveal result
  const handleRunExperiment = () => {
    setHasTested(true);
  };

  // Calculate actual outcome based on lowest limiting factor
  const minScore = Math.min(params.light, params.water, params.co2);
  let actualRate: 'Düşük' | 'Orta' | 'Yüksek' = 'Orta';
  if (minScore < 35) actualRate = 'Düşük';
  else if (minScore >= 70) actualRate = 'Yüksek';

  // Determine limiting factor name
  let limitingFactor = 'Tüm Faktörler Yeterli';
  if (minScore < 70) {
    if (minScore === params.light) limitingFactor = 'Işık Şiddeti';
    else if (minScore === params.water) limitingFactor = 'Su Miktarı';
    else limitingFactor = 'Karbondioksit (CO₂) Derişimi';
  }

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-5xl mx-auto px-2 sm:px-6 py-3 select-none">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-3 mb-2">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          SINIF DENEYİ YAP (Önce Tahmin Et, Sonra Test Et)
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Akıllı tahtada parametreleri değiştirin veya hazır bir senaryo seçip sınıfa sorun: <em>“Bu koşullarda fotosentez nasıl gerçekleşir?”</em>
        </p>
      </div>

      {/* 4 Preset Scenarios */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-2">
        {EXPERIMENT_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => handleApplyScenario(sc)}
              className={`h-16 px-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-center ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span className="font-extrabold text-xs sm:text-sm block">{sc.name}</span>
              <span className="text-[10px] text-slate-400 truncate block mt-0.5">{sc.description}</span>
            </button>
          );
        })}
      </div>

      {/* Main Experiment Testing Board */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 sm:p-7 shadow-2xl space-y-6 my-2">
        {/* Sliders in Experiment Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Işık */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-amber-300">
              <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-400" /> Işık</span>
              <span className="font-mono">%{params.light}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.light}
              onChange={(e) => {
                setParams((prev) => ({ ...prev, light: Number(e.target.value) }));
                setHasTested(false);
              }}
              className="w-full h-3 bg-slate-900 rounded-lg accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Su */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-sky-300">
              <span className="flex items-center gap-1.5"><Droplet className="w-4 h-4 text-sky-400" /> Su</span>
              <span className="font-mono">%{params.water}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.water}
              onChange={(e) => {
                setParams((prev) => ({ ...prev, water: Number(e.target.value) }));
                setHasTested(false);
              }}
              className="w-full h-3 bg-slate-900 rounded-lg accent-sky-400 cursor-pointer"
            />
          </div>

          {/* CO2 */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-cyan-300">
              <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-cyan-400" /> CO₂</span>
              <span className="font-mono">%{params.co2}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={params.co2}
              onChange={(e) => {
                setParams((prev) => ({ ...prev, co2: Number(e.target.value) }));
                setHasTested(false);
              }}
              className="w-full h-3 bg-slate-900 rounded-lg accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Prediction Box */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 text-center space-y-3">
          <span className="text-xs sm:text-sm font-bold text-white block">
            1. Sınıfa Sorun: Bu Koşullarda Fotosentez Hızı Ne Olur?
          </span>

          <div className="flex justify-center gap-3">
            {(['Düşük', 'Orta', 'Yüksek'] as const).map((choice) => (
              <button
                key={choice}
                onClick={() => setUserPrediction(choice)}
                className={`h-12 px-6 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                  userPrediction === choice
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20 scale-105'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>

        {/* Run / Test Button */}
        <div className="flex justify-center pt-1">
          <button
            onClick={handleRunExperiment}
            className="h-16 px-10 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 active:scale-95 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-950 transition-all cursor-pointer flex items-center gap-2.5"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>DENEYİ ÇALIŞTIR & SONUCU GÖR</span>
          </button>
        </div>

        {/* Revealed Outcome & Analysis */}
        {hasTested && (
          <div className="p-5 bg-slate-950 rounded-2xl border border-emerald-500/60 space-y-3 animate-in fade-in duration-300">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">DENEYSEL SONUÇ:</span>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-600 rounded-lg font-black text-sm font-mono">
                  {actualRate} Hız
                </span>
              </div>

              {userPrediction && (
                <div className="text-xs font-semibold">
                  {userPrediction === actualRate ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Sınıfın Tahmini Doğru!
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      Sınıf Tahmini: {userPrediction} → Gerçek Sonuç: {actualRate}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Scientific explanation */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              <strong className="text-amber-300 block mb-1">
                Sınırlayıcı Faktör: {limitingFactor}
              </strong>
              <p className="text-slate-300">
                Fotosentez hızını miktarı en az olan faktör belirler (Blackman'ın Sınırlayıcı Faktörler Kuralı). Diğer hammaddeler ne kadar bol olursa olsun, en kısıtlı olan etken tüm sistemi sınırlar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
