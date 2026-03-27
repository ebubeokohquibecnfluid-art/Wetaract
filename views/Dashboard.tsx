
import React, { useEffect, useState } from 'react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  TrendingUp, 
  Zap, 
  Award, 
  Sparkles, 
  Rocket, 
  ArrowUpRight, 
  Activity, 
  Coins, 
  Eye, 
  CheckCircle2, 
  BarChart3,
  Cpu,
  AlertTriangle,
  ShieldAlert,
  Mail,
  ExternalLink,
  Clock,
  XCircle
} from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { CampaignTask, SocialPlatform, CampaignType } from '../types';

const growthData = [
  { name: 'Mon', followers: 120, engagement: 400 },
  { name: 'Tue', followers: 150, engagement: 450 },
  { name: 'Wed', followers: 180, engagement: 600 },
  { name: 'Thu', followers: 240, engagement: 550 },
  { name: 'Fri', followers: 310, engagement: 700 },
  { name: 'Sat', followers: 380, engagement: 950 },
  { name: 'Sun', followers: 450, engagement: 1100 },
];

const MY_CAMPAIGNS: CampaignTask[] = [
  {
    id: 'mc1',
    creatorId: 'u-main',
    creatorName: 'Bubee',
    creatorAvatar: 'https://picsum.photos/seed/bubee/200',
    creatorInterests: ['Tech'],
    platform: SocialPlatform.TIKTOK,
    actionType: 'Repost',
    link: 'https://tiktok.com/@bubee/video/1',
    rewardType: 'Cash',
    rewardValue: 0.50,
    remainingSlots: 45,
    totalSlots: 100,
    description: 'Promoting my new AI tool launch!',
    reachCount: 2450,
    budget: 50,
    platformFee: 5,
    useAI: true,
    completions: [
      { userId: 'u1', userName: 'Elena G.', timestamp: '10m ago' },
      { userId: 'u2', userName: 'Damon S.', timestamp: '1h ago' },
      { userId: 'u3', userName: 'Stefan S.', timestamp: '3h ago' },
    ]
  }
];

