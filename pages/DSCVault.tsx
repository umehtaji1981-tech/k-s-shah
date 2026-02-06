
import React from 'react';
import { Client } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Mail, 
  MessageCircle, 
  BellRing,
  ExternalLink,
  Plus
} from 'lucide-react';

interface DSCVaultProps {
  clients: Client[];
}

const DSCVault: React.FC<DSCVaultProps> = ({ clients }) => {
  const dscClients = clients.filter(c => c.dscExpiry);
  const now = new Date();

  const getDaysRemaining = (expiry: string) => {
    const expiryDate = new Date(expiry);
    const diffTime = expiryDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">DSC & Token Vault</h2>
          <p className="text-slate-500">Monitor validity of Digital Signature Certificates for directors</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all font-semibold">
          <Plus size={18} />
          <span>Register New DSC</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dscClients.map(client => {
          const daysLeft = getDaysRemaining(client.dscExpiry!);
          const isExpiringSoon = daysLeft <= 30 && daysLeft > 0;
          const isExpired = daysLeft <= 0;

          return (
            <div key={client.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all group">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    isExpired ? 'bg-rose-50 text-rose-600' : isExpiringSoon ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    {isExpired || isExpiringSoon ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      isExpired ? 'text-rose-600' : isExpiringSoon ? 'text-amber-600' : 'text-slate-800'
                    }`}>
                      {isExpired ? 'Expired' : `${daysLeft} Days Left`}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Validity</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-800 leading-tight">{client.dscHolderName}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{client.name}</p>
                  </div>

                  <div className="flex items-center gap-6 py-4 border-y border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Expiry Date</p>
                      <p className="text-sm font-bold text-slate-700">{client.dscExpiry}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Token Type</p>
                      <p className="text-sm font-bold text-slate-700">Class 3 (USB)</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="p-2 bg-white rounded-xl text-slate-400 hover:text-emerald-500 border border-slate-200 shadow-sm transition-all" title="WhatsApp Reminder">
                    <MessageCircle size={18} />
                  </button>
                  <button className="p-2 bg-white rounded-xl text-slate-400 hover:text-blue-500 border border-slate-200 shadow-sm transition-all" title="Email Alert">
                    <Mail size={18} />
                  </button>
                </div>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <BellRing size={14} />
                  <span>Set Alert</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DSCVault;
