import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";

export default function StatusBadge({ type, value }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  if (type === "priority") {
    const map = {
      CRITICAL: "bg-red-100 text-red-900 border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800 font-black",
      HIGH: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-800 font-bold",
      MEDIUM: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800 font-semibold",
      LOW: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800 font-medium",
      MEETS_REQUIREMENT: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800 font-bold"
    };

    const labelMapEn = {
      CRITICAL: "CRITICAL PRIORITY (51+)",
      HIGH: "HIGH PRIORITY (26-50)",
      MEDIUM: "MEDIUM PRIORITY (11-25)",
      LOW: "LOW PRIORITY (1-10)",
      MEETS_REQUIREMENT: "MEETS REQUIREMENT"
    };

    const labelMapHi = {
      CRITICAL: "अति महत्वपूर्ण प्राथमिकता (51+)",
      HIGH: "उच्च प्राथमिकता (26-50)",
      MEDIUM: "मध्यम प्राथमिकता (11-25)",
      LOW: "अल्प प्राथमिकता (1-10)",
      MEETS_REQUIREMENT: "आवश्यकता पूर्ण"
    };

    const labelMap = isHi ? labelMapHi : labelMapEn;

    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider ${map[value] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"}`}>
        {labelMap[value] || `${value} PRIORITY`}
      </span>
    );
  }

  if (type === "status") {
    const map = {
      COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
      NOT_STARTED: "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
      RECOMMENDED: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
      ENROLLED: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800"
    };

    const statusMapHi = {
      COMPLETED: "पूर्ण",
      IN_PROGRESS: "प्रगति पर",
      NOT_STARTED: "शुरू नहीं हुआ",
      RECOMMENDED: "अनुशंसित",
      ENROLLED: "नामांकित"
    };

    const displayVal = isHi && statusMapHi[value] ? statusMapHi[value] : value?.replace(/_/g, " ") || "";

    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${map[value] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"}`}>
        {displayVal}
      </span>
    );
  }

  if (type === "domain") {
    const map = {
      "Statistical": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
      "Technical": "bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-800",
      "Digital Governance": "bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
      "Behavioural & Managerial": "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
    };

    const domainMapHi = {
      "Statistical": "सांख्यिकीय",
      "Technical": "तकनीकी",
      "Digital Governance": "डिजिटल शासन",
      "Behavioural & Managerial": "व्यवहार एवं प्रबंधन"
    };

    const displayDomain = isHi && domainMapHi[value] ? domainMapHi[value] : value;

    return (
      <span className={`text-[10px] px-2 py-0.5 rounded font-medium border ${map[value] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"}`}>
        {displayDomain}
      </span>
    );
  }

  return (
    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
      {t(value, value)}
    </span>
  );
}
