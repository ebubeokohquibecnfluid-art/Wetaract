
import React, { useState } from 'react';
import { Search, Filter, Rocket, Sparkles, Zap, Activity, Coins } from 'lucide-react';
import CampaignCard from '../components/CampaignCard';
import { CampaignTask, SocialPlatform } from '../types';

const MOCK_TASKS: CampaignTask[] = [
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
  },
  {
    id: '3',
    creatorId: 'c3',
    creatorName: 'Tech Reviews',
    creatorAvatar: 'https://picsum.photos/seed/tech/200',
    creatorInterests: ['Tech', 'Gadgets', 'Software'],
    platform: SocialPlatform.TWITTER,
    actionType: 'Repost',
    link: 'https://twitter.com/status/789',
    rewardType: 'Points',
    rewardValue: 75,
    remainingSlots: 120,
    totalSlots: 200,
    description: 'iPhone 15 Giveaway! Repost to enter the pool.',
  },
];

interface CampaignsProps {
  currentUserInterests: string[];
}

const Campaigns: React.FC<CampaignsProps> = ({ currentUserInterests }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState<CampaignTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<'all' | 'niche' | 'paid'>('all');

  React.useEffect(() => {
    fetch('/api/v1/campaigns')
      .then(res => res.json())
      .then(data => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Failed to fetch campaigns", err));
  }, []);

  const handleAction = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/campaigns/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const result = await response.json();
        setTasks(prev => prev.map(t => 
          t.id === id ? result.campaign : t
        ));
        
        if (result.campaign.rewardType === 'Cash') {
          alert(`Paid task completed! $${result.campaign.rewardValue.toFixed(2)} added to your pending balance.`);
        } else {
          alert("Task completed! Reciprocity notification sent to the creator. Points pending verification.");
        }
      } else {
        alert("Failed to complete task.");
      }
    } catch (error) {
      alert("Connectivity error.");
    }
  };

  const filteredTasks = tasks.filter(t => {
    const platformMatch = activeTab === 'all' || t.platform === activeTab;
    let typeMatch = true;
    if (filterMode === 'niche') typeMatch = t.creatorInterests.some(i => currentUserInterests.includes(i));
    if (filterMode === 'paid') typeMatch = t.rewardType === 'Cash';
    return platformMatch && typeMatch;
  });

  return (
    <div className="space-y-8">
      {/* Search & Tabs Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-800 rounded-2xl px-6 py-3 w-full lg:w-96 focus-within:border-indigo-500/50 transition-all">
          <Search size={18} className="text-slate-500" />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-600 font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3 overflow-x-auto w-full lg:w-auto pb-4 lg:pb-0 px-2">
          {['all', 'Instagram', 'Facebook', 'TikTok', 'YouTube', 'Twitter'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-900/50 text-slate-500 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Reciprocity Filtering Toggle */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 glass rounded-[2rem] border-slate-800/50">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <Activity className="text-indigo-400" size={24} />
           </div>
           <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Growth Center</p>
              <h4 className="text-white font-bold">Priority Campaigns Hub</h4>
           </div>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
           <button 
             onClick={() => setFilterMode('all')}
             className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterMode === 'all' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             All Active
           </button>
           <button 
             onClick={() => setFilterMode('paid')}
             className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterMode === 'paid' ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-500 hover:text-emerald-300'}`}
           >
             <Coins size={12} />
             Paid Tasks
           </button>
           <button 
             onClick={() => setFilterMode('niche')}
             className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${filterMode === 'niche' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <Sparkles size={12} />
             Niche Match
           </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map(task => (
            <CampaignCard 
              key={task.id} 
              task={task} 
              onAction={handleAction} 
              isInterestMatch={task.creatorInterests.some(i => currentUserInterests.includes(i))}
            />
          ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500 glass rounded-[3rem] border-dashed border-slate-800">
          <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-800">
             <Rocket size={40} className="opacity-20" />
          </div>
          <p className="text-lg font-bold text-white mb-2">No active campaigns found.</p>
          <button 
            onClick={() => setFilterMode('all')}
            className="text-indigo-400 text-xs font-black uppercase tracking-[0.2em] hover:underline transition-all"
          >
            Show all campaigns
          </button>
        </div>
      )}
    </div>
  );
};

export default Campaigns;
