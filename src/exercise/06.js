// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js


import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import {   
  fetchPokemon,
  PokemonInfoFallback,
  PokemonForm,
  PokemonDataView, 
} from '../pokemon'


function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
     pokemon: null, 
     error:null
    })

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
    throw state.error;
  }  else if (state.status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (state.status === 'resolved'){
   return <PokemonDataView pokemon={state.pokemon} />
  }


}

function errorFallBack({error, resetErrorBoundary}) {
  console.log(error.message)
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try Again</button>
    </div>)
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset(){
    setPokemonName('');
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
       <ErrorBoundary FallbackComponent = {errorFallBack} onReset={handleReset} resetKeys={[pokemonName]}>
         <PokemonInfo pokemonName={pokemonName} />
       </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
