
import React, { useState, useMemo } from 'react';
import { Client, ReturnType } from '../types';
import { 
  FileText, 
  Search, 
  Download, 
  Printer, 
  Filter, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  ChevronDown
} from 'lucide-react';

interface ReportsProps {
  clients: Client[];
}

const Reports: React.FC<ReportsProps> = ({ clients }) => {
  const [filterClient, setFilterClient] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');

  const reportData = useMemo(() => {
    let allReturns = clients.flatMap(c => 
      c.returns.map(r => ({
        ...r,
        clientName: c.name,
        clientId: c.id,
        pan: c.pan,
        gstin: c.gstin
      }))
    );

    return allReturns.filter(r => {
      const matchClient = filterClient === 'All' || r.clientId === filterClient;
      const matchType = filterType === 'All' || 
                        (filterType === 'GST' && r.type.includes('GSTR')) ||
                        (filterType === 'ITR' && r.type.includes('ITR'));
      const matchStatus = filterStatus === 'All' || r.status === filterStatus;
      
      const returnDate = new Date(r.dueDate);
      const matchStart = !dateStart || returnDate >= new Date(dateStart);
      const matchEnd = !dateEnd || returnDate <= new Date(dateEnd);

      return matchClient && matchType && matchStatus && matchStart && matchEnd;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [clients, filterClient, filterType, filterStatus, dateStart, dateEnd]);

  const stats = useMemo(() => {
    return {
      total: reportData.length,
      filed: reportData.filter(r => r.status === 'Filed').length,
      pending: reportData.filter(r => r.status === 'Pending').length,
      overdue: reportData.filter(r => r.status === 'Overdue').length,
    };
  }, [reportData]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header - Hidden on Print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Compliance Analytics</h2>
          <p className="text-slate-500">Generate and export detailed filing performance reports</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-bold shadow-sm"
            onClick={() => alert('Exporting CSV...')}
          >
            <Download size={18} />
            <span>CSV</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all font-bold active:scale-95"
          >
            <Printer size={18} />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Bar - Hidden on Print */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 no-print">
        <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-2">
          <Filter size={14} /> Report Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select 
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none appearance-none"
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
              >
                <option value="All">All Clients</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Return Category</label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="GST">GST Returns</option>
              <option value="ITR">Income Tax (ITR)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filing Status</label>
            <select 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Filed">Filed</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due From</label>
            <input 
              type="date"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due To</label>
            <input 
              type="date"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Report Summary - Shown on Print */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <SummaryCard label="Total returns" value={stats.total} icon={<FileText size={20}/>} color="indigo" />
        <SummaryCard label="Filed returns" value={stats.filed} icon={<CheckCircle size={20}/>} color="emerald" />
        <SummaryCard label="Pending returns" value={stats.pending} icon={<Clock size={20}/>} color="amber" />
        <SummaryCard label="Overdue returns" value={stats.overdue} icon={<AlertCircle size={20}/>} color="rose" />
      </div>

      {/* Main Report Table */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="p-8 border-b border-slate-50 print:pb-4">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Filing Performance Report</h3>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Generated on {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 print:bg-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / Identifiers</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Return Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {reportData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-800 text-sm">{item.clientName}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase">{item.pan}</span>
                      {item.gstin && <span className="text-[9px] font-black text-slate-400 uppercase border-l pl-2">{item.gstin}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-black px-2 py-1 rounded bg-slate-100 text-slate-700">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600">{item.period}</td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{item.dueDate}</td>
                  <td className="px-8 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border shadow-sm ${
                      item.status === 'Filed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      item.status === 'Overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {reportData.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic">
                    No compliance records found for the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
            {reportData.length > 0 && (
              <tfoot className="bg-slate-50/50 print:bg-white">
                <tr>
                  <td colSpan={5} className="px-8 py-6 text-[10px] font-bold text-slate-400 italic">
                    * This is a system-generated report for internal audit and client review.
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard: React.FC<{ label: string; value: number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => {
  const styles: Record<string, string> = {
    indigo: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600',
    amber: 'bg-amber-50 border-amber-100 text-amber-600',
    rose: 'bg-rose-50 border-rose-100 text-rose-600',
  };

  return (
    <div className={`p-6 rounded-3xl border ${styles[color]} shadow-sm print:bg-white print:border-slate-200`}>
      <div className="flex items-center gap-3 mb-2 opacity-60">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <h4 className="text-3xl font-black tracking-tighter">{value}</h4>
    </div>
  );
};

export default Reports;
