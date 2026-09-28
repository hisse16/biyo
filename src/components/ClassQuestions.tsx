import React, { useState } from 'react';
import { QUESTIONS_DATA } from '../data/questionsData';
import { QuestionItem } from '../types';
import { soundEngine } from '../utils/soundEngine';
import { CheckCircle2, ChevronRight, ChevronLeft, RotateCcw, HelpCircle, Sparkles } from 'lucide-react';

export const ClassQuestions: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  const question: QuestionItem = QUESTIONS_DATA[currentQuestionIndex];
  const total = QUESTIONS_DATA.length;

  const handleNext = () => {
    if (currentQuestionIndex < total - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedKey(null);
      setIsAnswerRevealed(false);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedKey(null);
      setIsAnswerRevealed(false);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedKey(null);
    setIsAnswerRevealed(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between max-w-4xl mx-auto px-2 sm:px-6 py-3 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            SINIF ETKİLEŞİM SORULARI
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Sınıfa soruyu yöneltin, cevapları dinleyin ve ardından tahtada cevabı açın.
          </p>
        </div>

        {/* Question Counter Pill */}
        <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
          Soru {currentQuestionIndex + 1} / {total}
        </span>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 my-2">
        {/* Question Text */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            Soru {currentQuestionIndex + 1}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Options (Large 55px touch buttons for Smartboard) */}
        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = selectedKey === opt.key;
            const isCorrect = opt.key === question.correctKey;

            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

            if (isAnswerRevealed) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold ring-2 ring-emerald-500/30';
              } else if (isSelected) {
                btnStyle = 'bg-rose-950/60 border-rose-600 text-rose-200';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60';
              }
            } else if (isSelected) {
              btnStyle = 'bg-slate-800 border-amber-400 text-white font-semibold';
            }

            return (
              <button
                key={opt.key}
                onClick={() => {
                  if (!isAnswerRevealed) setSelectedKey(opt.key);
                }}
                className={`w-full h-15 px-4 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </div>

                {isAnswerRevealed && isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* CEVABI GÖSTER BUTTON (Centered, big touch target) */}
        {!isAnswerRevealed ? (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setIsAnswerRevealed(true);
                soundEngine.play('atp_synthesized');
              }}
              className="h-14 px-8 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
            >
              CEVABI GÖSTER
            </button>
          </div>
        ) : (
          /* REVEALED SCIENTIFIC EXPLANATION */
          <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border border-emerald-500/60 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>Doğru Cevap: {question.correctKey} Şıkkı</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Navigation Controls (Önceki & Sonraki) */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={handlePrev}
          className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2 font-bold text-xs sm:text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Önceki Soru</span>
        </button>

        {/* Question Paginator Dots / Numbers */}
        <div className="flex items-center gap-1">
          {QUESTIONS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentQuestionIndex(idx);
                setSelectedKey(null);
                setIsAnswerRevealed(false);
              }}
              className={`w-7 h-9 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                idx === currentQuestionIndex
                  ? 'bg-amber-400 text-slate-950 scale-110 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          disabled={currentQuestionIndex === total - 1}
          onClick={handleNext}
          className="h-14 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-slate-950 font-bold text-xs sm:text-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
        >
          <span>Sonraki Soru</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
