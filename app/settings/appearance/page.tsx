"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Sun, Moon, Monitor, Zap } from "lucide-react";

const themes = [
  { id: "dark", name: "Dark", icon: Moon, description: "Easy on the eyes" },
  { id: "light", name: "Light", icon: Sun, description: "Bright and clear" },
  { id: "auto", name: "Auto", icon: Monitor, description: "Match system" },
];

const accentColors = [
  { id: "purple", name: "Purple", color: "#4938F5" },
  { id: "blue", name: "Blue", color: "#5AC8FA" },
  { id: "green", name: "Green", color: "#34C759" },
  { id: "orange", name: "Orange", color: "#FF9500" },
  { id: "pink", name: "Pink", color: "#FF2D55" },
  { id: "indigo", name: "Indigo", color: "#5856D6" },
];

export default function AppearancePage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState("dark");
  const [selectedColor, setSelectedColor] = useState("purple");
  const [animations, setAnimations] = useState(true);

  // Load saved settings on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("vaultora_theme") || "dark";
    const savedColor = localStorage.getItem("vaultora_accent") || "purple";
    const savedAnimations = localStorage.getItem("vaultora_animations");
    
    setSelectedTheme(savedTheme);
    setSelectedColor(savedColor);
    if (savedAnimations) setAnimations(savedAnimations === "true");

    applyTheme(savedTheme);
    applyAccentColor(savedColor);
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    if (theme === "auto") {
      // Detect system preference
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.remove("dark", "light");
      root.classList.add(isDark ? "dark" : "light");
      
      // Listen for system theme changes
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
        if (selectedTheme === "auto") {
          root.classList.remove("dark", "light");
          root.classList.add(e.matches ? "dark" : "light");
        }
      });
    } else {
      root.classList.remove("dark", "light");
      root.classList.add(theme);
    }
  };

  const applyAccentColor = (color: string) => {
    document.documentElement.setAttribute("data-accent", color);
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    localStorage.setItem("vaultora_theme", theme);
    applyTheme(theme);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    localStorage.setItem("vaultora_accent", color);
    applyAccentColor(color);
  };

  const handleAnimationsToggle = () => {
    const newValue = !animations;
    setAnimations(newValue);
    localStorage.setItem("vaultora_animations", String(newValue));
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--color-background)] z-10 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-2 -ml-2 hover:bg-[var(--color-surface-primary)] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-primary)]" />
          </button>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Appearance</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Theme Selection */}
      <div className="px-4 py-6">
        <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
          Theme
        </h2>
        <div className="space-y-2">
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full p-4 rounded-2xl transition-all flex items-center justify-between ${
                  selectedTheme === theme.id
                    ? "bg-[var(--color-accent-primary)]"
                    : "bg-[var(--color-surface-primary)] hover:bg-[var(--color-surface-secondary)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    selectedTheme === theme.id ? "bg-white/20" : "bg-[var(--color-accent-primary)]/20"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      selectedTheme === theme.id ? "text-white" : "text-[var(--color-accent-primary)]"
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${
                      selectedTheme === theme.id ? "text-white" : "text-[var(--color-text-primary)]"
                    }`}>
                      {theme.name}
                    </p>
                    <p className={`text-xs ${
                      selectedTheme === theme.id ? "text-white/70" : "text-[var(--color-text-secondary)]"
                    }`}>
                      {theme.description}
                    </p>
                  </div>
                </div>
                {selectedTheme === theme.id && (
                  <Check className="w-5 h-5 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="px-4 pb-6">
        <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
          Accent Color
        </h2>
        <div className="grid grid-cols-6 gap-3">
          {accentColors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorChange(color.id)}
              className="relative aspect-square rounded-2xl transition-all hover:scale-110"
              style={{ backgroundColor: color.color }}
            >
              {selectedColor === color.id && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-4 h-4" style={{ color: color.color }} />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Animations */}
      <div className="px-4 pb-6">
        <h2 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wide mb-3">
          Animations
        </h2>
        <div className="p-4 bg-[var(--color-surface-primary)] rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[var(--color-accent-primary)]/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-[var(--color-accent-primary)]" />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text-primary)] text-sm">Enable Animations</p>
              <p className="text-xs text-[var(--color-text-secondary)]">Smooth transitions</p>
            </div>
          </div>
          <button
            onClick={handleAnimationsToggle}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              animations ? "bg-[var(--color-accent-primary)]" : "bg-[var(--color-border)]"
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                animations ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
