/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { DEFAULT_PROFILE, THEMES } from "./data";
import { BabysitterProfile, ThemeConfig } from "./types";
import PitchDashboard from "./components/PitchDashboard";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [profile, setProfile] = useState<BabysitterProfile>(DEFAULT_PROFILE);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(THEMES[0]);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("dev") || params.has("edit") || params.has("admin")) {
        setIsDevMode(true);
      }
    }
  }, []);

  return (
    <div id="app-root" className="min-h-screen flex flex-col">
      {/* Developer Agency Tool Control Deck - Only rendered when dev mode is active */}
      {isDevMode && (
        <PitchDashboard
          profile={profile}
          setProfile={setProfile}
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
        />
      )}

      {/* Main Beautiful Landing Page Previews */}
      <main className="flex-1">
        <LandingPage profile={profile} selectedTheme={selectedTheme} />
      </main>
    </div>
  );
}

