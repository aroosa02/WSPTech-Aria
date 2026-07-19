import React, { useState } from 'react';
import type { Language } from '../lib/translations';

interface FAQArticle {
  id: string;
  question: string;
  answer: string;
  category: 'Billing' | 'API' | 'General';
  citation: string;
  status: 'Synced' | 'Pending';
  usageCount: number;
  lastUpdated: string;
}

interface KnowledgeBasePageProps {
  language: Language;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ language }) => {
  const isUrdu = language === 'ur';
  const pageTitle = isUrdu ? 'معلوماتی مرکز کا انتظام' : 'Knowledge Base Management';
  const pageSub = isUrdu 
    ? 'ان دستاویزات اور ڈیٹا کو ترتیب دیں جن کا آریا جواب دیتے وقت حوالہ دیتا ہے۔' 
    : 'Manage vector embeddings and groundings that Aria cites when responding to support queries.';
  const syncBtnText = isUrdu ? 'ڈیٹا بیس ہم آہنگ کریں' : 'Sync Vector DB';
  const addFaqBtnText = isUrdu ? 'سوال شامل کریں' : 'Add FAQ';
  const searchPlaceholder = isUrdu ? 'سوالات، جوابات یا ذرائع تلاش کریں...' : 'Search questions, answers, or sources...';

  const [faqs, setFaqs] = useState<FAQArticle[]>([
    {
      id: '1',
      question: 'How do I upgrade my subscription plan?',
      answer: 'Go to the billing portal, click "Upgrade to Pro", and complete the checkout via our Stripe integration. The plan syncs within 5 minutes.',
      category: 'Billing',
      citation: 'Billing DB',
      status: 'Synced',
      usageCount: 421,
      lastUpdated: '2 hours ago',
    },
    {
      id: '2',
      question: 'What are the main endpoints in the Aria API?',
      answer: 'The primary endpoints are /v1/chat for message generation, /v1/corpus for syncing documents, and /v1/handoff for managing human support routing.',
      category: 'API',
      citation: 'API Reference',
      status: 'Synced',
      usageCount: 184,
      lastUpdated: '1 day ago',
    },
    {
      id: '3',
      question: 'How does the human agent handoff trigger?',
      answer: 'Handoff triggers when Aria returns a confidence score below the threshold (e.g. 50%) or if the customer explicitly types "agent" or "human".',
      category: 'General',
      citation: 'Handoff Guide',
      status: 'Synced',
      usageCount: 96,
      lastUpdated: '3 days ago',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState<'Billing' | 'API' | 'General'>('General');
  const [formCitation, setFormCitation] = useState('');

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim() || !formCitation.trim()) {
      alert('Please fill out all fields.');
      return;
    }

    const newFAQ: FAQArticle = {
      id: Date.now().toString(),
      question: formQuestion,
      answer: formAnswer,
      category: formCategory,
      citation: formCitation,
      status: 'Pending',
      usageCount: 0,
      lastUpdated: 'Just now',
    };

    setFaqs([newFAQ, ...faqs]);
    
    // Clear Form
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('General');
    setFormCitation('');
    setIsModalOpen(false);

    showToast('FAQ added successfully! Click "Sync DB" to ground Aria with this data.');
  };

  const handleDeleteFAQ = (id: string) => {
    if (confirm('Are you sure you want to delete this knowledge source?')) {
      setFaqs(faqs.filter(faq => faq.id !== id));
      showToast('Knowledge article deleted.');
    }
  };

  const handleSyncDatabase = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setFaqs(prevFaqs =>
        prevFaqs.map(faq => (faq.status === 'Pending' ? { ...faq, status: 'Synced' } : faq))
      );
      setIsSyncing(false);
      showToast('Knowledge Base synchronized with Vector Database successfully!');
    }, 2000);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.citation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 w-full max-w-[900px] mx-auto animate-fade-in relative pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 bg-[#0c233a] border border-secondary text-on-surface px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in">
          <span className="material-symbols-outlined text-secondary">info</span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h2 className="font-headline-lg text-white font-bold tracking-tight">{pageTitle}</h2>
          <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
            {pageSub}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncDatabase}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all focus:outline-none ${
              isSyncing
                ? 'bg-secondary/20 text-secondary border border-secondary/30 cursor-not-allowed'
                : 'bg-secondary text-on-secondary shadow-secondary/15 hover:brightness-110'
            }`}
          >
            <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isSyncing ? (isUrdu ? 'ہم آہنگ ہو رہا ہے...' : 'Syncing...') : syncBtnText}</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] hover:brightness-110 text-white rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all focus:outline-none"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>{addFaqBtnText}</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-md">
            search
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low/60 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2">
          {['All', 'Billing', 'API', 'General'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none ${
                selectedCategory === cat
                  ? 'bg-[#1c2b3c] text-secondary border border-secondary/30 shadow-md font-bold'
                  : 'bg-white/3 text-on-surface-variant hover:bg-white/5 border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 gap-4">
        {filteredFaqs.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl border-white/10 text-center space-y-4">
            <span className="material-symbols-outlined text-on-surface-variant text-5xl">database_off</span>
            <p className="text-on-surface-variant text-sm font-semibold">No knowledge sources found matching your criteria.</p>
          </div>
        ) : (
          filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="glass-card p-6 rounded-2xl border-white/10 hover:border-secondary/20 shadow-md flex flex-col justify-between gap-4 transition-all relative group"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="glass-card px-2.5 py-1 rounded-lg flex items-center gap-1.5 border-secondary/15">
                    <span className="material-symbols-outlined text-[10px] text-secondary">database</span>
                    <span className="text-[10px] text-secondary font-bold font-label-sm">{faq.citation}</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-label-sm font-medium">
                    {faq.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      faq.status === 'Synced'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                    }`}
                  >
                    {faq.status}
                  </span>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-error transition-all focus:outline-none"
                    title="Delete knowledge source"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>

              {/* Question & Answer */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm tracking-tight">{faq.question}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
              </div>

              {/* Footer info */}
              <div className="flex justify-between items-center border-t border-white/5 pt-3 text-[10px] text-outline font-label-sm">
                <span>Used in {faq.usageCount} responses</span>
                <span>Updated {faq.lastUpdated}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Beautiful Modal Overlay for Add FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#07192b] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-fade-in">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-white transition-colors focus:outline-none"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <h3 className="text-md font-bold text-white mb-2">Create FAQ grounding article</h3>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Add custom query pairings to force exact outputs and control grounding source files.
            </p>

            <form onSubmit={handleAddFAQ} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white">Question / Query trigger</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How can I request a refund?"
                  value={formQuestion}
                  onChange={e => setFormQuestion(e.target.value)}
                  className="w-full bg-[#030d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-white">Answer / Grounding response</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Refund requests should be processed in the Billing tab within 14 days of purchase..."
                  value={formAnswer}
                  onChange={e => setFormAnswer(e.target.value)}
                  className="w-full bg-[#030d18] border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as any)}
                    className="w-full bg-[#030d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-secondary transition-all"
                  >
                    <option value="General">General</option>
                    <option value="Billing">Billing</option>
                    <option value="API">API</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-white">Source Citation</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Refund DB"
                    value={formCitation}
                    onChange={e => setFormCitation(e.target.value)}
                    className="w-full bg-[#030d18] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all"
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded-lg text-xs font-semibold text-on-surface hover:bg-white/5 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-secondary text-on-secondary rounded-lg font-bold text-xs hover:brightness-110 active:scale-95 transition-all focus:outline-none"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
