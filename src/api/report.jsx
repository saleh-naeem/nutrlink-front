export async function getdite() { // <-- Just removed 'info' from the parentheses!
  const token = localStorage.getItem("authToken");

  try {
    const res = await fetch(
      "http://localhost:5000/nutrlink/api/plan",
      {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "failed");
    }

    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}