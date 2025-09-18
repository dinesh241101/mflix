const API_BASE = "https://xtvoewcowdvayuzettqt.supabase.co/rest/v1"; // 👈 change this if backend URL differs

export async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("fetchData error:", err);
    return [];
  }
}
