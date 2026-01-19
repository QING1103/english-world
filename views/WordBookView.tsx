
import React, { useState } from 'react';
import { Word, User } from '../types';

interface WordBookViewProps {
  words: Word[];
  onSelectWord: (word: Word) => void;
  onBack: () => void;
}

const WordBookView: React.FC<WordBookViewProps> = ({ words, onSelectWord, onBack }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'learning' | 'mastered'>('new');

  // 根据状态过滤单词
  const filteredWords = words.filter(w => {
    if (activeTab === 'new') return w.status === 'new';
    return w.status === activeTab;
  });

  // 如果没有匹配的单词，显示所有单词
  const displayWords = filteredWords.length > 0 ? filteredWords : words;

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
      <header className="flex items-center p-6 pb-4 justify-between sticky top-0 bg-background-light dark:bg-background-dark z-10">
        <button onClick={onBack} className="flex size-12 items-center justify-center bg-white dark:bg-zinc-800 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[#1b140d] dark:text-white">arrow_back_ios_new</span>
        </button>
        <h2 className="text-2xl font-black text-primary">单词魔法卡</h2>
        <button className="flex size-12 items-center justify-center rounded-full bg-white dark:bg-zinc-800 shadow-sm">
          <span className="material-symbols-outlined text-primary">search</span>
        </button>
      </header>

      <nav className="px-4 py-4 sticky top-20 bg-background-light dark:bg-background-dark z-10">
        <div className="flex justify-between gap-3 overflow-x-auto pb-2">
          {(['new', 'learning', 'mastered'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex flex-col items-center justify-center py-3 px-4 rounded-full transition-all ${activeTab === tab
                  ? 'bg-primary text-white shadow-[0_4px_0_0_#d97706] translate-y-0.5'
                  : 'bg-white dark:bg-zinc-800 text-[#9a734c] shadow-sm'
                }`}
            >
              <p className="text-sm font-black tracking-wide">
                {tab === 'new' ? '新单词' : tab === 'learning' ? '学习中' : '已掌握'}
              </p>
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 p-4 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-32">
        {displayWords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="material-symbols-outlined text-6xl mb-4">sentiment_dissatisfied</span>
            <p className="text-lg font-bold">暂无单词</p>
          </div>
        ) : (
          displayWords.map((word, index) => (
            <div
              key={word.id}
              onClick={() => onSelectWord(word)}
              className={`group relative flex flex-col items-stretch justify-start rounded-xl border-4 border-primary p-4 shadow-xl transition-transform active:scale-95 cursor-pointer ${index === 0 ? 'bg-primary-yellow' : index === 1 ? 'bg-orange-100' : 'bg-emerald-100'
                }`}
            >
              {word.status === 'new' && (
                <div className="absolute -top-3 -left-2 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                  NEW!
                </div>
              )}
              <div className="flex gap-4">
                <div className="size-24 bg-white rounded-lg flex items-center justify-center overflow-hidden border-2 border-primary/20 shrink-0">
                  <img className="w-full h-full object-cover" src={word.imageUrl} alt={word.word} />
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <p className="text-[#1b140d] text-2xl font-black leading-tight">{word.word}</p>
                  <p className="text-primary font-bold text-sm tracking-wide">{word.pronunciation}</p>
                  {word.status === 'learning' ? (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-2 w-24 bg-white rounded-full overflow-hidden border border-primary/20">
                        <div className="bg-primary h-full" style={{ width: `${word.progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-primary">{word.progress}%</span>
                    </div>
                  ) : (
                    <p className="text-[#9a734c] text-lg font-bold mt-1">{word.meaning.split('。')[0].replace(/^[a-z]\.\s*/i, '')}</p>
                  )}
                </div>
                <div className="flex items-center">
                  <button className="size-12 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-primary text-3xl">volume_up</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default WordBookView;
