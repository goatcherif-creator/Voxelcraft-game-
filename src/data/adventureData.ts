import { Chapter, KaelenAbility, Punchline, MinecraftCommandSnippet, CharacterProfile, CampfireConversation } from '../types/game';

export const ADVENTURE_METADATA = {
  title: "Les Chroniques de la Faille d'Améthyste",
  subtitle: "Map Aventure & Donjons Minecraft RPG",
  genre: "Action-Aventure / RPG / Donjons",
  duration: "2 à 3 heures",
  targetVersion: "Minecraft Java 1.20+ / Bedrock",
  pitch: "Une catastrophe mystique a brisé l'équilibre dimensionnel. Des fragments du Nether et de l'End s'effondrent directement dans le monde normal (Overworld). Pour sceller la Faille Primordiale, rassemblez les trois artefacts anciens gardés par des créatures corrompues.",
  heroName: "L'Élu de l'Écho",
  companionName: "Kaelen, le Vagabond des Failles",
  frogName: "Volt"
};

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 1,
    title: "Chapitre 1 : Le Réveil au Village Cristallisé",
    subtitle: "L'aube pourpre et l'éveil des échos",
    dimension: "Overworld",
    environment: "Village médiéval figé par d'immenses géodes d'améthyste violettes et des ruines de pierre moussue.",
    duration: "30-40 min",
    objectives: [
      "Survivre à la horde initiale de zombies corrompus avec l'aide spectaculaire de Kaelen.",
      "Explorer la Crypte du Clocher pour débloquer le Gant d'Écho.",
      "Résoudre l'énigme des 3 diapasons d'améthyste résonnants.",
      "Obtenir le premier éclat d'artefact : Le Prisme de Stase."
    ],
    gadgetUnlocked: {
      name: "Le Gant d'Écho",
      description: "Permet de déclencher une impulsion sonore résonnante pour activer les mécanismes sculk/améthyste distants et étourdir les créatures corrompues.",
      icon: "Sparkles",
      minecraftItem: "Carrot on a Stick (CustomModelData: 1001) + Sculk Sensor sound"
    },
    secrets: [
      "Coffre caché derrière la cascade cristallisée du moulin à eau (Loot: Pomme dorée enchantée).",
      "Journal du villageois érudit n°1 révélant l'origine de la faille sous le puits."
    ],
    loreSnippet: "Le temps semble s'être arrêté. Les habitants du village sont figés sous une coque de quartz pourpre. Seul Kaelen semble savoir pourquoi vous êtes le seul encore conscient."
  },
  {
    id: 2,
    title: "Chapitre 2 : La Mer de Lave Flottante",
    subtitle: "La collision du Nether et des Abysses",
    dimension: "Nether",
    environment: "Océan survolé par des îlots de roche du Nether en apesanteur. Cascades d'eau et de lave s'entrecroisant pour former des ponts d'obsidienne éphémères.",
    duration: "45-55 min",
    objectives: [
      "Traverser l'archipel magmatique instable grâce au Grappin Cinétique de Kaelen.",
      "Activer les leviers de régulation thermique synchronisés (coopération Kaelen / Joueur).",
      "Triompher du Colosse de Magma : L'Ignis Primus.",
      "Récupérer le deuxième éclat : Le Cœur de Basalte."
    ],
    boss: {
      name: "L'Ignis Primus",
      title: "Colosse de Magma & Gardien du Fléau Flamboyant",
      hp: 650,
      description: "Un titan forgé de basalte noir et de magma incandescent, armé d'un fléau d'obsidienne enflammé qui pulvérise le terrain.",
      tactics: [
        "Kaelen utilise sa Lame-Flash pour attirer le regard du colosse et esquiver ses frappes de fléau.",
        "Frappez les failles de lave refroidie dans son dos avec le Gant d'Écho pour briser sa carapace.",
        "Évitez les flaques de lave projetées lors de ses écrasements au sol."
      ],
      image: "/src/assets/images/ignis_primus_boss_1794053202543.jpg"
    },
    secrets: [
      "Île secrète de lave noire accessible uniquement par un tir de grappin aérien (Loot: Plastron de Netherite incrusté d'améthyste).",
      "Fossile de Ghast géant renfermant une rune d'agilité pour Volt."
    ],
    loreSnippet: "L'eau bout instantanément au contact des blocs de magma tombés du Nether. Si la faille s'étend encore, les océans du monde entier s'évaporeront."
  },
  {
    id: 3,
    title: "Chapitre 3 : La Forteresse Suspendue",
    subtitle: "L'ombre céleste et le vide murmurant",
    dimension: "End",
    environment: "Cité de l'End arrachée à sa dimension d'origine, flottant entre nuages d'orage et vortex gravitationnels.",
    duration: "40-50 min",
    objectives: [
      "Démasquer les Rôdeurs Invisibles du Vide révélés uniquement par la lueur de Volt la grenouille.",
      "Orienter les prismes de réfraction pour diriger les rayons des balises (Beacons) vers la porte runique.",
      "Désamorcer le réseau de dalles piégées en suivant les pas holographiques de Kaelen.",
      "Récupérer le troisième éclat : L'Œil de la Singularité."
    ],
    secrets: [
      "Navire de l'End semi-matérialisé au sommet d'une flèche rocheuse contenant une cape d'ailes d'ombre.",
      "Salle des archives de l'End avec les transcriptions des Gardiens de la Faille."
    ],
    loreSnippet: "Volt n'est pas une simple grenouille : ses yeux perçoivent les distorsions de phase de l'End. Sans elle, vous seriez la proie de monstres que nul ne peut voir."
  },
  {
    id: 4,
    title: "Chapitre 4 : La Faille Primordiale",
    subtitle: "Le cataclysme au cœur du réel",
    dimension: "Rift",
    environment: "Le point de rupture de l'univers : un vortex infini où ciel, lave, cristaux et roches flottent dans une spirale chaotique.",
    duration: "45-60 min",
    objectives: [
      "Phase 1 : Esquiver les chutes de météores dimensionnels et réparer le socle des trois artefacts.",
      "Phase 2 : Déployer les élytres d'ombre propulsées par Kaelen pour un combat aérien à 360°.",
      "Phase Finale : Transpercer le Cœur de la Faille avant l'effondrement total de l'Overworld."
    ],
    boss: {
      name: "L'Ombre du Vide",
      title: "Entité Cosmique & Briseur de Réalités",
      hp: 1000,
      description: "Une silhouette colossale d'antimatière capable de désintégrer les blocs sous vos pieds et d'invoquer des tentacules d'Ender.",
      tactics: [
        "Glissez dans les courants ascendants créés par Kaelen pour atteindre les points faibles orbitaux.",
        "Utilisez le Gant d'Écho à courte portée pour dissiper son bouclier dimensionnel.",
        "Effectuez un piqué d'élytres final synchronisé avec Kaelen."
      ]
    },
    secrets: [
      "Fin secrète : Si tous les échos d'améthyste des 3 chapitres ont été scellés, Kaelen survit sans perdre ses ailes.",
      "Trophée 'Maître des Failles' décerné dans la salle d'hommage finale."
    ],
    loreSnippet: "« Si nous échouons, il n'y aura plus ni Nether, ni End, ni Overworld... juste le néant. Alors prépare ton épée, gamin. On a un univers à recoudre. » — Kaelen"
  }
];

