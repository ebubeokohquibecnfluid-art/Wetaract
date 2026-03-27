
import React, { useState, useMemo, useEffect } from 'react';
import { 
  UserCheck, 
  UserPlus, 
  Shield, 
  Star, 
  CheckCircle2, 
  Globe, 
  Heart, 
  RefreshCw, 
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Music2,
  ExternalLink,
  Users,
  Filter,
  Sparkles,
  Tag,
  Award,
  ShieldCheck,
  Info,
  Lock,
  BellRing,
  X,
  Play
} from 'lucide-react';
import { SocialPlatform, UserProfile } from '../types';

interface Member {
  id: string;
  name: string;
  username: string;
  avatar: string;
  points: number;
  status: string;
  isEliteVerified: boolean;
  synced: boolean;
  interests: string[];
  handles: Partial<Record<SocialPlatform, string>>;
}

const MOCK_MEMBERS: Member[] = [
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

interface CommunityProps {
  currentUser: UserProfile;
}

const Community: React.FC<CommunityProps> = ({ currentUser }) => {
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [dailyFollowCount, setDailyFollowCount] = useState(14);
  const [filterMode, setFilterMode] = useState<'all' | 'similar' | 'elite'>('all');
  const [pactNotification, setPactNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const DAILY_LIMIT = 50;

  useEffect(() => {
    fetch('/api/v1/community')
      .then(res => res.json())
      .then(data => {
        setMembers(data);
        setIsLoading(false);
      })
      .catch(err => console.error("Failed to fetch community members", err));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  const handleFollowClick = (platform: string, targetMember: Member) => {
    setDailyFollowCount(prev => Math.min(prev + 1, DAILY_LIMIT));
    
    // Show notification to user that the target was notified
    setPactNotification({
      message: `Pact notification sent to ${targetMember.name}! They've been notified of your follow on ${platform}.`,
      type: 'success'
    });

    // Clear notification after delay
    setTimeout(() => {
      setPactNotification(null);
    }, 4000);

    console.log(`Action: Following ${targetMember.name} on ${platform}. Pact notified.`);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM: return <Instagram size={16} className="text-pink-500" />;
      case SocialPlatform.TIKTOK: return <Music2 size={16} className="text-cyan-400" />;
      case SocialPlatform.TWITTER: return <Twitter size={16} className="text-blue-400" />;
      case SocialPlatform.YOUTUBE: return <Youtube size={16} className="text-red-500" />;
      case SocialPlatform.FACEBOOK: return <Facebook size={16} className="text-blue-600" />;
      case SocialPlatform.SPOTIFY: return <Play size={16} className="text-emerald-500" fill="currentColor" />;
      default: return <Globe size={16} />;
    }
  };

  const filteredMembers = useMemo(() => {
    let list = members;
    if (filterMode === 'similar') {
      list = list.filter(member => member.interests.some(interest => currentUser.interests.includes(interest)));
    } else if (filterMode === 'elite') {
      list = list.filter(member => member.isEliteVerified);
    }
    return list;
  }, [filterMode, currentUser.interests, members]);

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Toast Notification */}
      {pactNotification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-indigo-600 text-white px-6 py-4 rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 flex items-center gap-4 border border-indigo-400/30 backdrop-blur-md">
            <div className="p-2 bg-white/10 rounded-xl">
              <BellRing size={20} className="animate-bounce" />
            </div>
            <p className="text-sm font-bold">{pactNotification.message}</p>
            <button onClick={() => setPactNotification(null)} className="ml-2 hover:bg-white/10 p-1 rounded-lg transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="relative overflow-hidden p-10 rounded-[2.5rem] glass neo-shadow group">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <ArrowLeftRight size={240} className="text-white fill-current" />
        </div>
        
        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                <Users className="text-white" size={28} />
             </div>
             <h2 className="text-4xl font-black text-white tracking-tight">Growth Pact Hub</h2>
          </div>
          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
            Free users grow by following and running ads. <span className="text-amber-500 font-black">Subscribers</span> gain organic reciprocal growth. When a Subscriber follows you, the Pact ensures you follow back to maintain your status.
          </p>
          
          <div className="flex flex-wrap gap-4">
            {!currentUser.isEliteVerified && (
               <div className="bg-amber-500/10 border border-amber-500/30 px-6 py-4 rounded-2xl flex items-center gap-4">
                  <div className="p-2 bg-amber-500 rounded-xl text-white">
                     <Lock size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-0.5">Observer Mode (Free)</p>
                     <p className="text-xs text-slate-300 font-bold">Follow others to build your profile. Upgrade to get followed back.</p>
                  </div>
               </div>
            )}
            
            <div className="bg-indigo-600/20 border border-indigo-500/30 px-6 py-4 rounded-2xl flex items-center gap-4">
               <div>
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Daily Following Effort</p>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-indigo-500 transition-all duration-500 shadow-[0_0_100px_rgba(99,102,241,0.5)]" 
                         style={{ width: `${(dailyFollowCount / DAILY_LIMIT) * 100}%` }}
                       />
                    </div>
                    <span className="text-xs font-black text-white">{dailyFollowCount}/{DAILY_LIMIT}</span>
                  </div>
               </div>
               <button className="p-2 bg-indigo-600 rounded-xl text-white hover:scale-105 transition-transform active:scale-95">
                  <RefreshCw size={16} />
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Community Creators</h3>
          <p className="text-sm text-slate-500 font-medium">Verified members lead the growth ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setFilterMode('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterMode === 'all' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilterMode('elite')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterMode === 'elite' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Award size={14} />
            Subscribers
          </button>
          <button 
            onClick={() => setFilterMode('similar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${filterMode === 'similar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Sparkles size={14} />
            Niche Match
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <div key={member.id} className={`glass rounded-[2rem] overflow-hidden transition-all duration-500 ${expandedMemberId === member.id ? 'ring-2 ring-indigo-500/50 bg-slate-900/90' : 'glass-hover border-transparent hover:border-slate-800'} ${member.isEliteVerified ? 'border-amber-500/20' : ''}`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={member.avatar} alt="" className="w-14 h-14 rounded-2xl bg-slate-800 object-cover border-2 border-slate-800" />
                    {member.isEliteVerified && (
                       <div className="absolute -top-1 -left-1 bg-amber-500 p-1 rounded-lg shadow-xl shadow-amber-600/30">
                          <Award size={10} className="text-white" />
                       </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-bold text-base text-white">{member.name}</p>
                      {member.isEliteVerified && <ShieldCheck size={14} className="text-amber-500" />}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${member.isEliteVerified ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-800 text-slate-500'}`}>
                         {member.isEliteVerified ? 'Subscriber' : 'Free User'}
                       </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => toggleExpand(member.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase transition-all shadow-lg active:scale-90 ${
                    expandedMemberId === member.id 
                    ? 'bg-slate-800 text-slate-300' 
                    : (member.isEliteVerified ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20')
                  }`}
                >
                  {expandedMemberId === member.id ? <ChevronUp size={16} /> : <UserPlus size={16} />}
                  {expandedMemberId === member.id ? 'Close' : 'Follow'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1 mt-2">
                {member.interests.map((interest, i) => (
                  <span 
                    key={i} 
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                      currentUser.interests.includes(interest) 
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' 
                      : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
                    }`}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {expandedMemberId === member.id && (
              <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-300">
                <div className="h-px bg-slate-800 w-full mb-4 opacity-50"></div>
                
                <div className="mb-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex gap-3">
                   <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${member.isEliteVerified ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                      <Info size={16} />
                   </div>
                   <div className="text-[10px] leading-relaxed">
                      <p className="font-black uppercase tracking-widest text-slate-400 mb-0.5">Platform Rule</p>
                      {member.isEliteVerified ? (
                        <p className="text-slate-500">
                          {currentUser.isEliteVerified 
                            ? "Founding Pact: You both get followed back. Your mutual growth is protected." 
                            : "Growth Boost: You follow them to increase your reach. Reciprocity is exclusive to Subscribers."}
                        </p>
                      ) : (
                        <p className="text-slate-500">Free Pact: Support a fellow creator. Note: Free users are not eligible for automated follow-backs.</p>
                      )}
                   </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(member.handles).map(([platform, link]) => (
                    <div key={platform} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/50 border border-slate-800 group/handle">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-800 group-hover/handle:border-indigo-500/30 transition-colors">
                            {getPlatformIcon(platform as SocialPlatform)}
                         </div>
                         <div>
                            <p className="text-xs font-bold text-white">{platform}</p>
                            <p className="text-[10px] text-slate-500 font-medium">Verify engine active</p>
                         </div>
                      </div>
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => handleFollowClick(platform, member)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${member.isEliteVerified ? 'bg-slate-900 hover:bg-slate-800 text-amber-400 border-amber-500/20 hover:border-amber-500/30' : 'bg-slate-900 hover:bg-slate-800 text-indigo-400 border-indigo-500/20 hover:border-indigo-500/30'}`}
                      >
                        Follow
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
