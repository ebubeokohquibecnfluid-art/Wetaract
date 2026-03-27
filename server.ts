import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { MembershipStatus, SocialPlatform, UserProfile, CampaignTask, WalletTransaction, CampaignType } from "./types";

const app = express();
const PORT = 3000;

app.use(express.json());

// Mock Data
let mockUser: UserProfile = {
  id: 'u1',
  name: 'Bubee Wetaract',
  username: 'bubee',
  avatar: 'https://picsum.photos/seed/bubee/200',
  handles: {
    [SocialPlatform.INSTAGRAM]: '@bubee_insta',
    [SocialPlatform.TIKTOK]: '@bubee_tiktok',
    [SocialPlatform.TWITTER]: '@bubee_x',
    [SocialPlatform.YOUTUBE]: 'BubeeVlogs',
    [SocialPlatform.FACEBOOK]: 'bubee.official',
    [SocialPlatform.SPOTIFY]: 'bubee_music'
  },
  membershipStatus: MembershipStatus.ACTIVE,
  isEliteVerified: true,
  joinedAt: '2024-01-15',
  followingCount: 1240,
  followersCount: 850,
  points: 2450,
  walletBalance: 125.50,
  totalWithdrawn: 450.00,
  transactions: [
    { id: 't1', type: 'Earning', amount: 2.50, date: '2024-02-20', status: 'Completed', description: 'Campaign Reward: YouTube View' },
    { id: 't2', type: 'Withdrawal', amount: 50.00, date: '2024-02-18', status: 'Completed', description: 'Bank Transfer' },
    { id: 't3', type: 'Campaign_Spend', amount: 10.00, date: '2024-02-15', status: 'Completed', description: 'New Campaign: Instagram Like' }
  ],
  interests: ['Tech', 'Music', 'Travel', 'Gaming'],
  referralStats: {
    referralCode: 'BUBEE24',
    totalReferrals: 12,
    totalEarnings: 120.00,
    pendingEarnings: 15.00,
    conversionRate: '15%'
  },
  warnings: 0,
  visibilityScore: 85,
  engagementRate: 12
};

let userReciprocityCompletions: Record<string, boolean> = {};

let mockCampaigns: CampaignTask[] = [
  {
    id: '1',
    creatorId: 'c1',
    creatorName: 'Alex Rivers',
    creatorAvatar: 'https://picsum.photos/seed/alex/200',
    creatorInterests: ['Travel', 'Photography', 'Lifestyle'],
    platform: SocialPlatform.INSTAGRAM,
    actionType: 'Like',
    link: 'https://instagram.com/p/123',
    rewardType: 'Points',
    rewardValue: 50,
    remainingSlots: 45,
    totalSlots: 100,
    description: 'Check out my latest travel photography from Bali! Would appreciate the love.',
  },
  {
    id: 'p1',
    creatorId: 'c-paid-1',
    creatorName: 'Global Brands Inc.',
    creatorAvatar: 'https://picsum.photos/seed/brand/200',
    creatorInterests: ['Tech', 'Business', 'Marketing'],
    platform: SocialPlatform.YOUTUBE,
    actionType: 'View',
    link: 'https://youtube.com/watch?v=paid-video',
    rewardType: 'Cash',
    rewardValue: 2.50,
    remainingSlots: 240,
    totalSlots: 500,
    description: 'Watch our new product launch video for at least 3 minutes to earn real cash reward!',
    useAI: true
  },
  {
    id: '2',
    creatorId: 'c2',
    creatorName: 'DJ Nexus',
    creatorAvatar: 'https://picsum.photos/seed/nexus/200',
    creatorInterests: ['Music', 'Nightlife', 'Tech'],
    platform: SocialPlatform.YOUTUBE,
    actionType: 'Play',
    link: 'https://youtube.com/watch?v=456',
    rewardType: 'Points',
    rewardValue: 150,
    remainingSlots: 10,
    totalSlots: 500,
    description: 'New track just dropped! Please play and stream for at least 60 seconds.',
  },
  {
    id: 'p2',
    creatorId: 'c-paid-2',
    creatorName: 'GameHub Pro',
    creatorAvatar: 'https://picsum.photos/seed/game/200',
    creatorInterests: ['Gaming', 'Tech', 'Entertainment'],
    platform: SocialPlatform.TWITTER,
    actionType: 'Repost',
    link: 'https://twitter.com/gamehub/status/123',
    rewardType: 'Cash',
    rewardValue: 1.00,
    remainingSlots: 15,
    totalSlots: 100,
    description: 'Repost our latest giveaway post to win a PS5 and earn instant cash.',
    location: 'USA'
  }
];

