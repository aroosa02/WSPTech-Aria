import { translations } from '../lib/translations';
import type { Language } from '../lib/translations';

interface InputBarProps {
  language: Language;
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({
  language,
  value,
  onChange,
  onSend,
  disabled = false,
}) => {
  const t = translations[language];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && value.trim()) {
      onSend();
    }
  };

  return (
    <div className="max-w-[640px] mx-auto w-full px-4 md:px-0">
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={disabled}
          placeholder={t.typeMessage}
          className="w-full bg-surface-container-low/60 backdrop-blur-xl border border-white/10 rounded-full pl-6 pr-28 py-4 text-on-surface placeholder:text-outline outline-none focus:border-secondary transition-all shadow-2xl disabled:opacity-50"
        />
        <div className="absolute right-3 flex items-center gap-2">
          <button
            type="button"
            disabled={disabled}
            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-white/5 transition-all disabled:opacity-50"
            aria-label="Attach file"
          >
            <span className="material-symbols-outlined">attach_file</span>
          </button>
          <button
            type="button"
            onClick={onSend}
            disabled={disabled || !value.trim()}
            className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100"
            aria-label="Send message"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
