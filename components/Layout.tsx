
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Rocket, 
  Settings, 
  LogOut, 
  Bell, 
  ShieldCheck,
  Menu,
  X,
  PlusCircle,
  Zap,
  User,
  Gift,
  Wallet,
  BarChart3
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  setActiveView: (view: string) => void;
  user: any;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'ad-manager', label: 'Ad Manager', icon: BarChart3 },
    { id: 'community', label: 'Growth Pact', icon: Users },
    { id: 'campaigns', label: 'Campaigns', icon: Rocket },
    { id: 'wallet', label: 'My Wallet', icon: Wallet },
    { id: 'referrals', label: 'Refer & Earn', icon: Gift },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'premium', label: 'Upgrade', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* Sidebar */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-72 glass border-r border-slate-800/50 transition-all duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8">
            <h1 className="text-2xl font-extrabold tracking-tighter flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center neo-shadow">
                <Zap size={24} className="text-white fill-white" />
              </div>
              <span className="gradient-text">Wetaract</span>
            </h1>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</p>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
                  activeView === item.id 
                    ? 'sidebar-item-active text-indigo-400' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <item.icon size={20} className={activeView === item.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-6">
            <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 mb-6">
              <p className="text-xs font-bold text-indigo-400 mb-1">WETARACT BALANCE</p>
              <p className="text-[11px] text-slate-400 mb-3">${user.walletBalance.toFixed(2)} USD</p>
              <button 
                onClick={() => setActiveView('wallet')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Withdraw Funds
              </button>
            </div>

            <button 
              onClick={() => setActiveView('profile')}
              className={`w-full flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-slate-800 transition-all text-left ${activeView === 'profile' ? 'bg-slate-900/40 border-slate-800' : ''}`}
            >
              <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-slate-800" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500">Elite Member</p>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#020617] relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-transparent border-b border-slate-900/50">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-100 capitalize">
              {activeView === 'premium' ? 'Membership' : activeView.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800">
              <Wallet size={14} className="text-emerald-400" />
              <span className="text-sm font-bold text-slate-300">${user.walletBalance.toFixed(2)}</span>
              <span className="text-[10px] font-medium text-slate-500 ml-1">USD</span>
            </div>
            
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
              <button className="p-2.5 text-slate-400 hover:bg-slate-900 rounded-full relative transition-colors">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#020617]"></span>
              </button>
              <button 
                onClick={() => setActiveView('create-campaign')}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
              >
                <PlusCircle size={18} />
                <span className="hidden sm:inline">Boost Content</span>
              </button>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
