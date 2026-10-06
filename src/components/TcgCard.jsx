import { useState, useRef } from "react";
import {
  capitalize,
  getSpriteUrl,
  getTypeColor,
  getTypeTextColor,
  getTypeGradient,
  getCardBorderGradient,
  getTypeGlow,
} from "../utils.js";

function TcgCard({ pokemon, isSelected, onSelect }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  const primaryType = pokemon.types[0] || "normal";
  const secondaryType = pokemon.types[1] || primaryType;
  const typeColor = getTypeColor(primaryType);
  const typeGlow = getTypeGlow(primaryType);
  const borderGradient = getCardBorderGradient(primaryType, secondaryType);

  const handleMouseMove = (e) => {
    if (isFlipped) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    const mouseXPercent = (x / rect.width) * 100;
    const mouseYPercent = (y / rect.height) * 100;

    card.style.setProperty("--rot-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--rot-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--glare-x", `${mouseXPercent.toFixed(1)}%`);
    card.style.setProperty("--glare-y", `${mouseYPercent.toFixed(1)}%`);
    card.style.setProperty("--glare-opacity", "0.75");
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.setProperty("--rot-x", "0deg");
    card.style.setProperty("--rot-y", "0deg");
    card.style.setProperty("--glare-opacity", "0");
  };

  const toggleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = () => {
    onSelect(pokemon);
  };

  return (
    <div
      className={`tcg-card-wrapper ${isSelected ? "is-selected" : ""}`}
      style={{
        "--type-theme": typeColor,
        "--type-glow": typeGlow,
        "--card-border-grad": borderGradient,
      }}
      onClick={handleCardClick}
    >
      <div
        ref={cardRef}
        className={`tcg-card-flipper ${isFlipped ? "flipped" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* ================= FRONT FACE ================= */}
        <div className="tcg-card-face tcg-card-front">
          {/* Holographic foil glare layer */}
          <div className="tcg-holo-glare"></div>

          {/* Golden/Type Beveled Frame */}
          <div className="tcg-inner-frame">
            {/* Top Bar: Name & HP */}
            <div className="tcg-header">
              <div className="tcg-header-left">
                <span className="tcg-stage-badge">BASIC</span>
                <span className="tcg-name">{capitalize(pokemon.name)}</span>
              </div>
              <div className="tcg-header-right">
                <span className="tcg-hp">
                  <span className="hp-label">HP</span>
                  <span className="hp-val">{pokemon.hp}</span>
                </span>
                <span
                  className="tcg-energy-orb"
                  style={{
                    backgroundColor: typeColor,
                    color: getTypeTextColor(primaryType),
                  }}
                  title={capitalize(primaryType)}
                >
                  {primaryType.slice(0, 2).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Middle Artwork Container */}
            <div className="tcg-art-container">
              <div
                className="tcg-art-backdrop"
                style={{ background: getTypeGradient(primaryType) }}
              ></div>
              <img
                src={getSpriteUrl(pokemon.id)}
                alt={pokemon.name}
                className="tcg-artwork"
                loading="lazy"
              />
              <button
                type="button"
                className="tcg-flip-btn"
                onClick={toggleFlip}
                title="3D Flip Card"
              >
                🔄 Flip
              </button>
            </div>

            {/* Spec Bar */}
            <div className="tcg-spec-bar">
              <span>NO. #{String(pokemon.id).padStart(3, "0")}</span>
              <span>HT: {pokemon.height}m</span>
              <span>WT: {pokemon.weight}kg</span>
            </div>

            {/* Attacks / Moves Section */}
            <div className="tcg-moves-section">
              {pokemon.attacks && pokemon.attacks.length > 0 ? (
                pokemon.attacks.map((atk, idx) => (
                  <div key={idx} className="tcg-move-row">
                    <div className="tcg-move-cost">
                      <span
                        className="tcg-cost-orb"
                        style={{ backgroundColor: typeColor }}
                      ></span>
                      {idx > 0 && (
                        <span
                          className="tcg-cost-orb"
                          style={{
                            backgroundColor: getTypeColor(secondaryType),
                          }}
                        ></span>
                      )}
                    </div>
                    <div className="tcg-move-name">{capitalize(atk.name)}</div>
                    <div className="tcg-move-damage">{atk.damage}</div>
                  </div>
                ))
              ) : (
                <div className="tcg-move-row">
                  <div className="tcg-move-cost">
                    <span
                      className="tcg-cost-orb"
                      style={{ backgroundColor: typeColor }}
                    ></span>
                  </div>
                  <div className="tcg-move-name">Tackle Strike</div>
                  <div className="tcg-move-damage">30</div>
                </div>
              )}
            </div>

            {/* Card Footer: Weakness / Resistance / Rarity */}
            <div className="tcg-footer">
              <div className="tcg-footer-rule">
                <span>weakness</span>
                <span className="footer-tag">×2</span>
              </div>
              <div className="tcg-footer-rule">
                <span>retreat</span>
                <span className="footer-tag">★</span>
              </div>
              <div className="tcg-rarity">
                <span>PRO-TCG 151/151</span>
                <span className="holo-star">★ HOLO</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div className="tcg-card-face tcg-card-back">
          <div className="tcg-back-inner">
            <div className="tcg-back-header">
              <div className="tcg-back-pokeball-emblem">
                <div className="pokeball-top"></div>
                <div className="pokeball-band">
                  <div className="pokeball-button"></div>
                </div>
                <div className="pokeball-bottom"></div>
              </div>
              <h3>{capitalize(pokemon.name)}</h3>
              <span className="tcg-back-id">
                #{String(pokemon.id).padStart(3, "0")}
              </span>
            </div>

            <div className="tcg-back-types">
              {pokemon.types.map((t) => (
                <span
                  key={t}
                  className="tcg-back-type-pill"
                  style={{
                    backgroundColor: getTypeColor(t),
                    color: getTypeTextColor(t),
                  }}
                >
                  {capitalize(t)}
                </span>
              ))}
            </div>

            <div className="tcg-back-stats">
              <div className="back-stat-row">
                <span>Base Stat Total</span>
                <strong>{pokemon.bst}</strong>
              </div>
              <div className="back-stat-row">
                <span>Primary HP</span>
                <strong>{pokemon.hp} HP</strong>
              </div>
              <div className="back-stat-row">
                <span>Height / Weight</span>
                <strong>
                  {pokemon.height}m / {pokemon.weight}kg
                </strong>
              </div>
            </div>

            <div className="tcg-back-actions">
              <button
                type="button"
                className="tcg-select-hud-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(pokemon);
                }}
              >
                🔬 Inspect in HUD
              </button>
              <button
                type="button"
                className="tcg-flip-back-btn"
                onClick={toggleFlip}
              >
                ↩ Flip to Front
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TcgCard;
