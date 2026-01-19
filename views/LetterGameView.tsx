
import React, { useState, useEffect } from 'react';
import { Word } from '../types';

interface LetterGameViewProps {
  words: Word[];
  onBack: () => void;
}

const LetterGameView: React.FC<LetterGameViewProps> = ({ words, onBack }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const currentTarget = words[wordIndex] || words[0];

  // State for the spelling interaction
  const [currentWordState, setCurrentWordState] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shuffling, setShuffling] = useState(false);

  // Initialize word state when target changes
  useEffect(() => {
    if (!currentTarget) return;
    const word = currentTarget.word.toUpperCase();
    const chars = word.split('');
    const blankIdx = word.length > 2 ? 2 : 1;
    const newState = chars.map((c, i) => (i === blankIdx ? '' : c));
    setCurrentWordState(newState);
    setIsCorrect(null);
    setShuffling(false);
  }, [wordIndex, currentTarget]);

  // Handle automatic transition after correct answer
  useEffect(() => {
    if (isCorrect === true) {
      const timer = setTimeout(() => {
        if (wordIndex < words.length - 1) {
          setShuffling(true);
          setTimeout(() => {
            setWordIndex(prev => prev + 1);
          }, 300);
        } else {
          onBack();
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCorrect, wordIndex, onBack, words.length]);

  const handleLetterClick = (letter: string) => {
    if (isCorrect === true) return;
    const nextState = [...currentWordState];
    const blankIndex = nextState.findIndex(l => l === '');
    if (blankIndex !== -1) {
      nextState[blankIndex] = letter;
      setCurrentWordState(nextState);
      setIsCorrect(null);
    }
  };

  const handleClear = () => {
    if (!currentTarget) return;
    const word = currentTarget.word.toUpperCase();
    const blankIdx = word.length > 2 ? 2 : 1;
    setCurrentWordState(word.split('').map((c, i) => (i === blankIdx ? '' : c)));
    setIsCorrect(null);
  };

  const handleConfirm = () => {
    if (!currentTarget) return;
    if (isCorrect === true) return;
    const isWordComplete = !currentWordState.includes('');
    if (isWordComplete) {
      const result = currentWordState.join('') === currentTarget.word.toUpperCase();
      setIsCorrect(result);
    }
  };

  const getBubbles = () => {
    if (!currentTarget) return [];
    const word = currentTarget.word.toUpperCase();
    const blankIdx = word.length > 2 ? 2 : 1;
    const correctLetter = word[blankIdx];
    const others = ['X', 'B', 'P', 'L', 'S', 'O', 'K'].filter(l => l !== correctLetter).slice(0, 5);
    const all = [correctLetter, ...others].sort(() => Math.random() - 0.5);

    return all.map((l, i) => ({
      letter: l,
      color: i % 3 === 0 ? 'from-pink-500 to-pink-700' : i % 3 === 1 ? 'from-cyan-500 to-cyan-700' : 'from-amber-500 to-amber-700',
      offset: i % 2 === 0 ? 'translate-y-0.5' : '-translate-y-0.5'
    }));
  };

  const [bubbles, setBubbles] = useState(getBubbles());

  useEffect(() => {
    setBubbles(getBubbles());
  }, [wordIndex, currentTarget]);

  if (!currentTarget || words.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light">
        <p className="text-gray-400">暂无单词数据</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-background-light dark:bg-background-dark font-display text-[#0d101b] min-h-screen transition-opacity duration-300 ${shuffling ? 'opacity-0' : 'opacity-100'} overflow-x-hidden`}>
      <style>{`
        .bubble-glow {
            box-shadow: inset -4px -4px 8px rgba(0,0,0,0.15), inset 4px 4px 8px rgba(255,255,255,0.25);
            transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.2s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.2s ease-in-out 0s 2; }
        .success-bounce { animation: bounce 0.5s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Top Header */}
      <div className="flex items-center p-4 pb-2 justify-between">
        <div onClick={onBack} className="text-[#0d101b] flex size-12 shrink-0 items-center justify-center bg-white/50 rounded-full cursor-pointer active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-3xl text-[#1b140d]">pause</span>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-[#0d101b] text-lg font-bold">字母消消乐</h2>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => <span key={i} className={`material-symbols-outlined text-orange-500 text-sm ${wordIndex >= i ? 'fill-1' : ''}`}>star</span>)}
          </div>
        </div>
        <div className="flex w-12 items-center justify-end">
          <button className="flex size-12 items-center justify-center rounded-full bg-white/50 active:scale-90 transition-transform"><span className="material-symbols-outlined text-3xl">lightbulb</span></button>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-3 p-6">
        <div className="flex justify-between items-end">
          <div><p className="text-xs font-bold uppercase opacity-60">Level</p><p className="text-2xl font-black">05</p></div>
          <div className="text-right"><p className="text-xs font-bold uppercase opacity-60">Score</p><p className="text-2xl font-black">{1250 + (wordIndex * 250)}</p></div>
        </div>
        <div className="rounded-full bg-slate-200/50 h-3 overflow-hidden shadow-inner"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${((wordIndex + 1) / words.length) * 100}%` }}></div></div>
      </div>

      {/* Target Word Display */}
      <div className="py-4 px-4">
        <p className="text-center text-[#0d101b]/40 font-black mb-4 text-[10px] uppercase tracking-[0.4em]">Spell the Magic Word</p>
        <div className={`flex justify-center items-center gap-2 ${isCorrect === false ? 'shake' : ''}`}>
          {currentWordState.map((letter, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className={`text-5xl font-black leading-none min-w-[1em] text-center transition-all ${letter === '' ? 'text-primary/10' :
                isCorrect === true ? 'text-green-500' :
                  isCorrect === false ? 'text-red-500' : 'text-primary'
                }`}>{letter || '_'}</span>
              <div className={`h-1.5 w-full rounded-full mt-2 transition-colors ${letter === '' ? 'bg-slate-200' : isCorrect === true ? 'bg-green-500' : isCorrect === false ? 'bg-red-500' : 'bg-primary'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 gap-4">
          <button className="bg-white rounded-2xl px-5 py-2.5 flex items-center gap-2 shadow-sm border border-slate-100 active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-primary">volume_up</span>
            <span className="font-black text-primary text-sm">{currentTarget.word.toUpperCase()}</span>
          </button>
          {currentWordState.includes('') === false && isCorrect === null && (
            <button onClick={handleClear} className="bg-white rounded-2xl px-5 py-2.5 flex items-center gap-2 shadow-sm border border-slate-100 text-slate-400 active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-sm">refresh</span>
            </button>
          )}
        </div>
      </div>

      {/* Game Area - 增加安全边距，防止裁切 */}
      <div className="relative flex-1 flex items-center justify-center px-8 py-4">
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 w-full max-w-[320px]">
          {bubbles.map((bubble, idx) => (
            <div
              key={`${wordIndex}-${idx}`}
              onClick={() => handleLetterClick(bubble.letter)}
              className={`aspect-square flex items-center justify-center rounded-full bg-gradient-to-br ${bubble.color} bubble-glow border-[3px] border-white/60 shadow-xl cursor-pointer active:scale-90 ${bubble.offset} ${isCorrect === true ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <span className="text-white text-2xl font-black drop-shadow-md leading-none select-none">{bubble.letter}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <div className="px-6 mb-6 mt-auto">
        <button
          onClick={handleConfirm}
          disabled={currentWordState.includes('') || isCorrect === true}
          className={`w-full py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isCorrect === true
            ? 'bg-green-500 text-white shadow-[0_6px_0_0_#15803d]'
            : currentWordState.includes('')
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-primary text-white shadow-[0_6px_0_0_#c2410c]'
            }`}
        >
          {isCorrect === true ? (
            <><span className="material-symbols-outlined font-bold success-bounce">celebration</span><span>继续挑战</span></>
          ) : (
            <span>确定</span>
          )}
        </button>
      </div>

      {/* Mini Stats */}
      <div className="flex gap-4 p-4 pb-8">
        <div className="flex-1 rounded-3xl p-4 bg-white flex items-center gap-3 border border-slate-100 shadow-sm">
          <span className="material-symbols-outlined text-primary text-2xl fill-1">local_fire_department</span>
          <div><p className="text-[9px] font-bold opacity-40 uppercase">STREAK</p><p className="font-black text-lg">{12 + wordIndex}</p></div>
        </div>
        <div className="flex-1 rounded-3xl p-4 bg-white flex items-center gap-3 border border-slate-100 shadow-sm">
          <span className="material-symbols-outlined text-primary text-2xl fill-1">emoji_events</span>
          <div><p className="text-[9px] font-bold opacity-40 uppercase">RANK</p><p className="font-black text-lg">TOP 12</p></div>
        </div>
      </div>
    </div>
  );
};

export default LetterGameView;
