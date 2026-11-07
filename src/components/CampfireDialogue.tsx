import React, { useState } from 'react';
import { CHARACTERS_PROFILES, CAMPFIRE_CONVERSATIONS } from '../data/adventureData';
import { CharacterProfile, CampfireConversation, DialogueChoice } from '../types/game';
import { Heart, MessageSquare, Volume2, Sparkles, Flame, Shield, User, Award, Eye, Compass } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const CampfireDialogue: React.FC = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>('kaelen');
  const [activeConversationId, setActiveConversationId] = useState<string>('kaelen_mask');
  const [chosenAnswer, setChosenAnswer] = useState<DialogueChoice | null>(null);
  const [soulAffinity, setSoulAffinity] = useState<number>(60);
  const [unlockedNotes, setUnlockedNotes] = useState<string[]>([
    "Kaelen a accepté de partager un feu de camp avec vous. Il commence à baisser la garde."
  ]);
  const [voltInteractionState, setVoltInteractionState] = useState<string>("Volt est assise sur une bûche et vous observe avec curiosité.");

  const currentProfile = CHARACTERS_PROFILES.find(p => p.id === selectedCharacterId) || CHARACTERS_PROFILES[0];
  const currentConversation = CAMPFIRE_CONVERSATIONS.find(c => c.id === activeConversationId) || CAMPFIRE_CONVERSATIONS[0];

  const handleChooseAnswer = (choice: DialogueChoice) => {
    setChosenAnswer(choice);
    setSoulAffinity(prev => Math.min(100, prev + choice.affinityBonus));

    if (choice.unlockedLoreNote && !unlockedNotes.includes(choice.unlockedLoreNote)) {
      setUnlockedNotes(prev => [choice.unlockedLoreNote!, ...prev]);
    }

    soundFx.playAmethystChime(1.4);
    soundFx.speakPunchline(choice.response);
  };

  const handleVoltAction = (action: 'caresser' | 'nourrir' | 'écouter') => {
    if (action === 'caresser') {
      soundFx.playFrogRibbit();
      setVoltInteractionState("Volt ferme les yeux et ronronne en vibrant d'une onde tiède bienfaisante.");
      setSoulAffinity(prev => Math.min(100, prev + 5));
    } else if (action === 'nourrir') {
      soundFx.playMine();
      setVoltInteractionState("Volt gobe la poussière d'améthyste avec un bond acrobatique et clignote en vert jade !");
      setSoulAffinity(prev => Math.min(100, prev + 5));
    } else {
      soundFx.playAmethystChime(1.8);
      setVoltInteractionState("Volt incline la tête et émet trois notes douces : elle sent que votre cœur est pur.");
    }
  };

  return (
    <section id="personnages" className="py-16 px-6 bg-[#090713] border-t border-purple-900/40">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-purple-400 tracking-wider uppercase flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Âmes & Vies de la Faille</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-cinzel tracking-tight">
              Des Personnages à Part Entière
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl">
              Ici, vos compagnons ne sont pas des pantins de pixels. Ils ont des traumatismes, des rêves inavoués, un passé intime et réagissent à vos choix de dialogue autour du feu d'améthyste.
            </p>
          </div>

          {/* Soul Affinity Meter */}
          <div className="p-3.5 rounded-xl bg-[#140e28] border border-purple-800/60 flex items-center gap-3">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
            <div>
              <div className="text-[11px] text-slate-400 font-mono">Lien d'Âme avec Kaelen & Volt</div>
              <div className="flex items-center gap-2">
                <div className="w-28 h-2.5 bg-black/60 rounded-full overflow-hidden border border-purple-900">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${soulAffinity}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
                  {soulAffinity}% · {soulAffinity >= 80 ? "Âmes Sœurs" : soulAffinity >= 50 ? "Frères d'Armes" : "Compagnons"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Campfire Visual Banner & Interactive Story Engine */}
        <div className="rounded-2xl overflow-hidden bg-[#120d26] border border-purple-800/50 shadow-2xl">
          {/* Campfire Illustration */}
          <div className="relative">
            <img
              src="/src/assets/images/campfire_companions_1794054290339.jpg"
              alt="Veillée au feu de camp d'améthyste avec Kaelen et Volt"
              referrerPolicy="no-referrer"
              className="w-full aspect-[21/9] sm:aspect-[16/7] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#120d26] via-[#120d26]/40 to-transparent" />

            {/* In-scene Caption */}
            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-purple-800/40">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Veillée au Bivouac des Failles · Échange au crépuscule d'améthyste</span>
              </div>
              <button
                onClick={() => {
                  soundFx.playAmethystChime(1.2);
                  soundFx.speakPunchline("Les étoiles brillent d'une étrange lueur ce soir. Prends place près du feu, gamin.");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700/50 text-purple-200 hover:text-white transition-colors cursor-pointer text-xs"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Écouter le feu crépiter</span>
              </button>
            </div>
          </div>

          {/* Interactive Dialogue Module */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-purple-900/40 pb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <h3 className="text-base font-bold text-white font-cinzel">
                  Discussion au coin du feu avec vos alliés
                </h3>
              </div>

              {/* Conversation Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                {CAMPFIRE_CONVERSATIONS.map(conv => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversationId(conv.id);
                      setChosenAnswer(null);
                      soundFx.playAmethystChime(1.3);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                      activeConversationId === conv.id
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-[#1a1336] text-slate-300 hover:bg-[#251b4c] border border-purple-900/60'
                    }`}
                  >
                    {conv.topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Scene Box */}
            <div className="p-5 rounded-xl bg-[#0c0819] border border-purple-900/60 space-y-4">
              <p className="text-sm text-slate-300 italic leading-relaxed">
                {currentConversation.initialDialogue}
              </p>

              {/* Choices Buttons */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                  Votre réaction ou réponse :
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentConversation.choices.map(choice => {
                    const isSelected = chosenAnswer?.id === choice.id;

                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleChooseAnswer(choice)}
                        className={`p-3.5 rounded-xl text-left transition-all border cursor-pointer text-xs sm:text-sm ${
                          isSelected
                            ? 'bg-purple-900/50 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                            : 'bg-[#150f2e] text-slate-300 border-purple-900/50 hover:bg-[#1e1542] hover:border-purple-700 hover:text-white'
                        }`}
                      >
                        <div className="font-medium">{choice.prompt}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Feedback readout */}
              {chosenAnswer && (
                <div className="p-4 rounded-xl bg-[#181136] border-l-4 border-amber-400 space-y-2 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300 font-cinzel">
                      {currentConversation.characterId === 'kaelen' ? 'Kaelen' : 'Volt'} (Humeur : {chosenAnswer.speakerMood})
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      +{chosenAnswer.affinityBonus}% Affinité
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-purple-200 leading-relaxed italic">
                    {chosenAnswer.response}
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Volt Nurturing Mini-Box */}
            <div className="p-4 rounded-xl bg-[#0f0b21] border border-emerald-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300 font-cinzel">Volt la Sentinelle (Compagnon Vivant)</div>
                  <div className="text-xs text-slate-300 mt-0.5">{voltInteractionState}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleVoltAction('caresser')}
                  className="px-3 py-1.5 text-xs font-medium text-emerald-200 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  Caresser
                </button>
                <button
                  onClick={() => handleVoltAction('nourrir')}
                  className="px-3 py-1.5 text-xs font-medium text-amber-200 bg-amber-950/60 hover:bg-amber-900 border border-amber-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  Donner du quartz
                </button>
                <button
                  onClick={() => handleVoltAction('écouter')}
                  className="px-3 py-1.5 text-xs font-medium text-purple-200 bg-purple-950/60 hover:bg-purple-900 border border-purple-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  Écouter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery of Souls: Deep character biographies */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
              Galerie des Âmes : Les 4 Piliers Vivants
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Sélectionnez un personnage pour explorer ses blessures passées, sa personnalité et ses motivations intimes.
            </p>
          </div>

          {/* Character Selector Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CHARACTERS_PROFILES.map(profile => {
              const isSelected = profile.id === selectedCharacterId;

              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    setSelectedCharacterId(profile.id);
                    soundFx.playAmethystChime(1.3);
                  }}
                  className={`p-4 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#1e153d] border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                      : 'bg-[#110d24] border-purple-950 hover:bg-[#181232] hover:border-purple-800'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-amber-400" />
                  )}
                  <div className="text-sm font-bold text-white font-cinzel line-clamp-1">
                    {profile.name}
                  </div>
                  <div className="text-xs text-purple-300 truncate mt-0.5">
                    {profile.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    Humeur : <span className="text-emerald-400">{profile.currentMood}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Deep Bio Card for Selected Character */}
          <div className="rounded-2xl bg-[#130d2a] border border-purple-800/50 p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-purple-900/40">
              <div>
                <div className="text-xs text-purple-400 font-mono">Origine : {currentProfile.dimensionOrigin}</div>
                <h4 className="text-2xl font-bold text-white font-cinzel mt-1">
                  {currentProfile.name} — <span className="text-purple-300 font-normal">{currentProfile.title}</span>
                </h4>
                <div className="text-xs text-slate-400 mt-1 italic">
                  {currentProfile.catchphrase}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {currentProfile.personalityTraits.map((trait, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded bg-[#0d091d] text-slate-300 border border-purple-900/60 font-mono">
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Full Backstory & Motivation */}
              <div className="lg:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-cinzel">
                    L'Histoire Vécue & Les Cicatrices
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentProfile.fullBackstory}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider font-cinzel">
                    Sa Motivation Personnelle
                  </div>
                  <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
                    {currentProfile.personalMotivation}
                  </p>
                </div>
              </div>

              {/* Right Column: Hidden Secret & Signature Object */}
              <div className="lg:col-span-4 space-y-4 bg-[#0c081c] p-5 rounded-xl border border-purple-900/40">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Secret Inavoué</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    « {currentProfile.hiddenSecret} »
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-950 space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">
                    Objet Signature :
                  </div>
                  <div className="text-xs text-purple-300 font-medium">
                    {currentProfile.signatureObject}
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-950 space-y-1">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">
                    Lien avec le Joueur :
                  </div>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    {currentProfile.relationshipWithPlayer}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
