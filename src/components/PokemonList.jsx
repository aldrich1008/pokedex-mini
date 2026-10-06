import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import { getIdFromUrl, capitalize, getSpriteUrl } from "../utils.js";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPokemons() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/pokemon?limit=151`);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data = await response.json();
        setPokemons(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPokemons();
  }, []);

  if (isLoading) {
    return (
      <div className="pokemon-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="pokemon-card skeleton glass-panel">
            <div className="skeleton-img"></div>
            <div className="skeleton-text"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="status-message error glass-panel">Couldn't load the list: {error}</div>;
  }

  return (
    <div className="pokemon-grid">
      {pokemons.map((pokemon) => {
        const id = getIdFromUrl(pokemon.url);
        return (
          <Link key={pokemon.name} to={`/pokemon/${pokemon.name}`} className="pokemon-card glass-panel interactive">
            <div className="pokemon-id">#{id.padStart(3, "0")}</div>
            <div className="sprite-container">
              <img
                className="pokemon-sprite"
                src={getSpriteUrl(id)}
                alt={pokemon.name}
                loading="lazy"
              />
            </div>
            <h2 className="pokemon-name">{capitalize(pokemon.name)}</h2>
          </Link>
        );
      })}
    </div>
  );
}

export default PokemonList;
