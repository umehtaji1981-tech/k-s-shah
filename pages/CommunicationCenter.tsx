
import React, { useState } from 'react';
import { Client, FirmProfile } from '../types';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  History, 
  CheckCheck,
  Search,
  Users
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CommunicationCenterProps {
  clients: Client[];
  firmProfile: FirmProfile;
}

const CommunicationCenter: React.FC<CommunicationCenterProps> = ({ clients, firmProfile }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [template, setTemplate] = useState('Due Date Reminder');
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWithAI = async () => {
    if (!selectedClient) return;
    setIsGenerating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Write a professional, polite, and urgent ${template} message for an Indian tax client named ${selectedClient.name}. The return due is GSTR-3B for March 2024 by 20th April. Include the firm name ${firmProfile.name}. Keep it short for WhatsApp.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      setMessage(response.text || '');
    } catch (error) {
      console.error("AI Generation Error", error);
      setMessage(`Hi ${selectedClient.name}, this is a reminder regarding your upcoming GSTR-3B filing due on 20th April 2024. Kindly provide the required documents. - ${firmProfile.name}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendWhatsApp = () => {
    if (!selectedClient || !message) return;
    const phone = selectedClient.whatsapp;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Communication Engine</h2>
          <p className="text-slate-500">Send personalized reminders via WhatsApp and Email</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-widest">
          <CheckCheck size={14} />
          <span>Integrated Gateway</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Select Client</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {clients.map(client => (
              <button 
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`w-full p-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors ${selectedClient?.id === client.id ? 'bg-indigo-50' : ''}`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {client.name[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{client.name}</p>
                  <p className="text-xs text-slate-400">+{client.whatsapp}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6 flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Compose Reminder</h3>
                  <p className="text-xs text-slate-500">Messaging: {selectedClient?.name || 'No client selected'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  disabled={!selectedClient || isGenerating}
                  onClick={generateWithAI}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                  <span>{isGenerating ? 'GENIE IS THINKING...' : 'GENERATE WITH AI'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Template</label>
                  <select 
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                  >
                    <option>Due Date Reminder</option>
                    <option>Document Request</option>
                    <option>Filing Confirmation</option>
                    <option>Refund Update</option>
                    <option>DSC Renewal Alert</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Channel</label>
                  <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl">
                    <button className="flex-1 py-1.5 rounded-lg bg-white shadow-sm text-xs font-bold text-emerald-600 flex items-center justify-center gap-2">
                      <MessageSquare size={14} /> WhatsApp
                    </button>
                    <button className="flex-1 py-1.5 rounded-lg text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                      <Send size={14} /> Email
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Message Content</label>
                <textarea 
                  className="flex-1 w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium leading-relaxed"
                  placeholder="Type your message here or use AI to generate..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1"><History size={14} /> Sent 24 total</div>
                <div className="flex items-center gap-1"><Users size={14} /> Reached 12 clients</div>
              </div>
              <button 
                onClick={handleSendWhatsApp}
                disabled={!selectedClient || !message}
                className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                <Send size={20} />
                <span>Blast Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationCenter;
