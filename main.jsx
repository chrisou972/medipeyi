import { createRoot } from "react-dom/client";

import MediPeyi from "./medipeyi.jsx";

createRoot(document.getElementById("root")).render(<MediPeyi />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {});
  });
}
