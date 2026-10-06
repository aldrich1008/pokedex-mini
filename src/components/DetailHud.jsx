import { useState, useEffect } from "react";
import {
  capitalize,
  getSpriteUrl,
  getTypeColor,
  getTypeTextColor,
  getTypeGlow,
  getCombatMatchups,
  parseEvolutionChain,
  playPokemonCry,
  formatStatName,
} from "../utils.js";
import { API_BASE_URL } from "../config.js";

function DetailHud({
  pokemon,
  allPokemon,
  onSelectPokemon,
  onAddToTeam,
  favorites,
  onToggleFavorite,
}) {
  const [speciesData, setSpeciesData] = useState(null);
  const [evolutionStages, setEvolutionStages] = useState([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Stats Compare Mode state
  const [comparePokemonId, setComparePokemonId] = useState(
    pokemon.id === 1 ? 4 : 1 // default compare against Charmander if Bulbasaur, else Bulbasaur
  );
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const primaryType = pokemon?.types?.[0] || "normal";
  const typeColor = getTypeColor(primaryType);
  const typeGlow = getTypeGlow(primaryType);
  const isFavorite = favorites.includes(pokemon?.id);

  // Fetch Species & Evolution Chain on pokemon change
  useEffect(() => {
    if (!pokemon?.id) return;
    let isCurrent = true;
    setIsLoadingDetails(true);

    async function fetchDeepDetails() {
      try {
        const speciesRes = await fetch(
          `${API_BASE_URL}/pokemon-species/${pokemon.id}`
        );
        if (!speciesRes.ok) throw new Error("Species not found");
        const sData = await speciesRes.json();

        if (isCurrent) setSpeciesData(sData);

        if (sData.evolution_chain?.url) {
          const evoRes = await fetch(sData.evolution_chain.url);
          if (evoRes.ok) {
            const evoData = await evoRes.json();
            if (isCurrent) {
              const stages = parseEvolutionChain(evoData.chain);
              setEvolutionStages(stages);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load deep species/evolution data:", err);
      } finally {
        if (isCurrent) setIsLoadingDetails(false);
      }
    }

    fetchDeepDetails();

    return () => {
      isCurrent = false;
    };
  }, [pokemon?.id]);

  // Audio Play Handler
  const handlePlayCry = () => {
    if (!pokemon?.id) return;
    setIsPlayingAudio(true);
    playPokemonCry(pokemon.id);
    setTimeout(() => setIsPlayingAudio(false), 900);
  };

  // Flavor text
  let flavorText = "A mysterious Pokémon discovered in the Kanto region.";
  if (speciesData?.flavor_text_entries) {
    const enEntry = speciesData.flavor_text_entries.find(
      (entry) => entry.language.name === "en"
    );
    if (enEntry) {
      flavorText = enEntry.flavor_text.replace(/[\f\n\r]/g, " ");
    }
  }

  // Combat Matchups calculation
  const { weakTo, resistantTo } = getCombatMatchups(pokemon.types);

  // Compare Opponent Pokemon
  const comparePokemon =
    allPokemon.find((p) => p.id === Number(comparePokemonId)) || allPokemon[0];

  return (
    <div
      className="detail-hud-panel"
      style={{
        "--hud-type-color": typeColor,
        "--hud-type-glow": typeGlow,
      }}
    >
      {/* ================= HUD HEADER & ACTIONS ================= */}
      <div className="hud-header">
        <div className="hud-title-wrap">
          <span className="hud-badge-id">
            #{String(pokemon.id).padStart(3, "0")}
          </span>
          <h2 className="hud-pokemon-name">{capitalize(pokemon.name)}</h2>
          <div className="hud-type-tags">
            {pokemon.types.map((t) => (
              <span
                key={t}
                className="hud-type-pill"
                style={{
                  backgroundColor: getTypeColor(t),
                  color: getTypeTextColor(t),
                }}
              >
                {capitalize(t)}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: Cry, Favorite, Add to Squad */}
        <div className="hud-actions-bar">
          <button
            type="button"
            className={`hud-btn-action hud-btn-cry ${
              isPlayingAudio ? "is-playing" : ""
            }`}
            onClick={handlePlayCry}
            title="Play Audio Cry"
          >
            <span className="btn-icon">🔊</span>
            <span className="btn-text">
              {isPlayingAudio ? "Playing..." : "Play Cry"}
            </span>
          </button>

          <button
            type="button"
            className={`hud-btn-action hud-btn-fav ${
              isFavorite ? "is-favorited" : ""
            }`}
            onClick={() => onToggleFavorite(pokemon.id)}
            title="Favorite Pokémon"
          >
            <span className="btn-icon">{isFavorite ? "❤️" : "🤍"}</span>
            <span className="btn-text">{isFavorite ? "Saved" : "Favorite"}</span>
          </button>

          <button
            type="button"
            className="hud-btn-action hud-btn-squad"
            onClick={() => onAddToTeam(pokemon)}
            title="Add to Poké-Team Builder"
          >
            <span className="btn-icon">⚡</span>
            <span className="btn-text">Add to Squad</span>
          </button>
        </div>
      </div>

      {/* ================= HUD HERO DISPLAY ================= */}
      <div className="hud-hero-stage">
        <div className="hud-glow-orb"></div>
        <div className="hud-rings-container">
          <div className="hud-ring ring-1"></div>
          <div className="hud-ring ring-2"></div>
        </div>
        <img
          src={getSpriteUrl(pokemon.id)}
          alt={pokemon.name}
          className="hud-hero-art"
          onClick={handlePlayCry}
          title="Click to hear cry"
        />
        <div className="hud-hero-stats-chips">
          <div className="stat-chip">
            <span className="chip-label">HEIGHT</span>
            <span className="chip-val">{pokemon.height} m</span>
          </div>
          <div className="stat-chip">
            <span className="chip-label">WEIGHT</span>
            <span className="chip-val">{pokemon.weight} kg</span>
          </div>
          <div className="stat-chip highlight-chip">
            <span className="chip-label">BASE BST</span>
            <span className="chip-val">{pokemon.bst}</span>
          </div>
        </div>
      </div>

      {/* Pokédex Lore / Flavor Text */}
      <div className="hud-lore-box">
        <p className="lore-text">"{flavorText}"</p>
      </div>

      {/* ================= FEATURE #1: EVOLUTION CHAIN ================= */}
      <div className="hud-feature-section feature-evolution">
        <div className="feature-section-header">
          <span className="feature-step-num">①</span>
          <h3>Evolution Chain (Alur Evolusi)</h3>
        </div>

        <div className="evolution-pipeline">
          {isLoadingDetails && evolutionStages.length === 0 ? (
            <div className="evo-loading">Loading evolution tree...</div>
          ) : evolutionStages.length > 0 ? (
            <div className="evo-stages-flow">
              {evolutionStages.map((stage, idx) => {
                const isCurrentStage =
                  Number(stage.id) === Number(pokemon.id);
                return (
                  <div key={stage.id} className="evo-stage-node">
                    {idx > 0 && (
                      <div className="evo-arrow-connector">
                        <span className="evo-req-badge">
                          {stage.requirement}
                        </span>
                        <span className="evo-arrow">➔</span>
                      </div>
                    )}
                    <div
                      className={`evo-card-thumb ${
                        isCurrentStage ? "is-active-evo" : ""
                      }`}
                      onClick={() => {
                        const matched = allPokemon.find(
                          (p) => Number(p.id) === Number(stage.id)
                        );
                        if (matched) onSelectPokemon(matched);
                      }}
                      title={`Inspect ${capitalize(stage.name)}`}
                    >
                      <img
                        src={getSpriteUrl(stage.id)}
                        alt={stage.name}
                        className="evo-thumb-img"
                      />
                      <span className="evo-thumb-name">
                        {capitalize(stage.name)}
                      </span>
                      <span className="evo-thumb-id">
                        #{String(stage.id).padStart(3, "0")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="evo-standalone">
              This Pokémon does not evolve (Single Stage).
            </div>
          )}
        </div>
      </div>

      {/* ================= FEATURE #2: COMBAT MATCHUPS & COUNTERS ================= */}
      <div className="hud-feature-section feature-matchups">
        <div className="feature-section-header">
          <span className="feature-step-num">②</span>
          <h3>Combat Matchups & Counters (Efektivitas Tipe)</h3>
        </div>

        <div className="matchup-grid-dual">
          {/* Weak To Section */}
          <div className="matchup-box weak-box">
            <div className="matchup-title">
              <span className="matchup-icon">⚠️</span>
              <h4>Weak To (Takes 2× - 4× Damage)</h4>
            </div>
            <div className="matchup-badges-wrap">
              {weakTo.length > 0 ? (
                weakTo.map((item) => (
                  <div
                    key={item.type}
                    className="matchup-badge weak-badge"
                    style={{
                      borderColor: getTypeColor(item.type),
                      backgroundColor: `${getTypeColor(item.type)}22`,
                    }}
                  >
                    <span
                      className="type-dot"
                      style={{ backgroundColor: getTypeColor(item.type) }}
                    ></span>
                    <span className="type-name">{capitalize(item.type)}</span>
                    <span className="multiplier-tag">{item.multiplier}×</span>
                  </div>
                ))
              ) : (
                <span className="no-matchup">No elemental weaknesses!</span>
              )}
            </div>
          </div>

          {/* Resistant To Section */}
          <div className="matchup-box resist-box">
            <div className="matchup-title">
              <span className="matchup-icon">🛡️</span>
              <h4>Resistant To (Takes 0.5× - 0× Damage)</h4>
            </div>
            <div className="matchup-badges-wrap">
              {resistantTo.length > 0 ? (
                resistantTo.map((item) => (
                  <div
                    key={item.type}
                    className="matchup-badge resist-badge"
                    style={{
                      borderColor: getTypeColor(item.type),
                      backgroundColor: `${getTypeColor(item.type)}22`,
                    }}
                  >
                    <span
                      className="type-dot"
                      style={{ backgroundColor: getTypeColor(item.type) }}
                    ></span>
                    <span className="type-name">{capitalize(item.type)}</span>
                    <span className="multiplier-tag">
                      {item.multiplier === 0 ? "Immune" : `${item.multiplier}×`}
                    </span>
                  </div>
                ))
              ) : (
                <span className="no-matchup">Standard elemental defenses.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= FEATURE #3: STATS COMPARE MODE ================= */}
      <div className="hud-feature-section feature-stats-compare">
        <div className="feature-section-header">
          <span className="feature-step-num">③</span>
          <h3>Stats Compare Mode (Bandingkan Pokémon)</h3>
          <button
            type="button"
            className="vs-toggle-btn"
            onClick={() => setIsCompareOpen(!isCompareOpen)}
          >
            {isCompareOpen ? "Collapse VS" : "⚡ Switch Rival"}
          </button>
        </div>

        {/* Rival Selector Dropdown Bar */}
        <div className="vs-selector-bar">
          <span className="vs-badge">VS</span>
          <select
            className="vs-select-input"
            value={comparePokemon.id}
            onChange={(e) => setComparePokemonId(e.target.value)}
          >
            {allPokemon.map((p) => (
              <option key={p.id} value={p.id}>
                #{String(p.id).padStart(3, "0")} {capitalize(p.name)} ({p.bst} BST)
              </option>
            ))}
          </select>
        </div>

        {/* Head-to-Head Legend */}
        <div className="vs-legend-cards">
          <div
            className="legend-card p1-card"
            style={{ borderColor: typeColor }}
          >
            <span className="legend-label">PRIMARY</span>
            <strong>{capitalize(pokemon.name)}</strong>
            <span className="legend-bst">{pokemon.bst} BST</span>
          </div>
          <span className="vs-clash-text">VS</span>
          <div
            className="legend-card p2-card"
            style={{
              borderColor: getTypeColor(comparePokemon.types[0]),
            }}
          >
            <span className="legend-label">RIVAL</span>
            <strong>{capitalize(comparePokemon.name)}</strong>
            <span className="legend-bst">{comparePokemon.bst} BST</span>
          </div>
        </div>

        {/* Comparative Dual Stat Bars */}
        <div className="stat-bars-comparison-table">
          {pokemon.stats.map((statObj) => {
            const statName = statObj.name;
            const p1Val = statObj.base;
            const p2Stat = comparePokemon.stats.find(
              (s) => s.name === statName
            );
            const p2Val = p2Stat ? p2Stat.base : 50;
            const maxRef = 160;

            const p1Width = Math.min(100, (p1Val / maxRef) * 100);
            const p2Width = Math.min(100, (p2Val / maxRef) * 100);
            const delta = p1Val - p2Val;

            return (
              <div key={statName} className="comp-stat-row">
                <div className="comp-stat-header">
                  <span className="comp-stat-title">
                    {formatStatName(statName)}
                  </span>
                  <div className="comp-stat-values">
                    <span className="val-p1">{p1Val}</span>
                    <span className="val-divider">vs</span>
                    <span className="val-p2">{p2Val}</span>
                    <span
                      className={`val-delta ${
                        delta > 0
                          ? "delta-pos"
                          : delta < 0
                          ? "delta-neg"
                          : "delta-even"
                      }`}
                    >
                      {delta > 0 ? `+${delta}` : delta < 0 ? delta : "="}
                    </span>
                  </div>
                </div>

                <div className="comp-bars-track">
                  {/* Primary bar */}
                  <div
                    className="comp-bar bar-primary"
                    style={{
                      width: `${p1Width}%`,
                      backgroundColor: typeColor,
                    }}
                    title={`${pokemon.name}: ${p1Val}`}
                  ></div>
                  {/* Rival bar */}
                  <div
                    className="comp-bar bar-rival"
                    style={{
                      width: `${p2Width}%`,
                      backgroundColor: getTypeColor(
                        comparePokemon.types[0] || "fire"
                      ),
                    }}
                    title={`${comparePokemon.name}: ${p2Val}`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DetailHud;
