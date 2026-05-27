import React, { useState, useEffect } from 'react';

// Sample initial data in classic styling
const initialQuests = [
  {
    id: 1,
    title: "Morning 5K Run",
    description: "Lace up and complete a 5km outdoor run before 9 AM.",
    tier: "Gold",
    xpReward: 500,
    coinReward: 100,
    status: "claimable", // claimable, active, pending
    progress: 100
  },
  {
    id: 2,
    title: "Deep Work Session",
    description: "90 minutes of focused coding or design without distractions.",
    tier: "Silver",
    xpReward: 250,
    coinReward: 50,
    status: "pending",
    progress: 100
  },
  {
    id: 3,
    title: "Hydration Mastery",
    description: "Drink 2.5L of water throughout the day.",
    tier: "Bronze",
    xpReward: 100,
    coinReward: 25,
    status: "active",
    progress: 40 // Out of 100
  }
];

const initialShopItems = [
  {
    id: 1,
    title: "15 min Gaming Break",
    description: "Redeem for an instant guilt-free gaming session. Use it or save it!",
    cost: 150,
    category: "Digital",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400",
    icon: "sports_esports",
    ownedCount: 0
  },
  {
    id: 2,
    title: "Cyber-Ronin Skin",
    description: "A legendary tier skin for your profile avatar with neon animations.",
    cost: 450,
    category: "Skin",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=400",
    icon: "checkroom",
    ownedCount: 0
  },
  {
    id: 3,
    title: "Cheat Meal Voucher",
    description: "Redeem for $15 towards your favorite delivery app. You earned it!",
    cost: 800,
    category: "Real World",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400",
    icon: "restaurant",
    ownedCount: 0
  },
  {
    id: 4,
    title: "Double XP (1 Hr)",
    description: "Accelerate your progress! Earn double XP on all quests for the next hour.",
    cost: 300,
    category: "Booster",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=400",
    icon: "bolt",
    ownedCount: 0
  },
  {
    id: 5,
    title: "Artisan Coffee",
    description: "Redeem at any partner cafe for a premium large latte or cold brew.",
    cost: 200,
    category: "Real World",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400",
    icon: "local_cafe",
    ownedCount: 0
  },
  {
    id: 6,
    title: "Gold Theme Pack",
    description: "Unlock the premium Gold & Onyx dashboard theme for your profile.",
    cost: 600,
    category: "Digital",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400",
    icon: "palette",
    ownedCount: 0
  }
];

