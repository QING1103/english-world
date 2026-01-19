
import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { DEFAULT_USER_ID } from '../services/userService';

interface LeaderboardViewProps {
  onBack: () => void;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ onBack }) => {
  const {
    entries,
    loading,
    error,
    period,
    setPeriod,
    userRank,
    gapToTop10
  } = useLeaderboard();

  // 获取前3名和其他人
  const top3 = entries.slice(0, 3);
  const others = entries.slice(3);

  // 加载状态
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark p-6">
        <span className="material-symbols-outlined text-4xl text-red-400 mb-4">error</span>
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  // 如果数据不足，使用默认值填充
  while (top3.length < 3) {
    top3.push({ id: `placeholder-${top3.length}`, name: '虚位以待', avatar: '', stars: 0, rank: top3.length + 1 });
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-[#1c1c0d] dark:text-white pb-40">
      {/* Header */}
      <div className="flex items-center p-4 pb-2 sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
        <button onClick={onBack} className="text-[#1c1c0d] dark:text-white flex size-10 items-center justify-center active:scale-90">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <h2 className="text-lg font-extrabold flex-1 text-center">星级排行榜</h2>
        <div className="flex w-10 items-center justify-end">
          <button className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-[#1c1c0d] dark:text-primary">
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 py-2">
        <div className="flex bg-white/50 dark:bg-white/5 p-1 rounded-full border border-[#e9e8ce] dark:border-white/10">
          <button
            onClick={() => setPeriod('weekly')}
            className={`flex items-center justify-center h-9 rounded-full flex-1 font-bold text-xs transition-all ${period === 'weekly' ? 'bg-primary-yellow text-[#1c1c0d] shadow-sm' : 'text-[#9e9d47] dark:text-gray-400'}`}
          >
            本周
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`flex items-center justify-center h-9 rounded-full flex-1 font-bold text-xs transition-all ${period === 'monthly' ? 'bg-primary-yellow text-[#1c1c0d] shadow-sm' : 'text-[#9e9d47] dark:text-gray-400'}`}
          >
            本月
          </button>
          <button
            onClick={() => setPeriod('allTime')}
            className={`flex items-center justify-center h-9 rounded-full flex-1 font-bold text-xs transition-all ${period === 'allTime' ? 'bg-primary-yellow text-[#1c1c0d] shadow-sm' : 'text-[#9e9d47] dark:text-gray-400'}`}
          >
            总榜
          </button>
        </div>
      </div>

      {/* Podium Section */}
      <div className="relative mt-4 mb-4 px-4 h-[280px] flex items-end justify-center gap-1 animate-in fade-in duration-500">
        {/* 2nd Place */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-full border-[3px] border-gray-300 overflow-hidden bg-cover bg-center bg-gray-200" style={{ backgroundImage: top3[1].avatar ? `url("${top3[1].avatar}")` : 'none' }} />
            <div className="absolute -top-1 -right-1 bg-gray-300 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">2</div>
          </div>
          <p className="text-[10px] font-bold truncate w-full text-center">{top3[1].name}</p>
          <div className="flex items-center text-[#9e9d47] text-[10px] font-bold mb-1">
            {top3[1].stars.toLocaleString()} ⭐
          </div>
          <div className="podium-gradient-2 w-full h-20 rounded-t-xl flex items-center justify-center shadow-lg bg-gradient-to-b from-gray-400 to-gray-500">
            <span className="text-white/50 font-black text-2xl">2</span>
          </div>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center flex-1 z-10 scale-105 origin-bottom">
          <div className="relative mb-3">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-primary-yellow animate-bounce">
              <span className="material-symbols-outlined text-3xl fill-1">emoji_events</span>
            </div>
            <div className="w-20 h-20 rounded-full border-[4px] border-primary-yellow overflow-hidden bg-cover bg-center ring-4 ring-primary-yellow/20 bg-gray-200" style={{ backgroundImage: top3[0].avatar ? `url("${top3[0].avatar}")` : 'none' }} />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary-yellow text-[#1c1c0d] rounded-full px-2 py-0.5 flex items-center justify-center text-[10px] font-black shadow-md">TOP 1</div>
          </div>
          <p className="text-xs font-black truncate w-full text-center mb-1">{top3[0].name}</p>
          <div className="flex items-center text-yellow-600 text-[10px] font-bold mb-2">
            {top3[0].stars.toLocaleString()} ⭐
          </div>
          <div className="podium-gradient-1 w-full h-32 rounded-t-xl flex flex-col items-center justify-center shadow-2xl relative overflow-hidden bg-gradient-to-b from-yellow-400 to-amber-500">
            <span className="text-[#1c1c0d]/30 font-black text-4xl relative z-10">1</span>
          </div>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-full border-[3px] border-orange-300 overflow-hidden bg-cover bg-center bg-gray-200" style={{ backgroundImage: top3[2].avatar ? `url("${top3[2].avatar}")` : 'none' }} />
            <div className="absolute -top-1 -right-1 bg-orange-300 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">3</div>
          </div>
          <p className="text-[10px] font-bold truncate w-full text-center">{top3[2].name}</p>
          <div className="flex items-center text-[#9e9d47] text-[10px] font-bold mb-1">
            {top3[2].stars.toLocaleString()} ⭐
          </div>
          <div className="podium-gradient-3 w-full h-14 rounded-t-xl flex items-center justify-center shadow-lg bg-gradient-to-b from-orange-300 to-orange-400">
            <span className="text-white/50 font-black text-xl">3</span>
          </div>
        </div>
      </div>

      {/* List Section */}
      <div className="bg-white dark:bg-white/5 rounded-t-[2rem] p-4 flex-1 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <h3 className="text-base font-bold pb-4 pt-2">好友排行</h3>
        <div className="flex flex-col gap-3">
          {others.map((user) => (
            <div key={`${period}-${user.rank}`} className="flex items-center bg-primary-yellow/10 dark:bg-white/5 p-2.5 rounded-full border border-primary-yellow/20 dark:border-white/10">
              <div className="w-6 text-center font-bold text-[#9e9d47] text-xs">{user.rank}</div>
              <div className="size-9 rounded-full bg-cover bg-center ml-2 border-2 border-white dark:border-gray-700 bg-gray-200" style={{ backgroundImage: user.avatar ? `url("${user.avatar}")` : 'none' }} />
              <div className="flex-1 ml-3 overflow-hidden">
                <p className="text-xs font-bold truncate">{user.name}</p>
              </div>
              <div className="flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-yellow-500 text-base">star</span>
                <span className="text-xs">{user.stars.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky My Rank - Width Locked */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[361px] bg-primary-yellow shadow-xl rounded-full p-3 flex items-center z-40 border-2 border-white">
        <div className="w-8 text-center font-black text-[#1c1c0d] text-sm">{userRank}</div>
        <div className="size-9 rounded-full bg-cover bg-center border-2 border-white ml-1 bg-gray-200" style={{ backgroundImage: entries[0]?.avatar ? `url("${entries[0].avatar}")` : 'none' }} />
        <div className="flex-1 ml-3">
          <p className="text-xs font-black text-[#1c1c0d]">我的排名</p>
          <p className="text-[9px] text-[#1c1c0d]/70 font-bold">距离前十还差 {gapToTop10} ⭐</p>
        </div>
        <div className="flex items-center gap-1 font-black text-[#1c1c0d] mr-2">
          <span className="material-symbols-outlined text-base fill-1">star</span>
          <span className="text-sm">{entries.find(e => e.rank === userRank)?.stars.toLocaleString() || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardView;
