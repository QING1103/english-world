
import React, { useState, useEffect } from 'react';
import { Word } from '../types';

interface WordDetailViewProps {
  word: Word;
  onBack: () => void;
  onNext: () => void;
}

const WordDetailView: React.FC<WordDetailViewProps> = ({ word, onBack, onNext }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [entryAnimation, setEntryAnimation] = useState('animate-in fade-in slide-in-from-right duration-300');

  // Trigger entry animation whenever word changes
  useEffect(() => {
    setEntryAnimation('animate-in fade-in slide-in-from-right duration-500');
    const timer = setTimeout(() => setEntryAnimation(''), 500);
    return () => clearTimeout(timer);
  }, [word.id]);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    // Visual feedback for "Playing"
    setTimeout(() => setIsPlayingAudio(false), 800);
  };

  const handleMagicButton = () => {
    setShowMnemonic(!showMnemonic);
  };

  const handlePracticeAgain = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <div className={`flex-1 flex flex-col min-h-screen bg-background-light dark:bg-background-dark overflow-x-hidden ${entryAnimation}`}>
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .ripple-effect {
          animation: ripple 0.8s ease-out infinite;
        }
        @keyframes shake-soft {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake-soft {
          animation: shake-soft 0.2s ease-in-out infinite;
        }
        .mnemonic-glow {
          box-shadow: 0 0 20px rgba(244, 226, 37, 0.4);
        }
      `}</style>

      {/* Top Header */}
      <div className="flex items-center p-6 pb-2 justify-between sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md z-30">
        <button onClick={onBack} className="flex size-11 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm text-[#1c1b0d] dark:text-white active:scale-90 transition-transform border border-slate-100 dark:border-slate-700">
          <span className="material-symbols-outlined text-2xl">arrow_back_ios_new</span>
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-[#1c1b0d] dark:text-white text-base font-black leading-tight tracking-widest uppercase opacity-40">Word Magic</h2>
        </div>
        <div className="flex w-11 items-center justify-end">
          <button 
            onClick={() => setIsFavorited(!isFavorited)}
            className={`flex size-11 items-center justify-center rounded-full shadow-sm transition-all active:scale-125 ${isFavorited ? 'bg-primary-yellow text-[#1c1b0d]' : 'bg-white dark:bg-zinc-800 text-slate-300'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${isFavorited ? 'fill-1' : ''}`}>grade</span>
          </button>
        </div>
      </div>

      <div className="px-6 pt-4 pb-32 flex flex-col gap-6 overflow-y-auto no-scrollbar">
        {/* Magic Word Header Card */}
        <div className={`magic-card-shadow bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 flex flex-col items-center border-4 border-primary-yellow/10 relative overflow-hidden transition-all ${isShaking ? 'animate-shake-soft' : ''}`}>
          {/* Background Decor */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary-yellow/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

          <div className="mb-4">
            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">{word.level}</span>
          </div>
          
          <h1 className="text-[#1c1b0d] dark:text-white tracking-tight text-[64px] font-black leading-none mb-6 drop-shadow-sm">{word.word}</h1>
          
          <div className="flex gap-6 relative z-10">
            {/* Pronunciation Button */}
            <div className="relative">
              {isPlayingAudio && <div className="absolute inset-0 bg-primary-yellow rounded-full ripple-effect" />}
              <button 
                onClick={handlePlayAudio}
                className="relative z-10 flex items-center justify-center rounded-full size-16 bg-primary-yellow text-[#1c1b0d] shadow-[0_6px_0_0_#d4c200] active:translate-y-1 active:shadow-none transition-all"
              >
                <span className="material-symbols-outlined text-4xl">volume_up</span>
              </button>
            </div>
            
            {/* Magic Mnemonic Button */}
            <button 
              onClick={handleMagicButton}
              className={`flex items-center justify-center rounded-full size-16 shadow-[0_6px_0_0_#e2e8f0] dark:shadow-[0_6px_0_0_#18181b] active:translate-y-1 active:shadow-none transition-all ${showMnemonic ? 'bg-primary text-white shadow-[0_6px_0_0_#c2410c]' : 'bg-white dark:bg-zinc-800 text-[#1c1b0d] dark:text-white border-2 border-slate-100 dark:border-slate-700'}`}
            >
              <span className={`material-symbols-outlined text-4xl ${showMnemonic ? 'fill-1' : ''}`}>auto_fix_high</span>
            </button>
          </div>

          {showMnemonic && (
            <div className="mt-8 p-4 bg-primary-yellow/20 rounded-2xl border-2 border-dashed border-primary-yellow animate-in zoom-in-95 duration-300 mnemonic-glow">
              <p className="text-[#1c1b0d] text-sm font-bold text-center italic">
                <span className="material-symbols-outlined text-xs mr-1">lightbulb</span>
                {word.mnemonic || '用魔法连接你的记忆...'}
              </p>
            </div>
          )}
        </div>

        {/* Scene Illustration with Interactivity */}
        <div className="group relative rounded-[2.5rem] overflow-hidden magic-card-shadow aspect-[16/11] cursor-pointer">
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
            style={{ backgroundImage: `url("${word.imageUrl}")` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            <div className="flex items-center gap-2 mb-1.5 opacity-80">
              <span className="material-symbols-outlined text-primary-yellow text-sm fill-1">location_on</span>
              <p className="text-primary-yellow text-[10px] font-black uppercase tracking-[0.2em]">记忆场景 (Scene)</p>
            </div>
            <p className="text-white text-xl font-black leading-tight">{word.sceneCn}</p>
          </div>
        </div>

        {/* Content Tabs / Info Bubbles */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col rounded-[2rem] bg-gradient-to-br from-primary-yellow to-amber-400 px-7 py-6 shadow-[0_10px_0_0_#d4c200] border-4 border-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/40 p-1.5 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[#1c1b0d] text-xl font-black">translate</span>
              </div>
              <p className="text-[#1c1b0d] text-sm font-black uppercase tracking-wider">中文含义</p>
            </div>
            <p className="text-[#1c1b0d] text-xl font-black leading-snug">{word.meaning}</p>
          </div>

          <details className="flex flex-col rounded-[2rem] bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-slate-800 px-7 py-5 group shadow-sm overflow-hidden" open>
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-1 list-none outline-none">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl font-black">menu_book</span>
                </div>
                <p className="text-[#1c1b0d] dark:text-white text-base font-black uppercase tracking-wide">魔法语法</p>
              </div>
              <div className="text-primary group-open:rotate-180 transition-transform duration-300">
                <span className="material-symbols-outlined font-black">expand_more</span>
              </div>
            </summary>
            <div className="pt-5 flex flex-wrap gap-2 animate-in slide-in-from-top-2 duration-300">
              {word.grammarTags.map(tag => (
                <span key={tag} className="bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-[10px] font-black border border-slate-100 dark:border-slate-700">{tag}</span>
              ))}
              <p className="text-slate-500 dark:text-zinc-400 text-sm font-bold leading-relaxed w-full mt-3 pl-1 border-l-4 border-primary/20">{word.grammar}</p>
            </div>
          </details>

          <details className="flex flex-col rounded-[2rem] bg-white dark:bg-zinc-900 border-2 border-slate-100 dark:border-slate-800 px-7 py-5 group shadow-sm overflow-hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-6 py-1 list-none outline-none">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-1.5 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl font-black">edit_note</span>
                </div>
                <p className="text-[#1c1b0d] dark:text-white text-base font-black uppercase tracking-wide">魔法造句</p>
              </div>
              <div className="text-primary group-open:rotate-180 transition-transform duration-300">
                <span className="material-symbols-outlined font-black">expand_more</span>
              </div>
            </summary>
            <div className="pt-5 animate-in slide-in-from-top-2 duration-300">
              <p className="text-[#1c1b0d] dark:text-white text-lg font-black italic leading-normal tracking-tight">
                "{word.sentenceEn}"
              </p>
              <div className="h-0.5 w-12 bg-primary/20 my-3 rounded-full" />
              <p className="text-slate-500 dark:text-zinc-400 text-sm font-bold">{word.sentenceCn}</p>
            </div>
          </details>
        </div>

        {/* Fixed Action Bar at bottom */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] px-6 pb-10 pt-4 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent z-40 flex gap-4">
          <button 
            onClick={handlePracticeAgain}
            className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 text-slate-800 dark:text-white border-[3px] border-slate-200 dark:border-slate-700 h-16 rounded-[1.5rem] font-black text-lg active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined font-black">replay</span>
            <span>再练练</span>
          </button>
          
          <button 
            onClick={onNext}
            className="flex-[1.5] flex items-center justify-center gap-2 bg-slate-900 dark:bg-primary text-white h-16 rounded-[1.5rem] font-black text-lg shadow-[0_6px_0_0_#000000] dark:shadow-[0_6px_0_0_#c2410c] active:translate-y-1 active:shadow-none transition-all group"
          >
            <span className="material-symbols-outlined font-black group-hover:animate-bounce">check_circle</span>
            <span>记住了</span>
            <span className="material-symbols-outlined font-black ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordDetailView;
