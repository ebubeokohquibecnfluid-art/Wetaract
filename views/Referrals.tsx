
import React, { useState } from 'react';
import { 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Wallet,
  ArrowRight
} from 'lucide-react';

interface ReferralsProps {
  user: any;
}

const Referrals: React.FC<ReferralsProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://wetaract.com/join?ref=${user.referralStats.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[3rem] p-12 bg-gradient-to-br from-indigo-600 to-purple-800 text-white shadow-2xl shadow-indigo-900/20">
        <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Gift size={300} className="text-white fill-current" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-black uppercase tracking-widest">
            <Gift size={14} className="text-amber-300" />
            Growth Multiplier Program
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-tight">
            Share the Magic, <br />
            <span className="text-amber-300">Earn 20% Forever.</span>
          </h1>
          <p className="text-indigo-100 text-lg font-medium leading-relaxed">
            Invite fellow creators to Wetaract. You'll receive <span className="text-white font-bold underline decoration-amber-300 decoration-2 underline-offset-4">20% of every subscription fee</span> they pay, directly into your Wetaract Wallet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <div className="flex-1 bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between group">
              <span className="text-sm font-mono truncate mr-4 text-indigo-100">{referralLink}</span>
              <button 
                onClick={copyToClipboard}
                className="bg-white text-indigo-700 p-2.5 rounded-xl hover:bg-indigo-50 transition-all active:scale-90 flex items-center gap-2 text-xs font-black uppercase"
              >
                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <button className="bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/40 transition-all">
              <Share2 size={18} />
              Share Link
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Referrals', value: user.referralStats.totalReferrals, icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Total Earnings', value: `$${user.referralStats.totalEarnings}`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Pending Payout', value: `$${user.referralStats.pendingEarnings}`, icon: Wallet, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Conversion Rate', value: user.referralStats.conversionRate, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[2rem] glass-hover border-slate-800/50">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Breakdown */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-slate-800/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Recent Referral Activity</h3>
            <button className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Sarah Jenkins', action: 'Monthly Pro', commission: '+$1.00', date: '2 hours ago', status: 'Pending' },
              { name: 'Marcus Chen', action: 'Annual Elite', commission: '+$10.00', date: '1 day ago', status: 'Approved' },
              { name: 'Lily Rose', action: 'Monthly Pro', commission: '+$1.00', date: '3 days ago', status: 'Approved' },
              { name: 'David Miller', action: 'Annual Elite', commission: '+$10.00', date: '1 week ago', status: 'Approved' },
            ].map((ref, i) => (
              <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black text-sm">
                    {ref.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{ref.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{ref.action} • {ref.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">{ref.commission}</p>
                  <p className={`text-[9px] font-black uppercase tracking-tighter ${ref.status === 'Approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {ref.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-slate-800/50 space-y-6">
            <h3 className="text-lg font-bold text-white">How it works</h3>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Share your link', desc: 'Copy your unique URL and share it on social media or with friends.' },
                { step: '02', title: 'They Join Wetaract', desc: 'When someone clicks your link and subscribes to any plan.' },
                { step: '03', title: 'You Get Paid', desc: 'Instantly earn 20% of their subscription fee in your wallet.' },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <span className="text-2xl font-black text-indigo-600/30 font-mono">{item.step}</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200 mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-slate-800/50">
               <div className="bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/20">
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Wetaract Wallet Tip</p>
                  <p className="text-xs text-slate-400 font-medium">Earnings are credited after 14 days to account for refund periods.</p>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center mb-4">
                <TrendingUp size={32} className="text-indigo-400" />
             </div>
             <h4 className="text-lg font-bold text-white mb-2">Passive Growth</h4>
             <p className="text-xs text-slate-500 font-medium mb-6">Bubee, your referrals have earned you enough to cover 3 months of Elite status!</p>
             <button className="text-indigo-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Learn Strategy
                <ArrowRight size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
