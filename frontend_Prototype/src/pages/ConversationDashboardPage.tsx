import React, { useState, useRef, useEffect } from 'react';
import type { Language } from '../lib/translations';

interface Message {
  id: string;
  sender: 'user' | 'aria' | 'agent';
  text: string;
  time: string;
  citation?: string;
  confidence?: {
    level: 'high' | 'low';
    score: number;
  };
}

interface Conversation {
  id: string;
  customerName: string;
  status: 'Active' | 'Escalated' | 'Resolved';
  lastActive: string;
  language: 'en' | 'ur';
  assignee: 'Aria (AI)' | 'Sarah (Agent)' | 'Unassigned';
  messages: Message[];
}

interface ConversationDashboardPageProps {
  language: Language;
}

export const ConversationDashboardPage: React.FC<ConversationDashboardPageProps> = ({
  language,
}) => {
  // Rich initial dummy data for customer conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_1',
      customerName: 'Zainab Malik',
      status: 'Escalated',
      lastActive: '3 mins ago',
      language: 'en',
      assignee: 'Unassigned',
      messages: [
        {
          id: '1_1',
          sender: 'user',
          text: "I'm having some trouble with my subscription plan. It says I'm on the Basic tier but I recently upgraded to the Pro Annual plan.",
          time: '10:42 AM',
        },
        {
          id: '1_2',
          sender: 'aria',
          text: "I've checked our records, and I can see your payment for the Pro Annual plan was processed successfully. However, there seems to be a synchronization delay between the payment gateway and your account status.",
          time: '10:43 AM',
          citation: 'Billing DB',
          confidence: { level: 'high', score: 88 },
        },
        {
          id: '1_3',
          sender: 'user',
          text: "Okay - can you fix the sync from your end, or do I need to do something?",
          time: '10:43 AM',
        },
        {
          id: '1_4',
          sender: 'aria',
          text: "This particular sync issue needs manual account-permission access that I don't have. I don't want to guess here, so I'm bringing in a specialist who can fix it directly and safely.",
          time: '10:44 AM',
          confidence: { level: 'low', score: 28 },
        },
        {
          id: '1_5',
          sender: 'user',
          text: "Please help, I need this resolved for my presentation today!",
          time: '10:45 AM',
        },
      ],
    },
    {
      id: 'conv_2',
      customerName: 'Muhammad Ali',
      status: 'Active',
      lastActive: '15 mins ago',
      language: 'ur',
      assignee: 'Aria (AI)',
      messages: [
        {
          id: '2_1',
          sender: 'user',
          text: "بلنگ سائیکل کب شروع ہوتا ہے؟",
          time: '09:12 AM',
        },
        {
          id: '2_2',
          sender: 'aria',
          text: "آپ کا بلنگ سائیکل ہر ماہ کی اس تاریخ کو شروع ہوتا ہے جس تاریخ کو آپ نے پہلی بار سبسکرپشن خریدی تھی۔",
          time: '09:13 AM',
          citation: 'Stripe Hub',
          confidence: { level: 'high', score: 95 },
        },
        {
          id: '2_3',
          sender: 'user',
          text: "شکریہ، سمجھ گیا۔",
          time: '09:15 AM',
        },
      ],
    },
    {
      id: 'conv_3',
      customerName: 'John Doe',
      status: 'Resolved',
      lastActive: '2 hours ago',
      language: 'en',
      assignee: 'Sarah (Agent)',
      messages: [
        {
          id: '3_1',
          sender: 'user',
          text: "Where can I find the API key for my integrations?",
          time: '08:00 AM',
        },
        {
          id: '3_2',
          sender: 'aria',
          text: "You can retrieve your API keys in the Settings panel under the API Keys tab.",
          time: '08:01 AM',
          citation: 'Developer Docs',
          confidence: { level: 'high', score: 92 },
        },
        {
          id: '3_3',
          sender: 'user',
          text: "API integration is working perfectly now, thank you!",
          time: '08:05 AM',
        },
        {
          id: '3_4',
          sender: 'agent',
          text: "Glad to hear that, John! I'll mark this conversation as resolved now. Let us know if you need anything else.",
          time: '08:06 AM',
        },
      ],
    },
    {
      id: 'conv_4',
      customerName: 'Ayesha Khan',
      status: 'Escalated',
      lastActive: '1 hour ago',
      language: 'en',
      assignee: 'Unassigned',
      messages: [
        {
          id: '4_1',
          sender: 'user',
          text: "Hi, I need to cancel my subscription.",
          time: '11:10 AM',
        },
        {
          id: '4_2',
          sender: 'aria',
          text: "You can cancel your subscription at any time in your Settings page.",
          time: '11:11 AM',
          citation: 'Billing FAQ',
          confidence: { level: 'high', score: 90 },
        },
        {
          id: '4_3',
          sender: 'user',
          text: "Can I get a refund for the remaining 3 months of my plan?",
          time: '11:12 AM',
        },
        {
          id: '4_4',
          sender: 'aria',
          text: "I'm not authorized to process refunds directly. Let me connect you with a billing support agent.",
          time: '11:13 AM',
          confidence: { level: 'low', score: 35 },
        },
      ],
    },
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('conv_1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Escalated' | 'Resolved'>('All');
  const [replyText, setReplyText] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Auto scroll chat detail view when active conversation or messages change
  useEffect(() => {
    if (messagesEndRef.current?.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConvId, conversations]);

  // Format current system time to display nicely
  const getFormattedTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'AM' : 'PM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Handle agent sending a simulated reply
  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeConvId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'agent',
      text: replyText.trim(),
      time: getFormattedTime(),
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeConvId) {
          // If the conversation is currently Escalated and agent responds, we assign it to Sarah and set status to Active
          const updatedAssignee = c.assignee === 'Unassigned' || c.assignee === 'Aria (AI)' ? 'Sarah (Agent)' : c.assignee;
          const updatedStatus = c.status === 'Escalated' ? 'Active' : c.status;
          return {
            ...c,
            assignee: updatedAssignee,
            status: updatedStatus,
            lastActive: 'Just now',
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    setReplyText('');
  };

  // Change status of conversation explicitly
  const handleStatusChange = (convId: string, status: 'Active' | 'Escalated' | 'Resolved') => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, status, lastActive: 'Just now' } : c))
    );
  };

  // Change assignee of conversation explicitly
  const handleAssigneeChange = (convId: string, assignee: 'Aria (AI)' | 'Sarah (Agent)' | 'Unassigned') => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, assignee, lastActive: 'Just now' } : c))
    );
  };

  // Take over action for escalated items
  const handleTakeOver = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              assignee: 'Sarah (Agent)',
              status: 'Active',
              lastActive: 'Just now',
            }
          : c
      )
    );
  };

  // Filter conversations based on search text and category filter pill
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.messages.some((m) => m.text.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 w-full animate-fade-in">
      
      {/* LEFT PANE: Conversation Directory List */}
      <div className="w-full lg:w-96 flex flex-col gap-4 h-full">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {language === 'en' ? 'Customer Conversations' : 'صارفین کی گفتگو'}
          </h2>
          
          {/* Search bar */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-outline-variant text-md">search</span>
            <input
              type="text"
              placeholder={language === 'en' ? 'Search conversations...' : 'گفتگو تلاش کریں...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#030d18] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-outline hover:text-white"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
          
          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['All', 'Active', 'Escalated', 'Resolved'] as const).map((filter) => {
              const count = conversations.filter((c) => filter === 'All' || c.status === filter).length;
              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border shrink-0 ${
                    statusFilter === filter
                      ? 'bg-secondary border-secondary text-on-secondary shadow-md'
                      : 'bg-white/3 border-white/5 text-on-surface-variant hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter === 'All' && (language === 'en' ? 'All' : 'سب')}
                  {filter === 'Active' && (language === 'en' ? 'Active' : 'فعال')}
                  {filter === 'Escalated' && (language === 'en' ? 'Escalated' : 'منتقل شدہ')}
                  {filter === 'Resolved' && (language === 'en' ? 'Resolved' : 'حل شدہ')}
                  <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] ${statusFilter === filter ? 'bg-on-secondary/15 text-on-secondary' : 'bg-white/5 text-on-surface-variant'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory List Container */}
        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3 min-h-[200px] lg:min-h-0">
          {filteredConversations.length === 0 ? (
            <div className="glass-card rounded-2xl border-white/5 p-8 text-center flex flex-col items-center justify-center gap-2 h-48">
              <span className="material-symbols-outlined text-outline-variant text-3xl">chat_bubble_outline</span>
              <p className="text-xs text-on-surface-variant">
                {language === 'en' ? 'No conversations found' : 'کوئی گفتگو نہیں ملی'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isEscalated = conv.status === 'Escalated';
              const isActive = conv.id === activeConvId;

              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`glass-card p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 relative hover:bg-white/5 ${
                    isActive 
                      ? 'border-secondary/50 bg-secondary/5' 
                      : isEscalated
                      ? 'border-[#ffb4ab]/30 bg-[#ffb4ab]/2'
                      : 'border-white/5'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex justify-between items-start w-full">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-surface-bright to-surface-container-high flex items-center justify-center font-bold text-white text-xs border ${isEscalated ? 'border-[#ffb4ab]/20' : 'border-white/10'}`}>
                        {conv.customerName.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-snug">{conv.customerName}</h4>
                        <span className="text-[10px] text-on-surface-variant font-label-sm">{conv.lastActive}</span>
                      </div>
                    </div>

                    {/* Status & Escalation Indicators */}
                    <div className="flex items-center gap-1.5">
                      {isEscalated && (
                        <div className="flex items-center gap-1 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 text-[#ffb4ab] px-1.5 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] status-dot"></span>
                          <span className="text-[9px] font-bold font-label-sm tracking-wide">ESCALATED</span>
                        </div>
                      )}
                      
                      {!isEscalated && conv.status === 'Active' && (
                        <span className="text-[9px] font-bold bg-[#5de6ff]/10 border border-[#5de6ff]/20 text-[#5de6ff] px-1.5 py-0.5 rounded-full font-label-sm">
                          ACTIVE
                        </span>
                      )}

                      {conv.status === 'Resolved' && (
                        <span className="text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full font-label-sm">
                          RESOLVED
                        </span>
                      )}

                      <span className="text-[9px] text-outline bg-white/5 px-1.5 py-0.5 rounded border border-white/5 uppercase font-bold">
                        {conv.language}
                      </span>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <p className="text-[11px] text-on-surface-variant line-clamp-1 break-all pr-2">
                    {lastMsg ? lastMsg.text : 'No messages yet'}
                  </p>

                  {/* Footer details: assignee */}
                  <div className="flex justify-between items-center text-[10px] text-outline border-t border-white/5 pt-2 mt-1">
                    <span>Assignee: <strong className="text-on-surface-variant font-semibold">{conv.assignee}</strong></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT PANE: Selected Conversation Chat Feed & Actions */}
      <div className="flex-1 glass-card rounded-2xl border-white/10 flex flex-col h-full overflow-hidden shadow-2xl relative">
        {activeConversation ? (
          <>
            {/* Chat Detail Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-[#030d18] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary/30 to-primary-container/20 flex items-center justify-center font-bold text-secondary border border-secondary/20">
                  {activeConversation.customerName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{activeConversation.customerName}</h3>
                    <span className="text-[10px] text-outline bg-white/5 border border-white/5 px-1.5 py-0.5 rounded font-bold uppercase">
                      {activeConversation.language}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5 font-label-sm">
                    <span>Last active: {activeConversation.lastActive}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>Assignee: {activeConversation.assignee}</span>
                  </p>
                </div>
              </div>

              {/* Status & Assignee dropdowns */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Take over action for Escalated */}
                {activeConversation.status === 'Escalated' && (
                  <button
                    onClick={() => handleTakeOver(activeConversation.id)}
                    className="bg-[#ffb4ab]/15 border border-[#ffb4ab]/30 text-[#ffb4ab] px-3.5 py-1.5 rounded-lg text-xs font-bold active:scale-95 transition-all hover:bg-[#ffb4ab]/25 flex items-center gap-1 shadow-lg shadow-[#ffb4ab]/5"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xs">support_agent</span>
                    <span>Take Over Chat</span>
                  </button>
                )}

                {/* Status Switcher */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-outline font-label-sm">Status:</span>
                  <select
                    value={activeConversation.status}
                    onChange={(e) => handleStatusChange(activeConversation.id, e.target.value as any)}
                    className="bg-[#051424] border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-secondary transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Escalated">Escalated</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                {/* Assignee Switcher */}
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-outline font-label-sm">Assignee:</span>
                  <select
                    value={activeConversation.assignee}
                    onChange={(e) => handleAssigneeChange(activeConversation.id, e.target.value as any)}
                    className="bg-[#051424] border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none focus:border-secondary transition-all"
                  >
                    <option value="Unassigned">Unassigned</option>
                    <option value="Aria (AI)">Aria (AI)</option>
                    <option value="Sarah (Agent)">Sarah (Agent)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chat Thread Message list */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col bg-background/5">
              
              {/* Info banner for escalated context */}
              {activeConversation.status === 'Escalated' && (
                <div className="bg-[#ffb4ab]/5 border border-[#ffb4ab]/20 rounded-xl p-4 flex gap-3 text-left animate-pulse">
                  <span className="material-symbols-outlined text-[#ffb4ab] text-xl">warning</span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Escalation Triggered</h5>
                    <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">
                      AI agent Aria transferred this conversation because of low response confidence or direct customer request. Take over to answer.
                    </p>
                  </div>
                </div>
              )}

              {activeConversation.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isAgent = msg.sender === 'agent';
                
                if (isUser) {
                  return (
                    <div key={msg.id} className="flex flex-col items-end w-full animate-fade-in">
                      <div className="glass-card p-4 rounded-2xl rounded-tr-none max-w-[80%] text-on-surface border-white/5 shadow-md">
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-outline mt-1.5 px-1 font-label-sm">{msg.time}</span>
                    </div>
                  );
                }

                const senderName = isAgent ? 'Sarah (Support)' : 'Aria (AI)';
                const senderIcon = isAgent ? 'support_agent' : 'auto_awesome';

                return (
                  <div key={msg.id} className="flex flex-col items-start w-full animate-fade-in">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/10">
                        <span className="material-symbols-outlined text-secondary text-[12px]">{senderIcon}</span>
                      </div>
                      <span className="text-xs font-bold text-secondary">{senderName}</span>
                      
                      {msg.citation && (
                        <div className="glass-card px-2 py-0.5 rounded-full flex items-center gap-1 opacity-80 border-secondary/10">
                          <span className="material-symbols-outlined text-[9px] text-secondary">database</span>
                          <span className="text-[9px] text-on-surface-variant font-label-sm">{msg.citation}</span>
                        </div>
                      )}
                    </div>

                    <div className={`glass-card p-4 rounded-2xl rounded-tl-none max-w-[80%] text-on-surface shadow-md ${!isAgent ? 'ai-bubble-glow border-secondary/20' : 'border-white/10 bg-white/5'}`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                      {msg.confidence && (
                        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-on-surface-variant font-label-sm">
                          <span>
                            Confidence: {msg.confidence.level === 'high' ? 'high' : 'low - escalated'}
                          </span>
                          <div className="w-12 h-1 rounded-full bg-white/10 overflow-hidden">
                            <span 
                              className={`h-full rounded-full block ${msg.confidence.level === 'low' ? 'bg-error' : 'bg-secondary'}`}
                              style={{ width: `${msg.confidence.score}%` }}
                            ></span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-outline mt-1.5 px-1 font-label-sm">{msg.time}</span>
                  </div>
                );
              })}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Chat detail Response Bar */}
            <form onSubmit={handleSendReply} className="px-6 py-4 border-t border-white/10 bg-[#030d18] flex items-center gap-3">
              <input
                type="text"
                placeholder="Type reply as customer support specialist..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-[#051424] border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder:text-outline outline-none focus:border-secondary transition-all"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg shadow-secondary/15 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100 transition-all cursor-pointer"
                aria-label="Send reply"
              >
                <span className="material-symbols-outlined text-md">send</span>
              </button>
            </form>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary/5 flex items-center justify-center border border-white/5">
              <span className="material-symbols-outlined text-secondary text-3xl">forum</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-md">No conversation selected</h3>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-xs leading-relaxed">
                Click a conversation in the directory list on the left to view active chat sessions, escalation indicators, and RAG grounding scores.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
