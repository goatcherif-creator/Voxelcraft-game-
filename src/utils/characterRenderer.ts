/**
 * High-fidelity Character & Sprite Renderer for Voxelcraft
 * Directly modeled after Kaelen the Rift Wanderer from the campfire scene.
 */

export interface RenderCharacterOptions {
  x: number;
  y: number;
  facing: 'left' | 'right';
  isMoving?: boolean;
  isAttacking?: boolean;
  attackProgress?: number; // 0 to 1
  animTime?: number;
  hasVolt?: boolean;
  name?: string;
  nameColor?: string;
  isKaelenCompanion?: boolean;
  skinVariant?: 'kaelen' | 'aria' | 'thorne';
  activeItem?: number; // 1: sword, 2: glove, 3: grapple, etc.
}

export function drawRiftAdventurer(
  ctx: CanvasRenderingContext2D,
  options: RenderCharacterOptions
) {
  const {
    x,
    y,
    facing,
    isMoving = false,
    isAttacking = false,
    attackProgress = 0,
    animTime = 0,
    hasVolt = false,
    name,
    nameColor = '#38bdf8',
    isKaelenCompanion = false,
    skinVariant = 'kaelen',
    activeItem = 1
  } = options;

  ctx.save();
  ctx.translate(x, y);

  // Flip horizontally if facing left
  const flip = facing === 'left' ? -1 : 1;
  ctx.scale(flip, 1);

  // Walk cycle animation parameters
  const walkBob = isMoving ? Math.sin(animTime * 12) * 2 : 0;
  const legSwing = isMoving ? Math.sin(animTime * 12) * 6 : 0;
  const capeWave = isMoving ? Math.sin(animTime * 8) * 4 : Math.sin(animTime * 3) * 1.5;

  // 1. Soft Dynamic Shadow on ground
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 16 + (isMoving ? Math.abs(walkBob) : 0), 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. Translucent Shadow Wings (Kaelen / High Rank)
  if (isKaelenCompanion || isAttacking) {
    ctx.save();
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 14;
    ctx.fillStyle = 'rgba(147, 51, 234, 0.35)';
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
    ctx.lineWidth = 1;

    // Wing behind
    ctx.beginPath();
    ctx.moveTo(-4, -10 + walkBob);
    ctx.bezierCurveTo(-26, -32 + walkBob, -38, -12 + walkBob, -32, 8 + walkBob);
    ctx.bezierCurveTo(-22, 2 + walkBob, -14, -2 + walkBob, -4, -4 + walkBob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wing foreground
    ctx.beginPath();
    ctx.moveTo(2, -12 + walkBob);
    ctx.bezierCurveTo(24, -34 + walkBob, 36, -14 + walkBob, 30, 6 + walkBob);
    ctx.bezierCurveTo(20, 0 + walkBob, 12, -4 + walkBob, 2, -6 + walkBob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 3. Flowing Traveler's Cloak / Cape (From the photo: Dark olive/brown wool cape)
  ctx.save();
  const capeColor = skinVariant === 'kaelen' ? '#2e2a24' : skinVariant === 'aria' ? '#221e33' : '#3d261e';
  const capeShadow = '#181512';
  ctx.fillStyle = capeColor;
  ctx.strokeStyle = capeShadow;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(-6, -16 + walkBob);
  ctx.lineTo(8, -16 + walkBob);
  ctx.lineTo(12 + capeWave, 12 + walkBob);
  ctx.lineTo(-12 - capeWave, 14 + walkBob);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cape fold shadows
  ctx.fillStyle = capeShadow;
  ctx.beginPath();
  ctx.moveTo(-2, -14 + walkBob);
  ctx.lineTo(-4 - capeWave * 0.5, 13 + walkBob);
  ctx.lineTo(0, 13 + walkBob);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 4. Legs & High Leather Adventurer Boots (From photo: dark trousers & tall strapped boots)
  ctx.save();
  const trouserColor = '#241e1a';
  const bootLeather = '#3a271c';
  const bootSole = '#19110c';
  const strapColor = '#523829';

  // Back leg
  ctx.fillStyle = trouserColor;
  ctx.fillRect(-8 - legSwing * 0.5, 0 + walkBob, 5, 8);
  // Back boot
  ctx.fillStyle = bootLeather;
  ctx.fillRect(-9 - legSwing * 0.5, 6 + walkBob, 6, 8);
  ctx.fillStyle = bootSole;
  ctx.fillRect(-10 - legSwing * 0.5, 13 + walkBob, 7, 2);

  // Front leg
  ctx.fillStyle = trouserColor;
  ctx.fillRect(2 + legSwing * 0.5, 0 + walkBob, 5, 8);
  // Front boot
  ctx.fillStyle = bootLeather;
  ctx.fillRect(1 + legSwing * 0.5, 6 + walkBob, 7, 8);
  // Leather wrap straps on boot
  ctx.fillStyle = strapColor;
  ctx.fillRect(1 + legSwing * 0.5, 8 + walkBob, 7, 1.5);
  ctx.fillRect(1 + legSwing * 0.5, 11 + walkBob, 7, 1.5);
  ctx.fillStyle = bootSole;
  ctx.fillRect(0 + legSwing * 0.5, 13 + walkBob, 8, 2);
  ctx.restore();

  // 5. Torso & Leather Cuirass (From photo: stitched leather armor, belt, cross-straps, shoulder brooch)
  ctx.save();
  const tunicBrown = skinVariant === 'kaelen' ? '#4a372c' : '#332742';
  const darkLeather = '#2e2118';
  const metalStud = '#a8a29e';

  // Base gambeson body
  ctx.fillStyle = tunicBrown;
  ctx.fillRect(-7, -15 + walkBob, 14, 16);

  // Chest leather armor plate
  ctx.fillStyle = darkLeather;
  ctx.fillRect(-6, -14 + walkBob, 12, 10);

  // Cross-body leather harness strap
  ctx.fillStyle = '#1c140e';
  ctx.beginPath();
  ctx.moveTo(-6, -14 + walkBob);
  ctx.lineTo(5, -4 + walkBob);
  ctx.lineTo(3, -2 + walkBob);
  ctx.lineTo(-7, -12 + walkBob);
  ctx.closePath();
  ctx.fill();

  // Heavy adventuring belt with silver buckle
  ctx.fillStyle = '#1f1610';
  ctx.fillRect(-7, -4 + walkBob, 14, 3.5);
  ctx.fillStyle = metalStud;
  ctx.fillRect(-2, -4.5 + walkBob, 4, 4.5);
  ctx.fillStyle = '#1f1610';
  ctx.fillRect(-1, -3.5 + walkBob, 2, 2.5);

  // Metal shoulder pauldron on left arm
  ctx.fillStyle = '#57534e';
  ctx.fillRect(-9, -15 + walkBob, 4, 6);
  ctx.fillStyle = '#78716c';
  ctx.fillRect(-8, -14 + walkBob, 2, 4);

  // Antique silver circular brooch pinning the cape on right collar (From photo!)
  ctx.fillStyle = '#d6d3d1';
  ctx.shadowColor = '#cbd5e1';
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(3, -13 + walkBob, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#44403c';
  ctx.beginPath();
  ctx.arc(3, -13 + walkBob, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Head & Sculpted Obsidian Mask (Directly matching Kaelen in the photo!)
  ctx.save();
  const skinTone = '#c98a65';
  const hairColor = '#2b1b14';
  const hairHighlight = '#422a1f';
  const obsidianMask = '#18141d';

  // Neck
  ctx.fillStyle = skinTone;
  ctx.fillRect(-3, -18 + walkBob, 6, 4);

  // Head base
  ctx.fillStyle = skinTone;
  ctx.fillRect(-6, -28 + walkBob, 12, 11);

  // Rugged swept-back hair (Back & Top)
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.moveTo(-7, -26 + walkBob);
  ctx.lineTo(-8, -29 + walkBob);
  ctx.lineTo(-4, -32 + walkBob);
  ctx.lineTo(6, -32 + walkBob);
  ctx.lineTo(8, -27 + walkBob);
  ctx.lineTo(5, -29 + walkBob);
  ctx.lineTo(-3, -29 + walkBob);
  ctx.closePath();
  ctx.fill();

  // Hair strands/texture
  ctx.fillStyle = hairHighlight;
  ctx.fillRect(-4, -31 + walkBob, 6, 2);
  ctx.fillRect(-6, -28 + walkBob, 3, 2);

  // The Carved Obsidian Battle Mask covering front of face (From the photo!)
  ctx.fillStyle = obsidianMask;
  ctx.fillRect(-1, -26 + walkBob, 7, 8);
  ctx.beginPath();
  ctx.moveTo(6, -26 + walkBob);
  ctx.lineTo(7, -22 + walkBob);
  ctx.lineTo(4, -18 + walkBob);
  ctx.lineTo(-1, -18 + walkBob);
  ctx.lineTo(-1, -26 + walkBob);
  ctx.closePath();
  ctx.fill();

  // Carved red/purple tribal runes on the mask (from photo)
  ctx.fillStyle = '#ec4899';
  ctx.shadowColor = '#d946ef';
  ctx.shadowBlur = 4;
  ctx.fillRect(1, -25 + walkBob, 1.5, 3);
  ctx.fillRect(3, -24 + walkBob, 2.5, 1.5);
  ctx.fillRect(2, -21 + walkBob, 2, 1.5);
  ctx.shadowBlur = 0;

  // The Piercing Glowing Violet Ender Eye (Signature!)
  ctx.fillStyle = '#a855f7';
  ctx.shadowColor = '#c084fc';
  ctx.shadowBlur = 8;
  ctx.fillRect(2, -24 + walkBob, 2.5, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(2.5, -23.5 + walkBob, 1, 1);
  ctx.shadowBlur = 0;

  // Visible Human Eye on the unmasked side
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(-4.5, -24 + walkBob, 2, 1.5);
  ctx.fillStyle = '#44403c';
  ctx.fillRect(-5, -25.5 + walkBob, 3, 1); // eyebrow
  ctx.restore();

  // 7. Arms & Legendary Greatsword with Glowing Runes (Exact sword from the photo!)
  ctx.save();
  const swordSwingAngle = isAttacking 
    ? (Math.sin(attackProgress * Math.PI) * 1.6 - 0.8)
    : (isMoving ? Math.sin(animTime * 12) * 0.2 : 0);

  // Position of hand holding the weapon
  const handX = 7;
  const handY = -8 + walkBob;

  ctx.translate(handX, handY);
  ctx.rotate(swordSwingAngle);

  // Arm with leather bracer
  ctx.fillStyle = '#4a372c';
  ctx.fillRect(-10, -3, 8, 5);
  ctx.fillStyle = '#2e2118';
  ctx.fillRect(-8, -2.5, 5, 4); // Leather bracer

  // Hand / Gauntlet
  ctx.fillStyle = '#78716c';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // THE RUNIC BROADSWORD (As depicted in the photo leaning against the log)
  // 1. Pommel
  ctx.fillStyle = '#a8a29e';
  ctx.beginPath();
  ctx.arc(0, 8, 2, 0, Math.PI * 2);
  ctx.fill();

  // 2. Leather-wrapped Hilt / Grip
  ctx.fillStyle = '#3a271c';
  ctx.fillRect(-1.5, 2, 3, 6);
  ctx.fillStyle = '#1c140e';
  ctx.fillRect(-1.5, 4, 3, 1);

  // 3. Ornate Crossguard with upturned quillons (from photo)
  ctx.fillStyle = '#78716c';
  ctx.fillRect(-7, 0, 14, 2.5);
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(-1, -1, 2, 4);

  // 4. Silver Steel Double-edged Blade
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.moveTo(-3.5, 0);
  ctx.lineTo(-3, -28);
  ctx.lineTo(0, -34); // sharp sword tip
  ctx.lineTo(3, -28);
  ctx.lineTo(3.5, 0);
  ctx.closePath();
  ctx.fill();

  // Blade edge highlight
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(-3, -28, 1, 26);

  // Blade Fuller Groove
  ctx.fillStyle = '#475569';
  ctx.fillRect(-1.2, -26, 2.4, 24);

  // 5. GLOWING RUNES ALONG THE BLADE (Signature feature from the photo!)
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 9;
  ctx.fillStyle = '#38bdf8';
  // Glyphs: ᚱ ᚢ ᚾ ᛖ
  ctx.fillRect(-0.8, -23, 1.6, 2.5);
  ctx.fillRect(-0.8, -18, 1.6, 2.5);
  ctx.fillRect(-0.8, -13, 1.6, 2.5);
  ctx.fillRect(-0.8, -8, 1.6, 2.5);
  ctx.fillRect(-0.8, -3, 1.6, 2);
  ctx.shadowBlur = 0;

  // Slashing weapon particle trail when attacking
  if (isAttacking && attackProgress > 0.1 && attackProgress < 0.9) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(0, 0, 32, -Math.PI * 0.8, -Math.PI * 0.2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  ctx.restore();

  // 8. Volt the Bioluminescent Green Frog (On shoulder, matching the photo!)
  if (hasVolt) {
    ctx.save();
    const voltX = -7;
    const voltY = -20 + walkBob;
    ctx.translate(voltX, voltY);

    // Glowing green aura
    ctx.shadowColor = '#4ade80';
    ctx.shadowBlur = 10;

    // Frog body
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.5, 3.5, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Luminous belly
    ctx.fillStyle = '#86efac';
    ctx.beginPath();
    ctx.ellipse(0.5, 0.8, 3, 2, -0.2, 0, Math.PI * 2);
    ctx.fill();

    // Back leg
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(-3, 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Cute large dark eye with golden rim
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(2, -2.5, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(2.2, -2.5, 1, 0, Math.PI * 2);
    ctx.fill();

    // Tiny floating spores from Volt
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(Math.sin(animTime * 4) * 3, -6, 1.2, 1.2);
    ctx.fillRect(Math.cos(animTime * 3) * 4, -8, 1, 1);

    ctx.restore();
  }

  // 9. Floating Name Tag over Head
  if (name) {
    ctx.save();
    ctx.scale(flip, 1); // Un-flip text so it is always legible
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    const textWidth = ctx.measureText(name).width;
    ctx.fillRect(-textWidth / 2 - 4, -38 + walkBob, textWidth + 8, 11);

    ctx.fillStyle = nameColor;
    ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, 0, -29 + walkBob);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * High-fidelity Corrupted Zombie humanoid sprite
 */
export function drawCorruptedZombieSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  facing: 'left' | 'right',
  animTime: number,
  hpPercent: number
) {
  ctx.save();
  ctx.translate(x, y);
  const flip = facing === 'left' ? -1 : 1;
  ctx.scale(flip, 1);

  const legSwing = Math.sin(animTime * 8) * 5;
  const armSwing = Math.sin(animTime * 8) * 6;

  // Ground shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(0, 14, 14, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Legs (Torn purple trousers)
  ctx.fillStyle = '#312e81';
  ctx.fillRect(-6 - legSwing * 0.5, 2, 4, 10);
  ctx.fillRect(2 + legSwing * 0.5, 2, 4, 10);

  // Torso (Torn teal shirt with rotten holes)
  ctx.fillStyle = '#0d9488';
  ctx.fillRect(-7, -12, 14, 14);

  // Amethyst crystal protrusion from shoulder
  ctx.fillStyle = '#c084fc';
  ctx.shadowColor = '#a855f7';
  ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.moveTo(-5, -12);
  ctx.lineTo(-12, -22);
  ctx.lineTo(-2, -15);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  // Outstretched zombie arms
  ctx.fillStyle = '#15803d'; // Rotten zombie flesh
  ctx.fillRect(4, -10 + armSwing * 0.3, 14, 5); // Arm reached out
  ctx.fillRect(16, -9 + armSwing * 0.3, 3, 3); // Hand

  // Head
  ctx.fillStyle = '#166534';
  ctx.fillRect(-5, -24, 11, 12);

  // Glowing red corrupt eyes
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#dc2626';
  ctx.shadowBlur = 6;
  ctx.fillRect(2, -20, 2.5, 2);
  ctx.shadowBlur = 0;

  // Amethyst crystal shard on forehead
  ctx.fillStyle = '#d946ef';
  ctx.fillRect(0, -26, 2, 3);

  // Health bar above
  ctx.scale(flip, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(-14, -32, 28, 3.5);
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(-14, -32, 28 * Math.max(0, hpPercent), 3.5);

  ctx.restore();
}
