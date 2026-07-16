import { translations } from '../lib/translations';
import type { Language } from '../lib/translations';

interface HandoffStatusProps {
  language: Language;
  progress: number;
}

export const HandoffStatus: React.FC<HandoffStatusProps> = ({
  language,
  progress,
}) => {
  const t = translations[language];

  return (
    <div className="flex flex-col items-center gap-4 py-6 w-full max-w-[640px] mx-auto animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          <div className="w-10 h-10 rounded-full border-2 border-background bg-surface-container-highest overflow-hidden shadow-md">
            <img 
              className="w-full h-full object-cover" 
              src="/agent.png" 
              alt="Support Agent"  
              onError={(e) => {
                // Fallback icon if image doesn't exist
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100";
              }}
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-background glass-card flex items-center justify-center shadow-md">
            <div className="w-2 h-2 bg-secondary rounded-full status-dot"></div>
          </div>
        </div>
        <p className="text-on-surface-variant font-label-sm">{t.connectingAgent}</p>
      </div>
      
      <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-secondary rounded-full shadow-[0_0_10px_rgba(93,230,255,0.5)] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
