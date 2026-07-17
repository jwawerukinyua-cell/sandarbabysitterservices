/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { BabysitterProfile, ThemeConfig } from "../types";
import { THEMES } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Copy, Check, Sliders, MessageSquare, Code, Phone, Info, Share2, ToggleLeft, Palette, BarChart3, Bell, Send, TrendingUp } from "lucide-react";

interface PitchDashboardProps {
  profile: BabysitterProfile;
  setProfile: (profile: BabysitterProfile) => void;
  selectedTheme: ThemeConfig;
  setSelectedTheme: (theme: ThemeConfig) => void;
}

export default function PitchDashboard({
  profile,
  setProfile,
  selectedTheme,
  setSelectedTheme,
}: PitchDashboardProps) {
  const [activeTab, setActiveTab] = useState<"pitch" | "customize" | "analytics">("pitch");
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Webhook and Alert Config States
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState(() => {
    const metaEnv = (import.meta as any).env || {};
    return localStorage.getItem("developer_discord_webhook_url") || metaEnv.VITE_DISCORD_WEBHOOK_URL || "";
  });
  const [telegramBotToken, setTelegramBotToken] = useState(() => {
    const metaEnv = (import.meta as any).env || {};
    return localStorage.getItem("developer_telegram_bot_token") || metaEnv.VITE_TELEGRAM_BOT_TOKEN || "";
  });
  const [telegramChatId, setTelegramChatId] = useState(() => {
    const metaEnv = (import.meta as any).env || {};
    return localStorage.getItem("developer_telegram_chat_id") || metaEnv.VITE_TELEGRAM_CHAT_ID || "";
  });
  const [testSent, setTestSent] = useState<"none" | "sending" | "success" | "error">("none");

  // Read real-time click metrics
  const clickCount = parseInt(localStorage.getItem("whatsapp_click_count") || "0", 10);
  const clickLogs = JSON.parse(localStorage.getItem("whatsapp_click_logs") || "[]");

  // Save Config Handlers
  const handleSaveConfig = (key: string, val: string, setter: (v: string) => void) => {
    setter(val);
    localStorage.setItem(key, val);
  };

  const handleSendTestAlert = async () => {
    setTestSent("sending");
    const testMessage = `🚀 **SANDRA'S BOOKING NOTIFICATION TEST**\n\nHello! This is a test alert confirming your telemetry works perfectly!\n\n📈 STATUS: Active & Ready\n📍 DEVICE: Connected`;

    try {
      let sentToDiscord = false;
      let sentToTelegram = false;

      if (discordWebhookUrl.trim().startsWith("https://discord.com/api/webhooks/")) {
        const res = await fetch(discordWebhookUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: testMessage,
            username: "Booking Telemetry Bot"
          })
        });
        if (res.ok) sentToDiscord = true;
      }

      if (telegramBotToken.trim() && telegramChatId.trim()) {
        const text = encodeURIComponent(testMessage.replace(/\*\*/g, "*"));
        const res = await fetch(`https://api.telegram.org/bot${telegramBotToken.trim()}/sendMessage?chat_id=${telegramChatId.trim()}&text=${text}`);
        if (res.ok) sentToTelegram = true;
      }

      if (sentToDiscord || sentToTelegram) {
        setTestSent("success");
      } else {
        setTestSent("error");
      }
    } catch (e) {
      console.error(e);
      setTestSent("error");
    }
    setTimeout(() => setTestSent("none"), 4000);
  };

  const pitchText = `Hi Sandra! 🌸

I love your TikTok content on @babysitternairobi! You provide such a valuable service for parents across Nairobi, and it's clear you're building a highly-trusted brand ❤️

Currently, when parents find you on TikTok, they have to squint at screenshots of your rates, scroll through images of neighborhoods, or try to message you blindly. Some premium clients in estates like Westlands, Runda, and Karen might hesitate because there isn't a dedicated, professional space where they can check details and book you.

I designed a premium, interactive, mobile-responsive landing page specifically for you! Here is why it will multiply your bookings:

✨ Interactive Booking Estimator: Parents can select standard hours, half-day, or date-nights, and get a neat live cost estimate.
🗺️ Interactive Estate Finder: Parents can instantly search their neighborhood (e.g., Kileleshwa, Syokimau, Ruaka) to see if you travel there.
🔒 Professional Safety & Contracts Section: Highlights your transition from "sending ID copies around" to safe Contract Agreements, raising your trust level.
💬 Instant WhatsApp Booking: Converts interest into a one-click pre-filled WhatsApp message sent straight to your phone (0117280445).

I built this with a beautiful, child-friendly design. You can check the live site and preview how it works on your phone! 

Would you like to host this under your own custom domain (e.g., babysitternairobi.com or babysitternairobi.co.ke) to look like the most elite, premium childcare brand in Kenya? Let me know what you think! 🌸`;

  const copyPitchToClipboard = () => {
    navigator.clipboard.writeText(pitchText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleRateChange = (field: keyof BabysitterProfile, value: number) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleTextChange = (field: keyof BabysitterProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="bg-slate-900 text-slate-100 border-b border-slate-800 transition-all duration-300 relative z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 text-rose-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-wide text-slate-200">
                  ONE-PAGE AGENCY PITCH DECK & TEMPLATE ENGINE
                </span>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-widest border border-rose-500/30">
                  Developer Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                A custom high-converting template built for Sandra (@babysitternairobi) — designed to convert high-end parents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700/80 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Sliders className="w-3.5 h-3.5" />
              {isCollapsed ? "Open Pitch Panel" : "Minimize Controls"}
            </button>
            <div className="text-xs text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Synced
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-4 pt-4 border-t border-slate-800"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
                {/* Tabs selection */}
                <div className="lg:col-span-3 flex flex-col gap-2">
                  <div className="text-xs uppercase tracking-widest text-slate-500 font-mono font-bold mb-1">
                    Control Center
                  </div>
                  <button
                    onClick={() => setActiveTab("pitch")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                      activeTab === "pitch"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "hover:bg-slate-800 text-slate-400 border border-transparent"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Copy Pitch Message
                  </button>
                  <button
                    onClick={() => setActiveTab("customize")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                      activeTab === "customize"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "hover:bg-slate-800 text-slate-400 border border-transparent"
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    Customize Rate & Text
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                      activeTab === "analytics"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                        : "hover:bg-slate-800 text-slate-400 border border-transparent"
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Booking Analytics
                  </button>

                  <div className="mt-4 p-3 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-400 text-[11px] leading-relaxed">
                    <div className="flex items-start gap-1.5 text-slate-300 font-medium mb-1 font-mono">
                      <Info className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                      PITCH INSIGHTS
                    </div>
                    TikTok is fine for organic reach, but premium parents in affluent Nairobi communities (Ksh 150k+ school fees) expect a trusted digital home. This landing page guarantees Sandra looks like an absolute professional agency rather than an amateur helper.
                  </div>
                </div>

                {/* Tab content */}
                <div className="lg:col-span-9 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 min-h-[220px]">
                  {activeTab === "pitch" && (
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400 font-mono">
                            PERSUASIVE COLD DM PITCH FOR SANDRA
                          </span>
                          <button
                            onClick={copyPitchToClipboard}
                            className="bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 px-2.5 py-1 rounded border border-slate-700 flex items-center gap-1.5 transition-colors font-semibold"
                          >
                            {copiedPitch ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                Copied Pitch!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy Message Text
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/40 text-[11px] font-mono text-slate-300 leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre-wrap select-all">
                          {pitchText}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2 bg-slate-900/40 p-2 rounded border border-slate-800/40">
                        <Share2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>
                          <strong>Pro Tip:</strong> Send her this template preview link directly in her TikTok DM or WhatsApp. Seeing her own rates, counties (Nairobi, Kiambu, Machakos, Kajiado), and a functioning WhatsApp button makes this a nearly 100% close rate!
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === "customize" && (
                    <div>
                      <div className="text-xs text-slate-400 font-mono mb-3">
                        EDIT ACTIVE LIVE PREVIEW (See rates, info, and links update instantly below)
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1 uppercase">
                            Hourly Care (KSh)
                          </label>
                          <input
                            type="number"
                            value={profile.hourlyRate}
                            onChange={(e) => handleRateChange("hourlyRate", Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1 uppercase">
                            Half Day care (KSh)
                          </label>
                          <input
                            type="number"
                            value={profile.halfDayRate}
                            onChange={(e) => handleRateChange("halfDayRate", Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1 uppercase">
                            Full Day care (KSh)
                          </label>
                          <input
                            type="number"
                            value={profile.fullDayRate}
                            onChange={(e) => handleRateChange("fullDayRate", Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1 uppercase">
                            Date Night care (KSh)
                          </label>
                          <input
                            type="number"
                            value={profile.dateNightRate}
                            onChange={(e) => handleRateChange("dateNightRate", Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1 uppercase">
                            Caregiver Name
                          </label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => handleTextChange("name", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1 uppercase">
                            WhatsApp Number (Int'l)
                          </label>
                          <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => handleTextChange("phone", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                            placeholder="e.g. 254117280445"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 font-mono font-bold mb-1 uppercase">
                            TikTok Username
                          </label>
                          <input
                            type="text"
                            value={profile.handle}
                            onChange={(e) => handleTextChange("handle", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "analytics" && (
                    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                      <div>
                        <div className="text-xs text-slate-400 font-mono mb-1 uppercase">
                          Real-Time Booking Lead Analytics
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal mb-3">
                          These metrics track whenever a parent clicks the "Pre-fill WhatsApp Book" button on this browser session. Clear your cache to reset or view sandbox test leads.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-mono uppercase block">Total Booking Clicks</span>
                            <span className="text-2xl font-bold font-mono text-rose-400 block mt-0.5">{clickCount}</span>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-mono uppercase block">Est. Revenue Facilitated</span>
                            <span className="text-2xl font-bold font-mono text-emerald-400 block mt-0.5">
                              {profile.currency} {(clickLogs.reduce((acc: number, log: any) => acc + (log.estimate || 0), 0) || (clickCount * 3000)).toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                            <span className="text-[10px] text-slate-500 font-mono uppercase block">Partnership Value Prop</span>
                            <span className="text-2xl font-bold font-mono text-indigo-400 block mt-0.5">
                              {clickCount > 0 ? `${Math.round((3000 / (clickLogs.reduce((acc: number, log: any) => acc + (log.estimate || 0), 0) || clickCount * 3000)) * 100)}% Fee Cost` : "N/A"}
                            </span>
                          </div>
                        </div>

                        {clickLogs.length > 0 ? (
                          <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/60">
                            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block mb-1.5">Last 3 Active Interactions</span>
                            <div className="space-y-1.5">
                              {clickLogs.slice(0, 3).map((log: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-[10px] bg-slate-950/50 p-1.5 rounded border border-slate-900 font-mono">
                                  <div className="text-slate-300">
                                    {log.service ? log.service.toUpperCase() : "CARE REQUEST"} • {log.children} {log.children > 1 ? "kids" : "kid"} • {log.hours}h
                                  </div>
                                  <div className="text-emerald-400 font-bold">
                                    {profile.currency} {(log.estimate || 0).toLocaleString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-500 text-center py-2 bg-slate-900/20 border border-dashed border-slate-800 rounded-lg font-mono">
                            No WhatsApp clicks detected yet. Click the "Pre-fill WhatsApp Book" button below to simulate!
                          </div>
                        )}
                      </div>

                      <div className="border-t border-slate-800/80 pt-3">
                        <div className="text-xs text-slate-400 font-mono mb-1 uppercase">
                          Monthly Review & Pitching Partnership Strategy
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                          To make this 3k–5k KSh / month subscription work flawlessly without scaring Sandra, approach the monthly pitch session like this:
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-[10px] text-slate-400 leading-relaxed">
                          <li>
                            <strong className="text-slate-200">Demonstrate Tangible ROI:</strong> Frame the subscription as a tiny percentage of her actual revenue. Show her: <em>"Look Sandra, this month parents used your estimator and clicked {clickCount || 5} times, generating an estimated {profile.currency} {((clickLogs.reduce((acc: number, log: any) => acc + (log.estimate || 0), 0) || (clickCount * 3000)) || 15000).toLocaleString()} KSh in bookings. The 3,000 KSh custom domain upkeep pays for itself with your very first client!"</em>
                          </li>
                          <li>
                            <strong className="text-slate-200">Independent Brand Strategy:</strong> Point out that having her own <code>babysitternairobi.co.ke</code> domain gives her permanent independence from TikTok's volatile algorithm, transforming her into an elite local service.
                          </li>
                          <li>
                            <strong className="text-slate-200">Data Consent Transparency:</strong> Mention you integrated Kenya Data Protection Act 2019 photo sharing controls to safeguard her legally, proving you are a highly professional technological partner.
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
