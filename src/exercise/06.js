// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js


import * as React from 'react'
import {   
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView, 
} from '../pokemon'



function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({status:'idle', pokemon: null, error:null})

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }
    setState({status:'pending', error: null})
    fetchPokemon(pokemonName).then(pokemonData => {
      setState({status:'resolved', pokemon: pokemonData});
    }).catch(error => {
      setState({status:'rejected',error: error});
    })
  }, [pokemonName])

  if(state.status === 'idle'){
    return "Submit a pokemon";
  } else if (state.status === 'rejected') {
    return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{state.error.message}</pre>
    </div>)
  }  else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (state.status === 'resolved'){
   return <PokemonDataView pokemon={state.pokemon} />
  }


}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
