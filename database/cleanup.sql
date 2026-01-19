-- =====================================================
-- 单词魔法卡 - 清理脚本
-- 警告：此脚本会删除所有相关表和数据！
-- =====================================================

-- 删除RLS策略
DROP POLICY IF EXISTS "Allow anonymous read words" ON words;
DROP POLICY IF EXISTS "Allow anonymous read users" ON users;
DROP POLICY IF EXISTS "Allow anonymous read progress" ON user_word_progress;
DROP POLICY IF EXISTS "Allow anonymous insert progress" ON user_word_progress;
DROP POLICY IF EXISTS "Allow anonymous update progress" ON user_word_progress;
DROP POLICY IF EXISTS "Allow anonymous update users" ON users;
DROP POLICY IF EXISTS "Allow anonymous insert users" ON users;

-- 删除表（会自动删除外键约束）
DROP TABLE IF EXISTS user_word_progress CASCADE;
DROP TABLE IF EXISTS words CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 删除触发器函数
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
