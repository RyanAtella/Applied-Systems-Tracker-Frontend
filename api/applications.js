// api/applications.js

// pages/api/applications.js
export default async function handler(req, res) {
  const apiUrl = "https://applied-systems-tracker-1.onrender.com/applications";

  try {
    let body = req.body;
    if (req.method !== "GET") {
      if (typeof req.body === "string") {
        body = JSON.parse(req.body); // parse stringified JSON
      }
    }

    const response = await fetch(apiUrl, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Failed to reach API" });
  }
}

