import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ProgressBar from 'react-bootstrap/ProgressBar';
import bgPokeball1 from '../../assets/pokeball-1.png';
import downArrow from '../../assets/down-arrow.png';

const Details = () => {
  const { id } = useParams();

  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const pokemonResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = pokemonResponse.data;

        const pokemonSpeciesResponse = await axios.get(pokemonData.species.url);
        const pokemonSpeciesData = pokemonSpeciesResponse.data;

        const pokemonEvolutionResponse = await axios.get(pokemonSpeciesData.evolution_chain.url);
        const pokemonEvolutionData = pokemonEvolutionResponse.data;

        let genusEn = '';
        pokemonSpeciesData.genera.forEach(genus => {
          if (genus.language.name === 'en') {
            genusEn = genus.genus;
          }
        });
        setLoading(false);
        

        setDetails(Object.assign({}, pokemonData, pokemonSpeciesData, pokemonEvolutionData, {genus: genusEn}));
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const mappedAbilities = details.abilities.map((pokemonAbility, index) => {
    if (index === details.abilities.length - 1) {
      return <span key={index}>{pokemonAbility?.ability?.name}</span>;
    }
    return <span key={index}>{pokemonAbility?.ability?.name}, </span>;
  });

  function convert(meter) {
    const feet = Math.floor(meter * 3.28084);
    const remains = (meter * 3.28084 - feet) * 12;
    const inches = remains.toFixed(1);
    return `${feet}'${inches}"`;
  }

  return (
    <div className='detail-main' style={{ backgroundColor: `var(--${details?.types[0]?.type?.name})` }}>
      <div className='section-img container'>
        <div className='row mt-4'>
          <div className='col'>
            <div className='detail-title'>{details.name}</div>
          </div>
          <div className='col'>
            <div className='pokemon-index'>#{(id).toString().padStart(3, '0')}</div>
          </div>
        </div>
        <img src={bgPokeball1} height={180} width={180} alt="pokeball" className='bg-pokeball-cards-detail'/>
        <div className='types-wrapper-detail mt-2'>
          {details.types.map((typePokemon, index) => (
            <div className='types-detail px-3 py-1' key={index}>{typePokemon?.type?.name}</div>
            ))}
        </div>
      </div>
      <div className='section-tabs'>
        <img src={details?.sprites?.other?.home?.front_default} height={300} width={300} alt="pokemon-img" className='pokemon-img-detail'/>
        <Tabs
          defaultActiveKey="about"
          className="mb-3 custom-tabs"
          justify
        >
          <Tab eventKey="about" title="About" className="custom-tab">
            <div className='container'>
              <div className='tab-1 mt-3'>
                <div className='row'>
                  <div className='col-4 flex-column d-flex align-items-start'>
                    <div className='about-variable'>Species</div>
                    <div className='about-variable'>Height</div>
                    <div className='about-variable'>Width</div>
                    <div className='about-variable'>Abilities</div>
                  </div>
                  <div className='col-8 flex-column d-flex align-items-start'>
                    <div className='about-value'>{details.genus}</div>
                    <div className='about-value'>{convert(details.height/10)} ({details.height/10} m)</div>
                    <div className='about-value'>{((details.weight/10)/0.45359237).toFixed(1)} lbs ({(details.weight/10)} kg)</div>
                    <div className='about-value captalize'>{mappedAbilities}</div>
                  </div>
                </div>
              </div>
            </div>
          </Tab>
          <Tab eventKey="baseStats" title="Base Stats" className="custom-tab">
            <div className='container'>
              <div className='tab-1 mt-3'>
                {details.stats.map((stat, index) => (
                  <div className='row' key={index}>
                  <div className='col-4 flex-column d-flex align-items-start'>
                    <div className='about-variable'>{stat.stat.name}</div>
                  </div>
                  <div className='col-1 flex-column d-flex align-items-start'>
                    <div className='about-value'>{stat.base_stat}</div>
                  </div>
                  <div className='col-7'>
                    <div className='about-value-bar'><ProgressBar variant={stat.base_stat > 50 ? 'success' : 'danger'} now={stat.base_stat} /></div>
                  </div>
                </div>
                ))}
              </div>
            </div>

          </Tab>
          <Tab eventKey="evolution" title="Evolutions" className="custom-tab">
            <div className='tab-3'>
              <div className='evolve-name'>
                {details?.chain?.species.name}
              </div>
              <img className='evolve-img' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${details?.chain?.species.url.split('/')[6]}.png`} alt="pokemon-img"/>
              <img className='evolve-arrow' src={downArrow} alt="downArrow"/>
              <div className='evolve-name'>
                {details?.chain?.evolves_to[0]?.species?.name}
              </div>
              <img className='evolve-img' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${details?.chain?.evolves_to[0]?.species?.url.split('/')[6]}.png`} alt="pokemon-img"/>
              <img className='evolve-arrow' src={downArrow} alt="downArrow"/>
              <div className='evolve-name'>
                {details?.chain?.evolves_to[0]?.evolves_to[0]?.species?.name}
              </div>
              <img className='evolve-img' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${details?.chain?.evolves_to[0]?.evolves_to[0]?.species?.url.split('/')[6]}.png`} alt="pokemon-img"/>
            </div>
          </Tab>
          <Tab eventKey="moves" title="Moves" className="custom-tab">
            <div className='moves-pills captalize'>
              {details.moves.map((pokemonMoves, index) => (
                <div className='moves px-3 py-1 mb-2' key={index}>{pokemonMoves?.move?.name}</div>
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  )
}

export default Details
