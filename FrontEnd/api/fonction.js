// Fonction générique pour récupérer les données depuis l'API
export async function fetchData(paramsApi) {
  try {
      // Appel à l'API avec le paramètre fourni ("works", "categories")
    const response = await fetch(`http://localhost:5678/api/${paramsApi}`);
    // Si la réponse est correcte, on retourne les données en JSON
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (exception) {
    // Affiche l'erreur dans la console si le fetch échoue
    console.error(`Error: ${exception}`);
  }
}
