
import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  CreditCard,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  Lock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { UserProfile, WalletTransaction } from '../types';

interface WalletProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
}

const WalletView: React.FC<WalletProps> = ({ user, onUpdateUser }) => {
  const [isWithdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [depositStep, setDepositStep] = useState(1); // 1: Amount, 2: Gateway, 3: Processing
  
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [gateway, setGateway] = useState<'paystack' | 'flutterwave' | null>(null);

  const NAIRA_RATE = 1500; // Mock rate for visual representation

  const handleDepositSubmit = async () => {
    setIsProcessing(true);
    setDepositStep(3);
    
    try {
      const response = await fetch('/api/v1/wallet/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: depositAmount, gateway })
      });

      if (response.ok) {
        const result = await response.json();
        onUpdateUser(result.user);
        setIsProcessing(false);
        setTimeout(() => {
          setDepositModalOpen(false);
          setDepositStep(1);
          setGateway(null);
          setDepositAmount(0);
        }, 1500);
      } else {
        alert("Deposit failed.");
        setDepositStep(2);
        setIsProcessing(false);
      }
    } catch (error) {
      alert("Connectivity error.");
      setDepositStep(2);
      setIsProcessing(false);
    }
  };

  const handleWithdrawSubmit = async () => {
    if (withdrawAmount <= 0) return;
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/v1/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: withdrawAmount })
      });

      if (response.ok) {
        const result = await response.json();
        onUpdateUser(result.user);
        alert(`Withdrawal of $${withdrawAmount} successful!`);
        setWithdrawModalOpen(false);
      } else {
        const err = await response.json();
        alert(err.error || "Withdrawal failed.");
      }
    } catch (error) {
      alert("Connectivity error.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="lg:col-span-2 relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-2xl shadow-emerald-900/20">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Coins size={280} className="text-white fill-current" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <Wallet size={20} className="text-emerald-200" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">Main Wetaract Wallet</span>
              </div>
              <div>
                <p className="text-6xl font-black tracking-tighter leading-tight">
                  ${user.walletBalance.toFixed(2)}
                </p>
                <p className="text-emerald-100/60 font-bold mt-1 uppercase tracking-widest text-[10px]">Total Available Balance</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <button 
                onClick={() => setDepositModalOpen(true)}
                className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-black text-sm uppercase flex items-center gap-2 shadow-xl shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Plus size={18} />
                Deposit Funds
              </button>
              <button 
                onClick={() => setWithdrawModalOpen(true)}
                className="bg-emerald-500/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase flex items-center gap-2 transition-all hover:bg-emerald-500/30"
              >
                <ArrowUpRight size={18} />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="space-y-6">
          <div className="glass p-8 rounded-[2rem] border-emerald-500/10">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Earnings (Life)</p>
            <h3 className="text-3xl font-black text-white">${(user.walletBalance + user.totalWithdrawn).toFixed(2)}</h3>
            <div className="flex items-center gap-2 mt-4 text-emerald-400">
               <TrendingUp size={16} />
               <span className="text-xs font-bold">+12% from last month</span>
            </div>
          </div>
          <div className="glass p-8 rounded-[2rem] border-slate-800/50">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Platform Rank</p>
            <h3 className="text-3xl font-black text-white">#422</h3>
            <div className="flex items-center gap-2 mt-4 text-indigo-400">
               <Zap size={16} />
               <span className="text-xs font-bold">Priority verified: 98%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem] border-slate-800/50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
            <div className="flex gap-2">
               <button className="p-2.5 bg-slate-900 rounded-xl text-slate-500 hover:text-white border border-slate-800 transition-colors">
                  <Clock size={18} />
               </button>
            </div>
          </div>

          <div className="space-y-4">
            {user.transactions.length > 0 ? (
              user.transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                      tx.type === 'Earning' || tx.type === 'Deposit'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                    }`}>
                      {tx.type === 'Earning' || tx.type === 'Deposit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{tx.description}</p>
                      <p className="text-xs text-slate-500 font-medium">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black ${tx.type === 'Earning' || tx.type === 'Deposit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'Earning' || tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </p>
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${tx.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {tx.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-500 font-medium italic">No transactions recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <div className="glass p-8 rounded-[2.5rem] border-slate-800/50 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <ShieldCheck size={20} className="text-emerald-400" />
              Secure Payouts
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Wetaract uses industry-standard encryption for all financial movements. Deposit via card and earn from community tasks instantly.
            </p>
            <div className="pt-4 space-y-3">
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Wetaract Fee</span>
                  <span className="text-white">10.0%</span>
               </div>
               <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Processing Time</span>
                  <span className="text-white">Instant</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
           <div className="max-w-md w-full glass p-10 rounded-[3rem] border-emerald-500/30 shadow-[0_0_100px_rgba(16,185,129,0.1)] space-y-8 animate-in zoom-in duration-300">
              {depositStep === 1 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Plus size={32} className="text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Deposit Funds</h2>
                    <p className="text-slate-400 font-medium">Enter amount in USD</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-bold">$</div>
                          <input 
                            type="number" 
                            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-5 pl-10 pr-4 text-3xl text-white font-black outline-none focus:border-emerald-500/50"
                            placeholder="0.00"
                            value={depositAmount || ''}
                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                          />
                        </div>
                        {depositAmount > 0 && (
                          <p className="text-[10px] font-bold text-emerald-400/60 mt-2 ml-1 flex items-center gap-1 uppercase tracking-widest">
                            Approx: ₦{(depositAmount * NAIRA_RATE).toLocaleString()} Naira
                          </p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[10, 50, 100].map(amt => (
                        <button 
                          key={amt}
                          onClick={() => setDepositAmount(amt)}
                          className={`py-3 rounded-xl border text-xs font-black uppercase transition-all ${depositAmount === amt ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setDepositModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase">Cancel</button>
                    <button 
                      disabled={depositAmount <= 0}
                      onClick={() => setDepositStep(2)}
                      className="flex-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase shadow-xl shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-30"
                    >
                      Select Method
                    </button>
                  </div>
                </div>
              )}

              {depositStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">Payment Method</h2>
                    <p className="text-slate-400 font-medium">Deposit of ${depositAmount.toFixed(2)}</p>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => setGateway('paystack')}
                      className={`w-full p-5 rounded-3xl border flex items-center justify-between transition-all ${gateway === 'paystack' ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                           <span className="text-[10px] font-black text-indigo-600">PAYSTACK</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">Secure Card</p>
                          <p className="text-[10px] text-slate-500">Local & International</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-600" />
                    </button>

                    <button 
                      onClick={() => setGateway('flutterwave')}
                      className={`w-full p-5 rounded-3xl border flex items-center justify-between transition-all ${gateway === 'flutterwave' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900 border-slate-800 hover:bg-slate-800'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                           <span className="text-[8px] font-black text-orange-500">FLUTTER</span>
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold text-white">Bank & Global Cards</p>
                          <p className="text-[10px] text-slate-500">Multiple currencies</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-600" />
                    </button>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => setDepositStep(1)} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase">Back</button>
                    <button 
                      disabled={!gateway}
                      onClick={handleDepositSubmit}
                      className="flex-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase shadow-xl shadow-indigo-900/40 transition-all active:scale-95 disabled:opacity-30"
                    >
                      Pay Securely
                    </button>
                  </div>
                </div>
              )}

              {depositStep === 3 && (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                   {isProcessing ? (
                     <>
                        <div className="relative">
                          <Loader2 size={64} className="text-emerald-500 animate-spin" />
                          <Lock className="absolute inset-0 m-auto text-emerald-500" size={24} />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-2xl font-black text-white">Validating Transaction</h3>
                           <p className="text-slate-400 text-sm">Waiting for secure confirmation from {gateway === 'paystack' ? 'Paystack' : 'Flutterwave'}...</p>
                        </div>
                     </>
                   ) : (
                     <>
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-in zoom-in duration-500">
                           <CheckCircle size={48} className="text-white" />
                        </div>
                        <div className="space-y-2">
                           <h3 className="text-3xl font-black text-white">Deposit Successful!</h3>
                           <p className="text-emerald-400 font-bold">${depositAmount.toFixed(2)} added to your wallet.</p>
                        </div>
                     </>
                   )}
                </div>
              )}
           </div>
        </div>
      )}

      {/* Withdrawal Modal (Existing logic preserved) */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-[110] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6">
           <div className="max-w-md w-full glass p-10 rounded-[3rem] border-rose-500/30 shadow-[0_0_100px_rgba(244,63,94,0.1)] space-y-8 animate-in zoom-in duration-300">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ArrowUpRight size={32} className="text-rose-500" />
                 </div>
                 <h2 className="text-3xl font-black text-white tracking-tight">Withdraw Funds</h2>
                 <p className="text-slate-400 font-medium">Available balance: ${user.walletBalance.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Amount to withdraw</label>
                    <div className="relative group">
                       <div className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-bold">$</div>
                       <input 
                         type="number" 
                         className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-10 pr-4 text-white font-black outline-none focus:border-rose-500/50"
                         placeholder="0.00"
                         onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                       />
                    </div>
                 </div>
                 
                 <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Payout Method</p>
                    <div className="flex items-center justify-between">
                       <span className="text-sm font-bold text-white">GTBank • **** 4242</span>
                       <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-500/10 px-2 py-0.5 rounded">Primary</span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setWithdrawModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black text-xs uppercase">Cancel</button>
                 <button 
                   onClick={handleWithdrawSubmit}
                   disabled={isProcessing || withdrawAmount <= 0}
                   className="flex-2 px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase shadow-xl shadow-rose-900/40 transition-all active:scale-95 disabled:opacity-50"
                 >
                   {isProcessing ? <Loader2 className="animate-spin mx-auto" size={18} /> : 'Confirm Payout'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default WalletView;
