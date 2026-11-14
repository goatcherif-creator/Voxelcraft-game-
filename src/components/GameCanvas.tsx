import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, Shield, Zap, Sparkles, 
  Anchor, Eye, Swords, Apple, Pickaxe, Compass, Crosshair, Heart, ArrowUp, ArrowDown, ArrowLeft, ArrowRight,
  Timer, Trophy, Medal, Flame, Check, User, Maximize, Minimize, Settings, Sliders, X, Monitor, HelpCircle
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { drawRiftAdventurer, drawCorruptedZombieSprite } from '../utils/characterRenderer';

type GameScreenState = 'TITLE' | 'PLAYING' | 'GAME_OVER' | 'VICTORY';
type SpeedrunRank = 'S' | 'A' | 'B' | 'C';

interface Entity {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  maxHp: number;
  type: 'player' | 'kaelen' | 'zombie' | 'boss_ignis' | 'shadow_stalker' | 'void_shadow';
  facing: 'left' | 'right';
  state?: string;
  cooldown?: number;
  isInvisible?: boolean;
}

interface CrystalCluster {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  shardsCount: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
  type?: 'spark' | 'ring' | 'meteor' | 'shard';
}

interface DamageNumber {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

interface BossTelegraph {
  x: number;
  y: number;
  radius: number;
  timer: number;
  maxTimer: number;
  type: 'slam' | 'meteor';
}

interface GameCanvasProps {
  initialChapter?: number;
  onOpenCodex?: () => void;
}

// Format seconds into MM:SS.ms
const formatChrono = (timeSec: number): string => {
  const mins = Math.floor(timeSec / 60);
  const secs = Math.floor(timeSec % 60);
  const ms = Math.floor((timeSec % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
};

// Calculate Speedrun Rank
const getSpeedrunRank = (chapter: number, timeSec: number): { rank: SpeedrunRank; title: string; color: string } => {
  let sThreshold = 30;
  let aThreshold = 50;
  let bThreshold = 75;

  if (chapter === 2) {
    // Ignis Primus Boss
    sThreshold = 40;
    aThreshold = 65;
    bThreshold = 95;
  } else if (chapter === 4) {
    // Void Shadow Boss
    sThreshold = 50;
    aThreshold = 80;
    bThreshold = 120;
  }

  if (timeSec <= sThreshold) {
    return { rank: 'S', title: 'Rang S : Légende de l\'Écho', color: '#facc15' };
  } else if (timeSec <= aThreshold) {
    return { rank: 'A', title: 'Rang A : Maître des Failles', color: '#c084fc' };
  } else if (timeSec <= bThreshold) {
    return { rank: 'B', title: 'Rang B : Vagabond Aguerri', color: '#38bdf8' };
  } else {
    return { rank: 'C', title: 'Rang C : Aventurier Initié', color: '#94a3b8' };
  }
};

export const GameCanvas: React.FC<GameCanvasProps> = ({ initialChapter = 1 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // High level UI & State
  const [gameState, setGameState] = useState<GameScreenState>('PLAYING');
  const [selectedChapter, setSelectedChapter] = useState<number>(initialChapter);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Fullscreen & Settings State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Time Attack (Contre-la-montre) State
  const [isTimeAttack, setIsTimeAttack] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [rankAchieved, setRankAchieved] = useState<{ rank: SpeedrunRank; title: string; color: string } | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  // Records per chapter (persisted in localStorage)
  const [speedrunRecords, setSpeedrunRecords] = useState<{ [chapter: number]: number }>(() => {
    try {
      const saved = localStorage.getItem('voxelcraft_speedrun_records');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { 1: 34.5, 2: 52.8, 3: 41.2, 4: 78.4 };
  });

  // Player Stats
  const [playerHp, setPlayerHp] = useState<number>(100);
  const [goldenAppleCount, setGoldenAppleCount] = useState<number>(3);
  const [amethystShards, setAmethystShards] = useState<number>(45);
  const [xpLevel, setXpLevel] = useState<number>(14);
  const [score, setScore] = useState<number>(0);
  const [playerSkin, setPlayerSkin] = useState<'kaelen' | 'aria' | 'thorne'>('kaelen');

  // Active Hotbar Slot (1 to 7)
  const [activeSlot, setActiveSlot] = useState<number>(1);

  // Boss HP
  const [bossHp, setBossHp] = useState<number>(650);
  const [maxBossHp, setMaxBossHp] = useState<number>(650);

  // Kaelen quote
  const [kaelenQuote, setKaelenQuote] = useState<string>("« Bienvenue à la fin du monde, gamin. Essaie de ne pas cligner des yeux. »");

  // Hotbar Items Definition
  const hotbarItems = [
    { slot: 1, name: "Épée Netherite", icon: <Swords className="w-5 h-5 text-indigo-400" />, key: "1", desc: "Attaque de base" },
    { slot: 2, name: "Gant d'Écho", icon: <Sparkles className="w-5 h-5 text-purple-400" />, key: "2", desc: "Onde de choc & Stun" },
    { slot: 3, name: "Grappin Cinétique", icon: <Anchor className="w-5 h-5 text-sky-400" />, key: "3", desc: "Projection éclair" },
    { slot: 4, name: "Lame-Flash (Kaelen)", icon: <Zap className="w-5 h-5 text-fuchsia-400" />, key: "4", desc: "Téléport critique" },
    { slot: 5, name: "Phare de Volt", icon: <Eye className="w-5 h-5 text-emerald-400" />, key: "5", desc: "Révèle l'invisible" },
    { slot: 6, name: "Pomme Dorée", icon: <Apple className="w-5 h-5 text-amber-400" />, key: "6", count: goldenAppleCount, desc: "Soin + Absorption" },
    { slot: 7, name: "Pioche d'Améthyste", icon: <Pickaxe className="w-5 h-5 text-purple-300" />, key: "7", desc: "Miner les cristaux" }
  ];

  // Game ref state
  const stateRef = useRef<{
    gameState: GameScreenState;
    player: Entity;
    kaelen: Entity;
    enemies: Entity[];
    crystals: CrystalCluster[];
    telegraphs: BossTelegraph[];
    particles: Particle[];
    damageNumbers: DamageNumber[];
    switches: { x: number; y: number; active: boolean; label: string }[];
    keys: { [key: string]: boolean };
    lastTime: number;
    startTime: number;
    timerActive: boolean;
    currentRunTime: number;
    playerAttackAnim: number;
    chapter: number;
    bossActive: boolean;
    screenShake: number;
    mousePos: { x: number; y: number };
    appleCount: number;
    shards: number;
  }>({
    gameState: 'PLAYING',
    player: { id: 'player', x: 220, y: 280, vx: 0, vy: 0, radius: 18, hp: 100, maxHp: 100, type: 'player', facing: 'right' },
    kaelen: { id: 'kaelen', x: 160, y: 280, vx: 0, vy: 0, radius: 18, hp: 200, maxHp: 200, type: 'kaelen', facing: 'right' },
    enemies: [],
    crystals: [],
    telegraphs: [],
    particles: [],
    damageNumbers: [],
    switches: [],
    keys: {},
    lastTime: performance.now(),
    startTime: performance.now(),
    timerActive: true,
    currentRunTime: 0,
    playerAttackAnim: 0,
    chapter: initialChapter,
    bossActive: false,
    screenShake: 0,
    mousePos: { x: 450, y: 280 },
    appleCount: 3,
    shards: 45
  });

  // Load a chapter
  const loadChapter = useCallback((chapterNum: number, timeAttackMode = isTimeAttack) => {
    const s = stateRef.current;
    s.chapter = chapterNum;
    setSelectedChapter(chapterNum);
    s.gameState = 'PLAYING';
    setGameState('PLAYING');

    // Reset chrono
    s.startTime = performance.now();
    s.currentRunTime = 0;
    s.timerActive = true;
    setElapsedTime(0);
    setIsNewRecord(false);
    setRankAchieved(null);

    s.player.x = 200;
    s.player.y = 280;
    s.player.hp = 100;
    setPlayerHp(100);
    s.kaelen.x = 140;
    s.kaelen.y = 280;
    s.particles = [];
    s.damageNumbers = [];
    s.telegraphs = [];

    // Spawn minable crystal clusters
    s.crystals = [
      { id: 'c1', x: 680, y: 120, hp: 3, maxHp: 3, shardsCount: 15 },
      { id: 'c2', x: 720, y: 440, hp: 3, maxHp: 3, shardsCount: 15 },
      { id: 'c3', x: 120, y: 450, hp: 3, maxHp: 3, shardsCount: 15 },
    ];

    if (chapterNum === 1) {
      s.bossActive = false;
      s.enemies = [
        { id: 'z1', x: 520, y: 180, vx: 0, vy: 0, radius: 16, hp: 50, maxHp: 50, type: 'zombie', facing: 'left' },
        { id: 'z2', x: 640, y: 280, vx: 0, vy: 0, radius: 16, hp: 50, maxHp: 50, type: 'zombie', facing: 'left' },
        { id: 'z3', x: 560, y: 420, vx: 0, vy: 0, radius: 16, hp: 60, maxHp: 60, type: 'zombie', facing: 'left' },
      ];
      s.switches = [
        { x: 740, y: 220, active: false, label: "Diapason Alpha" },
        { x: 740, y: 380, active: false, label: "Diapason Bêta" }
      ];
      setKaelenQuote(timeAttackMode 
        ? "« Contre-la-montre lancé ! Élimine ces zombies sans perdre un seul centième ! »"
        : "« Bienvenue à la fin du monde, gamin. Essaie de ne pas cligner des yeux. »"
      );
      soundFx.playAmethystChime(1.2);
    } else if (chapterNum === 2) {
      s.bossActive = true;
      setMaxBossHp(650);
      setBossHp(650);
      s.enemies = [
        { id: 'boss_ignis', x: 640, y: 280, vx: 0, vy: 0, radius: 46, hp: 650, maxHp: 650, type: 'boss_ignis', facing: 'left', cooldown: 0 },
        { id: 'z1', x: 480, y: 140, vx: 0, vy: 0, radius: 14, hp: 40, maxHp: 40, type: 'zombie', facing: 'left' },
        { id: 'z2', x: 500, y: 440, vx: 0, vy: 0, radius: 14, hp: 40, maxHp: 40, type: 'zombie', facing: 'left' }
      ];
      s.switches = [
        { x: 380, y: 100, active: false, label: "Vanne Thermique" },
        { x: 380, y: 460, active: false, label: "Pont d'Obsidienne" }
      ];
      setKaelenQuote(timeAttackMode
        ? "« Speedrun Ignis Primus ! Frappe ses failles dorsales pour battre le record ! »"
        : "« Ce tas de magma a l'air fâché. J'attire son regard, toi frappe son dos ! »"
      );
      soundFx.playExplosion();
    } else if (chapterNum === 3) {
      s.bossActive = false;
      s.enemies = [
        { id: 's1', x: 480, y: 200, vx: 0, vy: 0, radius: 16, hp: 80, maxHp: 80, type: 'shadow_stalker', facing: 'left', isInvisible: true },
        { id: 's2', x: 620, y: 350, vx: 0, vy: 0, radius: 16, hp: 80, maxHp: 80, type: 'shadow_stalker', facing: 'left', isInvisible: true },
        { id: 's3', x: 720, y: 240, vx: 0, vy: 0, radius: 16, hp: 90, maxHp: 90, type: 'shadow_stalker', facing: 'left', isInvisible: true }
      ];
      s.switches = [
        { x: 420, y: 280, active: false, label: "Prisme d'End" },
        { x: 760, y: 280, active: false, label: "Porte Runique" }
      ];
      setKaelenQuote("« Volt s'affole ! Appuie sur [5] pour dissiper l'invisibilité et rusher ! »");
      soundFx.playFrogRibbit();
    } else {
      s.bossActive = true;
      setMaxBossHp(1000);
      setBossHp(1000);
      s.enemies = [
        { id: 'void_shadow', x: 660, y: 280, vx: 0, vy: 0, radius: 50, hp: 1000, maxHp: 1000, type: 'void_shadow', facing: 'left', cooldown: 0 }
      ];
      s.switches = [
        { x: 280, y: 140, active: false, label: "Artefact 1" },
        { x: 280, y: 440, active: false, label: "Artefact 2" },
        { x: 760, y: 280, active: false, label: "Artefact 3" }
      ];
      setKaelenQuote(timeAttackMode
        ? "« Ultime Speedrun contre l'Ombre du Vide ! Fais exploser le chronomètre ! »"
        : "« C'est le grand final, gamin. On déploie les élytres et on recoud cette faille ! »"
      );
      soundFx.playTeleport();
    }
  }, [isTimeAttack]);

  // Toggle Time Attack Mode
  const toggleTimeAttack = () => {
    const nextMode = !isTimeAttack;
    setIsTimeAttack(nextMode);
    loadChapter(selectedChapter, nextMode);
    soundFx.playAmethystChime(1.6);
  };

  // Action: Basic Sword Attack
  const performSwordAttack = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;

    s.playerAttackAnim = 1.0;
    soundFx.playSlash();
    const attackX = s.player.facing === 'right' ? s.player.x + 36 : s.player.x - 36;
    const attackY = s.player.y;

    for (let i = 0; i < 12; i++) {
      s.particles.push({
        x: attackX + (Math.random() - 0.5) * 20,
        y: attackY + (Math.random() - 0.5) * 24,
        vx: (s.player.facing === 'right' ? 3 : -3) + (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: '#a5b4fc',
        life: 14,
        maxLife: 14,
        size: 3,
        type: 'spark'
      });
    }

    s.enemies.forEach(en => {
      const dist = Math.hypot(en.x - attackX, en.y - attackY);
      if (dist < en.radius + 32 && en.hp > 0) {
        const dmg = Math.floor(28 + Math.random() * 14);
        en.hp -= dmg;
        s.damageNumbers.push({
          id: Math.random().toString(),
          x: en.x,
          y: en.y - 18,
          text: `-${dmg}`,
          color: "#f87171",
          life: 30
        });
        const angle = Math.atan2(en.y - s.player.y, en.x - s.player.x);
        en.vx += Math.cos(angle) * 5;
        en.vy += Math.sin(angle) * 5;
        setScore(sc => sc + 15);
      }
    });

    s.crystals.forEach(c => {
      const dist = Math.hypot(c.x - attackX, c.y - attackY);
      if (dist < 40 && c.hp > 0) {
        c.hp -= 1;
        soundFx.playMine();
        s.damageNumbers.push({
          id: Math.random().toString(),
          x: c.x,
          y: c.y - 20,
          text: `💎 +5 Éclats !`,
          color: "#c084fc",
          life: 35
        });
        s.shards += 5;
        setAmethystShards(s.shards);
        setScore(sc => sc + 20);

        for (let p = 0; p < 10; p++) {
          s.particles.push({
            x: c.x,
            y: c.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            color: '#c084fc',
            life: 25,
            maxLife: 25,
            size: 4,
            type: 'shard'
          });
        }
      }
    });
  }, []);

  // Action: Eat Golden Apple
  const useGoldenApple = useCallback(() => {
    const s = stateRef.current;
    if (s.appleCount <= 0 || s.gameState !== 'PLAYING') return;

    s.appleCount -= 1;
    setGoldenAppleCount(s.appleCount);
    soundFx.playEat();

    const healAmount = 45;
    s.player.hp = Math.min(s.player.maxHp, s.player.hp + healAmount);
    setPlayerHp(s.player.hp);

    s.damageNumbers.push({
      id: Math.random().toString(),
      x: s.player.x,
      y: s.player.y - 25,
      text: `+${healAmount} PV Dorés !`,
      color: "#facc15",
      life: 45
    });

    for (let p = 0; p < 20; p++) {
      s.particles.push({
        x: s.player.x,
        y: s.player.y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: '#facc15',
        life: 30,
        maxLife: 30,
        size: 5,
        type: 'spark'
      });
    }

    setKaelenQuote("« Miam ! Une Pomme Dorée d'Améthyste pour maintenir le tempo ! »");
  }, []);

  // Action: Use Echo Glove
  const useEchoGlove = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;

    soundFx.playAmethystChime(1.5);

    for (let r = 0; r < 3; r++) {
      setTimeout(() => {
        s.particles.push({
          x: s.player.x,
          y: s.player.y,
          vx: 0,
          vy: 0,
          color: '#c084fc',
          life: 30,
          maxLife: 30,
          size: 25 + r * 30,
          type: 'ring'
        });
      }, r * 80);
    }

    s.switches.forEach(sw => {
      const dist = Math.hypot(sw.x - s.player.x, sw.y - s.player.y);
      if (dist < 280 && !sw.active) {
        sw.active = true;
        soundFx.playAmethystChime(2);
        s.damageNumbers.push({
          id: Math.random().toString(),
          x: sw.x,
          y: sw.y - 20,
          text: "RÉSONANCE SCULK !",
          color: "#38bdf8",
          life: 45
        });
      }
    });

    s.enemies.forEach(en => {
      const dist = Math.hypot(en.x - s.player.x, en.y - s.player.y);
      if (dist < 200 && en.hp > 0) {
        const dmg = 50;
        en.hp -= dmg;
        s.damageNumbers.push({
          id: Math.random().toString(),
          x: en.x,
          y: en.y - 20,
          text: `-${dmg} ÉCHO`,
          color: "#a855f7",
          life: 40
        });
        const angle = Math.atan2(en.y - s.player.y, en.x - s.player.x);
        en.vx += Math.cos(angle) * 9;
        en.vy += Math.sin(angle) * 9;
      }
    });

    setKaelenQuote("« Belle impulsion acoustique ! Les géodes vibrent ! »");
  }, []);

  // Action: Kinetic Grapple
  const useGrapple = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;

    soundFx.playGrapple();
    const targetX = s.mousePos.x || s.player.x + 200;
    const targetY = s.mousePos.y || s.player.y;
    const angle = Math.atan2(targetY - s.player.y, targetX - s.player.x);
    s.player.vx = Math.cos(angle) * 16;
    s.player.vy = Math.sin(angle) * 16;

    for (let i = 0; i < 16; i++) {
      const ratio = i / 16;
      s.particles.push({
        x: s.player.x + (targetX - s.player.x) * ratio,
        y: s.player.y + (targetY - s.player.y) * ratio,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: '#38bdf8',
        life: 20,
        maxLife: 20,
        size: 3,
        type: 'spark'
      });
    }

    setKaelenQuote("« Grappin déployé ! Tu voltiges comme un vrai Vagabond. »");
  }, []);

