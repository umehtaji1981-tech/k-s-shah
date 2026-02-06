
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Client, Invoice, RefundStatus } from '../types';
import { 
  ArrowLeft, 
  Building2, 
  Mail, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  FileText,
  Calendar,
  IndianRupee,
  ChevronRight,
  Briefcase,
  Smartphone,
  Fingerprint,
  Stamp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ClientDetailDashboardProps {
  clients: Client[];
  invoices: Invoice[];
}

const ClientDetailDashboard: React.FC<ClientDetailDashboardProps> = ({ clients, invoices }) => {
  const { id } = useParams<{ id: string }>();
  const client = clients.find(c => c.id === id);
  const clientInvoices = invoices.filter(inv => inv.clientId === id);

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <AlertCircle size={48} className="mb-4 opacity-20" />
        <h2 className="text-xl font-bold">Client Not Found</h2>
        <Link to="/clients" className="mt-4 text-indigo-600 font-bold hover:underline">Back to Client Portfolio</Link>
      </div>
    );
  }

  const pendingReturns = client.returns.filter(r => r.status === 'Pending' || r.status === 'Overdue');
  const totalOutstanding = clientInvoices.filter(i => i.status === 'Unpaid').reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-6">
          <Link to="/clients" className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl text-slate-400 hover:text-indigo-600 border border-slate-100 shadow-sm transition-all active:scale-95">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{client.name}</h2>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{client.constitution}</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Fingerprint size={12} /> PAN: {client.pan}
              </span>
              {client.gstin && (
                <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                  <Stamp size={12} /> GST: {client.gstin}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
            <MessageCircle size={18} />
            <span>Connect on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
        <StatSummaryCard label="Pending returns" value={pendingReturns.length} icon={<Clock className="text-amber-500" size={24} />} />
        <StatSummaryCard label="Unpaid Billing" value={`₹${totalOutstanding.toLocaleString()}`} icon={<IndianRupee className="text-rose-500" size={24} />} />
        <StatSummaryCard label="DSC Validity" value={client.dscExpiry || 'N/A'} icon={<ShieldCheck className={client.dscExpiry ? "text-emerald-500" : "text-slate-200"} size={24} />} />
        <StatSummaryCard label="Refund Status" value={client.refundStatus} icon={<div className={`w-3 h-3 rounded-full ${client.refundStatus === RefundStatus.REFUNDED ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Compliance Table & Invoices (Left 8/12) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] flex items-center gap-3">
                <FileText size={16} className="text-indigo-600" /> Statutory Filing Ledger
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Return Type</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Period</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {client.returns.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6 font-black text-slate-800 text-sm">{r.type}</td>
                      <td className="px-8 py-6 text-xs text-slate-500">{r.period}</td>
                      <td className="px-8 py-6 text-xs font-black text-slate-600">{r.dueDate}</td>
                      <td className="px-8 py-6 text-right">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border ${
                          r.status === 'Filed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          r.status === 'Overdue' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                          'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
            <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em] mb-8 flex items-center gap-3">
              <IndianRupee size={16} className="text-indigo-600" /> Recent Service Invoices
            </h3>
            <div className="space-y-4">
              {clientInvoices.length > 0 ? clientInvoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] hover:bg-indigo-50/30 transition-all border border-transparent hover:border-indigo-100">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">{inv.id}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{inv.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">₹{inv.totalAmount.toLocaleString()}</p>
                      <span className={`text-[9px] font-black uppercase ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {inv.status}
                      </span>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-indigo-600 shadow-sm transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-slate-400 text-sm font-bold">No professional billing history found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Dossier (Right 4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
              <Building2 size={120} />
            </div>
            <h3 className="font-black uppercase text-[10px] tracking-[0.3em] mb-10 text-indigo-400">Business Dossier</h3>
            <div className="space-y-8 relative">
              <DossierItem label="Portal Email" value={client.contactEmail} icon={<Mail size={16} />} />
              <DossierItem label="Primary WhatsApp" value={`+${client.whatsapp}`} icon={<MessageCircle size={16} />} />
              {client.mobile && <DossierItem label="Alternate Mobile" value={`+${client.mobile}`} icon={<Smartphone size={16} />} />}
              <DossierItem label="TAN Number" value={client.tan || 'Not Applied'} icon={<Fingerprint size={16} />} />
              <DossierItem label="MSME/Udyam" value={client.msmeRegNo || 'Not Registered'} icon={<Stamp size={16} />} />
              <DossierItem label="Business Nature" value={client.natureOfBusiness || 'Not Specified'} icon={<Briefcase size={16} />} />
              
              <div className="pt-6 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Principal Address</p>
                <p className="text-xs font-medium leading-relaxed text-slate-300">{client.address}</p>
              </div>
            </div>
            
            <button className="w-full mt-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all active:scale-95 shadow-xl">
              Edit Full Profile
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 no-print">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-slate-900 uppercase text-[10px] tracking-[0.2em]">Refund Pulse</h3>
              <IndianRupee className="text-emerald-500" size={18} />
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
              <div className={`absolute inset-y-0 left-0 bg-emerald-500 rounded-full transition-all duration-1000 ${
                  client.refundStatus === RefundStatus.REFUNDED ? 'w-full' :
                  client.refundStatus === RefundStatus.SENT_TO_BANK ? 'w-[75%]' :
                  client.refundStatus === RefundStatus.UNDER_PROCESS ? 'w-[40%]' :
                  'w-[10%]'
                }`}
              ></div>
            </div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-widest">{client.refundStatus}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 leading-relaxed">Tracking live status from Income Tax Department portal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatSummaryCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 group-hover:text-indigo-500 transition-colors">{label}</p>
    <div className="flex items-center justify-between">
      <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
      {icon}
    </div>
  </div>
);

const DossierItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/5 text-indigo-300">
      {icon}
    </div>
    <div className="overflow-hidden">
      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold truncate text-indigo-50">{value}</p>
    </div>
  </div>
);

export default ClientDetailDashboard;
