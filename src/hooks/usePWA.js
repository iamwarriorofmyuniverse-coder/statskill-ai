import { useState, useEffect } from "react";

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 1. Service Worker Registration
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[PWA] ServiceWorker registered successfully:", reg.scope);
          })
          .catch((err) => {
            console.warn("[PWA] ServiceWorker registration failed:", err);
          });
      });
    }

    // 2. Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // 3. Capture Install Prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. App Installed Listener
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log("[PWA] StatSkill AI installed successfully.");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Online/Offline Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) {
      return "SHOW_MANUAL_GUIDE";
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
      return outcome === "accepted" ? "INSTALLED" : "DISMISSED";
    } catch (err) {
      console.warn("PWA prompt error:", err);
      return "SHOW_MANUAL_GUIDE";
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    promptInstall
  };
}
