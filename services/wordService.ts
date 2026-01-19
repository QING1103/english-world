import { supabase, DbWord, WordWithProgress } from '../supabase';

/**
 * 单词服务 - 处理所有单词相关的数据库操作
 */

// 获取所有单词
export async function getAllWords(): Promise<DbWord[]> {
    const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching words:', error);
        throw error;
    }

    return data || [];
}

// 获取带用户进度的单词列表
export async function getWordsWithProgress(userId: string): Promise<WordWithProgress[]> {
    // 先获取所有单词
    const { data: words, error: wordsError } = await supabase
        .from('words')
        .select('*')
        .order('created_at', { ascending: true });

    if (wordsError) {
        console.error('Error fetching words:', wordsError);
        throw wordsError;
    }

    // 获取用户的学习进度
    const { data: progress, error: progressError } = await supabase
        .from('user_word_progress')
        .select('*')
        .eq('user_id', userId);

    if (progressError) {
        console.error('Error fetching progress:', progressError);
        throw progressError;
    }

    // 合并单词和进度数据
    const progressMap = new Map(
        (progress || []).map(p => [p.word_id, p])
    );

    return (words || []).map(word => {
        const userProgress = progressMap.get(word.id);
        return {
            ...word,
            progress: userProgress?.progress ?? 0,
            status: userProgress?.status ?? 'new',
            is_favorite: userProgress?.is_favorite ?? false,
        };
    });
}

// 获取单个单词
export async function getWord(wordId: string): Promise<DbWord | null> {
    const { data, error } = await supabase
        .from('words')
        .select('*')
        .eq('id', wordId)
        .single();

    if (error) {
        console.error('Error fetching word:', error);
        return null;
    }

    return data;
}

// 更新学习进度
export async function updateProgress(
    userId: string,
    wordId: string,
    progress: number,
    status: 'new' | 'learning' | 'mastered'
): Promise<void> {
    const { error } = await supabase
        .from('user_word_progress')
        .upsert({
            user_id: userId,
            word_id: wordId,
            progress,
            status,
            last_reviewed_at: new Date().toISOString(),
        }, {
            onConflict: 'user_id,word_id'
        });

    if (error) {
        console.error('Error updating progress:', error);
        throw error;
    }
}

// 切换收藏状态
export async function toggleFavorite(
    userId: string,
    wordId: string
): Promise<boolean> {
    // 先获取当前状态
    const { data: existing } = await supabase
        .from('user_word_progress')
        .select('is_favorite')
        .eq('user_id', userId)
        .eq('word_id', wordId)
        .single();

    const newFavoriteStatus = !(existing?.is_favorite ?? false);

    const { error } = await supabase
        .from('user_word_progress')
        .upsert({
            user_id: userId,
            word_id: wordId,
            is_favorite: newFavoriteStatus,
        }, {
            onConflict: 'user_id,word_id'
        });

    if (error) {
        console.error('Error toggling favorite:', error);
        throw error;
    }

    return newFavoriteStatus;
}

// 按状态获取单词
export async function getWordsByStatus(
    userId: string,
    status: 'new' | 'learning' | 'mastered'
): Promise<WordWithProgress[]> {
    const allWords = await getWordsWithProgress(userId);
    return allWords.filter(word => word.status === status);
}

// 获取收藏的单词
export async function getFavoriteWords(userId: string): Promise<WordWithProgress[]> {
    const allWords = await getWordsWithProgress(userId);
    return allWords.filter(word => word.is_favorite);
}
