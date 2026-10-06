import {
  capitalize,
  getSpriteUrl,
  getTypeColor,
  getTypeTextColor,
} from "../utils.js";

function TeamBuilder({
  team,
  onRemoveFromTeam,
  onSelectPokemon,
  onClearTeam,
  onRandomTeam,
  currentPokemon,
  onAddToTeam,
}) {
  const maxSlots = 6;
  const emptySlotsCount = Math.max(0, maxSlots - team.length);

  // Calculate team coverage stats
  const coveredTypes = Array.from(
    new Set(team.flatMap((p) => p.types || []))
  );
  const totalTeamHp = team.reduce((acc, p) => acc + (p.hp || 50), 0);
  const avgTeamBst =
    team.length > 0
      ? Math.round(team.reduce((acc, p) => acc + (p.bst || 300), 0) / team.length)
      : 0;

  return (
    <footer className="team-builder-banner">
      <div className="team-builder-inner">
        {/* Banner Header */}
        <div className="team-builder-header">
          <div className="team-header-title">
            <span className="feature-step-num">④</span>
            <h3>Poké-Team Builder (Penyusun Tim Pokémon)</h3>
            <span className="team-capacity-pill">
              {team.length} / {maxSlots} Active Roster
            </span>
          </div>

          <div className="team-header-controls">
            <button
              type="button"
              className="team-ctl-btn btn-add-active"
              onClick={() => onAddToTeam(currentPokemon)}
              disabled={team.length >= maxSlots}
              title="Add currently inspected Pokémon to squad"
            >
              ➕ Add Current ({capitalize(currentPokemon?.name || "Active")})
            </button>
            <button
              type="button"
              className="team-ctl-btn btn-random-squad"
              onClick={onRandomTeam}
              title="Randomize a 6-Pokémon champion squad"
            >
              🎲 Random Team
            </button>
            {team.length > 0 && (
              <button
                type="button"
                className="team-ctl-btn btn-clear-squad"
                onClick={onClearTeam}
                title="Clear all squad members"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>

        {/* 6 Circular Pokéball Slots */}
        <div className="pokeball-slots-row">
          {/* Active Members */}
          {team.map((member, index) => {
            const primaryType = member.types[0] || "normal";
            return (
              <div
                key={`${member.id}-${index}`}
                className="pokeball-slot-item is-filled"
                style={{
                  "--slot-color": getTypeColor(primaryType),
                }}
                onClick={() => onSelectPokemon(member)}
                title={`Click to inspect ${capitalize(member.name)}`}
              >
                <button
                  type="button"
                  className="slot-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromTeam(index);
                  }}
                  title="Remove from squad"
                >
                  ✕
                </button>

                <div className="pokeball-globe">
                  <div className="pokeball-top-half"></div>
                  <div className="pokeball-divider-strip">
                    <div className="pokeball-center-core"></div>
                  </div>
                  <div className="pokeball-bottom-half"></div>
                  <img
                    src={getSpriteUrl(member.id)}
                    alt={member.name}
                    className="slot-pokemon-sprite"
                  />
                </div>

                <div className="slot-info">
                  <span className="slot-poke-name">
                    {capitalize(member.name)}
                  </span>
                  <div className="slot-type-pills">
                    {member.types.map((t) => (
                      <span
                        key={t}
                        className="slot-mini-type"
                        style={{
                          backgroundColor: getTypeColor(t),
                          color: getTypeTextColor(t),
                        }}
                      >
                        {t.slice(0, 3).toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty Slots */}
          {Array.from({ length: emptySlotsCount }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="pokeball-slot-item is-empty"
              onClick={() => onAddToTeam(currentPokemon)}
              title="Click to fill this slot with the active Pokémon"
            >
              <div className="pokeball-globe empty-globe">
                <div className="pokeball-top-half"></div>
                <div className="pokeball-divider-strip">
                  <div className="pokeball-center-core">
                    <span className="empty-plus">+</span>
                  </div>
                </div>
                <div className="pokeball-bottom-half"></div>
              </div>
              <div className="slot-info">
                <span className="slot-empty-label">
                  Slot #{team.length + i + 1}
                </span>
                <span className="slot-empty-sub">Available</span>
              </div>
            </div>
          ))}
        </div>

        {/* Team Synergy & Type Coverage Summary Bar */}
        {team.length > 0 && (
          <div className="team-synergy-bar">
            <div className="synergy-stat">
              <span className="stat-label">TOTAL SQUAD HP:</span>
              <strong>{totalTeamHp} HP</strong>
            </div>
            <div className="synergy-stat">
              <span className="stat-label">AVG POWER (BST):</span>
              <strong>{avgTeamBst}</strong>
            </div>
            <div className="synergy-coverage">
              <span className="stat-label">TYPE COVERAGE ({coveredTypes.length}/18):</span>
              <div className="coverage-pill-row">
                {coveredTypes.map((t) => (
                  <span
                    key={t}
                    className="coverage-type-tag"
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
          </div>
        )}
      </div>
    </footer>
  );
}

export default TeamBuilder;
