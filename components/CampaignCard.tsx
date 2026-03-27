
import React from 'react';
import { 
  ExternalLink, 
  Heart, 
  Eye, 
  MessageCircle, 
  Share2, 
  Youtube, 
  Instagram, 
  Twitter, 
  Music2, 
  CheckCircle, 
  Facebook,
  PlayCircle,
  Repeat2,
  RefreshCcw,
  Sparkles,
  Zap,
  Coins,
  Cpu,
  Globe
} from 'lucide-react';
import { CampaignTask, SocialPlatform } from '../types';

interface CampaignCardProps {
  task: CampaignTask;
  onAction: (id: string) => void;
  isInterestMatch?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ task, onAction, isInterestMatch }) => {
  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case SocialPlatform.INSTAGRAM: return <Instagram size={20} className="text-pink-500" />;
      case SocialPlatform.TIKTOK: return <Music2 size={20} className="text-cyan-400" />;
      case SocialPlatform.TWITTER: return <Twitter size={20} className="text-blue-400" />;
      case SocialPlatform.YOUTUBE: return <Youtube size={20} className="text-red-500" />;
      case SocialPlatform.FACEBOOK: return <Facebook size={20} className="text-blue-600" />;
      default: return null;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'Like': return <Heart size={16} className="fill-current" />;
      case 'View': return <Eye size={16} />;
      case 'Comment': return <MessageCircle size={16} />;
      case 'Share': return <Share2 size={16} />;
      case 'Repost': return <Repeat2 size={16} />;
      case 'Stream': return <RefreshCcw size={16} />;
      case 'Play': return <PlayCircle size={16} />;
      default: return <Zap size={16} />;
    }
  };

  const progress = (1 - (task.remainingSlots / task.totalSlots)) * 100;

  return (
    <div className={`glass p-6 rounded-[2rem] glass-hover group border-transparent hover:border-slate-700/50 relative overflow-hidden ${isInterestMatch ? 'ring-1 ring-indigo-500/30' : ''} ${task.rewardType === 'Cash' ? 'ring-1 ring-emerald-500/20' : ''}`}>
      {task.rewardType === 'Cash' && (
        <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[8px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-widest shadow-lg flex items-center gap-1">
           <Coins size={10} />
           Paid Task
        </div>
      )}
      
      {task.useAI && (
        <div className="absolute top-8 right-[-24px] rotate-45 bg-amber-500 text-white text-[7px] font-black px-8 py-0.5 uppercase tracking-widest shadow-md">
           AI Advert
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:scale-105 transition-transform">
              {getPlatformIcon(task.platform)}
            </div>
            {task.rewardType === 'Cash' ? (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-0.5 rounded-md border-2 border-slate-950">
                 <Globe size={8} className="text-white" />
              </div>
            ) : (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-0.5 rounded-md border-2 border-slate-950">
                 <CheckCircle size={8} className="text-white fill-white" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{task.creatorName}</h4>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{task.platform}</span>
               <div className="w-1 h-1 rounded-full bg-slate-700"></div>
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">{task.actionType}</span>
            </div>
          </div>
        </div>
        <div className={`${task.rewardType === 'Cash' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'} text-[10px] font-black px-3 py-1.5 rounded-full border flex items-center gap-1.5`}>
          {task.rewardType === 'Cash' ? <Coins size={12} /> : <Zap size={12} className="fill-current" />}
          {task.rewardType === 'Cash' ? `$${task.rewardValue.toFixed(2)}` : `+${task.rewardValue}`}
        </div>
      </div>

      <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed font-medium">
        {task.description}
      </p>

      {/* Creator Interests */}
      <div className="flex flex-wrap gap-1 mb-6">
         {task.creatorInterests.slice(0, 2).map((interest, i) => (
           <span key={i} className="text-[8px] font-black bg-slate-900 text-slate-500 px-2 py-0.5 rounded-md border border-slate-800">
             {interest}
           </span>
         ))}
         {task.location && (
           <span className="text-[8px] font-black bg-emerald-900/20 text-emerald-500 px-2 py-0.5 rounded-md border border-emerald-800/20">
             {task.location}
           </span>
         )}
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span>{task.rewardType === 'Cash' ? 'Campaign Reach' : 'Community Progress'}</span>
          <span>{task.totalSlots - task.remainingSlots} / {task.totalSlots}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800/50 rounded-full overflow-hidden p-0">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)] ${task.rewardType === 'Cash' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <a 
          href={task.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 py-3.5 rounded-2xl text-xs font-bold border border-slate-700/50 transition-all active:scale-95"
        >
          <ExternalLink size={14} />
          View
        </a>
        <button 
          onClick={() => onAction(task.id)}
          className={`flex-1 flex items-center justify-center gap-2 text-white py-3.5 rounded-2xl text-xs font-bold shadow-lg transition-all active:scale-95 ${task.rewardType === 'Cash' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'}`}
        >
          {task.rewardType === 'Cash' ? <Coins size={16} /> : getActionIcon(task.actionType)}
          {task.rewardType === 'Cash' ? 'Claim Reward' : 'Verify Action'}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/30 flex items-center justify-center gap-2">
         {task.rewardType === 'Cash' ? <Coins size={10} className="text-emerald-500" /> : <RefreshCcw size={10} className="text-emerald-500" />}
         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
           {task.rewardType === 'Cash' ? 'Instant Wallet Payout' : 'Mutual Reciprocity Active'}
         </span>
      </div>
    </div>
  );
};

export default CampaignCard;
