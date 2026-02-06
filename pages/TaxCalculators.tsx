
import React, { useState, useMemo, useRef } from 'react';
import { 
  Calculator, 
  IndianRupee, 
  Percent, 
  ArrowRight, 
  PieChart, 
  Layers, 
  Zap, 
  Info,
  ChevronDown,
  CheckCircle2,
  Upload,
  FileText,
  Sparkles,
  RefreshCw,
  FileSearch
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const TaxCalculators: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GST' | 'ITR'>('GST');

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Tax Studio</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">Professional Estimation Suite</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[1.5rem] shadow-inner">
          <button 
            onClick={() => setActiveTab('GST')}
            className={`px-8 py-3 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'GST' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            GST Calculator
          </button>
          <button 
            onClick={() => setActiveTab('ITR')}
            className={`px-8 py-3 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ITR' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Income Tax (New Regime)
          </button>
        </div>
      </div>

      {activeTab === 'GST' ? <GSTCalculator /> : <IncomeTaxCalculator />}
    </div>
  );
};

const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(18);
  const [type, setType] = useState<'Intra' | 'Inter'>('Intra');

  const gstValue = useMemo(() => (amount * rate) / 100, [amount, rate]);
  const total = useMemo(() => amount + gstValue, [amount, gstValue]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bento-shadow space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Amount (Taxable)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₹</span>
              <input 
                type="number" 
                className="w-full pl-12 pr-6 py-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-lg text-slate-700 dark:text-white transition-all shadow-sm"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GST Tax Rate</label>
            <div className="grid grid-cols-4 gap-3">
              {[5, 12, 18, 28].map(r => (
                <button 
                  key={r}
                  onClick={() => setRate(r)}
                  className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${rate === r ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700 hover:border-indigo-300'}`}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Supply Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setType('Intra')}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${type === 'Intra' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700'}`}
              >
                Intra-State (Local)
              </button>
              <button 
                onClick={() => setType('Inter')}
                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${type === 'Inter' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-100 dark:border-slate-700'}`}
              >
                Inter-State (IGST)
              </button>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 dark:bg-indigo-900/50 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100 dark:shadow-none flex items-start gap-5">
          <div className="p-3 bg-white/10 rounded-xl">
             <Info size={24} className="text-indigo-200" />
          </div>
          <div className="space-y-2">
            <h5 className="text-[11px] font-black uppercase tracking-widest">Compliance Rule</h5>
            <p className="text-xs font-medium leading-relaxed opacity-80">Under GST Law, Inter-state supply attracts Integrated GST, whereas Intra-state supply attracts Central and State GST equally.</p>
          </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7 space-y-8">
        <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-slate-800 bento-shadow flex flex-col justify-between h-full relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform">
            <Layers size={180} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                <PieChart size={20} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">Calculation Breakdown</h3>
            </div>

            <div className="space-y-6">
              <BreakdownItem label="Taxable Amount" value={amount} />
              {type === 'Intra' ? (
                <>
                  <BreakdownItem label={`CGST (${rate/2}%)`} value={gstValue / 2} color="indigo" />
                  <BreakdownItem label={`SGST (${rate/2}%)`} value={gstValue / 2} color="indigo" />
                </>
              ) : (
                <BreakdownItem label={`IGST (${rate}%)`} value={gstValue} color="indigo" />
              )}
              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-10">
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-slate-400 uppercase tracking-widest">Total Invoice Value</span>
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                    <span className="text-2xl text-slate-300 mr-2">₹</span>
                    {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Verified GST Algorithm</span>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline">
              Copy Breakdown <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const IncomeTaxCalculator: React.FC = () => {
  const [salary, setSalary] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedFile, setLastScannedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const standardDeduction = 75000;
  const grossIncome = useMemo(() => salary + interest + otherIncome, [salary, interest, otherIncome]);
  const taxableIncome = useMemo(() => Math.max(0, grossIncome - standardDeduction), [grossIncome]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = error => reject(error);
    });
  };

  const handleQuickScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setLastScannedFile(file.name);

    try {
      const base64Data = await fileToBase64(file);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: file.type } },
            { text: "This is an Indian tax document (Form 16, AIS, or Bank Statement). Extract the following fields: 'annual_salary', 'interest_income', 'other_income'. If a field is not found, return 0. Return ONLY a JSON object." }
          ]
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              annual_salary: { type: Type.NUMBER },
              interest_income: { type: Type.NUMBER },
              other_income: { type: Type.NUMBER },
            },
            required: ["annual_salary", "interest_income", "other_income"]
          }
        }
      });

      const extracted = JSON.parse(response.text || '{}');
      if (extracted.annual_salary) setSalary(extracted.annual_salary);
      if (extracted.interest_income) setInterest(extracted.interest_income);
      if (extracted.other_income) setOtherIncome(extracted.other_income);
      
      alert(`AI Scan Successful: Found ₹${extracted.annual_salary.toLocaleString()} Salary.`);
    } catch (error) {
      console.error("AI Scan Failed", error);
      alert("AI Quick Scan failed. Please check the document format.");
    } finally {
      setIsScanning(false);
    }
  };

  const calculateTax = (income: number) => {
    let tax = 0;
    if (income <= 300000) return 0;
    if (income > 300000) tax += Math.min(income - 300000, 400000) * 0.05;
    if (income > 700000) tax += Math.min(income - 700000, 300000) * 0.10;
    if (income > 1000000) tax += Math.min(income - 1000000, 200000) * 0.15;
    if (income > 1200000) tax += Math.min(income - 1200000, 300000) * 0.20;
    if (income > 1500000) tax += (income - 1500000) * 0.30;
    if (income <= 700000) return 0;
    return tax;
  };

  const basicTax = useMemo(() => calculateTax(taxableIncome), [taxableIncome]);
  const cess = useMemo(() => basicTax * 0.04, [basicTax]);
  const totalTax = useMemo(() => basicTax + cess, [basicTax, cess]);

  return (
    <div className="space-y-10">
      {/* AI Quick Scan Bento */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bento-shadow flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-110 transition-transform duration-500">
            {isScanning ? <RefreshCw size={28} className="animate-spin" /> : <FileSearch size={28} />}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">AI Quick Scan</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Upload Form 16, AIS, or Bank Statements</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleQuickScan} 
            className="hidden" 
            accept=".pdf,image/*" 
          />
          {lastScannedFile && (
            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-800 animate-in fade-in zoom-in-95">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">{lastScannedFile}</span>
            </div>
          )}
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles size={14} className={isScanning ? 'animate-pulse' : ''} />
            <span>{isScanning ? 'Analyzing Data...' : 'Scan Document'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bento-shadow space-y-6">
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Income Sources</h3>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                <span>Gross Annual Salary</span>
                {salary > 0 && lastScannedFile && <span className="text-emerald-500 flex items-center gap-1 font-black"><CheckCircle2 size={10}/> AI Synced</span>}
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">₹</span>
                <input 
                  type="number" 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 dark:text-white transition-all shadow-sm"
                  value={salary || ''}
                  onChange={(e) => setSalary(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                <span>Interest Income</span>
                {interest > 0 && lastScannedFile && <span className="text-emerald-500 flex items-center gap-1 font-black"><CheckCircle2 size={10}/> AI Synced</span>}
              </label>
              <input 
                type="number" 
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 dark:text-white transition-all shadow-sm"
                value={interest || ''}
                onChange={(e) => setInterest(Number(e.target.value))}
                placeholder="FD, Savings Account, etc."
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center justify-between">
                <span>Other Income</span>
                {otherIncome > 0 && lastScannedFile && <span className="text-emerald-500 flex items-center gap-1 font-black"><CheckCircle2 size={10}/> AI Synced</span>}
              </label>
              <input 
                type="number" 
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-slate-700 dark:text-white transition-all shadow-sm"
                value={otherIncome || ''}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                placeholder="Rental, Consultancy, etc."
              />
            </div>
          </div>

          <div className="bg-amber-500 p-8 rounded-[2rem] text-white shadow-xl shadow-amber-100 dark:shadow-none flex items-start gap-5">
            <div className="p-3 bg-white/10 rounded-xl">
               <Zap size={24} className="text-amber-100" />
            </div>
            <div className="space-y-2">
              <h5 className="text-[11px] font-black uppercase tracking-widest">A.Y. 2025-26 Default</h5>
              <p className="text-xs font-medium leading-relaxed opacity-90">The New Tax Regime is now the default for individuals. Standard Deduction has been increased to ₹75,000.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 border border-slate-100 dark:border-slate-800 bento-shadow flex flex-col h-full">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600">
                  <Calculator size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tighter">Tax Projection</h3>
              </div>
              <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-500 rounded-full">Section 115BAC</span>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Income</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">₹{grossIncome.toLocaleString()}</p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-l-4 border-indigo-500">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Taxable Income</p>
                <p className="text-2xl font-black text-indigo-600 tracking-tighter">₹{taxableIncome.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-4 mb-auto">
              <BreakdownItem label="Standard Deduction" value={standardDeduction} isDeduction />
              <BreakdownItem label="Basic Tax (as per Slabs)" value={basicTax} />
              <BreakdownItem label="Health & Education Cess (4%)" value={cess} />
              
              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-base font-black text-slate-400 uppercase tracking-widest block">Total Estimated Tax</span>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-1">Inclusive of Surcharge & Cess</span>
                  </div>
                  <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                    <span className="text-2xl text-slate-300 mr-2">₹</span>
                    {totalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BreakdownItem: React.FC<{ label: string; value: number; color?: string; isDeduction?: boolean }> = ({ label, value, color = 'slate', isDeduction = false }) => (
  <div className="flex items-center justify-between group">
    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">{label}</span>
    <span className={`text-sm font-black tracking-tighter ${isDeduction ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
      {isDeduction && '- '}₹{value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
    </span>
  </div>
);

export default TaxCalculators;
