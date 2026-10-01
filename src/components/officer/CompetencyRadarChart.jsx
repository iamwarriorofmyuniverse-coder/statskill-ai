import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { Target, Award, Sparkles } from "lucide-react";

function CustomRadarTooltip({ active, payload, isHi }) {
  if (active && payload && payload.length) {
    const itemData = payload[0]?.payload || {};
    const title = itemData.domainLabel || itemData.domain || "Competency";
    const currentVal = payload.find((p) => p.dataKey === "current")?.value || itemData.current || 0;
    const targetVal = payload.find((p) => p.dataKey === "target")?.value || itemData.target || 0;
    const gap = Number((targetVal - currentVal).toFixed(1));

    return (
      <div className="bg-slate-900/95 dark:bg-slate-950/95 text-white p-3.5 rounded-xl shadow-2xl border-2 border-sky-400/50 text-xs animate-floating-pill pointer-events-none backdrop-blur-md min-w-[200px] z-50">
        <div className="font-extrabold text-white text-xs mb-2 flex items-center justify-between space-x-2 border-b border-slate-700/80 pb-1.5">
          <span className="text-sky-300 font-bold">{title}</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              gap > 0
                ? "bg-orange-500/20 text-orange-300 border border-orange-500/50"
                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50"
            }`}
          >
            {gap > 0 ? `${isHi ? "कमी" : "Gap"}: -${gap}` : (isHi ? "मानक पूर्ण" : "Standard Met")}
          </span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between space-x-3">
            <span className="text-slate-300 font-medium">{isHi ? "वर्तमान स्तर:" : "Current Level:"}</span>
            <span className="font-mono font-extrabold text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/60">
              {currentVal} / 5.0
            </span>
          </div>
          <div className="flex items-center justify-between space-x-3">
            <span className="text-slate-300 font-medium">{isHi ? "लक्ष्य मानक:" : "Target Standard:"}</span>
            <span className="font-mono font-extrabold text-orange-300 bg-orange-950/80 px-2 py-0.5 rounded border border-orange-800/60">
              {targetVal} / 5.0
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export default function CompetencyRadarChart({ data }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";
  const [hoveredDomain, setHoveredDomain] = useState(null);

  // Take a representative subset for clean radar visualization if large
  const rawData = data && data.length > 0 ? data.slice(0, 10) : [
    { domain: "Survey Design", current: 3.8, target: 4.0 },
    { domain: "Sampling", current: 3.5, target: 4.0 },
    { domain: "Data Quality", current: 4.2, target: 5.0 },
    { domain: "Official Stats", current: 4.0, target: 4.0 },
    { domain: "Python", current: 3.1, target: 4.0 },
    { domain: "SQL", current: 3.4, target: 4.0 },
    { domain: "AI/ML", current: 1.8, target: 4.0 },
    { domain: "Data Privacy", current: 2.1, target: 4.0 },
    { domain: "Ethics", current: 4.8, target: 5.0 },
    { domain: "Project Mgmt", current: 2.4, target: 4.0 }
  ];

  const displayData = rawData.map((item) => ({
    ...item,
    domainLabel: t(item.domain, item.domain)
  }));

  const currentRadarName = isHi ? "वर्तमान प्रवीणता (1-5)" : "Current Proficiency (1-5)";
  const targetRadarName = isHi ? "लक्ष्य (वरिष्ठ सांख्यिकी विश्लेषक)" : "Target (Senior Statistical Analyst)";

  const activeItem = hoveredDomain ? displayData.find((d) => d.domain === hoveredDomain.domain) : null;

  return (
    <div className="w-full flex flex-col space-y-3">
      <div className="w-full h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={displayData}>
            <PolarGrid stroke="#64748b" strokeOpacity={0.4} />
            <PolarAngleAxis
              dataKey="domainLabel"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 5]}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <Tooltip
              content={<CustomRadarTooltip isHi={isHi} />}
              isAnimationActive={false}
              cursor={{ stroke: "#38bdf8", strokeWidth: 1.5, strokeDasharray: "3 3" }}
            />
            <Radar
              name={currentRadarName}
              dataKey="current"
              stroke="#134074"
              fill="#134074"
              fillOpacity={0.45}
              dot={{ r: 4.5, fill: "#134074", fillOpacity: 0.9, stroke: "#ffffff", strokeWidth: 1.5 }}
              activeDot={{ r: 8, fill: "#0ea5e9", stroke: "#ffffff", strokeWidth: 2.5 }}
            />
            <Radar
              name={targetRadarName}
              dataKey="target"
              stroke="#ea580c"
              fill="#ea580c"
              fillOpacity={0.15}
              strokeDasharray="4 4"
              dot={{ r: 3.5, fill: "#ea580c", fillOpacity: 0.9, stroke: "#ffffff", strokeWidth: 1 }}
              activeDot={{ r: 7, fill: "#f97316", stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Quick-Inspect Competency Chips (Click / Hover to Pin) */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>{isHi ? "दक्षता त्वरित निरीक्षण (हॉवर/क्लिक करें):" : "Interactive Domain Inspector:"}</span>
          </span>
          {activeItem && (
            <span className="text-[10px] text-gov-blue dark:text-sky-300 font-bold animate-pulse">
              {activeItem.domainLabel}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {displayData.map((d) => {
            const isSelected = hoveredDomain?.domain === d.domain;
            const diff = Number((d.target - d.current).toFixed(1));
            return (
              <button
                key={d.domain}
                onMouseEnter={() => setHoveredDomain(d)}
                onMouseLeave={() => setHoveredDomain(null)}
                onClick={() => setHoveredDomain(isSelected ? null : d)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-gov-blue text-white border-gov-blue shadow-md scale-105"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <span>{d.domainLabel}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono font-black ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : diff > 0
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }`}>
                  {d.current} / {d.target}
                </span>
              </button>
            );
          })}
        </div>

        {/* Highlighted Domain Floating Info Banner */}
        {activeItem && (
          <div className="mt-2.5 p-3 bg-gradient-to-r from-sky-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-xl border-2 border-sky-400/60 shadow-md text-xs animate-floating-pill flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gov-blue text-white flex items-center justify-center font-black">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block">
                  {activeItem.domainLabel}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isHi ? "वर्तमान स्कोर:" : "Current:"} <strong className="text-gov-blue dark:text-sky-300">{activeItem.current}</strong> | {isHi ? "लक्ष्य मानक:" : "Target Standard:"} <strong className="text-orange-600 dark:text-orange-400">{activeItem.target}</strong>
                </span>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
              activeItem.target > activeItem.current
                ? "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border border-orange-300"
                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
            }`}>
              {activeItem.target > activeItem.current
                ? `${isHi ? "कमी" : "Gap"}: -${(activeItem.target - activeItem.current).toFixed(1)} pts`
                : (isHi ? "मानक पूर्ण" : "Standard Met")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
