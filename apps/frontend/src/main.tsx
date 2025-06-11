import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "./utils/trpc";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

function Root() {
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const response = await fetch("http://localhost:3000/trpc/health");
        if (response.ok) {
          setBackendReady(true);
        }
      } catch (error) {}
    };

    const intervalId = setInterval(checkBackendHealth, 2000);

    checkBackendHealth();

    return () => clearInterval(intervalId);
  }, []);

  if (!backendReady) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1>Carregando aplicação...</h1>
      </div>
    );
  }

  return (
    <React.StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </trpc.Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
