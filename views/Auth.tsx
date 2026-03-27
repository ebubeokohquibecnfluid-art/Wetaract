
import React, { useState } from 'react';
import { Zap, Mail, Lock, User, AtSign, ArrowRight, ShieldCheck, Sparkles, Phone, Smartphone } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: authMethod })
      });

      if (response.ok) {
        onLoginSuccess();
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      alert("Connectivity error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center neo-shadow mb-6">
            <Zap size={32} className="text-white fill-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            Wetaract
          </h1>
          <p className="text-slate-400 font-medium">Join the elite creator growth pact.</p>
        </div>

        {/* Card */}
        <div className="glass p-8 rounded-[2.5rem] border-slate-800/50 shadow-2xl">
          <div className="flex bg-slate-900/50 p-1 rounded-2xl mb-8 border border-slate-800">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${!isLogin ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="Bubee Wetaract"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm text-white"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                  <div className="relative group">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                      type="text" 
                      placeholder="bubee"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm text-white"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
                  {authMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </label>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setAuthMethod('email')}
                    className={`p-1.5 rounded-lg transition-all ${authMethod === 'email' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-600 hover:text-slate-400'}`}
                    title="Use Email"
                  >
                    <Mail size={14} />
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAuthMethod('phone')}
                    className={`p-1.5 rounded-lg transition-all ${authMethod === 'phone' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-600 hover:text-slate-400'}`}
                    title="Use Phone"
                  >
                    <Phone size={14} />
                  </button>
                </div>
              </div>

              <div className="relative group animate-in slide-in-from-top-2 duration-300">
                {authMethod === 'email' ? (
                  <>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm text-white"
                      required
                    />
                  </>
                ) : (
                  <>
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                    <input 
                      type="tel" 
                      placeholder="+234 ..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm text-white font-mono"
                      required
                    />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Password</label>
                {isLogin && <button type="button" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">Forgot Password?</button>}
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm text-white"
                  required
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl mt-4 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In to Hub' : 'Create My Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800/50">
            <div className="flex flex-col gap-4">
               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Your data is 256-bit encrypted
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Sparkles size={14} className="text-amber-500" />
                  Free organic audit on signup
               </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-500 text-sm font-medium leading-relaxed">
          By continuing, you agree to the Wetaract Pact <br /> and our terms of organic growth.
        </p>
      </div>
    </div>
  );
};

export default Auth;
