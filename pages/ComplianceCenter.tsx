
import React, { useState } from 'react';
import { Client, ComplianceReturn, ReturnType } from '../types';
import { 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  Filter,
  Download,
  // Added missing icon
  ClipboardCheck
} from 'lucide-react';

interface ComplianceCenterProps {
  clients: Client[];
}

const ComplianceCenter: React.FC<ComplianceCenterProps> = ({ clients }) => {
  const [activeTab, setActiveTab] = useState<'All' | 'GST' | 'ITR'>('All');

  const allReturns = clients.flatMap(c => c.returns.map(r => ({ ...r, clientName: c.name, clientEmail: c.contactEmail })));
  
  const filteredReturns = allReturns.filter(r => {
    if (activeTab === 'All') return true;
    if (activeTab === 'GST') return r.type.includes('GSTR');
    if (activeTab === 'ITR') return r.type.includes('ITR');
    return true;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Filed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Compliance Center</h2>
          <p className="text-slate-500">Track and update filing statuses for all clients</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-600 font-medium shadow-sm">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="flex items-center p-1 bg-slate-200/50 rounded-xl w-fit">
        {['All', 'GST', 'ITR'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab 
              ? 'bg-white text-indigo-600 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReturns.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 transition-all group flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${getStatusStyle(item.status)}`}>
                {item.status === 'Filed' ? <CheckCircle size={24} /> : 
                 item.status === 'Overdue' ? <AlertCircle size={24} /> : 
                 <Clock size={24} />}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  {item.clientName}
                  <ChevronRight size={14} className="text-slate-300" />
                  <span className="text-indigo-600 font-semibold">{item.type}</span>
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar size={12} />
                    Period: {item.period}
                  </span>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{item.frequency}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-12 w-full md:w-auto">
              <div className="text-left md:text-right">
                <p className={`text-xs font-bold ${item.status === 'Overdue' ? 'text-rose-600' : 'text-slate-700'}`}>
                  Due: {item.dueDate}
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Deadline</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-100 hover:border-indigo-200 rounded-xl text-xs font-bold transition-all">
                  Update Status
                </button>
                <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredReturns.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ClipboardCheck className="text-slate-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No returns found</h3>
            <p className="text-slate-400 text-sm">No compliance records match the selected filter</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceCenter;
