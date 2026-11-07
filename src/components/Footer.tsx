import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 bg-[#07050d] border-t border-purple-950 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="font-cinzel font-bold text-sm text-slate-200">
              Les Chroniques de la Faille d'Améthyste
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <a href="#arene" className="hover:text-purple-300 transition-colors">Arène Jouable</a>
            <a href="#personnages" className="hover:text-purple-300 transition-colors">Personnages Vivants</a>
            <a href="#chapitres" className="hover:text-purple-300 transition-colors">Les 4 Chapitres</a>
            <a href="#commandes" className="hover:text-purple-300 transition-colors">Générateur Datapack</a>
            <a href="#bestiaire" className="hover:text-purple-300 transition-colors">Bestiaire</a>
          </div>
        </div>

        <div className="pt-6 border-t border-purple-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            Non affilié à Mojang Studios ni Microsoft. Minecraft est une marque déposée de Mojang AB.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Créé pour les aventuriers des failles dimensionnelles</span>
            <span>·</span>
            <span className="text-purple-400 font-semibold">Kaelen & Volt</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
