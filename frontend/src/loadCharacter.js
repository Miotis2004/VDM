export async function loadCharacterFromBackend() {
    const response = await fetch("http://localhost:8080/api/character/load");
    return response.json();
  }
  