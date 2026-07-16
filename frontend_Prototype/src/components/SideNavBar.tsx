import { translations } from '../lib/translations';
import type { Language } from '../lib/translations';

interface SideNavBarProps {
  language: Language;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onUpgrade: () => void;
  onLogout: () => void;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  language,
  activeTab,
  onTabChange,
  onUpgrade,
  onLogout,
}) => {
  const t = translations[language];

  const navItems = [
    { id: 'conversations', label: t.conversations, icon: 'chat' },
    { id: 'knowledge', label: t.knowledge, icon: 'database' },
    { id: 'settings', label: t.settings, icon: 'settings' },
    { id: 'support', label: t.support, icon: 'help' },
  ];

  return (
    <aside className="hidden lg:flex h-screen w-64 fixed left-0 top-0 bg-surface-container-low/40 backdrop-blur-xl border-r border-white/10 shadow-2xl flex-col py-6 z-40">
      <div className="px-6 mb-8 mt-20">
        <h2 className="font-label-sm text-outline uppercase tracking-widest text-[10px]">{t.menu}</h2>
      </div>
      
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 px-6 py-3 w-full text-left transition-all focus:outline-none ${
                isActive
                  ? 'bg-secondary/10 text-secondary border-r-4 border-secondary'
                  : 'text-on-surface-variant hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-6 mt-auto">
        <div className="glass-card p-4 rounded-xl mb-4 text-center">
          <p className="text-xs text-on-surface-variant mb-3">{t.upgradeHeader}</p>
          <button
            onClick={onUpgrade}
            className="w-full py-2 bg-secondary text-on-secondary rounded-lg font-label-sm font-bold active:scale-95 transition-transform duration-100 hover:brightness-110 focus:outline-none"
          >
            {t.upgradeButton}
          </button>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-3 py-3 w-full text-left text-on-surface-variant hover:text-error transition-colors focus:outline-none"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md">{t.logout}</span>
        </button>
      </div>
    </aside>
  );
};
