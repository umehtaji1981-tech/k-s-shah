
import React, { useState, useEffect, useRef } from 'react';
import { Client, Invoice, FirmProfile } from '../types';
import { 
  FilePlus, 
  Printer, 
  Download, 
  Search,
  Eye,
  X,
  FileQuestion,
  Stamp,
  Plus,
  Trash2,
  CheckCircle2,
  FileDown,
  Hash,
  Settings2,
  Zap
} from 'lucide-react';
// @ts-ignore
import html2pdf from 'https://esm.sh/html2pdf.js';

interface InvoiceManagerProps {
  clients: Client[];
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  firmProfile: FirmProfile;
}

const InvoiceManager: React.FC<InvoiceManagerProps> = ({ clients, invoices, setInvoices, firmProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPreview, setShowPreview] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [printTarget, setPrintTarget] = useState<Invoice | null>(null);
  const [pdfTarget, setPdfTarget] = useState<Invoice | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // New Invoice Form State
  const [idMode, setIdMode] = useState<'Auto' | 'Manual'>('Auto');
  const [manualId, setManualId] = useState('');
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ description: '', amount: 0 }],
    status: 'Unpaid'
  });

  // Helper to generate the next automatic ID
  const generateNextId = () => {
    const year = new Date().getFullYear();
    const shortYear = year.toString().slice(-2);
    const nextYear = (year + 1).toString().slice(-2);
    const sequence = (invoices.length + 1).toString().padStart(3, '0');
    return `INV/${shortYear}-${nextYear}/${sequence}`;
  };

  // Handle actual printing logic when printTarget is set
  useEffect(() => {
    if (printTarget) {
      const timer = setTimeout(() => {
        window.print();
        setPrintTarget(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [printTarget]);

  const handlePrint = (inv: Invoice) => {
    setPrintTarget(inv);
  };

  const handleDownloadPDF = async (inv: Invoice) => {
    setPdfTarget(inv);
    setIsDownloading(true);
    
    setTimeout(async () => {
      const element = document.getElementById('pdf-export-container');
      
      if (!element) {
        console.error("PDF Export container not found");
        setIsDownloading(false);
        setPdfTarget(null);
        return;
      }

      const client = clients.find(c => c.id === inv.clientId);
      const filename = `${inv.id.replace(/\//g, '_')}_${client?.name || 'Invoice'}.pdf`;

      const opt = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true,
          logging: false
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      try {
        await html2pdf().set(opt).from(element).save();
      } catch (error) {
        console.error("PDF Generation failed", error);
        alert("PDF Generation failed. Try the 'Print' option and choose 'Save as PDF'.");
      } finally {
        setIsDownloading(false);
        setPdfTarget(null);
      }
    }, 300);
  };

  const handleAddItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...(prev.items || []), { description: '', amount: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: 'description' | 'amount', value: string | number) => {
    const updatedItems = [...(newInvoice.items || [])];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const handleSaveInvoice = () => {
    if (!newInvoice.clientId || !newInvoice.items || newInvoice.items.length === 0) {
      alert("Please select a client and add at least one service item.");
      return;
    }

    if (idMode === 'Manual' && !manualId) {
      alert("Please provide a manual Invoice ID.");
      return;
    }

    const subTotal = newInvoice.items.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
    const tax = Math.round(subTotal * 0.18); 

    const finalInvoice: Invoice = {
      id: idMode === 'Auto' ? generateNextId() : manualId,
      clientId: newInvoice.clientId,
      date: newInvoice.date || new Date().toISOString().split('T')[0],
      items: newInvoice.items as { description: string; amount: number }[],
      taxAmount: tax,
      totalAmount: subTotal + tax,
      status: newInvoice.status as 'Paid' | 'Unpaid'
    };

    setInvoices(prev => [finalInvoice, ...prev]);
    setIsCreateModalOpen(false);
    // Reset
    setManualId('');
    setIdMode('Auto');
    setNewInvoice({
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      items: [{ description: '', amount: 0 }],
      status: 'Unpaid'
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    const client = clients.find(c => c.id === inv.clientId);
    return inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           (client && client.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 no-print">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">Billing Desk</h2>
          <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mt-1">Professional Receivables</p>
        </div>
        <button 
          onClick={() => {
            setShowPreview(null);
            setIsCreateModalOpen(true);
          }}
          className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] hover:bg-indigo-700 shadow-2xl shadow-indigo-600/20 transition-all font-black text-xs uppercase tracking-widest active:scale-95"
        >
          <Plus size={18} />
          <span>New Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 no-print">
        <div className="md:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center bento-shadow">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Unpaid Dues</p>
          <div className="flex items-baseline">
            <span className="rupee-symbol">₹</span>
            <h4 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter">
              {invoices.filter(i => i.status === 'Unpaid').reduce((a, b) => a + b.totalAmount, 0).toLocaleString()}
            </h4>
          </div>
        </div>
        <div className="md:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6 bento-shadow">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by invoice ID or client name..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-indigo-500/5 font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 bento-shadow overflow-hidden no-print">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reference</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Taxpayer</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Value</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 font-bold text-sm">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group cursor-pointer" onClick={() => setShowPreview(inv)}>
                  <td className="px-10 py-6 font-black tracking-tighter">{inv.id}</td>
                  <td className="px-10 py-6 text-slate-600 dark:text-slate-400 tracking-tight">{clients.find(c => c.id === inv.clientId)?.name}</td>
                  <td className="px-10 py-6 text-right">
                    <span className="rupee-symbol">₹</span>
                    <span className="font-black tracking-tighter">{inv.totalAmount.toLocaleString()}</span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase border ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setShowPreview(inv); }} className="p-2 text-slate-400 hover:text-indigo-600" title="Preview"><Eye size={18}/></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDownloadPDF(inv); }} className="p-2 text-slate-400 hover:text-blue-600" title="Download PDF"><Download size={18}/></button>
                      <button onClick={(e) => { e.stopPropagation(); handlePrint(inv); }} className="p-2 text-slate-400 hover:text-emerald-600" title="Print"><Printer size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 no-print">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
            <FileQuestion size={40} />
          </div>
          <h4 className="text-xl font-black tracking-tighter uppercase tracking-[0.2em] opacity-40">No Invoices Issued</h4>
          <p className="text-slate-400 text-xs mt-1 font-bold">Start billing for professional services.</p>
        </div>
      )}

      {/* New Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300 no-print">
          <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2rem] w-full max-w-2xl h-[94vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-sheet-up sm:animate-in sm:zoom-in-95 border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between glass-panel">
              <h3 className="text-xl font-black tracking-tighter uppercase tracking-[0.2em] text-slate-800 dark:text-white">Generate Service Bill</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 border border-slate-100 dark:border-slate-700 shadow-sm transition-all"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-white dark:bg-slate-950">
              
              {/* ID Control Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Identifier</label>
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button 
                      onClick={() => setIdMode('Auto')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${idMode === 'Auto' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <Zap size={12} /> Auto
                    </button>
                    <button 
                      onClick={() => setIdMode('Manual')}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${idMode === 'Manual' ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      <Settings2 size={12} /> Manual
                    </button>
                  </div>
                </div>
                
                <div className="relative group">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  {idMode === 'Auto' ? (
                    <div className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl font-black text-sm text-slate-400 tracking-tighter">
                      {generateNextId()} <span className="ml-2 text-[9px] font-black bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded uppercase tracking-widest">Reserved</span>
                    </div>
                  ) : (
                    <input 
                      type="text"
                      placeholder="Enter custom ID (e.g. TAX/24/001)"
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-black text-sm text-slate-700 dark:text-white transition-all shadow-sm"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value.toUpperCase())}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Client</label>
                  <select 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm cursor-pointer shadow-sm"
                    value={newInvoice.clientId}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, clientId: e.target.value }))}
                  >
                    <option value="">Choose a taxpayer...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invoice Date</label>
                  <input 
                    type="date"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm shadow-sm"
                    value={newInvoice.date}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Particulars</label>
                  <button onClick={handleAddItem} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:underline transition-all">
                    <Plus size={14} /> Add Line
                  </button>
                </div>
                
                <div className="space-y-3">
                  {newInvoice.items?.map((item, index) => (
                    <div key={index} className="flex gap-3 animate-in slide-in-from-top-2">
                      <div className="flex-1">
                        <input 
                          type="text"
                          placeholder="Professional Fee for..."
                          className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-medium text-sm shadow-sm"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        />
                      </div>
                      <div className="w-32 relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 rupee-symbol">₹</span>
                        <input 
                          type="number"
                          placeholder="0"
                          className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none font-bold text-sm text-right shadow-sm"
                          value={item.amount || ''}
                          onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        />
                      </div>
                      {newInvoice.items!.length > 1 && (
                        <button onClick={() => handleRemoveItem(index)} className="p-4 text-slate-300 hover:text-rose-500 transition-all">
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payment Status</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setNewInvoice(prev => ({ ...prev, status: 'Unpaid' }))}
                    className={`p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${newInvoice.status === 'Unpaid' ? 'bg-amber-600 text-white border-amber-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 shadow-sm'}`}
                  >Unpaid</button>
                  <button 
                    onClick={() => setNewInvoice(prev => ({ ...prev, status: 'Paid' }))}
                    className={`p-4 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all ${newInvoice.status === 'Paid' ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700 shadow-sm'}`}
                  >Paid</button>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-4 bg-white dark:bg-slate-900 glass-panel">
              <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Cancel</button>
              <button onClick={handleSaveInvoice} className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black shadow-2xl shadow-indigo-600/20 uppercase tracking-widest active:scale-95 transition-all">
                <CheckCircle2 size={18} />
                <span>Issue & Save</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal - Preview Overlay */}
      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300 no-print">
          <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] sm:rounded-[2rem] w-full max-w-4xl h-[94vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-sheet-up sm:animate-in sm:zoom-in-95 border border-slate-100 dark:border-slate-800">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between glass-panel no-print">
              <h3 className="text-lg font-black tracking-tighter uppercase tracking-[0.2em] text-slate-500">Preview Mode</h3>
              <button onClick={() => setShowPreview(null)} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-rose-500 border border-slate-100 dark:border-slate-700 shadow-sm transition-all"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-12 bg-slate-50/50 no-print">
               <InvoicePrintTemplate invoice={showPreview} firmProfile={firmProfile} clients={clients} />
            </div>
            
            <div className="p-8 border-t border-slate-100 flex flex-wrap items-center justify-end gap-4 bg-white dark:bg-slate-900 glass-panel no-print">
              <button 
                onClick={() => handleDownloadPDF(showPreview)} 
                disabled={isDownloading}
                className="flex items-center gap-3 px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-[1.5rem] text-[10px] font-black shadow-sm uppercase tracking-widest active:scale-95 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
              >
                {isDownloading ? <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div> : <FileDown size={18} />}
                <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
              </button>
              <button onClick={() => handlePrint(showPreview)} className="flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] text-[10px] font-black shadow-2xl uppercase tracking-widest active:scale-95 transition-all">
                <Printer size={18} />
                <span>Issue & Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actual Hidden Area targeted for Printing only */}
      {(printTarget || showPreview) && (
        <div className="hidden print:block">
           <InvoicePrintTemplate 
             invoice={printTarget || showPreview!} 
             firmProfile={firmProfile} 
             clients={clients} 
             isPrintTarget 
           />
        </div>
      )}

      {/* OFF-SCREEN RENDERER FOR PDF DOWNLOADS */}
      {pdfTarget && (
        <div className="fixed -left-[2000mm] top-0 pointer-events-none no-print" aria-hidden="true">
           <div style={{ width: '210mm' }}>
              <InvoicePrintTemplate 
                invoice={pdfTarget} 
                firmProfile={firmProfile} 
                clients={clients} 
                id="pdf-export-container" 
              />
           </div>
        </div>
      )}
    </div>
  );
};

