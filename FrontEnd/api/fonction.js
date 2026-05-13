export async function fetchData(paramsApi) {
  try {
    const response = await fetch(`http://localhost:5678/api/${paramsApi}`)
    if(response.ok) {
      const data = await response.json()
      return data
    }
  } catch (exception) {
    console.error(`Error: ${exception}`)
  }
}