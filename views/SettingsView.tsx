
import React, { useState } from 'react';

interface SettingsViewProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, onLogout }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark min-h-screen animate-in fade-in slide-in-from-right duration-300">
      <header className="flex items-center p-6 pb-2 justify-between sticky top-0 bg-background-light/80 dark:bg-zinc-900/80 backdrop-blur-md z-20">
        <button onClick={onBack} className="flex size-12 items-center justify-center bg-white dark:bg-zinc-800 rounded-full shadow-sm text-[#1b140d] dark:text-white">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-[#1b140d] dark:text-white text-xl font-bold flex-1 text-center">英雄设置</h2>
        <div className="w-12"></div>
      </header>

      <main className="p-6 space-y-8 overflow-y-auto no-scrollbar">
        {/* Account Section */}
        <div className="space-y-4">
          <h3 className="text-primary font-black uppercase tracking-widest text-sm ml-2">账号与资料</h3>
          <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] p-2 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-700/50 rounded-[2rem] transition-colors">
              <div className="size-12 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">person_edit</span>
              </div>
              <span className="flex-1 font-bold text-[#1b140d] dark:text-white text-left">修改昵称和头像</span>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-700/50 rounded-[2rem] transition-colors">
              <div className="size-12 rounded-2xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-500 text-2xl">shield_person</span>
              </div>
              <span className="flex-1 font-bold text-[#1b140d] dark:text-white text-left">英雄身份认证</span>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h3 className="text-primary font-black uppercase tracking-widest text-sm ml-2">通用偏好</h3>
          <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] p-2 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <div className="w-full flex items-center gap-4 p-4">
              <div className="size-12 rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-500 text-2xl">notifications_active</span>
              </div>
              <span className="flex-1 font-bold text-[#1b140d] dark:text-white text-left">每日学习提醒</span>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-8 rounded-full relative transition-colors ${notifications ? 'bg-primary' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 size-6 bg-white rounded-full transition-all ${notifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <div className="w-full flex items-center gap-4 p-4">
              <div className="size-12 rounded-2xl bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-500 text-2xl">dark_mode</span>
              </div>
              <span className="flex-1 font-bold text-[#1b140d] dark:text-white text-left">暗黑模式</span>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-8 rounded-full relative transition-colors ${darkMode ? 'bg-primary' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 size-6 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-700/50 rounded-[2rem] transition-colors">
              <div className="size-12 rounded-2xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-500 text-2xl">language</span>
              </div>
              <span className="flex-1 font-bold text-[#1b140d] dark:text-white text-left">显示语言</span>
              <span className="font-bold text-primary text-sm mr-2">简体中文</span>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="space-y-4">
          <h3 className="text-primary font-black uppercase tracking-widest text-sm ml-2">帮助与支持</h3>
          <div className="bg-white dark:bg-zinc-800 rounded-[2.5rem] p-2 shadow-sm border border-slate-100 dark:border-slate-700/50">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-700/50 rounded-[2rem] transition-colors">
              <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-400 text-2xl">help</span>
              </div>
              <span className="flex-1 font-bold text-[#1b140d] dark:text-white text-left">常见问题</span>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-700/50 rounded-[2rem] transition-colors">
              <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-900/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500 text-2xl">feedback</span>
              </div>
              <span className="flex-1 font-bold text-[#1b140d] dark:text-white text-left">意见反馈</span>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="pt-6">
          <button 
            onClick={onLogout}
            className="w-full h-16 rounded-[2rem] bg-red-50 dark:bg-red-900/10 text-red-500 font-black text-lg border-2 border-red-100 dark:border-red-900/30 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>退出当前账号</span>
          </button>
          <p className="text-center text-slate-300 dark:text-zinc-600 text-xs mt-6 font-bold uppercase tracking-[0.3em]">Version 2.4.0 (Super Hero Edition)</p>
        </div>
      </main>
    </div>
  );
};

export default SettingsView;
