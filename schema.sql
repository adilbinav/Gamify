-- Drop existing tables to start fresh
DROP TABLE IF EXISTS metric_logs CASCADE;
DROP TABLE IF EXISTS metric_defs CASCADE;
DROP TABLE IF EXISTS habits CASCADE;
DROP TABLE IF EXISTS pillars CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;

-- 1. Create User Stats Table (Global Stats)
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coins INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    last_login DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Pillars Table (Life Areas)
CREATE TABLE pillars (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1
);

-- 3. Create Habits/Tasks Table
CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    pillar_id INTEGER REFERENCES pillars(id) ON DELETE CASCADE,
    xp_reward INTEGER NOT NULL DEFAULT 50,
    coin_reward INTEGER NOT NULL DEFAULT 10,
    is_completed_today BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Metric Definitions (Things to track)
CREATE TABLE metric_defs (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    pillar_id INTEGER REFERENCES pillars(id) ON DELETE CASCADE,
    min_val NUMERIC,
    max_val NUMERIC
);

-- 5. Create Metric Logs (Daily values)
CREATE TABLE metric_logs (
    id SERIAL PRIMARY KEY,
    metric_id INTEGER REFERENCES metric_defs(id) ON DELETE CASCADE,
    value NUMERIC NOT NULL,
    log_date DATE DEFAULT CURRENT_DATE NOT NULL,
    UNIQUE(metric_id, log_date)
);

-- Insert Default Data
INSERT INTO user_stats (coins, streak) VALUES (100, 1);

INSERT INTO pillars (name, icon, color) VALUES 
('Health', 'favorite', '#10b981'),
('Mind', 'psychology', '#8b5cf6'),
('Wealth', 'account_balance', '#eab308'),
('Social', 'groups', '#ec4899');

INSERT INTO habits (title, description, pillar_id, xp_reward, coin_reward) VALUES 
('Morning Run (5k)', 'Cardio health', 1, 100, 20),
('Drink 2L Water', 'Hydration', 1, 50, 10),
('Read 20 Pages', 'Intellectual growth', 2, 75, 15),
('Deep Work (2 hrs)', 'Focused productivity', 3, 150, 30),
('Call Family', 'Maintain relationships', 4, 50, 10);

INSERT INTO metric_defs (name, unit, pillar_id, min_val, max_val) VALUES 
('Sleep', 'Hours', 1, 0, 24),
('Mood', '1-10', 2, 1, 10),
('Deep Work', 'Hours', 3, 0, 12);

-- Insert some dummy log data for the past 7 days to make charts look good
DO $$
DECLARE
    i INT;
BEGIN
    FOR i IN 0..6 LOOP
        -- Sleep (Health)
        INSERT INTO metric_logs (metric_id, value, log_date) 
        VALUES (1, ROUND(RANDOM() * 3 + 5), CURRENT_DATE - i);
        
        -- Mood (Mind)
        INSERT INTO metric_logs (metric_id, value, log_date) 
        VALUES (2, ROUND(RANDOM() * 4 + 6), CURRENT_DATE - i);
        
        -- Deep Work (Wealth)
        INSERT INTO metric_logs (metric_id, value, log_date) 
        VALUES (3, ROUND(RANDOM() * 4 + 1), CURRENT_DATE - i);
    END LOOP;
END $$;

-- Disable RLS for quick local testing (Enable in production)
ALTER TABLE user_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE pillars DISABLE ROW LEVEL SECURITY;
ALTER TABLE habits DISABLE ROW LEVEL SECURITY;
ALTER TABLE metric_defs DISABLE ROW LEVEL SECURITY;
ALTER TABLE metric_logs DISABLE ROW LEVEL SECURITY;
