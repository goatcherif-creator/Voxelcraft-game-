import React, { useState } from 'react';
import { Zap, Volume2, Shield, Eye, Anchor, Feather, Sparkles, MessageSquare } from 'lucide-react';
import { KAELEN_ABILITIES, KAELEN_PUNCHLINES } from '../data/adventureData';
import { soundFx } from '../utils/audio';

export const KaelenShowcase: React.FC = () => {
  const [activePunchlineId, setActivePunchlineId] = useState<string | null>(null);
  const [isVoltGlowing, setIsVoltGlowing] = useState<boolean>(false);

  const handlePlayPunchline = (punchline: typeof KAELEN_PUNCHLINES[0]) => {
    setActivePunchlineId(punchline.id);
    if (punchline.context === 'combat') soundFx.playSlash();
    else if (punchline.context === 'boss') soundFx.playExplosion();
    else if (punchline.context === 'puzzle') soundFx.playFrogRibbit();
    else soundFx.playAmethystChime(1.3);

    soundFx.speakPunchline(punchline.frenchText);
    setTimeout(() => setActivePunchlineId(null), 2500);
  };

  const handleVoltClick = () => {
    setIsVoltGlowing(true);
    soundFx.playFrogRibbit();
    setTimeout(() => setIsVoltGlowing(false), 1200);
  };

  return (
    <section id="kaelen" className="py-16 px-6 bg-[#0e0b1c]/60 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
            Le Compagnon d'Élite
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-cinzel tracking-tight">
            Kaelen, le Vagabond des Failles
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
            Mi-mentor, mi-mercenaire rebelle, Kaelen n'est pas un PNJ immobile : il combat à vos côtés avec sa Lame-Flash, déploie des tyroliennes et vous couvre avec des punchlines sarcastiques.
          </p>
        </div>

        {/* Main Grid: Portrait + Lore & Traits */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Portrait & Volt Mascot */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-purple-800/60 shadow-[0_0_35px_rgba(147,51,234,0.3)] group bg-[#130f24]">
              <img
                src="/src/assets/images/kaelen_portrait_1794053201894.jpg"
                alt="Portrait de Kaelen le Vagabond des Failles et la grenouille Volt"
                referrerPolicy="no-referrer"
                className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-102"
              />

              {/* Ambient purple gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0914] via-transparent to-transparent opacity-85" />

              {/* Interactive Volt Button overlay */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={handleVoltClick}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-all cursor-pointer border ${
                    isVoltGlowing
                      ? 'bg-emerald-500 text-black border-emerald-300 shadow-[0_0_20px_rgba(74,222,128,0.9)] scale-105'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/80 shadow-md'
                  }`}
                  title="Cliquer pour faire coasser Volt la grenouille"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Volt le coassant</span>
                </button>
              </div>

              {/* Character Identity Card at bottom of photo */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0d0a19]/90 backdrop-blur-md border border-purple-800/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-purple-200 font-cinzel">Kaelen</h3>
                    <div className="text-xs text-slate-400">Gardien Déchu des Failles Dimensionnelles</div>
                  </div>
                  <button
                    onClick={() => {
                      soundFx.playTeleport();
                      soundFx.speakPunchline("Bienvenue à la fin du monde, gamin. Essaie de ne pas cligner des yeux.");
                    }}
                    className="p-2 text-xs text-purple-300 hover:text-white bg-purple-900/60 hover:bg-purple-800 rounded-lg border border-purple-600/40 transition-colors cursor-pointer"
                    title="Entendre son entrée"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-900/40 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Masque : </span>
                    <span className="text-purple-300">Obsidienne & Œil d'Ender</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Ailes : </span>
                    <span className="text-purple-300">Élytres d'Ombre</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Traits & Companion Abilities */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {KAELEN_ABILITIES.map(ability => {
                const iconMap: Record<string, React.ReactNode> = {
                  Zap: <Zap className="w-4 h-4" />,
                  Anchor: <Anchor className="w-4 h-4" />,
                  Eye: <Eye className="w-4 h-4" />,
                  Feather: <Feather className="w-4 h-4" />
                };

                return (
                  <div
                    key={ability.id}
                    className="p-4 rounded-xl bg-[#130f26]/80 border border-purple-900/50 hover:border-purple-600/60 transition-all space-y-2 shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-slate-100 text-sm">
                        <span className="w-7 h-7 rounded-lg bg-purple-900/60 border border-purple-700/50 flex items-center justify-center text-purple-300">
                          {iconMap[ability.icon] || <Sparkles className="w-4 h-4" />}
                        </span>
                        <span>{ability.nameFr}</span>
                      </div>
                      <span className="text-[11px] font-mono text-purple-400">
                        {ability.cooldown}s CD
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {ability.description}
                    </p>

                    <div className="pt-2 border-t border-purple-950/60 space-y-1">
                      <div className="text-[11px] text-purple-300/90 font-medium">
                        {ability.gameEffect}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate" title={ability.minecraftImplementation}>
                        CMD: {ability.minecraftImplementation}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Kaelen's Punchline Soundboard */}
            <div className="p-5 rounded-2xl bg-[#141029] border border-purple-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white font-cinzel">
                    Soundboard des Punchlines de Kaelen
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Cliquez pour déclencher voix & bruitages
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {KAELEN_PUNCHLINES.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handlePlayPunchline(p)}
                    className={`flex items-start gap-2.5 p-3 rounded-lg text-left transition-all border cursor-pointer ${
                      activePunchlineId === p.id
                        ? 'bg-purple-700 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                        : 'bg-[#100c22] text-slate-200 border-purple-900/40 hover:bg-[#1a1436] hover:border-purple-700/60'
                    }`}
                  >
                    <Volume2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-xs leading-snug">
                      <span className="italic">« {p.frenchText} »</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
