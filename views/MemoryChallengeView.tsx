
import React, { useState } from 'react';
import { Word } from '../types';

interface MemoryChallengeViewProps {
  words: Word[];
  word: Word;
  onBack: () => void;
}

const MemoryChallengeView: React.FC<MemoryChallengeViewProps> = ({ words, word: initialWord, onBack }) => {
  // Find initial index
  const initialIndex = words.findIndex(w => w.id === initialWord.id);
  const [currentIndex, setCurrentIndex] = useState(initialIndex !== -1 ? initialIndex : 0);

  const currentWord = words[currentIndex] || initialWord;
  const isLastWord = currentIndex === words.length - 1;

  const handleNext = () => {
    if (!isLastWord) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // If last word, go back to map or show completion
      onBack();
    }
  };

  const handleForgot = () => {
    // Visual feedback or logic for "didn't remember"
    // For now, we'll just keep the user on this word to study more
    console.log("User didn't remember:", currentWord.word);
  };

  // Extract a clean meaning for display
  const displayMeaning = currentWord.meaning.split('。')[0].replace(/^[a-z]\. /i, '');

  return (
    <div className="flex-1 flex flex-col bg-[#fffdf2] dark:bg-background-dark">
      {/* Header */}
      <div className="w-full max-w-md flex items-center p-6 pb-2 justify-between">
        <button onClick={onBack} className="bg-white dark:bg-zinc-800 size-12 rounded-full flex items-center justify-center shadow-sm text-primary active:scale-90 transition-transform">
          <span className="material-symbols-outlined font-bold">arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#4a3a2a] dark:text-white text-xl font-bold flex-1 text-center">记忆大挑战</h2>
        <div className="flex w-12 items-center justify-end">
          <div className="bg-primary/10 px-3 py-1 rounded-full">
            <p className="text-primary text-sm font-bold">{currentIndex + 1}/{words.length}</p>
          </div>
        </div>
      </div>

      <main className="w-full flex-1 flex flex-col items-center justify-center px-6 gap-6 pt-2">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-stretch justify-start rounded-[3rem] bg-white dark:bg-zinc-800 border-4 border-white dark:border-zinc-700 overflow-hidden shadow-2xl transition-all duration-300">
            <div className="relative w-full bg-[#fcf9ee] dark:bg-zinc-900 aspect-square flex items-center justify-center p-8 overflow-hidden m-2 rounded-[2.5rem] border border-orange-50/50 self-center">
              <div
                className="w-full h-full bg-center bg-no-repeat bg-contain transition-all duration-500"
                style={{ backgroundImage: `url("${currentWord.imageUrl}")` }}
              />
              <button className="absolute bottom-4 right-4 bg-primary text-white size-14 rounded-full squishy-button flex items-center justify-center shadow-[0_4px_0_#d17b26]">
                <span className="material-symbols-outlined text-3xl">volume_up</span>
              </button>
            </div>
            <div className="flex w-full grow flex-col items-center justify-center gap-2 py-8 px-6 text-center">
              <h1 className="text-[#1b140d] dark:text-white text-5xl font-bold tracking-tight">{currentWord.word}</h1>
              <div className="flex flex-col gap-1">
                <p className="text-primary text-xl font-medium">{currentWord.pronunciation}</p>
                <p className="text-[#9a734c] dark:text-zinc-400 text-2xl font-bold mt-2">{displayMeaning}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex gap-4 px-2 mb-4">
          <button
            onClick={handleForgot}
            className="flex-1 squishy-button h-16 rounded-full bg-white dark:bg-zinc-700 border-b-4 border-zinc-200 dark:border-zinc-800 text-red-500 dark:text-red-400 text-xl font-bold flex items-center justify-center"
          >
            记不住
          </button>
          <button
            onClick={handleNext}
            className="flex-1 squishy-button h-16 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center shadow-[0_4px_0_#d17b26]"
          >
            {isLastWord ? '完成挑战' : '记住了'}
          </button>
        </div>
      </main>

      {/* Mnemonic Footer */}
      <footer className="w-full pb-8 px-6">
        <div className="flex flex-col gap-4 bg-white dark:bg-zinc-800 p-6 rounded-[2rem] shadow-sm border border-orange-50/30">
          <div className="flex items-start gap-3">
            <div className="size-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-3xl">lightbulb</span>
            </div>
            <div className="flex-1">
              <p className="text-[#4a3a2a] dark:text-zinc-200 text-base font-bold mb-1">记忆方法</p>
              <div className="space-y-1.5 transition-all duration-300">
                <p className="text-[#9a734c] dark:text-zinc-400 text-sm leading-relaxed">
                  <span className="text-primary font-bold">【方法】</span> {currentWord.mnemonic?.split('】')[1] || '通过图片和发音联想记忆'}
                </p>
                <p className="text-[#9a734c] dark:text-zinc-400 text-sm leading-relaxed">
                  <span className="text-primary font-bold">【例句】</span> {currentWord.sentenceEn}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MemoryChallengeView;