export const KAELEN_ABILITIES: KaelenAbility[] = [
  {
    id: "lame_flash",
    name: "Flash-Blade",
    nameFr: "La Lame-Flash",
    description: "Kaelen se téléporte instantanément dans le dos de la cible en laissant un vortex d'Ender et inflige un coup critique dévastateur.",
    gameEffect: "Téléportation instantanée + 120 dégâts critiques de zone + particules d'Ender violettes.",
    minecraftImplementation: "/execute at @p ... tp @e[tag=Kaelen] ^ ^ ^3 facing entity @e[type=!player] run particle reverse_portal ~ ~1 ~ 0.2 0.5 0.2 0.05 40",
    cooldown: 8,
    icon: "Zap"
  },
  {
    id: "grappin_cinetique",
    name: "Kinetic Grapple",
    nameFr: "Le Grappin Cinétique",
    description: "Déploie un câble énergétique qui tire Kaelen et le joueur vers un point d'ancrage lointain ou immobilise les monstres.",
    gameEffect: "Traverse les précipices de lave/vide + attire les ennemis distants.",
    minecraftImplementation: "Détection via scoreboard useItem.minecraft.fishing_rod + impulsion Motion:[x,y,z] vers la cible.",
    cooldown: 5,
    icon: "Anchor"
  },
  {
    id: "volt_detection",
    name: "Volt's Luminescence",
    nameFr: "Luminescence de Volt",
    description: "Volt, la petite grenouille d'améthyste posée sur son épaule, pulse d'une bioluminescence vive qui révèle pièges et ennemis furtifs.",
    gameEffect: "Vision nocturne + surbrillance rouge des monstres invisibles + désamorçage de pièges.",
    minecraftImplementation: "/effect give @e[tag=ShadowLurker,distance=..15] glowing 5 1 true + son de grenouille customisé.",
    cooldown: 12,
    icon: "Eye"
  },
  {
    id: "ailes_d_ombre",
    name: "Shadow Wings",
    nameFr: "Les Ailes d'Ombre",
    description: "Kaelen déploie des élytres customisées translucides aux reflets d'Ender pour vous propulser dans les airs lors des phases de boss.",
    gameEffect: "Lévitation contrôlée + propulsion de vol plané cinématique.",
    minecraftImplementation: "/item replace entity @p armor.chest with elytra{Unbreakable:1b,Enchantments:[{id:\"mending\",lvl:1}]} + boost de feux d'artifice silencieux.",
    cooldown: 20,
    icon: "Feather"
  }
];

