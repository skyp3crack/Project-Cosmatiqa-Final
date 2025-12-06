import { useQuery } from 'convex/react';
import './App.css';
import { api } from "../../Backend/convex/_generated/api";

function App() {
  const ingredient = useQuery(api.ingredients.getIngredientByCanonicalName, { 
    canonicalName: "Retinol" 
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Cosmatiqa Frontend</h1>
      {ingredient && <p className="mt-4 text-lg">Fetched Ingredient: {ingredient.inciName}</p>}
      {!ingredient && <p className="mt-4 text-lg">Loading ingredient or not found...</p>}
    </div>
  );

  // return (
  //   <>
  //     <div>
  //       <a href="https://vite.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )
}

export default App
