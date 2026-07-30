import { useState, useEffect } from "react";
import ListCard from "./components/ListCard";

function App() {
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/europe.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Le format des données est invalide.");
        }

        setCountries(data);
      })
      .catch((fetchError) => {
        console.error("Error fetching countries:", fetchError);
        setError("Les données des pays sont temporairement indisponibles.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-800">
      <div className="max-w-7xl mx-auto py-20 px-4">
        <h1 className="text-gray-50 text-4xl">Europe Countries Data</h1>
        <p className="text-gray-100 text-xl mb-8">
          Click on a card to reveal a country's information.
        </p>
        {error && <p className="text-red-300 text-lg">{error}</p>}
        {!error && (
          <ul className="grid min-[450px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 auto-rows-[200px]">
            {countries.map((country) => (
              <ListCard key={country.cca2} country={country} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
