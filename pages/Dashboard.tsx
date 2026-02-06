
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Client, Invoice, ReturnType } from '../types';
import { 
  Calendar, 
  AlertCircle, 
  Clock, 
  ArrowRight,
  Users,
  ShieldAlert,
  TrendingUp,
  FileText
} from 'lucide-react';

interface DashboardProps {
  clients: Client[];
  invoices: Invoice[];
}

const Dashboard: React.FC<DashboardProps> = ({ clients, invoices }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const totalClients = clients.length;
  const pendingReturns = clients.reduce((acc, client) => 
    acc + client.returns.filter(r => r.status === 'Pending').length, 0);
  
  const now = new Date();
  const dscExpiriesSoon = clients.filter(c => {
    if (!c.dscExpiry) return false;
    const expiryDate = new Date(c.dscExpiry);
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  }).length;

  const data = [
    { name: 'GSTR-1', count: clients.reduce((acc, c) => acc + c.returns.filter(r => r.type === ReturnType.GSTR_1).length, 0) },
    { name: 'GSTR-3B', count: clients.reduce((acc, c) => acc + c.returns.filter(r => r.type === ReturnType.GSTR_3B).length, 0) },
    { name: 'GSTR-9', count: clients.reduce((acc, c) => acc + c.returns.filter(r => r.type === ReturnType.GSTR_9).length, 0) },
    { name: 'ITR Hub', count: clients.reduce((acc, c) => acc + c.returns.filter(r => r.type.includes('ITR')).length, 0) },
  ];

  const COLORS = ['#4F46E5', '#6366F1', '#818CF8', '#10B981']; 

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-36 rounded-[2rem] skeleton shadow-sm border border-slate-100 dark:border-slate-800" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[450px] rounded-[3rem] skeleton shadow-sm" />
          <div className="h-[450px] rounded-[3rem] skeleton shadow-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* KPI Bento Grid - Increased Length & Spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 no-print">
        <StatCard 
          label="Active Taxpayers" 
          value={totalClients} 
          icon={<Users size={20} />} 
          color="indigo" 
          trend="+2 New Enrolled"
        />
        <StatCard 
          label="GST Compliance" 
          value={pendingReturns} 
          icon={<FileText size={20} />} 
          color="indigo" 
          orb="indigo"
          trend="Next Deadline: Apr 11"
        />
        <StatCard 
          label="Show Cause Notices" 
          value="4" 
          icon={<AlertCircle size={20} />} 
          color="amber" 
          orb="amber"
          trend="Immediate Action"
        />
        <StatCard 
          label="Direct Tax Hub" 
          value="AY 25" 
          icon={<ShieldAlert size={20} />} 
          color="emerald" 
          trend="Return Drafting"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 no-print">
        {/* Large Bento Chart Section - Expanded Height */}
        <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 bento-shadow transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">Filing Analytics Ledger</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1.5">Compliance Distribution Monitor</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
              <span className="status-orb status-orb-pulse bg-indigo-500 !w-2 !h-2"></span>
              <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">Global Sync Active</span>
            </div>
          </div>
          <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#818CF8" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc', opacity: 0.6}}
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', padding: '16px'}}
                />
                <Bar dataKey="count" fill="url(#barGradient)" radius={[10, 10, 3, 3]} barSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Square Bento Pie Section - Expanded Height */}
        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 bento-shadow transition-all duration-500 hover:-translate-y-1.5 flex flex-col overflow-hidden">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tighter mb-8">Workload Pulse</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={10}
                    dataKey="count"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-10 space-y-4">
              {data.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 px-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{d.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-slate-100 tracking-tighter">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* List Bento Sections - Longer Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10 no-print">
        <DashboardListSection title="Critical Filing Deadlines" clients={clients} type="returns" />
        <DashboardListSection title="DSC Compliance Monitor" clients={clients} type="dsc" />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number | string; icon: React.ReactNode; color: string; trend: string; orb?: string }> = ({ label, value, icon, color, trend, orb }) => {
  const styles: Record<string, string> = {
    indigo: 'bg-indigo-600 text-white shadow-indigo-300/20',
    amber: 'bg-[#F59E0B] text-white shadow-amber-300/20',
    rose: 'bg-rose-500 text-white shadow-rose-300/20',
    emerald: 'bg-emerald-500 text-white shadow-emerald-300/20',
  };

  const orbColors: Record<string, string> = {
    indigo: 'bg-indigo-200 shadow-[0_0_10px_rgba(255,255,255,0.6)]',
    amber: 'bg-white shadow-[0_0_10px_white]',
    rose: 'bg-white shadow-[0_0_12px_white]',
  };

  return (
    <div className={`p-8 rounded-[2rem] ${styles[color]} bento-shadow relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}>
      <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-700">
        {icon}
      </div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 truncate">{label}</p>
            {orb && <span className={`status-orb status-orb-pulse !w-2 !h-2 ${orbColors[orb] || 'bg-white'}`}></span>}
          </div>
          <h4 className="text-4xl font-black tracking-tighter leading-none">{value}</h4>
        </div>
        <div className="flex items-center gap-2 mt-8">
          <TrendingUp size={14} className="opacity-70" />
          <span className="text-[9px] font-black uppercase tracking-widest opacity-80">{trend}</span>
        </div>
      </div>
    </div>
  );
};

const DashboardListSection: React.FC<{ title: string; clients: Client[]; type: 'returns' | 'dsc' }> = ({ title, clients, type }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bento-shadow transition-all duration-500 hover:shadow-2xl">
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-xl font-black tracking-tighter text-slate-900 dark:text-slate-100 uppercase tracking-tight">{title}</h3>
      <button className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2 group">
        Explore All <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform"/>
      </button>
    </div>
    <div className="space-y-4">
      {type === 'returns' ? (
        clients.slice(0, 4).map(client => (
          client.returns.filter(r => r.status === 'Pending').map(r => (
            <div key={r.id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
              <div className="flex items-center gap-5 overflow-hidden">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 transition-all group-hover:scale-105 ${r.type.includes('GSTR') ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  <Calendar size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 transition-colors tracking-tighter truncate">{client.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 truncate">{r.type} • Period: {r.period}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-sm font-black text-rose-600 tracking-tighter">{r.dueDate}</p>
                <div className="mt-1 flex justify-end">
                   <span className="status-orb bg-rose-500 opacity-60 !w-2 !h-2"></span>
                </div>
              </div>
            </div>
          ))
        )).flat().slice(0, 4)
      ) : (
        clients.filter(c => c.dscExpiry).slice(0, 4).map(client => (
          <div key={client.id} className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] flex items-center justify-between hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
            <div className="flex items-center gap-5 overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md flex-shrink-0 transition-all group-hover:scale-105">
                <ShieldAlert size={20} />
              </div>
              <div className="overflow-hidden">
                <p className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight group-hover:text-emerald-600 transition-colors tracking-tighter truncate">{client.dscHolderName}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 truncate">{client.name}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="text-sm font-black text-emerald-600 tracking-tighter">{client.dscExpiry}</p>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Renewal Due</p>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default Dashboard;