export const KAELEN_PUNCHLINES: Punchline[] = [
  {
    id: "p1",
    context: "greeting",
    frenchText: "Bienvenue à la fin du monde, gamin. Essaie de ne pas cligner des yeux.",
    audioTone: "sarcastic"
  },
  {
    id: "p2",
    context: "combat",
    frenchText: "Tu appelles ça frapper ? Attends, regarde un peu ce que sait faire un vrai Vagabond !",
    audioTone: "epic"
  },
  {
    id: "p3",
    context: "boss",
    frenchText: "Ce tas de lave a l'air fâché. J'attire son regard, toi vise les fissures dans son dos !",
    audioTone: "urgent"
  },
  {
    id: "p4",
    context: "puzzle",
    frenchText: "Volt fait une drôle de tête. Ne pose pas le pied sur cette dalle si tu tiens à tes orteils.",
    audioTone: "sarcastic"
  },
  {
    id: "p5",
    context: "victory",
    frenchText: "Pas mal pour un débutant. Mais range pas ton épée, la faille ne fait que s'échauffer.",
    audioTone: "epic"
  },
  {
    id: "p6",
    context: "combat",
    frenchText: "Lame-Flash prête ! Cligne des yeux et ils seront déjà en poussière d'Ender.",
    audioTone: "epic"
  }
];

