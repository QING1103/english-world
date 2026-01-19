import { supabase, DbUser } from '../supabase';

/**
 * 排行榜服务 - 处理排行榜相关的数据库操作
 */

export interface LeaderboardEntry {
    id: string;
    name: string;
    avatar: string;
    stars: number;
    rank: number;
}

// 获取排行榜
export async function getLeaderboard(
    period: 'weekly' | 'monthly' | 'allTime' = 'weekly',
    limit: number = 10
): Promise<LeaderboardEntry[]> {
    // 注意：简化版实现，实际生产环境应该根据时间段过滤
    // 这里我们根据不同时间段对星星数做简单调整来模拟

    const { data, error } = await supabase
        .from('users')
        .select('id, name, avatar, stars')
        .order('stars', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }

    // 根据不同时间段调整数据
    const entries = (data || []).map((user, index) => {
        let adjustedStars = user.stars;

        if (period === 'monthly') {
            adjustedStars = Math.floor(user.stars * 0.8);
        } else if (period === 'weekly') {
            adjustedStars = Math.floor(user.stars * 0.3);
        }

        return {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            stars: adjustedStars,
            rank: index + 1,
        };
    });

    // 按调整后的星星重新排序
    return entries.sort((a, b) => b.stars - a.stars).map((e, i) => ({
        ...e,
        rank: i + 1,
    }));
}

// 获取用户排名
export async function getUserRank(userId: string): Promise<number> {
    const { data, error } = await supabase
        .from('users')
        .select('id, stars')
        .order('stars', { ascending: false });

    if (error) {
        console.error('Error fetching user rank:', error);
        throw error;
    }

    const userIndex = (data || []).findIndex(u => u.id === userId);
    return userIndex === -1 ? -1 : userIndex + 1;
}

// 获取用户到前10名的差距
export async function getGapToTop10(userId: string): Promise<number> {
    const { data, error } = await supabase
        .from('users')
        .select('id, stars')
        .order('stars', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching gap:', error);
        throw error;
    }

    if (!data || data.length < 10) {
        return 0;
    }

    // 获取当前用户的星星数
    const { data: userData } = await supabase
        .from('users')
        .select('stars')
        .eq('id', userId)
        .single();

    if (!userData) {
        return 0;
    }

    // 第10名的星星数
    const top10Stars = data[9].stars;
    const gap = top10Stars - userData.stars;

    return gap > 0 ? gap : 0;
}
