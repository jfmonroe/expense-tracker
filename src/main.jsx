import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { AppProvider } from "./context/AppContext.jsx";
import "./index.css";

/**
 * BreadWinner entry point.
 *
 * AppProvider wraps the entire app so every component can access
 * transactions, budgets, savings, filters, and navigation state
 * via the useApp() hook.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
