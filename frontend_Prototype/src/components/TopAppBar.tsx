import { translations } from '../lib/translations';
import type { Language } from '../lib/translations';

interface TopAppBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNewConversation: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  language,
  onLanguageChange,
  onNewConversation,
}) => {
  const t = translations[language];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-2xl border-b border-white/10 shadow-xl shadow-secondary/5">
      <div className="flex justify-between items-center px-gutter py-4 w-full max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-xl">blur_on</span>
            </div>
            <span className="font-headline-lg text-secondary tracking-tight font-bold">{t.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="glass-card px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 status-dot"></span>
              <span className="font-label-sm text-on-surface-variant">{t.online}</span>
            </div>
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'ur' : 'en')}
              className="glass-card px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle language"
            >
              <span className="material-symbols-outlined text-sm text-secondary">language</span>
              <span className="font-label-sm text-on-surface-variant uppercase">{language}</span>
            </button>
          </div>
        </div>
        <button
          onClick={onNewConversation}
          className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-4 py-2 rounded-full font-label-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all duration-150 focus:outline-none hover:brightness-110"
        >
          {t.newConversation}
        </button>
      </div>
    </header>
  );
};
