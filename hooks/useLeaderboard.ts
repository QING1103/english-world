import { useState, useEffect, useCallback } from 'react';
import {
    getLeaderboard,
    getUserRank,
    getGapToTop10,
    LeaderboardEntry
} from '../services/leaderboardService';
import { DEFAULT_USER_ID } from '../services/userService';

interface UseLeaderboardResult {
    entries: LeaderboardEntry[];
    loading: boolean;
    error: Error | null;
    userRank: number;
    gapToTop10: number;
    period: 'weekly' | 'monthly' | 'allTime';
    setPeriod: (period: 'weekly' | 'monthly' | 'allTime') => void;
    refetch: () => Promise<void>;
}

export function useLeaderboard(): UseLeaderboardResult {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [period, setPeriod] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
    const [userRank, setUserRank] = useState(0);
    const [gapToTop10, setGapToTop10] = useState(0);

    const fetchLeaderboard = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [leaderboardData, rank, gap] = await Promise.all([
                getLeaderboard(period),
                getUserRank(DEFAULT_USER_ID),
                getGapToTop10(DEFAULT_USER_ID),
            ]);

            setEntries(leaderboardData);
            setUserRank(rank);
            setGapToTop10(gap);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch leaderboard'));
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => {
        fetchLeaderboard();
    }, [fetchLeaderboard]);

    return {
        entries,
        loading,
        error,
        userRank,
        gapToTop10,
        period,
        setPeriod,
        refetch: fetchLeaderboard,
    };
}

export default useLeaderboard;
