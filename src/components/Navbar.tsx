import React from 'react';
import { Sparkles, Gamepad2 } from 'lucide-react';

interface NavbarProps {
  onPlayClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onPlayClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0914]/90 backdrop-blur-md border-b border-purple-900/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white font-cinzel whitespace-nowrap shrink-0 hover:text-purple-300 transition-colors">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-900 flex items-center justify-center text-purple-200 border border-purple-400/30 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>FAILLE D'AMÉTHYSTE</span>
        </a>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#arene" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Arène Jouable
          </a>
          <a href="#personnages" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Personnages Vivants
          </a>
          <a href="#chapitres" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Les 4 Chapitres
          </a>
          <a href="#commandes" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Commandes Minecraft
          </a>
          <a href="#bestiaire" className="hover:text-purple-300 transition-colors whitespace-nowrap shrink-0">
            Bestiaire & Boss
          </a>
        </nav>

        {/* Zone 3: 1 primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onPlayClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Tester l'Arène</span>
          </button>
        </div>
      </div>
    </header>
  );
};
