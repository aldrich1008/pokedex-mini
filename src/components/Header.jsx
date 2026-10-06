import { useState } from "react";
import { capitalize, TYPE_COLORS } from "../utils.js";

function Header({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  favoritesCount,
  onJumpToCompare,
  totalResults,
}) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const pokemonTypes = Object.keys(TYPE_COLORS);

  const handleClearFilters = () => {
    onSearchChange("");
    onTypeChange("all");
    onSortChange("id-asc");
    if (showFavoritesOnly) onToggleFavoritesOnly();
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedType !== "all" ||
    sortBy !== "id-asc" ||
    showFavoritesOnly;

  return (
    <header className="pokedex-master-header">
      {/* Massive Pokéball Banner */}
      <div className="header-pokeball-surface">
        <div className="pokeball-half-top"></div>
        <div className="pokeball-center-belt">
          <div className="pokeball-master-button">
            <div className="button-inner-ring">
              <div className="button-inner-core"></div>
            </div>
          </div>
        </div>
        <div className="pokeball-half-bottom"></div>

        {/* Hero Title & Branding */}
        <div className="header-brand-container">
          <div className="edition-badge">
            <span className="badge-star">★</span> KANTO 151 SPECIAL TCG EDITION <span className="badge-star">★</span>
          </div>
          <h1 className="header-3d-title">
            PokéDex <span className="title-pro">Pro</span>
          </h1>
          <p className="header-tagline">
            Interactive Trading Card Game Grid • High-Tech HUD • Combat Matchups • Team Builder
          </p>
        </div>
      </div>

      {/* Navigation & Search / Filter Deck */}
      <div className="header-controls-deck">
        <div className="controls-deck-inner">
          {/* Centered Search Bar */}
          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search for a Pokémon by name or #001..."
              className="search-input-field"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => onSearchChange("")}
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Interactive Filter Pills & Dropdowns */}
          <div className="filters-pill-row">
            {/* Type Filter Pill / Dropdown */}
            <div className="filter-pill-item dropdown-pill">
              <button
                type="button"
                className={`pill-btn ${selectedType !== "all" ? "is-active" : ""}`}
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <span className="pill-icon">🔥</span>
                <span>Type: {selectedType === "all" ? "All Types" : capitalize(selectedType)}</span>
                <span className="pill-caret">{showTypeDropdown ? "▲" : "▼"}</span>
              </button>

              {showTypeDropdown && (
                <div className="type-dropdown-menu">
                  <button
                    type="button"
                    className={`type-menu-item ${selectedType === "all" ? "selected" : ""}`}
                    onClick={() => {
                      onTypeChange("all");
                      setShowTypeDropdown(false);
                    }}
                  >
                    All Types
                  </button>
                  {pokemonTypes.map((typeKey) => (
                    <button
                      key={typeKey}
                      type="button"
                      className={`type-menu-item ${selectedType === typeKey ? "selected" : ""}`}
                      style={{
                        borderLeftColor: TYPE_COLORS[typeKey].bg,
                      }}
                      onClick={() => {
                        onTypeChange(typeKey);
                        setShowTypeDropdown(false);
                      }}
                    >
                      <span
                        className="type-dot"
                        style={{ backgroundColor: TYPE_COLORS[typeKey].bg }}
                      ></span>
                      {capitalize(typeKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Generation Pill */}
            <div className="filter-pill-item">
              <button type="button" className="pill-btn is-active" title="Gen 1 Kanto Roster">
                <span className="pill-icon">🗺️</span>
                <span>Gen 1 (Kanto 1-151)</span>
              </button>
            </div>

            {/* Sort Pill Dropdown */}
            <div className="filter-pill-item">
              <select
                className="pill-select-input"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                <option value="id-asc">Sort: # Number (Asc)</option>
                <option value="id-desc">Sort: # Number (Desc)</option>
                <option value="name-asc">Sort: Name (A-Z)</option>
                <option value="name-desc">Sort: Name (Z-A)</option>
                <option value="hp-desc">Sort: Highest HP</option>
                <option value="bst-desc">Sort: Strongest BST</option>
              </select>
            </div>

            {/* Favorites Toggle Pill */}
            <div className="filter-pill-item">
              <button
                type="button"
                className={`pill-btn ${showFavoritesOnly ? "is-active" : ""}`}
                onClick={onToggleFavoritesOnly}
              >
                <span className="pill-icon">{showFavoritesOnly ? "❤️" : "🤍"}</span>
                <span>Favorites ({favoritesCount})</span>
              </button>
            </div>

            {/* VS Compare Pill */}
            <div className="filter-pill-item">
              <button
                type="button"
                className="pill-btn pill-btn-compare"
                onClick={onJumpToCompare}
                title="Scroll to Stats Compare Mode in HUD"
              >
                <span className="pill-icon">⚔️</span>
                <span>VS Compare</span>
              </button>
            </div>

            {/* Reset Filters Pill */}
            {hasActiveFilters && (
              <div className="filter-pill-item">
                <button
                  type="button"
                  className="pill-btn pill-btn-reset"
                  onClick={handleClearFilters}
                  title="Reset all filters"
                >
                  <span className="pill-icon">↺</span>
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Result Count Summary */}
          <div className="filter-summary-strip">
            <span>
              Showing <strong>{totalResults}</strong> Pokémon
              {selectedType !== "all" && ` of ${capitalize(selectedType)} type`}
              {searchTerm && ` matching "${searchTerm}"`}
              {showFavoritesOnly && ` in Favorites`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
