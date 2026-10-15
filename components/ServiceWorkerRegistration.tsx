"use client";

import { useEffect, useState } from "react";

export default function ServiceWorkerRegistration() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("✅ Service Worker registered:", registration);

          // Check for updates every 60 seconds
          setInterval(() => {
            registration.update();
          }, 60000);

          // Detect when a new service worker is waiting
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  console.log('🔄 New version available!');
                  setWaitingWorker(newWorker);
                  setShowUpdatePrompt(true);
                }
              });
            }
          });

          // Check if there's already a waiting worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowUpdatePrompt(true);
          }
        })
        .catch((error) => {
          console.error("❌ Service Worker registration failed:", error);
        });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[9999] md:left-auto md:w-96">
      <div className="bg-[#1C1C1E] border border-[#4938F5]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-[#4938F5]/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#4938F5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-[15px] mb-1">
              Update Available
            </h3>
            <p className="text-[#8E8E93] text-[13px] mb-3">
              A new version of Trust Vault is ready. Update now for the latest features and fixes.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 px-4 py-2 bg-[#4938F5] text-white text-[13px] font-semibold rounded-lg hover:bg-[#5D4EFF] transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="px-4 py-2 bg-[#2C2C2E] text-[#8E8E93] text-[13px] font-medium rounded-lg hover:bg-[#3C3C3E] transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