let mockMembers = [
  { 
    id: 'u1', 
    name: 'Elena Gilbert', 
    username: 'elenag', 
    avatar: 'https://picsum.photos/seed/elena/200', 
    points: 4500, 
    status: 'Active', 
    isEliteVerified: true,
    synced: true,
    interests: ['Tech', 'Gadgets', 'Lifestyle'],
    handles: {
      [SocialPlatform.INSTAGRAM]: 'https://instagram.com/elenag',
      [SocialPlatform.TIKTOK]: 'https://tiktok.com/@elenag',
      [SocialPlatform.SPOTIFY]: 'https://open.spotify.com/user/elenag'
    }
  },
  { 
    id: 'u2', 
    name: 'Damon Salvatore', 
    username: 'damons', 
    avatar: 'https://picsum.photos/seed/damon/200', 
    points: 3200, 
    status: 'Pro', 
    isEliteVerified: true,
    synced: true,
    interests: ['Cars', 'Music', 'Tech'],
    handles: {
      [SocialPlatform.INSTAGRAM]: 'https://instagram.com/damons',
      [SocialPlatform.SPOTIFY]: 'https://open.spotify.com/user/damons'
    }
  },
  { 
    id: 'u3', 
    name: 'Stefan Salvatore', 
    username: 'stefans', 
    avatar: 'https://picsum.photos/seed/stefan/200', 
    points: 5100, 
    status: 'Elite', 
    isEliteVerified: true,
    synced: true,
    interests: ['Books', 'Health', 'Cooking'],
    handles: {
      [SocialPlatform.YOUTUBE]: 'https://youtube.com/@stefans',
      [SocialPlatform.SPOTIFY]: 'https://open.spotify.com/user/stefans'
    }
  },
  { 
    id: 'u4', 
    name: 'Bonnie Bennett', 
    username: 'bonnieb', 
    avatar: 'https://picsum.photos/seed/bonnie/200', 
    points: 2800, 
    status: 'Active', 
    isEliteVerified: false,
    synced: true,
    interests: ['Music', 'Art', 'Tech'],
    handles: {
      [SocialPlatform.TWITTER]: 'https://twitter.com/bonnieb',
      [SocialPlatform.INSTAGRAM]: 'https://instagram.com/bonnieb'
    }
  },
  { 
    id: 'u5', 
    name: 'Caroline Forbes', 
    username: 'carolinef', 
    avatar: 'https://picsum.photos/seed/caroline/200', 
    points: 1900, 
    status: 'Active', 
    isEliteVerified: false,
    synced: false,
    interests: ['Lifestyle', 'Beauty', 'Fashion'],
    handles: {
      [SocialPlatform.INSTAGRAM]: 'https://instagram.com/carolinef'
    }
  },
];

// API Routes
app.get("/api/v1/community", (req, res) => {
  res.json(mockMembers);
});

app.get("/api/v1/user", (req, res) => {
  res.json(mockUser);
});

app.patch("/api/v1/user", (req, res) => {
  mockUser = { ...mockUser, ...req.body };
  res.json(mockUser);
});

app.post("/api/v1/auth/login", (req, res) => {
  // Simple mock login
  res.json({ success: true, user: mockUser });
});

app.post("/api/v1/membership/upgrade", (req, res) => {
  mockUser.membershipStatus = MembershipStatus.ACTIVE;
  res.json({ success: true, user: mockUser });
});

app.get("/api/v1/campaigns", (req, res) => {
  res.json(mockCampaigns);
});

app.post("/api/v1/campaigns", (req, res) => {
  const campaignData = req.body;
  const budget = campaignData.budget || 0;
  
  if (campaignData.type === CampaignType.PAID && budget > mockUser.walletBalance) {
    return res.status(400).json({ error: "Insufficient balance" });
  }

  if (campaignData.type === CampaignType.RECIPROCITY && mockUser.membershipStatus !== MembershipStatus.ACTIVE) {
    return res.status(403).json({ error: "Only active subscribers can launch reciprocity campaigns" });
  }

  const newCampaign: CampaignTask = {
    ...campaignData,
    id: `mc-${Date.now()}`,
    remainingSlots: campaignData.totalSlots,
    reachCount: 0,
    completions: []
  };

  mockCampaigns.unshift(newCampaign);
  
  if (campaignData.type === CampaignType.PAID && budget > 0) {
    mockUser.walletBalance -= budget;
    mockUser.transactions.unshift({
      id: `t-${Date.now()}`,
      type: 'Campaign_Spend',
      amount: budget,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      description: `Campaign Launch: ${newCampaign.platform} ${newCampaign.actionType}`
    });
  }

  res.json({ success: true, campaign: newCampaign, user: mockUser });
});

