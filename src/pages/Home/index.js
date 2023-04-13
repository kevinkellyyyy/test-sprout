import React, { useEffect, useState } from 'react';
import axios from 'axios';
import bgPokeball1 from '../../assets/pokeball-1.png';
import bgPokeball2 from '../../assets/pokeball-2.png';
import { Link } from 'react-router-dom';
import pokeballLoading from '../../assets/pokeball-pokemon.gif';


const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get from local storage if already fetch home, to make it efficient calling, because
    // there is no endpoint for showing the list that included the pokemon types,
    // so i need to fetch every type from pokemon list, thats why i limited it for 20 pokemon
    const savedPokemon = localStorage.getItem('tempPokemon');
    if (savedPokemon) {
      setPokemonList(JSON.parse(savedPokemon));
      setLoading(false)
    } else {
      axios.get('https://pokeapi.co/api/v2/pokemon?limit=20')
        .then(response => {
          const pokemonData = response.data.results.map(pokemon => axios.get(pokemon.url));
          Promise.all(pokemonData)
            .then(responses => {
              const pokemonList = responses.map(response => {
                return {
                  name: response.data.name,
                  types: response.data.types.map(type => type.type.name)
                }
              });
              setLoading(false)
              setPokemonList(pokemonList);
              localStorage.setItem('tempPokemon', JSON.stringify(pokemonList));
            });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className='loading-wrapper'>
        <img className='pokeball-loading' src={pokeballLoading} alt="pokeball loading"/>
      </div>
    );
  }

  return (
    <div className='container'>
      <img src={bgPokeball2} height={400} width={400} alt="pokeball" className='bg-pokeball'/>
      <div className='row g-3'>
      <div className='home-title my-4'>Pokedex</div>
      {pokemonList?.map((pokemon, index) => (
        <Link to={`/details/${index+1}`} key={pokemon.name} className='col-6 col-lg-3 d-flex position-relative cursor-pointer' style={{ textDecoration: 'none' }}>
          <img src={bgPokeball1} alt="pokeball" className='bg-pokeball-cards'/>
          <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${index+1}.png`} alt="pokemon-img" className='pokemon-img'/>
          <div className='card flex-grow-1'>
            <div className='pokemon-card p-3 h-100' style={{ backgroundColor: `var(--${pokemon?.types[0]})` }}>
              <div className='pokemon-index'>#{(index+1).toString().padStart(3, '0')}</div>
              <div className='pokemon-name'>{pokemon.name}</div>
              <div className='types-wrapper mt-3'>
                {pokemon.types.map(type => (
                  <div className='types mb-2' key={type}>{type}</div>
                ))}
                {pokemon.types.length === 1 && <>
                  <div className='mb-3'>&nbsp;</div>
                </>}
              </div>
            </div>
          </div>
        </Link>
      ))}
      </div>
    </div>
  )
}

export default Home
