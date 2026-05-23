import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

function registerLifeOSServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            window.dispatchEvent(new CustomEvent("lifeos:update-ready"));
          }
        });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.dispatchEvent(new CustomEvent("lifeos:service-worker-active"));
      });
    } catch (error) {
      console.warn("[LifeOS:PWA] Service worker registration failed", error);
    }
  });
}

registerLifeOSServiceWorker();
