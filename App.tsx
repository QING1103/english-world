
import React, { useState } from 'react';
import { View, Word } from './types';
import { useWords } from './hooks/useWords';
import { useUser } from './hooks/useUser';
import MapView from './views/MapView';
import WordDetailView from './views/WordDetailView';
import MemoryChallengeView from './views/MemoryChallengeView';
import WordBookView from './views/WordBookView';
import LeaderboardView from './views/LeaderboardView';
import ProfileView from './views/ProfileView';
import LetterGameView from './views/LetterGameView';
import SettingsView from './views/SettingsView';

// 加载组件
const LoadingScreen: React.FC = () => (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-primary font-bold text-lg">魔法加载中...</p>
    </div>
  </div>
);

// 错误组件
const ErrorScreen: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6">
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="material-symbols-outlined text-6xl text-red-400">error</span>
      <p className="text-red-500 font-bold text-lg">加载失败</p>
      <p className="text-gray-500 text-sm">{error.message}</p>
      <button
        onClick={onRetry}
        className="mt-4 px-6 py-3 bg-primary text-white rounded-full font-bold active:scale-95 transition-transform"
      >
        重试
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.MAP);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  // 使用Hooks获取数据
  const { words, loading: wordsLoading, error: wordsError, refetch: refetchWords, updateProgress } = useWords();
  const { user, loading: userLoading, error: userError, refetch: refetchUser, addXP, addStars } = useUser();

  // 初始化选中的单词
  React.useEffect(() => {
    if (words.length > 0 && !selectedWord) {
      setSelectedWord(words[0]);
    }
  }, [words, selectedWord]);

  const navigateToWord = (word: Word) => {
    setSelectedWord(word);
    setCurrentView(View.WORD_DETAIL);
  };

  const handleNextWord = async () => {
    if (!selectedWord) return;
    const currentIndex = words.findIndex(w => w.id === selectedWord.id);

    // 更新当前单词进度
    try {
      await updateProgress(selectedWord.id, 100, 'mastered');
      await addXP(50); // 每学会一个单词加50经验
      await addStars(10); // 加10星星
    } catch (err) {
      console.error('Error updating progress:', err);
    }

    if (currentIndex < words.length - 1) {
      setSelectedWord(words[currentIndex + 1]);
    } else {
      setCurrentView(View.MAP);
    }
  };

  // 显示加载状态
  if (wordsLoading || userLoading) {
    return <LoadingScreen />;
  }

  // 显示错误状态
  if (wordsError || userError) {
    return (
      <ErrorScreen
        error={wordsError || userError!}
        onRetry={() => {
          refetchWords();
          refetchUser();
        }}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case View.MAP:
        return (
          <MapView
            user={user}
            onStartChallenge={() => setCurrentView(View.CHALLENGE)}
            onSelectWord={navigateToWord}
            onOpenWordBook={() => setCurrentView(View.WORD_BOOK)}
            onStartLetterGame={() => setCurrentView(View.LETTER_GAME)}
          />
        );
      case View.WORD_DETAIL:
        return selectedWord ? (
          <WordDetailView
            word={selectedWord}
            onBack={() => setCurrentView(View.MAP)}
            onNext={handleNextWord}
          />
        ) : null;
      case View.CHALLENGE:
        return (
          <MemoryChallengeView
            words={words}
            word={selectedWord || words[0]}
            onBack={() => setCurrentView(View.MAP)}
          />
        );
      case View.LETTER_GAME:
        return (
          <LetterGameView
            words={words}
            onBack={() => setCurrentView(View.MAP)}
          />
        );
      case View.WORD_BOOK:
        return (
          <WordBookView
            words={words}
            onSelectWord={navigateToWord}
            onBack={() => setCurrentView(View.MAP)}
          />
        );
      case View.LEADERBOARD:
        return <LeaderboardView onBack={() => setCurrentView(View.MAP)} />;
      case View.PROFILE:
        return (
          <ProfileView
            user={user}
            onBack={() => setCurrentView(View.MAP)}
            onOpenSettings={() => setCurrentView(View.SETTINGS)}
          />
        );
      case View.SETTINGS:
        return <SettingsView onBack={() => setCurrentView(View.PROFILE)} onLogout={() => setCurrentView(View.MAP)} />;
      default:
        return (
          <MapView
            user={user}
            onStartChallenge={() => setCurrentView(View.CHALLENGE)}
            onSelectWord={navigateToWord}
            onOpenWordBook={() => setCurrentView(View.WORD_BOOK)}
            onStartLetterGame={() => setCurrentView(View.LETTER_GAME)}
          />
        );
    }
  };

  const isGameView = currentView === View.WORD_DETAIL || currentView === View.CHALLENGE || currentView === View.LETTER_GAME || currentView === View.SETTINGS;

  return (
    <div className="max-w-[393px] mx-auto min-h-screen bg-background-light dark:bg-background-dark shadow-[0_0_50px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col border-x border-slate-100 dark:border-zinc-800">
      {renderView()}

      {/* Bottom Navigation Bar */}
      {!isGameView && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 px-4 py-3 pb-8 flex justify-between items-center z-50">
          <button
            onClick={() => setCurrentView(View.MAP)}
            className={`flex flex-col items-center flex-1 transition-all active:scale-90 ${currentView === View.MAP ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentView === View.MAP ? 'fill-1' : ''}`}>home</span>
            <span className="text-[10px] font-bold mt-1">首页</span>
          </button>
          <button
            onClick={() => setCurrentView(View.WORD_BOOK)}
            className={`flex flex-col items-center flex-1 transition-all active:scale-90 ${currentView === View.WORD_BOOK ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentView === View.WORD_BOOK ? 'fill-1' : ''}`}>style</span>
            <span className="text-[10px] font-bold mt-1 text-center leading-tight">魔法卡</span>
          </button>
          <button
            onClick={() => setCurrentView(View.PROFILE)}
            className={`flex flex-col items-center flex-1 transition-all active:scale-90 ${currentView === View.PROFILE ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentView === View.PROFILE ? 'fill-1' : ''}`}>shield</span>
            <span className="text-[10px] font-bold mt-1">基地</span>
          </button>
          <button
            onClick={() => setCurrentView(View.LEADERBOARD)}
            className={`flex flex-col items-center flex-1 transition-all active:scale-90 ${currentView === View.LEADERBOARD ? 'text-primary' : 'text-slate-400'}`}
          >
            <span className={`material-symbols-outlined text-2xl ${currentView === View.LEADERBOARD ? 'fill-1' : ''}`}>leaderboard</span>
            <span className="text-[10px] font-bold mt-1">排行</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
