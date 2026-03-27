
import React, { useState } from 'react';
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Music2, 
  Edit3, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  Users, 
  Star,
  Award,
  ArrowRight,
  Plus,
  X,
  Tag,
  Shield,
  Play
} from 'lucide-react';
import { SocialPlatform, UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [newInterest, setNewInterest] = useState('');

  const socialIcons = {
    [SocialPlatform.INSTAGRAM]: <Instagram size={18} className="text-pink-500" />,
    [SocialPlatform.TIKTOK]: <Music2 size={18} className="text-cyan-400" />,
    [SocialPlatform.TWITTER]: <Twitter size={18} className="text-blue-400" />,
    [SocialPlatform.YOUTUBE]: <Youtube size={18} className="text-red-500" />,
    [SocialPlatform.FACEBOOK]: <Instagram size={18} className="text-blue-600" />,
    [SocialPlatform.SPOTIFY]: <Play size={18} className="text-emerald-500" fill="currentColor" />,
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInterest.trim() && !user.interests.includes(newInterest.trim())) {
      onUpdateUser({
        ...user,
        interests: [...user.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    onUpdateUser({
      ...user,
      interests: user.interests.filter(i => i !== interest)
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Profile Section */}
      <div className={`glass p-8 rounded-[2.5rem] relative overflow-hidden group border-2 ${user.isEliteVerified ? 'border-amber-500/30' : 'border-slate-800/50'}`}>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Award size={240} className={`${user.isEliteVerified ? 'text-amber-400' : 'text-indigo-400'} fill-current`} />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className={`w-32 h-32 rounded-[2rem] overflow-hidden border-4 neo-shadow ${user.isEliteVerified ? 'border-amber-500/50 shadow-amber-500/10' : 'border-slate-800'}`}>
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            {user.isEliteVerified && (
               <div className="absolute -top-2 -left-2 bg-amber-500 p-2 rounded-xl shadow-lg border-2 border-slate-900 animate-bounce">
                  <Award size={20} className="text-white" />
               </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-xl shadow-lg border-2 border-slate-900">
              <Edit3 size={16} className="text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h1 className="text-3xl font-black text-white">{user.name}</h1>
                {user.isEliteVerified && <ShieldCheck size={24} className="text-amber-500" />}
              </div>
              <span className={`w-fit mx-auto md:mx-0 text-[10px] font-black border px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 ${user.isEliteVerified ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                {user.isEliteVerified ? <ShieldCheck size={12} /> : <ShieldCheck size={12} />}
                {user.isEliteVerified ? 'Elite Verified' : 'Standard Status'}
              </span>
            </div>
            <p className="text-slate-400 font-medium">@{user.username}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider pt-2">
              <span className="flex items-center gap-2"><Calendar size={14} className="text-indigo-400" /> Member since {new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              <span className="flex items-center gap-2"><Star size={14} className="text-amber-400" /> 154 Achievements Unlocked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Detailed Stats */}
          <div className="glass p-6 rounded-[2rem] space-y-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users size={18} className="text-indigo-400" />
              Community Presence
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Visibility</p>
                <p className="text-xl font-black text-indigo-400">{user.visibilityScore}%</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Engagement</p>
                <p className="text-xl font-black text-emerald-400">{user.engagementRate}%</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Followers</p>
                <p className="text-xl font-black text-white">{user.followersCount}</p>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Following</p>
                <p className="text-xl font-black text-white">{user.followingCount}</p>
              </div>
            </div>

            {user.isEliteVerified && (
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                 <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <Shield size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">System Shield Active</span>
                 </div>
                 <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                   You are safe from the reciprocity removal system. Regular follow-backs are optional.
                 </p>
              </div>
            )}
          </div>

          <div className="glass p-6 rounded-[2rem] space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Connected Handles</h3>
            <div className="space-y-3">
              {Object.entries(user.handles).map(([platform, handle]) => (
                <div key={platform} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      {(socialIcons as any)[platform]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{platform}</p>
                      <p className="text-sm font-bold text-white">@{handle as string}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-8 rounded-[2.5rem] space-y-6 border-slate-800/50">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Tag size={20} className="text-indigo-400" />
                Areas of Interest
              </h3>
            </div>
            
            <form onSubmit={handleAddInterest} className="flex gap-2">
              <input 
                type="text" 
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add a niche..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all">
                <Plus size={20} />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-xs font-bold text-indigo-400 group/tag">
                  {interest}
                  <button onClick={() => handleRemoveInterest(interest)} className="hover:text-rose-400"><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          <div className={`glass p-8 rounded-[2.5rem] bg-slate-950/80 border ${user.isEliteVerified ? 'border-amber-500/30' : 'border-slate-800/50'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-black text-white">
                  {user.isEliteVerified ? 'Wetaract Elite Verified' : 'Standard Growth Plan'}
                </h3>
                <p className="text-slate-400 font-medium">Verified status active • Next renewal: Oct 12, 2024</p>
              </div>
              <div className={`px-6 py-2 rounded-full text-white font-black text-xs uppercase tracking-widest shadow-lg ${user.isEliteVerified ? 'bg-amber-600 shadow-amber-600/30' : 'bg-indigo-600 shadow-indigo-600/30'}`}>
                {user.isEliteVerified ? 'ELITE VERIFIED' : 'ACTIVE'}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Reciprocity Status', value: user.isEliteVerified ? 'Selective' : 'Full Mandatory', desc: user.isEliteVerified ? 'Reciprocate only with fellow Elite' : 'Must follow back all community members' },
                { title: 'Removal Protection', value: user.isEliteVerified ? 'IMMUNE' : 'Standard', desc: user.isEliteVerified ? 'Safe from following-check logic' : 'Standard pact rules apply' },
                { title: 'Growth Badge', value: user.isEliteVerified ? 'ENABLED' : 'None', desc: 'Visibility boost in the growth engine' },
                { title: 'Network Support', value: 'Verified', desc: 'Secure community following pact' },
              ].map((perk, i) => (
                <div key={i} className="p-5 rounded-[1.5rem] bg-slate-900 border border-slate-800">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${user.isEliteVerified ? 'text-amber-500' : 'text-indigo-400'}`}>{perk.title}</p>
                  <p className="text-lg font-black text-white">{perk.value}</p>
                  <p className="text-xs text-slate-500 font-medium mt-1">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
