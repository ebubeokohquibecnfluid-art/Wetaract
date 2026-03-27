
import React, { useState, useEffect } from 'react';
import { 
  Rocket, 
  Plus, 
  BarChart3, 
  Target, 
  Zap, 
  Coins, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  Instagram, 
  Twitter, 
  Youtube, 
  Music2, 
  Globe, 
  Sparkles,
  Cpu,
  Info,
  ChevronRight,
  Loader2,
  Trash2
} from 'lucide-react';
import { CampaignTask, SocialPlatform, UserProfile, CampaignType, MembershipStatus } from '../types';

interface AdManagerProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const AdManager: React.FC<AdManagerProps> = ({ user, onUpdateUser }) => {
  const [myCampaigns, setMyCampaigns] = useState<CampaignTask[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Create Form State
  const [newCampaign, setNewCampaign] = useState({
    type: CampaignType.PAID,
    platform: SocialPlatform.INSTAGRAM,
    actionType: 'Like',
    link: '',
    rewardType: 'Points' as 'Points' | 'Cash' | 'Reciprocity',
    rewardValue: 50,
    totalSlots: 100,
    description: '',
    useAI: true
  });

  useEffect(() => {
    // In a real app, we'd fetch only the user's campaigns
    // For now, we'll simulate fetching from the server
    fetch('/api/v1/campaigns')
      .then(res => res.json())
      .then(data => {
        // Filter campaigns where creatorId matches user.id (or mock it)
        setMyCampaigns(data.filter((c: any) => c.creatorId === user.id || c.id.startsWith('mc')));
        setIsLoading(false);
      });
  }, [user.id]);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    // Calculate budget
    const budget = newCampaign.type === CampaignType.PAID && newCampaign.rewardType === 'Cash' 
      ? newCampaign.rewardValue * newCampaign.totalSlots 
      : 0;
    
    if (newCampaign.type === CampaignType.PAID && budget > user.walletBalance && newCampaign.rewardType === 'Cash') {
      alert("Insufficient wallet balance for this campaign budget.");
      setIsCreating(false);
      return;
    }

    if (newCampaign.type === CampaignType.RECIPROCITY && user.membershipStatus !== MembershipStatus.ACTIVE) {
      alert("Reciprocity campaigns are exclusive to active subscribers. Please upgrade your membership.");
      setIsCreating(false);
      return;
    }

    try {
      // Simulate API call to create campaign
      const response = await fetch('/api/v1/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCampaign,
          creatorId: user.id,
          creatorName: user.name,
          creatorAvatar: user.avatar,
          creatorInterests: user.interests,
          remainingSlots: newCampaign.totalSlots,
          budget
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMyCampaigns(prev => [result.campaign, ...prev]);
        onUpdateUser(result.user);
        setIsCreating(false);
        // Reset form or close modal
        alert("Campaign launched successfully!");
      }
    } catch (error) {
      alert("Failed to create campaign.");
      setIsCreating(false);
    }
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM: return <Instagram size={18} className="text-pink-500" />;
      case SocialPlatform.TIKTOK: return <Music2 size={18} className="text-cyan-400" />;
      case SocialPlatform.TWITTER: return <Twitter size={18} className="text-blue-400" />;
      case SocialPlatform.YOUTUBE: return <Youtube size={18} className="text-red-500" />;
      default: return <Globe size={18} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Ad Campaign Manager</h1>
          <p className="text-slate-500 font-medium">Create and track your content boost campaigns</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <Coins size={16} className="text-amber-400" />
            <span className="text-sm font-bold text-white">${user.walletBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Campaign Form */}
        <div className="lg:col-span-1">
          <div className="glass p-8 rounded-[2.5rem] border-slate-800/50 sticky top-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Rocket size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">New Campaign</h3>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Campaign Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[CampaignType.PAID, CampaignType.RECIPROCITY].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewCampaign(prev => ({ 
                        ...prev, 
                        type: t,
                        rewardType: t === CampaignType.RECIPROCITY ? 'Reciprocity' : 'Points'
                      }))}
                      className={`py-3 rounded-xl border text-xs font-bold transition-all ${newCampaign.type === t ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {newCampaign.type === CampaignType.RECIPROCITY && (
                  <p className="text-[9px] text-amber-400 font-medium mt-1">
                    * Reciprocity tasks are sent to everyone. You must also respond to others' tasks.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Platform</label>
                <div className="grid grid-cols-4 gap-2">
                  {[SocialPlatform.INSTAGRAM, SocialPlatform.TIKTOK, SocialPlatform.TWITTER, SocialPlatform.YOUTUBE].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewCampaign(prev => ({ ...prev, platform: p }))}
                      className={`p-3 rounded-xl border flex items-center justify-center transition-all ${newCampaign.platform === p ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                    >
                      {getPlatformIcon(p)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Action Type</label>
                <select 
                  value={newCampaign.actionType}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, actionType: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500/50"
                >
                  <option value="Like">Like</option>
                  <option value="Follow">Follow</option>
                  <option value="Comment">Comment</option>
                  <option value="Repost">Repost</option>
                  <option value="View">View</option>
                  <option value="Stream">Stream</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Content Link</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://..."
                  value={newCampaign.link}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              {newCampaign.type === CampaignType.PAID && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reward Type</label>
                    <select 
                      value={newCampaign.rewardType}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, rewardType: e.target.value as 'Points' | 'Cash' }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500/50"
                    >
                      <option value="Points">Points</option>
                      <option value="Cash">Cash (USD/NGN)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Value per Action</label>
                    <input 
                      type="number" 
                      required
                      step="0.01"
                      value={newCampaign.rewardValue}
                      onChange={(e) => setNewCampaign(prev => ({ ...prev, rewardValue: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Targets (Slots)</label>
                <input 
                  type="number" 
                  required
                  value={newCampaign.totalSlots}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, totalSlots: Number(e.target.value) }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Estimated Reach</span>
                  <span className="text-indigo-400">~{(newCampaign.totalSlots * 25).toLocaleString()} People</span>
                </div>
                {newCampaign.type === CampaignType.PAID ? (
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Total Budget</span>
                    <span className="text-white">
                      {newCampaign.rewardType === 'Cash' ? `$${(newCampaign.rewardValue * newCampaign.totalSlots).toFixed(2)}` : `${newCampaign.rewardValue * newCampaign.totalSlots} Points`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Cost</span>
                    <span className="text-emerald-400 font-bold">FREE (RECIPROCITY)</span>
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isCreating}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isCreating ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <Zap size={18} />
                    Launch Campaign
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Campaign List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-white">Active Campaigns</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <BarChart3 size={14} />
              Real-time tracking
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="font-medium">Loading your campaigns...</p>
            </div>
          ) : myCampaigns.length > 0 ? (
            <div className="space-y-4">
              {myCampaigns.map(camp => (
                <div key={camp.id} className="glass p-6 rounded-[2rem] border-slate-800/50 hover:border-indigo-500/30 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 relative">
                        {getPlatformIcon(camp.platform)}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-slate-950">
                          <CheckCircle2 size={10} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">{camp.actionType} Boost</p>
                          <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">Active</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{camp.link}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reach</p>
                        <p className="text-lg font-black text-white">{(camp.reachCount || 0).toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Progress</p>
                        <p className="text-lg font-black text-white">{Math.round(((camp.totalSlots - camp.remainingSlots) / camp.totalSlots) * 100)}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Type</p>
                        <p className="text-sm font-bold text-white">{camp.type || CampaignType.PAID}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Reward</p>
                        <p className={`text-lg font-black ${camp.type === CampaignType.RECIPROCITY ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {camp.type === CampaignType.RECIPROCITY ? 'Pact' : (camp.rewardType === 'Cash' ? `$${camp.rewardValue.toFixed(2)}` : `${camp.rewardValue} P`)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-3 bg-slate-900 rounded-xl text-slate-500 hover:text-white border border-slate-800 transition-all">
                        <BarChart3 size={18} />
                      </button>
                      <button className="p-3 bg-slate-900 rounded-xl text-rose-500/50 hover:text-rose-500 border border-slate-800 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000"
                      style={{ width: `${((camp.totalSlots - camp.remainingSlots) / camp.totalSlots) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-32 flex flex-col items-center justify-center text-center glass rounded-[3rem] border-dashed border-slate-800">
              <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-800">
                <Rocket size={40} className="text-slate-700" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">No active campaigns</h4>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">Launch your first campaign to start seeing organic growth in real-time.</p>
            </div>
          )}

          {/* AI Insights */}
          <div className="glass p-8 rounded-[2.5rem] border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-indigo-900/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Sparkles size={20} className="text-amber-500" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">AI Smart Advertiser</h4>
                <p className="text-xs text-slate-500">Optimization engine active</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  <Cpu size={14} />
                  Niche Targeting
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Our AI identifies the best creator circles for your content based on your profile interests: <span className="text-white font-bold">{user.interests.join(', ')}</span>.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  <CheckCircle2 size={14} />
                  Verification Engine
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every completion is verified by our automated engine before rewards are released. No fake engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdManager;
