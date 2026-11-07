import React from 'react';
import { Skull, Flame, Eye, Sparkles, ShieldAlert, Award, Volume2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const BestiarySection: React.FC = () => {
  const creatures = [
    {
      id: 'ignis_primus',
      name: "L'Ignis Primus",
      subtitle: "Colosse de Magma & Gardien du Fléau Flamboyant",
      dimension: "Nether / Mer de Lave",
      hp: "650 HP",
      weakness: "Gant d'Écho dans le dos & Eau glacée",
      loot: "Cœur de Basalte (Artefact 2) + Fléau d'Obsidienne Incandescente",
      description: "Une masse colossale de roche magmatique et de basalte noir forgée dans les profondeurs du Nether. Son fléau en fusion brise les ponts d'obsidienne et projette des gerbes de lave mortelles.",
      image: "/src/assets/images/ignis_primus_boss_1794053202543.jpg",
      onSound: () => soundFx.playExplosion()
    },
    {
      id: 'void_shadow',
      name: "L'Ombre du Vide",
      subtitle: "Entité Cosmique & Briseur de Réalités",
      dimension: "Faille Primordiale",
      hp: "1000 HP",
      weakness: "Élytres d'Ombre coordonnées & Frappes orbitales",
      loot: "Sceau Dimensionnel de Stase Universelle (Trophée de Fin)",
      description: "Le boss final de l'aventure. Une entité d'antimatière pure capable de déchirer le sol sous vos pieds et de saturer l'arène de météores dimensionnels.",
      onSound: () => soundFx.playTeleport()
    },
    {
      id: 'corrupted_zombies',
      name: "Zombies Cristallisés",
      subtitle: "Habitants corrompus par la résonance d'améthyste",
      dimension: "Overworld / Village",
      hp: "50 HP",
      weakness: "Lame-Flash de Kaelen & Attaques de taille",
      loot: "Éclats d'améthyste corrompus & Clé de la Crypte",
      description: "Des villageois piégés dont les membres ont été partiellement remplacés par des cristaux violets tranchants. Leurs coups infligent l'effet Stase.",
      onSound: () => soundFx.playSlash()
    },
    {
      id: 'shadow_stalker',
      name: "Rôdeurs Invisibles du Vide",
      subtitle: "Chasseurs en déphasage dimensionnel",
      dimension: "End / Forteresse Suspendue",
      hp: "75 HP",
      weakness: "Luminescence de Volt (la grenouille)",
      loot: "Perles d'Ender prismatiques",
      description: "Totalement invisibles à l'œil nu, ces créatures traquent leurs proies en silence. Seule la bioluminescence de Volt permet de briser leur déphasage.",
      onSound: () => soundFx.playFrogRibbit()
    }
  ];

  return (
    <section id="bestiaire" className="py-16 px-6 bg-[#0a0714] border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
            Codex des Créatures & Boss
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-cinzel tracking-tight">
            Le Bestiaire de la Faille
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl">
            Toutes les entités hostiles peuplant les dimensions déchirées, leurs points faibles et leurs butins exclusifs.
          </p>
        </div>

        {/* Creatures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {creatures.map(cr => (
            <div
              key={cr.id}
              className="rounded-2xl bg-[#120e24] border border-purple-900/50 hover:border-purple-600/50 transition-all p-6 space-y-4 shadow-lg group"
            >
              {/* Image banner if present */}
              {cr.image && (
                <div className="rounded-xl overflow-hidden border border-purple-800/40 relative">
                  <img
                    src={cr.image}
                    alt={cr.name}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={cr.onSound}
                      className="p-2 rounded-lg bg-black/60 hover:bg-black/90 text-purple-300 hover:text-white border border-purple-700/50 backdrop-blur-sm transition-colors cursor-pointer"
                      title="Écouter son cri"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Title & Dimension */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-cinzel group-hover:text-purple-300 transition-colors">
                    {cr.name}
                  </h3>
                  <div className="text-xs text-purple-300/80 italic">{cr.subtitle}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-rose-400">{cr.hp}</div>
                  <div className="text-[11px] text-slate-400">{cr.dimension}</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {cr.description}
              </p>

              {/* Tactics & Loot breakdown */}
              <div className="pt-3 border-t border-purple-950 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Point Faible : </span>
                    <span className="text-slate-300">{cr.weakness}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-200">Butin Récompense : </span>
                    <span className="text-slate-300">{cr.loot}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
