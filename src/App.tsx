/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
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
  const arenaRef = useRef<HTMLDivElement | null>(null);
  const commandsRef = useRef<HTMLDivElement | null>(null);

  const scrollToArena = (chapterNum?: number) => {
    if (chapterNum !== undefined) {
      setArenaChapter(chapterNum);
    }
    arenaRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCommands = () => {
    commandsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0914] text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Navigation Top Bar */}
      <Navbar onPlayClick={() => scrollToArena()} />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onPlayClick={() => scrollToArena()}
          onCommandsClick={scrollToCommands}
        />

        {/* Playable Game Arena Section */}
        <section id="arene" ref={arenaRef} className="py-12 px-6 max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
                Simulateur Jouable en Direct
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel tracking-tight">
                L'Arène Interactive des Chroniques
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Testez les mécaniques de combat, la Lame-Flash de Kaelen, le Gant d'Écho et affrontez le Colosse Ignis Primus directement dans votre navigateur !
            </p>
          </div>

          <GameCanvas initialChapter={arenaChapter} />
        </section>

        {/* Kaelen & Volt Character Showcase */}
        <KaelenShowcase />

        {/* Living Characters & Campfire Dialogues */}
        <CampfireDialogue />

        {/* The 4 Chapters Campaign Dossier */}
        <ChaptersOverview onSelectChapterForArena={scrollToArena} />

        {/* Minecraft Command Block & Datapack Generator */}
        <div ref={commandsRef}>
          <MinecraftCommandsGenerator />
        </div>

        {/* Bestiary & Boss Dossiers */}
        <BestiarySection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
