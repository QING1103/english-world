import { supabase, DbUser } from '../supabase';

/**
 * 用户服务 - 处理所有用户相关的数据库操作
 */

// 默认用户ID（简化版，实际应该使用认证）
export const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000001';

// 获取用户信息
export async function getUser(userId: string = DEFAULT_USER_ID): Promise<DbUser | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user:', error);
        return null;
    }

    return data;
}

// 更新用户信息
export async function updateUser(
    userId: string,
    updates: Partial<Omit<DbUser, 'id' | 'created_at' | 'updated_at'>>
): Promise<DbUser | null> {
    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating user:', error);
        throw error;
    }

    return data;
}

// 增加经验值
export async function addXP(userId: string, amount: number): Promise<DbUser | null> {
    const user = await getUser(userId);
    if (!user) return null;

    let newXP = user.xp + amount;
    let newLevel = user.level;
    let newXPMax = user.xp_max;

    // 检查是否升级
    while (newXP >= newXPMax) {
        newXP -= newXPMax;
        newLevel += 1;
        newXPMax = Math.floor(newXPMax * 1.2); // 每级经验增加20%
    }

    return updateUser(userId, {
        xp: newXP,
        level: newLevel,
        xp_max: newXPMax,
    });
}

// 增加星星
export async function addStars(userId: string, amount: number): Promise<DbUser | null> {
    const user = await getUser(userId);
    if (!user) return null;

    return updateUser(userId, {
        stars: user.stars + amount,
    });
}

// 增加已学单词数
export async function incrementLearnedWords(userId: string): Promise<DbUser | null> {
    const user = await getUser(userId);
    if (!user) return null;

    return updateUser(userId, {
        learned_words: user.learned_words + 1,
    });
}

// 增加成就点数
export async function addAchievements(userId: string, amount: number): Promise<DbUser | null> {
    const user = await getUser(userId);
    if (!user) return null;

    return updateUser(userId, {
        achievements: user.achievements + amount,
    });
}

// 更新用户昵称和头像
export async function updateProfile(
    userId: string,
    name?: string,
    avatar?: string
): Promise<DbUser | null> {
    const updates: Partial<DbUser> = {};
    if (name !== undefined) updates.name = name;
    if (avatar !== undefined) updates.avatar = avatar;

    return updateUser(userId, updates);
}
