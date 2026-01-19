
import React from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User | null;
  onBack: () => void;
  onOpenSettings: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack, onOpenSettings }) => {
  // 使用传入的user或默认值
  const displayUser = user || {
    name: '小小英雄',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=hero',
    level: 1,
    learnedWords: 0,
    achievements: 0,
  };

  return (
    <div className="flex-1 flex flex-col bg-[#fdfaf7] dark:bg-background-dark min-h-screen">
      <div className="sticky top-0 z-50 flex items-center bg-[#fdfaf7]/80 dark:bg-zinc-900/80 backdrop-blur-md p-4 pb-2 justify-between">
        <button onClick={onBack} className="flex size-12 items-center justify-start">
          <span className="material-symbols-outlined text-[#1b140d] dark:text-white text-3xl">chevron_left</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-white text-xl font-bold flex-1 text-center">我的英雄基地</h2>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={onOpenSettings}
            className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-primary active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl fill-1">settings</span>
          </button>
        </div>
      </div>

      <main className="max-w-md mx-auto pb-32 overflow-y-auto no-scrollbar">
        <div className="flex p-6">
          <div className="flex w-full flex-col gap-6 items-center">
            <div className="flex gap-4 flex-col items-center relative">
              <div className="relative p-1 rounded-full border-[6px] border-[#ee8c2b] shadow-xl">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-40 w-40 border-4 border-white shadow-inner" style={{ backgroundImage: `url("${displayUser.avatar}")` }} />
                <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-sm font-bold">edit</span>
                </button>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-[#1b140d] dark:text-white text-3xl font-black text-center">{displayUser.name}</p>
                <div className="mt-2 px-6 py-1.5 bg-[#fef2e5] dark:bg-zinc-800 rounded-full border border-primary/20">
                  <p className="text-primary text-sm font-bold text-center">等级: LV.{displayUser.level} 超能翻译官</p>
                </div>
              </div>
            </div>
            <div className="w-full flex gap-3 px-4">
              <button className="flex-1 flex items-center justify-center rounded-full h-14 px-6 bg-primary text-white text-lg font-bold shadow-lg active:scale-95 transition-transform">
                <span>定制英雄战袍</span>
              </button>
              <button className="flex size-14 items-center justify-center rounded-full bg-orange-50 dark:bg-zinc-800 text-primary border border-primary/10 shadow-sm">
                <span className="material-symbols-outlined text-2xl">share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 px-6">
          <div className="flex-1 flex flex-col gap-1 rounded-[3rem] p-6 bg-white dark:bg-zinc-800 border-2 border-[#fef2e5] dark:border-zinc-700 shadow-sm relative overflow-hidden h-32 justify-center">
            <div className="absolute right-[-10px] top-[-10px] opacity-10 text-primary">
              <span className="material-symbols-outlined text-7xl">menu_book</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm font-bold">已学单词</p>
            <p className="text-primary tracking-tight text-4xl font-black">{displayUser.learnedWords.toLocaleString()}</p>
          </div>
          <div className="flex-1 flex flex-col gap-1 rounded-[3rem] p-6 bg-primary shadow-xl shadow-orange-200 dark:shadow-none relative overflow-hidden h-32 justify-center">
            <div className="absolute right-[-10px] top-[-10px] opacity-20 text-white">
              <span className="material-symbols-outlined text-7xl">stars</span>
            </div>
            <p className="text-white/80 text-sm font-bold">成就点数</p>
            <p className="text-white tracking-tight text-4xl font-black">{displayUser.achievements.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-4 pt-10">
          <h2 className="text-[#1b140d] dark:text-white text-2xl font-black">荣誉陈列室</h2>
          <button className="text-primary text-sm font-bold">查看全部</button>
        </div>

        <div className="grid grid-cols-2 gap-6 px-6">
          {[
            { name: '初级学者', icon: 'school' },
            { name: '勤奋小蜂', icon: 'emoji_events' },
            { name: '词汇大师', icon: 'auto_awesome' },
            { name: '未解锁', icon: 'lock', locked: true }
          ].map((achievement, i) => (
            <div key={i} className={`flex flex-col items-center gap-4 rounded-[3rem] p-8 shadow-sm border-2 ${achievement.locked ? 'bg-gray-50 dark:bg-zinc-900 border-dashed border-gray-200 dark:border-zinc-700' : 'bg-white dark:bg-zinc-800 border-orange-50 dark:border-zinc-700'}`}>
              <div className={`${achievement.locked ? 'bg-gray-100 dark:bg-zinc-700' : 'bg-[#fef2e5] dark:bg-zinc-700/50'} rounded-full p-5`}>
                <span className={`material-symbols-outlined text-5xl ${achievement.locked ? 'text-gray-400' : 'text-primary fill-1'}`}>{achievement.icon}</span>
              </div>
              <p className={`text-lg font-bold ${achievement.locked ? 'text-gray-400' : 'text-[#1b140d] dark:text-white'}`}>{achievement.name}</p>
            </div>
          ))}
        </div>

        <div className="px-6 mt-8 space-y-4">
          <button className="w-full flex items-center gap-4 p-5 bg-white dark:bg-zinc-800 rounded-[2rem] border border-orange-50 dark:border-zinc-700 shadow-sm">
            <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-500 text-2xl">history_edu</span>
            </div>
            <span className="flex-1 font-bold text-lg text-[#1b140d] dark:text-white text-left">英雄任务史</span>
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </button>
          <button className="w-full flex items-center gap-4 p-5 bg-white dark:bg-zinc-800 rounded-[2rem] border border-orange-50 dark:border-zinc-700 shadow-sm">
            <div className="size-12 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-purple-500 text-2xl">group</span>
            </div>
            <span className="flex-1 font-bold text-lg text-[#1b140d] dark:text-white text-left">英雄盟友</span>
            <span className="material-symbols-outlined text-gray-300">chevron_right</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileView;
