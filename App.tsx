
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  ShieldAlert, 
  FileText, 
  Settings as SettingsIcon, 
  Bell, 
  MessageSquare, 
  Plus,
  FileBarChart,
  ShieldAlert as NoticeIcon,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  ChevronDown,
  UserPlus,
  FilePlus,
  AlertTriangle,
  Calculator
} from 'lucide-react';
import { Client, FirmProfile, Invoice, Notice } from './types';
import { INITIAL_CLIENTS, INITIAL_FIRM_PROFILE, INITIAL_NOTICES, INITIAL_INVOICES } from './data';

// Component Imports
import Dashboard from './pages/Dashboard';
import ClientList from './pages/ClientList';
import ComplianceCenter from './pages/ComplianceCenter';
import DSCVault from './pages/DSCVault';
import InvoiceManager from './pages/InvoiceManager';
import SettingsPage from './pages/SettingsPage';
import CommunicationCenter from './pages/CommunicationCenter';
import Reports from './pages/Reports';
import ClientDetailDashboard from './pages/ClientDetailDashboard';
import NoticeVault from './pages/NoticeVault';
import TaxCalculators from './pages/TaxCalculators';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string; isDarkMode: boolean; onClick?: () => void }> = ({ to, icon, label, isDarkMode, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all font-black text-[9px] uppercase tracking-[0.1em] whitespace-nowrap ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' 
          : `hover:bg-slate-100 dark:hover:bg-slate-800 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`
      }`}
    >
      <span className={isActive ? 'text-white' : 'text-indigo-500'}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
};

const QuickActionDropdown: React.FC<{ isDarkMode: boolean; onAction: (type: string) => void }> = ({ isDarkMode, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 bg-indigo-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95"
      >
        <Plus size={14} />
        <span className="hidden xl:inline">Quick Action</span>
        <ChevronDown size={12} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-3 w-56 rounded-[1.5rem] shadow-2xl border p-2 z-[60] animate-in fade-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Entry</div>
          <button 
            onClick={() => { onAction('client'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <UserPlus size={14} className="text-indigo-500" />
            New Taxpayer
          </button>
          <button 
            onClick={() => { onAction('invoice'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <FilePlus size={14} className="text-emerald-500" />
            Issue Bill
          </button>
          <button 
            onClick={() => { onAction('notice'); setIsOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[10px] font-black uppercase tracking-wider transition-all ${isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-50 text-slate-600'}`}
          >
            <AlertTriangle size={14} className="text-amber-500" />
            Record Notice
          </button>
        </div>
      )}
    </div>
  );
};

