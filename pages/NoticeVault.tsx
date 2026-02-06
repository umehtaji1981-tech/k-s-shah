import React, { useState, useMemo, useRef } from 'react';
import { Client, Notice, NoticeCategory, NoticeStatus } from '../types';
import { 
  FileSearch, 
  Upload, 
  Wand2, 
  AlertCircle, 
  IndianRupee, 
  ChevronRight, 
  Search,
  Filter,
  X,
  Sparkles,
  ArrowUpDown,
  Building2,
  Scale,
  Image as ImageIcon,
  FileWarning,
  ShieldCheck
} from 'lucide-react';

interface NoticeVaultProps {
  clients: Client[];
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
}

const NoticeVault: React.FC<NoticeVaultProps> = ({ clients, notices, setNotices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<keyof Notice>('replyDeadline');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [aiDraft, setAiDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = useMemo(() => {
    return {
      total: notices.length,
      open: notices.filter(n => n.status === 'Open').length,
      demand: notices.reduce((acc, n) => acc + n.demandAmount, 0),
      overdue: notices.filter(n => n.status === 'Overdue' || (n.status === 'Open' && new Date(n.replyDeadline) < new Date())).length,
      resolved: notices.filter(n => n.status === 'Resolved').length
    };
  }, [notices]);

  const filteredAndSortedNotices = useMemo(() => {
    return notices
      .filter(n => {
        const client = clients.find(c => c.id === n.clientId);
        const matchesSearch = client?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             n.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || n.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const aVal = a[sortField] || '';
        const bVal = b[sortField] || '';
        return sortOrder === 'asc' ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? -1 : 1);
      });
  }, [notices, searchTerm, statusFilter, sortField, sortOrder, clients]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert("AI Processing complete. Notice metadata extracted.");
    }, 2000);
  };

  const handleGenerateDraft = async (notice: Notice) => {
    setIsAiDrafting(true);
    setTimeout(() => {
      setAiDraft(`Subject: Formal Reply to Notice ${notice.referenceNumber}\n\nDear Sir/Madam,\n\nWe act on behalf of our client, ${clients.find(c => c.id === notice.clientId)?.name}. This is in response to the notice regarding demand of ₹${notice.demandAmount.toLocaleString()}. We deny the allegations and request a personal hearing...`);
      setIsAiDrafting(false);
    }, 1500);
  };

  const getStatusColor = (status: NoticeStatus) => {
    switch(status) {
      case 'Open': return 'bg-amber-50 text-[#F59E0B] border-amber-100';
      case 'Resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Notice Intelligence</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Statutory Response Engine</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 active:scale-95"
        >
          {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin"></div> : <Upload size={18} />}
          <span>{isProcessing ? 'Analyzing...' : 'Ingest Notice'}</span>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard label="Pending Cases" value={stats.open} sub="Action Required" icon={<AlertCircle size={20}/>} color="amber" orb="amber" />
        <StatCard label="Direct Tax" value="ITR" sub="Assessment Year" icon={<IndianRupee size={20}/>} color="emerald" />
        <StatCard label="Overdue SCN" value={stats.overdue} sub="High Risk" icon={<FileWarning size={20}/>} color="amber" orb="rose" />
        <StatCard label="Resolution Ratio" value="94%" sub="Closed Vault" icon={<ShieldCheck size={20}/>} color="indigo" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 bento-shadow overflow-hidden flex flex-col">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex flex-col lg:flex-row gap-6 bg-slate-50/30 dark:bg-slate-800/20">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by reference, client or section..."
              className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] outline-none focus:ring-4 focus:ring-indigo-500/5 font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/30 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Notice Ref</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Taxpayer</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Demand</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-bold text-sm">
              {filteredAndSortedNotices.map((n) => (
                <tr key={n.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all" onClick={() => setSelectedNotice(n)}>
                  <td className="px-10 py-6">
                    <span className="text-slate-900 dark:text-slate-100 font-black tracking-tighter">{n.referenceNumber}</span>
                    <p className="text-[10px] text-slate-400 uppercase font-black mt-1 tracking-[0.2em]">{n.section}</p>
                  </td>
                  <td className="px-10 py-6 text-slate-600 dark:text-slate-400 tracking-tight">{clients.find(c => c.id === n.clientId)?.name}</td>
                  <td className="px-10 py-6 text-right">
                    <span className="rupee-symbol">₹</span>
                    <span className="text-slate-900 dark:text-slate-100 font-black tracking-tighter">{(n.demandAmount || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-6 text-slate-500 font-black text-[11px] tracking-tight">{n.replyDeadline}</td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                       {n.status === 'Overdue' && <span className="status-orb status-orb-pulse bg-rose-500"></span>}
                       <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${getStatusColor(n.status)}`}>{n.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right"><ChevronRight size={18} className="text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all"/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intelligence Sheet - Mobile Bottom Sheet Optimized */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/80 backdrop-blur-lg animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] sm:rounded-[4rem] w-full max-w-7xl h-[94vh] sm:h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-sheet-up sm:animate-in sm:zoom-in-95 border-t sm:border border-slate-100 dark:border-slate-800">
            <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between glass-panel">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-[#F59E0B] text-white flex items-center justify-center shadow-2xl"><Scale size={28} /></div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">{selectedNotice.referenceNumber}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">{selectedNotice.category}</p>
                </div>
              </div>
              <button onClick={() => {setSelectedNotice(null); setAiDraft('');}} className="p-4 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 border border-slate-100 dark:border-slate-700 transition-all shadow-sm"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-950">
              <div className="lg:col-span-5 p-10 sm:p-12 space-y-10 overflow-y-auto border-r border-slate-100 dark:border-slate-800">
                <div className="space-y-4">
                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Sparkles size={16} className="text-indigo-500" /> Executive AI Brief</h5>
                  <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] text-sm font-bold text-slate-600 dark:text-slate-300 leading-relaxed shadow-inner border border-slate-100 dark:border-slate-800/50">{selectedNotice.aiSummary}</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 bento-shadow">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Notice Demand</p>
                    <p className="text-3xl font-black text-[#F59E0B] flex items-baseline tracking-tighter"><span className="rupee-symbol">₹</span>{selectedNotice.demandAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 bento-shadow">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Reply Deadline</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedNotice.replyDeadline}</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 p-10 sm:p-12 flex flex-col h-full bg-slate-50/30 dark:bg-slate-900/20">
                <div className="flex items-center justify-between mb-8">
                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2"><Wand2 size={16}/> Response Studio</h5>
                  <button onClick={() => handleGenerateDraft(selectedNotice)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95">{isAiDrafting ? 'DRAFTING...' : 'GENERATE AI RESPONSE'}</button>
                </div>
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 bento-shadow p-10 relative overflow-hidden">
                  {aiDraft ? (
                    <textarea className="w-full h-full bg-transparent border-none outline-none font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300 resize-none" value={aiDraft} onChange={(e) => setAiDraft(e.target.value)} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30 text-center space-y-6">
                       <Sparkles size={64} className="text-indigo-400 animate-pulse"/>
                       <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Initialize Response Engine</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number; sub: string; icon: React.ReactNode; color: string; isRupee?: boolean; orb?: string }> = ({ label, value, sub, icon, color, isRupee, orb }) => (
  <div className={`p-8 rounded-[2.5rem] border bento-shadow group hover:-translate-y-1 transition-all relative overflow-hidden ${color === 'rose' ? 'bg-rose-50/50 border-rose-100 text-rose-600 dark:bg-rose-900/10 dark:border-rose-900/30' : color === 'amber' ? 'bg-amber-50/50 border-amber-100 text-[#F59E0B] dark:bg-amber-900/10 dark:border-amber-900/30' : color === 'emerald' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600 dark:bg-emerald-900/10 dark:border-emerald-900/30' : 'bg-indigo-50/50 border-indigo-100 text-indigo-600 dark:bg-indigo-900/10 dark:border-indigo-900/30'}`}>
    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-500">{icon}</div>
    <div className="flex flex-col h-full justify-between relative z-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">{label}</p>
          {orb && <span className={`status-orb status-orb-pulse ${orb === 'rose' ? 'bg-rose-500' : orb === 'amber' ? 'bg-[#F59E0B]' : 'bg-indigo-500'}`}></span>}
        </div>
        <h4 className="text-4xl font-black tracking-tighter flex items-baseline">
          {isRupee && <span className="rupee-symbol">₹</span>}
          {value}
        </h4>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mt-3">{sub}</p>
    </div>
  </div>
);

export default NoticeVault;