export const MINECRAFT_COMMANDS: MinecraftCommandSnippet[] = [
  {
    id: "summon_kaelen",
    title: "1. Invocation de Kaelen (Armor Stand avec Skin & Runes)",
    category: "npc",
    version: "Java 1.20+",
    description: "Invoque le compagnon Kaelen avec armure noire enchantée, tête customisée, insensibilité aux dégâts et tags requis.",
    command: `/summon armor_stand ~ ~ ~ {Tags:["Kaelen","Companion","Ally"],CustomName:'{"text":"Kaelen, le Vagabond","color":"dark_purple","bold":true}',CustomNameVisible:1b,ShowArms:1b,NoBasePlate:1b,Pose:{RightArm:[-15f,0f,355f],LeftArm:[-10f,0f,10f]},ArmorItems:[{id:"minecraft:netherite_boots",Count:1b,tag:{Enchantments:[{id:"protection",lvl:4}]}},{id:"minecraft:leather_leggings",Count:1b,tag:{display:{color:1908001}}},{id:"minecraft:leather_chestplate",Count:1b,tag:{display:{color:1114129},Enchantments:[{id:"unbreaking",lvl:3}]}},{id:"minecraft:player_head",Count:1b,tag:{SkullOwner:"EnderRogue"}}],HandItems:[{id:"minecraft:netherite_sword",Count:1b,tag:{display:{Name:'{"text":"Lame-Flash d\'Améthyste","color":"light_purple"}'}}},{}],Invulnerable:1b}`,
    explanation: "Crée un porte-armure personnalisé nommé Kaelen avec des bras, une épée et des armures teintées d'obsidienne sombre."
  },
  {
    id: "echo_glove",
    title: "2. Le Gant d'Écho (Détection de Clic Droit & Carotte sur bâton)",
    category: "gadget",
    version: "Java 1.20+",
    description: "Donne l'item du Gant d'Écho au joueur et initialise le scoreboard de détection de clic droit.",
    command: `# Étape 1 : Créer le scoreboard
/scoreboard objectives add use_echo_glove minecraft.used:minecraft.carrot_on_a_stick "Gant d'Écho"

# Étape 2 : Donner l'item légendaire au joueur
/give @p carrot_on_a_stick{CustomModelData:1001,display:{Name:'{"text":"Gant d\'Écho Résonnant","color":"light_purple","bold":true}',Lore:['{"text":"Déclenche une impulsion acoustique pour","color":"gray"}','{"text":"activer les mécanismes et étourdir les ombres.","color":"dark_purple"}' ]},EchoGlove:1b} 1

# Étape 3 : Boucle de commande (dans bloc répétition toujours actif)
/execute at @a[scores={use_echo_glove=1..}] run playsound minecraft:block.amethyst_block.chime master @a ~ ~ ~ 2 1.2
/execute at @a[scores={use_echo_glove=1..}] run particle minecraft:sculk_charge_pop ~ ~1 ~ 0.5 0.5 0.5 0.05 50
/execute at @a[scores={use_echo_glove=1..}] as @e[type=!player,distance=..6] run effect give @s slowness 4 2 true
/scoreboard players reset @a[scores={use_echo_glove=1..}] use_echo_glove`,
    explanation: "Le joueur clique droit avec la carotte sur bâton customisée. La boucle détecte l'usage, joue le son cristallin d'améthyste, génère des particules de sculk et ralentit les ennemis proches."
  },
  {
    id: "kinetic_grapple",
    title: "3. Le Grappin Cinétique (Canne à pêche & Vélocité)",
    category: "gadget",
    version: "Java 1.20+",
    description: "Permet de se propulser rapidement vers le bouchon de la canne à pêche pour franchir les précipices.",
    command: `# Scoreboard de détection
/scoreboard objectives add use_rod minecraft.used:minecraft.fishing_rod

# Commande de téléportation cinétique vers le flotteur
/execute as @a[scores={use_rod=1..}] at @s run execute as @e[type=fishing_bobber,distance=..35] run tp @p ^ ^1 ^3 facing entity @s
/execute as @a[scores={use_rod=1..}] at @s run playsound minecraft:entity.arrow.shoot player @s ~ ~ ~ 1 1.8
/execute as @a[scores={use_rod=1..}] at @s run particle minecraft:portal ~ ~1 ~ 0.3 0.3 0.3 0.1 20
/scoreboard players reset @a[scores={use_rod=1..}] use_rod`,
    explanation: "Dès que le joueur lance son bouchon, la commande tire le joueur dans la direction avec un effet sonore d'arbalète et un halo de portail."
  },
  {
    id: "lame_flash_teleport",
    title: "4. Lame-Flash de Kaelen (Attaque combinée téléportée)",
    category: "boss",
    version: "Java 1.20+",
    description: "Téléporte Kaelen instantanément derrière le mob ciblé par le joueur avec explosion de particules.",
    command: `/execute as @p at @s run tp @e[tag=Kaelen,limit=1] @e[type=!player,type=!armor_stand,distance=..15,sort=nearest]
/execute at @e[tag=Kaelen] run particle minecraft:reverse_portal ~ ~1 ~ 0.4 0.8 0.4 0.1 60
/execute at @e[tag=Kaelen] run playsound minecraft:entity.enderman.teleport master @a ~ ~ ~ 2 1.4
/execute at @e[tag=Kaelen] as @e[type=!player,type=!armor_stand,distance=..3] run damage @s 15 minecraft:magic by @e[tag=Kaelen,limit=1]`,
    explanation: "Kaelen traverse le vide et réapparaît dans le dos du monstre le plus proche, déclenchant des dégâts magiques élevés et l'effet de téléportation d'Enderman."
  },
  {
    id: "ignis_primus_bossbar",
    title: "5. Bossbar & Arène d'Ignis Primus",
    category: "boss",
    version: "Java 1.20+",
    description: "Met en place la barre de vie du Boss Colosse de Magma avec couleur rouge et segments de phase.",
    command: `# Créer la Bossbar
/bossbar add ignis_primus {"text":"Ignis Primus - Colosse du Fléau Flamboyant","color":"red","bold":true}
/bossbar set ignis_primus color red
/bossbar set ignis_primus style segmented_10
/bossbar set ignis_primus max 650
/bossbar set ignis_primus players @a

# Synchroniser la barre avec la santé du Boss
/execute store result bossbar ignis_primus value run data get entity @e[tag=IgnisPrimus,limit=1] Health`,
    explanation: "Affiche à l'écran de tous les joueurs la barre de boss stylisée divisée en 10 segments pour suivre le combat."
  },
  {
    id: "kaelen_tellraw_punchlines",
    title: "6. Moteur de Dialogue Tellraw Stylisé de Kaelen",
    category: "dialogue",
    version: "Both",
    description: "Formatte les dialogues textuels de Kaelen en jeu avec couleur améthyste, icône et bruitages.",
    command: `/tellraw @a [{"text":"[","color":"gray"},{"text":"KAELEN","color":"dark_purple","bold":true},{"text":"] ","color":"gray"},{"text":"« Bienvenue à la fin du monde, gamin. Essaie de ne pas cligner des yeux. »","color":"light_purple","italic":true}]
/playsound minecraft:block.amethyst_cluster.hit player @a ~ ~ ~ 1 0.8`,
    explanation: "Affiche un message stylisé dans le chat Minecraft et joue le tintement cristallin signature de Kaelen."
  }
];

