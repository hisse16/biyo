import React, { useState } from 'react';
import { AppTab, SimulationParams } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomeHero } from './components/HomeHero';
import { ExploreSection } from './components/ExploreSection';
import { PhotosynthesisSection } from './components/PhotosynthesisSection';
import { MainChloroplastSimulation } from './components/MainChloroplastSimulation';
import { ClassQuestions } from './components/ClassQuestions';
import { SoundControl } from './components/SoundControl';
import { Maximize2, Minimize2, Tv, Sparkles, Home, Compass, Sun, Sliders, HelpCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Global shared simulation parameters
  const [params, setParams] = useState<SimulationParams>({
    light: 75,
    water: 70,
    co2: 70,
    speed: 'normal',
    showElectrons: true,
    showProtons: true
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500/30 selection:text-emerald-200">
        {/* 1. TOP HEADER & THE CLEAN 4 MAIN SMARTBOARD TABS */}
        <header className="bg-slate-950/95 border-b border-slate-900 px-3 sm:px-6 py-2.5 sticky top-0 z-40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Title / Brand (Clickable to return Home) */}
            <button
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-3 text-left cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center border border-emerald-400/40 shadow-lg shadow-emerald-950/60 group-hover:scale-105 transition-transform">
                <Tv className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h1 className="font-black text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span>FOTOSENTEZ</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/60">
                    10. Sınıf Modeli
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Akıllı Tahta Etkileşimli Biyoloji Sunumu
                </p>
              </div>
            </button>

            {/* The 4 Main Navigation Tabs + Home (>= 48px touch targets for Smartboard) */}
            <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('home')}
                className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'home'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Ana Sayfa"
              >
                <Home className="w-4 h-4" />
                <span className="hidden md:inline">Giriş</span>
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'explore'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>KEŞFET</span>
              </button>

              <button
                onClick={() => setActiveTab('photosynthesis')}
                className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'photosynthesis'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>FOTOSENTEZ</span>
              </button>

              <button
                onClick={() => setActiveTab('simulation')}
                className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'simulation'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>SİMÜLASYON</span>
              </button>

              <button
                onClick={() => setActiveTab('questions')}
                className={`h-11 px-3 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'questions'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>SORULAR</span>
              </button>
            </nav>

            {/* Sound Control & Fullscreen for Smartboard */}
            <div className="flex items-center gap-2 shrink-0">
              <SoundControl variant="header" />

              <button
                onClick={toggleFullscreen}
                className="h-11 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
                title="Akıllı Tahtada Tam Ekran"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                <span className="hidden lg:inline">Tam Ekran</span>
              </button>
            </div>
          </div>
        </header>

        {/* 2. DYNAMIC MAIN STAGE */}
        <main className="flex-1 flex flex-col justify-center items-center p-2 sm:p-4 w-full">
          {activeTab === 'home' && (
            <HomeHero
              onStartExplore={() => setActiveTab('explore')}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreSection
              onGoToPhotosynthesis={() => setActiveTab('photosynthesis')}
            />
          )}

          {activeTab === 'photosynthesis' && (
            <PhotosynthesisSection
              onGoToSimulation={() => setActiveTab('simulation')}
            />
          )}

          {activeTab === 'simulation' && (
            <MainChloroplastSimulation params={params} setParams={setParams} />
          )}

          {activeTab === 'questions' && (
            <ClassQuestions />
          )}
        </main>

        {/* 3. MINIMAL FOOTER FOR CLASSROOM CONTEXT */}
        <footer className="border-t border-slate-900 px-4 py-2 text-center text-[11px] text-slate-500">
          <span>10. Sınıf Biyoloji Dersi Fotosentez Modeli • Akıllı Tahta İçin Optimize Edildi</span>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default App;
