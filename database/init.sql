-- =====================================================
-- 单词魔法卡 - Supabase 完整初始化脚本
-- 包含：表结构 + 初始数据
-- =====================================================

-- =====================================================
-- 第一部分：表结构创建
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

-- =====================================================
-- 第二部分：初始数据插入
-- =====================================================

-- =====================================================
-- 插入默认用户
-- =====================================================
INSERT INTO users (id, name, avatar, level, xp, xp_max, stars, achievements, learned_words)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '小小英雄 · 飞飞',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC7ZfEeUuCgRvq_rkNd1uzIk5XrnnOBGv3p8QAEKHj7aWFuPr2xWfvXvFjGiyOnaTFOdH0EWo-3O-I5iWhr0LF36ZFn8dH6ok9lCXB9oZRkBzuWBf8bCWvpkuKa2F4nj87SYw_rzxHwTslHdAszEI36oXuicAHQgX8ED1O2nLgmCQQNvakfABtwHPx5QUQlojgAjuJnbMUIAjuz-rqCEpF6Lh10zLh-IaWkh0U232u1Do3sP8xKNNji3LzSzTNHPXhminhfXBUfNIA',
    12,
    650,
    1000,
    1250,
    3800,
    1250
);

-- 插入排行榜用户
INSERT INTO users (name, avatar, level, stars, achievements) VALUES
('冠军玩家', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpEAiWCS9NCH0UT3ZwaF7Df6jJKcNKltXz_Q_n5kytDfe3bqPnp0mNqqazSf3IbkLf__ftlKlEOGIklZbDs1ruT9b2lxBWOkwt_rWdFbmA6zZ3Ql7QvwR3KXWo_BUJ0nS2FvQ1SxRW-ujnGTrj3ZlhqgFv5t0qmGHkLPmTHRAR0cFrRYiW1yVCUaQjnbpbR0GDd_zpdHVs_ltqhTxSzowKWwxwYp6BglhTLR1fB6Mba-bJbrGXL_GIobTllQRldVu9Yy-v6z_rSEA', 20, 2840, 5000),
('小天才汤姆', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2Tjc54rKXBIOQNgZH3nf3sBXZFIrYKYY5VGSPRPS0c0Y3KNxKPUdcdXgqdoVUBx1D4HFCZibgv7VDOimGQsmRwRgNYRnj32LtlasGU9FBwnWAsLr-K6DNH39ZnkgTr1Y-CG9YL2wubrCl0Jhdp2xS0sufqNZsx5WHBrVXUy3xx0ds4ESOnwuOJmze8b8yBkGN3eNNeIuUhXRy0BntK_4AO2zag-aDROsNwefH1AvTSlhVtX0vhl37CSM_L3bDUQpp07eat5JI1wI', 18, 2450, 4500),
('快乐露西', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDthJ-ZXlDoIDSxA9HrDpKXSP5MdFx3_4gOnHNkzdAFPOmTsOvQQ6OjDrJ7r_QQlPaaeLa6gFM368-PKntRpRO5gzmEZqk41R7hIKytwK0Yj3j2Bb90taiuRTcAIJ6l2PdgtekyVpQuJSXkiz4FltZqM5iQoyttLNJDHPGuj_kf_3OqHAhaeUX1abEQq0jvMFzmZadfd0nPQ6gDUu6r6ePsca9UCZc9P9dn0gtUFAMnVL8D4LiR2IH8MuRslFFc6zHsfg_Fn6oOECU', 16, 2120, 4000),
('爱学习的乐乐', 'https://picsum.photos/id/101/100/100', 15, 1980, 3800),
('双语小达人', 'https://picsum.photos/id/102/100/100', 14, 1850, 3600),
('晨读之星', 'https://picsum.photos/id/103/100/100', 13, 1720, 3400);

-- =====================================================
-- 插入单词数据
-- =====================================================
INSERT INTO words (id, word, pronunciation, meaning, grammar, grammar_tags, sentence_en, sentence_cn, scene_cn, image_url, mnemonic, level) VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'Apple',
    '/ˈæp.əl/',
    'n. 苹果。一种圆形的常见水果，通常为红色、绿色或黄色。',
    '复数形式为 apples。在元音开头单词前，使用冠词 "an" (an apple)。',
    ARRAY['名词 (Noun)', '可数名词'],
    'I eat an apple every day.',
    '我每天吃一个苹果。',
    '果园里的小红果：艾米正在树下摘苹果。',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuACbvgj5Mh4RAuXCwYtQbHDSizv3VjYIeXuap6sqBYDrdKebm7sgoHcWMJQI4I90lBQgO-ZGsGQy83QG2GqmNiTaf0piCyNNWQAP2mIw2_xpVamhRb9dL-Tu92ctYAkjytVXZHSmQKzkji1c29jR66Z0OQewP3ZNTMzfNwoqgiGvZ1cDGxKFe8v29rFhIzwQQ9dveISatGGGKd8V8pw6LduQPr9EIp7erSb6VG_8UWC4IG2AdWdtnIqjT2FhWOzymDwd39zI8sV71M',
    '【谐音法】 读音像"阿婆"，想象阿婆在树下摘苹果。',
    'Lv.1 Beginner'
),
(
    '10000000-0000-0000-0000-000000000002',
    'Banana',
    '/bəˈnɑː.nə/',
    'n. 香蕉。一种长形、通常为黄色的热带水果。',
    '可数名词，复数 bananas。',
    ARRAY['名词 (Noun)', '可数名词'],
    'Bananas are rich in potassium.',
    '香蕉富含钾。',
    '热带雨林的馈赠：猴子在树上剥着金黄的香蕉。',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuALFlXiiKl_uw0wLZZy60OOPDdZmd_LRQpPoO0prNbNMGgshMTNfParEznsuXBDfcZFAIRZF816BPNqoBzcQGbRSI_LI_osdVz5wXEx41-zxhIyetZmrvrx-KwLtn1yNBRW4cE615BiJSYxmPKsKFYrkWf3YhhQTqMCx96hqSbrdwvj6eFLjygrQB1ahc2Vn7SguzxDZPNYhV8mASaZXT5cPn5855eI-aFm3VrMoLjg79a69YH5AS2TJeDQTVd54tYZ7PydryVgvzE',
    '【形似法】 香蕉弯弯像月牙，B-a-n-a-n-a。',
    'Lv.1 Beginner'
),
(
    '10000000-0000-0000-0000-000000000003',
    'Cat',
    '/kæt/',
    'n. 猫。一种深受人类喜爱的家养小型哺乳动物。',
    '复数 cats。常见短语：rain cats and dogs (倾盆大雨)。',
    ARRAY['名词 (Noun)', '可数名词'],
    'The cat is sleeping on the sofa.',
    '猫正在沙发上睡觉。',
    '午后的静谧：一只橘猫正缩在窗台的阳光里。',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC06U-BNyHRkT1-JUWgzXKb9nNoluNP0DZSwD2K1CROjki49uFl2Mv0GIsSKuYgiAQXLHyFK2k__64BNBYnh_P8so-JiQ_a19NExMVp4H7Btl-JJFbUQR4ybmbqJkynF7YLSq_xWi4ePk5Y1NcrTKy4qGpzhGbRppLU3EIM8zTQJgTkECosx484V9exqa5xbOkbmDXZXR6fRKKpGsvxOFpsgU38QkZ6kQ3G9tALtdlWkqLf5OGNeDz5MClfuxiPePnTZX_IRY30yn0',
    '【谐音法】 读音像"开特"，开着特快列车去找小猫。',
    'Lv.1 Beginner'
);

-- =====================================================
-- 插入用户学习进度
-- =====================================================
INSERT INTO user_word_progress (user_id, word_id, progress, status, is_favorite) VALUES
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 100, 'mastered', false),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 60, 'learning', false),
('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 85, 'learning', true);

-- =====================================================
-- 初始化完成！
-- =====================================================
