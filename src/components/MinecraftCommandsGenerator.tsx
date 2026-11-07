import React, { useState } from 'react';
import { MINECRAFT_COMMANDS } from '../data/adventureData';
import { Terminal, Copy, Check, Download, Sparkles, Sliders, Box, Layers } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const MinecraftCommandsGenerator: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Customizer state
  const [kaelenSkinOwner, setKaelenSkinOwner] = useState<string>('EnderRogue');
  const [gloveSoundVolume, setGloveSoundVolume] = useState<string>('2');
  const [bossHealthValue, setBossHealthValue] = useState<number>(650);

  const categories = [
    { id: 'all', label: 'Toutes les commandes' },
    { id: 'npc', label: 'Kaelen (Armor Stand)' },
    { id: 'gadget', label: 'Gadgets (Gant & Grappin)' },
    { id: 'boss', label: 'Boss & Bossbar' },
    { id: 'dialogue', label: 'Dialogues Tellraw' }
  ];

  const filteredCommands = MINECRAFT_COMMANDS.filter(cmd => {
    if (selectedCategory === 'all') return true;
    return cmd.category === selectedCategory;
  });

  const handleCopy = (id: string, text: string) => {
    // Process customization variables
    let finalCmd = text;
    if (id === 'summon_kaelen') {
      finalCmd = finalCmd.replace(/SkullOwner:"[^"]*"/, `SkullOwner:"${kaelenSkinOwner}"`);
    } else if (id === 'echo_glove') {
      finalCmd = finalCmd.replace(/chime master @a ~ ~ ~ 2 1.2/, `chime master @a ~ ~ ~ ${gloveSoundVolume} 1.2`);
    } else if (id === 'ignis_primus_bossbar') {
      finalCmd = finalCmd.replace(/max 650/, `max ${bossHealthValue}`);
    }

    navigator.clipboard.writeText(finalCmd);
    setCopiedId(id);
    soundFx.playAmethystChime(1.5);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadDatapack = () => {
    soundFx.playVictoryFanfare();

    // Build complete .mcfunction script
    const packContent = `# ========================================================
# LES CHRONIQUES DE LA FAILLE D'AMÉTHYSTE - DATAPACK
# Version : Minecraft Java 1.20+
# ========================================================

# --- INITIALISATION ET SCOREBOARDS (load.mcfunction) ---
scoreboard objectives add use_echo_glove minecraft.used:minecraft.carrot_on_a_stick "Gant d'Echo"
scoreboard objectives add use_rod minecraft.used:minecraft.fishing_rod "Grappin Cinetique"
bossbar add ignis_primus {"text":"Ignis Primus - Colosse de Magma","color":"red","bold":true}
bossbar set ignis_primus color red
bossbar set ignis_primus style segmented_10
bossbar set ignis_primus max ${bossHealthValue}

tellraw @a [{"text":"[FAILLE D'AMÉTHYSTE] ","color":"dark_purple","bold":true},{"text":"Datapack initialisé avec succès !","color":"light_purple"}]

# --- INVOCATION DE KAELEN ---
summon armor_stand ~ ~ ~ {Tags:["Kaelen","Companion","Ally"],CustomName:'{"text":"Kaelen, le Vagabond","color":"dark_purple","bold":true}',CustomNameVisible:1b,ShowArms:1b,NoBasePlate:1b,ArmorItems:[{id:"minecraft:netherite_boots",Count:1b},{id:"minecraft:leather_leggings",Count:1b,tag:{display:{color:1908001}}},{id:"minecraft:leather_chestplate",Count:1b,tag:{display:{color:1114129}}},{id:"minecraft:player_head",Count:1b,tag:{SkullOwner:"${kaelenSkinOwner}"}}],HandItems:[{id:"minecraft:netherite_sword",Count:1b,tag:{display:{Name:'{"text":"Lame-Flash d\'Améthyste","color":"light_purple"}'}}},{}],Invulnerable:1b}

# --- DONNER LES ITEMS DE DÉPART ---
give @p carrot_on_a_stick{CustomModelData:1001,display:{Name:'{"text":"Gant d\'Écho Résonnant","color":"light_purple","bold":true}',Lore:['{"text":"Active les mécanismes sculk et repousse les ombres.","color":"gray"}' ]},EchoGlove:1b} 1
give @p fishing_rod{CustomModelData:1002,display:{Name:'{"text":"Grappin Cinétique","color":"aqua","bold":true}',Lore:['{"text":"Lancez pour vous projeter à grande vitesse.","color":"gray"}' ]}} 1

# --- PARTICULES PERMANENTES SUR KAELEN ---
execute at @e[tag=Kaelen] run particle minecraft:reverse_portal ~ ~1 ~ 0.2 0.4 0.2 0.05 15
`;

    const blob = new Blob([packContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faille_amethyste_setup.mcfunction';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section id="commandes" className="py-16 px-6 bg-[#0c0919] border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase">
              Guide de Réalisation en Jeu
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-cinzel tracking-tight">
              Générateur de Commandes & Datapack
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Toutes les lignes de code prêtes pour vos Blocs de Commande en Vanilla ou votre dossier <code className="text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded">datapacks/</code>. Aucune programmation complexe requise !
            </p>
          </div>

          {/* Quick download datapack button */}
          <button
            onClick={handleDownloadDatapack}
            className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Télécharger le .mcfunction Pack</span>
          </button>
        </div>

        {/* Interactive Customization Bar */}
        <div className="p-5 rounded-2xl bg-[#130f26] border border-purple-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Skin Joueur Kaelen (SkullOwner) :</span>
            </label>
            <input
              type="text"
              value={kaelenSkinOwner}
              onChange={(e) => setKaelenSkinOwner(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#0a0815] border border-purple-900/60 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400 font-mono"
              placeholder="Ex: EnderRogue, Kaelen, ..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Points de Vie d'Ignis Primus (HP) :</span>
            </label>
            <input
              type="number"
              value={bossHealthValue}
              onChange={(e) => setBossHealthValue(Number(e.target.value) || 650)}
              className="w-full px-3 py-1.5 text-xs bg-[#0a0815] border border-purple-900/60 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Volume des sons de carillon :</span>
            </label>
            <select
              value={gloveSoundVolume}
              onChange={(e) => setGloveSoundVolume(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#0a0815] border border-purple-900/60 rounded-lg text-purple-200 focus:outline-none focus:border-purple-400 font-mono"
            >
              <option value="1">1.0 (Standard)</option>
              <option value="2">2.0 (Immersion forte)</option>
              <option value="3">3.0 (Toute l'arène)</option>
            </select>
          </div>
        </div>

        {/* Category Filters (Clean Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-[#141029] text-slate-400 hover:text-slate-200 hover:bg-[#1d173b] border border-purple-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Command Cards List */}
        <div className="space-y-4">
          {filteredCommands.map(cmd => {
            const isCopied = copiedId === cmd.id;
            // Apply customized variables in preview
            let displayCmd = cmd.command;
            if (cmd.id === 'summon_kaelen') {
              displayCmd = displayCmd.replace(/SkullOwner:"[^"]*"/, `SkullOwner:"${kaelenSkinOwner}"`);
            } else if (cmd.id === 'echo_glove') {
              displayCmd = displayCmd.replace(/chime master @a ~ ~ ~ 2 1.2/, `chime master @a ~ ~ ~ ${gloveSoundVolume} 1.2`);
            } else if (cmd.id === 'ignis_primus_bossbar') {
              displayCmd = displayCmd.replace(/max 650/, `max ${bossHealthValue}`);
            }

            return (
              <div
                key={cmd.id}
                className="rounded-xl bg-[#110e24] border border-purple-900/50 overflow-hidden shadow-md space-y-0"
              >
                {/* Header bar */}
                <div className="px-5 py-3.5 bg-[#171230] border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white font-cinzel">
                      {cmd.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{cmd.description}</span>
                      <span>·</span>
                      <span className="text-purple-300 font-mono text-[11px]">{cmd.version}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(cmd.id, cmd.command)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap border ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                        : 'bg-purple-950/70 hover:bg-purple-900 text-purple-200 border-purple-700/50'
                    }`}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? "Copié !" : "Copier la commande"}</span>
                  </button>
                </div>

                {/* Code Block */}
                <div className="p-4 bg-[#0a0814] overflow-x-auto">
                  <pre className="text-xs font-mono text-purple-200/90 leading-relaxed whitespace-pre-wrap select-all">
                    {displayCmd}
                  </pre>
                </div>

                {/* Footnote explanation */}
                <div className="px-5 py-2.5 bg-[#0e0b1d] border-t border-purple-950 text-[11px] text-slate-400">
                  <span className="text-purple-400 font-semibold mr-1">Fonctionnement en jeu :</span>
                  {cmd.explanation}
                </div>
              </div>
            );
          })}
        </div>

        {/* Implementation Tips for Mods & Plugins */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-5 rounded-xl bg-[#120e24] border border-purple-900/50 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-300 font-cinzel">
              <Box className="w-4 h-4" />
              <span>Option 1 : En Vanilla Pur (Sans Mods)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Utilise les Blocs de Commande à Répétition (`Repeating Command Block` toujours actif) et les scoreboards intégrés. Aucune installation externe requise, compatible sur n'importe quel serveur ou monde solo Vanilla 1.20+.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#120e24] border border-purple-900/50 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-300 font-cinzel">
              <Layers className="w-4 h-4" />
              <span>Option 2 : Avec Plugins / Mods (Citizens & CustomNPCs)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Si vous préférez un vrai modèle vivant, installez le plugin <strong>Citizens 2</strong> pour créer le PNJ `/npc create Kaelen --type player` et le mod <strong>Custom NPCs</strong> ou <strong>Denizen</strong> pour lui assigner des scripts de patrouille et des voix personnalisées.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