app.get("/api/v1/reciprocity/tasks", (req, res) => {
  const tasks = mockCampaigns.filter(c => c.type === CampaignType.RECIPROCITY && c.creatorId !== mockUser.id);
  const pendingTasks = tasks.filter(t => !userReciprocityCompletions[t.id]);
  res.json(pendingTasks);
});

app.post("/api/v1/reciprocity/complete", (req, res) => {
  const { taskId } = req.body;
  const task = mockCampaigns.find(c => c.id === taskId);
  if (task) {
    userReciprocityCompletions[taskId] = true;
    task.remainingSlots = Math.max(0, task.remainingSlots - 1);
    
    // Reward logic
    mockUser.points += 10;
    mockUser.visibilityScore = Math.min(100, mockUser.visibilityScore + 2);
    mockUser.engagementRate = Math.min(100, mockUser.engagementRate + 0.5);

    res.json({ success: true, user: mockUser });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.post("/api/v1/reciprocity/ignore", (req, res) => {
  const { taskId } = req.body;
  mockUser.warnings += 1;
  
  // Penalty logic
  mockUser.points = Math.max(0, mockUser.points - 50);
  mockUser.visibilityScore = Math.max(0, mockUser.visibilityScore - 10);
  mockUser.engagementRate = Math.max(0, mockUser.engagementRate - 2);

  res.json({ success: true, user: mockUser });
});

app.post("/api/v1/points/convert", (req, res) => {
  const { type } = req.body; // 'subscription' or 'visibility'
  
  if (type === 'subscription') {
    if (mockUser.points >= 5000) {
      mockUser.points -= 5000;
      mockUser.membershipStatus = MembershipStatus.ACTIVE;
      res.json({ success: true, message: "Subscription activated!", user: mockUser });
    } else {
      res.status(400).json({ error: "Insufficient points. Need 5000 points." });
    }
  } else if (type === 'visibility') {
    if (mockUser.points >= 1000) {
      mockUser.points -= 1000;
      mockUser.visibilityScore = Math.min(100, mockUser.visibilityScore + 20);
      res.json({ success: true, message: "Visibility boosted!", user: mockUser });
    } else {
      res.status(400).json({ error: "Insufficient points. Need 1000 points." });
    }
  } else {
    res.status(400).json({ error: "Invalid conversion type" });
  }
});

app.post("/api/v1/reciprocity/appeal", (req, res) => {
  // Mock appeal
  res.json({ success: true, message: "Appeal sent to support@wetaract.com" });
});

app.post("/api/v1/campaigns/:id/complete", (req, res) => {
  const { id } = req.params;
  const campaign = mockCampaigns.find(c => c.id === id);
  if (campaign && campaign.remainingSlots > 0) {
    campaign.remainingSlots -= 1;
    if (campaign.rewardType === 'Cash') {
      mockUser.walletBalance += campaign.rewardValue;
      mockUser.transactions.unshift({
        id: `t${Date.now()}`,
        type: 'Earning',
        amount: campaign.rewardValue,
        date: new Date().toISOString().split('T')[0],
        status: 'Completed',
        description: `Campaign Reward: ${campaign.platform} ${campaign.actionType}`
      });
    } else {
      mockUser.points += campaign.rewardValue;
    }
    res.json({ success: true, user: mockUser, campaign });
  } else {
    res.status(400).json({ error: "Campaign not found or no slots left" });
  }
});

app.get("/api/v1/wallet", (req, res) => {
  res.json({
    balance: mockUser.walletBalance,
    transactions: mockUser.transactions,
    totalWithdrawn: mockUser.totalWithdrawn
  });
});

app.post("/api/v1/wallet/deposit", (req, res) => {
  const { amount, gateway } = req.body;
  if (amount > 0) {
    mockUser.walletBalance += amount;
    mockUser.transactions.unshift({
      id: `dep-${Date.now()}`,
      type: 'Deposit',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      description: `Deposit via ${gateway === 'paystack' ? 'Paystack' : 'Flutterwave'}`
    });
    res.json({ success: true, user: mockUser });
  } else {
    res.status(400).json({ error: "Invalid amount" });
  }
});

app.post("/api/v1/wallet/withdraw", (req, res) => {
  const { amount } = req.body;
  if (amount <= mockUser.walletBalance) {
    mockUser.walletBalance -= amount;
    mockUser.totalWithdrawn += amount;
    mockUser.transactions.unshift({
      id: `t${Date.now()}`,
      type: 'Withdrawal',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      description: 'Withdrawal to Bank'
    });
    res.json({ success: true, user: mockUser });
  } else {
    res.status(400).json({ error: "Insufficient balance" });
  }
});

// Vite middleware for development
async function startServer() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, the bundled server is in dist/
    // and the static files are also in dist/
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
