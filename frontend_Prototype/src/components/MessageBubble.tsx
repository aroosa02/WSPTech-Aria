import React from 'react';
import { translations } from '../lib/translations';
import type { Language } from '../lib/translations';

interface MessageBubbleProps {
  sender: 'user' | 'aria';
  text: string;
  time: string;
  citation?: string;
  language: Language;
  confidence?: {
    level: 'high' | 'low';
    score: number;
  };
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  sender,
  text,
  time,
  citation,
  language,
  confidence,
}) => {
  const isUser = sender === 'user';
  const t = translations[language];

  if (isUser) {
    return (
      <div className="flex flex-col items-end w-full animate-fade-in">
        <div className="glass-card p-4 rounded-2xl rounded-tr-none max-w-[85%] text-on-surface border-white/5 shadow-md">
          <p className="whitespace-pre-wrap break-words">{text}</p>
        </div>
        <span className="text-[10px] text-outline mt-2 px-1">{time}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start w-full animate-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary text-sm">auto_awesome</span>
        </div>
        <span className="font-label-sm text-secondary">Aria</span>
        
        {citation && (
          <div className="glass-card px-2 py-0.5 rounded-full flex items-center gap-1 opacity-80 border-secondary/10">
            <span className="material-symbols-outlined text-[10px] text-secondary">database</span>
            <span className="text-[10px] text-on-surface-variant">{citation}</span>
          </div>
        )}
      </div>

      <div className="glass-card ai-bubble-glow p-4 rounded-2xl rounded-tl-none max-w-[85%] text-on-surface border-secondary/20 shadow-md">
        <p className="whitespace-pre-wrap break-words">{text}</p>
        {confidence && (
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-on-surface-variant font-label-sm">
            <span>
              {t.confidence}: {confidence.level === 'high' ? t.high : t.lowEscalating}
            </span>
            <div className="w-[60px] h-1 rounded-full bg-white/10 overflow-hidden">
              <span 
                className={`h-full rounded-full block ${confidence.level === 'low' ? 'bg-error' : 'bg-secondary'}`}
                style={{ width: `${confidence.score}%` }}
              ></span>
            </div>
          </div>
        )}
      </div>
      <span className="text-[10px] text-outline mt-2 px-1">{time}</span>
    </div>
  );
};
