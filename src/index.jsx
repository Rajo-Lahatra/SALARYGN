// src/index.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";

// ⚠️ Si tu as effectivement un fichier ./styles/index.css, garde la ligne suivante.
// Sinon, tu peux la commenter ou la supprimer pour éviter une erreur de build.
// import "./styles/index.css";

const container = document.getElementById("root");

// Sécurité : s'assurer que la div root existe avant le rendu
if (!container) {
  throw new Error("Élément #root introuvable dans index.html");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
