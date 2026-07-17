/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, FormEvent, useEffect } from "react";
import { BabysitterProfile, ThemeConfig, FAQItem } from "../types";
import { SERVICE_AREAS, SITUATIONS, SAFETY_FAQS, VALUES, NAIROBI_CONSTITUENCIES, INITIAL_REVIEWS, ReviewItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import {
  Heart,
  Clock,
  MapPin,
  ShieldCheck,
  Check,
  HelpCircle,
  Smartphone,
  Sparkles,
  ChevronDown,
  MessageSquare,
  Search,
  Star,
  Users,
  Camera,
  Coffee,
  Calendar,
  FileText,
  AlertCircle,
  Phone,
  Home,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Copy,
  Mail,
  Printer,
  FileDown,
  Share2,
  Lock,
  Settings,
  X,
  AlertTriangle
} from "lucide-react";

interface LandingPageProps {
  profile: BabysitterProfile;
  selectedTheme: ThemeConfig;
}

export default function LandingPage({ profile, selectedTheme }: LandingPageProps) {
  // Mobile Menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Accordion FAQ state
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");

  // County Tabs state
  const [activeCountyTab, setActiveCountyTab] = useState<string>("Nairobi County");

  // Selected Nairobi constituency from the dropdown
  const [selectedConstituency, setSelectedConstituency] = useState("Westlands");

  // Terms and Privacy Modals state
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // Sharing copy feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviews/Testimonials state with local persistence
  const [reviews, setReviews] = useState<any[]>(() => {
    const saved = localStorage.getItem("babysitter_nairobi_reviews");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore fallback
      }
    }
    return [
      {
        name: "Sylvia Nelly",
        text: "My son still mentions you😅🤩 thank you for being amazing with the kids",
        avatar: "👩🏾‍🦱",
        relationship: "Mom of 1",
        date: "2 days ago",
        stars: 5,
        verified: true
      },
      {
        name: "myfxdiaries",
        text: "Thank you being gentle to the little angels 😇 God Bless you 🥰",
        avatar: "👩🏾",
        relationship: "Parent",
        date: "1 week ago",
        stars: 5,
        verified: true
      },
      {
        name: "Ngatha🌻",
        text: "you're doing a great job 😃😌",
        avatar: "👩🏽‍🌾",
        relationship: "Nairobi Mom",
        date: "3 days ago",
        stars: 5,
        verified: true
      },
      {
        name: "Echo Electronics Arena",
        text: "Those kids are so lucky to have you! ❤️👶",
        avatar: "👨🏾‍💻",
        relationship: "Parent",
        date: "2 weeks ago",
        stars: 5,
        verified: true
      },
      {
        name: "Star kids closet",
        text: "you're amazing, babies deserve such love and care",
        avatar: "👗",
        relationship: "Mom & Business Owner",
        date: "4 days ago",
        stars: 5,
        verified: true
      },
      {
        name: "🌸Kiddoh 🌸",
        text: "I love the way you love those kids like your own 🥰❤️Your such an angel gal🥰",
        avatar: "🌸",
        relationship: "Mother of 2",
        date: "5 days ago",
        stars: 5,
        verified: true
      },
      {
        name: "Tashaaa",
        text: "I'm a mom of one 🥹and I absolutely love this🥰 thanks for your beautiful heart",
        avatar: "🙋🏾‍♀️",
        relationship: "Mom of one",
        date: "Yesterday",
        stars: 5,
        verified: true
      }
    ];
  });

  // State for Review Form & Rating selector
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewText, setNewReviewText] = useState("");
  const [newReviewRole, setNewReviewRole] = useState("");
  const [newReviewAvatar, setNewReviewAvatar] = useState("👩🏾‍🦱");
  const [newReviewStars, setNewReviewStars] = useState(5);
  const [reviewSubmitSuccess, setReviewSubmitSuccess] = useState(false);

  // Reviews filtering state (All or specific star count)
  const [starsFilter, setStarsFilter] = useState<number | null>(null);

  // Rotating Reviews Carousel active index
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Auto-rotating timer for reviews
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  // Calendar State & Setup (Preffered 14-day slot checking)
  const calendarDays = useMemo(() => {
    const days = [];
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Start from today or tomorrow
    const baseDate = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const dateString = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      days.push({
        dateStr: dateString,
        dayNum: d.getDate(),
        dayName: weekdays[d.getDay()],
        monthName: months[d.getMonth()],
        fullDateLabel: `${weekdays[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`
      });
    }
    return days;
  }, []);

  // Booked dates state (caregiver can toggle available/booked)
  const [bookedDays, setBookedDays] = useState<string[]>(() => {
    const saved = localStorage.getItem("sandra_booked_days");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Default some booked days in the next 14 days
    const baseDate = new Date();
    const d1 = new Date(baseDate);
    d1.setDate(baseDate.getDate() + 2); // Booked day 1
    const d2 = new Date(baseDate);
    d2.setDate(baseDate.getDate() + 5); // Booked day 2
    const d3 = new Date(baseDate);
    d3.setDate(baseDate.getDate() + 9); // Booked day 3
    
    const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return [formatDate(d1), formatDate(d2), formatDate(formatDate(d3) === formatDate(d1) ? d1 : d3)];
  });

  // Save booked days when modified
  const toggleBookedDay = (dateStr: string) => {
    let updated;
    if (bookedDays.includes(dateStr)) {
      updated = bookedDays.filter((d) => d !== dateStr);
    } else {
      updated = [...bookedDays, dateStr];
    }
    setBookedDays(updated);
    localStorage.setItem("sandra_booked_days", JSON.stringify(updated));
  };

  // Toggle Caregiver/Owner Admin mode to edit booked days
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Preferred category selected inside Check Availability section
  const [calSelectedCategory, setCalSelectedCategory] = useState<string>("hourly");

  // Selected date inside Check Availability calendar
  const [calSelectedDateStr, setCalSelectedDateStr] = useState(calendarDays[0].dateStr);

  // Fillable Babysitting Contract State Fields
  const [contractParentName, setContractParentName] = useState("");
  const [contractChildNames, setContractChildNames] = useState("");
  const [contractChildCount, setContractChildCount] = useState(1);
  const [contractWorkingHours, setContractWorkingHours] = useState("");
  const [contractServiceDate, setContractServiceDate] = useState("");
  const [contractEmergencyNamePrimary, setContractEmergencyNamePrimary] = useState("");
  const [contractEmergencyPhonePrimary, setContractEmergencyPhonePrimary] = useState("");
  const [contractEmergencyNameSecondary, setContractEmergencyNameSecondary] = useState("");
  const [contractEmergencyPhoneSecondary, setContractEmergencyPhoneSecondary] = useState("");
  const [isContractSaved, setIsContractSaved] = useState(false);

  // Modals for Terms and Privacy Policy
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // Honeypot security states
  const [reviewHoneypot, setReviewHoneypot] = useState("");
  const [contractHoneypot, setContractHoneypot] = useState("");

  // Admin authentication state
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [showPasscodeField, setShowPasscodeField] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Loyalty Program State
  const [isLoyaltyChecked, setIsLoyaltyChecked] = useState(false);

  // Sharing state
  const [sharePopoverOpen, setSharePopoverOpen] = useState(false);

  // Populate contract with estimator details helper
  const syncEstimatorToContract = () => {
    setContractChildCount(calcChildren);
    const serviceLabels: any = {
      hourly: "Hourly Day Care",
      halfday: "Half Day (Up to 5h)",
      fullday: "Full Day (Up to 10h)",
      datenight: "Date Night (6pm-12am)",
      latenight: "Late Night (12am-5am)"
    };
    const dateLabel = calendarDays.find((d) => d.dateStr === calSelectedDateStr)?.fullDateLabel || "Select Date";
    setContractWorkingHours(`${serviceLabels[selectedServiceType] || "Hourly Daytime Care"} - ${selectedServiceType === "halfday" ? "Up to 5 Hours" : selectedServiceType === "fullday" ? "Up to 10 Hours" : selectedServiceType === "datenight" ? "6pm - 12am" : `${calcHours} Hours`}`);
    setContractServiceDate(dateLabel);
    // Alert user
    alert("🔄 Synchronized calculator details into your contract form below!");
  };

  const handleDownloadContract = () => {
    // Honeypot security detection to block automated bot submissions and spam
    if (contractHoneypot.trim() !== "") {
      console.warn("Spam bot submission blocked via honeypot protection.");
      alert("⚠️ Security Verification Failed. Spam submission detected.");
      return;
    }

    if (!contractParentName.trim()) {
      alert("⚠️ Please enter your Parent/Guardian Legal Name first to co-sign the contract!");
      return;
    }
    
    const currentDateStr = new Date().toLocaleDateString("en-KE", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const fileContent = `========================================================================
             BABYSITTING SERVICE BINDING AGREEMENT & CONTRACT
========================================================================
This legally binding agreement is executed on ${currentDateStr} between:

CLIENT (PARENT/GUARDIAN):
Name: ${contractParentName.trim()}
Email/Phone: Provided upon booking

CAREGIVER (BABYSITTER):
Name: Sandra (@babysitternairobi)
Phone: +254 117 280 445
Location: Nairobi, Kenya

------------------------------------------------------------------------
1. CHILDREN DETAILS & COGNIZANCE
------------------------------------------------------------------------
Child Name(s) & Age(s): ${contractChildNames.trim() || "As specified during booking"}
Total Number of Children: ${contractChildCount} child(ren)

------------------------------------------------------------------------
2. APPOINTMENT SCHEDULE & DURATION
------------------------------------------------------------------------
Proposed Service Date: ${contractServiceDate || "As locked in calendar"}
Hours / Shift Details: ${contractWorkingHours || "Hourly Daytime Child Care"}

------------------------------------------------------------------------
3. TRANSACTIVE FEES & SPECIAL ADD-ONS
------------------------------------------------------------------------
- Core Rates applied matching authentic Nairobi Pricing:
  * Daytime Hourly Care: KSh 250 / Hour (minimum 2 hours)
  * Half Day Package (Up to 5h): KSh 1,200 Flat
  * Full Day Package (Up to 10h): KSh 2,400 Flat
  * Date Night Shift (6pm - 12am): KSh 1,400 Flat
  * Late Night Emergency Care (12am - 5am): KSh 300 / Hour
  * Extra Child Surcharge: +KSh 100/hr per extra child
  
- Special Services (Included Free of Charge):
  * Homework Aid & Support: 100% FREE
  * Nutritional Meal Prep Support: 100% FREE
  * Diapering & Toy Station Tidying: 100% FREE
  * Continuous Private Photo Updates: 100% FREE

------------------------------------------------------------------------
4. CARE STANDARDS & EMERGENCY HEALTH PROTOCOL
------------------------------------------------------------------------
- Sandra pledges professional care, screen-free educational interactions, 
  and strict adherence to parent household rules.
- Under Sections 30 & 33 of the Kenya Data Protection Act 2019, child photo 
  sharing consent is strictly limited to the parent's selection.
- In event of emergency, Gertrude's Children's Hospital or designated contacts 
  are authorized immediately.
  
Primary Emergency Contact:
Name: ${contractEmergencyNamePrimary.trim() || "Not specified"}
Phone/Contact: ${contractEmergencyPhonePrimary.trim() || "Not specified"}

Secondary Emergency Contact:
Name: ${contractEmergencyNameSecondary.trim() || "Not specified"}
Phone/Contact: ${contractEmergencyPhoneSecondary.trim() || "Not specified"}

------------------------------------------------------------------------
5. SAFE TRAVEL PROTOCOLS
------------------------------------------------------------------------
For shifts ending after 10:00 PM, safe, vetted point-to-point ride hailing 
transport (Uber/Bolt) must be co-arranged or covered by the client for the 
caregiver's personal safety.

------------------------------------------------------------------------
6. DIGITAL CO-SIGNATURE & REGULATORY STAMP
------------------------------------------------------------------------
The parties acknowledge and agree that this document serves as a binding 
commitment to protect both families and ensure elite child safety standards.

PARENT/GUARDIAN SIGNATURE:
Digitally Confirmed & Signed by: [ ${contractParentName.trim().toUpperCase()} ]

CAREGIVER SIGNATURE:
Co-signed & Confirmed by: [ SANDRA - @babysitternairobi ]

========================================================================
       GENERATED SECURELY VIA SANDRA'S NAIROBI BABYSITTING PORTAL
========================================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `babysitting_contract_${contractParentName.trim().toLowerCase().replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsContractSaved(true);
  };

  const handleAddReview = (e: FormEvent) => {
    e.preventDefault();
    // Honeypot security detection to block automated bot submissions and spam
    if (reviewHoneypot.trim() !== "") {
      console.warn("Spam bot submission blocked via honeypot protection.");
      alert("⚠️ Security Verification Failed. Spam submission detected.");
      return;
    }

    if (!newReviewName.trim() || !newReviewText.trim()) return;

    const newReview = {
      name: newReviewName.trim(),
      text: newReviewText.trim(),
      avatar: newReviewAvatar,
      relationship: newReviewRole.trim() || "Nairobi Parent",
      date: "Just now",
      stars: newReviewStars,
      verified: true
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem("babysitter_nairobi_reviews", JSON.stringify(updatedReviews));

    // Reset form
    setNewReviewName("");
    setNewReviewText("");
    setNewReviewRole("");
    setNewReviewAvatar("👩🏾‍🦱");
    setNewReviewStars(5);
    setReviewSubmitSuccess(true);

    setTimeout(() => {
      setReviewSubmitSuccess(false);
    }, 4000);
  };

  // Interactive Area search state
  const [areaSearchQuery, setAreaSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{
    found: boolean;
    estate: string;
    county: string;
  } | null>(null);

  // Interactive Rate Calculator State
  const [selectedServiceType, setSelectedServiceType] = useState<"hourly" | "halfday" | "fullday" | "datenight" | "latenight">("hourly");
  const [calcHours, setCalcHours] = useState<number>(4);
  const [calcChildren, setCalcChildren] = useState<number>(1);
  const [calcSpecialRequests, setCalcSpecialRequests] = useState({
    homework: false,
    tidyUp: false,
    mealPrep: false,
    textUpdates: true
  });
  const [photoConsent, setPhotoConsent] = useState<"yes" | "partial">("partial");

  // Calculate final estimate dynamically
  const computedEstimate = useMemo(() => {
    let basePrice = 0;
    
    switch (selectedServiceType) {
      case "hourly":
        basePrice = profile.hourlyRate * calcHours;
        break;
      case "halfday":
        basePrice = profile.halfDayRate; // up to 5 hrs fixed
        break;
      case "fullday":
        basePrice = profile.fullDayRate; // up to 10 hrs fixed
        break;
      case "datenight":
        basePrice = profile.dateNightRate; // 6pm-12am fixed
        break;
      case "latenight":
        basePrice = profile.lateNightRate * calcHours; // 12am-5am hourly
        break;
    }

    // Additional children fee: + KSh 100 per hour or flat per child based on service
    const extraChildren = Math.max(0, calcChildren - 1);
    let childSurcharge = 0;
    if (selectedServiceType === "hourly" || selectedServiceType === "latenight") {
      childSurcharge = extraChildren * 100 * calcHours;
    } else if (selectedServiceType === "halfday") {
      childSurcharge = extraChildren * 400;
    } else if (selectedServiceType === "fullday") {
      childSurcharge = extraChildren * 800;
    } else if (selectedServiceType === "datenight") {
      childSurcharge = extraChildren * 500;
    }

    // Add-on services: homework help and meal prep are 100% FREE!
    const addonPrice = 0;
    
    let total = basePrice + childSurcharge + addonPrice;
    if (isLoyaltyChecked) {
      // 3 free hours loyalty reward
      const discount = 3 * profile.hourlyRate;
      total = Math.max(0, total - discount);
    }
    return total;
  }, [selectedServiceType, calcHours, calcChildren, calcSpecialRequests, isLoyaltyChecked, profile]);

  // Generate customized WhatsApp booking link
  const whatsAppLink = useMemo(() => {
    const serviceLabels = {
      hourly: "Hourly Daytime Care",
      halfday: "Half Day Care (Up to 5 Hrs)",
      fullday: "Full Day Care (Up to 10 Hrs)",
      datenight: "Date Night Shift (6pm - 12am)",
      latenight: "Late Night Care (12am - 5am)"
    };

    const photoConsentLabels = {
      yes: "YES, full consent for professional channels & WhatsApp updates",
      partial: "PARTIAL, private WhatsApp updates ONLY (strictly NO social media/public channels)"
    };

    const addonsList: string[] = [];
    if (calcSpecialRequests.homework) addonsList.push("Homework Aid (Free)");
    if (calcSpecialRequests.mealPrep) addonsList.push("Meal Preparation (Free)");
    if (calcSpecialRequests.tidyUp) addonsList.push("Tidy Up Play Area (Free)");
    if (calcSpecialRequests.textUpdates) addonsList.push("Regular Photo Updates (Free)");

    const message = `Hello Sandra! 🌸 I am visiting your professional website and would love to book your babysitting service!

📅 Here are my estimated details:
- *Service Type*: ${serviceLabels[selectedServiceType]}
- *Constituency*: ${selectedConstituency}
- *Number of Kids*: ${calcChildren} ${calcChildren > 1 ? "children" : "child"}
- *Duration/Hours*: ${selectedServiceType === "halfday" ? "Up to 5 Hours" : selectedServiceType === "fullday" ? "Up to 10 Hours" : selectedServiceType === "datenight" ? "6:00 PM - 12:00 AM" : `${calcHours} Hours`}
- *Special Preferences*: ${addonsList.length > 0 ? addonsList.join(", ") : "Standard care"}
- *Photo Sharing Consent (Kenya DPA 2019)*: ${photoConsentLabels[photoConsent]}
- *Loyalty Program*: ${isLoyaltyChecked ? "Claiming 3 FREE HOURS Reward (Completed 5 consecutive bookings! 🎉)" : "Standard Booking"}
- *Estimated Total*: ${profile.currency} ${computedEstimate.toLocaleString()}

Is your schedule available for this? Looking forward to hearing from you! ❤️`;

    return `https://wa.me/${profile.phone}?text=${encodeURIComponent(message)}`;
  }, [selectedServiceType, calcHours, calcChildren, calcSpecialRequests, photoConsent, computedEstimate, profile, selectedConstituency, isLoyaltyChecked]);

  // Click tracker for booking
  const handleBookingClick = () => {
    try {
      // 1. Save locally for developer mirror dashboard
      const currentCount = parseInt(localStorage.getItem("whatsapp_click_count") || "0", 10);
      localStorage.setItem("whatsapp_click_count", (currentCount + 1).toString());

      const rawLogs = localStorage.getItem("whatsapp_click_logs") || "[]";
      const logs = JSON.parse(rawLogs);
      logs.unshift({
        timestamp: new Date().toISOString(),
        service: selectedServiceType,
        children: calcChildren,
        hours: selectedServiceType === "halfday" ? 5 : selectedServiceType === "fullday" ? 10 : selectedServiceType === "datenight" ? 6 : calcHours,
        estimate: computedEstimate,
        consent: photoConsent,
      });
      localStorage.setItem("whatsapp_click_logs", JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.error("Local click tracking failed:", e);
    }

    try {
      // 2. Dispatch live push notification (Discord Webhook or Telegram Bot API)
      const metaEnv = (import.meta as any).env || {};
      const discordUrl = metaEnv.VITE_DISCORD_WEBHOOK_URL || localStorage.getItem("developer_discord_webhook_url");
      const tgToken = metaEnv.VITE_TELEGRAM_BOT_TOKEN || localStorage.getItem("developer_telegram_bot_token");
      const tgChatId = metaEnv.VITE_TELEGRAM_CHAT_ID || localStorage.getItem("developer_telegram_chat_id");

      const serviceLabels = {
        hourly: "Hourly Daytime Care",
        halfday: "Half Day Care (Up to 5 Hrs)",
        fullday: "Full Day Care (Up to 10 Hrs)",
        datenight: "Date Night Shift (6pm - 12am)",
        latenight: "Late Night Care (12am - 5am)"
      };

      const photoConsentLabels = {
        yes: "YES, Full Consent (Social Media)",
        partial: "PARTIAL (WhatsApp Updates Only)",
        no: "NO Consent (Strict Privacy)"
      };

      const detailsMessage = `✨ **NEW WHATSAPP BOOKING CLICKED!** ✨\n----------------------------------------\n👤 **Caregiver:** ${profile.name}\n📅 **Service:** ${serviceLabels[selectedServiceType]}\n👶 **Kids:** ${calcChildren} ${calcChildren > 1 ? "children" : "child"}\n⏳ **Duration:** ${selectedServiceType === "halfday" ? "Up to 5 Hours" : selectedServiceType === "fullday" ? "Up to 10 Hours" : selectedServiceType === "datenight" ? "6:00 PM - 12:00 AM" : `${calcHours} Hours`}\n🛡️ **Photo Consent:** ${photoConsentLabels[photoConsent]}\n💰 **Estimated Value:** ${profile.currency} ${computedEstimate.toLocaleString()}\n----------------------------------------\n📈 *Open Developer Control Deck to view monthly analytics!*`;

      if (discordUrl && discordUrl.trim().startsWith("https://discord.com/api/webhooks/")) {
        fetch(discordUrl.trim(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: detailsMessage,
            username: "Booking Telemetry Bot"
          })
        }).catch(err => console.error("Discord error:", err));
      }

      if (tgToken && tgChatId) {
        const text = encodeURIComponent(detailsMessage.replace(/\*\*/g, "*"));
        const url = `https://api.telegram.org/bot${tgToken.trim()}/sendMessage?chat_id=${tgChatId.trim()}&text=${text}`;
        fetch(url).catch(err => console.error("Telegram error:", err));
      }
    } catch (err) {
      console.error("Alert sending failed:", err);
    }
  };

  // Handler for Estate / Area Search
  const handleAreaSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!areaSearchQuery.trim()) return;

    const query = areaSearchQuery.toLowerCase().trim();
    let found = false;
    let foundEstate = "";
    let foundCounty = "";

    for (const serviceArea of SERVICE_AREAS) {
      const match = serviceArea.areas.find(area => area.toLowerCase().includes(query));
      if (match) {
        found = true;
        foundEstate = match;
        foundCounty = serviceArea.county;
        break;
      }
    }

    if (found) {
      setSearchResult({
        found: true,
        estate: foundEstate,
        county: foundCounty
      });
      // Automatically switch tab to matching county
      setActiveCountyTab(foundCounty);
    } else {
      setSearchResult({
        found: false,
        estate: areaSearchQuery,
        county: ""
      });
    }
  };

  const handleQuickSearch = (estateName: string) => {
    setAreaSearchQuery(estateName);
    const serviceArea = SERVICE_AREAS.find(sa => sa.areas.includes(estateName));
    if (serviceArea) {
      setSearchResult({
        found: true,
        estate: estateName,
        county: serviceArea.county
      });
      setActiveCountyTab(serviceArea.county);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className={`min-h-screen text-slate-800 transition-colors duration-500 font-sans ${selectedTheme.bgGradient}`}>
      
      {/* Premium Floating Header */}
      <nav className="sticky top-0 z-40 bg-white/60 backdrop-blur-xl border-b border-purple-100/30 shadow-[0_4px_20px_-2px_rgba(139,92,246,0.06),0_10px_35px_-5px_rgba(139,92,246,0.12),inset_0_1px_1px_rgba(255,255,255,0.8)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            <div className="flex items-center gap-2.5">
              <span className="text-xl sm:text-2xl animate-bounce">🌸</span>
              <div>
                <span className="font-serif font-bold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  {profile.name} <span className="text-xs font-sans font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full border border-purple-100 shadow-sm shadow-purple-500/5">Nairobi</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono block -mt-1">
                  @{profile.handle}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#why-me" className="text-slate-600 hover:text-purple-600 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                Why Me
              </a>
              <a href="#rates" className="text-slate-600 hover:text-purple-600 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                Rates & Pricing
              </a>
              <a href="#reviews" className="text-slate-600 hover:text-purple-600 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                Reviews
              </a>
              <a href="#coverage" className="text-slate-600 hover:text-purple-600 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95 font-medium">
                Service Areas
              </a>
              <a href="#safety" className="text-slate-600 hover:text-purple-600 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                Safety & Contracts
              </a>
              <a href="#faq" className="text-slate-600 hover:text-purple-600 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95">
                FAQs
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3.5 relative">
              {/* Share Portfolio Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSharePopoverOpen(!sharePopoverOpen)}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-600 border border-purple-200 font-medium text-xs px-4 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share App
                </button>
                
                {sharePopoverOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSharePopoverOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-purple-100 p-3.5 z-50 space-y-2.5 animate-fade-in text-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Share Sandra's Link</p>
                      <button
                        onClick={() => { handleCopyLink(); setSharePopoverOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-purple-50 text-slate-700 rounded-xl text-left text-xs transition-colors"
                      >
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>{copiedLink ? "Copied! 🎉" : "Copy Share Link"}</span>
                      </button>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out Sandra's professional babysitting portfolio and calculator for Nairobi families! 🌸 " + window.location.href)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-emerald-50 text-slate-700 rounded-xl text-left text-xs transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                        <span>Share on WhatsApp</span>
                      </a>
                      <a
                        href={`mailto:?subject=${encodeURIComponent("Recommended Professional Babysitter in Nairobi: Sandra")}&body=${encodeURIComponent("Hi! I wanted to share Sandra's babysitting profile and availability calculator with you: " + window.location.href)}`}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-blue-50 text-slate-700 rounded-xl text-left text-xs transition-colors"
                      >
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span>Share via Email</span>
                      </a>
                    </div>
                  </>
                )}
              </div>

              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                id="header-cta-whatsapp"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs px-4 py-2.5 rounded-full shadow-lg shadow-emerald-500/10 hover:shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 active:scale-95 flex items-center gap-1.5 tracking-wide uppercase"
              >
                <Smartphone className="w-4 h-4" /> Book Via WhatsApp
              </a>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 hover:text-purple-600 focus:outline-none p-1.5 transition-all duration-300 hover:scale-110 hover:rotate-6 active:scale-95"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <span className="text-2xl font-mono">✕</span>
                ) : (
                  <span className="text-2xl">☰</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 border-b border-rose-100 px-4 pt-2 pb-6 space-y-3"
            >
              <a
                href="#why-me"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-rose-500 text-base font-medium py-1"
              >
                Why Choose Me
              </a>
              <a
                href="#rates"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-rose-500 text-base font-medium py-1"
              >
                Rates & Booking Estimator
              </a>
              <a
                href="#reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-rose-500 text-base font-medium py-1"
              >
                Reviews & Shoutouts
              </a>
              <a
                href="#coverage"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-rose-500 text-base font-medium py-1"
              >
                Covered Estates
              </a>
              <a
                href="#safety"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-rose-500 text-base font-medium py-1"
              >
                Contracts & Safety
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-700 hover:text-rose-500 text-base font-medium py-1"
              >
                Frequently Asked FAQs
              </a>
              <div className="pt-3 space-y-2">
                <a
                  href={whatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-center text-sm py-3 rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" /> Quick Book on WhatsApp
                </a>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-center text-xs py-2.5 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copiedLink ? "Copied! 🎉" : "Copy Link"}</span>
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Check out Sandra's professional babysitting portfolio and calculator for Nairobi families! 🌸 " + window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium text-center text-xs py-2.5 rounded-lg border border-rose-200 flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3.5 h-3.5 animate-pulse" />
                    <span>Share App</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-24">
        {/* Soft Background shapes */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-brand-teal/5 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob"></div>
        <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-brand-coral/5 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core pitch details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="md:col-span-7 text-left space-y-6"
            >
              <div className="inline-flex items-center gap-2 bg-brand-teal/10 border border-brand-teal/20 text-brand-teal px-3.5 py-1.5 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-coral animate-pulse"></span>
                Professional Childcare in Nairobi
              </div>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
                Trusted, Vetted, and Professional Care <br />
                <span className="bg-gradient-to-r from-brand-teal to-brand-coral bg-clip-text text-transparent italic font-semibold">
                  For Your Little Ones
                </span>
              </h1>
              
              <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed">
                Giving busy Nairobi parents ultimate peace of mind. We provide background-checked, first-aid-certified professional nannies tailored to your family's dynamic.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <a
                  href="#rates"
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:from-purple-700 hover:via-fuchsia-600 hover:to-pink-600 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_20px_-2px_rgba(168,85,247,0.35),0_10px_30px_-5px_rgba(236,72,153,0.25)] flex items-center justify-center gap-2 tracking-wide uppercase"
                >
                  <Calendar className="w-4 h-4 animate-pulse" /> Check Sitter Availability
                </a>
                <a
                  href="#coverage"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-medium px-8 py-4 rounded-xl shadow-lg shadow-slate-100 border border-brand-teal/10 transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <MapPin className="w-4 h-4 text-brand-teal" /> Check Covered Estates
                </a>
              </div>

              {/* Trust badges row */}
              <div className="pt-6 border-t border-brand-teal/10 grid grid-cols-2 gap-4 max-w-md text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">Police Checked</span>
                    <span className="text-[10px] text-slate-500">DCI Certificate of Good Conduct</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🩺</span>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">First Aid Trained</span>
                    <span className="text-[10px] text-slate-500">Infant CPR Certified</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Beautiful Owner Portrait Frame */}
            <motion.div
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
              className="md:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] border-4 border-white bg-brand-cream shadow-brand-teal/10">
                <img
                  src="/src/assets/images/sandra_founder.jpg"
                  alt="Sandra Wangeci - Founder & Professional Childcare Provider"
                  className="w-full h-full object-cover animate-fade-in"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent"></div>
                
                {/* Overlay details */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-white text-[10px] font-semibold uppercase tracking-wider text-teal-200">Featured On TikTok</p>
                  <p className="text-white font-bold text-lg">@{profile.handle}</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Everyday Situations Section */}
      <section id="why-me" className="py-16 sm:py-20 bg-white/65 border-y border-rose-100/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider font-mono">
              EVERYDAY PARENTHOOD SITUATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1.5 mb-4">
              Moments Where You Need a Professional Babysitter 👶✨
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Parenthood is a beautiful journey, but you don't have to carry it all alone. Here are the everyday situations where I step in to support your peace of mind:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {SITUATIONS.map((sit, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-rose-100/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl mb-4 border border-rose-100/30">
                    {sit.icon}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                    {sit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {sit.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rose-50/50 flex items-center justify-between text-xs font-mono text-rose-500 font-medium">
                  <span>Flexible booking</span>
                  <span>❤️ Daily & Nightly</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Services Showcase Section */}
      <section id="services" className="py-16 sm:py-20 bg-slate-50/50 border-b border-brand-teal/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-brand-teal text-xs font-bold uppercase tracking-wider font-mono">
              OUR SPECIALIZED SERVICES
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1.5">
              Premium Childcare & Nanny Services in Nairobi
            </h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Serving premier residential estates including Kilimani, Kileleshwa, Westlands, Karen, Lavington, Runda, and suburbs in Kiambu, Machakos, and Kajiado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition flex flex-col">
              <div className="h-56 relative group overflow-hidden">
                <img
                  src="/src/assets/images/Sandra Playing with a Princess.jpg"
                  alt="Sandra Playing with a Princess"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-teal/10 mix-blend-multiply"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">On-Demand Care & Homework Help</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    Perfect for flexible daytime sitting, structured play, and homework management when your work schedule gets intense.
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full w-max">
                  Flexible Hourly Rates
                </span>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition flex flex-col">
              <div className="h-56 relative group overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600&auto=format&fit=crop"
                  alt="A happy Asian baby playing creatively with building blocks, representing long-term placements"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-coral/10 mix-blend-multiply"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Full-Time / Monthly Placements</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    Long-term, highly reliable care structures built directly into your family's routine with a dedicated professional nanny.
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-coral bg-brand-coral/10 px-3 py-1 rounded-full w-max">
                  Monthly Subscriptions
                </span>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-100 transition flex flex-col">
              <div className="h-56 relative group overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?q=80&w=600&auto=format&fit=crop"
                  alt="Diverse preschool kids laughing and playing together in a safe nursery environment in Nairobi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-teal/10 mix-blend-multiply"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">Emergency & Short-Notice Sitting</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
                    Last-minute changes or unexpected business errands? Secure an immediate backup caregiver with priority scheduling options.
                  </p>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full w-max">
                  Priority Support Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parents' Shoutout Board & Live Reviews Section */}
      <section id="reviews" className="py-16 sm:py-24 bg-gradient-to-b from-brand-cream to-white border-b border-brand-teal/10 relative overflow-hidden">
        {/* Decorative background blur blobs */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-brand-coral/5 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-teal/5 rounded-full filter blur-3xl opacity-60"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Title and Live Review Input Form */}
            <div className="lg:col-span-5 space-y-8 sticky top-24">
              <div>
                <span className="text-brand-teal text-xs font-bold uppercase tracking-wider font-mono bg-brand-teal/10 px-3 py-1.5 rounded-full">
                  COMMUNITY SHOUTOUT FEED
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-4 mb-4">
                  Real feedback and love notes from parents
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Real feedback and love notes from parents. These reviews are captured directly from her active social media comments and WhatsApp messages!
                </p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-brand-teal/10 relative">
                <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">
                  Are You a Client? Leave a Shoutout! ❤️
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Help other Nairobi parents feel confident by pasting your sweet experience or recommendation below.
                </p>

                <form onSubmit={handleAddReview} className="space-y-4">
                  {/* Hidden honeypot field to detect and block automated bot submissions and spam */}
                  <div className="absolute opacity-0 pointer-events-none -z-50 w-0 h-0" aria-hidden="true">
                    <label htmlFor="review_spam_check">Do not fill this field</label>
                    <input
                      id="review_spam_check"
                      type="text"
                      name="review_spam_check"
                      value={reviewHoneypot}
                      onChange={(e) => setReviewHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Name / Profile Handle
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g., Sylvia Nelly or @mama_kayla"
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal bg-slate-50/50 text-slate-800 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Relationship Tag
                      </label>
                      <input
                        type="text"
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        placeholder="e.g., Mom of 1, Karen"
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal bg-slate-50/50 text-slate-800 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Select Avatar Emoji
                      </label>
                      <select
                        value={newReviewAvatar}
                        onChange={(e) => setNewReviewAvatar(e.target.value)}
                        className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal bg-slate-50/50 text-slate-800 transition"
                      >
                        <option value="👩🏾‍🦱">👩🏾‍🦱 (Mom Locs)</option>
                        <option value="👩🏾">👩🏾 (Mom Curly)</option>
                        <option value="👩🏽‍🌾">👩🏽‍🌾 (Mom Straw)</option>
                        <option value="🌸">🌸 (Blossom)</option>
                        <option value="✨">✨ (Sparkles)</option>
                        <option value="🙋🏾‍♀️">🙋🏾‍♀️ (Happy Mom)</option>
                        <option value="👨🏾‍💻">👨🏾‍💻 (Dad Glasses)</option>
                        <option value="👶">👶 (Baby Face)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Your Shoutout Message
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="My son still mentions you! Thank you for being amazing..."
                      className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-brand-teal bg-slate-50/50 text-slate-800 transition resize-none"
                    />
                  </div>

                  {/* Dynamic Clickable Star Selector */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
                    <span className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
                      Select Star Rating (1 to 5 Stars):
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setNewReviewStars(starVal)}
                          className="focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              starVal <= newReviewStars
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 fill-none"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-mono font-bold text-slate-600 ml-2">
                        {newReviewStars} Stars Selected
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="submit"
                      className="w-full bg-brand-teal hover:bg-brand-dark-teal text-white font-semibold py-3 rounded-2xl text-xs transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Post Shoutout
                    </button>
                  </div>
                </form>

                <AnimatePresence>
                  {reviewSubmitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute inset-0 bg-white/95 rounded-3xl flex flex-col items-center justify-center text-center p-6"
                    >
                      <span className="text-4xl mb-3 animate-bounce">🎉🌸</span>
                      <h4 className="font-bold text-slate-900 text-base">Shoutout Posted Instantly!</h4>
                      <p className="text-xs text-slate-600 max-w-xs mt-1.5 leading-relaxed">
                        Thank you for sharing your beautiful recommendation! Your feedback is now live on Sandra's landing page feed.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Wall of Love Review Grid & Sliding Carousel */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Rating Stats Summary Board */}
              <div className="bg-white p-6 rounded-3xl border border-brand-teal/10 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                    Parent Trust Index
                  </span>
                  <div className="flex items-baseline justify-center sm:justify-start gap-1.5 mt-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">4.9</span>
                    <span className="text-slate-400 text-sm">/ 5.0</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-1.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-[11px] text-slate-500 font-medium ml-1">
                      (Based on {reviews.length} Parent Votes)
                    </span>
                  </div>
                </div>

                {/* Stars Selection Filter */}
                <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase tracking-wider">
                    Filter Love Notes:
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center sm:justify-end">
                    <button
                      onClick={() => { setStarsFilter(null); setActiveReviewIdx(0); }}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${
                        starsFilter === null
                          ? "bg-brand-teal text-white shadow-sm"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                      }`}
                    >
                      All ({reviews.length})
                    </button>
                    {[5, 4, 3].map((starNum) => {
                      const count = reviews.filter((r) => r.stars === starNum).length;
                      return (
                        <button
                          key={starNum}
                          onClick={() => { setStarsFilter(starNum); setActiveReviewIdx(0); }}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-0.5 ${
                            starsFilter === starNum
                              ? "bg-brand-teal text-white shadow-sm"
                              : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {starNum} <Star className="w-2.5 h-2.5 fill-current" /> ({count})
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* FILTERED REVIEWS CAROUSEL DISPLAY */}
              {(() => {
                const filteredReviews = reviews.filter((r) => starsFilter === null || r.stars === starsFilter);
                
                if (filteredReviews.length === 0) {
                  return (
                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 text-center text-slate-500 text-xs">
                      No reviews found for this filter. Leave yours to support Sandra!
                    </div>
                  );
                }

                // Bound index
                const currentIndex = activeReviewIdx % filteredReviews.length;
                const currentReview = filteredReviews[currentIndex];

                return (
                  <div className="relative">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentReview.name + currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white p-8 sm:p-10 rounded-3xl border border-brand-teal/10 shadow-lg shadow-brand-cream/50 relative overflow-hidden"
                      >
                        {/* Huge decorative quotes */}
                        <div className="absolute top-4 right-6 text-7xl font-serif text-brand-teal/5 select-none font-extrabold pointer-events-none">
                          “
                        </div>

                        <div className="space-y-6">
                          {/* Stars Row & Verified Badge */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-0.5">
                              {[...Array(currentReview.stars || 5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-brand-teal bg-brand-teal/5 border border-brand-teal/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span> Verified Parent
                            </span>
                          </div>

                          {/* Review Comment Text */}
                          <p className="text-sm sm:text-base text-slate-700 italic font-medium leading-relaxed font-sans">
                            "{currentReview.text}"
                          </p>

                          {/* Reviewer Details Card */}
                          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 bg-brand-cream rounded-full border border-brand-teal/10 flex items-center justify-center text-2xl shadow-inner">
                                {currentReview.avatar || "👩🏾‍🦱"}
                              </div>
                              <div>
                                <span className="font-extrabold text-slate-900 text-sm block">
                                  {currentReview.name}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono font-medium">
                                  {currentReview.relationship || "Nairobi Parent"} • {currentReview.date || "Just now"}
                                </span>
                              </div>
                            </div>
                            
                            <span className="text-[10px] font-mono text-slate-400">
                              Note {currentIndex + 1} of {filteredReviews.length}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Carousel Navigation Buttons */}
                    <div className="flex items-center justify-between mt-4 px-2">
                      <div className="flex items-center gap-1">
                        {filteredReviews.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveReviewIdx(idx)}
                            className={`h-1.5 transition-all rounded-full ${
                              idx === currentIndex ? "w-6 bg-brand-teal" : "w-1.5 bg-slate-200"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveReviewIdx((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length)}
                          className="w-9 h-9 bg-white hover:bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 transition shadow-sm focus:outline-none"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveReviewIdx((prev) => (prev + 1) % filteredReviews.length)}
                          className="w-9 h-9 bg-white hover:bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 transition shadow-sm focus:outline-none"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })()}

            </div>

          </div>
        </div>
      </section>

      {/* Interactive Rates & Live Estimator Section */}
      <section id="rates" className="py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider font-mono">
              TRANSPARENT HOURLY & SHIFT PRICING
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1.5 mb-4">
              ✨ My Babysitting Rates & Shift Options ✨
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              No hidden fees, no complicated math. Choose the package that suits your budget and daily schedule. Calculate your estimated quote and pre-fill your WhatsApp request!
            </p>
          </div>

          {/* Visual Rates from Screenshot */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
            
            {/* Rates Card Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-rose-500/10">
                <h3 className="font-serif font-bold text-xl sm:text-2xl mb-2 flex items-center gap-2">
                  <span>🌸</span> Sandra's Core Rates
                </h3>
                <p className="text-xs text-rose-100 mb-6">
                  Offering day-time, evening date nights, and late-night emergency care across Nairobi County.
                </p>

                <div className="space-y-4 font-mono">
                  <div className="flex items-center justify-between py-2 border-b border-white/20">
                    <span className="flex items-center gap-2 text-sm">
                      ⏱️ Hourly Care
                    </span>
                    <span className="font-bold text-base sm:text-lg">
                      {profile.currency} {profile.hourlyRate}/hr
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/20">
                    <span className="flex items-center gap-2 text-sm">
                      ☀️ Half Day (Up to 5 Hrs)
                    </span>
                    <span className="font-bold text-base sm:text-lg">
                      {profile.currency} {profile.halfDayRate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/20">
                    <span className="flex items-center gap-2 text-sm">
                      🌞 Full Day (Up to 10 Hrs)
                    </span>
                    <span className="font-bold text-base sm:text-lg">
                      {profile.currency} {profile.fullDayRate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-white/20">
                    <span className="flex items-center gap-2 text-sm">
                      🌙 Date Night (6pm - 12am)
                    </span>
                    <span className="font-bold text-base sm:text-lg">
                      {profile.currency} {profile.dateNightRate.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-sm">
                      🌌 Late Night (12am - 5am)
                    </span>
                    <span className="font-bold text-base sm:text-lg">
                      {profile.currency} {profile.lateNightRate}/hr
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-white/10 rounded-xl text-[11px] leading-relaxed text-rose-50 border border-white/10">
                  ⚠️ <strong>Transport Policy:</strong> Safe transport (Uber/Bolt) is requested for date nights or late shifts ending after 10:00 PM or in remote border locations.
                </div>
              </div>

              {/* Quick Info Alerts */}
              <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 mb-1">Looking for a weekly or monthly rate?</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    If you require recurring daily or weekly slots, I can arrange custom packages to suit your budget. Tap the WhatsApp button to discuss bespoke schedules!
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Calculator Column */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-lg shadow-rose-100/20 relative">
              <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-200">
                ⚡ Live Estimator
              </div>

              <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 mb-2">
                Calculate & Plan Your Booking Care
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Adjust the parameters below to calculate a highly-accurate quote based on Sandra's authentic Nairobi rates.
              </p>

              <div className="space-y-5">
                
                {/* Service type selectors */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 mb-2 uppercase">
                    1. Choose Service Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        setSelectedServiceType("hourly");
                        setCalcHours(4);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs text-center border font-medium transition-all ${
                        selectedServiceType === "hourly"
                          ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      ⏱️ Hourly Day Care
                    </button>
                    <button
                      onClick={() => setSelectedServiceType("halfday")}
                      className={`px-3 py-2.5 rounded-xl text-xs text-center border font-medium transition-all ${
                        selectedServiceType === "halfday"
                          ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      ☀️ Half Day (Up to 5h)
                    </button>
                    <button
                      onClick={() => setSelectedServiceType("fullday")}
                      className={`px-3 py-2.5 rounded-xl text-xs text-center border font-medium transition-all ${
                        selectedServiceType === "fullday"
                          ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      🌞 Full Day (Up to 10h)
                    </button>
                    <button
                      onClick={() => setSelectedServiceType("datenight")}
                      className={`px-3 py-2.5 rounded-xl text-xs text-center border font-medium transition-all ${
                        selectedServiceType === "datenight"
                          ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      🌙 Date Night (6pm-12am)
                    </button>
                    <button
                      onClick={() => {
                        setSelectedServiceType("latenight");
                        setCalcHours(3);
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs text-center border font-medium transition-all ${
                        selectedServiceType === "latenight"
                          ? "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      🌌 Late Night (12am-5am)
                    </button>
                  </div>
                </div>

                {/* Hours Slider if Hourly or Late Night is selected */}
                {(selectedServiceType === "hourly" || selectedServiceType === "latenight") && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase">
                        2. Number of Hours
                      </label>
                      <span className="font-mono text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                        {calcHours} Hours
                      </span>
                    </div>
                    <input
                      type="range"
                      min={selectedServiceType === "latenight" ? 1 : 2}
                      max={12}
                      value={calcHours}
                      onChange={(e) => setCalcHours(Number(e.target.value))}
                      className="w-full accent-rose-500 h-2 bg-slate-100 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                      <span>Min: {selectedServiceType === "latenight" ? "1 hr" : "2 hrs"}</span>
                      <span>Max: 12 hrs</span>
                    </div>
                  </div>
                )}

                {/* Number of Children Selector */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">
                      {selectedServiceType === "hourly" || selectedServiceType === "latenight" ? "3" : "2"}. Number of Children
                    </label>
                    <span className="text-xs text-slate-400 font-mono">
                      +KSh 100/hr per extra child
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <button
                        key={num}
                        onClick={() => setCalcChildren(num)}
                        className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center border ${
                          calcChildren === num
                            ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Services Addons */}
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-500 mb-2 uppercase">
                    Additional Requests
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-rose-100/60 bg-rose-50/20 hover:bg-rose-50/40 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={calcSpecialRequests.homework}
                        onChange={(e) => setCalcSpecialRequests({ ...calcSpecialRequests, homework: e.target.checked })}
                        className="rounded accent-rose-500 text-rose-500"
                      />
                      <span>📚 Homework Aid (+ KSh 200 flat)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-rose-100/60 bg-rose-50/20 hover:bg-rose-50/40 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={calcSpecialRequests.mealPrep}
                        onChange={(e) => setCalcSpecialRequests({ ...calcSpecialRequests, mealPrep: e.target.checked })}
                        className="rounded accent-rose-500 text-rose-500"
                      />
                      <span>🍳 Meal Prep Support (+ KSh 300 flat)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-rose-100/60 bg-rose-50/20 hover:bg-rose-50/40 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={calcSpecialRequests.tidyUp}
                        onChange={(e) => setCalcSpecialRequests({ ...calcSpecialRequests, tidyUp: e.target.checked })}
                        className="rounded accent-rose-500 text-rose-500"
                      />
                      <span>🧸 Tidy Up Play Area (Free)</span>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-rose-100/60 bg-rose-50/20 hover:bg-rose-50/40 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={calcSpecialRequests.textUpdates}
                        onChange={(e) => setCalcSpecialRequests({ ...calcSpecialRequests, textUpdates: e.target.checked })}
                        className="rounded accent-rose-500 text-rose-500"
                      />
                      <span>📱 Continuous Updates (Free)</span>
                    </label>
                  </div>
                </div>

                {/* Kenyan Data Protection Act 2019 Photo Consent */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">🛡️</span>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">
                      4. Child Photo Sharing Consent (Kenya Data Protection Act, 2019)
                    </label>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal mb-3">
                    Under Sections 30 & 33 of the Kenya Data Protection Act, 2019, explicit parental or guardian consent is mandatory before capturing, storing, or sharing any photos of minor children. Please select your child's data sharing preference:
                  </p>
                  
                  <div className="space-y-2">
                    <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      photoConsent === "yes"
                        ? "bg-emerald-50/60 border-emerald-500 text-slate-800"
                        : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                    }`}>
                      <input
                        type="radio"
                        name="photoConsent"
                        value="yes"
                        checked={photoConsent === "yes"}
                        onChange={() => setPhotoConsent("yes")}
                        className="mt-1 accent-emerald-600"
                      />
                      <div className="text-xs">
                        <span className="font-bold block text-slate-900">✅ YES, Full Consent (Social Media & Updates)</span>
                        <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">
                          I allow Sandra to share sweet moments, learning milestones, and active play photos on her professional channels (TikTok, portfolio, website).
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                      photoConsent === "partial"
                        ? "bg-amber-50/60 border-amber-500 text-slate-800"
                        : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                    }`}>
                      <input
                        type="radio"
                        name="photoConsent"
                        value="partial"
                        checked={photoConsent === "partial"}
                        onChange={() => setPhotoConsent("partial")}
                        className="mt-1 accent-amber-600"
                      />
                      <div className="text-xs">
                        <span className="font-bold block text-slate-900">🔒 PARTIAL CONSENT (Private WhatsApp Updates Only)</span>
                        <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">
                          Sandra may share photos of my child <strong>only with me privately via WhatsApp</strong>. She is strictly forbidden from publishing any photo online.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Sitter Loyalty Rewards Program */}
                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm">🎁</span>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase">
                      5. Sandra's Loyalty Rewards Program
                    </label>
                  </div>
                  
                  <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isLoyaltyChecked
                      ? "bg-rose-50/55 border-rose-400 text-slate-800"
                      : "bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100/50"
                  }`}>
                    <input
                      type="checkbox"
                      checked={isLoyaltyChecked}
                      onChange={(e) => setIsLoyaltyChecked(e.target.checked)}
                      className="mt-1 accent-rose-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold block text-slate-900">
                        Claim 3 Free Hours on this Shift 🎉
                      </span>
                      <span className="text-[10px] text-slate-500 leading-normal block mt-0.5">
                        As a thank you for continued support, clients who complete <strong>5 consecutive bookings</strong> receive <strong>3 free hours</strong> on their next booking! (Saves KSh 750)
                      </span>
                      {isLoyaltyChecked && (
                        <span className="inline-block mt-2 bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wider">
                          ✓ Reward Activated: - KSh 750 subtracted from quote
                        </span>
                      )}
                    </div>
                  </label>
                </div>

                {/* Estimate Result Display */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">
                        Estimated Investment
                      </span>
                      <span className="font-mono text-2xl sm:text-3xl font-bold text-slate-900">
                        {profile.currency} {computedEstimate.toLocaleString()}
                      </span>
                    </div>

                     <a
                      href={whatsAppLink}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleBookingClick}
                      className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-xs uppercase tracking-wider transition-all"
                    >
                      <MessageSquare className="w-4 h-4" /> Pre-fill WhatsApp Book
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </motion.div>
      </section>

      {/* Interactive Booking Calendar & Availability Checker Section (Baby Blue / Purple complementary color scheme) */}
      <section id="availability" className="py-16 sm:py-24 bg-gradient-to-b from-indigo-50/50 via-slate-50 to-purple-50/50 border-b border-purple-100/50 relative overflow-hidden">
        {/* Abstract shapes representing cozy care */}
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-indigo-200/20 rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-200/20 rounded-full filter blur-2xl opacity-40"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-purple-600 text-xs font-bold uppercase tracking-wider font-mono bg-purple-100 px-3.5 py-1.5 rounded-full">
              📅 CHECK SITTER AVAILABILITY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-4 mb-4">
              Daily Schedule & Active Booking Slots
            </h2>
            <p className="text-sm text-slate-600">
              Select your preferred shift category, tap on your desired date, and check if Sandra has open slots. Green days are ready for immediate locking!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Category selector and Sitter Owner Settings */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Category selector */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-purple-100/50">
                <h3 className="font-serif font-bold text-lg text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="text-purple-500">⏱️</span> 1. Select Care Category
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Which type of schedule or shift do you require for your baby?
                </p>

                <div className="space-y-2.5">
                  {[
                    { id: "hourly", emoji: "⏱️", label: "Hourly Day Care", desc: "Daytime support (minimum 2 hours)" },
                    { id: "halfday", emoji: "☀️", label: "Half Day (Up to 5h)", desc: "Fixed daytime package up to 5 hours" },
                    { id: "fullday", emoji: "🌞", label: "Full Day (Up to 10h)", desc: "Extended daytime care up to 10 hours" },
                    { id: "datenight", emoji: "🌙", label: "Date Night (6pm-12am)", desc: "Evening support for parent events" },
                    { id: "latenight", emoji: "🌌", label: "Late Night (12am-5am)", desc: "Overnight/emergency hourly care" }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCalSelectedCategory(cat.id);
                        setSelectedServiceType(cat.id as any);
                        if (cat.id === "hourly") setCalcHours(4);
                        if (cat.id === "latenight") setCalcHours(3);
                      }}
                      className={`w-full flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all ${
                        calSelectedCategory === cat.id
                          ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/10"
                          : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/50"
                      }`}
                    >
                      <span className="text-xl bg-white/20 p-1.5 rounded-lg">{cat.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-xs block">{cat.label}</span>
                        <span className={`text-[10px] block leading-tight ${calSelectedCategory === cat.id ? "text-purple-100" : "text-slate-400"}`}>{cat.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Owner / Admin Control Settings (Reschedule and lock) */}
              <div className="bg-purple-900 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 text-6xl opacity-10">👩🏾‍🦱</div>
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                  <h4 className="font-bold text-sm flex items-center gap-2">
                    <span>👩🏾‍🦱</span> Sandra's Schedule Control
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdminMode}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          if (adminAuthenticated) {
                            setIsAdminMode(true);
                          } else {
                            setShowPasscodeField(true);
                          }
                        } else {
                          setIsAdminMode(false);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-purple-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <p className="text-[11px] text-purple-200 leading-relaxed mb-4">
                  Turn on to enable direct calendar overrides. Once turned on, you can click any day in the 14-day calendar to instantly block it out or make it available for reschedule!
                </p>

                {showPasscodeField && !adminAuthenticated && (
                  <div className="mb-4 p-3.5 bg-purple-950/60 rounded-2xl border border-purple-500/30 space-y-2.5">
                    <span className="block text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider">
                      🔒 Enter Caregiver Passcode
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Enter passcode..."
                        value={passcodeInput}
                        onChange={(e) => {
                          setPasscodeInput(e.target.value);
                          setPasscodeError("");
                        }}
                        className="flex-1 bg-purple-900/40 border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400 placeholder:text-purple-400"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            if (passcodeInput.trim() === "sandra2026") {
                              setAdminAuthenticated(true);
                              setIsAdminMode(true);
                              setShowPasscodeField(false);
                              setPasscodeInput("");
                              setPasscodeError("");
                            } else {
                              setPasscodeError("Incorrect passcode. Try again!");
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (passcodeInput.trim() === "sandra2026") {
                            setAdminAuthenticated(true);
                            setIsAdminMode(true);
                            setShowPasscodeField(false);
                            setPasscodeInput("");
                            setPasscodeError("");
                          } else {
                            setPasscodeError("Incorrect passcode. Try again!");
                          }
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all"
                      >
                        Unlock
                      </button>
                    </div>
                    {passcodeError && (
                      <span className="block text-[9px] text-rose-400 font-mono">
                        ❌ {passcodeError}
                      </span>
                    )}
                    <span className="block text-[8px] text-purple-400 leading-normal italic">
                      💡 Hint for Sandra: Enter <strong>sandra2026</strong> to unlock private administrative calendar controls.
                    </span>
                  </div>
                )}

                {adminAuthenticated ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-[10px] text-emerald-200 font-mono flex items-center justify-between">
                      <span className="animate-pulse">⚡ Admin Active: Click tiles to block!</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAdminAuthenticated(false);
                          setIsAdminMode(false);
                          setShowPasscodeField(false);
                        }}
                        className="text-purple-300 hover:text-white underline font-bold"
                      >
                        Lock Session
                      </button>
                    </div>
                  </div>
                ) : (
                  !showPasscodeField && (
                    <div className="text-[10px] text-purple-300 flex items-center gap-1.5 bg-white/5 px-2.5 py-1.5 rounded-lg w-max">
                      <Lock className="w-3.5 h-3.5" /> Private Owner Settings Locked
                    </div>
                  )
                )}
              </div>

            </div>

            {/* Right Column: 14-day interactive calendar grid */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-purple-100/50">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    2. Choose Date Slot
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing rolling 14-day real-time calendar availability.
                  </p>
                </div>
                
                {/* Legend badges */}
                <div className="flex items-center gap-3 text-[10px] font-semibold">
                  <span className="flex items-center gap-1 text-emerald-700 font-mono bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Available
                  </span>
                  <span className="flex items-center gap-1 text-rose-700 font-mono bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Booked Out
                  </span>
                </div>
              </div>

              {/* 14 Day Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {calendarDays.map((day) => {
                  const isBooked = bookedDays.includes(day.dateStr);
                  const isSelected = calSelectedDateStr === day.dateStr;
                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => {
                        if (isAdminMode) {
                          toggleBookedDay(day.dateStr);
                        } else {
                          setCalSelectedDateStr(day.dateStr);
                          setContractServiceDate(day.fullDateLabel);
                        }
                      }}
                      className={`relative p-3.5 rounded-2xl text-left border transition-all duration-200 group ${
                        isSelected
                          ? "ring-2 ring-purple-600 bg-purple-50 border-purple-300"
                          : "hover:border-slate-300 bg-white border-slate-200"
                      }`}
                    >
                      {/* Top labels */}
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-mono font-bold text-slate-400 block group-hover:text-purple-600 transition-colors">
                          {day.dayName}
                        </span>
                        
                        {/* Booked / Available Dot */}
                        <span className={`w-2 h-2 rounded-full ${isBooked ? "bg-rose-500 animate-ping" : "bg-emerald-500"}`}></span>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-xl font-bold font-mono block text-slate-900 group-hover:scale-105 transition-transform">
                          {day.dayNum}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide block">
                          {day.monthName}
                        </span>
                      </div>

                      {/* Bottom status badge */}
                      <div className={`mt-3 text-[9px] font-bold font-mono px-2 py-0.5 rounded-md text-center block ${
                        isBooked
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {isBooked ? "🔴 BOOKED" : "🟢 OPEN"}
                      </div>

                      {/* Admin Mode overlay toggle indicator */}
                      {isAdminMode && (
                        <div className="absolute inset-0 bg-purple-900/10 rounded-2xl border-2 border-dashed border-purple-500 flex items-center justify-center">
                          <span className="text-[9px] font-mono bg-purple-950/80 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                            Toggle ⚡
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selection Summary Alert */}
              {(() => {
                const selectedDayObj = calendarDays.find((d) => d.dateStr === calSelectedDateStr);
                const isSelectedDayBooked = bookedDays.includes(calSelectedDateStr);
                const categoryLabels: any = {
                  hourly: "⏱️ Hourly Day Care",
                  halfday: "☀️ Half Day (Up to 5h)",
                  fullday: "🌞 Full Day (Up to 10h)",
                  datenight: "🌙 Date Night (6pm-12am)",
                  latenight: "🌌 Late Night (12am-5am)"
                };

                return (
                  <div className={`mt-6 p-4 rounded-2xl border ${
                    isSelectedDayBooked
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-800"
                      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-800"
                  }`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{isSelectedDayBooked ? "❌" : "✅"}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold leading-normal">
                          {selectedDayObj?.fullDateLabel || "Selected Day"} — {categoryLabels[calSelectedCategory]}
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                          {isSelectedDayBooked 
                            ? "This slot is currently booked or unavailable. Sandra is fully booked or enjoying rest on this day. Please pick another date!" 
                            : "Excellent! This day is open and Sandra is 100% available to support you. You can synchronize this day into your pre-filled WhatsApp book parameters!"
                          }
                        </p>
                        
                        {!isSelectedDayBooked && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedServiceType(calSelectedCategory as any);
                                // scroll slightly to calculator
                                const calcElem = document.getElementById("rates");
                                if (calcElem) calcElem.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm"
                            >
                              Sync Date to Calculator & Rates
                            </button>
                            <a
                              href={whatsAppLink}
                              target="_blank"
                              rel="noreferrer"
                              onClick={handleBookingClick}
                              className="bg-emerald-50 hover:bg-emerald-600 text-white font-semibold text-[10px] px-3.5 py-1.5 rounded-lg transition-all shadow-sm flex items-center gap-1"
                            >
                              Pre-fill WhatsApp Request
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>

        </div>
      </section>

      {/* Covered Estates & Interactive Area Finder */}
      <section id="coverage" className="py-16 sm:py-20 bg-white/70 border-y border-rose-100/30">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
            <div className="lg:col-span-6">
              <span className="text-rose-500 text-xs font-bold uppercase tracking-wider font-mono">
                TRAVEL DISTANCES & LOGISTICS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1.5 mb-4">
                Service Coverage Areas 📍
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                I travel all across major residential counties in Nairobi and neighboring suburbs. Type your estate name in the smart search engine to check if we cover your area instantly!
              </p>
            </div>

            {/* Smart search form */}
            <div className="lg:col-span-6 bg-slate-50 p-5 rounded-2xl border border-rose-100/40 shadow-sm">
              <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-rose-500" /> Live Neighborhood Coverage Checker
              </h4>
              <form onSubmit={handleAreaSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type estate (e.g. Kilimani, Syokimau, Ruaka)..."
                  value={areaSearchQuery}
                  onChange={(e) => setAreaSearchQuery(e.target.value)}
                  className="flex-1 bg-white border border-rose-100/80 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  Check
                </button>
              </form>

              {/* Search results banner */}
              <AnimatePresence mode="wait">
                {searchResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`mt-4 p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      searchResult.found
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-800"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-800"
                    }`}
                  >
                    {searchResult.found ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Excellent news!</strong> Sandra travels to <strong>{searchResult.estate}</strong> ({searchResult.county}). Rates and scheduling are active.
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Not on the list?</strong> Don't worry! Send Sandra a message. She often travels to bordering estates. <a href={whatsAppLink} target="_blank" rel="noreferrer" className="underline font-bold text-amber-950 hover:text-rose-600">Ask Sandra on WhatsApp 🌸</a>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quick checks suggestion */}
              <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-400">
                <span>Try quick checking:</span>
                {["Westlands", "Runda", "Syokimau", "Kitengela"].map((est) => (
                  <button
                    key={est}
                    type="button"
                    onClick={() => handleQuickSearch(est)}
                    className="bg-white hover:bg-rose-50 text-slate-500 px-2 py-0.5 rounded border border-rose-100/50"
                  >
                    {est}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NAIROBI CONSTITUENCIES SELECTOR WIDGET */}
          <div className="bg-slate-50 border border-brand-teal/10 rounded-3xl p-6 sm:p-8 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full filter blur-2xl"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-brand-teal text-[10px] font-bold uppercase tracking-wider font-mono bg-brand-teal/10 px-2.5 py-1 rounded-full">
                  Nairobi County Local Geofocus
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 mt-2">
                  Nairobi's 17 Constituencies Coverage Tracker 🇰🇪
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Click the dropdown to automatically highlight any of Nairobi's official 17 sub-counties Sandra serves.
                </p>
              </div>

              {/* Constituencies Dropdown Select */}
              <div className="w-full md:w-72 flex-shrink-0">
                <label className="block text-[10px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5 font-mono">
                  Select Constituency:
                </label>
                <div className="relative">
                  <select
                    value={selectedConstituency}
                    onChange={(e) => setSelectedConstituency(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold shadow-sm focus:outline-none focus:border-brand-teal transition appearance-none cursor-pointer pr-10"
                  >
                    {NAIROBI_CONSTITUENCIES.map((constName) => (
                      <option key={constName} value={constName}>
                        📍 {constName} Constituency
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Grid of 17 Constituencies with Interactive Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {NAIROBI_CONSTITUENCIES.map((constName) => {
                const isSelected = selectedConstituency === constName;
                return (
                  <button
                    key={constName}
                    type="button"
                    onClick={() => setSelectedConstituency(constName)}
                    className={`p-3 rounded-2xl text-xs font-semibold text-center transition-all duration-300 border ${
                      isSelected
                        ? "bg-brand-teal border-brand-teal text-white shadow-md shadow-brand-teal/10 scale-105"
                        : "bg-white border-slate-200/60 text-slate-600 hover:bg-slate-100/50"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm">
                        {isSelected ? "⭐️" : "📍"}
                      </span>
                      <span className="truncate max-w-full font-medium">
                        {constName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Highlighting Info Bar */}
            <div className="mt-5 p-3.5 bg-white/80 rounded-2xl border border-brand-teal/5 flex items-center gap-3">
              <span className="text-lg">💁🏾‍♀️</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Currently tracking <strong>{selectedConstituency} Constituency</strong>. Sandra travels to all estates, apartments, and gated complexes in {selectedConstituency}. Pre-filled WhatsApp requests will automatically flag this constituency!
              </p>
            </div>
          </div>

          {/* Counties Tabs Interface */}
          <div className="bg-white rounded-3xl border border-rose-100 shadow-md overflow-hidden">
            <div className="flex border-b border-rose-100 bg-slate-50/50 overflow-x-auto scrollbar-hide">
              {SERVICE_AREAS.map((item) => (
                <button
                  key={item.county}
                  onClick={() => setActiveCountyTab(item.county)}
                  className={`px-5 py-4 text-xs font-semibold uppercase tracking-wider font-mono border-b-2 whitespace-nowrap transition-all ${
                    activeCountyTab === item.county
                      ? "border-rose-500 text-rose-600 bg-white"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  📍 {item.county}
                </button>
              ))}
            </div>

            <div className="p-6 sm:p-8">
              {SERVICE_AREAS.map((item) => {
                if (item.county !== activeCountyTab) return null;
                return (
                  <div key={item.county} className="space-y-4">
                    <p className="text-xs sm:text-sm text-slate-500 italic mb-2">
                      💡 {item.description}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {item.areas.map((area, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-rose-50/30 border border-rose-100/30 p-3 rounded-xl text-xs font-medium text-slate-800 hover:border-rose-200 transition-colors"
                        >
                          <span className="text-rose-400">🌸</span>
                          {area}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </motion.div>
      </section>

      {/* Safety & Contract Transition Section */}
      <section id="safety" className="py-16 sm:py-24 bg-gradient-to-br from-white via-rose-50/20 to-white border-y border-rose-100/30">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider font-mono bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              🎀 LEGAL & SECURITY STANDARDS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-4 mb-4">
              Babysitting Service Binding Contract 📜
            </h2>
            <p className="text-sm text-slate-600">
              For mutual peace of mind, we have retired sharing physical ID documents. Instead, we co-sign this transparent, formal agreement protecting both families.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Fillable Form */}
            <div className="lg:col-span-6 space-y-6 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-rose-100">
              <div className="flex items-center justify-between border-b border-rose-50 pb-4">
                <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-1.5">
                  <span className="text-rose-500">✍🏾</span> 1. Complete Agreement Details
                </h3>
                <button
                  type="button"
                  onClick={syncEstimatorToContract}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                >
                  🔄 Sync from Calculator
                </button>
              </div>

              <div className="space-y-4">
                {/* Hidden honeypot field to detect and block automated bot submissions and spam */}
                <div className="absolute opacity-0 pointer-events-none -z-50 w-0 h-0" aria-hidden="true">
                  <label htmlFor="contract_spam_check">Do not fill this field</label>
                  <input
                    id="contract_spam_check"
                    type="text"
                    name="contract_spam_check"
                    value={contractHoneypot}
                    onChange={(e) => setContractHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {/* Parent Legal Name */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                    Parent/Guardian Full Legal Name:
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your first and last name..."
                    value={contractParentName}
                    onChange={(e) => setContractParentName(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-bold"
                  />
                </div>

                {/* Child names & Ages */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                    Children Name(s) & Age(s):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ethan (3 years), Chloe (10 months)..."
                    value={contractChildNames}
                    onChange={(e) => setContractChildNames(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Number of Kids */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                      Number of Children:
                    </label>
                    <select
                      value={contractChildCount}
                      onChange={(e) => setContractChildCount(Number(e.target.value))}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 font-bold"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Child" : "Children"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sitter Date */}
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                      Service Booking Date:
                    </label>
                    <input
                      type="text"
                      placeholder="Select date on calendar..."
                      value={contractServiceDate}
                      onChange={(e) => setContractServiceDate(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Working hours */}
                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                    Hours & Shift Details:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Full Day package, or 2:00 PM - 8:00 PM (6 hours)..."
                    value={contractWorkingHours}
                    onChange={(e) => setContractWorkingHours(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium"
                  />
                </div>

                {/* Emergency contact row 1 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                      Primary Emergency Contact Name:
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name..."
                      value={contractEmergencyNamePrimary}
                      onChange={(e) => setContractEmergencyNamePrimary(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                      Primary Emergency Phone:
                    </label>
                    <input
                      type="text"
                      placeholder="Phone Number..."
                      value={contractEmergencyPhonePrimary}
                      onChange={(e) => setContractEmergencyPhonePrimary(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Emergency contact row 2 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                      Secondary Emergency Contact Name:
                    </label>
                    <input
                      type="text"
                      placeholder="Full Name..."
                      value={contractEmergencyNameSecondary}
                      onChange={(e) => setContractEmergencyNameSecondary(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                      Secondary Emergency Phone:
                    </label>
                    <input
                      type="text"
                      placeholder="Phone Number..."
                      value={contractEmergencyPhoneSecondary}
                      onChange={(e) => setContractEmergencyPhoneSecondary(e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Data Privacy Disclaimer */}
              <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 text-[10px] text-rose-800 leading-relaxed">
                🛡️ <strong>Kenyan DPA 2019 Protection:</strong> All details entered in this local scratchpad agreement remain strictly private on your device. We never sell, upload, or transmit your confidential emergency info anywhere.
              </div>
            </div>

            {/* Right Column: Beautiful live co-signed parchment layout */}
            <div className="lg:col-span-6 bg-amber-50/40 rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/50 relative overflow-hidden flex flex-col justify-between">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full filter blur-xl"></div>
              
              <div>
                {/* Parchment top stamp banner */}
                <div className="flex items-center justify-between border-b border-amber-200/60 pb-3 mb-5">
                  <span className="font-serif font-bold text-xs text-rose-700 tracking-wider flex items-center gap-1.5 uppercase">
                    📜 Binding Service Agreement
                  </span>
                  <span className="text-[8px] bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                    Legally Binding
                  </span>
                </div>

                {/* Contract Body Sheet */}
                <div className="bg-white/80 p-5 rounded-2xl border border-amber-200/40 space-y-4 shadow-inner text-[11px] text-slate-700 leading-relaxed font-sans">
                  <p className="font-serif italic text-center text-[10px] text-slate-500 border-b border-amber-100 pb-2">
                    "Executed under mutual trust and Kenyan childcare compliance best-practices."
                  </p>

                  <div className="space-y-2 font-mono text-[10px]">
                    <div>
                      <strong className="text-slate-900">CLIENT (PARENT/GUARDIAN):</strong>
                      <div className="bg-slate-100/50 p-2 rounded mt-1 text-slate-800 font-bold">
                        👤 {contractParentName.trim() || "___________________ (Please enter legal name)"}
                      </div>
                    </div>

                    <div>
                      <strong className="text-slate-900">CAREGIVER (BABYSITTER):</strong>
                      <div className="p-1 text-rose-700 font-bold">
                        👩🏾‍🦱 Sandra (@babysitternairobi)
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-amber-100/50 pt-2.5">
                      <div>
                        <strong className="text-slate-900 block">CHILDREN COUNT:</strong>
                        <span className="text-slate-800 font-bold">{contractChildCount} Child(ren)</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 block">PROPOSED DATE:</strong>
                        <span className="text-slate-800 font-bold text-[9px]">{contractServiceDate || "Tap Calendar above"}</span>
                      </div>
                    </div>

                    <div className="border-t border-amber-100/50 pt-2.5">
                      <strong className="text-slate-900 block">CHILD NAMES & AGES:</strong>
                      <span className="text-slate-800 font-medium italic block bg-slate-50/50 px-2 py-1.5 rounded border border-slate-100">
                        {contractChildNames.trim() || "Not specified yet"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-amber-100/50 pt-2.5">
                      <div>
                        <strong className="text-slate-900 block">PRIMARY MEDICAL CONTACT:</strong>
                        <span className="text-slate-800 font-semibold">{contractEmergencyNamePrimary || "Not specified"} ({contractEmergencyPhonePrimary || "N/A"})</span>
                      </div>
                      <div>
                        <strong className="text-slate-900 block">SECONDARY CONTACT:</strong>
                        <span className="text-slate-800 font-semibold">{contractEmergencyNameSecondary || "Not specified"} ({contractEmergencyPhoneSecondary || "N/A"})</span>
                      </div>
                    </div>

                    <div className="border-t border-amber-100/50 pt-2.5 text-[9px] text-slate-500 space-y-1">
                      <p>✓ Homework Aid & Nutritional Meal Prep included 100% free of charge.</p>
                      <p>✓ Minimum 2 hours per shift, no maximum cap applied.</p>
                      <p>✓ Transport (Uber/Bolt) covered after 10:00 PM for Sandra's safety.</p>
                    </div>
                  </div>
                </div>

                {/* Electronic Co-Signatures */}
                <div className="mt-5 p-4 bg-amber-100/30 rounded-2xl border border-amber-200/50 grid grid-cols-2 gap-4 text-center">
                  <div className="border-r border-amber-200/50 pr-2">
                    <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 block mb-1">Parent Signature</span>
                    {contractParentName.trim() ? (
                      <span className="font-serif font-bold italic text-slate-800 text-sm block border-b border-dashed border-slate-400 pb-1">
                        ✍🏾 {contractParentName.trim()}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic block py-1">Awaiting name...</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 block mb-1">Caregiver Signature</span>
                    <span className="font-serif font-extrabold italic text-rose-700 text-sm block border-b border-dashed border-rose-300 pb-1">
                      🌸 Sandra (Signed)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 space-y-2.5">
                <button
                  type="button"
                  onClick={handleDownloadContract}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white text-center py-3.5 px-4 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 tracking-wider uppercase"
                >
                  📥 Download Printable Contract Agreement
                </button>
                
                {isContractSaved && (
                  <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-700 text-center font-bold">
                    ✓ Contract downloaded successfully! Send this file to Sandra to seal the date!
                  </div>
                )}
              </div>

            </div>

          </div>

        </motion.div>
      </section>

      {/* Parenting Values & Guarantees */}
      <section className="py-16 sm:py-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider font-mono">
              MY UNWAVERING SERVICE PLEDGE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1.5 mb-4">
              My Core Commitments to Nairobi Parents ❤️
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Your child deserves more than just a passive screen watcher. I pride myself on providing an elite standard of attentive, structured child care:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {VALUES.map((val, idx) => (
              <div key={idx} className="space-y-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-xl text-rose-600 border border-rose-100/30">
                  {val.icon}
                </div>
                <h4 className="font-serif font-bold text-base text-slate-900">
                  {val.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {val.description}
                </p>
              </div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider font-mono">
              COMMON CONCERNS & REASSURANCE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1.5 mb-4">
              Nairobi Nanny & Babysitting FAQ 🤔
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Safety, schedules, emergencies, and transport can be stressful. Here are direct answers addressing core parent safety worries:
            </p>
          </div>

          <div className="space-y-3.5">
            {SAFETY_FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-serif font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-rose-500" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-rose-50/50 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Quick FAQ summary callout */}
          <div className="mt-8 text-center bg-rose-50/60 p-4 rounded-2xl border border-rose-100/50 max-w-2xl mx-auto">
            <p className="text-xs text-slate-600 leading-relaxed">
              Have other questions about overnight sleeping arrangements, baby formulas, or multi-day discounts? Ask Sandra directly! Let's arrange a call.
            </p>
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 mt-2 hover:underline"
            >
              Ask custom question on WhatsApp 🌸
            </a>
          </div>

        </motion.div>
      </section>

      {/* Floating CTA & Footer Section */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-md mx-auto space-y-6 mb-10">
            <span className="text-rose-400 text-3xl block">🌸</span>
            <h3 className="font-serif text-2xl text-white font-bold tracking-tight">
              Let's Keep Your Little Humans Happy & Safe!
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tap below to connect with Sandra on WhatsApp instantly and block your next date. Shifts get booked quickly!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/15 tracking-wider uppercase transition-colors"
              >
                <Smartphone className="w-4 h-4" /> WhatsApp: {profile.rawPhone}
              </a>
              <a
                href={profile.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-6 py-3 rounded-full flex items-center justify-center gap-2 border border-slate-700 tracking-wider uppercase transition-colors"
              >
                📱 Follow on TikTok
              </a>
            </div>

            {/* Interactive Social Media Handles Placeholders */}
            <div className="pt-4 flex items-center justify-center gap-4 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase">My Socials:</span>
              <a href="https://instagram.com/babysitternairobi" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 font-medium">
                📸 Instagram
              </a>
              <span className="text-slate-800">•</span>
              <a href="https://facebook.com/babysitternairobi" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 font-medium">
                👥 Facebook
              </a>
              <span className="text-slate-800">•</span>
              <a href="https://x.com/babysitternbi" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-medium">
                🐦 X (Twitter)
              </a>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="text-center md:text-left">
              <p>© 2026 @{profile.handle} • Babysits Nairobi. All rights reserved.</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mt-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-slate-400 hover:text-white hover:underline transition-colors focus:outline-none cursor-pointer"
                >
                  Terms of Use
                </button>
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-slate-400 hover:text-white hover:underline transition-colors focus:outline-none cursor-pointer"
                >
                  Privacy Policy
                </button>
                <span className="text-slate-700">|</span>
                <span className="text-slate-600">Certified local contract compliance</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800/60 text-[10px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Premium Onepage Template Pitch Platform</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Terms of Use Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTermsModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 z-10 relative overflow-hidden max-h-[85vh] flex flex-col justify-between text-left"
            >
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto pr-2 space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
                <div className="border-b border-rose-50 pb-3">
                  <span className="text-rose-500 font-bold uppercase tracking-wider font-mono text-[10px]">🌸 Legal Agreement</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-bold tracking-tight mt-1">Terms of Use</h3>
                </div>

                <p className="font-bold text-slate-800">Welcome to @{profile.handle}'s Babysitting Platform.</p>
                
                <p>
                  By accessing this portfolio, calculating estimated rates, or locking in dates on the interactive availability checker, you agree to the following terms and conditions:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <span className="font-bold text-rose-500">1.</span>
                    <p><strong>Care Parameters:</strong> Sandra provides professional in-home babysitting and developmental childcare within designated Nairobi estates. Minimum booking duration is strictly 2 hours.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-rose-500">2.</span>
                    <p><strong>Pricing Rules:</strong> All computed estimates are tailored matching actual rate frameworks. Additional child surcharges apply per extra child as transparently declared.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-rose-500">3.</span>
                    <p><strong>Safety Protocol:</strong> Safe transport cover (Uber/Bolt) is required for late night shifts ending after 10:00 PM for the caregiver's safety.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-rose-500">4.</span>
                    <p><strong>Cancellation:</strong> Bookings can be rescheduled or cancelled free of charge with at least 12 hours prior notice to Sandra.</p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  Last updated: July 2026. Standardized under Kenyan childcare and contract regulations.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Close & I Agree
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 z-10 relative overflow-hidden max-h-[85vh] flex flex-col justify-between text-left"
            >
              <button
                type="button"
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto pr-2 space-y-4 text-slate-600 text-xs sm:text-sm leading-relaxed">
                <div className="border-b border-rose-50 pb-3">
                  <span className="text-rose-500 font-bold uppercase tracking-wider font-mono text-[10px]">🛡️ Data Protection Act 2019</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-slate-900 font-bold tracking-tight mt-1">Privacy Policy</h3>
                </div>

                <p className="font-bold text-slate-800">Your privacy is fully protected under Kenyan law.</p>
                
                <p>
                  In compliance with the <strong>Kenya Data Protection Act, 2019 (ODPC)</strong>, we take the security of your family and child data extremely seriously:
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-500">✓</span>
                    <p><strong>Zero Data Retention:</strong> All personal details, names, ages, and emergency contact numbers entered in our local agreement form remain strictly client-side on your browser cache. We never upload or save this info to external database servers.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-500">✓</span>
                    <p><strong>Consent Authority:</strong> We strictly abide by your photo sharing consent preferences selected during rate estimation. Partial consent ensures no minor child photos are ever published online.</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-emerald-500">✓</span>
                    <p><strong>Secure Links:</strong> Our integration dispatchers utilize encrypted webhook gateways to notify the team of booking triggers, completely hiding specific sensitive names or locations.</p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                  Registered Compliance under ODPC Kenya Child Data Protection best practices.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Close & Acknowledge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
