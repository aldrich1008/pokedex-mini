import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import TcgCard from "../components/TcgCard.jsx";
import DetailHud from "../components/DetailHud.jsx";
import TeamBuilder from "../components/TeamBuilder.jsx";
import { KANTO_POKEMON } from "../data/kantoPokemon.js";

function ListPage() {
  const { name: routePokemonName } = useParams();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("id-asc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Active Selected Pokemon (defaults to Bulbasaur #1)
  const [selectedPokemon, setSelectedPokemon] = useState(KANTO_POKEMON[0]);

  // Mobile View Toggle: 'grid' or 'hud'
  const [mobileTab, setMobileTab] = useState("grid");

  // Favorites in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("pokedex_favorites");
      return saved ? JSON.parse(saved) : [1, 4, 7, 25]; // Bulbasaur, Charmander, Squirtle, Pikachu
    } catch {
      return [1, 4, 7, 25];
    }
  });

  // Team in localStorage (up to 6)
  const [team, setTeam] = useState(() => {
    try {
      const saved = localStorage.getItem("pokedex_team");
      if (saved) return JSON.parse(saved);
      // Default initial squad of popular classic starters
      return [
        KANTO_POKEMON[0], // Bulbasaur #1
        KANTO_POKEMON[24], // Pikachu #25
        KANTO_POKEMON[3], // Charmander #4
      ];
    } catch {
      return [KANTO_POKEMON[0], KANTO_POKEMON[24]];
    }
  });

  // Reference for scrolling to HUD on mobile or compare mode
  const hudContainerRef = useRef(null);

  // Sync selectedPokemon with Route param `/pokemon/:name`
  useEffect(() => {
    if (routePokemonName) {
      const normalized = routePokemonName.trim().toLowerCase();
      const match = KANTO_POKEMON.find(
        (p) =>
          p.name.toLowerCase() === normalized ||
          String(p.id) === normalized
      );
      if (match) {
        setSelectedPokemon(match);
      }
    }
  }, [routePokemonName]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pokedex_favorites", JSON.stringify(favorites));
    } catch (err) {
      console.warn("Could not save favorites:", err);
    }
  }, [favorites]);

  // Save team to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("pokedex_team", JSON.stringify(team));
    } catch (err) {
      console.warn("Could not save team:", err);
    }
  }, [team]);

  // Handle Favorite Toggle
  const handleToggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  // Handle Team Member Actions
  const handleAddToTeam = (pokemonToAdd) => {
    if (!pokemonToAdd) return;
    if (team.length >= 6) {
      alert("Your team already has the maximum of 6 Pokémon! Remove one first.");
      return;
    }
    setTeam((prev) => [...prev, pokemonToAdd]);
  };

  const handleRemoveFromTeam = (indexToRemove) => {
    setTeam((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearTeam = () => {
    if (window.confirm("Release all Pokémon from your active squad?")) {
      setTeam([]);
    }
  };

  const handleRandomTeam = () => {
    const shuffled = [...KANTO_POKEMON].sort(() => 0.5 - Math.random());
    setTeam(shuffled.slice(0, 6));
  };

  // Handle Selection of Pokemon
  const handleSelectPokemon = (p) => {
    setSelectedPokemon(p);
    navigate(`/pokemon/${p.name}`, { replace: true });
    // If on mobile, switch to HUD tab and scroll
    setMobileTab("hud");
    if (window.innerWidth < 1024 && hudContainerRef.current) {
      hudContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Jump to VS Compare in HUD
  const handleJumpToCompare = () => {
    setMobileTab("hud");
    if (hudContainerRef.current) {
      hudContainerRef.current.scrollIntoView({ behavior: "smooth" });
      const compareSection = hudContainerRef.current.querySelector(
        ".feature-stats-compare"
      );
      if (compareSection) {
        compareSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  // Filter & Sort Pokemon
  const filteredPokemon = useMemo(() => {
    return KANTO_POKEMON.filter((p) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        String(p.id).includes(searchTerm.trim());

      // Type filter
      const matchesType =
        selectedType === "all" || p.types.includes(selectedType);

      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || favorites.includes(p.id);

      return matchesSearch && matchesType && matchesFavorites;
    }).sort((a, b) => {
      switch (sortBy) {
        case "id-desc":
          return b.id - a.id;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "hp-desc":
          return b.hp - a.hp;
        case "bst-desc":
          return b.bst - a.bst;
        case "id-asc":
        default:
          return a.id - b.id;
      }
    });
  }, [searchTerm, selectedType, sortBy, showFavoritesOnly, favorites]);

  return (
    <div className="pokedex-app-shell">
      {/* 1. Header & Navigation */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
        favoritesCount={favorites.length}
        onJumpToCompare={handleJumpToCompare}
        totalResults={filteredPokemon.length}
      />

      {/* Mobile Tab Switcher */}
      <div className="mobile-view-tabs">
        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === "grid" ? "active" : ""}`}
          onClick={() => setMobileTab("grid")}
        >
          🎴 TCG Cards Grid ({filteredPokemon.length})
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === "hud" ? "active" : ""}`}
          onClick={() => setMobileTab("hud")}
        >
          🔬 Detailed HUD ({selectedPokemon.name})
        </button>
      </div>

      {/* Main Split Layout: Left (TCG Grid) & Right (Active HUD) */}
      <main className="pokedex-main-dashboard">
        {/* Left Section: 3D Holographic TCG Cards Grid */}
        <section
          className={`dashboard-left-grid ${
            mobileTab === "hud" ? "mobile-hidden" : ""
          }`}
        >
          <div className="grid-meta-banner">
            <h2>Holographic TCG Card Vault</h2>
            <span className="grid-count-badge">
              {filteredPokemon.length} Cards Discovered
            </span>
          </div>

          {filteredPokemon.length > 0 ? (
            <div className="tcg-cards-grid">
              {filteredPokemon.map((poke) => (
                <TcgCard
                  key={poke.id}
                  pokemon={poke}
                  isSelected={selectedPokemon?.id === poke.id}
                  onSelect={handleSelectPokemon}
                />
              ))}
            </div>
          ) : (
            <div className="tcg-empty-state">
              <div className="empty-state-pokeball"></div>
              <h3>No Pokémon Found in Vault!</h3>
              <p>Try modifying your search or resetting elemental filters.</p>
              <button
                type="button"
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("all");
                  setShowFavoritesOnly(false);
                }}
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </section>

        {/* Right Section: Active Detailed HUD Panel */}
        <aside
          ref={hudContainerRef}
          className={`dashboard-right-hud ${
            mobileTab === "grid" ? "mobile-hidden-phone" : ""
          }`}
        >
          <div className="hud-sticky-wrapper">
            <DetailHud
              pokemon={selectedPokemon}
              allPokemon={KANTO_POKEMON}
              onSelectPokemon={handleSelectPokemon}
              onAddToTeam={handleAddToTeam}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        </aside>
      </main>

      {/* Feature #4: Poké-Team Builder Banner */}
      <TeamBuilder
        team={team}
        onRemoveFromTeam={handleRemoveFromTeam}
        onSelectPokemon={handleSelectPokemon}
        onClearTeam={handleClearTeam}
        onRandomTeam={handleRandomTeam}
        currentPokemon={selectedPokemon}
        onAddToTeam={handleAddToTeam}
      />
    </div>
  );
}

export default ListPage;
