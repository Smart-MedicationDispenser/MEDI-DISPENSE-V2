import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
<<<<<<< HEAD
import ErrorBoundary from "./components/ErrorBoundary.jsx"; /* Sprint 4 */
=======
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
<<<<<<< HEAD
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
=======
    <BrowserRouter>
      <App />
    </BrowserRouter>
>>>>>>> f4adaf91c4ae0e05c8bcadf8997879a0e5b5cb04
  </StrictMode>
);