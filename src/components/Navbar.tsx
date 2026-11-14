import React from 'react';
import { Sparkles, Gamepad2, BookOpen, HelpCircle } from 'lucide-react';

export type CodexTab = 'histoire' | 'personnages' | 'chapitres' | 'commandes' | 'bestiaire';

interface NavbarProps {
  activeDrawerTab: CodexTab | null;
  onOpenDrawer: (tab: CodexTab) => void;
  onCloseDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeDrawerTab,
  onOpenDrawer,
  onCloseDrawer
}) => {
  const navItems: { id: CodexTab; label: string }[] = [
    { id: 'histoire', label: 'Lore & Carte' },
    { id: 'personnages', label: 'Personnages & Feu' },
    { id: 'chapitres', label: '4 Chapitres' },
    { id: 'commandes', label: 'Commandes MC' },
    { id: 'bestiaire', label: 'Bestiaire' }
  ];

  return (
    <header className="shrink-0 z-40 bg-[#0b0914]/95 backdrop-blur-md border-b border-purple-900/40">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4 px-4 py-2">
        {/* Wordmark */}
        <button
          onClick={onCloseDrawer}
          className="flex items-center gap-2 text-sm sm:text-base font-bold tracking-tight text-white font-cinzel whitespace-nowrap shrink-0 hover:text-purple-300 transition-colors cursor-pointer"
        >
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center text-purple-200 border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <span>FAILLE D'AMÉTHYSTE</span>
        </button>

        {/* Retractable Codex & Lore Drawer Triggers */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map(item => {
            const isActive = activeDrawerTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => (isActive ? onCloseDrawer() : onOpenDrawer(item.id))}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-purple-200 hover:bg-purple-950/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action: Retractable Codex Toggle / Return to Arena */}
        <div className="flex items-center gap-2 shrink-0">
          {activeDrawerTab ? (
            <button
              onClick={onCloseDrawer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-[0_0_12px_rgba(147,51,234,0.4)] transition-all whitespace-nowrap cursor-pointer"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Retour à l'Arène</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenDrawer('personnages')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-purple-200 bg-[#17122b] hover:bg-[#221a40] border border-purple-800/60 rounded-lg transition-all whitespace-nowrap cursor-pointer"
              title="Ouvrir le panneau rétractable Codex, Chapitres & Commandes"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Codex & Menus</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
