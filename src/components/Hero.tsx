import React from 'react';
import { Play, Terminal, Sparkles, Compass } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeroProps {
  onPlayClick: () => void;
  onCommandsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlayClick, onCommandsClick }) => {
  return (
    <section className="relative pt-6 pb-16 px-6 overflow-hidden">
      {/* Background glow and matrix */}
      <div className="absolute inset-0 bg-grid-amethyst pointer-events-none opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Unboxed metadata line with typographic separators */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-purple-300/90 mb-4 tracking-wide uppercase">
          <span>Map Aventure Minecraft</span>
          <span aria-hidden="true" className="text-purple-600">·</span>
          <span>Action-RPG & Donjons</span>
          <span aria-hidden="true" className="text-purple-600">·</span>
          <span>Durée : 2 à 3 heures</span>
          <span aria-hidden="true" className="text-purple-600">·</span>
          <span>Java 1.20+ & Bedrock</span>
        </div>

        {/* Hero split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Text & Action triggers */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-cinzel leading-[1.15] text-balance">
              Les Chroniques de la <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">Faille d'Améthyste</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Une mystérieuse catastrophe a brisé l'équilibre dimensionnel. Des fragments du Nether et de l'End s'effondrent directement dans l'Overworld. Récupérez les trois artefacts anciens aux côtés de <strong className="text-purple-300 font-semibold">Kaelen, le Vagabond des Failles</strong>, et de sa grenouille luminescente <strong className="text-emerald-300 font-semibold">Volt</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundFx.playAmethystChime(1.2);
                  onPlayClick();
                }}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Jouer la Démo Interactive</span>
              </button>

              <button
                onClick={() => {
                  soundFx.playAmethystChime(1.5);
                  onCommandsClick();
                }}
                className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-200 bg-[#171329] hover:bg-[#201a3b] border border-purple-800/60 rounded-xl transition-all cursor-pointer whitespace-nowrap"
              >
                <Terminal className="w-4 h-4 text-purple-400" />
                <span>Commandes & Datapack</span>
              </button>
            </div>

            {/* Feature Highlights (Clean unboxed style) */}
            <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-purple-900/30 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-purple-400 shrink-0" />
                <span>4 Dimensions Déchirées</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Gadgets & Mécanismes</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Vanilla Command Blocks</span>
              </div>
            </div>
          </div>

          {/* Right: Cinematic World Visual */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-purple-800/50 shadow-[0_0_40px_rgba(107,33,168,0.25)] group">
              <img
                src="/src/assets/images/amethyst_rift_world_1794053202919.jpg"
                alt="Panorama de la Faille d'Améthyste dans Minecraft"
                referrerPolicy="no-referrer"
                className="w-full aspect-[16/9] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0914] via-transparent to-transparent opacity-70" />

              {/* In-image caption tag */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-[#0b0914]/80 backdrop-blur-sm border border-purple-800/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-purple-300 font-cinzel">Village Cristallisé & Faille Céleste</div>
                  <div className="text-[11px] text-slate-400">Point de convergence des 3 artefacts anciens</div>
                </div>
                <button
                  onClick={() => soundFx.playAmethystChime(1.4)}
                  className="px-2.5 py-1 text-xs text-purple-300 hover:text-white bg-purple-950/60 rounded border border-purple-700/40 transition-colors cursor-pointer"
                >
                  Faire résonner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