export const CHARACTERS_PROFILES: CharacterProfile[] = [
  {
    id: "kaelen",
    name: "Kaelen",
    title: "L'Écorché des Failles",
    dimensionOrigin: "L'Ancienne Citadelle d'Obsidienne (End Originel)",
    personalityTraits: ["Sarcastique", "Protecteur dévoué", "Plein d'esprit", "Secret", "Traumatisé par son passé"],
    fullBackstory: "Avant que la Faille ne déchire le monde, Kaelen était le Premier Lame des Chevaliers du Vide dans une cité prospère de l'End. Lorsque l'équilibre cosmique s'est brisé, il a tenté d'arracher son jeune frère Elyon à l'aspiration de la singularité. La déflagration a incrusté un éclat d'améthyste dans son œil droit et calciné la moitié de son visage sous de l'obsidienne en fusion. Elyon a disparu dans le néant. Depuis ce jour, Kaelen erre d'un monde à l'autre sous son masque, dissimulant sa douleur sous un humour grinçant et des punchlines acerbes. Lorsqu'il vous a trouvé éveillé dans le village pétrifié, il a juré qu'il ne laisserait pas l'histoire se répéter.",
    hiddenSecret: "Il conserve dans une doublure de son manteau un minuscule cristal de souvenir contenant les derniers rires de son frère disparu.",
    personalMotivation: "Sceller la Faille Primordiale pour empêcher que d'autres vies ne soient broyées par le néant, et peut-être retrouver la trace d'Elyon de l'autre côté.",
    relationshipWithPlayer: "Votre allié inébranlable. Il vous appelle 'Gamin' par affection protectrice, mais vous considère en secret comme le seul être capable d'accomplir ce qu'il a lui-même raté.",
    signatureObject: "La Lame-Flash d'Améthyste & Élytres en lambeaux d'ombre",
    catchphrase: "« Bienvenue à la fin du monde, gamin. Essaie de ne pas cligner des yeux. »",
    currentMood: "Combatif",
    image: "/src/assets/images/kaelen_portrait_1794053201894.jpg"
  },
  {
    id: "volt",
    name: "Volt",
    title: "La Sentinelle Céleste",
    dimensionOrigin: "Géode Primordiale de l'Overworld Profond",
    personalityTraits: ["Empathique", "Gourmande", "Alerte", "Espiègle", "Curieuse"],
    fullBackstory: "Volt n'a rien d'une grenouille ordinaire. Elle a éclos d'une perle d'Ender fossilisée au cœur d'une géode géante infusée par une résonance de sculk et d'améthyste. C'est Kaelen qui l'a découverte alors qu'elle n'était pas plus grosse qu'un bouton de manchette. Dotée d'une sensibilité sensorielle prodigieuse, Volt ne se contente pas de coasser : elle émet des vibrations harmoniques qui déphasent les créatures invisibles du Vide. Posée sur l'épaule de Kaelen, elle est le baromètre émotionnel du groupe. Quand elle s'affole, le danger est imminent ; quand elle se blottit contre vous, vous savez que vous êtes en sécurité.",
    hiddenSecret: "Elle s'endort instantanément si vous lui frottez doucement le sommet du crâne avec un éclat d'améthyste tiède.",
    personalMotivation: "Protéger Kaelen du désespoir et dénicher les rarissimes lucioles de quartz scintillantes.",
    relationshipWithPlayer: "Elle vous a adopté dès votre réveil. Elle adore sauter sur votre casque pour contempler les étoiles quand le campement est calme.",
    signatureObject: "Bioluminescence Émeraude d'End",
    catchphrase: "« Coââk ! (Traduction : 'Fais gaffe, les ombres bougent derrière la roche !') »",
    currentMood: "Joyeux"
  },
  {
    id: "elidor",
    name: "Maître Elidor",
    title: "L'Alchimiste au Cœur de Quartz",
    dimensionOrigin: "Village Cristallisé (Overworld)",
    personalityTraits: ["Rongé par le remords", "Érudit passionné", "Dévoué au savoir", "Mélancolique"],
    fullBackstory: "Ancien horloger et doyen de la guilde alchimique du village, Elidor croyait pouvoir canaliser l'énergie des géodes pour alimenter des mécanismes perpétuels. C'est son diapason harmonique expérimental qui a fissuré le tissu dimensionnel local, figeant tous ses voisins dans le quartz pourpre. À demi pétrifié lui-même au sommet du clocher, son esprit subsiste dans les fréquences de la Crypte. À travers le Gant d'Écho qu'il vous a légué, sa voix résonne dans votre esprit pour vous guider et tenter d'expier sa terrible erreur.",
    hiddenSecret: "Il a caché sous le dallage de sa forge une lettre d'amour adressée à la forgeronne Vanya, qu'il n'a jamais osé lui remettre avant la catastrophe.",
    personalMotivation: "Délivrer les villageois de leur gangue de quartz et briser les diapasons avant que le gel temporel ne devienne irréversible.",
    relationshipWithPlayer: "Il vous perçoit comme son ultime rédemption et vous transmet les secrets technologiques des anciens.",
    signatureObject: "Le Gant d'Écho & Diapason d'Orpur",
    catchphrase: "« Écoute le chant des pierres, voyageur... Elles se souviennent de tout ce que les vivants ont oublié. »",
    currentMood: "Mélancolique"
  },
  {
    id: "vanya",
    name: "Vanya la Forgeuse",
    title: "L'Enclume des Cendres",
    dimensionOrigin: "Les Bastions de Basalte (Nether)",
    personalityTraits: ["Franche", "Indomptable", "Généreuse", "Passionnée d'acier", "Protectrice"],
    fullBackstory: "Née au milieu des cascades de lave et de basalte, Vanya a survécu seule dans le Nether en apprenant à forger la Netherite brute sans recourir aux pactes des Piglins. Lorsque l'océan de l'Overworld a commencé à s'effondrer au-dessus des lacs de feu, elle a construit les premiers ancrages de grappin cinétique pour sauver les réfugiés des îles flottantes. Armée d'un marteau d'obsidienne trempé dans l'eau des abysses, elle ne mâche pas ses mots mais risquerait sa vie pour n'importe quel opprimé.",
    hiddenSecret: "Elle a gravé sur son marteau le nom de chaque compagnon qu'elle n'a pas pu sauver lors de la collision magmatique.",
    personalMotivation: "Stabiliser les cascades thermiques et forger les armures nécessaires pour survivre dans le Vide.",
    relationshipWithPlayer: "Une grande sœur d'armes bienveillante qui tape sur l'épaule et vous glisse des pommes dorées en douce.",
    signatureObject: "Le Marteau de Basalte Cryogénisé",
    catchphrase: "« Si ça résiste pas à la lave, c'est que ça mérite pas d'être porté ! Frappe fort et garde la tête froide. »",
    currentMood: "Combatif"
  }
];

