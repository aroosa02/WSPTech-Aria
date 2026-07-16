import { translations } from '../lib/translations';
import type { Language } from '../lib/translations';

interface EscalationCardProps {
  language: Language;
  onConnect: () => void;
}

export const EscalationCard: React.FC<EscalationCardProps> = ({
  language,
  onConnect,
}) => {
  const t = translations[language];

  return (
    <div className="hero-card-glow glass-card p-8 rounded-2xl flex flex-col items-center text-center gap-6 my-4 w-full max-w-[640px] mx-auto animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-inner">
        <span 
          className="material-symbols-outlined text-secondary text-4xl" 
          style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
        >
          groups
        </span>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-headline-lg text-white font-bold tracking-tight">
          {t.specialistHeader}
        </h3>
        <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
          {t.specialistText}
        </p>
      </div>

      <button
        onClick={onConnect}
        className="bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-blue-500/30 active:scale-95 transition-all hover:brightness-110 focus:outline-none"
      >
        {t.connectAgent}
      </button>
    </div>
  );
};
