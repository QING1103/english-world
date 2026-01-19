import { useState, useEffect, useCallback } from 'react';
import { WordWithProgress } from '../supabase';
import { Word } from '../types';
import {
    getWordsWithProgress,
    updateProgress as updateWordProgress,
    toggleFavorite as toggleWordFavorite
} from '../services/wordService';
import { DEFAULT_USER_ID } from '../services/userService';

// 将数据库格式转换为前端格式
function dbWordToWord(dbWord: WordWithProgress): Word {
    return {
        id: dbWord.id,
        word: dbWord.word,
        pronunciation: dbWord.pronunciation,
        meaning: dbWord.meaning,
        grammar: dbWord.grammar || '',
        grammarTags: dbWord.grammar_tags || [],
        sentenceEn: dbWord.sentence_en || '',
        sentenceCn: dbWord.sentence_cn || '',
        sceneCn: dbWord.scene_cn || '',
        imageUrl: dbWord.image_url || '',
        mnemonic: dbWord.mnemonic || undefined,
        level: dbWord.level,
        progress: dbWord.progress,
        status: dbWord.status,
    };
}

interface UseWordsResult {
    words: Word[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    updateProgress: (wordId: string, progress: number, status: 'new' | 'learning' | 'mastered') => Promise<void>;
    toggleFavorite: (wordId: string) => Promise<boolean>;
}

export function useWords(): UseWordsResult {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchWords = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const dbWords = await getWordsWithProgress(DEFAULT_USER_ID);
            setWords(dbWords.map(dbWordToWord));
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch words'));
            console.error('Error fetching words:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchWords();
    }, [fetchWords]);

    const updateProgress = useCallback(async (
        wordId: string,
        progress: number,
        status: 'new' | 'learning' | 'mastered'
    ) => {
        try {
            await updateWordProgress(DEFAULT_USER_ID, wordId, progress, status);
            // 更新本地状态
            setWords(prev => prev.map(w =>
                w.id === wordId ? { ...w, progress, status } : w
            ));
        } catch (err) {
            console.error('Error updating progress:', err);
            throw err;
        }
    }, []);

    const toggleFavorite = useCallback(async (wordId: string): Promise<boolean> => {
        try {
            const newStatus = await toggleWordFavorite(DEFAULT_USER_ID, wordId);
            return newStatus;
        } catch (err) {
            console.error('Error toggling favorite:', err);
            throw err;
        }
    }, []);

    return {
        words,
        loading,
        error,
        refetch: fetchWords,
        updateProgress,
        toggleFavorite,
    };
}

// 按状态过滤的Hook
export function useWordsByStatus(status: 'new' | 'learning' | 'mastered') {
    const { words, loading, error, refetch } = useWords();

    const filteredWords = words.filter(w => w.status === status);

    return {
        words: filteredWords,
        loading,
        error,
        refetch,
    };
}

export default useWords;
