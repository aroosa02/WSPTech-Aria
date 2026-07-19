import { useState, useEffect, useRef } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { SideNavBar } from './components/SideNavBar';
import { MessageBubble } from './components/MessageBubble';
import { EscalationCard } from './components/EscalationCard';
import { HandoffStatus } from './components/HandoffStatus';
import { InputBar } from './components/InputBar';
import { translations } from './lib/translations';
import type { Language } from './lib/translations';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

interface Message {
  id: string;
  sender: 'user' | 'aria';
  text: string;
  time: string;
  citation?: string;
  confidence?: {
    level: 'high' | 'low';
    score: number;
  };
}

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('conversations');
  const [inputText, setInputText] = useState<string>('');
  const [escalated, setEscalated] = useState<boolean>(true);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [connectProgress, setConnectProgress] = useState<number>(0);
  const [agentConnected, setAgentConnected] = useState<boolean>(false);
  const [messageCount, setMessageCount] = useState<number>(0);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Preloaded messages matching the design specification
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'user',
      text: "I'm having some trouble with my subscription plan. It says I'm on the Basic tier but I recently upgraded to the Pro Annual plan.",
      time: '10:42 AM',
    },
    {
      id: '2',
      sender: 'aria',
      text: "I've checked our records, and I can see your payment for the Pro Annual plan was processed successfully. However, there seems to be a synchronization delay between the payment gateway and your account status.",
      time: '10:43 AM',
      citation: 'Billing DB',
      confidence: {
        level: 'high',
        score: 88,
      },
    },
    {
      id: '3',
      sender: 'user',
      text: "Okay - can you fix the sync from your end, or do I need to do something?",
      time: '10:43 AM',
    },
    {
      id: '4',
      sender: 'aria',
      text: "This particular sync issue needs manual account-permission access that I don't have. I don't want to guess here, so I'm bringing in a specialist who can fix it directly and safely.",
      time: '10:44 AM',
      confidence: {
        level: 'low',
        score: 28,
      },
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages or state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, escalated, connecting, agentConnected]);

  // Handle agent connection simulation
  useEffect(() => {
    let interval: any;
    if (connecting) {
      interval = setInterval(() => {
        setConnectProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setConnecting(false);
            setAgentConnected(true);
            // Append agent joined message
            setMessages((prevMsgs) => [
              ...prevMsgs,
              {
                id: Date.now().toString(),
                sender: 'aria', // using aria styles for agent messages
                text: language === 'en' 
                  ? "Hello! I am Sarah from customer support. I have retrieved your query and the chat context. I've manually synchronized your Pro Annual plan subscription. Could you please check your profile dashboard now?"
                  : "ہیلو! میں کسٹمر سپورٹ سے سارہ ہوں۔ میں نے آپ کے سوال اور بات چیت کی تفصیلات حاصل کر لی ہیں۔ میں نے آپ کے پرو سالانہ پلان کی سبسکرپشن کو دستی طور پر ہم آہنگ کر دیا ہے۔ کیا آپ اب اپنے پروفائل ڈیش بورڈ کو چیک کر سکتے ہیں؟",
                time: formatTime(),
                citation: 'CRM Sync',
              }
            ]);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [connecting, language]);

  const formatTime = () => {
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'AM' : 'PM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userText = inputText;
    const userTime = formatTime();
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: userTime,
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setMessageCount((prev) => prev + 1);

    // Simulate Aria typing
    setTimeout(() => {
      let ariaReply = '';
      let citation = 'WSP Docs';
      const lowercaseInput = userText.toLowerCase();

      // Simple keyword triggers
      if (lowercaseInput.includes('billing') || lowercaseInput.includes('upgrade') || lowercaseInput.includes('payment')) {
        ariaReply = language === 'en'
          ? "Our billing dashboard syncs with the Stripe gateway. If your recent transaction isn't reflected, there might be a minor delay."
          : "ہمارا بلنگ ڈیش بورڈ اسٹرائپ گیٹ وے کے ساتھ ہم آہنگ ہوتا ہے۔ اگر آپ کی حالیہ ادائیگی ظاہر نہیں ہو رہی ہے تو کچھ تاخیر ہو سکتی ہے۔";
        citation = 'Stripe Hub';
      } else if (lowercaseInput.includes('agent') || lowercaseInput.includes('human') || lowercaseInput.includes('help')) {
        ariaReply = language === 'en'
          ? "I understand you need human assistance. Let me transfer you directly to an expert right now."
          : "میں سمجھتا ہوں کہ آپ کو انسانی مدد کی ضرورت ہے۔ مجھے آپ کو فوری طور پر ایک ماہر کے پاس منتقل کرنے دیں۔";
        citation = 'Routing Engine';
        setEscalated(true);
      } else {
        ariaReply = language === 'en'
          ? `I've analyzed your query regarding "${userText}". WSP Aria is designed to ground support data with strict citations. If my response doesn't address your exact need, you can type "agent" to connect with a specialist.`
          : `میں نے آپ کے سوال "${userText}" کا جائزہ لیا ہے۔ آریا کو کسٹمر ڈیٹا کو درست حوالہ جات کے ساتھ پیش کرنے کے لیے تیار کیا گیا ہے۔ اگر آپ کو مزید مدد چاہیے تو آپ ایجنٹ سے رابطہ کر سکتے ہیں۔`;
      }

      const isLowConfidence = lowercaseInput.includes('agent') || lowercaseInput.includes('human') || lowercaseInput.includes('help');

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'aria',
          text: ariaReply,
          time: formatTime(),
          citation,
          confidence: {
            level: isLowConfidence ? 'low' : 'high',
            score: isLowConfidence ? 25 : 80,
          },
        },
      ]);

      // If user reaches 3 messages, auto-trigger escalation card for demo
      if (messageCount >= 2 && !escalated && !agentConnected) {
        setTimeout(() => {
          setEscalated(true);
        }, 1000);
      }
    }, 1200);
  };

  const handleNewConversation = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'aria',
        text: language === 'en'
          ? "Hello! I am WSP Aria, your intelligent assistant. How can I help you today?"
          : "ہیلو! میں آریا ہوں، آپ کا ذہین معاون۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟",
        time: formatTime(),
        citation: 'Welcome DB',
      },
    ]);
    setEscalated(false);
    setConnecting(false);
    setConnectProgress(0);
    setAgentConnected(false);
    setMessageCount(0);
  };

  const handleConnectAgent = () => {
    setEscalated(false);
    setConnecting(true);
    setConnectProgress(0);
  };

  const handleUpgrade = () => {
    alert(language === 'en' ? 'Upgrading to Pro (Simulation)...' : 'پرو پر اپ گریڈ کریں (ٹیسٹ)...');
  };

  const handleLogout = () => {
    alert(language === 'en' ? 'Logging out...' : 'لاگ آؤٹ ہو رہا ہے...');
  };

  const t = translations[language];

  if (isAdminMode) {
    return (
      <AdminDashboardPage
        language={language}
        onLanguageChange={setLanguage}
        onSwitchToClient={() => setIsAdminMode(false)}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen relative overflow-x-hidden selection:bg-secondary/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-secondary/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <TopAppBar
        language={language}
        onLanguageChange={setLanguage}
        onNewConversation={handleNewConversation}
        onSwitchToAdmin={() => setIsAdminMode(true)}
      />

      {/* Sidebar Nav */}
      <SideNavBar
        language={language}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onUpgrade={handleUpgrade}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="relative z-10 pt-24 pb-48 px-margin-mobile md:px-margin-desktop min-h-screen lg:ml-64">
        {activeTab === 'conversations' && (
          <div className="max-w-[640px] mx-auto flex flex-col gap-8">
            {/* Chat Thread */}
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                sender={msg.sender}
                text={msg.text}
                time={msg.time}
                citation={msg.citation}
                language={language}
                confidence={msg.confidence}
              />
            ))}

            {/* Hand-off Escalation Card */}
            {escalated && (
              <EscalationCard
                language={language}
                onConnect={handleConnectAgent}
              />
            )}

            {/* Connecting Spinner/Progress */}
            {connecting && (
              <HandoffStatus
                language={language}
                progress={connectProgress}
              />
            )}

            {/* Dummy anchor for scrolling */}
            <div ref={messagesEndRef} />
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="max-w-[800px] mx-auto space-y-6 animate-fade-in">
            <h2 className="font-headline-lg text-white font-bold">
              {language === 'en' ? 'Knowledge Base' : 'معلوماتی مرکز'}
            </h2>
            <p className="text-on-surface-variant">
              {language === 'en' 
                ? 'Manage and browse your synced document directories that ground Aria’s responses.'
                : 'ان دستاویزات کو براؤز کریں جن پر آریا کے جوابات مبنی ہیں۔'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-xl border-white/5 space-y-3">
                <span className="material-symbols-outlined text-secondary text-3xl">folder</span>
                <h3 className="font-bold text-white">Billing FAQs</h3>
                <p className="text-xs text-on-surface-variant">14 documents synced • Last updated 2 hours ago</p>
              </div>
              <div className="glass-card p-6 rounded-xl border-white/5 space-y-3">
                <span className="material-symbols-outlined text-secondary text-3xl">description</span>
                <h3 className="font-bold text-white">API References</h3>
                <p className="text-xs text-on-surface-variant">42 documents synced • Last updated 1 day ago</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-[800px] mx-auto space-y-6 animate-fade-in">
            <h2 className="font-headline-lg text-white font-bold">
              {language === 'en' ? 'Settings' : 'ترتیبات'}
            </h2>
            <p className="text-on-surface-variant">
              {language === 'en' 
                ? 'Configure your intelligent assistant behavior, model grounding, and profile settings.'
                : 'اپنے ذہین معاون کے برتاؤ اور پروفائل کی ترتیبات کو ترتیب دیں۔'}
            </p>
            <div className="glass-card p-6 rounded-xl border-white/5 space-y-4">
              <h3 className="font-bold text-white border-b border-white/10 pb-2">
                {language === 'en' ? 'Model Settings' : 'ماڈل کی ترتیبات'}
              </h3>
              <div className="flex justify-between items-center text-sm">
                <span>{language === 'en' ? 'RAG Confidence Threshold' : 'آر اے جی اعتماد کی حد'}</span>
                <span className="text-secondary font-bold">0.85 (High)</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{language === 'en' ? 'Default Language' : 'بنیادی زبان'}</span>
                <span className="text-secondary uppercase font-bold">{language}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="max-w-[800px] mx-auto space-y-6 animate-fade-in">
            <h2 className="font-headline-lg text-white font-bold">
              {language === 'en' ? 'Support Center' : 'سپورٹ سینٹر'}
            </h2>
            <p className="text-on-surface-variant">
              {language === 'en' 
                ? 'Need technical support for WSP Aria? Browse help articles or contact team admins.'
                : 'کیا آپ کو تکنیکی مدد کی ضرورت ہے؟ ہمارے مضامین پڑھیں یا ٹیم ایڈمن سے رابطہ کریں۔'}
            </p>
            <div className="glass-card p-6 rounded-xl border-white/5 space-y-3">
              <h3 className="font-bold text-white">{language === 'en' ? 'Direct Escalation' : 'براہ راست رابطہ'}</h3>
              <p className="text-sm text-on-surface-variant">
                {language === 'en'
                  ? 'If Aria is not meeting your requirements, click below to schedule a call with WSP integration team.'
                  : 'اگر آریا آپ کے معیار پر پورا نہیں اتر رہا، تو ٹیم کے ساتھ میٹنگ شیڈول کریں۔'}
              </p>
              <button 
                onClick={handleUpgrade}
                className="px-4 py-2 bg-secondary text-on-secondary rounded-lg font-bold text-xs"
              >
                {language === 'en' ? 'Schedule Integration Call' : 'میٹنگ شیڈول کریں'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Input & Footer Area */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-gutter bg-gradient-to-t from-background via-background/95 to-transparent z-30">
        <div className="max-w-[640px] mx-auto flex flex-col gap-4">
          {activeTab === 'conversations' && (
            <InputBar
              language={language}
              value={inputText}
              onChange={setInputText}
              onSend={handleSendMessage}
              disabled={connecting}
            />
          )}

          {/* Footer Info */}
          <footer className="w-full py-2 flex flex-col items-center gap-2">
            <div className="flex justify-center items-center gap-4 text-on-surface-variant font-label-sm">
              <span>{t.secure}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>{t.multilingual}</span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>{t.support247}</span>
            </div>
            <div className="flex gap-4 text-[10px] text-outline">
              <a className="hover:text-secondary transition-colors" href="#">{t.privacy}</a>
              <a className="hover:text-secondary transition-colors" href="#">{t.terms}</a>
              <a className="hover:text-secondary transition-colors" href="#">{t.dataSecurity}</a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App;
