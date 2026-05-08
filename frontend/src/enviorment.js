
// Use VITE_API_URL if available (Render production), otherwise use localhost/fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

const servers = {
    dev: "http://localhost:8001",
    prod: API_URL
}

export default servers;
