
import React from 'react';
import { Word, User } from '../types';

interface MapViewProps {
  user: User | null;
  onStartChallenge: () => void;
  onSelectWord: (word: Word) => void;
  onOpenWordBook: () => void;
  onStartLetterGame: () => void;
}

const MapView: React.FC<MapViewProps> = ({ user, onStartChallenge, onSelectWord, onOpenWordBook, onStartLetterGame }) => {
  // 使用传入的user或默认值
  const displayUser = user || {
    xp: 0,
    xpMax: 1000,
    stars: 0,
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative font-display select-none">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 3.1s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3.9s ease-in-out infinite reverse;
          animation-delay: 0.7s;
        }
        .animate-spin-slow {
          animation: rotate-slow 15s linear infinite;
        }
        /* 核心点击热区：巨大的透明感应区 */
        .game-hit-area {
          width: 180px;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 30;
          pointer-events: auto;
        }
        .game-hit-area:active {
          transform: scale(0.92) translate(-54%, -4%); /* 微调保持相对居中 */
        }
        .game-hit-area-side:active {
          transform: scale(0.92);
        }
        .cartoon-border {
          border-width: 4px;
          border-color: white;
          box-shadow: inset 0 4px 0 rgba(255,255,255,0.4), inset 0 -4px 0 rgba(0,0,0,0.1);
        }
      `}</style>

      {/* Header Stats */}
      <header className="absolute top-0 left-0 right-0 z-50 px-4 pt-6 pb-4 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b-2 border-white/50 pointer-events-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-rose-400 to-rose-500 rounded-full px-4 py-1.5 shadow-[0_3px_0_0_#be123c] border-2 border-white">
            <span className="material-symbols-outlined text-white text-lg fill-1">favorite</span>
            <span className="font-black text-white text-xs">5</span>
          </div>
          <div className="flex items-center gap-1.5 bg-gradient-to-b from-amber-300 to-amber-500 rounded-full pl-4 pr-1.5 py-1.5 shadow-[0_3px_0_0_#b45309] border-2 border-white">
            <span className="material-symbols-outlined text-white text-lg fill-1">stars</span>
            <span className="font-black text-white text-xs">{displayUser.stars.toLocaleString()}</span>
            <div className="bg-white/30 text-white rounded-full p-0.5 ml-1 flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] font-black">add</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1 ml-1">
            <div className="h-4 w-full bg-white/50 rounded-full overflow-hidden p-0.5 border border-white">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 relative" style={{ width: `${(displayUser.xp / displayUser.xpMax) * 100}%` }}>
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/30 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Map Content */}
      <main className="flex-1 overflow-hidden bg-[#e0f7fa]">
        <div className="h-full w-full relative" style={{ backgroundImage: "linear-gradient(to bottom, #b3e5fc 0%, #e1f5fe 20%, #f1f8e9 60%, #c8e6c9 100%)" }}>

          {/* Decorative elements - STRICTLY NO POINTER EVENTS */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 400 800">
              <path d="M 200 750 Q 350 680 200 600 T 200 450 T 250 280 T 150 100" fill="none" stroke="white" strokeWidth="16" strokeLinecap="round" strokeDasharray="10 15" />
            </svg>
          </div>

          <div className="absolute top-12 left-8 pointer-events-none opacity-50 text-orange-400"><span className="material-symbols-outlined text-3xl">home</span></div>
          <div className="absolute top-20 right-12 pointer-events-none opacity-50 text-emerald-400 animate-spin-slow"><span className="material-symbols-outlined text-4xl">mode_fan</span></div>
          <div className="absolute top-[55%] left-10 pointer-events-none opacity-50 text-emerald-300"><span className="material-symbols-outlined text-3xl">potted_plant</span></div>

          {/* Entry 1: 记忆大挑战 - 左下位置 */}
          <div
            onClick={onStartChallenge}
            className="absolute bottom-[15%] left-[10%] game-hit-area"
          >
            <div className="flex flex-col items-center pointer-events-none">
              <div className="relative animate-float">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-[2rem] cartoon-border flex items-center justify-center relative shadow-2xl">
                  <span className="material-symbols-outlined text-white text-4xl fill-1">psychology</span>
                </div>
                <div className="absolute -top-1 -right-1 bg-yellow-400 border-2 border-white rounded-full size-8 flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-white text-sm fill-1">bolt</span>
                </div>
              </div>
              <div className="mt-4 bg-indigo-600 px-5 py-1.5 rounded-full border-2 border-white shadow-lg">
                <p className="font-black text-white text-sm tracking-widest">记忆大挑战</p>
              </div>
            </div>
          </div>

          {/* Entry 2: 字母消消乐 - 右中位置 */}
          <div
            onClick={onStartLetterGame}
            className="absolute top-[45%] right-[10%] game-hit-area game-hit-area-side"
          >
            <div className="flex flex-col items-center pointer-events-none">
              <div className="relative animate-float-delayed">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-500 rounded-full cartoon-border flex items-center justify-center relative shadow-2xl">
                  <span className="material-symbols-outlined text-white text-4xl fill-1">extension</span>
                </div>
              </div>
              <div className="mt-3 bg-rose-500 px-5 py-1.5 rounded-full border-2 border-white shadow-lg">
                <p className="font-black text-white text-xs tracking-widest">字母消消乐</p>
              </div>
            </div>
          </div>

          {/* Entry 3: 单词魔法卡 - 左上位置（主要入口）*/}
          <div
            onClick={onOpenWordBook}
            className="absolute top-[18%] left-[15%] game-hit-area"
          >
            <div className="flex flex-col items-center pointer-events-none">
              <div className="relative animate-float">
                <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-3xl scale-150 animate-pulse" />
                <div className="w-28 h-28 bg-gradient-to-b from-amber-300 via-amber-400 to-orange-500 rounded-[2rem] p-1 border-[5px] border-white shadow-[0_6px_0_0_#b45309] relative z-10 flex items-center justify-center overflow-hidden">
                  <span className="material-symbols-outlined text-white text-6xl drop-shadow-lg fill-1">auto_stories</span>
                </div>
              </div>
              <div className="mt-5 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2 rounded-full shadow-xl border-2 border-white">
                <p className="font-black text-white text-base tracking-[0.1em]">单词魔法卡</p>
              </div>
            </div>
          </div>

          {/* Castle */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 group opacity-30 grayscale pointer-events-none">
            <div className="relative animate-float-delayed">
              <div className="w-24 h-24 bg-white/80 rounded-full flex items-center justify-center border-4 border-slate-200">
                <span className="material-symbols-outlined text-slate-300 text-4xl">castle</span>
              </div>
            </div>
            <p className="text-center font-black text-slate-400 mt-2 text-xs uppercase tracking-widest">英雄之巅</p>
          </div>
        </div>
      </main>

      {/* 移除底部任务卡片，给地图更多空间 */}
    </div>
  );
};

export default MapView;