  // Action: Lame-Flash de Kaelen
  const useKaelenFlashBlade = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;

    const target = s.enemies.find(e => e.hp > 0);
    if (!target) return;

    soundFx.playTeleport();

    for (let i = 0; i < 20; i++) {
      s.particles.push({
        x: s.kaelen.x + (Math.random() - 0.5) * 20,
        y: s.kaelen.y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        color: '#a855f7',
        life: 25,
        maxLife: 25,
        size: 4,
        type: 'spark'
      });
    }

    s.kaelen.x = target.x + (target.facing === 'left' ? 45 : -45);
    s.kaelen.y = target.y;
    s.kaelen.facing = target.facing === 'left' ? 'left' : 'right';

    setTimeout(() => {
      soundFx.playSlash();
      const critDmg = 140;
      target.hp -= critDmg;
      s.screenShake = 10;
      s.damageNumbers.push({
        id: Math.random().toString(),
        x: target.x,
        y: target.y - 30,
        text: `CRITIQUE! -${critDmg}`,
        color: "#f43f5e",
        life: 50
      });

      for (let p = 0; p < 25; p++) {
        s.particles.push({
          x: target.x,
          y: target.y,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          color: '#ec4899',
          life: 30,
          maxLife: 30,
          size: 5,
          type: 'spark'
        });
      }
    }, 120);

