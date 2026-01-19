-- =====================================================
-- 单词魔法卡 - Supabase 数据库 Schema
-- =====================================================

-- 启用 UUID 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. 用户表
-- =====================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT '小小英雄',
    avatar TEXT DEFAULT 'https://api.dicebear.com/7.x/adventurer/svg?seed=hero',
    level INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    xp_max INTEGER NOT NULL DEFAULT 1000,
    stars INTEGER NOT NULL DEFAULT 0,
    achievements INTEGER NOT NULL DEFAULT 0,
    learned_words INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. 单词表
-- =====================================================
CREATE TABLE words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word TEXT NOT NULL UNIQUE,
    pronunciation TEXT NOT NULL,
    meaning TEXT NOT NULL,
    grammar TEXT,
    grammar_tags TEXT[] DEFAULT '{}',
    sentence_en TEXT,
    sentence_cn TEXT,
    scene_cn TEXT,
    image_url TEXT,
    mnemonic TEXT,
    level TEXT NOT NULL DEFAULT 'Lv.1 Beginner',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. 用户学习进度表
-- =====================================================
CREATE TABLE user_word_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'learning', 'mastered')),
    is_favorite BOOLEAN DEFAULT FALSE,
    last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, word_id)
);

-- =====================================================
-- 索引
-- =====================================================
CREATE INDEX idx_user_word_progress_user_id ON user_word_progress(user_id);
CREATE INDEX idx_user_word_progress_word_id ON user_word_progress(word_id);
CREATE INDEX idx_user_word_progress_status ON user_word_progress(status);
CREATE INDEX idx_users_stars ON users(stars DESC);

-- =====================================================
-- 触发器：自动更新 updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_word_progress ENABLE ROW LEVEL SECURITY;

-- 允许匿名读取所有单词
CREATE POLICY "Allow anonymous read words" ON words
    FOR SELECT USING (true);

-- 允许匿名读取所有用户（排行榜）
CREATE POLICY "Allow anonymous read users" ON users
    FOR SELECT USING (true);

-- 允许匿名读写用户进度（简化版，生产环境应使用认证）
CREATE POLICY "Allow anonymous read progress" ON user_word_progress
    FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert progress" ON user_word_progress
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update progress" ON user_word_progress
    FOR UPDATE USING (true);

-- 允许匿名更新用户信息
CREATE POLICY "Allow anonymous update users" ON users
    FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous insert users" ON users
    FOR INSERT WITH CHECK (true);
