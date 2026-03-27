
export enum MembershipStatus {
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE'
}

export enum SocialPlatform {
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  TWITTER = 'Twitter',
  YOUTUBE = 'YouTube',
  FACEBOOK = 'Facebook',
  SPOTIFY = 'Spotify'
}

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: string;
}

export interface WalletTransaction {
  id: string;
  type: 'Earning' | 'Withdrawal' | 'Campaign_Spend' | 'Deposit';
  amount: number;
  date: string;
  status: 'Pending' | 'Completed';
  description: string;
}

export enum CampaignType {
  PAID = 'Paid',
  RECIPROCITY = 'Reciprocity'
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  handles: Record<SocialPlatform, string>;
  membershipStatus: MembershipStatus;
  isEliteVerified: boolean;
  joinedAt: string;
  followingCount: number;
  followersCount: number;
  points: number;
  walletBalance: number;
  totalWithdrawn: number;
  transactions: WalletTransaction[];
  interests: string[];
  referralStats: ReferralStats;
  warnings: number;
  visibilityScore: number; // 0-100
  engagementRate: number; // percentage
}

export interface CampaignCompletion {
  userId: string;
  userName: string;
  timestamp: string;
}

export interface CampaignTask {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorInterests: string[];
  platform: SocialPlatform;
  actionType: 'Like' | 'Follow' | 'Comment' | 'Share' | 'Stream' | 'View' | 'Repost' | 'Play';
  link: string;
  rewardType: 'Points' | 'Cash' | 'Reciprocity';
  rewardValue: number;
  remainingSlots: number;
  totalSlots: number;
  description: string;
  location?: string;
  useAI?: boolean;
  reachCount?: number;
  budget?: number;
  platformFee?: number;
  completions?: CampaignCompletion[];
  type?: CampaignType;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
}
