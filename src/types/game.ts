export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  dimension: 'Overworld' | 'Nether' | 'End' | 'Rift';
  environment: string;
  duration: string;
  objectives: string[];
  boss?: {
    name: string;
    title: string;
    hp: number;
    description: string;
    tactics: string[];
    image?: string;
  };
  gadgetUnlocked?: {
    name: string;
    description: string;
    icon: string;
    minecraftItem: string;
  };
  secrets: string[];
  loreSnippet: string;
}

export interface KaelenAbility {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  gameEffect: string;
  minecraftImplementation: string;
  cooldown: number;
  icon: string;
}

export interface Punchline {
  id: string;
  context: 'combat' | 'greeting' | 'boss' | 'puzzle' | 'victory';
  frenchText: string;
  audioTone: 'sarcastic' | 'urgent' | 'epic' | 'calm';
}

export interface MinecraftCommandSnippet {
  id: string;
  title: string;
  category: 'npc' | 'gadget' | 'boss' | 'dialogue' | 'effects';
  description: string;
  version: 'Java 1.20+' | 'Bedrock' | 'Both';
  command: string;
  explanation: string;
}

export interface CharacterProfile {
  id: string;
  name: string;
  title: string;
  dimensionOrigin: string;
  personalityTraits: string[];
  fullBackstory: string;
  hiddenSecret: string;
  personalMotivation: string;
  relationshipWithPlayer: string;
  signatureObject: string;
  catchphrase: string;
  currentMood: 'Serein' | 'Inquiet' | 'Protecteur' | 'Combatif' | 'Mélancolique' | 'Joyeux';
  image?: string;
}

export interface DialogueChoice {
  id: string;
  prompt: string;
  response: string;
  speakerMood: 'Serein' | 'Inquiet' | 'Protecteur' | 'Combatif' | 'Mélancolique' | 'Joyeux';
  affinityBonus: number;
  unlockedLoreNote?: string;
}

export interface CampfireConversation {
  id: string;
  topic: string;
  characterId: string;
  initialDialogue: string;
  choices: DialogueChoice[];
}
