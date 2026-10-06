import { SPRITE_BASE_URL, CRIES_BASE_URL } from "./config.js";

export function getIdFromUrl(url) {
  if (!url) return "1";
  const parts = url.split("/").filter(Boolean);
  return parts[parts.length - 1];
}

export function capitalize(name) {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getPixelSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getAnimatedSpriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
}

export const TYPE_COLORS = {
  normal: { bg: "#A8A77A", text: "#FFFFFF", dark: "#797850", glow: "rgba(168, 167, 122, 0.4)" },
  fire: { bg: "#EE8130", text: "#FFFFFF", dark: "#B5500A", glow: "rgba(238, 129, 48, 0.5)" },
  water: { bg: "#6390F0", text: "#FFFFFF", dark: "#2A5DBE", glow: "rgba(99, 144, 240, 0.5)" },
  electric: { bg: "#F7D02C", text: "#1F2937", dark: "#B8960A", glow: "rgba(247, 208, 44, 0.5)" },
  grass: { bg: "#7AC74C", text: "#FFFFFF", dark: "#4E8F24", glow: "rgba(122, 199, 76, 0.5)" },
  ice: { bg: "#96D9D6", text: "#1F2937", dark: "#54A9A6", glow: "rgba(150, 217, 214, 0.5)" },
  fighting: { bg: "#C22E28", text: "#FFFFFF", dark: "#891A15", glow: "rgba(194, 46, 40, 0.5)" },
  poison: { bg: "#A33EA1", text: "#FFFFFF", dark: "#6C1E6B", glow: "rgba(163, 62, 161, 0.5)" },
  ground: { bg: "#E2BF65", text: "#1F2937", dark: "#AA8933", glow: "rgba(226, 191, 101, 0.5)" },
  flying: { bg: "#A98FF3", text: "#FFFFFF", dark: "#6F50C2", glow: "rgba(169, 143, 243, 0.5)" },
  psychic: { bg: "#F95587", text: "#FFFFFF", dark: "#BF1A4F", glow: "rgba(249, 85, 135, 0.5)" },
  bug: { bg: "#A6B91A", text: "#FFFFFF", dark: "#6E7B0B", glow: "rgba(166, 185, 26, 0.5)" },
  rock: { bg: "#B6A136", text: "#FFFFFF", dark: "#7E6E1A", glow: "rgba(182, 161, 54, 0.5)" },
  ghost: { bg: "#735797", text: "#FFFFFF", dark: "#473264", glow: "rgba(115, 87, 151, 0.5)" },
  dragon: { bg: "#6F35FC", text: "#FFFFFF", dark: "#410EB5", glow: "rgba(111, 53, 252, 0.5)" },
  dark: { bg: "#705746", text: "#FFFFFF", dark: "#453225", glow: "rgba(112, 87, 70, 0.5)" },
  steel: { bg: "#B7B7CE", text: "#1F2937", dark: "#7C7C97", glow: "rgba(183, 183, 206, 0.5)" },
  fairy: { bg: "#D685AD", text: "#FFFFFF", dark: "#A34874", glow: "rgba(214, 133, 173, 0.5)" },
};

export function getTypeColor(type) {
  return TYPE_COLORS[type?.toLowerCase()]?.bg || "#9CA3AF";
}

export function getTypeTextColor(type) {
  return TYPE_COLORS[type?.toLowerCase()]?.text || "#FFFFFF";
}

export function getTypeGlow(type) {
  return TYPE_COLORS[type?.toLowerCase()]?.glow || "rgba(156, 163, 175, 0.5)";
}

export function getTypeGradient(type) {
  const c = TYPE_COLORS[type?.toLowerCase()] || TYPE_COLORS.normal;
  return `linear-gradient(135deg, ${c.bg} 0%, ${c.dark} 100%)`;
}

export function getCardBorderGradient(type1, type2) {
  const c1 = TYPE_COLORS[type1?.toLowerCase()] || TYPE_COLORS.normal;
  const c2 = TYPE_COLORS[type2?.toLowerCase()] || c1;
  return `linear-gradient(145deg, ${c1.bg} 0%, #F59E0B 35%, ${c2.bg} 70%, ${c1.dark} 100%)`;
}

// 18x18 Pokémon Type Chart Matrix for accurate combat effectiveness
export const TYPE_CHART = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export function getCombatMatchups(types = []) {
  if (!types || types.length === 0) return { weakTo: [], resistantTo: [] };
  const allTypes = Object.keys(TYPE_CHART);
  const def1 = types[0]?.toLowerCase();
  const def2 = types[1]?.toLowerCase();

  const weakTo = [];
  const resistantTo = [];

  allTypes.forEach((atk) => {
    const m1 = TYPE_CHART[atk]?.[def1] ?? 1;
    const m2 = def2 ? (TYPE_CHART[atk]?.[def2] ?? 1) : 1;
    const multiplier = m1 * m2;

    if (multiplier > 1) {
      weakTo.push({ type: atk, multiplier });
    } else if (multiplier < 1) {
      resistantTo.push({ type: atk, multiplier });
    }
  });

  // Sort by highest threat and lowest resistance
  weakTo.sort((a, b) => b.multiplier - a.multiplier);
  resistantTo.sort((a, b) => a.multiplier - b.multiplier);

  return { weakTo, resistantTo };
}

export function parseEvolutionChain(chainNode) {
  if (!chainNode) return [];
  const stages = [];

  function traverse(node, currentStageIndex = 0) {
    if (!node) return;
    const speciesName = node.species?.name;
    const parts = (node.species?.url || "").split("/").filter(Boolean);
    const id = parts[parts.length - 1];

    let requirement = "";
    if (node.evolution_details && node.evolution_details.length > 0) {
      const details = node.evolution_details[0];
      if (details.min_level) {
        requirement = `Level ${details.min_level}`;
      } else if (details.item) {
        requirement = capitalize(details.item.name.replace(/-/g, " "));
      } else if (details.trigger?.name === "trade") {
        requirement = "Trade";
      } else if (details.min_happiness) {
        requirement = "Friendship";
      } else if (details.time_of_day) {
        requirement = `${capitalize(details.time_of_day)}time`;
      } else if (details.known_move) {
        requirement = capitalize(details.known_move.name.replace(/-/g, " "));
      } else {
        requirement = "Special";
      }
    }

    stages.push({
      name: speciesName,
      id: id,
      requirement: requirement || (currentStageIndex === 0 ? "Base Form" : "Evolves"),
      stage: currentStageIndex + 1,
    });

    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach((child) => traverse(child, currentStageIndex + 1));
    }
  }

  traverse(chainNode);
  return stages;
}

export function playPokemonCry(id) {
  const url = `${CRIES_BASE_URL}/${id}.ogg`;
  const audio = new Audio(url);
  audio.volume = 0.35;
  return audio.play().catch(() => {
    // 8-bit Retro GameBoy Synthesizer Fallback
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320 + ((Number(id) * 17) % 350), ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140 + ((Number(id) * 9) % 200), ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch (e) {
      // Audio playback silently handled
    }
  });
}

export function formatStatName(statName) {
  switch (statName?.toLowerCase()) {
    case "hp":
      return "HP";
    case "attack":
      return "ATK";
    case "defense":
      return "DEF";
    case "special-attack":
      return "SP.ATK";
    case "special-defense":
      return "SP.DEF";
    case "speed":
      return "SPD";
    default:
      return statName?.toUpperCase() || "";
  }
}
