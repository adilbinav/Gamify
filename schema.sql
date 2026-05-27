-- Drop existing tables if they exist (useful for iterating)
DROP TABLE IF EXISTS completed_quests CASCADE;
DROP TABLE IF EXISTS shop_items CASCADE;
DROP TABLE IF EXISTS quests CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;

-- 1. Create User Stats Table
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coins INTEGER DEFAULT 1250,
    xp INTEGER DEFAULT 8450,
    level INTEGER DEFAULT 24,
    streak INTEGER DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create Quests Table
CREATE TABLE quests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    tier TEXT NOT NULL, -- e.g., 'Bronze', 'Silver', 'Gold'
    xp_reward INTEGER NOT NULL,
    coin_reward INTEGER NOT NULL,
    status TEXT DEFAULT 'claimable', -- 'claimable', 'pending', 'active'
    progress INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Create Shop Items Table
CREATE TABLE shop_items (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER NOT NULL,
    category TEXT NOT NULL,
    image TEXT,
    icon TEXT,
    owned_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Create Completed Quests Table (for the history/completed today log)
CREATE TABLE completed_quests (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    tier TEXT NOT NULL,
    type TEXT NOT NULL,
    xp INTEGER NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert Default User Stats
INSERT INTO user_stats (coins, xp, level, streak) VALUES (1250, 8450, 24, 7);

-- Insert Default Quests
INSERT INTO quests (title, description, tier, xp_reward, coin_reward, status, progress) VALUES 
('Morning 5K Run', 'Lace up and complete a 5km outdoor run before 9 AM.', 'Gold', 500, 100, 'claimable', 100),
('Deep Work Session', '90 minutes of focused coding or design without distractions.', 'Silver', 250, 50, 'pending', 100),
('Hydration Mastery', 'Drink 2.5L of water throughout the day.', 'Bronze', 100, 25, 'active', 40);

-- Insert Default Shop Items
INSERT INTO shop_items (title, description, cost, category, image, icon, owned_count) VALUES 
('15 min Gaming Break', 'Redeem for an instant guilt-free gaming session. Use it or save it!', 150, 'Digital', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400', 'sports_esports', 0),
('Cyber-Ronin Skin', 'A legendary tier skin for your profile avatar with neon animations.', 450, 'Skin', 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400', 'checkroom', 0);

-- Insert Default Completed Quests
INSERT INTO completed_quests (title, tier, type, xp) VALUES 
('Read 20 Pages', 'Silver', 'Daily Habit', 150),
('No Sugary Snacks', 'Bronze', 'Daily Habit', 50);

-- Note: Ensure Row Level Security (RLS) is disabled for all tables for this simple integration
-- Or configure policies to allow public anon select/insert/update/delete.
-- For quick testing, we'll disable RLS:
ALTER TABLE user_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE quests DISABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE completed_quests DISABLE ROW LEVEL SECURITY;
