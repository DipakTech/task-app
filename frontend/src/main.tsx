import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ReactQueryProvider from "./services/provider.tsx";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider queryClient={queryClient}>
      <App />
    </ReactQueryProvider>
  </StrictMode>,
);
