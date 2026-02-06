
import React, { useState } from 'react';
import { FirmProfile } from '../types';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  CreditCard,
  CheckCircle,
  Camera,
  Globe,
  UserCheck,
  Landmark,
  Save,
  Upload,
  Info
} from 'lucide-react';

interface SettingsPageProps {
  firmProfile: FirmProfile;
  setFirmProfile: React.Dispatch<React.SetStateAction<FirmProfile>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ firmProfile, setFirmProfile }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFirmProfile(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FirmProfile] as any),
          [child]: value
        }
      }));
    } else {
      setFirmProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFirmProfile(prev => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Firm Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Firm Configuration</h2>
          <p className="text-slate-500 mt-1">Manage your practice details, branding, and billing presets.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all font-bold active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={20} />}
          <span>{isSaving ? 'Updating...' : 'Save Firm Profile'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Brand & Logo */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 text-center flex flex-col items-center">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 w-full text-left">Firm Branding</h4>
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-indigo-300 transition-all">
                {firmProfile.logoUrl ? (
                  <img src={firmProfile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 size={48} className="text-indigo-200" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-xl border border-slate-100 text-indigo-600 hover:bg-indigo-600 hover:text-white cursor-pointer transition-all scale-90 hover:scale-100">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
              </label>
            </div>
            <h3 className="text-xl font-bold text-slate-800 leading-tight">{firmProfile.name}</h3>
            <p className="text-sm text-slate-400 mt-1">{firmProfile.authorizedSignatory}</p>
            
            <div className="w-full mt-8 pt-6 border-t border-slate-50 space-y-4">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-slate-400">Invoice Readiness</span>
                <span className="text-emerald-500 flex items-center gap-1"><CheckCircle size={12}/> Verified</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[95%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-800 rounded-2xl">
                <Info size={24} className="text-indigo-300" />
              </div>
              <div>
                <h5 className="font-bold text-indigo-50">Invoice Tip</h5>
                <p className="text-xs text-indigo-200 mt-1 leading-relaxed">The details provided here will automatically reflect on all professional invoices generated for your clients.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section: General Info */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <Building2 size={16} className="text-indigo-500" /> General Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Brand Name</label>
                  <input 
                    type="text" name="name" value={firmProfile.name} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Authorized Signatory (CA/Admin)</label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" name="authorizedSignatory" value={firmProfile.authorizedSignatory} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Legal Name of the Firm</label>
                <input 
                  type="text" name="legalName" value={firmProfile.legalName} onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section: Contact & Online */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <Mail size={16} className="text-indigo-500" /> Reachability
              </h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Practice Email</label>
                <input 
                  type="email" name="email" value={firmProfile.email} onChange={handleChange}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Phone / Support</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" name="phone" value={firmProfile.phone} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Firm Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" name="website" value={firmProfile.website} onChange={handleChange}
                    placeholder="https://"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Tax & Legal */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <CreditCard size={16} className="text-indigo-500" /> Tax & Identification
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Firm GSTIN</label>
                  <input 
                    type="text" name="gstin" value={firmProfile.gstin} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-mono uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Firm PAN</label>
                  <input 
                    type="text" name="pan" value={firmProfile.pan} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-mono uppercase"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-600">Office Address Line</label>
                  <textarea 
                    name="address" value={firmProfile.address} onChange={handleChange} rows={2}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium resize-none"
                  ></textarea>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">City / Town</label>
                  <input 
                    type="text" name="city" value={firmProfile.city} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">State</label>
                    <input 
                      type="text" name="state" value={firmProfile.state} onChange={handleChange}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Pincode</label>
                    <input 
                      type="text" name="pincode" value={firmProfile.pincode} onChange={handleChange}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Bank Details */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                <Landmark size={16} className="text-indigo-500" /> Banking Information
              </h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Bank Name</label>
                  <input 
                    type="text" name="bankDetails.bankName" value={firmProfile.bankDetails.bankName} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Account Number</label>
                  <input 
                    type="text" name="bankDetails.accountNumber" value={firmProfile.bankDetails.accountNumber} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">IFSC Code</label>
                  <input 
                    type="text" name="bankDetails.ifscCode" value={firmProfile.bankDetails.ifscCode} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-mono uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Branch Name</label>
                  <input 
                    type="text" name="bankDetails.branchName" value={firmProfile.bankDetails.branchName} onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
