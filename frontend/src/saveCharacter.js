export async function saveCharacterToBackend(character) {
    const response = await fetch("http://localhost:8080/api/character/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(character),
    });
    return response.text();
  }
  