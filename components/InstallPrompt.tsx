"use client";

import { useState, useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import Image from "next/image";

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const isDismissed = localStorage.getItem("pwa_install_dismissed");
    if (isDismissed) return;

    // Check if running as standalone (already installed)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);
    if (standalone) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // For Android/Desktop - listen for beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 2 seconds
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // For iOS - show custom prompt after 2 seconds
    if (iOS && !standalone) {
      setTimeout(() => setShowPrompt(true), 2000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      // Android/Desktop PWA install
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
        localStorage.setItem("pwa_install_dismissed", "true");
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      // For iOS, just keep the prompt visible with instructions
      // User needs to manually add to home screen
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#1C1C1E] rounded-t-3xl p-6 animate-slide-up shadow-2xl">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-white" strokeWidth={2.5} />
        </button>

        {/* App Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mb-4 shadow-xl overflow-hidden">
            <Image
              src="/icon.png"
              alt="Trust Vault"
              width={80}
              height={80}
              className="rounded-[20px] object-cover"
            />
          </div>
          <h2 className="text-[20px] font-bold text-white mb-2">Install Trust Vault</h2>
          <p className="text-[14px] text-[#8E8E93] text-center leading-relaxed">
            Add to your home screen for a better experience and quick access to your crypto wallet
          </p>
        </div>

        {/* iOS Instructions */}
        {isIOS ? (
          <div className="mb-6 p-4 bg-[#4938F5]/10 border border-[#4938F5]/30 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#4938F5] rounded-lg flex items-center justify-center flex-shrink-0">
                <Share className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white mb-2">How to Install on iOS:</p>
                <ol className="space-y-2 text-[13px] text-[#8E8E93]">
                  <li>1. Tap the <strong className="text-white">Share</strong> button below</li>
                  <li>2. Scroll and tap <strong className="text-white">"Add to Home Screen"</strong></li>
                  <li>3. Tap <strong className="text-white">"Add"</strong> in the top right</li>
                </ol>
              </div>
            </div>
          </div>
        ) : null}

        {/* Install Button */}
        {!isIOS && deferredPrompt ? (
          <button
            onClick={handleInstall}
            className="w-full py-4 bg-[#4938F5] hover:bg-[#3D2DD4] text-white text-[16px] font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
          >
            <Download className="w-5 h-5" strokeWidth={2.5} />
            Install Now
          </button>
        ) : isIOS ? (
          <button
            onClick={handleDismiss}
            className="w-full py-4 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-[16px] font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            Got It
          </button>
        ) : (
          <button
            onClick={handleDismiss}
            className="w-full py-4 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-white text-[16px] font-semibold rounded-xl transition-all active:scale-[0.98]"
          >
            Maybe Later
          </button>
        )}

        {/* Skip Text */}
        {!isIOS && (
          <button
            onClick={handleDismiss}
            className="w-full mt-3 text-[14px] text-[#8E8E93] hover:text-white transition-colors"
          >
            Maybe Later
          </button>
        )}
      </div>
    </div>
  );
}
