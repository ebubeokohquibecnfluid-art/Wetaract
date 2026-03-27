
import React, { useState } from 'react';
// Added Rocket to the imports from lucide-react
import { Check, ShieldCheck, Zap, Globe, Star, Lock, CreditCard, ArrowLeftRight, Award, Sparkles, Clock, AlertCircle, Rocket } from 'lucide-react';
import { MembershipStatus, UserProfile } from '../types';

interface MembershipProps {
  onUpgrade: (plan: string) => void;
  currentStatus: MembershipStatus;
  user: UserProfile;
}

const Membership: React.FC<MembershipProps> = ({ onUpgrade, currentStatus, user }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const promoPlan = {
    id: 'founding_promo',
    name: 'Founding Member Promo',
    price: '$10',
    naira: '₦15,000',
    period: '/ first year',
    description: 'Exclusive early-bird access to the full Wetaract Growth Ecosystem.',
    features: [
      'Full Access to Growth Pact (Get Followed Back)',
      'Elite Verification Badge',
      'Priority Niche Recommendations',
      'Unlimited Ad Campaign Slots',
      'Exempt from Reciprocity Checks',
      'Global Discovery Placement'
    ]
  };

  const handleUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onUpgrade(promoPlan.id);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 px-4 sm:px-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20">
          <Clock size={14} className="animate-pulse" />
          Limited Time: App Release Promo
        </div>
        <h2 className="text-5xl font-black text-white tracking-tight leading-tight">Unlock Organic <span className="gradient-text">Growth.</span></h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
          Sign up is free, but free creators only follow. Unlock <span className="text-white font-bold">The Pact</span> to receive thousands of follows back automatically.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        {/* Free Tier Info */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-slate-800/50 space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-300">Free Account</h3>
            <span className="text-[10px] font-black bg-slate-800 text-slate-500 px-2 py-1 rounded">CURRENT</span>
          </div>
          
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                <Check size={12} />
              </div>
              Discover and follow creators
            </li>
            <li className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500">
                <Check size={12} />
              </div>
              Launch Paid Campaigns (Boost)
            </li>
            <li className="flex items-center gap-3 text-xs text-rose-500/70 font-bold bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
              <Lock size={12} />
              No Organic Follow-backs
            </li>
            <li className="flex items-center gap-3 text-xs text-rose-500/70 font-bold bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
              <Lock size={12} />
              No Growth Badge Visibility
            </li>
          </ul>
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
             <div className="flex items-center gap-2 text-indigo-400 mb-2">
                <Award size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Earn Your Way Up</span>
             </div>
             <p className="text-[10px] text-slate-500 leading-relaxed">
               Participate in reciprocity campaigns to earn points. Accumulate 5,000 points to unlock Elite status for free!
             </p>
          </div>
        </div>

        {/* Promo Plan */}
        <div className="lg:col-span-3 relative rounded-[3rem] p-10 flex flex-col transition-all duration-500 bg-slate-900 border-2 border-amber-500/50 shadow-[0_0_80px_rgba(245,158,11,0.1)]">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-600 text-[10px] font-black px-6 py-2 rounded-full text-white uppercase tracking-widest shadow-xl">
            Release Special - First Year
          </div>
          
          <div className="mb-8">
            <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              {promoPlan.name}
              <Sparkles size={24} className="text-amber-500" />
            </h3>
            <p className="text-slate-400 text-sm font-medium">{promoPlan.description}</p>
          </div>

          <div className="mb-8 flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-7xl font-black text-white tracking-tighter">{promoPlan.price}</span>
              <span className="text-slate-500 font-bold text-lg">{promoPlan.period}</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-2 text-amber-500 font-bold">
              <span className="text-sm">Or Approx.</span>
              <span className="text-xl font-black">{promoPlan.naira}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 flex-1 mb-10">
            {promoPlan.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-amber-500/20 text-amber-500">
                  <Check size={12} />
                </div>
                <span className="text-xs font-semibold text-slate-200">{feature}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={handleUpgrade}
            disabled={isProcessing || user.isEliteVerified}
            className={`w-full font-black py-6 rounded-[2rem] transition-all shadow-xl active:scale-95 text-lg flex items-center justify-center gap-3 ${
              user.isEliteVerified 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
            }`}
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : user.isEliteVerified ? (
              'Plan Active'
            ) : (
              <>
                <ShieldCheck size={20} />
                Claim Growth Pact Status
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-6 font-bold uppercase tracking-widest">Instant Activation after Secure Payment</p>
        </div>
      </div>

      <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-[2rem] border-slate-800/50 space-y-4 group hover:border-amber-500/20 transition-all">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Award size={28} />
          </div>
          <h4 className="font-black text-white">The Elite Badge</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Gain the community's trust. Subscribers lead our discovery feeds and attract more engagement.
          </p>
        </div>

        <div className="glass p-8 rounded-[2rem] border-slate-800/50 space-y-4 group hover:border-indigo-500/20 transition-all">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
            <ArrowLeftRight size={28} />
          </div>
          <h4 className="font-black text-white">Bidirectional Growth</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Stop following for nothing. As a Subscriber, our engine ensures that every pact action results in reciprocal growth.
          </p>
        </div>

        <div className="glass p-8 rounded-[2rem] border-slate-800/50 space-y-4 group hover:border-emerald-500/20 transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
            <Rocket size={28} />
          </div>
          <h4 className="font-black text-white">AI Distribution</h4>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            Subscribers get full access to the AI Smart Advertiser tools to find the perfect niche circles for their content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Membership;