const initialLeaderboard = [
  { rank: 1, name: "Nova_Explorer", league: "Diamond League", xp: 12420, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100", borderClass: "border-primary" },
  { rank: 2, name: "PixelQueen", league: "Diamond League", xp: 11890, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", borderClass: "border-secondary" },
  { rank: 3, name: "GamerPro99", league: "Diamond League", xp: 10560, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100", borderClass: "border-outline-variant" },
  { rank: 12, name: "Alex_Venture", league: "Platinum League", xp: 8450, avatar: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&q=80&w=100", isUser: true, borderClass: "border-primary font-bold" },
  { rank: 13, name: "CyberStryder", league: "Platinum League", xp: 8210, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100", borderClass: "border-outline-variant" }
];

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState('quests'); // 'dashboard', 'quests', 'shop', 'rank', 'profile'
  
  // App Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User States & Customizable Profile
  const [userName, setUserName] = useState('Alex Venture');
  const [userTitle, setUserTitle] = useState('QuestFlow Adventurer');
  const [customAvatar, setCustomAvatar] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [coins, setCoins] = useState(1250);
  const [xp, setXp] = useState(8450);
  const [level, setLevel] = useState(24);
  const [streak, setStreak] = useState(7);
  const [completedQuestsCount, setCompletedQuestsCount] = useState(142);
  const [completedToday, setCompletedToday] = useState([
    { id: 101, title: "Read 20 Pages", tier: "Silver", type: "Daily Habit", xp: 150 },
    { id: 102, title: "No Sugary Snacks", tier: "Bronze", type: "Daily Habit", xp: 50 }
  ]);

  // Quests State
  const [quests, setQuests] = useState(initialQuests);
  const [questFilter, setQuestFilter] = useState('All'); // 'All', 'Gold', 'Silver', 'Bronze'
  const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
  
  // New Quest Form State
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDescription, setNewQuestDescription] = useState('');
  const [newQuestTier, setNewQuestTier] = useState('Bronze');

  // Shop State
  const [shopItems, setShopItems] = useState(initialShopItems);
  const [shopFilter, setShopFilter] = useState('ALL'); // 'ALL', 'DIGITAL', 'REAL WORLD', 'BOOSTERS', 'SKIN'
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [editingShopItem, setEditingShopItem] = useState(null); // Item object or null for creating

  // Custom Reward Form State
  const [shopItemTitle, setShopItemTitle] = useState('');
  const [shopItemDescription, setShopItemDescription] = useState('');
  const [shopItemCost, setShopItemCost] = useState(150);
  const [shopItemCategory, setShopItemCategory] = useState('Digital');
  const [shopItemImage, setShopItemImage] = useState('');

  // Leaderboard Filter
  const [leaderboardFilter, setLeaderboardFilter] = useState('GLOBAL'); // 'GLOBAL', 'FRIENDS'

  // Notifications State
  const [toasts, setToasts] = useState([]);

  // Profile Customizations
  const [selectedSkin, setSelectedSkin] = useState('Default');

  // Apply Dark Mode effect
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      htmlElement.classList.remove('light');
    } else {
      htmlElement.classList.add('light');
      htmlElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toast helper
  const triggerToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // XP Level Up Check
  useEffect(() => {
    if (xp >= 10000) {
      setLevel((prev) => prev + 1);
      setXp((prev) => prev - 10000);
      triggerToast("LEVEL UP! You reached Level " + (level + 1) + "! 🚀", "level");
    }
  }, [xp]);

  // Complete/Claim Quest Action
  const claimQuest = (quest) => {
    setXp((prev) => prev + quest.xpReward);
    setCoins((prev) => prev + quest.coinReward);
    
    // Add to completed list
    const newCompleted = {
      id: Date.now(),
      title: quest.title,
      tier: quest.tier,
      type: "One-time Quest",
      xp: quest.xpReward
    };
    setCompletedToday((prev) => [newCompleted, ...prev]);

    // Remove from active quests
    setQuests((prev) => prev.filter(q => q.id !== quest.id));
    triggerToast(`Quest Claimed! +${quest.xpReward} XP, +${quest.coinReward} Coins 🌟`);
  };

  // Set quest status to claimable
  const completeQuestAction = (questId) => {
    setQuests((prev) => prev.map(q => {
      if (q.id === questId) {
        return { ...q, status: 'claimable', progress: 100 };
      }
      return q;
    }));
    triggerToast("Quest Objectives Completed! Claim your reward. 🎉");
  };

  // Delete Quest
  const deleteQuest = (questId) => {
    setQuests((prev) => prev.filter(q => q.id !== questId));
    triggerToast("Quest deleted", "error");
  };

  // Handle Hydration Quest increase
  const increaseHydration = () => {
    setQuests((prev) => prev.map(q => {
      if (q.id === 3) {
        const nextProgress = Math.min(100, q.progress + 20);
        const nextStatus = nextProgress === 100 ? 'claimable' : 'active';
        if (nextProgress === 100 && q.progress < 100) {
          triggerToast("Hydration Quest complete! Ready to claim. 💧");
        }
        return { ...q, progress: nextProgress, status: nextStatus };
      }
      return q;
    }));
  };

  // Purchase Shop Item Action
  const purchaseItem = (item) => {
    if (coins < item.cost) {
      triggerToast("Insufficient Coins!", "error");
      return;
    }
    
    setCoins((prev) => prev - item.cost);
    setShopItems((prev) => prev.map(s => {
      if (s.id === item.id) {
        return { ...s, ownedCount: s.ownedCount + 1 };
      }
      return s;
    }));

    if (item.category === "Skin") {
      triggerToast(`Unlocked Skin: ${item.title}! Select it in Profile. 👕`);
    } else {
      triggerToast(`Successfully purchased ${item.title}! 🛒`);
    }
  };

  // Image Upload helper
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopItemImage(reader.result);
        triggerToast("Image uploaded successfully! 📸");
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal for creating custom reward
  const openCreateShopItem = () => {
    setEditingShopItem(null);
    setShopItemTitle('');
    setShopItemDescription('');
    setShopItemCost(150);
    setShopItemCategory('Digital');
    setShopItemImage('');
    setIsShopModalOpen(true);
  };

  // Open modal for editing custom reward
  const openEditShopItem = (item) => {
    setEditingShopItem(item);
    setShopItemTitle(item.title);
    setShopItemDescription(item.description);
    setShopItemCost(item.cost);
    setShopItemCategory(item.category);
    setShopItemImage(item.image);
    setIsShopModalOpen(true);
  };

  // Save reward (Create or Update)
  const handleSaveShopItem = (e) => {
    e.preventDefault();
    if (!shopItemTitle.trim()) return;

    const imgToUse = shopItemImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400";

    if (editingShopItem) {
      // Editing Mode
      setShopItems((prev) => prev.map(s => {
        if (s.id === editingShopItem.id) {
          return {
            ...s,
            title: shopItemTitle,
            description: shopItemDescription,
            cost: Number(shopItemCost),
            category: shopItemCategory,
            image: imgToUse
          };
        }
        return s;
      }));
      triggerToast("Reward updated successfully! ✏️");
    } else {
      // Creation Mode
      const newItem = {
        id: Date.now(),
        title: shopItemTitle,
        description: shopItemDescription || "No custom reward description provided.",
        cost: Number(shopItemCost),
        category: shopItemCategory,
        image: imgToUse,
        icon: "redeem",
        ownedCount: 0
      };
      setShopItems((prev) => [newItem, ...prev]);
      triggerToast("Created new custom reward: " + newItem.title + "! 🎁");
    }

    setIsShopModalOpen(false);
  };

  // Delete Shop Item
  const deleteShopItem = (itemId) => {
    setShopItems((prev) => prev.filter(s => s.id !== itemId));
    triggerToast("Reward deleted from shop", "error");
  };

  // Add new quest
  const handleCreateQuest = (e) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;

    let xpReward = 100;
    let coinReward = 25;
    if (newQuestTier === 'Gold') {
      xpReward = 500;
      coinReward = 100;
    } else if (newQuestTier === 'Silver') {
      xpReward = 250;
      coinReward = 50;
    }

    const newQuest = {
      id: Date.now(),
      title: newQuestTitle,
      description: newQuestDescription || "No description provided.",
      tier: newQuestTier,
      xpReward,
      coinReward,
      status: 'active',
      progress: 0
    };

    setQuests((prev) => [newQuest, ...prev]);
    setIsQuestModalOpen(false);
    setNewQuestTitle('');
    setNewQuestDescription('');
    setNewQuestTier('Bronze');
    triggerToast("Created new quest: " + newQuest.title + "! 📝");
  };

  // Quest filters
  const filteredQuests = quests.filter(q => {
    if (questFilter === 'All') return true;
    return q.tier === questFilter;
  });

  // Shop filters
  const filteredShopItems = shopItems.filter(item => {
    if (shopFilter === 'ALL') return true;
    return item.category.toUpperCase() === shopFilter;
  });

  // Daily Streak Bonus trigger
  const claimStreakBonus = () => {
    setStreak(prev => prev + 1);
    setCoins(prev => prev + 150);
    setXp(prev => prev + 300);
    triggerToast("Daily Streak Maintained! Bonus +150 Coins & +300 XP awarded! 🔥");
  };

  return (
    <div className="min-h-screen pb-32 flex flex-col transition-colors duration-300">
      
      {/* Toast Notifications */}
      <div className="fixed top-20 right-6 z-[100] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 transform translate-y-0 transition-all duration-300 pointer-events-auto border ${
              toast.type === 'error' 
                ? 'bg-black text-white border-white/20' 
                : toast.type === 'level'
                ? 'bg-black text-white border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.4)] font-bold'
                : 'bg-white text-black border-black/20'
            }`}
          >
            <span className="material-symbols-outlined text-md">
              {toast.type === 'error' ? 'error' : toast.type === 'level' ? 'military_tech' : 'check_circle'}
            </span>
            <span className="font-label-bold text-xs uppercase tracking-wider">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* TopAppBar */}
      <header className="bg-surface/90 backdrop-blur-md border-b border-outline-variant top-0 sticky z-50 transition-colors">
        <div className="flex justify-between items-center w-full px-4 py-4 max-w-2xl mx-auto">
          
          <div className="flex items-center gap-3">
            <div className="relative cursor-pointer group" onClick={() => setActivePage('profile')}>
              <img 
                alt="User Avatar" 
                className="w-9 h-9 border border-primary p-0.5 object-cover transition-transform group-hover:scale-105" 
                src={customAvatar || (selectedSkin === 'Cyber-Ronin' 
                  ? "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=100" 
                  : "https://lh3.googleusercontent.com/aida-public/AB6AXuCJP6U3HtC5Hj7ZVwX2eJSAM7Gr0A7eHiEs0jyJtCPy4ILF_7IlEszxCTbDUwJJI7PhHZLF8Au-9vBqEs2X2AFAvzPSLkBWvNDC_WAnPTo1_wRcjw5ww9suurW7-VIlv4z3HfpHJHhvHxTycb1tGKsEnK-aFsLxDu6iMxZ03kurGdW19PghA1Eew_gDcG1auPHwJ9Mo_hWGoGCTXEuUIdVbLWSLuT9p2J3ofbDEPdDh0CzG2SPGCc9c74TwEkGprQLJo9UKTPNouUI"
                )}
              />
              <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[8px] font-bold px-1 border border-white">
                {level}
              </div>
            </div>
            <span 
              onClick={() => setActivePage('dashboard')}
              className="font-h2 text-h2 font-black text-primary uppercase cursor-pointer tracking-tighter hover:opacity-85 select-none"
            >
              QuestFlow
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Coins Display */}
            <div className="border border-outline-variant px-3 py-1 bg-surface-container-lowest flex items-center gap-1.5 shadow-sm">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                monetization_on
              </span>
              <span className="font-label-bold text-xs text-on-surface uppercase tracking-wider font-bold">{coins}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className="w-9 h-9 border border-outline-variant flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container-high transition-colors"
              title="Toggle Theme"
            >
              <span className="material-symbols-outlined text-primary text-[18px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 py-8 space-y-8">
        
        {/* Page 1: Dashboard */}
        {activePage === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Rank Banner */}
            <section className="mono-card p-6 relative flex flex-col justify-between">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="font-label-bold text-[10px] text-secondary uppercase tracking-[0.2em] font-bold">Rank Status</span>
                  <h2 className="font-h1 text-4xl text-on-surface mt-1 font-normal tracking-tight">Lvl. {level}</h2>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant italic font-semibold">{xp} / 10000 XP</span>
                </div>
              </div>
              
              <div className="progress-line w-full relative">
                <div 
                  className="progress-fill transition-all duration-500" 
                  style={{ width: `${(xp / 10000) * 100}%` }}
                />
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="border border-outline-variant p-4 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-on-surface text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      local_fire_department
                    </span>
                    <span className="font-label-bold text-[10px] text-secondary uppercase tracking-wider font-bold">Streak</span>
                  </div>
                  <span className="font-h2 text-xl font-bold text-on-surface">{streak} Days</span>
                  <button 
                    onClick={claimStreakBonus}
                    className="mt-3 w-full bg-primary text-on-primary text-[10px] uppercase font-bold py-2 border border-primary hover:bg-transparent hover:text-primary transition-colors tracking-widest"
                  >
                    Claim Streak
                  </button>
                </div>

                <div className="border border-outline-variant p-4 flex flex-col justify-between bg-surface-container-low">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="material-symbols-outlined text-on-surface text-sm">
                      military_tech
                    </span>
                    <span className="font-label-bold text-[10px] text-secondary uppercase tracking-wider font-bold">Complete</span>
                  </div>
                  <span className="font-h2 text-xl font-bold text-on-surface">{completedQuestsCount + completedToday.length} Quests</span>
                  <span className="text-[9px] text-on-surface-variant mt-3 italic">You completed {completedToday.length} habits today.</span>
                </div>
              </div>
            </section>

            {/* Streaks Board */}
            <section className="mono-card p-6">
              <h3 className="font-label-bold text-[10px] text-secondary mb-6 uppercase tracking-[0.2em] font-bold">Active Disciplines</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                
                <div className="min-w-[130px] border border-on-surface p-4 text-center bg-primary text-on-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-xl mb-1 block">bolt</span>
                  <span className="block font-h2 text-md font-bold">x1.2</span>
                  <span className="text-[9px] font-label-bold uppercase opacity-80">XP Multiplier</span>
                </div>

                <div className="min-w-[130px] border border-on-surface p-4 text-center bg-surface-container-lowest text-on-surface flex-shrink-0">
                  <span className="material-symbols-outlined text-xl mb-1 block" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="block font-h2 text-md font-bold">GOLD</span>
                  <span className="text-[9px] font-label-bold uppercase">Rush State</span>
                </div>

                <div className="min-w-[130px] border border-outline-variant p-4 text-center bg-surface-container-low flex-shrink-0 grayscale opacity-40">
                  <span className="material-symbols-outlined text-xl mb-1 block text-outline">lock</span>
                  <span className="block font-h2 text-md text-outline">LVL 25</span>
                  <span className="text-[9px] font-label-bold uppercase text-outline">Restricted</span>
                </div>

              </div>
            </section>
          </div>
        )}

        {/* Page 2: Quest Log */}
        {activePage === 'quests' && (
          <div className="space-y-6 animate-fade-in">
            {/* Hero Progress Section */}
            <section className="mono-card p-6 relative">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="font-label-bold text-[10px] text-secondary uppercase tracking-[0.2em] font-bold">Quest Log</span>
                  <h1 className="font-h1 text-3xl text-on-surface mt-1 font-normal tracking-tight">Active Trails</h1>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-on-surface-variant italic font-semibold">
                    {filteredQuests.length > 0 
                      ? `${filteredQuests.length} Quests remaining` 
                      : "No active quests"
                    }
                  </span>
                </div>
              </div>
              <div className="progress-line w-full">
                <div className="progress-fill" style={{ width: "65%" }}></div>
              </div>
            </section>

            {/* Filters */}
            <div className="flex justify-between items-center border border-outline-variant p-2 bg-surface-container-lowest">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {['All', 'Gold', 'Silver', 'Bronze'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setQuestFilter(tier)}
                    className={`px-4 py-1 border transition-all text-xs font-label-bold uppercase tracking-wider whitespace-nowrap ${
                      questFilter === tier 
                        ? 'bg-primary text-on-primary border-primary font-bold' 
                        : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setIsQuestModalOpen(true)}
                className="flex items-center gap-1 bg-primary text-on-primary border border-primary px-4 py-1.5 text-xs font-label-bold tracking-widest uppercase hover:bg-transparent hover:text-primary transition-colors animate-pulse"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                New
              </button>
            </div>

            {/* Active Quests List */}
            <div className="grid grid-cols-1 gap-3">
              {filteredQuests.map((quest) => (
                <div 
                  key={quest.id} 
                  className={`mono-card p-5 flex items-center justify-between border-l-4 ${
                    quest.tier === 'Gold' 
                      ? 'border-l-primary' 
                      : quest.tier === 'Silver' 
                      ? 'border-l-secondary' 
                      : 'border-l-outline-variant'
                  }`}
                >
                  <div className="flex flex-col gap-1.5 flex-grow pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-label-bold text-[9px] uppercase tracking-wider text-secondary font-bold">
                        {quest.tier} Tier
                      </span>
                      <span className="text-outline-variant">•</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                        {quest.xpReward} XP / {quest.coinReward} Coins
                      </span>
                    </div>

                    <h4 className="font-h3 text-md text-on-surface font-semibold tracking-tight">{quest.title}</h4>
                    <p className="font-body-md text-on-surface-variant text-xs">{quest.description}</p>

                    {quest.status === 'active' && quest.id === 3 && (
                      <div className="mt-2 w-32">
                        <div className="progress-line w-full mb-1">
                          <div className="progress-fill" style={{ width: `${quest.progress}%` }}></div>
                        </div>
                        <button 
                          onClick={increaseHydration}
                          className="text-[9px] font-bold text-primary uppercase tracking-widest underline hover:opacity-80"
                        >
                          Drink (20%)
                        </button>
                      </div>
                    )}

                    {quest.status === 'active' && quest.id !== 3 && (
                      <button 
                        onClick={() => completeQuestAction(quest.id)}
                        className="mt-2 text-left text-[9px] font-bold text-primary uppercase tracking-widest underline hover:opacity-80"
                      >
                        Complete Objective
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 justify-center flex-shrink-0">
                    <span 
                      onClick={() => deleteQuest(quest.id)}
                      className="material-symbols-outlined text-outline cursor-pointer hover:text-black transition-colors"
                      title="Delete Quest"
                    >
                      delete
                    </span>

                    {quest.status === 'claimable' ? (
                      <button 
                        onClick={() => claimQuest(quest)}
                        className="bg-primary text-on-primary font-label-bold px-5 py-2 border border-primary hover:bg-transparent hover:text-primary transition-colors uppercase tracking-widest text-[10px] font-bold"
                      >
                        Claim
                      </button>
                    ) : (
                      <span className="font-label-bold text-[10px] text-secondary uppercase tracking-widest italic">
                        {quest.status === 'pending' ? 'Pending' : 'Active'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Completed Quests section */}
            <section className="opacity-70 mt-8">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-label-bold text-[10px] text-secondary uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                  COMPLETED TODAY
                </h3>
                <div className="h-px flex-1 bg-outline-variant/30"></div>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {completedToday.map((c) => (
                  <div key={c.id} className="mono-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-outline-variant flex items-center justify-center text-secondary bg-surface-container-low">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                      </div>
                      <div>
                        <h4 className="font-label-bold text-xs text-on-surface line-through decoration-primary font-bold">{c.title}</h4>
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider">{c.type} • {c.tier}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-primary">+{c.xp} XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Page 3: Reward Shop */}
        {activePage === 'shop' && (
          <div className="space-y-6 animate-fade-in">
            {/* Rich original color Shop Header Banner */}
            <section className="relative w-full rounded-none border border-outline-variant overflow-hidden h-36">
              <img 
                className="w-full h-full object-cover brightness-75 select-none" 
                alt="Shop Banner"
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6 text-white">
                <h2 className="font-h1 text-2xl uppercase tracking-tighter italic">The Armory</h2>
                <p className="text-white/80 font-label-bold text-[9px] tracking-widest uppercase font-bold">Exchange your glory for power</p>
              </div>
            </section>

            {/* Category Tabs & Add Reward Custom Button */}
            <div className="flex justify-between items-center border-b border-outline-variant pb-2">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {['ALL', 'DIGITAL', 'SKIN', 'REAL WORLD', 'BOOSTERS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setShopFilter(cat)}
                    className={`px-4 py-1.5 border transition-all text-xs font-label-bold uppercase tracking-wider whitespace-nowrap ${
                      shopFilter === cat 
                        ? 'bg-primary text-on-primary border-primary font-bold' 
                        : 'border-transparent text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button 
                onClick={openCreateShopItem}
                className="flex items-center gap-1 bg-primary text-on-primary border border-primary px-3 py-1 text-xs font-label-bold tracking-widest uppercase hover:bg-transparent hover:text-primary transition-colors ml-2"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                ADD ITEM
              </button>
            </div>

            {/* Reward Items list (Images reflect original full color) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6">
              {filteredShopItems.map((item) => (
                <div key={item.id} className="mono-card p-4 flex flex-col justify-between group hover:border-black transition-all duration-300">
                  <div className="relative border border-outline-variant overflow-hidden aspect-video mb-3 bg-surface-container-highest">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform" 
                      src={item.image} 
                      alt={item.title}
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <span className="bg-primary text-on-primary text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>

                    {/* Manage Button Controls on Card Hover/Focus */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditShopItem(item)}
                        className="bg-white/90 text-black p-1 hover:bg-black hover:text-white transition-colors border border-black/20"
                        title="Edit Item"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                      </button>
                      <button 
                        onClick={() => deleteShopItem(item.id)}
                        className="bg-white/90 text-red-600 p-1 hover:bg-red-600 hover:text-white transition-colors border border-black/20"
                        title="Delete Item"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>

                    {item.ownedCount > 0 && (
                      <span className="absolute bottom-2 left-2 bg-surface-container-lowest text-on-surface border border-outline-variant text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        Owned: {item.ownedCount}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow">
                    <h3 className="font-h3 text-sm font-bold text-on-surface uppercase tracking-tight mb-1">{item.title}</h3>
                    <p className="text-on-surface-variant text-[11px] leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-dashed border-outline-variant pt-3 mt-auto">
                    <div className="flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-on-surface text-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                        monetization_on
                      </span>
                      <span className="font-h3 text-sm font-bold text-on-surface">{item.cost}</span>
                    </div>
                    
                    <button 
                      onClick={() => purchaseItem(item)}
                      className={`font-label-bold text-[9px] uppercase font-bold px-4 py-2 border transition-all ${
                        coins >= item.cost 
                          ? 'bg-primary text-on-primary border-primary hover:bg-transparent hover:text-primary' 
                          : 'bg-surface-container-low text-outline border-outline-variant/30 cursor-not-allowed'
                      }`}
                      disabled={coins < item.cost}
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Page 4: Rank & Achievements */}
        {activePage === 'rank' && (
          <div className="space-y-6 animate-fade-in">
            {/* Rank Season Banner */}
            <section className="mono-card p-6 text-center">
              <div className="flex flex-col items-center py-4">
                <div className="mb-2 p-3 border border-on-surface bg-surface-container-low">
                  <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                </div>
                <h1 className="font-h1 text-2xl uppercase tracking-wider font-bold">Season Rank: #12</h1>
                <p className="font-body-lg text-xs text-on-surface-variant italic mt-0.5">Top 5% League Standing</p>
                
                <div className="mt-6 w-full max-w-xs">
                  <div className="flex justify-between text-[9px] font-bold tracking-wider mb-1 uppercase text-secondary">
                    <span>XP: {xp + 7000}</span>
                    <span>Next Rank: 10,000</span>
                  </div>
                  <div className="progress-line w-full">
                    <div className="progress-fill" style={{ width: "84%" }}></div>
                  </div>
                </div>
              </div>
            </section>

            {/* Achievements section */}
            <section className="space-y-3">
              <div className="flex justify-between items-end">
                <h2 className="font-label-bold text-[10px] uppercase tracking-widest text-secondary font-bold">Season Medals</h2>
                <button className="text-primary font-label-bold text-[9px] uppercase tracking-wider hover:underline">VIEW ALL</button>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                
                {/* Badge 1 */}
                <div className="mono-card min-w-[130px] p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 border border-outline flex items-center justify-center mb-2 bg-surface-container-low">
                    <span className="material-symbols-outlined text-[20px] text-on-surface" style={{ fontVariationSettings: "'FILL' 1" }}>
                      wb_sunny
                    </span>
                  </div>
                  <span className="font-label-bold text-xs uppercase tracking-tight font-bold text-on-surface">Early Bird</span>
                  <span className="text-[8px] text-on-surface-variant mt-0.5">5 Quests before 8 AM</span>
                </div>

                {/* Badge 2 */}
                <div className="mono-card min-w-[130px] p-4 flex flex-col items-center text-center">
                  <div className="w-10 h-10 border border-on-surface flex items-center justify-center mb-2 bg-primary text-on-primary">
                    <span className="material-symbols-outlined text-[20px] text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      local_fire_department
                    </span>
                  </div>
                  <span className="font-label-bold text-xs uppercase tracking-tight font-bold text-on-surface">7-Day Streak</span>
                  <span className="text-[8px] text-on-surface-variant mt-0.5">Active every day</span>
                </div>

                {/* Badge 3 */}
                <div className="mono-card min-w-[130px] p-4 flex flex-col items-center text-center opacity-40">
                  <div className="w-10 h-10 border border-dashed border-outline flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[20px] text-outline">
                      group
                    </span>
                  </div>
                  <span className="font-label-bold text-xs uppercase tracking-tight font-bold text-on-surface">Socialite</span>
                  <span className="text-[8px] text-on-surface-variant mt-0.5">Join 5 group quests</span>
                </div>

              </div>
            </section>

            {/* Global Leaderboard Rows */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="font-label-bold text-[10px] uppercase tracking-widest text-secondary font-bold">Rankings</h2>
                <div className="flex bg-surface-container border border-outline-variant p-0.5 text-[9px]">
                  <button 
                    onClick={() => setLeaderboardFilter('GLOBAL')}
                    className={`px-3 py-1 font-label-bold uppercase tracking-wider transition-all ${
                      leaderboardFilter === 'GLOBAL' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    GLOBAL
                  </button>
                  <button 
                    onClick={() => setLeaderboardFilter('FRIENDS')}
                    className={`px-3 py-1 font-label-bold uppercase tracking-wider transition-all ${
                      leaderboardFilter === 'FRIENDS' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                    }`}
                  >
                    FRIENDS
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {initialLeaderboard
                  .filter(player => {
                    if (leaderboardFilter === 'FRIENDS') {
                      return player.isUser || player.rank === 13;
                    }
                    return true;
                  })
                  .map((player) => (
                    <div 
                      key={player.rank}
                      className={`flex items-center p-3 border transition-all ${
                        player.isUser 
                          ? 'bg-primary text-on-primary border-primary font-bold' 
                          : 'mono-card'
                      }`}
                    >
                      <span className={`w-8 font-h3 text-xs text-center italic font-bold ${
                        player.isUser ? 'text-on-primary' : 'text-on-surface-variant'
                      }`}>
                        {player.rank}
                      </span>
                      <img 
                        alt={player.isUser ? userName : player.name} 
                        className="w-10 h-10 rounded-none border border-outline-variant mr-3 object-cover" 
                        src={player.isUser 
                          ? (customAvatar || (selectedSkin === 'Cyber-Ronin' 
                              ? "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=100" 
                              : "https://lh3.googleusercontent.com/aida-public/AB6AXuCJP6U3HtC5Hj7ZVwX2eJSAM7Gr0A7eHiEs0jyJtCPy4ILF_7IlEszxCTbDUwJJI7PhHZLF8Au-9vBqEs2X2AFAvzPSLkBWvNDC_WAnPTo1_wRcjw5ww9suurW7-VIlv4z3HfpHJHhvHxTycb1tGKsEnK-aFsLxDu6iMxZ03kurGdW19PghA1Eew_gDcG1auPHwJ9Mo_hWGoGCTXEuUIdVbLWSLuT9p2J3ofbDEPdDh0CzG2SPGCc9c74TwEkGprQLJo9UKTPNouUI"
                            ))
                          : player.avatar
                        }
                      />
                      <div className="flex-grow">
                        <p className={`font-label-bold text-xs font-bold ${player.isUser ? 'text-on-primary' : 'text-on-surface'}`}>
                          {player.isUser ? userName : player.name}
                          {player.isUser && <span className="bg-surface-container-lowest text-on-surface text-[7px] px-1 py-0.5 ml-1.5 font-black uppercase border border-outline-variant">YOU</span>}
                        </p>
                        <p className={`text-[9px] uppercase tracking-wider ${player.isUser ? 'text-on-primary/80' : 'text-outline'}`}>{player.league}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-h3 text-xs font-bold">
                          {player.isUser ? xp + 7000 : player.xp}
                        </p>
                        <p className={`text-[8px] font-bold uppercase tracking-wider ${player.isUser ? 'text-on-primary/80' : 'text-secondary'}`}>XP</p>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        )}

        {/* Page 5: Profile & Skin Select */}
        {activePage === 'profile' && (
          <div className="space-y-6 animate-fade-in">
            {/* User Profile Card */}
            <section className="mono-card p-6 relative">
              
              {/* Customize Profile Toggle Button */}
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="absolute top-4 right-4 bg-primary text-on-primary hover:bg-transparent hover:text-primary transition-colors border border-primary text-[9px] uppercase font-bold py-1.5 px-3 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {isEditingProfile ? 'check' : 'settings'}
                </span>
                {isEditingProfile ? "Done" : "Customize"}
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img 
                    alt="User Portrait" 
                    className="w-20 h-20 border border-primary p-0.5 object-cover" 
                    src={customAvatar || (selectedSkin === 'Cyber-Ronin' 
                      ? "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=200" 
                      : "https://lh3.googleusercontent.com/aida-public/AB6AXuCJP6U3HtC5Hj7ZVwX2eJSAM7Gr0A7eHiEs0jyJtCPy4ILF_7IlEszxCTbDUwJJI7PhHZLF8Au-9vBqEs2X2AFAvzPSLkBWvNDC_WAnPTo1_wRcjw5ww9suurW7-VIlv4z3HfpHJHhvHxTycb1tGKsEnK-aFsLxDu6iMxZ03kurGdW19PghA1Eew_gDcG1auPHwJ9Mo_hWGoGCTXEuUIdVbLWSLuT9p2J3ofbDEPdDh0CzG2SPGCc9c74TwEkGprQLJo9UKTPNouUI"
                    )}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[8px] font-black px-1.5 py-0.5 border border-white">
                    Lvl {level}
                  </span>
                </div>

                {!isEditingProfile ? (
                  <>
                    <h2 className="font-h2 text-lg font-bold text-on-surface uppercase tracking-tight">{userName}</h2>
                    <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">{userTitle}</p>
                  </>
                ) : (
                  <div className="w-full max-w-xs mt-2 space-y-4 text-left border border-outline-variant p-4 bg-surface-container-low">
                    <span className="block text-[9px] font-bold text-primary uppercase tracking-widest mb-1">Edit Adventurer Card</span>
                    
                    <div>
                      <label className="block text-[8px] font-bold text-secondary uppercase tracking-wider mb-1">Adventurer Name</label>
                      <input 
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-secondary uppercase tracking-wider mb-1">Adventurer Title</label>
                      <input 
                        type="text"
                        value={userTitle}
                        onChange={(e) => setUserTitle(e.target.value)}
                        className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant px-3 py-1.5 text-xs focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-bold text-secondary uppercase tracking-wider mb-1">Custom Portrait Picture</label>
                      <div className="flex items-center gap-2 mt-1">
                        <input 
                          type="file"
                          accept="image/*"
                          id="user-avatar-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => {
                                setCustomAvatar(r.result);
                                triggerToast("Profile portrait customized! 👤");
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                        <label 
                          htmlFor="user-avatar-upload"
                          className="inline-block bg-primary text-on-primary border border-primary px-3 py-1 text-[8px] font-bold uppercase tracking-widest cursor-pointer hover:bg-transparent hover:text-primary transition-colors"
                        >
                          CHOOSE IMAGE
                        </label>
                        {customAvatar && (
                          <button 
                            type="button"
                            onClick={() => { setCustomAvatar(''); triggerToast("Cleared custom avatar"); }}
                            className="text-[8px] text-red-500 font-bold uppercase tracking-wider underline hover:opacity-80"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3 w-full mt-6 pt-6 border-t border-dashed border-outline-variant">
                <div className="p-3 bg-surface-container-low border border-outline-variant text-center">
                  <span className="block text-[8px] font-bold text-secondary uppercase tracking-wider">COINS</span>
                  <span className="text-sm font-bold text-primary">{coins}</span>
                </div>
                <div className="p-3 bg-surface-container-low border border-outline-variant text-center">
                  <span className="block text-[8px] font-bold text-secondary uppercase tracking-wider">XP</span>
                  <span className="text-sm font-bold text-primary">{xp}</span>
                </div>
                <div className="p-3 bg-surface-container-low border border-outline-variant text-center">
                  <span className="block text-[8px] font-bold text-secondary uppercase tracking-wider">STREAK</span>
                  <span className="text-sm font-bold text-primary">{streak}D</span>
                </div>
              </div>
            </section>

            {/* Skins Customizer section */}
            <section className="mono-card p-5 space-y-4">
              <h3 className="font-label-bold text-xs uppercase tracking-widest text-secondary font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined">checkroom</span>
                Avatar Customization
              </h3>
              
              <div className="space-y-2.5">
                {/* Default Skin */}
                <div 
                  onClick={() => { setSelectedSkin('Default'); setCustomAvatar(''); }}
                  className={`p-3 flex items-center justify-between border cursor-pointer transition-all ${
                    selectedSkin === 'Default' && !customAvatar
                      ? 'bg-surface-container-high border-black font-bold' 
                      : 'border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      className="w-8 h-8 border border-outline-variant object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJP6U3HtC5Hj7ZVwX2eJSAM7Gr0A7eHiEs0jyJtCPy4ILF_7IlEszxCTbDUwJJI7PhHZLF8Au-9vBqEs2X2AFAvzPSLkBWvNDC_WAnPTo1_wRcjw5ww9suurW7-VIlv4z3HfpHJHhvHxTycb1tGKsEnK-aFsLxDu6iMxZ03kurGdW19PghA1Eew_gDcG1auPHwJ9Mo_hWGoGCTXEuUIdVbLWSLuT9p2J3ofbDEPdDh0CzG2SPGCc9c74TwEkGprQLJo9UKTPNouUI"
                      alt="Default skin"
                    />
                    <div>
                      <h4 className="text-xs text-on-surface">Alex Venture (Default)</h4>
                      <p className="text-[9px] text-on-surface-variant uppercase tracking-wider">Standard Edition Skin</p>
                    </div>
                  </div>
                  {selectedSkin === 'Default' && !customAvatar && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                </div>

                {/* Cyber-Ronin Skin */}
                {shopItems[1].ownedCount > 0 ? (
                  <div 
                    onClick={() => { setSelectedSkin('Cyber-Ronin'); setCustomAvatar(''); }}
                    className={`p-3 flex items-center justify-between border cursor-pointer transition-all ${
                      selectedSkin === 'Cyber-Ronin' && !customAvatar
                        ? 'bg-surface-container-high border-black font-bold' 
                        : 'border-outline-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        className="w-8 h-8 border border-outline-variant object-cover" 
                        src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=100"
                        alt="Cyber-Ronin skin"
                      />
                      <div>
                        <h4 className="text-xs text-on-surface">Cyber-Ronin (Legendary)</h4>
                        <p className="text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Unlocked Skin</p>
                      </div>
                    </div>
                    {selectedSkin === 'Cyber-Ronin' && !customAvatar && <span className="material-symbols-outlined text-primary text-sm">check_circle</span>}
                  </div>
                ) : (
                  <div className="p-3 flex items-center justify-between border border-dashed border-outline-variant opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 border border-dashed border-outline-variant flex items-center justify-center bg-surface-container-low">
                        <span className="material-symbols-outlined text-outline text-md">lock</span>
                      </div>
                      <div>
                        <h4 className="text-xs text-on-surface">Cyber-Ronin (Legendary)</h4>
                        <p className="text-[9px] text-on-surface-variant font-semibold">Unlock in Armory for 450 coins</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setActivePage('shop'); setShopFilter('SKIN'); }}
                      className="bg-primary text-on-primary border border-primary text-[9px] font-bold px-3 py-1.5 hover:bg-transparent hover:text-primary transition-all uppercase tracking-widest"
                    >
                      Get
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

      </main>

      {/* New Quest FAB (Visible on Quest Page) */}
      {activePage === 'quests' && (
        <button 
          onClick={() => setIsQuestModalOpen(true)}
          className="fixed bottom-24 right-6 md:right-12 w-14 h-14 bg-primary text-on-primary shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 hover:shadow-[0_0_20px_rgba(0,0,0,0.25)] border border-outline"
          title="New Quest"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
        </button>
      )}

      {/* New Quest Dialog Modal */}
      {isQuestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="mono-card w-full max-w-md p-6 shadow-2xl relative animate-scale-up">
            <span 
              onClick={() => setIsQuestModalOpen(false)}
              className="material-symbols-outlined absolute top-4 right-4 text-outline cursor-pointer hover:text-black transition-all text-xl"
            >
              close
            </span>
            
            <h3 className="font-h3 text-lg font-bold text-on-surface mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-on-surface">edit_note</span>
              Craft Quest
            </h3>
            <p className="text-on-surface-variant text-[9px] mb-5 uppercase tracking-widest font-bold">Design your trials and challenges</p>

            <form onSubmit={handleCreateQuest} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Quest Title</label>
                <input 
                  type="text" 
                  value={newQuestTitle}
                  onChange={(e) => setNewQuestTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-none px-4 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                  placeholder="e.g. 15-Minute Meditation"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Description</label>
                <textarea 
                  value={newQuestDescription}
                  onChange={(e) => setNewQuestDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-none px-4 py-2 text-xs h-20 focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
                  placeholder="Describe your trial objectives..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Quest Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Bronze', 'Silver', 'Gold'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewQuestTier(t)}
                      className={`py-2 border transition-all text-[9px] font-bold uppercase tracking-wider ${
                        newQuestTier === t 
                          ? 'bg-primary text-on-primary border-primary font-bold' 
                          : 'bg-surface-container-lowest hover:bg-surface-container-high border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-primary text-on-primary font-label-bold text-xs py-3 border border-primary hover:bg-transparent hover:text-primary transition-all uppercase tracking-widest font-bold"
                >
                  Forge Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reward Customizer Dialog Modal (Create & Edit Shop Items with Image Upload) */}
      {isShopModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="mono-card w-full max-w-md p-6 shadow-2xl relative animate-scale-up">
            <span 
              onClick={() => setIsShopModalOpen(false)}
              className="material-symbols-outlined absolute top-4 right-4 text-outline cursor-pointer hover:text-black transition-all text-xl"
            >
              close
            </span>
            
            <h3 className="font-h3 text-lg font-bold text-on-surface mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-on-surface">storefront</span>
              {editingShopItem ? 'Edit Reward Item' : 'Forge Custom Reward'}
            </h3>
            <p className="text-on-surface-variant text-[9px] mb-5 uppercase tracking-widest font-bold">Customize item pricing, labels, and graphics</p>

            <form onSubmit={handleSaveShopItem} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Reward Title</label>
                <input 
                  type="text" 
                  value={shopItemTitle}
                  onChange={(e) => setShopItemTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-none px-4 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                  placeholder="e.g. 1-Hour Premium Nap"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Description</label>
                <textarea 
                  value={shopItemDescription}
                  onChange={(e) => setShopItemDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-none px-4 py-2 text-xs h-16 focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
                  placeholder="Redeem rules or extra context..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Coin Cost</label>
                  <input 
                    type="number" 
                    value={shopItemCost}
                    onChange={(e) => setShopItemCost(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-none px-4 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Category</label>
                  <select 
                    value={shopItemCategory}
                    onChange={(e) => setShopItemCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-none px-4 py-2.5 text-xs focus:outline-none focus:border-black focus:bg-white transition-all h-[38px] cursor-pointer"
                  >
                    <option value="Digital">Digital</option>
                    <option value="Skin">Skin</option>
                    <option value="Real World">Real World</option>
                    <option value="Booster">Booster</option>
                  </select>
                </div>
              </div>

              {/* Graphic/Image Customization Section */}
              <div>
                <label className="block text-[9px] font-bold text-secondary mb-1.5 uppercase tracking-wider">Reward Graphic (Upload local file)</label>
                
                <div className="flex gap-3 items-center mt-1">
                  <div className="w-16 h-12 border border-outline-variant bg-surface-container-high overflow-hidden flex items-center justify-center flex-shrink-0">
                    {shopItemImage ? (
                      <img src={shopItemImage} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <span className="material-symbols-outlined text-outline text-lg">image</span>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      accept="image/*"
                      id="shop-image-file"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                    <label 
                      htmlFor="shop-image-file"
                      className="inline-block bg-surface-container-high border border-outline-variant px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-colors"
                    >
                      CHOOSE IMAGE
                    </label>
                    <span className="text-[8px] text-on-surface-variant block mt-1">Supports PNG, JPG, WebP</span>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-[8px] font-bold text-secondary mb-1 uppercase tracking-wider">Or enter image URL</label>
                  <input 
                    type="url"
                    value={shopItemImage && !shopItemImage.startsWith('data:') ? shopItemImage : ''}
                    onChange={(e) => setShopItemImage(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="w-full bg-surface-container-lowest text-on-surface border border-outline-variant rounded-none px-4 py-2 text-xs focus:outline-none focus:border-black transition-all"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-primary text-on-primary font-label-bold text-xs py-3 border border-primary hover:bg-transparent hover:text-primary transition-all uppercase tracking-widest font-bold"
                >
                  {editingShopItem ? 'Save Updates' : 'Forge Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="bg-surface/95 backdrop-blur-md fixed bottom-0 left-0 w-full z-45 flex justify-around items-center px-4 pb-5 pt-2 border-t border-outline-variant transition-colors">
        
        <button 
          onClick={() => setActivePage('dashboard')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 active:scale-90 transition-all duration-200 ${
            activePage === 'dashboard' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activePage === 'dashboard' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            dashboard
          </span>
          <span className="font-label-bold text-[9px] uppercase tracking-widest mt-0.5">Home</span>
        </button>

        <button 
          onClick={() => setActivePage('quests')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 active:scale-90 transition-all duration-200 ${
            activePage === 'quests' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activePage === 'quests' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            checklist
          </span>
          <span className="font-label-bold text-[9px] uppercase tracking-widest mt-0.5">Quests</span>
        </button>

        <button 
          onClick={() => setActivePage('shop')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 active:scale-90 transition-all duration-200 ${
            activePage === 'shop' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activePage === 'shop' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            storefront
          </span>
          <span className="font-label-bold text-[9px] uppercase tracking-widest mt-0.5">Shop</span>
        </button>

        <button 
          onClick={() => setActivePage('rank')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 active:scale-90 transition-all duration-200 ${
            activePage === 'rank' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activePage === 'rank' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            military_tech
          </span>
          <span className="font-label-bold text-[9px] uppercase tracking-widest mt-0.5">Rank</span>
        </button>

        <button 
          onClick={() => setActivePage('profile')}
          className={`flex flex-col items-center justify-center px-4 py-1.5 active:scale-90 transition-all duration-200 ${
            activePage === 'profile' 
              ? 'text-primary font-bold border-b-2 border-primary' 
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" style={activePage === 'profile' ? { fontVariationSettings: "'FILL' 1" } : {}}>
            person
          </span>
          <span className="font-label-bold text-[9px] uppercase tracking-widest mt-0.5">Profile</span>
        </button>

      </nav>
    </div>
  );
}
