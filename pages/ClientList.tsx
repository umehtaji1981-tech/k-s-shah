import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Client, FilingFrequency, ReturnType, RefundStatus, ComplianceReturn } from '../types';
import { 
  Search, 
  Edit2, 
  UserPlus, 
  Building2, 
  X, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Fingerprint, 
  Users, 
  Settings2, 
  FileCheck2, 
  CalendarDays, 
  MapPin,
  AlertCircle
} from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

interface ValidationErrors {
  name?: string;
  pan?: string;
}

const ClientList: React.FC<ClientListProps> = ({ clients, setClients, isModalOpen, setIsModalOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Form State
  const [formData, setFormData] = useState<Partial<Client>>({
    name: '',
    pan: '',
    gstin: '',
    tan: '',
    constitution: 'Proprietorship',
    natureOfBusiness: '',
    address: '',
    contactEmail: '',
    whatsapp: '',
    mobile: '',
    refundStatus: RefundStatus.NOT_FILED
  });

  // Service Enrollment State
  const [services, setServices] = useState({
    gstr1: true,
    gstr3b: true,
    gstr9: false,
    itr: true,
    gstFreq: FilingFrequency.MONTHLY,
    itrType: ReturnType.ITR_1
  });

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.gstin && c.gstin.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      name: '', pan: '', gstin: '', tan: '', constitution: 'Proprietorship',
      natureOfBusiness: '', address: '', contactEmail: '', whatsapp: '', mobile: '',
      refundStatus: RefundStatus.NOT_FILED
    });
    setServices({
      gstr1: true, gstr3b: true, gstr9: false, itr: true,
      gstFreq: FilingFrequency.MONTHLY, itrType: ReturnType.ITR_1
    });
    setErrors({});
  };

  const handleEdit = (client: Client) => {
    setFormData(client);
    const hasG1 = client.returns.some(r => r.type === ReturnType.GSTR_1);
    const hasG3 = client.returns.some(r => r.type === ReturnType.GSTR_3B);
    const hasG9 = client.returns.some(r => r.type === ReturnType.GSTR_9);
    const itrR = client.returns.find(r => r.type.includes('ITR'));
    
    setServices({
      gstr1: hasG1,
      gstr3b: hasG3,
      gstr9: hasG9,
      itr: !!itrR,
      gstFreq: client.returns[0]?.frequency || FilingFrequency.MONTHLY,
      itrType: itrR ? itrR.type : ReturnType.ITR_1
    });
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (deleteConfirmId) {
      setClients(prev => prev.filter(c => c.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    }
  };

  const handleSaveClient = () => {
    const newErrors: ValidationErrors = {};
    if (!formData.name) newErrors.name = 'Legal name is required';
    if (!formData.pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) newErrors.pan = 'Invalid PAN format';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const generatedReturns: ComplianceReturn[] = [];
    const currentFY = "FY 2024-25";

    if (services.gstr1) {
      generatedReturns.push({
        id: `G1-${Date.now()}`,
        type: ReturnType.GSTR_1,
        period: services.gstFreq === FilingFrequency.MONTHLY ? 'Apr 2024' : 'Q1 2024',
        dueDate: '2024-05-11',
        status: 'Pending',
        frequency: services.gstFreq
      });
    }
    if (services.gstr3b) {
      generatedReturns.push({
        id: `G3-${Date.now()}`,
        type: ReturnType.GSTR_3B,
        period: services.gstFreq === FilingFrequency.MONTHLY ? 'Apr 2024' : 'Q1 2024',
        dueDate: '2024-05-20',
        status: 'Pending',
        frequency: services.gstFreq
      });
    }
    if (services.gstr9) {
      generatedReturns.push({
        id: `G9-${Date.now()}`,
        type: ReturnType.GSTR_9,
        period: 'FY 2023-24',
        dueDate: '2024-12-31',
        status: 'Pending',
        frequency: FilingFrequency.ANNUAL
      });
    }
    if (services.itr) {
      generatedReturns.push({
        id: `ITR-${Date.now()}`,
        type: services.itrType,
        period: currentFY,
        dueDate: '2025-07-31',
        status: 'Pending',
        frequency: FilingFrequency.ANNUAL
      });
    }

    const finalClient: Client = {
      ...formData as Client,
      id: formData.id || Date.now().toString(),
      returns: generatedReturns
    };

    setClients(prev => {
      const exists = prev.find(c => c.id === finalClient.id);
      if (exists) return prev.map(c => c.id === finalClient.id ? finalClient : c);
      return [finalClient, ...prev];
    });

    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Client Portfolio</h2>
          <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Managing {clients.length} Statutory Entities</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-600/30 transition-all font-black text-xs uppercase tracking-widest active:scale-95"
        >
          <UserPlus size={18} />
          <span>Onboard Taxpayer</span>
        </button>
      </div>

      <div className="relative group no-print">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={22} />
        <input 
          type="text" 
          placeholder="Search by legal name, PAN, or GSTIN..."
          className="w-full pl-16 pr-6 py-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all bento-shadow font-bold text-slate-700 dark:text-slate-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredClients.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 bento-shadow overflow-hidden no-print transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxpayer Identity</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statutory Hub</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Services</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredClients.map(client => (
                  <tr key={client.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <Link to={`/clients/${client.id}`} className="font-black text-slate-900 dark:text-slate-100 text-base tracking-tighter hover:text-indigo-600 transition-colors">{client.name}</Link>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{client.constitution}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300 tracking-tight">{client.pan}</span>
                        {client.gstin && <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">{client.gstin}</span>}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-wrap gap-2">
                        {client.returns.map(r => (
                          <span key={r.id} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 rounded uppercase border border-slate-200 dark:border-slate-700">{r.type}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(client)} className="p-2 text-slate-400 hover:text-indigo-600 transition-all" title="Edit Profile"><Edit2 size={18}/></button>
                        <button onClick={() => setDeleteConfirmId(client.id)} className="p-2 text-slate-400 hover:text-rose-500 transition-all" title="Delete Client"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-32 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-[4rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center no-print">
          <div className="w-40 h-40 mb-10 text-slate-200 dark:text-slate-800 flex items-center justify-center">
             <Users size={120} strokeWidth={0.5} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">No entities registered</h3>
          <p className="text-slate-400 font-medium max-w-xs mt-3 leading-relaxed">Your taxpayer portfolio is currently empty. Start by onboarding your first business client.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Delete Client Record?</h3>
              <p className="text-slate-500 text-sm mt-2 font-medium">This action is permanent and will remove all compliance and billing history associated with this taxpayer.</p>
            </div>
            <div className="flex items-center gap-4 pt-4">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-rose-200 active:scale-95 transition-all">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal - Mobile Bottom Sheet Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300 no-print">
          <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[3rem] w-full max-w-5xl h-[94vh] sm:h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-sheet-up sm:animate-in sm:zoom-in-95 border-t sm:border border-slate-100 dark:border-slate-800">
            {/* Header */}
            <div className="p-8 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between glass-panel">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.25rem] sm:rounded-[1.5rem] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-100">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{formData.id ? 'Modify Profile' : 'Taxpayer Onboarding'}</h3>
                  <p className="text-slate-500 font-bold text-xs sm:text-sm">Complete legal and service configuration</p>
                </div>
              </div>
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-rose-500 transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 sm:p-10 space-y-10 overflow-y-auto flex-1 bg-white dark:bg-slate-950">
              {/* Section 1: Core Legal Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center shadow-inner"><Building2 size={16} /></div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-[0.2em]">Legal Identity</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-8 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name of Business</label>
                    <input type="text" placeholder="As per PAN Card" className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 font-bold text-slate-700 dark:text-white transition-all shadow-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    {errors.name && <p className="text-[9px] font-black text-rose-500 uppercase ml-1">{errors.name}</p>}
                  </div>
                  <div className="md:col-span-4 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Constitution</label>
                    <select className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 font-bold text-slate-700 dark:text-white transition-all cursor-pointer shadow-sm" value={formData.constitution} onChange={(e) => setFormData({...formData, constitution: e.target.value as any})}>
                      <option>Proprietorship</option>
                      <option>Partnership</option>
                      <option>LLP</option>
                      <option>Private Limited</option>
                      <option>Public Limited</option>
                      <option>Trust</option>
                      <option>HUF</option>
                      <option>Individual</option>
                    </select>
                  </div>
                  <div className="md:col-span-12 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><MapPin size={10}/> Principal Address</label>
                    <textarea rows={3} placeholder="Complete building, street, and area details..." className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 font-bold text-slate-700 dark:text-white transition-all resize-none shadow-sm" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Section 2: Statutory Grid */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center shadow-inner"><Fingerprint size={16} /></div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-[0.2em]">Statutory Identifiers</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PAN Card #</label>
                    <input type="text" maxLength={10} placeholder="ABCDE1234F" className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 font-bold text-slate-700 dark:text-white transition-all uppercase shadow-sm" value={formData.pan} onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})} />
                    {errors.pan && <p className="text-[9px] font-black text-rose-500 uppercase ml-1">{errors.pan}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GSTIN</label>
                    <input type="text" maxLength={15} placeholder="27ABCDE1234F1Z1" className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 font-bold text-slate-700 dark:text-white transition-all uppercase shadow-sm" value={formData.gstin} onChange={(e) => setFormData({...formData, gstin: e.target.value.toUpperCase()})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">TAN Number</label>
                    <input type="text" placeholder="ABCP01234G" className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:focus:bg-slate-800 focus:border-indigo-500 font-bold text-slate-700 dark:text-white transition-all uppercase shadow-sm" value={formData.tan} onChange={(e) => setFormData({...formData, tan: e.target.value.toUpperCase()})} />
                  </div>
                </div>
              </div>

              {/* Section 3: Service Enrollment Bento */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center shadow-inner"><Settings2 size={16} /></div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-[0.2em]">Service Enrollment</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <FileCheck2 className="text-indigo-600" size={18} />
                      <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">GST Compliance</h5>
                    </div>
                    
                    <div className="space-y-3">
                      <ServiceToggle label="GSTR-1" active={services.gstr1} onClick={() => setServices({...services, gstr1: !services.gstr1})} />
                      <ServiceToggle label="GSTR-3B" active={services.gstr3b} onClick={() => setServices({...services, gstr3b: !services.gstr3b})} />
                      <ServiceToggle label="GSTR-9" active={services.gstr9} onClick={() => setServices({...services, gstr9: !services.gstr9})} />
                    </div>

                    {(services.gstr1 || services.gstr3b) && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Frequency</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setServices({...services, gstFreq: FilingFrequency.MONTHLY})}
                            className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${services.gstFreq === FilingFrequency.MONTHLY ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 shadow-sm'}`}
                          >Monthly</button>
                          <button 
                            onClick={() => setServices({...services, gstFreq: FilingFrequency.QUARTERLY})}
                            className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${services.gstFreq === FilingFrequency.QUARTERLY ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 shadow-sm'}`}
                          >QRMP</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <CalendarDays className="text-emerald-600" size={18} />
                      <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">ITR Services</h5>
                    </div>
                    
                    <ServiceToggle label="Enrol for ITR" active={services.itr} onClick={() => setServices({...services, itr: !services.itr})} />

                    {services.itr && (
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Form Type</label>
                          <select 
                            className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-sm"
                            value={services.itrType}
                            onChange={(e) => setServices({...services, itrType: e.target.value as ReturnType})}
                          >
                            <option value={ReturnType.ITR_1}>ITR-1 (Sahaj)</option>
                            <option value={ReturnType.ITR_4}>ITR-4 (Sugam)</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 sm:p-10 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-6 no-print">
              <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-all">Discard</button>
              <button onClick={handleSaveClient} className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3">
                <CheckCircle2 size={16} />
                <span>Confirm</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ServiceToggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group shadow-sm ${active ? 'bg-indigo-600 border-indigo-600 text-white shadow-indigo-100' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-indigo-300'}`}
  >
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    <div className={`w-8 h-5 rounded-full relative transition-colors ${active ? 'bg-indigo-400' : 'bg-slate-200 dark:bg-slate-700'}`}>
      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${active ? 'right-0.5' : 'left-0.5'}`}></div>
    </div>
  </button>
);

export default ClientList;