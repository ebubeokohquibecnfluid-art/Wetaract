
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './views/Auth';
import Dashboard from './views/Dashboard';
import Community from './views/Community';
import Campaigns from './views/Campaigns';
import Membership from './views/Membership';
import Profile from './views/Profile';
import Referrals from './views/Referrals';
import WalletView from './views/Wallet';
import AdManager from './views/AdManager';
import { MembershipStatus, SocialPlatform, UserProfile } from './types';
import { 
  Sparkles, 
  RefreshCcw, 
  ArrowLeftRight, 
  Users, 
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Music2,
  Zap,
  Target,
  Link as LinkIcon,
  MessageSquare,
  Globe,
  Coins,
  Cpu,
  Info,
  Play
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStep, setSyncStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [user, setUser] = useState<UserProfile | null>(null);

  // Initial Data Fetch from Laravel
  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/v1/user')
        .then(res => res.json())
        .then(data => {
          setUser(data);
          setIsLoading(false);
        })
        .catch(err => console.error("API Load Error", err));
    }
  }, [isAuthenticated]);

  const handleMembershipUpgrade = async (planId: string) => {
    if (!user) return;

    setIsSyncing(true);
    setSyncStep(1);
    
    try {
      const response = await fetch('/api/v1/membership/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const err = await response.json();
        alert(err.error || "Upgrade failed");
        setIsSyncing(false);
        return;
      }

      const result = await response.json();
      setSyncStep(2);
      
      setTimeout(() => {
        setUser(result.user);
        setIsSyncing(false);
        setActiveView('dashboard');
      }, 2000);
    } catch (error) {
      alert("Connectivity error. Please try again.");
      setIsSyncing(false);
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    try {
      await fetch('/api/v1/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
    } catch (error) {
      console.error("Failed to sync user update", error);
    }
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard user={user} setActiveView={setActiveView} />;
      case 'community': return <Community currentUser={user} />;
      case 'campaigns': return <Campaigns currentUserInterests={user.interests} />;
      case 'wallet': return <WalletView user={user} onUpdateUser={handleUpdateUser} />;
      case 'referrals': return <Referrals user={user} />;
      case 'profile': return <Profile user={user} onUpdateUser={handleUpdateUser} />;
      case 'premium': return <Membership onUpgrade={handleMembershipUpgrade} currentStatus={user.membershipStatus} user={user} />;
      case 'ad-manager':
      case 'create-campaign': return <AdManager user={user} onUpdateUser={handleUpdateUser} />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950">
      {isSyncing && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="max-w-lg w-full glass p-10 rounded-[3rem] text-center space-y-8 animate-in zoom-in duration-500 border-indigo-500/30">
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
              <div className="relative z-10 w-full h-full bg-indigo-600 rounded-[2.5rem] flex items-center justify-center neo-shadow">
                <ArrowLeftRight size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight">Syncing with MySQL Hub</h2>
            <p className="text-slate-400 font-medium">Validating your transaction and updating your global profile...</p>
          </div>
        </div>
      )}
      
      <Layout activeView={activeView} setActiveView={setActiveView} user={user}>
        {renderView()}
      </Layout>
    </div>
  );
};

export default App;
