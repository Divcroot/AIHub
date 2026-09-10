import { useEffect, useState } from "react";
import { api } from "./lib/api";

function App() {
  const [status, setStatus] = useState("Checking API...");

  useEffect(() => {
    api
      .health()
      .then((data) => setStatus(data.message))
      .catch(() => setStatus("API connection failed"));
  }, []);

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">AI Knowledge Hub</h1>

        <p className="mt-4 text-zinc-400">
          {status}
        </p>
      </div>
    </main>
  );
}

export default App;