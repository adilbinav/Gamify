const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory data
let userStats = {
  coins: 1250,
  xp: 8450,
  level: 24,
  streak: 7,
  completedQuestsCount: 142,
  completedToday: [
    { id: 101, title: "Read 20 Pages", tier: "Silver", type: "Daily Habit", xp: 150 },
    { id: 102, title: "No Sugary Snacks", tier: "Bronze", type: "Daily Habit", xp: 50 }
  ]
};

let quests = [
  {
    id: 1,
    title: "Morning 5K Run",
    description: "Lace up and complete a 5km outdoor run before 9 AM.",
    tier: "Gold",
    xpReward: 500,
    coinReward: 100,
    status: "claimable", 
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
    progress: 40 
  }
];

let shopItems = [
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
  }
];

// --- User Endpoints ---
app.get('/api/user', (req, res) => {
  res.json(userStats);
});

app.post('/api/user/streak', (req, res) => {
  userStats.streak += 1;
  userStats.coins += 150;
  userStats.xp += 300;
  // check level up
  if (userStats.xp >= 10000) {
      userStats.level += 1;
      userStats.xp -= 10000;
  }
  res.json(userStats);
});

// --- Quests Endpoints ---
app.get('/api/quests', (req, res) => {
  res.json(quests);
});

app.post('/api/quests', (req, res) => {
  const newQuest = { ...req.body, id: Date.now() };
  quests = [newQuest, ...quests];
  res.json(newQuest);
});

app.delete('/api/quests/:id', (req, res) => {
  const { id } = req.params;
  quests = quests.filter(q => q.id !== Number(id));
  res.json({ success: true });
});

app.put('/api/quests/:id/complete', (req, res) => {
    const { id } = req.params;
    let updatedQuest = null;
    quests = quests.map(q => {
      if (q.id === Number(id)) {
        updatedQuest = { ...q, status: 'claimable', progress: 100 };
        return updatedQuest;
      }
      return q;
    });
    res.json(updatedQuest);
});

app.put('/api/quests/:id/claim', (req, res) => {
  const { id } = req.params;
  const quest = quests.find(q => q.id === Number(id));
  
  if (quest) {
    userStats.xp += quest.xpReward;
    userStats.coins += quest.coinReward;
    
    // check level up
    if (userStats.xp >= 10000) {
        userStats.level += 1;
        userStats.xp -= 10000;
    }

    userStats.completedToday.unshift({
        id: Date.now(),
        title: quest.title,
        tier: quest.tier,
        type: "One-time Quest",
        xp: quest.xpReward
    });
    
    quests = quests.filter(q => q.id !== Number(id));
    res.json({ success: true, userStats, quest });
  } else {
    res.status(404).json({ error: "Quest not found" });
  }
});

// Hydration special case
app.put('/api/quests/:id/hydrate', (req, res) => {
    const { id } = req.params;
    let updatedQuest = null;
    quests = quests.map(q => {
        if (q.id === Number(id)) {
            const nextProgress = Math.min(100, q.progress + 20);
            const nextStatus = nextProgress === 100 ? 'claimable' : 'active';
            updatedQuest = { ...q, progress: nextProgress, status: nextStatus };
            return updatedQuest;
        }
        return q;
    });
    res.json(updatedQuest);
})

// --- Shop Endpoints ---
app.get('/api/shop', (req, res) => {
  res.json(shopItems);
});

app.post('/api/shop', (req, res) => {
  const newItem = { ...req.body, id: Date.now(), ownedCount: 0 };
  shopItems = [newItem, ...shopItems];
  res.json(newItem);
});

app.put('/api/shop/:id', (req, res) => {
    const { id } = req.params;
    let updatedItem = null;
    shopItems = shopItems.map(s => {
        if (s.id === Number(id)) {
            updatedItem = { ...s, ...req.body };
            return updatedItem;
        }
        return s;
    });
    res.json(updatedItem);
});

app.delete('/api/shop/:id', (req, res) => {
  const { id } = req.params;
  shopItems = shopItems.filter(s => s.id !== Number(id));
  res.json({ success: true });
});

app.post('/api/shop/:id/purchase', (req, res) => {
  const { id } = req.params;
  let purchasedItem = null;
  let success = false;

  shopItems = shopItems.map(s => {
    if (s.id === Number(id)) {
      if (userStats.coins >= s.cost) {
        userStats.coins -= s.cost;
        s.ownedCount += 1;
        purchasedItem = s;
        success = true;
      }
    }
    return s;
  });

  if (success) {
    res.json({ success: true, userStats, purchasedItem });
  } else {
    res.status(400).json({ error: "Insufficient coins or item not found" });
  }
});

// Serve static files from the Vite build
const path = require('path');
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT_ENV = process.env.PORT || PORT;
app.listen(PORT_ENV, () => {
  console.log(`Server is running on port ${PORT_ENV}`);
});