const MainContent: React.FC<{ 
  clients: Client[]; 
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  firmProfile: FirmProfile;
  setFirmProfile: React.Dispatch<React.SetStateAction<FirmProfile>>;
  isAddClientOpen: boolean;
  setIsAddClientOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}> = ({ 
  clients, setClients, invoices, setInvoices, notices, setNotices, firmProfile, setFirmProfile, 
  isAddClientOpen, setIsAddClientOpen, isDarkMode, setIsDarkMode, isMobileMenuOpen, setIsMobileMenuOpen 
}) => {
  const navigate = useNavigate();
  
  const handleQuickAction = (type: string) => {
    switch(type) {
      case 'client':
        navigate('/clients');
        setIsAddClientOpen(true);
        break;
      case 'invoice':
        navigate('/invoices');
        break;
      case 'notice':
        navigate('/notices');
        break;
      default:
        break;
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Unified Horizontal Header */}
      <header className={`h-20 lg:h-24 px-4 lg:px-8 border-b z-50 flex items-center justify-between no-print transition-all duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800 backdrop-blur-xl' : 'bg-white/90 border-slate-100 backdrop-blur-xl shadow-sm'}`}>
        
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 min-w-fit">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-xl">
            <Menu size={20} />
          </button>
          {firmProfile.logoUrl ? (
            <img src={firmProfile.logoUrl} alt="Firm Logo" className="w-8 h-8 lg:w-10 lg:h-10 rounded-[0.85rem] object-cover shadow-lg shadow-indigo-500/10" />
          ) : (
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-indigo-600 rounded-[0.85rem] flex items-center justify-center font-black text-lg text-white shadow-lg shadow-indigo-500/30">
              {firmProfile.name[0]}
            </div>
          )}
          <div className="hidden sm:block">
            <h1 className="font-black text-sm lg:text-base leading-tight tracking-tighter">TaxEase</h1>
            <span className="text-[7px] lg:text-[8px] text-indigo-500 font-black tracking-[0.2em] uppercase">Pro Hub</span>
          </div>
        </div>

        {/* Centered Desktop Navigation - Optimized Spacing */}
        <nav className="hidden lg:flex items-center gap-0.5 mx-2 overflow-x-auto no-scrollbar scroll-smooth flex-1 justify-center">
          <NavItem to="/" icon={<LayoutDashboard size={14} />} label="Dashboard" isDarkMode={isDarkMode} />
          <NavItem to="/clients" icon={<Users size={14} />} label="Clients" isDarkMode={isDarkMode} />
          <NavItem to="/compliance" icon={<ClipboardCheck size={14} />} label="Compliance" isDarkMode={isDarkMode} />
          <NavItem to="/notices" icon={<NoticeIcon size={14} />} label="Notices" isDarkMode={isDarkMode} />
          <NavItem to="/calculators" icon={<Calculator size={14} />} label="Studio" isDarkMode={isDarkMode} />
          <NavItem to="/dsc-vault" icon={<ShieldAlert size={14} />} label="DSC Hub" isDarkMode={isDarkMode} />
          <NavItem to="/reports" icon={<FileBarChart size={14} />} label="Reports" isDarkMode={isDarkMode} />
          <NavItem to="/invoices" icon={<FileText size={14} />} label="Billing" isDarkMode={isDarkMode} />
          <NavItem to="/comms" icon={<MessageSquare size={14} />} label="Comms" isDarkMode={isDarkMode} />
          <NavItem to="/settings" icon={<SettingsIcon size={14} />} label="Settings" isDarkMode={isDarkMode} />
        </nav>

        {/* Global Action Hub */}
        <div className="flex items-center gap-2 min-w-fit">
          <div className="hidden xl:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl mr-1">
            <button onClick={() => setIsDarkMode(false)} className={`p-2 rounded-xl transition-all ${!isDarkMode ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500'}`}>
              <Sun size={14} />
            </button>
            <button onClick={() => setIsDarkMode(true)} className={`p-2 rounded-xl transition-all ${isDarkMode ? 'bg-slate-700 text-indigo-400 shadow-sm' : 'text-slate-500'}`}>
              <Moon size={14} />
            </button>
          </div>

          <QuickActionDropdown isDarkMode={isDarkMode} onAction={handleQuickAction} />
          
          <Link to="/settings" className={`flex items-center gap-2 p-1 pr-3 rounded-2xl border transition-all hover:border-indigo-200 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            {firmProfile.logoUrl ? (
              <img src={firmProfile.logoUrl} alt="Avatar" className="w-7 h-7 lg:w-9 lg:h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                {firmProfile.authorizedSignatory[0]}
              </div>
            )}
            <div className="hidden 2xl:block text-left leading-none">
              <p className="text-[9px] font-black tracking-tight max-w-[80px] truncate">{firmProfile.name}</p>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
            </div>
          </Link>
        </div>
      </header>

      {/* System Pulsar Ribbon */}
      <div className="bg-indigo-600 dark:bg-indigo-900 px-6 lg:px-10 py-1 flex items-center gap-6 no-print overflow-x-auto whitespace-nowrap no-scrollbar select-none">
         <div className="flex items-center gap-2">
            <div className="status-orb status-orb-pulse bg-indigo-200 !w-1.5 !h-1.5"></div>
            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-white">Database Sync Active</p>
         </div>
         <div className="h-2 w-px bg-white/20"></div>
         <div className="flex items-center gap-2">
            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-indigo-200">GSTR-1 Window:</p>
            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-white">April 11</p>
         </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="absolute top-0 left-0 bottom-0 w-72 bg-white dark:bg-slate-900 shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">T</div>
                <span className="font-black tracking-tighter">TaxEase</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/clients" icon={<Users size={18} />} label="Clients" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/compliance" icon={<ClipboardCheck size={18} />} label="Compliance" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/notices" icon={<NoticeIcon size={18} />} label="Notices" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/calculators" icon={<Calculator size={18} />} label="Tax Studio" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/dsc-vault" icon={<ShieldAlert size={18} />} label="DSC Vault" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/reports" icon={<FileBarChart size={18} />} label="Reports" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/invoices" icon={<FileText size={18} />} label="Invoices" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/comms" icon={<MessageSquare size={18} />} label="Communication" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
              <NavItem to="/settings" icon={<SettingsIcon size={18} />} label="Settings" isDarkMode={isDarkMode} onClick={() => setIsMobileMenuOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard clients={clients} invoices={invoices} />} />
            <Route path="/clients" element={<ClientList clients={clients} setClients={setClients} isModalOpen={isAddClientOpen} setIsModalOpen={setIsAddClientOpen} />} />
            <Route path="/clients/:id" element={<ClientDetailDashboard clients={clients} invoices={invoices} />} />
            <Route path="/compliance" element={<ComplianceCenter clients={clients} />} />
            <Route path="/dsc-vault" element={<DSCVault clients={clients} />} />
            <Route path="/invoices" element={<InvoiceManager clients={clients} invoices={invoices} setInvoices={setInvoices} firmProfile={firmProfile} />} />
            <Route path="/notices" element={<NoticeVault clients={clients} notices={notices} setNotices={setNotices} />} />
            <Route path="/calculators" element={<TaxCalculators />} />
            <Route path="/settings" element={<SettingsPage firmProfile={firmProfile} setFirmProfile={setFirmProfile} />} />
            <Route path="/comms" element={<CommunicationCenter clients={clients} firmProfile={firmProfile} />} />
            <Route path="/reports" element={<Reports clients={clients} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [firmProfile, setFirmProfile] = useState<FirmProfile>(INITIAL_FIRM_PROFILE);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);
  
  return (
    <HashRouter>
      <MainContent 
        clients={clients} setClients={setClients}
        invoices={invoices} setInvoices={setInvoices}
        notices={notices} setNotices={setNotices}
        firmProfile={firmProfile} setFirmProfile={setFirmProfile}
        isAddClientOpen={isAddClientOpen} setIsAddClientOpen={setIsAddClientOpen}
        isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}
        isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
    </HashRouter>
  );
};

export default App;
