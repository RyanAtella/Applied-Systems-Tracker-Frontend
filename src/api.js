const API_BASE = "https://applied-systems-tracker-1.onrender.com"; //FastAPI backend

export async function getApplications() {
    const response = await fetch(`${API_BASE}/applications`);
    return response.json();
}

export async function createApplication(application) {
    const response = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(application),
    });

    if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create application")
    }
    
    return response.json();
}

export async function deleteApplication(id) {
  const response = await fetch(`${API_BASE}/applications/${id}`, { method: "DELETE" });
  
  if (!response.ok) {
    const text = await response.text(); // optional: log server response
    console.error("Delete error response:", text);
    throw new Error("Failed to delete application");
  }
  
  return true; // or nothing
}

export async function updateApplication(id, updates) {
    const response = await fetch(`${API_BASE}/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update application");
    }

    return response.json();
}
