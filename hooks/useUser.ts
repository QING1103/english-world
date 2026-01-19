import { useState, useEffect, useCallback } from 'react';
import { DbUser } from '../supabase';
import { User } from '../types';
import {
    getUser,
    addXP as addUserXP,
    addStars as addUserStars,
    DEFAULT_USER_ID
} from '../services/userService';

// 将数据库格式转换为前端格式
function dbUserToUser(dbUser: DbUser): User {
    return {
        id: dbUser.id,
        name: dbUser.name,
        avatar: dbUser.avatar,
        level: dbUser.level,
        xp: dbUser.xp,
        xpMax: dbUser.xp_max,
        stars: dbUser.stars,
        achievements: dbUser.achievements,
        learnedWords: dbUser.learned_words,
        rank: 0, // 排名需要单独获取
    };
}

interface UseUserResult {
    user: User | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    addXP: (amount: number) => Promise<void>;
    addStars: (amount: number) => Promise<void>;
}

export function useUser(userId: string = DEFAULT_USER_ID): UseUserResult {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const dbUser = await getUser(userId);
            if (dbUser) {
                setUser(dbUserToUser(dbUser));
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch user'));
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const addXP = useCallback(async (amount: number) => {
        try {
            const updatedUser = await addUserXP(userId, amount);
            if (updatedUser) {
                setUser(dbUserToUser(updatedUser));
            }
        } catch (err) {
            console.error('Error adding XP:', err);
            throw err;
        }
    }, [userId]);

    const addStars = useCallback(async (amount: number) => {
        try {
            const updatedUser = await addUserStars(userId, amount);
            if (updatedUser) {
                setUser(dbUserToUser(updatedUser));
            }
        } catch (err) {
            console.error('Error adding stars:', err);
            throw err;
        }
    }, [userId]);

    return {
        user,
        loading,
        error,
        refetch: fetchUser,
        addXP,
        addStars,
    };
}

export default useUser;