// Updated Print Template to include Logo
const InvoicePrintTemplate: React.FC<{ invoice: Invoice, firmProfile: FirmProfile, clients: Client[], isPrintTarget?: boolean, id?: string }> = ({ invoice, firmProfile, clients, isPrintTarget, id }) => (
  <div 
    id={isPrintTarget ? "print-area" : id}
    className={`bg-white p-10 sm:p-16 w-full max-w-[210mm] mx-auto relative min-h-[1050px] invoice-watermark ${isPrintTarget ? 'print:shadow-none print:border-none print:p-8 print:w-full print:m-0' : 'shadow-2xl'}`}
  >
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] rotate-[-45deg] select-none text-[180px] font-black text-indigo-900 whitespace-nowrap print:opacity-[0.01]">TAX INVOICE</div>

    <div className="flex justify-between items-start mb-20 relative z-10">
      <div className="space-y-6">
        {/* Priority: Display Logo if available */}
        {firmProfile.logoUrl ? (
          <img src={firmProfile.logoUrl} alt="Logo" className="w-20 h-20 rounded-[2rem] object-cover shadow-xl print:shadow-none" />
        ) : (
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black shadow-xl print:shadow-none">
            {firmProfile.name[0]}
          </div>
        )}
        <div>
          <h4 className="text-2xl font-black text-slate-900 leading-none tracking-tighter uppercase">{firmProfile.name}</h4>
          <p className="text-[11px] text-slate-500 max-w-xs mt-3 leading-relaxed font-medium">{firmProfile.address}, {firmProfile.city}, {firmProfile.state} - {firmProfile.pincode}</p>
          <div className="mt-4 flex flex-col gap-1">
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">GSTIN: {firmProfile.gstin}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">PAN: {firmProfile.pan}</p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <h1 className="font-serif-premium italic text-6xl text-slate-100 mb-8 select-none leading-none print:text-slate-200">Invoice</h1>
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">No.</p>
          <p className="text-xl font-black text-slate-900 tracking-tighter">{invoice.id}</p>
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Dated</p>
          <p className="text-sm font-bold text-slate-700 tracking-tight">{invoice.date}</p>
        </div>
      </div>
    </div>

    <div className="mb-12 relative z-10">
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Bill To</p>
       <h5 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{clients.find(c => c.id === invoice.clientId)?.name}</h5>
       <p className="text-xs font-medium text-slate-500 mt-1 max-w-sm">{clients.find(c => c.id === invoice.clientId)?.address}</p>
       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-3">GSTIN: {clients.find(c => c.id === invoice.clientId)?.gstin || 'N/A'}</p>
    </div>

    <table className="w-full mb-16 border-collapse relative z-10">
      <thead className="border-y-[0.5px] border-slate-900">
        <tr className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400">
          <th className="px-2 py-4 text-left font-black">Description of Service</th>
          <th className="px-2 py-4 text-right font-black">HSN/SAC</th>
          <th className="px-2 py-4 text-right font-black w-32">Amount</th>
        </tr>
      </thead>
      <tbody className="divide-y-[0.5px] divide-slate-100">
        {invoice.items.map((item, i) => (
          <tr key={i} className="text-sm font-bold">
            <td className="px-2 py-8 text-slate-900 font-black tracking-tight">{item.description}</td>
            <td className="px-2 py-8 text-right text-slate-400 font-medium">998222</td>
            <td className="px-2 py-8 text-right font-black text-slate-900">
              <span className="rupee-symbol">₹</span>
              <span className="tracking-tighter">{item.amount.toLocaleString()}</span>
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className="border-t-[0.5px] border-slate-900">
        <tr className="border-b-[0.5px] border-slate-100">
          <td colSpan={2} className="px-2 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">GST (18%)</td>
          <td className="px-2 py-4 text-right text-sm font-black text-slate-900">
            <span className="rupee-symbol">₹</span>
            <span className="tracking-tighter">{invoice.taxAmount.toLocaleString()}</span>
          </td>
        </tr>
        <tr>
          <td colSpan={2} className="px-2 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Grand Total</td>
          <td className="px-2 py-6 text-right text-xl font-black text-slate-900">
            <span className="rupee-symbol">₹</span>
            <span className="tracking-tighter">{invoice.totalAmount.toLocaleString()}</span>
          </td>
        </tr>
      </tfoot>
    </table>

    <div className="grid grid-cols-12 gap-12 mt-auto relative z-10">
       <div className="col-span-7 space-y-4">
          <div className="p-6 border-px-05 border-slate-100 rounded-3xl bg-slate-50/50 print:bg-white print:border-slate-200">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Bank Settlement Details</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Bank</p>
                  <p className="text-xs font-black text-slate-800 truncate tracking-tight">{firmProfile.bankDetails.bankName}</p>
               </div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">A/c No</p>
                  <p className="text-xs font-black text-slate-800 truncate tracking-tight">{firmProfile.bankDetails.accountNumber}</p>
               </div>
               <div className="col-span-2 mt-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">IFSC</p>
                  <p className="text-xs font-black text-slate-800 tracking-tight uppercase">{firmProfile.bankDetails.ifscCode}</p>
               </div>
            </div>
          </div>
          <p className="text-[9px] font-medium text-slate-400 leading-relaxed italic">* This is a computer generated invoice issued as per the provisions of GST Law in India.</p>
       </div>
       
       <div className="col-span-5 flex flex-col items-end justify-end">
          <div className="relative mb-4">
             <div className="absolute -top-12 -left-16 opacity-30 rotate-[-15deg] pointer-events-none print:opacity-20">
                <div className="w-24 h-24 border-4 border-indigo-600 rounded-full flex flex-col items-center justify-center text-indigo-600 font-black p-2 text-center scale-90">
                   <Stamp size={24} className="mb-1" />
                   <span className="text-[8px] uppercase leading-none">Verified<br/>Signatory</span>
                </div>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Authorized Signatory</p>
             <p className="font-black text-slate-900 text-sm tracking-tight border-t-[0.5px] border-slate-200 pt-3 text-right">For {firmProfile.name}</p>
             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 text-right">{firmProfile.authorizedSignatory}</p>
          </div>
       </div>
    </div>
  </div>
);

export default InvoiceManager;
