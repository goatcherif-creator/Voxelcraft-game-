import React, { useState } from 'react';
import { CHAPTERS_DATA } from '../data/adventureData';
import { Compass, CheckCircle2, Key, Skull, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface ChaptersOverviewProps {
  onSelectChapterForArena: (chapterId: number) => void;
}

export const ChaptersOverview: React.FC<ChaptersOverviewProps> = ({ onSelectChapterForArena }) => {
  const [activeChapterId, setActiveChapterId] = useState<number>(1);
  const currentChapter = CHAPTERS_DATA.find(c => c.id === activeChapterId) || CHAPTERS_DATA[0];

  const dimensionBadgeColors: Record<string, string> = {
    Overworld: 'text-emerald-400 border-emerald-800/40 bg-emerald-950/30',
    Nether: 'text-amber-400 border-amber-800/40 bg-amber-950/30',
    End: 'text-purple-400 border-purple-800/40 bg-purple-950/30',
    Rift: 'text-fuchsia-400 border-fuchsia-800/40 bg-fuchsia-950/30'
  };

  return (
    <section id="chapitres" className="py-16 px-6 bg-[#0a0815] border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
              Campagne Narrative en 4 Actes
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-cinzel tracking-tight">
              Le Déroulement de l'Aventure
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl">
              Chaque chapitre propose un écosystème dimensionnel unique, des mécaniques de coopération avec Kaelen, et un fragment de la Faille à réparer.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Temps de jeu global : <span className="text-purple-300 font-bold">2h à 3h</span>
          </div>
        </div>

        {/* Chapter Tabs Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CHAPTERS_DATA.map(ch => {
            const isSelected = ch.id === activeChapterId;
            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveChapterId(ch.id);
                  soundFx.playAmethystChime(1 + ch.id * 0.15);
                }}
                className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#1b1434] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : 'bg-[#110e21] border-purple-950/60 hover:bg-[#16122a] hover:border-purple-800/60'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-fuchsia-400" />
                )}

                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-mono">Acte 0{ch.id}</span>
                  <span className="font-medium">{ch.duration}</span>
                </div>

                <div className="text-sm font-bold text-white font-cinzel line-clamp-1 mb-1">
                  {ch.title.split(' : ')[1] || ch.title}
                </div>

                <div className="text-xs text-slate-400 truncate">
                  {ch.dimension}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Chapter Detailed Dossier */}
        <div className="rounded-2xl bg-[#120e24] border border-purple-800/40 p-6 sm:p-8 space-y-8 shadow-xl">
          {/* Chapter Title & Environment Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-purple-900/30">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-0.5 rounded border font-mono ${dimensionBadgeColors[currentChapter.dimension]}`}>
                  Dimension : {currentChapter.dimension}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300 font-mono">Durée estimée : {currentChapter.duration}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
                {currentChapter.title}
              </h3>
              <p className="text-sm text-purple-200/90 italic">
                « {currentChapter.subtitle} »
              </p>
            </div>

            <button
              onClick={() => {
                soundFx.playTeleport();
                onSelectChapterForArena(currentChapter.id);
              }}
              className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all shadow-md hover:shadow-purple-500/30 cursor-pointer self-start lg:self-center shrink-0"
            >
              <span>Lancer ce niveau dans l'Arène</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dossier Grid: Objectives, Gadget & Boss */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Objectives & Lore */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-200 font-cinzel">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Objectifs Principaux de la Quête</span>
                </div>
                <div className="space-y-2">
                  {currentChapter.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[#0e0a1d] border border-purple-950 text-xs text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-purple-900/60 text-purple-300 flex items-center justify-center shrink-0 font-mono text-[10px] mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secrets & Easter Eggs */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wide">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>Secrets & Loots Cachés</span>
                </div>
                <div className="space-y-1.5">
                  {currentChapter.secrets.map((sec, idx) => (
                    <div key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-amber-400">◆</span>
                      <span>{sec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lore quote box */}
              <div className="p-4 rounded-xl bg-[#17122e] border-l-2 border-purple-500 text-xs text-purple-200 italic leading-relaxed">
                {currentChapter.loreSnippet}
              </div>
            </div>

            {/* Right Column: Boss or Gadget Card */}
            <div className="lg:col-span-5 space-y-4">
              {currentChapter.boss ? (
                <div className="p-5 rounded-xl bg-[#180f1e] border border-rose-900/50 space-y-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skull className="w-4 h-4 text-rose-400" />
                      <span className="text-xs font-bold text-rose-300 font-cinzel">Boss de Fin de Chapitre</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-400">
                      {currentChapter.boss.hp} HP
                    </span>
                  </div>

                  {currentChapter.boss.image && (
                    <div className="rounded-lg overflow-hidden border border-rose-800/40">
                      <img
                        src={currentChapter.boss.image}
                        alt={currentChapter.boss.name}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-[16/9] object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h4 className="text-base font-bold text-white font-cinzel">{currentChapter.boss.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{currentChapter.boss.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-rose-950">
                    <div className="text-[11px] font-semibold text-rose-300 uppercase tracking-wider">
                      Stratégie de Combat Recommandée :
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {currentChapter.boss.tactics.map((tac, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">›</span>
                          <span>{tac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : currentChapter.gadgetUnlocked ? (
                <div className="p-5 rounded-xl bg-[#14102d] border border-purple-800/60 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 font-cinzel">Gadget Légendaire Débloqué</span>
                  </div>

                  <h4 className="text-base font-bold text-white font-cinzel">
                    {currentChapter.gadgetUnlocked.name}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentChapter.gadgetUnlocked.description}
                  </p>

                  <div className="pt-2 border-t border-purple-950">
                    <div className="text-[11px] text-purple-400 font-mono">
                      Item Minecraft : {currentChapter.gadgetUnlocked.minecraftItem}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