    setKaelenQuote("« Tu appelles ça frapper ? Admire un peu la Lame-Flash ! »");
  }, []);

  // Action: Volt's Luminescence
  const useVoltLuminescence = useCallback(() => {
    const s = stateRef.current;
    if (s.gameState !== 'PLAYING') return;

    soundFx.playFrogRibbit();

    s.enemies.forEach(e => {
      if (e.isInvisible) {
        e.isInvisible = false;
        s.damageNumbers.push({
          id: Math.random().toString(),
          x: e.x,
          y: e.y - 25,
          text: "RÉVÉLÉ PAR VOLT !",
          color: "#4ade80",
          life: 50
        });
      }
    });

    s.particles.push({
      x: s.kaelen.x,
      y: s.kaelen.y - 10,
      vx: 0,
      vy: 0,
      color: '#4ade80',
      life: 45,
      maxLife: 45,
      size: 160,
      type: 'ring'
    });

    setKaelenQuote("« Coââk ! Volt a percé le voile de ces ombres ! »");
  }, []);

  // Trigger hotbar slot
  const triggerActiveSlot = useCallback((slotNum: number) => {
    setActiveSlot(slotNum);
    if (slotNum === 1 || slotNum === 7) {
      performSwordAttack();
    } else if (slotNum === 2) {
      useEchoGlove();
    } else if (slotNum === 3) {
      useGrapple();
    } else if (slotNum === 4) {
      useKaelenFlashBlade();
    } else if (slotNum === 5) {
      useVoltLuminescence();
    } else if (slotNum === 6) {
      useGoldenApple();
    }
  }, [performSwordAttack, useEchoGlove, useGrapple, useKaelenFlashBlade, useVoltLuminescence, useGoldenApple]);

  // Key Event Listeners (AZERTY & QWERTY)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const code = e.code;

      if (code === 'KeyW' || code === 'KeyZ' || code === 'ArrowUp') s.keys['up'] = true;
      if (code === 'KeyS' || code === 'ArrowDown') s.keys['down'] = true;
      if (code === 'KeyA' || code === 'KeyQ' || code === 'ArrowLeft') s.keys['left'] = true;
      if (code === 'KeyD' || code === 'ArrowRight') s.keys['right'] = true;

      if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key)) {
        triggerActiveSlot(parseInt(e.key));
        return;
      }

      if (code === 'Space') {
        e.preventDefault();
        performSwordAttack();
      } else if (code === 'KeyE') {
        triggerActiveSlot(3);
      } else if (code === 'KeyR') {
        triggerActiveSlot(4);
      } else if (code === 'KeyF') {
        triggerActiveSlot(5);
      } else if (code === 'KeyG') {
        triggerActiveSlot(6);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const code = e.code;

      if (code === 'KeyW' || code === 'KeyZ' || code === 'ArrowUp') s.keys['up'] = false;
      if (code === 'KeyS' || code === 'ArrowDown') s.keys['down'] = false;
      if (code === 'KeyA' || code === 'KeyQ' || code === 'ArrowLeft') s.keys['left'] = false;
      if (code === 'KeyD' || code === 'ArrowRight') s.keys['right'] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerActiveSlot, performSwordAttack]);

  // Toggle Fullscreen using standard Fullscreen API with cross-browser compatibility
  const toggleFullscreen = useCallback(async () => {
    try {
      const container = containerRef.current;
      if (!container) return;

      const doc = document as any;
      const isFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isFull) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
        soundFx.playAmethystChime(1.5);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
        soundFx.playAmethystChime(1.1);
      }
    } catch (err) {
      console.warn('Erreur lors du basculement en plein écran:', err);
    }
  }, []);

  // Listen to fullscreen changes across all browser engines
  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFull = !!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFull);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Initial chapter setup
  useEffect(() => {
    loadChapter(initialChapter);
  }, [initialChapter, loadChapter]);

  // Mouse interaction
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    stateRef.current.mousePos = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleCanvasClick = () => {
    triggerActiveSlot(activeSlot);
  };

  // Main 60FPS Game Loop with Precision Speedrun Chrono
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (time: number) => {
      const s = stateRef.current;
      const dt = Math.min((time - s.lastTime) / 1000, 0.1);
      s.lastTime = time;

      if (s.gameState === 'PLAYING') {
        // Update chrono if active
        if (s.timerActive) {
          s.currentRunTime = (performance.now() - s.startTime) / 1000;
          setElapsedTime(s.currentRunTime);
        }

        // Decay attack animation
        if (s.playerAttackAnim > 0) {
          s.playerAttackAnim = Math.max(0, s.playerAttackAnim - dt * 4.5);
        }

        // 1. Movement
        let moveX = 0;
        let moveY = 0;
        if (s.keys['up']) moveY -= 1;
        if (s.keys['down']) moveY += 1;
        if (s.keys['left']) {
          moveX -= 1;
          s.player.facing = 'left';
        }
        if (s.keys['right']) {
          moveX += 1;
          s.player.facing = 'right';
        }

        const speed = 210;
        if (moveX !== 0 && moveY !== 0) {
          moveX *= 0.707;
          moveY *= 0.707;
        }

        s.player.vx += (moveX * speed - s.player.vx) * 0.22;
        s.player.vy += (moveY * speed - s.player.vy) * 0.22;

        s.player.x += s.player.vx * dt;
        s.player.y += s.player.vy * dt;

        s.player.x = Math.max(30, Math.min(canvas.width - 30, s.player.x));
        s.player.y = Math.max(60, Math.min(canvas.height - 40, s.player.y));

        // 2. Kaelen AI Companion
        const targetDist = 65;
        const distToPlayer = Math.hypot(s.player.x - s.kaelen.x, s.player.y - s.kaelen.y);

        if (distToPlayer > targetDist) {
          const angle = Math.atan2(s.player.y - s.kaelen.y, s.player.x - s.kaelen.x);
          s.kaelen.vx += (Math.cos(angle) * (speed * 0.96) - s.kaelen.vx) * 0.16;
          s.kaelen.vy += (Math.sin(angle) * (speed * 0.96) - s.kaelen.vy) * 0.16;
        } else {
          s.kaelen.vx *= 0.8;
          s.kaelen.vy *= 0.8;
        }

        s.kaelen.x += s.kaelen.vx * dt;
        s.kaelen.y += s.kaelen.vy * dt;
        if (s.kaelen.vx > 4) s.kaelen.facing = 'right';
        if (s.kaelen.vx < -4) s.kaelen.facing = 'left';

        // Kaelen assist strike
        const targetFoe = s.enemies.find(e => e.hp > 0 && Math.hypot(e.x - s.kaelen.x, e.y - s.kaelen.y) < 65);
        if (targetFoe && Math.random() < 0.04) {
          const assistDmg = 22;
          targetFoe.hp -= assistDmg;
          soundFx.playSlash();
          s.damageNumbers.push({
            id: Math.random().toString(),
            x: targetFoe.x,
            y: targetFoe.y - 15,
            text: `-${assistDmg} Kaelen`,
            color: "#c084fc",
            life: 30
          });
        }

        // 3. Enemy behaviors & Boss telegraphed attacks
        let allDead = true;
        s.enemies.forEach(en => {
          if (en.hp <= 0) return;
          allDead = false;

          const target = Math.random() < 0.75 ? s.player : s.kaelen;
          const dist = Math.hypot(target.x - en.x, target.y - en.y);
          const angle = Math.atan2(target.y - en.y, target.x - en.x);

          let enemySpeed = 80;
          if (en.type === 'boss_ignis') {
            enemySpeed = 42;
            en.cooldown = (en.cooldown || 0) + dt;

            if (en.cooldown > 3.0) {
              en.cooldown = 0;
              s.telegraphs.push({
                x: s.player.x,
                y: s.player.y,
                radius: 70,
                timer: 1.2,
                maxTimer: 1.2,
                type: 'slam'
              });
            }
          } else if (en.type === 'void_shadow') {
            enemySpeed = 38;
            en.cooldown = (en.cooldown || 0) + dt;

            if (en.cooldown > 2.5) {
              en.cooldown = 0;
              for (let m = 0; m < 3; m++) {
                s.telegraphs.push({
                  x: 120 + Math.random() * (canvas.width - 240),
                  y: 100 + Math.random() * (canvas.height - 200),
                  radius: 55,
                  timer: 1.4,
                  maxTimer: 1.4,
                  type: 'meteor'
                });
              }
            }
          }

          if (dist > 35) {
            en.vx += (Math.cos(angle) * enemySpeed - en.vx) * 0.12;
            en.vy += (Math.sin(angle) * enemySpeed - en.vy) * 0.12;
          }

          en.x += en.vx * dt;
          en.y += en.vy * dt;
          en.facing = en.vx > 0 ? 'right' : 'left';

          if (dist < en.radius + s.player.radius) {
            if (Math.random() < 0.03) {
              s.player.hp = Math.max(0, s.player.hp - 6);
              setPlayerHp(s.player.hp);
              soundFx.playHurt();
              s.damageNumbers.push({
                id: Math.random().toString(),
                x: s.player.x,
                y: s.player.y - 16,
                text: "-6",
                color: "#ef4444",
                life: 25
              });
            }
          }
        });

        // 4. Update Boss Telegraphs
        s.telegraphs.forEach((t, idx) => {
          t.timer -= dt;
          if (t.timer <= 0) {
            soundFx.playExplosion();
            s.screenShake = 10;
            for (let p = 0; p < 20; p++) {
              s.particles.push({
                x: t.x,
                y: t.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: t.type === 'slam' ? '#ea580c' : '#9333ea',
                life: 30,
                maxLife: 30,
                size: 6,
                type: 'spark'
              });
            }
            const dist = Math.hypot(s.player.x - t.x, s.player.y - t.y);
            if (dist < t.radius) {
              s.player.hp = Math.max(0, s.player.hp - 25);
              setPlayerHp(s.player.hp);
              soundFx.playHurt();
              s.damageNumbers.push({
                id: Math.random().toString(),
                x: s.player.x,
                y: s.player.y - 20,
                text: "-25 IMPACT !",
                color: "#ea580c",
                life: 40
              });
            }
            s.telegraphs.splice(idx, 1);
          }
        });

        // Check if player died
        if (s.player.hp <= 0) {
          s.timerActive = false;
          s.gameState = 'GAME_OVER';
          setGameState('GAME_OVER');
          soundFx.playHurt();
        }

        // Check Victory & Speedrun record calculation
        const handleVictory = () => {
          s.timerActive = false;
          s.gameState = 'VICTORY';
          setGameState('VICTORY');
          soundFx.playVictoryFanfare();

          const finalTime = s.currentRunTime;
          const rankInfo = getSpeedrunRank(s.chapter, finalTime);
          setRankAchieved(rankInfo);

          // Check if personal best
          const currentBest = speedrunRecords[s.chapter] || 999;
          if (finalTime < currentBest) {
            setIsNewRecord(true);
            const updatedRecords = { ...speedrunRecords, [s.chapter]: Math.round(finalTime * 10) / 10 };
            setSpeedrunRecords(updatedRecords);
            try {
              localStorage.setItem('voxelcraft_speedrun_records', JSON.stringify(updatedRecords));
            } catch {}
            setKaelenQuote("« RECORD DE VITESSE PULVÉRISÉ ! Tu as terrassé ce monstre plus vite que ma Lame-Flash ! »");
          } else {
            setIsNewRecord(false);
            setKaelenQuote(`« Victoire validée en ${formatChrono(finalTime)} ! Prêt pour un nouveau chrono ? »`);
          }
        };

        const boss = s.enemies.find(e => e.type === 'boss_ignis' || e.type === 'void_shadow');
        if (boss) {
          setBossHp(Math.max(0, boss.hp));
          if (boss.hp <= 0) {
            handleVictory();
            setScore(sc => sc + 500);
          }
        } else if (allDead && s.enemies.length > 0) {
          handleVictory();
          setScore(sc => sc + 300);
        }

        // Update particles
        s.particles.forEach((p, idx) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;
          if (p.life <= 0) {
            s.particles.splice(idx, 1);
          }
        });

        // Update damage numbers
        s.damageNumbers.forEach((d, idx) => {
          d.y -= 0.6;
          d.life -= 1;
          if (d.life <= 0) {
            s.damageNumbers.splice(idx, 1);
          }
        });

        if (s.screenShake > 0) {
          s.screenShake *= 0.88;
          if (s.screenShake < 0.2) s.screenShake = 0;
        }
      }

      // --- RENDER PIPELINE ---
      ctx.save();
      if (s.screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * s.screenShake, (Math.random() - 0.5) * s.screenShake);
      }

      ctx.fillStyle = '#0b0914';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const tileSize = 40;
      for (let tx = 0; tx < canvas.width; tx += tileSize) {
        for (let ty = 0; ty < canvas.height; ty += tileSize) {
          if (s.chapter === 1) {
            ctx.fillStyle = (tx / tileSize + ty / tileSize) % 2 === 0 ? '#18152b' : '#141224';
          } else if (s.chapter === 2) {
            ctx.fillStyle = (tx / tileSize + ty / tileSize) % 3 === 0 ? '#271212' : '#180d0d';
          } else if (s.chapter === 3) {
            ctx.fillStyle = (tx / tileSize + ty / tileSize) % 2 === 0 ? '#1a1d2e' : '#131522';
          } else {
            ctx.fillStyle = (tx / tileSize + ty / tileSize) % 2 === 0 ? '#150d24' : '#0f0919';
          }
          ctx.fillRect(tx, ty, tileSize - 1, tileSize - 1);
        }
      }

      // Render Telegraphed Attack Zones
      s.telegraphs.forEach(t => {
        ctx.save();
        const progress = 1 - (t.timer / t.maxTimer);
        ctx.fillStyle = t.type === 'slam' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(168, 85, 247, 0.25)';
        ctx.strokeStyle = t.type === 'slam' ? '#ef4444' : '#c084fc';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = t.type === 'slam' ? 'rgba(239, 68, 68, 0.45)' : 'rgba(168, 85, 247, 0.45)';
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * progress, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("DANGER !", t.x, t.y);
        ctx.restore();
      });

      // Render Minable Amethyst Clusters
      s.crystals.forEach(c => {
        if (c.hp <= 0) return;
        ctx.save();
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 15;
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(c.x, c.y - 22);
        ctx.lineTo(c.x + 14, c.y + 12);
        ctx.lineTo(c.x - 14, c.y + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#e879f9';
        ctx.beginPath();
        ctx.moveTo(c.x, c.y - 18);
        ctx.lineTo(c.x + 8, c.y + 8);
        ctx.lineTo(c.x - 4, c.y + 8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#d8b4fe';
        ctx.font = '9px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Améthyste [Clic/Miner]`, c.x, c.y + 24);
        ctx.restore();
      });

      // Render Switches
      s.switches.forEach(sw => {
        ctx.save();
        ctx.shadowColor = sw.active ? '#38bdf8' : '#7c3aed';
        ctx.shadowBlur = sw.active ? 15 : 6;
        ctx.fillStyle = sw.active ? '#38bdf8' : '#6b21a8';
        ctx.fillRect(sw.x - 12, sw.y - 12, 24, 24);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(sw.x - 12, sw.y - 12, 24, 24);

        ctx.fillStyle = sw.active ? '#e0f2fe' : '#d8b4fe';
        ctx.font = '10px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(sw.label, sw.x, sw.y - 18);
        ctx.restore();
      });

      // Render Particles
      s.particles.forEach(p => {
        ctx.save();
        if (p.type === 'ring') {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1 - p.life / p.maxLife), 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Render Enemies & Bosses
      s.enemies.forEach(en => {
        if (en.hp <= 0) return;
        ctx.save();

        if (en.isInvisible) {
          ctx.globalAlpha = 0.12;
        }

        if (en.type === 'boss_ignis') {
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 24;
          ctx.fillStyle = '#1c1917';
          ctx.fillRect(en.x - 36, en.y - 45, 72, 70);

          ctx.fillStyle = '#f97316';
          ctx.fillRect(en.x - 26, en.y - 35, 12, 50);
          ctx.fillRect(en.x + 14, en.y - 35, 12, 50);
          ctx.fillRect(en.x - 26, en.y - 8, 52, 10);

          ctx.fillStyle = '#44403c';
          ctx.beginPath();
          ctx.moveTo(en.x - 30, en.y - 45);
          ctx.lineTo(en.x - 48, en.y - 68);
          ctx.lineTo(en.x - 18, en.y - 45);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(en.x + 30, en.y - 45);
          ctx.lineTo(en.x + 48, en.y - 68);
          ctx.lineTo(en.x + 18, en.y - 45);
          ctx.fill();

          const flailX = en.x + (en.facing === 'left' ? -65 : 65);
          const flailY = en.y + 12;
          ctx.strokeStyle = '#f97316';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(en.x + (en.facing === 'left' ? -25 : 25), en.y);
          ctx.lineTo(flailX, flailY);
          ctx.stroke();

          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.arc(flailX, flailY, 17, 0, Math.PI * 2);
          ctx.fill();
        } else if (en.type === 'void_shadow') {
          ctx.shadowColor = '#9333ea';
          ctx.shadowBlur = 30;
          ctx.fillStyle = '#1e1b4b';
          ctx.beginPath();
          ctx.arc(en.x, en.y, en.radius, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#d946ef';
          ctx.beginPath();
          ctx.arc(en.x + (en.facing === 'left' ? -10 : 10), en.y - 8, 8, 0, Math.PI * 2);
          ctx.fill();
        } else if (en.type === 'shadow_stalker') {
          ctx.shadowColor = '#818cf8';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#312e81';
          ctx.fillRect(en.x - 14, en.y - 20, 28, 36);

          ctx.fillStyle = '#c084fc';
          ctx.fillRect(en.x + (en.facing === 'left' ? -10 : 2), en.y - 12, 4, 3);
          ctx.fillRect(en.x + (en.facing === 'left' ? -3 : 9), en.y - 12, 4, 3);
        } else {
          // Corrupted Zombie humanoid sprite with protruding amethyst crystals
          drawCorruptedZombieSprite(ctx, en.x, en.y, en.facing, time / 1000, en.hp / en.maxHp);
        }

        ctx.restore();
      });

      // 7. Render Kaelen (Companion directly modeled on the photo with obsidian mask, cape, runes, and Volt)
      drawRiftAdventurer(ctx, {
        x: s.kaelen.x,
        y: s.kaelen.y,
        facing: s.kaelen.facing,
        isMoving: Math.abs(s.kaelen.vx) > 5 || Math.abs(s.kaelen.vy) > 5,
        animTime: time / 1000,
        hasVolt: true,
        name: "Kaelen & Volt",
        nameColor: "#c084fc",
        isKaelenCompanion: true,
        skinVariant: 'kaelen',
        isAttacking: false
      });

      // 8. Render Player (The Hero, fully modeled as the masked adventurer with flowing cape and runic broadsword)
      drawRiftAdventurer(ctx, {
        x: s.player.x,
        y: s.player.y,
        facing: s.player.facing,
        isMoving: Math.abs(s.player.vx) > 5 || Math.abs(s.player.vy) > 5,
        isAttacking: s.playerAttackAnim > 0,
        attackProgress: 1 - s.playerAttackAnim,
        animTime: time / 1000,
        hasVolt: false,
        name: playerSkin === 'kaelen' ? "Kaelen (Toi)" : playerSkin === 'aria' ? "Aria (Toi)" : "Thorne (Toi)",
        nameColor: "#38bdf8",
        skinVariant: playerSkin,
        activeItem: activeSlot
      });

      // Damage Numbers
      s.damageNumbers.forEach(d => {
        ctx.save();
        ctx.fillStyle = d.color;
        ctx.font = 'bold 13px Plus Jakarta Sans, sans-serif';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText(d.text, d.x, d.y);
        ctx.restore();
      });

      // Minimap
      ctx.save();
      const mmX = canvas.width - 90;
      const mmY = 15;
      const mmW = 75;
      const mmH = 50;

      ctx.fillStyle = 'rgba(11, 9, 20, 0.85)';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.fillRect(mmX, mmY, mmW, mmH);
      ctx.strokeRect(mmX, mmY, mmW, mmH);

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(mmX + (s.player.x / canvas.width) * mmW - 2, mmY + (s.player.y / canvas.height) * mmH - 2, 4, 4);

      ctx.fillStyle = '#c084fc';
      ctx.fillRect(mmX + (s.kaelen.x / canvas.width) * mmW - 1.5, mmY + (s.kaelen.y / canvas.height) * mmH - 1.5, 3, 3);

      ctx.fillStyle = '#ef4444';
      s.enemies.forEach(e => {
        if (e.hp > 0) {
          ctx.fillRect(mmX + (e.x / canvas.width) * mmW - 2, mmY + (e.y / canvas.height) * mmH - 2, 4, 4);
        }
      });
      ctx.restore();

      // On-Canvas Chronometer Display if Time Attack mode is enabled
      if (isTimeAttack) {
        ctx.save();
        ctx.fillStyle = 'rgba(15, 10, 30, 0.85)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.fillRect(canvas.width / 2 - 80, 15, 160, 32);
        ctx.strokeRect(canvas.width / 2 - 80, 15, 160, 32);

        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 14px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`⏱️ ${formatChrono(s.currentRunTime)}`, canvas.width / 2, 36);
        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [activeSlot, isTimeAttack, speedrunRecords]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full flex-1 min-h-0 bg-[#100d1d] border border-purple-900/50 rounded-xl overflow-hidden shadow-2xl flex flex-col transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-none bg-[#0a0715]'
          : ''
      }`}
    >
      {/* Top Bar: Chapter selector, Time Attack Toggle & Game Controls (Compact Dashboard) */}
      <div className="shrink-0 px-3 py-2 border-b border-purple-900/40 bg-[#161228]/95 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-700/60 flex items-center justify-center text-purple-300 shrink-0">
            <Swords className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white font-cinzel tracking-wide whitespace-nowrap">
              Voxelcraft : Faille d'Améthyste
            </h3>
            {isTimeAttack && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                CONTRE-LA-MONTRE
              </span>
            )}
            {isFullscreen && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                PLEIN ÉCRAN
              </span>
            )}
          </div>
        </div>

        {/* Level Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-black/50 rounded-lg border border-purple-950 overflow-x-auto max-w-full">
          {[
            { id: 1, name: "1. Village Cristallisé" },
            { id: 2, name: "2. Ignis Primus (Boss)" },
            { id: 3, name: "3. Forteresse End" },
            { id: 4, name: "4. Faille Finale" }
          ].map(ch => (
            <button
              key={ch.id}
              onClick={() => loadChapter(ch.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                selectedChapter === ch.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-purple-900/30'
              }`}
            >
              {ch.name}
            </button>
          ))}
        </div>

        {/* Mode Switcher, Fullscreen, Settings/Guide, Audio, Reset & Leaderboard */}
        <div className="flex items-center gap-1.5">
          {/* Mode Plein Écran (API Fullscreen) Button */}
          <button
            onClick={toggleFullscreen}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isFullscreen
                ? 'bg-purple-600 text-white border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'bg-[#18122c] hover:bg-[#231b40] text-purple-300 border-purple-700/60 hover:border-purple-400'
            }`}
            title={isFullscreen ? "Quitter le Mode Plein Écran (Échap)" : "Activer le Mode Plein Écran (API Fullscreen)"}
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-white" /> : <Maximize className="w-3.5 h-3.5 text-purple-300" />}
            <span className="hidden lg:inline font-sans">{isFullscreen ? "Quitter Plein Écran" : "Mode Plein Écran"}</span>
          </button>

          {/* Retractable Settings & Instructions Toggle Button */}
          <button
            onClick={() => {
              setShowSettings(prev => !prev);
              if (!showSettings) setShowLeaderboard(false);
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              showSettings
                ? 'bg-purple-600 text-white border-purple-400'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border-slate-700 hover:bg-slate-800'
            }`}
            title="Panneau rétractable : Paramètres & Instructions"
          >
            <Settings className="w-3.5 h-3.5 text-purple-300" />
            <span className="hidden xl:inline text-[11px]">Paramètres & Aide</span>
          </button>

          {/* Time Attack Mode Toggle Button */}
          <button
            onClick={toggleTimeAttack}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isTimeAttack
                ? 'bg-amber-500 text-black border-amber-300 shadow-[0_0_12px_rgba(250,204,21,0.5)]'
                : 'bg-[#18122c] hover:bg-[#231b40] text-amber-300 border-amber-500/50 hover:border-amber-400'
            }`}
            title="Activer/Désactiver le Mode Contre-la-montre"
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{isTimeAttack ? "Chrono ACTIF" : "Contre-la-montre"}</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => {
              setShowLeaderboard(prev => !prev);
              if (!showLeaderboard) setShowSettings(false);
            }}
            className={`p-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              showLeaderboard
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'text-slate-300 hover:text-white bg-slate-900/60 border-slate-700 hover:bg-slate-800'
            }`}
            title="Tableau des Records de Vitesse"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const newMuted = !isMuted;
              setIsMuted(newMuted);
              soundFx.setMuted(newMuted);
            }}
            className="p-1.5 text-xs text-slate-300 hover:text-white bg-slate-900/60 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMuted ? "Activer le son" : "Couper le son"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
          </button>

          {/* Reset Arena */}
          <button
            onClick={() => loadChapter(selectedChapter)}
            className="p-1.5 text-xs text-slate-300 hover:text-white bg-slate-900/60 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Recommencer le combat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Minecraft HUD Bar: Avatar/Skin, Hearts, Chrono, Bossbar, Inventory */}
      <div className="shrink-0 px-3 py-1.5 bg-[#0c0917] border-b border-purple-950/80 flex flex-wrap items-center justify-between gap-2">
        {/* Character Avatar & Skin Switcher */}
        <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-800/40 px-2.5 py-1 rounded-lg">
          <div className="relative">
            <img
              src="/src/assets/images/kaelen_portrait_1794053201894.jpg"
              alt="Avatar Kaelen"
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/public/assets/aistudio/Screenshot_20261110-173904.Files_by_Google_12a81208_12a81208.png';
              }}
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-black flex items-center justify-center text-[6px]"
              title="Volt veille sur vous"
            >
              🐸
            </span>
          </div>

          <div className="flex items-center gap-1">
            {[
              { id: 'kaelen', label: 'Kaelen' },
              { id: 'aria', label: 'Aria' },
              { id: 'thorne', label: 'Thorne' }
            ].map(skin => (
              <button
                key={skin.id}
                onClick={() => {
                  setPlayerSkin(skin.id as 'kaelen' | 'aria' | 'thorne');
                  soundFx.playAmethystChime(1.4);
                }}
                className={`px-1.5 py-0.5 text-[10px] font-mono rounded transition-all cursor-pointer ${
                  playerSkin === skin.id
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'bg-black/40 text-slate-400 hover:text-slate-200 hover:bg-purple-900/40'
                }`}
                title={`Incarnation : ${skin.label}`}
              >
                {skin.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minecraft 10 Hearts HUD */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5" title={`${playerHp}/100 PV`}>
            {Array.from({ length: 10 }).map((_, i) => {
              const heartValue = (i + 1) * 10;
              const isFilled = playerHp >= heartValue;
              const isHalf = playerHp >= heartValue - 5 && playerHp < heartValue;

              return (
                <span
                  key={i}
                  className={`text-xs sm:text-sm transition-transform ${isFilled ? 'text-rose-500 scale-100' : isHalf ? 'text-rose-400 scale-95 opacity-80' : 'text-slate-700'}`}
                >
                  ♥
                </span>
              );
            })}
          </div>
          <span className="text-[11px] text-slate-300 font-mono tabular-nums">
            {playerHp}/100
          </span>
        </div>

        {/* Time Attack Live Chrono Badge in HUD */}
        {isTimeAttack ? (
          <div className="flex items-center gap-2 px-2.5 py-0.5 bg-amber-950/50 border border-amber-500/50 rounded-md">
            <Timer className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-[11px] text-amber-300 font-mono font-bold tabular-nums">
              {formatChrono(elapsedTime)}
            </span>
            <span className="text-[10px] text-slate-400 font-mono border-l border-amber-900/60 pl-2">
              Rec: {formatChrono(speedrunRecords[selectedChapter] || 0)}
            </span>
          </div>
        ) : null}

        {/* Bossbar if Boss Chapter */}
        {(selectedChapter === 2 || selectedChapter === 4) && (
          <div className="flex items-center gap-2 flex-1 min-w-[180px] max-w-xs">
            <span className="text-[11px] text-rose-400 font-bold whitespace-nowrap font-cinzel">
              {selectedChapter === 2 ? "Ignis Primus" : "Ombre du Vide"}
            </span>
            <div className="w-full h-2.5 bg-black rounded-sm overflow-hidden border border-rose-900">
              <div
                className="h-full bg-gradient-to-r from-orange-600 via-rose-500 to-purple-600 transition-all duration-100"
                style={{ width: `${Math.max(0, (bossHp / maxBossHp) * 100)}%` }}
              />
            </div>
            <span className="text-[11px] text-rose-300 font-mono tabular-nums">{bossHp}/{maxBossHp}</span>
          </div>
        )}

        {/* Shards, Golden Apples & XP */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1 text-purple-300 font-bold">
            <span>💎</span>
            <span className="tabular-nums">{amethystShards}</span>
          </div>
          <div className="flex items-center gap-1 text-amber-300 font-bold">
            <span>🍏</span>
            <span className="tabular-nums">{goldenAppleCount}</span>
          </div>
          <div className="text-emerald-400 font-bold">
            Niv.{xpLevel}
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport (Fills remaining 100vh space with retractable overlay panels) */}
      <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden [container-type:size]">
        <canvas
          ref={canvasRef}
          width={840}
          height={480}
          onMouseMove={handleCanvasMouseMove}
          onClick={handleCanvasClick}
          className="w-[min(100cqw,calc(100cqh*7/4))] h-[min(100cqh,calc(100cqw*4/7))] cursor-crosshair select-none"
        />

        {/* Retractable Panneau des Paramètres & Instructions (Overlay so zero page scroll) */}
        {showSettings && (
          <div className="absolute top-0 left-0 right-0 z-30 max-h-full overflow-y-auto px-5 py-4 bg-[#140e29]/95 backdrop-blur-md border-b border-purple-800/70 space-y-3 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-2.5">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-bold text-white font-cinzel">
                  Paramètres du Jeu, Plein Écran & Commandes
                </h4>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-black/40 rounded border border-purple-800/50 hover:bg-purple-900/40 cursor-pointer"
                title="Réduire le panneau"
              >
                <X className="w-3.5 h-3.5" />
                <span>Fermer</span>
              </button>
            </div>

            {/* Section 1: Mode Plein Écran & Instruction Contextuelle Claire */}
            <div className="p-3.5 rounded-xl bg-[#0d091d] border border-purple-800/50 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-900/60 border border-purple-600/50 flex items-center justify-center text-purple-300">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>Mode Plein Écran (API Fullscreen)</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isFullscreen 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {isFullscreen ? "● ACTIVÉ" : "○ DÉSACTIVÉ"}
                      </span>
                    </div>
                    <div className="text-[11px] text-purple-300">
                      Affiche l'arène interactive sur toute la surface de votre moniteur
                    </div>
                  </div>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md ${
                    isFullscreen
                      ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/60'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                  }`}
                >
                  {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                  <span>{isFullscreen ? "Quitter le Plein Écran" : "Basculer en Plein Écran"}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-[#181132] border border-purple-900/60 text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300 text-[11px] uppercase tracking-wide">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instruction contextuelle du Mode Plein Écran :</span>
                </div>
                <p>
                  Le <strong>Mode Plein Écran</strong> fait appel à l'<strong>API Fullscreen native de votre navigateur</strong> (<code>requestFullscreen()</code>) pour projeter l'ensemble de l'arène de jeu (canvas, barres d'action, compagnon Kaelen et barre de vie de boss) sur tout votre écran. Cela élimine les distractions extérieures et optimise la précision de vos déplacements et tirs.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-purple-200 bg-purple-950/60 p-2 rounded border border-purple-800/40">
                  <span className="font-bold text-white">Raccourci de sortie :</span>
                  <span>Appuyez sur <kbd className="px-1.5 py-0.5 bg-black/80 rounded border border-purple-700 text-amber-300 font-mono text-[10px]">Échap (Esc)</kbd> ou cliquez sur <em>Quitter le Plein Écran</em> pour revenir en mode fenêtré.</span>
                </div>
              </div>
            </div>

            {/* Section 2: Commandes & Raccourcis Rapides */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0d091d] border border-purple-900/40 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Déplacements & Frappes</span>
                </div>
                <ul className="text-slate-400 text-[11px] space-y-1">
                  <li>• <strong className="text-slate-200">ZQSD / WASD / Flèches</strong> : Diriger le héros masqué</li>
                  <li>• <strong className="text-slate-200">Clic Gauche</strong> : Attaque à l'épée ou miner des cristaux</li>
                  <li>• <strong className="text-slate-200">Kaelen & Volt</strong> : Attaques d'assistance automatiques</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-[#0d091d] border border-purple-900/40 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Barre d'action rapide (Touches 1 à 7)</span>
                </div>
                <ul className="text-slate-400 text-[11px] space-y-1">
                  <li>• <strong className="text-slate-200">1</strong> : Épée Netherite · <strong className="text-slate-200">2</strong> : Gant d'Écho</li>
                  <li>• <strong className="text-slate-200">3</strong> : Grappin Cinétique · <strong className="text-slate-200">4</strong> : Lame-Flash</li>
                  <li>• <strong className="text-slate-200">5</strong> : Phare de Volt · <strong className="text-slate-200">6</strong> : Pomme Dorée · <strong className="text-slate-200">7</strong> : Pioche</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Retractable Speedrun Leaderboard Panel Drawer (Overlay so zero page scroll) */}
        {showLeaderboard && (
          <div className="absolute top-0 left-0 right-0 z-30 max-h-full overflow-y-auto px-5 py-4 bg-[#140e29]/95 backdrop-blur-md border-b border-amber-500/40 space-y-3 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white font-cinzel">Tableau des Records de Vitesse Personnels</h4>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const defaults = { 1: 34.5, 2: 52.8, 3: 41.2, 4: 78.4 };
                    setSpeedrunRecords(defaults);
                    localStorage.setItem('voxelcraft_speedrun_records', JSON.stringify(defaults));
                    soundFx.playAmethystChime(1.5);
                  }}
                  className="text-[11px] text-slate-400 hover:text-rose-400 underline cursor-pointer"
                >
                  Réinitialiser les records
                </button>
                <button
                  onClick={() => setShowLeaderboard(false)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-black/40 rounded border border-purple-800/50 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Fermer</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { ch: 1, name: "Village Cristallisé", boss: "Zombies" },
                { ch: 2, name: "Mer de Lave", boss: "Ignis Primus" },
                { ch: 3, name: "Forteresse End", boss: "Rôdeurs" },
                { ch: 4, name: "Faille Finale", boss: "Ombre du Vide" }
              ].map(lvl => {
                const rec = speedrunRecords[lvl.ch] || 999;
                const rank = getSpeedrunRank(lvl.ch, rec);

                return (
                  <div key={lvl.ch} className="p-3 rounded-xl bg-[#0b0817] border border-purple-900/40 space-y-1">
                    <div className="text-[11px] text-slate-400 font-mono">Acte 0{lvl.ch} · {lvl.boss}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-mono text-amber-300 tabular-nums">
                        {formatChrono(rec)}
                      </span>
                      <span 
                        className="text-xs font-bold font-mono px-2 py-0.5 rounded border"
                        style={{ color: rank.color, borderColor: rank.color, backgroundColor: `${rank.color}15` }}
                      >
                        {rank.rank}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GAME OVER SCREEN OVERLAY */}
        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-300">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-rose-500 font-cinzel tracking-wider">
              VOUS ÊTES MORT !
            </h3>
            <p className="text-sm text-slate-300 text-center max-w-md">
              Les anomalies de la Faille d'Améthyste ont eu raison de votre endurance.
            </p>
            {isTimeAttack && (
              <div className="text-xs font-mono text-amber-300 bg-amber-950/40 px-3 py-1.5 rounded border border-amber-900/60">
                Temps écoulé avant défaite : {formatChrono(elapsedTime)}
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => loadChapter(selectedChapter)}
                className="px-6 py-3 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg hover:shadow-purple-500/40 transition-all cursor-pointer"
              >
                Réapparaître & Réessayer
              </button>
            </div>
          </div>
        )}

        {/* VICTORY SCREEN OVERLAY WITH CONTRE-LA-MONTRE SPEEDRUN STATS */}
        {gameState === 'VICTORY' && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in duration-300">
            <div className="w-14 h-14 rounded-full bg-purple-900/80 border border-purple-400 flex items-center justify-center text-purple-200">
              <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel text-center">
              {isTimeAttack ? "CHRONO TERMINÉ !" : "VICTOIRE DIMENSIONNELLE !"}
            </h3>

            {/* Speedrun Result Card */}
            {isTimeAttack && rankAchieved && (
              <div className="p-4 rounded-2xl bg-[#140e29] border border-amber-500/40 max-w-sm w-full text-center space-y-2 shadow-2xl">
                <div className="flex items-center justify-center gap-2">
                  <span 
                    className="text-2xl font-black font-mono px-3 py-1 rounded-lg border shadow-sm"
                    style={{ color: rankAchieved.color, borderColor: rankAchieved.color, backgroundColor: `${rankAchieved.color}20` }}
                  >
                    RANG {rankAchieved.rank}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  {rankAchieved.title}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-900/50 text-xs font-mono">
                  <div className="p-2 rounded bg-black/40">
                    <div className="text-[10px] text-slate-400">Temps Réalisé :</div>
                    <div className="text-sm font-bold text-amber-300">{formatChrono(elapsedTime)}</div>
                  </div>
                  <div className="p-2 rounded bg-black/40">
                    <div className="text-[10px] text-slate-400">Record Personnel :</div>
                    <div className="text-sm font-bold text-purple-300">{formatChrono(speedrunRecords[selectedChapter] || elapsedTime)}</div>
                  </div>
                </div>

                {isNewRecord && (
                  <div className="py-1 px-2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-pulse">
                    🏆 NOUVEAU RECORD PERSONNEL !
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-purple-200/90 text-center max-w-md">
              {selectedChapter === 2
                ? "L'Ignis Primus s'effondre en cendres ! Le Cœur de Basalte a été sécurisé !"
                : selectedChapter === 4
                ? "La Faille Primordiale a été scellée ! L'univers retrouve son équilibre !"
                : "Zone nettoyée ! L'artefact résonnant a été activé !"}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {selectedChapter < 4 && (
                <button
                  onClick={() => loadChapter(selectedChapter + 1)}
                  className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg hover:shadow-emerald-500/40 transition-all cursor-pointer"
                >
                  Passer au Chapitre Suivant ({selectedChapter + 1})
                </button>
              )}
              <button
                onClick={() => loadChapter(selectedChapter)}
                className="px-5 py-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all cursor-pointer"
              >
                Retenter ce combat (Chrono)
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Compact Bottom Strip: Kaelen Punchline & 7-Slot Hotbar */}
      <div className="shrink-0 bg-[#0a0815] border-t border-purple-900/40">
        {/* Slim Dynamic Kaelen Punchline Bar */}
        <div className="px-3 py-1 bg-[#130f24] border-b border-purple-900/30 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <div className="flex-1 text-xs text-purple-200 italic truncate font-sans">
            <span className="font-bold text-purple-400 not-italic mr-1.5">[Kaelen]</span>
            {kaelenQuote}
          </div>
          <button
            onClick={() => soundFx.speakPunchline(kaelenQuote.replace(/[«»]/g, ''))}
            className="px-2 py-0.5 text-[11px] text-purple-300 hover:text-white bg-purple-950/70 hover:bg-purple-900 border border-purple-700/50 rounded transition-colors whitespace-nowrap cursor-pointer shrink-0"
          >
            Voix
          </button>
        </div>

        {/* Compact Minecraft-Style Hotbar */}
        <div className="px-3 py-2 flex flex-wrap items-center justify-center sm:justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {hotbarItems.map(item => {
              const isActive = activeSlot === item.slot;

              return (
                <button
                  key={item.slot}
                  onClick={() => triggerActiveSlot(item.slot)}
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer group shrink-0 ${
                    isActive
                      ? 'bg-purple-800/80 border-2 border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.5)] scale-105'
                      : 'bg-[#151128] border border-purple-900/60 hover:bg-[#1f193d] hover:border-purple-700'
                  }`}
                  title={`${item.name} — ${item.desc} (Touche ${item.key})`}
                >
                  <span className="absolute top-0.5 left-1 text-[9px] font-mono text-slate-400 group-hover:text-purple-300 leading-none">
                    {item.key}
                  </span>

                  <div className="group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>

                  {item.count !== undefined && (
                    <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-amber-300 leading-none">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-purple-300/90">
            <strong className="text-white">{hotbarItems.find(i => i.slot === activeSlot)?.name}</strong>
            <span className="text-slate-400">— {hotbarItems.find(i => i.slot === activeSlot)?.desc}</span>
          </div>

          {/* Mobile On-Screen Direction Buttons for Touchscreens */}
          <div className="sm:hidden flex items-center justify-center gap-2 pt-1.5 border-t border-purple-950/60 w-full">
            <div className="grid grid-cols-3 gap-1 w-32">
              <div />
              <button
                onPointerDown={() => { stateRef.current.keys['up'] = true; }}
                onPointerUp={() => { stateRef.current.keys['up'] = false; }}
                className="p-2 bg-purple-950/80 border border-purple-800 rounded flex items-center justify-center text-white"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <div />
              <button
                onPointerDown={() => { stateRef.current.keys['left'] = true; }}
                onPointerUp={() => { stateRef.current.keys['left'] = false; }}
                className="p-2 bg-purple-950/80 border border-purple-800 rounded flex items-center justify-center text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onPointerDown={() => { stateRef.current.keys['down'] = true; }}
                onPointerUp={() => { stateRef.current.keys['down'] = false; }}
                className="p-2 bg-purple-950/80 border border-purple-800 rounded flex items-center justify-center text-white"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onPointerDown={() => { stateRef.current.keys['right'] = true; }}
                onPointerUp={() => { stateRef.current.keys['right'] = false; }}
                className="p-2 bg-purple-950/80 border border-purple-800 rounded flex items-center justify-center text-white"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => triggerActiveSlot(activeSlot)}
              className="flex-1 py-3 px-3 bg-purple-600 active:bg-purple-700 text-white rounded-xl font-bold text-xs"
            >
              ACTION / FRAPPE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