const Dashboard: React.FC<{ user: any, setActiveView: (view: string) => void }> = ({ user, setActiveView }) => {
  const [strategy, setStrategy] = useState<string>("Synthesizing growth strategies from your recent activity...");
  const [reciprocityTasks, setReciprocityTasks] = useState<CampaignTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const fetchReciprocityTasks = async () => {
    try {
      const res = await fetch('/api/v1/reciprocity/tasks');
      const data = await res.json();
      setReciprocityTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    const fetchAIAdvice = async () => {
      const tips = await geminiService.getGrowthStrategy("Instagram", "Lifestyle & Tech");
      setStrategy(tips);
    };
    fetchAIAdvice();
    fetchReciprocityTasks();
  }, []);

  const handleCompleteReciprocity = async (taskId: string) => {
    try {
      const res = await fetch('/api/v1/reciprocity/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
      if (res.ok) {
        setReciprocityTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleIgnoreReciprocity = async (taskId: string) => {
    if (!confirm("Ignoring a reciprocity task will reduce your points and visibility score. Continue?")) return;
    try {
      const res = await fetch('/api/v1/reciprocity/ignore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveView('dashboard'); // Trigger refresh via state if possible, or reload
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleConvertPoints = async (type: 'subscription' | 'visibility') => {
    try {
      const res = await fetch('/api/v1/points/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        window.location.reload();
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-slate-500 font-medium">Your organic growth is up 12% this week. Keep it up!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-full border border-indigo-500/20">
            <Eye size={16} />
            Visibility: {user.visibilityScore}%
          </div>
          <div className="flex items-center gap-2 text-sm font-bold bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20">
            <Activity size={16} />
            Engagement: {user.engagementRate}%
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Followers', value: user.followersCount.toLocaleString(), change: '+12.5%', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Retention', value: '24%', change: '+4.2%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Wetaract Wallet', value: `$${user.walletBalance.toFixed(2)}`, change: '+$24.50', icon: Coins, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Growth Rank', value: '#42', change: 'Top 5%', icon: Award, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-6 rounded-3xl glass-hover relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                <stat.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Weekly</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                   <ArrowUpRight size={12} />
                   {stat.change}
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-extrabold mt-1 text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Advertiser Console */}
          <div className="glass p-8 rounded-[2.5rem] border-slate-800/50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <BarChart3 className="text-indigo-400" size={24} />
                  Advertiser Console
                </h3>
                <p className="text-sm text-slate-500">Track reach and verified completions for your paid campaigns</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Ad</span>
              </div>
            </div>

            {MY_CAMPAIGNS.map(camp => (
              <div key={camp.id} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center">
                    <Eye size={20} className="text-indigo-400 mb-2" />
                    <p className="text-2xl font-black text-white">{camp.reachCount?.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Reach</p>
                  </div>
                  <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 size={20} className="text-emerald-400 mb-2" />
                    <p className="text-2xl font-black text-white">{camp.totalSlots - camp.remainingSlots}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Completions</p>
                  </div>
                  <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800 flex flex-col items-center justify-center text-center">
                    <Cpu size={20} className="text-amber-400 mb-2" />
                    <p className="text-2xl font-black text-white">AI Mode</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Smart Distro</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Recent Completions</h4>
                  <div className="space-y-2">
                    {camp.completions?.map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/30 border border-slate-800/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase">
                            {comp.userName[0]}
                          </div>
                          <span className="text-sm font-bold text-slate-200">{comp.userName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] text-slate-500 font-medium">{comp.timestamp}</span>
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-500/20">VERIFIED</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AI Intelligence Hub */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass p-8 rounded-[2rem]">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xl font-bold text-white flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sparkles size={18} className="text-amber-500" />
                   </div>
                   AI Growth Strategist
                 </h3>
                 <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">POWERED BY GEMINI</span>
               </div>
               <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50">
                  <div className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {strategy}
                  </div>
               </div>
            </div>
          </div>

          {/* Reciprocity Pact Tasks */}
          <div className="glass p-8 rounded-[2.5rem] border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                  <Users className="text-amber-400" size={24} />
                  Reciprocity Pact Tasks
                </h3>
                <p className="text-sm text-slate-500">Complete tasks to earn points and boost your visibility.</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                <TrendingUp className="text-amber-400" size={14} />
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Growth Boost</span>
              </div>
            </div>

            {loadingTasks ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
              </div>
            ) : reciprocityTasks.length > 0 ? (
              <div className="space-y-4">
                {reciprocityTasks.map(task => (
                  <div key={task.id} className="p-6 bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img src={task.creatorAvatar} className="w-12 h-12 rounded-2xl border border-slate-700" alt="" />
                      <div>
                        <p className="text-sm font-bold text-white">{task.creatorName} needs a {task.actionType}</p>
                        <p className="text-xs text-slate-500">{task.platform} • {task.remainingSlots} slots left</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <a 
                        href={task.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => handleCompleteReciprocity(task.id)}
                        className="flex-1 md:flex-none bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all"
                      >
                        <ExternalLink size={14} />
                        COMPLETE
                      </a>
                      <button 
                        onClick={() => handleIgnoreReciprocity(task.id)}
                        className="p-2.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                        title="Ignore Task"
                      >
                        <XCircle size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto border border-slate-800">
                  <CheckCircle2 size={32} className="text-emerald-500" />
                </div>
                <p className="text-slate-400 font-medium">All reciprocity tasks completed. You're a star!</p>
              </div>
            )}
          </div>
        </div>

        {/* Community Feed / Actions Sidebar */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-600/20">
             <div className="relative z-10">
               <h3 className="text-2xl font-black mb-2 italic tracking-tight uppercase">Launch Advert</h3>
               <p className="text-indigo-100 text-sm font-medium mb-6 leading-snug">
                 Use the AI Smart Advertiser to spread your content to verified niche-specific circles.
               </p>
               <button className="w-full bg-white text-indigo-700 py-3.5 rounded-2xl text-sm font-black shadow-lg transform active:scale-95 transition-all">
                 BOOST WITH AI
               </button>
             </div>
             <Rocket size={140} className="absolute -bottom-6 -right-6 text-white/10 transform rotate-12" />
          </div>

          <div className="glass p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold text-white mb-6">Point Conversion</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400">Subscription Fee</span>
                  <span className="text-xs font-black text-white">5,000 P</span>
                </div>
                <button 
                  onClick={() => handleConvertPoints('subscription')}
                  disabled={user.membershipStatus === 'ACTIVE'}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  {user.membershipStatus === 'ACTIVE' ? 'Subscribed' : 'Convert Points'}
                </button>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-400">Visibility Boost (+20%)</span>
                  <span className="text-xs font-black text-white">1,000 P</span>
                </div>
                <button 
                  onClick={() => handleConvertPoints('visibility')}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                  Boost Visibility
                </button>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2rem]">
            <h3 className="text-lg font-bold text-white mb-6">Earning Activity</h3>
            <div className="space-y-6">
              {[
                { title: 'Task Completed', desc: 'YouTube View (Paid)', amount: '+$2.50', time: '2m ago', color: 'text-emerald-400' },
                { title: 'Community Pact', desc: 'Instagram Like (Points)', amount: '+50', time: '12m ago', color: 'text-amber-400' },
                { title: 'Referral Bonus', desc: 'Sarah J. joined', amount: '+$1.00', time: '45m ago', color: 'text-emerald-400' },
              ].map((m, i) => (
                <div key={i} className="flex gap-4 group cursor-default">
                  <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 group-hover:scale-110 transition-transform`}>
                    <Coins size={16} className="text-indigo-400" />
                  </div>
                  <div className="border-b border-slate-800/50 pb-4 w-full last:border-0">
                    <div className="flex justify-between items-center mb-0.5">
                       <p className="text-sm font-bold text-white">{m.title}</p>
                       <span className={`text-[11px] font-black ${m.color}`}>{m.amount}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-slate-500 font-medium">{m.desc}</p>
                      <span className="text-[9px] font-bold text-slate-600 uppercase">{m.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 bg-slate-900/50 hover:bg-slate-900 text-xs font-black text-slate-400 uppercase tracking-widest rounded-xl transition-all border border-slate-800">
               View All Earnings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
