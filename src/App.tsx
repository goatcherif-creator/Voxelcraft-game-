/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, BookOpen, Flame, Compass, Terminal, Skull, Sparkles } from 'lucide-react';
import { Navbar, CodexTab } from './components/Navbar';
import { Hero } from './components/Hero';
import { GameCanvas } from './components/GameCanvas';
import { KaelenShowcase } from './components/KaelenShowcase';
import { CampfireDialogue } from './components/CampfireDialogue';
import { ChaptersOverview } from './components/ChaptersOverview';
import { MinecraftCommandsGenerator } from './components/MinecraftCommandsGenerator';
import { BestiarySection } from './components/BestiarySection';
import { Footer } from './components/Footer';

export default function App() {
  const [arenaChapter, setArenaChapter] = useState<number>(1);
  const [activeDrawerTab, setActiveDrawerTab] = useState<CodexTab | null>(null);

  const handleSelectChapter = (chapterNum?: number) => {
    if (chapterNum !== undefined) {
      setArenaChapter(chapterNum);
    }
    setActiveDrawerTab(null);
  };

  const drawerTabs: { id: CodexTab; label: string; icon: React.ReactNode }[] = [
    { id: 'histoire', label: 'Lore & Carte', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'personnages', label: 'Personnages & Feu', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'chapitres', label: '4 Chapitres', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'commandes', label: 'Commandes MC', icon: <Terminal className="w-3.5 h-3.5" /> },
    { id: 'bestiaire', label: 'Bestiaire & Boss', icon: <Skull className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0b0914] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Compact Top Navigation Bar */}
      <Navbar
        activeDrawerTab={activeDrawerTab}
        onOpenDrawer={(tab) => setActiveDrawerTab(tab)}
        onCloseDrawer={() => setActiveDrawerTab(null)}
      />

      {/* Main 100vh Game Dashboard & Playable Arena right at the top — zero scroll needed */}
      <main className="flex-1 min-h-0 flex flex-col p-2 sm:p-3 max-w-[1600px] w-full mx-auto overflow-hidden">
        <GameCanvas
          initialChapter={arenaChapter}
          onOpenCodex={() => setActiveDrawerTab('histoire')}
        />
      </main>

      {/* Retractable Slide-Over Panel for Lore, Campfire Dialogues, Chapters, Commands & Bestiary */}
      {activeDrawerTab && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setActiveDrawerTab(null)}
          />

          {/* Retractable Drawer */}
          <aside className="relative z-10 w-full max-w-5xl h-full bg-[#0b0914] border-l border-purple-800/60 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header & Tab Strip */}
            <div className="shrink-0 px-4 sm:px-6 py-3 bg-[#130e24] border-b border-purple-900/50 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white font-cinzel tracking-wide">
                  Codex & Dossier d'Aventure
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {drawerTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDrawerTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      activeDrawerTab === tab.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-[#1a1333] text-slate-300 hover:text-white hover:bg-purple-900/50 border border-purple-900/40'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveDrawerTab(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-purple-900/60 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Réduire le panneau pour jouer"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Jouer</span>
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto">
              {activeDrawerTab === 'histoire' && (
                <div>
                  <Hero
                    onPlayClick={() => handleSelectChapter()}
                    onCommandsClick={() => setActiveDrawerTab('commandes')}
                  />
                  <Footer />
                </div>
              )}

              {activeDrawerTab === 'personnages' && (
                <div>
                  <KaelenShowcase />
                  <CampfireDialogue />
                </div>
              )}

              {activeDrawerTab === 'chapitres' && (
                <ChaptersOverview onSelectChapterForArena={(id) => handleSelectChapter(id)} />
              )}

              {activeDrawerTab === 'commandes' && (
                <MinecraftCommandsGenerator />
              )}

              {activeDrawerTab === 'bestiaire' && (
                <BestiarySection />
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
