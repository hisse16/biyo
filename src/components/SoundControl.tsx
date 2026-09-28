import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sliders } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface Props {
  variant?: 'header' | 'simulation';
}

export const SoundControl: React.FC<Props> = ({ variant = 'header' }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(soundEngine.getEnabled());
  const [volume, setVolume] = useState<number>(soundEngine.getVolume());
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSound = () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    soundEngine.setEnabled(nextState);
    if (nextState) {
      // Test sound when turning on
      soundEngine.play('photon');
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
    if (!isEnabled && newVol > 0) {
      setIsEnabled(true);
      soundEngine.setEnabled(true);
    }
  };

  if (variant === 'simulation') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSound}
          className={`h-12 px-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            isEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
              : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-400'
          }`}
          title={isEnabled ? 'Biyolojik Ses Efektlerini Kapat' : 'Biyolojik Ses Efektlerini Aç'}
        >
          {isEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          <span>{isEnabled ? 'Ses: Açık' : 'Ses: Kapalı'}</span>
        </button>

        {isEnabled && (
          <div className="hidden sm:flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono">Düzey:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-2 bg-slate-800 rounded-lg accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-mono w-7">
              %{Math.round(volume * 100)}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Header Variant (Compact with popover slider)
  return (
    <div className="relative">
      <button
        onClick={toggleSound}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className={`h-11 px-3 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0 ${
          isEnabled
            ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 hover:bg-slate-800'
            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400 hover:bg-slate-900'
        }`}
        title={isEnabled ? 'Ses Efektleri Açık (Ses düzeyini ayarlamak için tıkla)' : 'Ses Efektleri Kapalı'}
      >
        {isEnabled ? (
          <Volume2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-500" />
        )}
        <span className="hidden xl:inline">
          {isEnabled ? `Ses %${Math.round(volume * 100)}` : 'Sessiz'}
        </span>
      </button>

      {/* Popover slider on hover or right click */}
      {isOpen && (
        <div className="absolute right-0 top-13 z-50 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-2 w-48">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>Efekt Düzeyi</span>
            <span className="font-mono text-emerald-400">%{Math.round(volume * 100)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full h-2.5 bg-slate-950 rounded-lg accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Kısık</span>
            <span>Orta</span>
            <span>Maksimum</span>
          </div>
        </div>
      )}
    </div>
  );
};
