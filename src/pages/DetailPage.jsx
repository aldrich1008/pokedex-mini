import { useParams, Link } from "react-router-dom";
import DetailHud from "../components/DetailHud.jsx";
import { KANTO_POKEMON } from "../data/kantoPokemon.js";
import { useState } from "react";

function DetailPage() {
  const { name } = useParams();

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem("pokedex_favorites");
      return saved ? JSON.parse(saved) : [1, 4, 7, 25];
    } catch {
      return [1, 4, 7, 25];
    }
  });

  const pokemon =
    KANTO_POKEMON.find(
      (p) =>
        p.name.toLowerCase() === name?.toLowerCase() ||
        String(p.id) === name
    ) || KANTO_POKEMON[0];

  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fId) => fId !== id)
        : [...prev, id];
      localStorage.setItem("pokedex_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddToTeam = (poke) => {
    try {
      const currentTeam = JSON.parse(
        localStorage.getItem("pokedex_team") || "[]"
      );
      if (currentTeam.length >= 6) {
        alert("Team is full! Maximum 6 Pokémon.");
        return;
      }
      currentTeam.push(poke);
      localStorage.setItem("pokedex_team", JSON.stringify(currentTeam));
      alert(`Added ${poke.name.toUpperCase()} to your squad!`);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="standalone-detail-page">
      <div className="detail-top-nav">
        <Link to="/" className="btn-back-to-vault">
          ← Back to PokéDex Pro Vault
        </Link>
      </div>
      <div className="standalone-hud-container">
        <DetailHud
          pokemon={pokemon}
          allPokemon={KANTO_POKEMON}
          onSelectPokemon={() => {}}
          onAddToTeam={handleAddToTeam}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  );
}

export default DetailPage;
