import React, { useState } from 'react';
import { translations } from '../lib/translations';
import type { Language } from '../lib/translations';
import { KnowledgeBasePage } from './KnowledgeBasePage';

interface AdminDashboardPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onSwitchToClient: () => void;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  language,
  onLanguageChange,
  onSwitchToClient,
  onLogout,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<string>('conversations');
  const [timeRange, setTimeRange] = useState<'7days' | '30days'>('7days');
  
  const t = translations[language];

  // Mock data for the dashboard matching the screenshot
  const metrics = [
    {
      id: 'resolution',
      title: language === 'en' ? 'Resolution Rate' : 'حل کی شرح',
      value: '84%',
      change: '+2.4%',
      isPositive: true,
      icon: 'check_circle',
      iconColor: 'text-[#5de6ff]',
    },
    {
      id: 'deflection',
      title: language === 'en' ? 'Deflection Rate' : 'انحراف کی شرح',
      value: '62%',
      change: '+5.1%',
      isPositive: true,
      icon: 'security',
      iconColor: 'text-[#adc6ff]',
    },
    {
      id: 'response',
      title: language === 'en' ? 'Avg. Response Time' : 'اوسط جواب کا وقت',
      value: '1.2s',
      change: '-0.3s',
      isPositive: true, // green because lower time is positive
      icon: 'bolt',
      iconColor: 'text-[#5de6ff]',
    },
    {
      id: 'escalations',
      title: language === 'en' ? 'Escalations Today' : 'آج کی منتقلی',
      value: '12',
      change: '+2 today',
      isPositive: false, // red warning
      icon: 'warning',
      iconColor: 'text-[#ffb4ab]',
    },
  ];

  // Bar chart data for Conversations over time
  const chartData = [
    { label: 'MON', value: 750, height: '40%' },
    { label: 'TUE', value: 920, height: '55%' },
    { label: 'WED', value: 1402, height: '85%', hasTooltip: true },
    { label: 'THU', value: 800, height: '45%' },
    { label: 'FRI', value: 850, height: '50%' },
    { label: 'SAT', value: 1300, height: '80%' },
    { label: 'SUN', value: 1100, height: '70%' },
  ];

  const topQuestions = [
    { question: language === 'en' ? 'How do I upgrade?' : 'میں کیسے اپ گریڈ کروں؟', requests: '421 requests' },
    { question: language === 'en' ? 'Reset password' : 'پاس ورڈ دوبارہ ترتیب دیں', requests: '312 requests' },
    { question: language === 'en' ? 'Billing cycles' : 'بلنگ سائیکل', requests: '288 requests' },
  ];

  const ariaStruggles = [
    { topic: language === 'en' ? 'API Integration' : 'اے پی آئی انٹیگریشن', confidence: 42 },
    { topic: language === 'en' ? 'Refund Policy' : 'رقم کی واپسی کی پالیسی', confidence: 38 },
    { topic: language === 'en' ? 'Multi-tenant Setup' : 'ملٹی ٹیننٹ سیٹ اپ', confidence: 45 },
  ];

  const [guardrails, setGuardrails] = useState([
    { name: 'PII Redaction', description: 'Automatically redact Social Security, credit cards, and phone numbers.', status: 'Enabled', icon: 'shield_person' },
    { name: 'Hallucination Shield', description: 'Compare responses directly with source citations to block ungrounded claims.', status: 'Enabled', icon: 'fact_check' },
    { name: 'Toxicity & Bias Filter', description: 'Prevent responses containing profanity, hate speech, or inappropriate tone.', status: 'Enabled', icon: 'gavel' },
    { name: 'Prompt Injection Guard', description: 'Detect and block adversarial user inputs attempting to bypass guidelines.', status: 'Disabled', icon: 'enhanced_encryption' },
  ]);

  const toggleGuardrail = (index: number) => {
    const updated = [...guardrails];
    updated[index].status = updated[index].status === 'Enabled' ? 'Disabled' : 'Enabled';
    setGuardrails(updated);
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen relative flex w-full">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-secondary/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Admin Sidebar Navigation */}
      <aside className="w-64 fixed left-0 top-0 h-screen bg-[#020b15] border-r border-white/10 flex flex-col py-6 z-40">
        <div className="px-6 mb-8 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-secondary to-primary-container flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-on-primary text-xl">blur_on</span>
            </div>
            <div>
              <h1 className="font-headline-lg text-white font-bold leading-none text-lg">Aria AI</h1>
              <span className="text-[10px] text-on-surface-variant font-label-sm">Intelligent Assistant</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-2">
          <button
            onClick={() => setActiveAdminTab('conversations')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeAdminTab === 'conversations'
                ? 'bg-secondary/10 text-secondary font-medium'
                : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md">Conversations</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('knowledge')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeAdminTab === 'knowledge'
                ? 'bg-secondary/10 text-secondary font-medium'
                : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">database</span>
            <span className="font-body-md">Knowledge</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('guardrails')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeAdminTab === 'guardrails'
                ? 'bg-secondary/10 text-secondary font-medium'
                : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">shield</span>
            <span className="font-body-md">Guardrails</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeAdminTab === 'settings'
                ? 'bg-secondary/10 text-secondary font-medium'
                : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Settings</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('support')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
              activeAdminTab === 'support'
                ? 'bg-secondary/10 text-secondary font-medium'
                : 'text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-body-md">Support</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="px-4 mt-auto">
          {/* Switch to Client View Mode Toggle */}
          <button
            onClick={onSwitchToClient}
            className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 hover:from-[#3b82f6]/30 hover:to-[#60a5fa]/30 text-[#60a5fa] border border-[#60a5fa]/30 rounded-xl font-label-sm font-bold active:scale-95 transition-all shadow-md focus:outline-none"
          >
            <span className="material-symbols-outlined text-sm">chat</span>
            <span>Switch to Client Chat</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 py-3 px-4 w-full text-left text-on-surface-variant hover:text-error transition-colors focus:outline-none"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-body-md">{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Panel */}
      <div className="flex-1 min-h-screen ml-64 flex flex-col z-10">
        
        {/* Dashboard Header */}
        <header className="px-8 py-4 bg-background/80 backdrop-blur-md border-b border-white/10 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              alt="Admin Profile"
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Admin Dashboard</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-dot"></span>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold">LIVE</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-on-surface-variant font-label-sm">Last updated 2 mins ago</span>
            
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'ur' : 'en')}
              className="glass-card px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle language"
            >
              <span className="material-symbols-outlined text-sm text-secondary">language</span>
              <span className="font-label-sm text-on-surface-variant uppercase">{language}</span>
            </button>

            <button
              onClick={onSwitchToClient}
              className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-4 py-2 rounded-full font-label-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-150 focus:outline-none hover:brightness-110"
            >
              Switch to Chat
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeAdminTab === 'conversations' && (
            <div className="space-y-6">
              
              {/* Analytics Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m) => (
                  <div key={m.id} className="glass-card p-6 rounded-2xl border-white/10 flex flex-col justify-between shadow-lg relative overflow-hidden">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs text-on-surface-variant font-label-sm tracking-wider uppercase">{m.title}</span>
                      <span className={`material-symbols-outlined ${m.iconColor}`}>{m.icon}</span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white tracking-tight">{m.value}</span>
                        <span className={`text-xs font-semibold ${m.isPositive ? 'text-emerald-400' : 'text-[#ffb4ab]'}`}>
                          {m.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="glass-card p-6 rounded-2xl border-white/10 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-white tracking-tight">Conversations over time</h3>
                  <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                    <button
                      onClick={() => setTimeRange('7days')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none ${
                        timeRange === '7days'
                          ? 'bg-secondary text-on-secondary shadow-md'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      7 Days
                    </button>
                    <button
                      onClick={() => setTimeRange('30days')}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none ${
                        timeRange === '30days'
                          ? 'bg-secondary text-on-secondary shadow-md'
                          : 'text-on-surface-variant hover:text-white'
                      }`}
                    >
                      30 Days
                    </button>
                  </div>
                </div>

                {/* Custom Styled Bar Chart */}
                <div className="relative pt-12 pb-2 px-4 h-64 flex items-end justify-between border-b border-white/10 gap-2">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center relative group h-full justify-end">
                      {/* Tooltip for wednesday */}
                      {data.hasTooltip && (
                        <div className="absolute top-0 bg-[#0c233a] border border-secondary/30 text-secondary px-3 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-1 z-25">
                          <span className="font-bold">1,402</span>
                          <span className="text-[10px] opacity-80 uppercase font-medium">chats</span>
                        </div>
                      )}
                      
                      {/* General Hover Tooltip */}
                      {!data.hasTooltip && (
                        <div className="absolute -top-4 opacity-0 group-hover:opacity-100 bg-[#0c233a] border border-white/10 text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-lg transition-opacity duration-150 z-20 pointer-events-none">
                          {data.value} chats
                        </div>
                      )}

                      {/* Bar Column */}
                      <div
                        style={{ height: data.height }}
                        className={`w-full max-w-[48px] rounded-t-lg bg-gradient-to-t transition-all duration-500 ease-out cursor-pointer hover:brightness-125 ${
                          data.hasTooltip
                            ? 'from-secondary-container/20 to-secondary'
                            : 'from-surface-container-high/40 to-secondary-fixed-dim/60'
                        }`}
                      ></div>
                    </div>
                  ))}
                </div>
                
                {/* Chart Labels */}
                <div className="flex justify-between items-center pt-4 px-4 text-xs text-on-surface-variant font-label-sm">
                  {chartData.map((data, index) => (
                    <span key={index} className="flex-1 text-center font-bold tracking-wider">{data.label}</span>
                  ))}
                </div>
              </div>

              {/* Bottom Grid info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Top customer questions */}
                <div className="glass-card p-6 rounded-2xl border-white/10 shadow-lg flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="material-symbols-outlined text-secondary">forum</span>
                    <h3 className="text-md font-bold text-white tracking-tight">Top customer questions</h3>
                  </div>
                  <div className="space-y-3 flex-1 flex flex-col justify-center">
                    {topQuestions.map((q, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-white/3 rounded-xl border border-white/5 hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-secondary text-sm">format_quote</span>
                          <span className="text-sm font-medium text-white">{q.question}</span>
                        </div>
                        <span className="text-xs text-on-surface-variant font-semibold bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                          {q.requests}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Where Aria struggles */}
                <div className="glass-card p-6 rounded-2xl border-white/10 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-error">psychology_alt</span>
                    <h3 className="text-md font-bold text-white tracking-tight">Where Aria struggles</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    Topics with confidence levels below 50% requiring training or human intervention.
                  </p>
                  <div className="space-y-5">
                    {ariaStruggles.map((struggle, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-white">{struggle.topic}</span>
                          <span className="text-xs font-bold text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-0.5 rounded-full">
                            {struggle.confidence}% Confidence
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-error/60 to-error rounded-full transition-all duration-500 shadow-[0_0_6px_rgba(255,180,171,0.4)]"
                            style={{ width: `${struggle.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeAdminTab === 'knowledge' && (
            <KnowledgeBasePage language={language} />
          )}

          {activeAdminTab === 'guardrails' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white">AI Content Guardrails</h3>
                <p className="text-sm text-on-surface-variant">
                  Configure filtering layers and guidelines that govern Aria's customer-facing output generation.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guardrails.map((g, idx) => (
                  <div key={idx} className="glass-card p-6 rounded-2xl border-white/10 shadow-md flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <span className="material-symbols-outlined text-secondary text-2xl">{g.icon}</span>
                        <div>
                          <h4 className="font-bold text-white text-sm">{g.name}</h4>
                          <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{g.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${g.status === 'Enabled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-on-surface-variant border border-white/5'}`}>
                        {g.status}
                      </span>
                      <button
                        onClick={() => toggleGuardrail(idx)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border active:scale-95 transition-all ${
                          g.status === 'Enabled'
                            ? 'border-error/30 text-error hover:bg-error/10'
                            : 'border-secondary/30 text-secondary hover:bg-secondary/10'
                        }`}
                      >
                        {g.status === 'Enabled' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAdminTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white">System Settings</h3>
                <p className="text-sm text-on-surface-variant">
                  Manage core parameters for the retrieval-augmented LLM pipeline.
                </p>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/10 space-y-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">LLM Provider / Engine</label>
                  <select className="w-full bg-[#030d18] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-secondary transition-all">
                    <option>Gemini 3.5 Flash (Default)</option>
                    <option>Gemini 3.5 Pro</option>
                    <option>Aria Fine-tuned Custom (v1.0)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="block text-sm font-semibold text-white">RAG Confidence Threshold</label>
                    <span className="text-xs font-bold text-secondary">0.85 (High)</span>
                  </div>
                  <input type="range" min="0" max="1" step="0.05" defaultValue="0.85" className="w-full accent-secondary" />
                  <p className="text-[10px] text-on-surface-variant">
                    Sets the confidence cutoff. Responses below this threshold automatically trigger support escalation.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">System Instruction Prompt</label>
                  <textarea
                    rows={4}
                    className="w-full bg-[#030d18] border border-white/10 rounded-xl p-4 text-xs text-on-surface placeholder:text-outline outline-none focus:border-secondary transition-all resize-none leading-relaxed"
                    defaultValue="You are WSP Aria, a friendly and helpful RAG customer assistant. You must always answer questions concisely, citing source files provided in your context. If you are not certain, decline to answer and offer human support."
                  />
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-end">
                  <button className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all">
                    Save Parameters
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeAdminTab === 'support' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold text-white">Support & Diagnostics</h3>
                <p className="text-sm text-on-surface-variant">
                  Access service logs, view pipeline health metrics, and contact WSP support.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-2xl border-white/10 flex flex-col justify-between gap-3 text-center">
                  <span className="material-symbols-outlined text-emerald-400 text-3xl">dns</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">RAG Engine Staging</h4>
                    <p className="text-[11px] text-emerald-400 mt-0.5">Healthy (99.98% uptime)</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border-white/10 flex flex-col justify-between gap-3 text-center">
                  <span className="material-symbols-outlined text-secondary text-3xl">database</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">Indexed Corpus</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">56 synced sources (10.4MB)</p>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-2xl border-white/10 flex flex-col justify-between gap-3 text-center">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-3xl">api</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">API Latency</h4>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Avg: 310ms (Stripe + Gemini)</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border-white/10 max-w-xl space-y-4">
                <h4 className="font-bold text-white text-sm">Developer Support Ticket</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  File an escalation request directly to WSP engineering to resolve API failures or integration issues.
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Brief description of the issue"
                    className="w-full bg-[#030d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all"
                  />
                  <textarea
                    rows={3}
                    placeholder="Details including relevant API endpoints or logs..."
                    className="w-full bg-[#030d18] border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all resize-none"
                  />
                  <button className="w-full bg-secondary text-on-secondary py-2 rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all">
                    Submit Diagnostic Ticket
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
