import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check your .env.local file.');
}

// 创建 Supabase 客户端
export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
);

// 数据库类型定义
export interface DbUser {
    id: string;
    name: string;
    avatar: string;
    level: number;
    xp: number;
    xp_max: number;
    stars: number;
    achievements: number;
    learned_words: number;
    created_at: string;
    updated_at: string;
}

export interface DbWord {
    id: string;
    word: string;
    pronunciation: string;
    meaning: string;
    grammar: string | null;
    grammar_tags: string[];
    sentence_en: string | null;
    sentence_cn: string | null;
    scene_cn: string | null;
    image_url: string | null;
    mnemonic: string | null;
    level: string;
    created_at: string;
}

export interface DbUserWordProgress {
    id: string;
    user_id: string;
    word_id: string;
    progress: number;
    status: 'new' | 'learning' | 'mastered';
    is_favorite: boolean;
    last_reviewed_at: string;
    created_at: string;
}

// 带进度的单词类型
export interface WordWithProgress extends DbWord {
    progress: number;
    status: 'new' | 'learning' | 'mastered';
    is_favorite: boolean;
}

export default supabase;
