import { useState, useEffect } from "react";

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(() => (typeof window !== "undefined" ? window.deferredPWAInstallPrompt : null));
  const [isInstallable, setIsInstallable] = useState(() => (typeof window !== "undefined" ? !!window.deferredPWAInstallPrompt : false));
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    // 1. Check if already installed in standalone mode
    if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
      setIsInstalled(true);
    }

    // 2. Synchronize with globally captured prompt
    if (window.deferredPWAInstallPrompt) {
      setDeferredPrompt(window.deferredPWAInstallPrompt);
      setIsInstallable(true);
    }

    const handlePromptCaptured = () => {
      if (window.deferredPWAInstallPrompt) {
        setDeferredPrompt(window.deferredPWAInstallPrompt);
        setIsInstallable(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      if (typeof window !== "undefined") {
        window.deferredPWAInstallPrompt = null;
      }
      console.log("[PWA] StatSkill AI installed successfully.");
    };

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      window.deferredPWAInstallPrompt = e;
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("pwa-prompt-captured", handlePromptCaptured);
    window.addEventListener("pwa-app-installed", handleAppInstalled);
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 3. Online/Offline Listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("pwa-prompt-captured", handlePromptCaptured);
      window.removeEventListener("pwa-app-installed", handleAppInstalled);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const promptInstall = async () => {
    const promptEvent = window.deferredPWAInstallPrompt || deferredPrompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === "accepted") {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        window.deferredPWAInstallPrompt = null;
        setDeferredPrompt(null);
        return outcome === "accepted" ? "INSTALLED" : "DISMISSED";
      } catch (err) {
        console.warn("PWA prompt error:", err);
      }
    }
    return "SHOW_MANUAL_GUIDE";
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    promptInstall
  };
}