export const CAMPFIRE_CONVERSATIONS: CampfireConversation[] = [
  {
    id: "kaelen_mask",
    topic: "Le mystère du masque d'obsidienne",
    characterId: "kaelen",
    initialDialogue: "Kaelen remue les braises pourpres du feu de camp avec la pointe de sa lame. Le reflet violet de son œil scintille sur l'obsidienne fendue de son masque. « Tu me fixes, gamin. Tu veux savoir pourquoi je cache ma tête sous un caillou volcanique, c'est ça ? »",
    choices: [
      {
        id: "c1_empathy",
        prompt: "« Seulement si tu es prêt à en parler. On combat ensemble, j'aimerais te connaître. »",
        response: "Kaelen pousse un soupir doux, presque surpris par votre respect. « Mon frère Elyon... Il était tout ce qu'il me restait quand la Citadelle de l'End s'est effondrée. J'ai plongé dans le vortex pour retenir sa main. Mais la singularité dévore tout. Le choc m'a laissé ce visage de pierre et cette marque d'améthyste... mais lui, je ne l'ai pas rattrapé. Depuis, ce masque me rappelle chaque seconde pourquoi je ne dois plus jamais faiblir. »",
        speakerMood: "Mélancolique",
        affinityBonus: 25,
        unlockedLoreNote: "Kaelen s'est ouvert sur la disparition de son frère Elyon. Votre lien d'âme est renforcé !"
      },
      {
        id: "c1_taunt",
        prompt: "« C'est surtout pour impressionner les monstres ou tu as peur qu'on te trouve trop beau ? »",
        response: "Un petit rire sec lui échappe, brisant la tension. « Haha ! Bien envoyé, gamin. Disons qu'avec cette tête-là, les zombies hésitent deux fois avant d'approcher. Mais trêve de bavardages, repose tes jambes. La lave de demain ne va pas nous attendre. »",
        speakerMood: "Serein",
        affinityBonus: 15
      },
      {
        id: "c1_pragmatic",
        prompt: "« Ce qui m'importe, c'est que tes réflexes tiennent le coup face aux boss. »",
        response: "« Mes réflexes ? Tu as vu ma Lame-Flash ? Je suis plus rapide que la lumière de l'End. Ne t'inquiète pas pour moi, gamin. Concentre-toi sur tes esquives. »",
        speakerMood: "Combatif",
        affinityBonus: 10
      }
    ]
  },
  {
    id: "volt_origin",
    topic: "La rencontre avec Volt la grenouille",
    characterId: "volt",
    initialDialogue: "Volt saute soudainement depuis une bûche et vient atterrir sur vos genoux. Ses petits yeux ronds d'un vert jade lumineux clignent avec curiosité. Elle incline la tête et émet un gargouillis cristallin qui résonne comme une flûte d'améthyste.",
    choices: [
      {
        id: "c2_pet",
        prompt: "Lui caresser doucement le dessus de la tête avec un éclat d'améthyste tiède.",
        response: "Volt ferme les yeux de bonheur, émettant un ronronnement vibrant qui diffuse une douce chaleur apaisante dans vos mains. Kaelen sourit discrètement au loin : « Elle t'a complètement adopté. Fais gaffe, elle va réclamer tes rations de pommes dorées ! »",
        speakerMood: "Joyeux",
        affinityBonus: 20,
        unlockedLoreNote: "Volt a tissé une résonance d'harmonie avec vous. Sa luminescence dure plus longtemps en donjon !"
      },
      {
        id: "c2_feed",
        prompt: "Lui offrir une pincée de poussière de quartz brillant ramassée au sol.",
        response: "D'un coup de langue fulgurant et précis, Volt gobe la poussière scintillante ! Son dos bioluminescent s'illumine d'un éclat émeraude flamboyant, projetant des reflets de constellations sur les rochers environnants.",
        speakerMood: "Joyeux",
        affinityBonus: 15
      },
      {
        id: "c2_listen",
        prompt: "Tendre l'oreille pour tenter de comprendre les tonalités de ses coassements.",
        response: "Ses fréquences sonores dessinent une étrange mélodie dans votre esprit : elle vous prévient que les courants de l'End tourbillonnent et qu'un grand vent d'ombre se prépare pour le grand final.",
        speakerMood: "Protecteur",
        affinityBonus: 15
      }
    ]
  },
  {
    id: "future_hope",
    topic: "Après la Faille : Quel avenir ?",
    characterId: "kaelen",
    initialDialogue: "Le vent de la nuit souffle doucement sur les îles en suspension. Kaelen regarde l'immensité du ciel étoilé déchiré par la balafre violette. « Tu t'es déjà demandé ce qu'on fera quand tout sera terminé ? Si on recoud cette satanée faille... »",
    choices: [
      {
        id: "c3_brotherhood",
        prompt: "« On voyagera ensemble. Un monde réparé aura toujours besoin de deux vagabonds. »",
        response: "Kaelen pose sa main sur votre épaule, son regard violet vibrant d'une intensité sincère. « Deux vagabonds... Marché conclu, partenaire. Promets-moi juste qu'on fera un détour par une auberge de l'Overworld pour manger un vrai festin de tartes à la citrouille. »",
        speakerMood: "Serein",
        affinityBonus: 30,
        unlockedLoreNote: "Pacte des Vagabonds scellé : Kaelen débloque la réplique exclusive 'Je te couvre les arrières, frère d'arme !'"
      },
      {
        id: "c3_peace",
        prompt: "« Tu pourras enfin déposer ton épée et vivre en paix, Kaelen. »",
        response: "Il contemple la lame runique posée contre le bois. « En paix... Je ne sais même plus à quoi ça ressemble. Mais rien que pour revoir un lever de soleil sans particules d'Ender dans l'air, je suis prêt à tout donner. »",
        speakerMood: "Mélancolique",
        affinityBonus: 20
      }
    ]
  }
];

