import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Globe2,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  Layers,
  TrendingUp,
  MapPin,
  Building2,
  Sparkles,
  BarChart3,
  Award,
  Users,
  Compass,
  ArrowUpRight
} from "lucide-react";

const ZONAL_FOD_DATA = [
  {
    id: "zone-north",
    name: "Northern Zone (HQ: New Delhi)",
    nameHi: "उत्तरी क्षेत्र (मुख्यालय: नई दिल्ली)",
    cadreCount: 3840,
    readinessScore: 94,
    status: "OPTIMAL",
    primaryGap: "Advanced Econometrics",
    criticalRisk: false,
    censusReady: 96,
    plfsReady: 98
  },
  {
    id: "zone-south",
    name: "Southern Zone (HQ: Bengaluru)",
    nameHi: "दक्षिणी क्षेत्र (मुख्यालय: बेंगलुरु)",
    cadreCount: 3410,
    readinessScore: 91,
    status: "OPTIMAL",
    primaryGap: "DPDP Section 8 Encryption",
    criticalRisk: false,
    censusReady: 92,
    plfsReady: 95
  },
  {
    id: "zone-west",
    name: "Western Zone (HQ: Mumbai)",
    nameHi: "पश्चिमी क्षेत्र (मुख्यालय: मुंबई)",
    cadreCount: 2950,
    readinessScore: 88,
    status: "STABLE",
    primaryGap: "ASI Corporate Factory Accounts",
    criticalRisk: false,
    censusReady: 89,
    plfsReady: 91
  },
  {
    id: "zone-east",
    name: "Eastern Zone (HQ: Kolkata)",
    nameHi: "पूर्वी क्षेत्र (मुख्यालय: कोलकाता)",
    cadreCount: 2180,
    readinessScore: 74,
    status: "VULNERABLE",
    primaryGap: "Python Microdata ETL & Scrubbing",
    criticalRisk: true,
    censusReady: 68,
    plfsReady: 78
  },
  {
    id: "zone-central",
    name: "Central Zone (HQ: Nagpur)",
    nameHi: "मध्य क्षेत्र (मुख्यालय: नागपुर)",
    cadreCount: 1420,
    readinessScore: 71,
    status: "VULNERABLE",
    primaryGap: "Stratum Weight & Multiplier Math",
    criticalRisk: true,
    censusReady: 64,
    plfsReady: 75
  },
  {
    id: "zone-ne",
    name: "North-Eastern Zone (HQ: Guwahati)",
    nameHi: "पूर्वोत्तर क्षेत्र (मुख्यालय: गुवाहाटी)",
    cadreCount: 1020,
    readinessScore: 59,
    status: "CRITICAL_GAP",
    primaryGap: "Digital Geo-Tagging & DPDP Act 2023",
    criticalRisk: true,
    censusReady: 52,
    plfsReady: 66
  }
];

export default function NationalWarRoomPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [selectedZone, setSelectedZone] = useState(ZONAL_FOD_DATA[0]);
  const [dispatching, setDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const handleDeployTargetedCohort = () => {
    setDispatching(true);
    setTimeout(() => {
      setDispatching(false);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6">
      {/* War Room Flagship Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gov-navy via-slate-900 to-emerald-950 p-4 sm:p-6 text-white shadow-xl border border-emerald-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isHi ? "मोस्पी राष्ट्रीय कमान केंद्र • मैक्रो डिजिटल ट्विन" : "MoSPI National Command War Room • Cadre Digital Twin"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <Globe2 className="w-8 h-8 text-emerald-400 shrink-0" />
              <span>{isHi ? "राष्ट्रीय संवर्ग तत्परता एवं क्षेत्रीय FOD हीटमैप" : "National Statistical Cadre Readiness & FOD Zonal War Room"}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isHi
                ? "सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) मुख्यालय तथा NSSTA नेतृत्व हेतु रणनीतिक कमान केंद्र। देश भर के 6 क्षेत्रीय फील्ड ऑपरेशंस डिवीजन (FOD) में संवर्ग तत्परता की निगरानी करें और आगामी 8वीं आर्थिक गणना व डिजिटल जनगणना से पहले स्वचालित सुधारात्मक प्रशिक्षण तैनात करें।"
                : "Strategic macro command console for MoSPI Headquarters and NSSTA leadership. Monitor cadre readiness across all 6 Regional Field Operations Divisions (FOD), pinpoint systemic skill vulnerabilities, and dispatch automated iGOT remedial cohorts before major national surveys."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleDeployTargetedCohort}
              disabled={dispatching}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>{dispatching ? (isHi ? "प्रशिक्षण बैच तैनात हो रहा है..." : "Deploying Cohorts...") : (isHi ? "लक्षित AI प्रशिक्षण बैच तैनात करें" : "Deploy Targeted AI Cohort")}</span>
            </button>
          </div>
        </div>

        {/* Macro KPIs */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "सक्रिय राष्ट्रीय संवर्ग" : "Active National Cadre"}</span>
            <span className="font-bold text-xl text-white">14,820 Officers</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "राष्ट्रीय औसत तत्परता" : "National Readiness Index"}</span>
            <span className="font-bold text-xl text-emerald-400">83.6% Optimal</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "आगामी 8वीं आर्थिक गणना" : "8th Economic Census Readiness"}</span>
            <span className="font-bold text-xl text-amber-400">62.8% (Intervention Required)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "जोखिम वाले क्षेत्रीय क्षेत्र" : "Vulnerable Regional FODs"}</span>
            <span className="font-bold text-xl text-red-400">3 of 6 Zones Flagged</span>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {dispatchSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>
            {isHi
              ? "सफलतापूर्वक 4,620 अधिकारियों (पूर्वी, मध्य एवं पूर्वोत्तर FOD) को लक्षित iGOT कर्मयोगी माइक्रोडाटा और DPDP 2023 सुधारात्मक पाठ्यक्रम स्वतः आवंटित किए गए।"
              : "Successfully dispatched targeted iGOT Karmayogi remediation modules to 4,620 officers across Eastern, Central & North-Eastern FOD zones."}
          </span>
        </div>
      )}

      {/* Zonal Grid & Deep Dive Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 6 Regional Zones (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>{isHi ? "क्षेत्रीय फील्ड ऑपरेशंस डिवीजन (FOD) हीटमैप" : "Field Operations Division (FOD) Regional Heatmap"}</span>
          </h3>

          <div className="space-y-2.5">
            {ZONAL_FOD_DATA.map((z) => {
              const isSelected = selectedZone.id === z.id;
              const isOptimal = z.readinessScore >= 90;
              const isVulnerable = z.readinessScore < 80;

              return (
                <div
                  key={z.id}
                  onClick={() => setSelectedZone(z)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-gov-blue shadow-md ring-2 ring-gov-blue/20"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isOptimal
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                          : isVulnerable
                          ? "bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {z.readinessScore}%
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {isHi ? z.nameHi : z.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {z.cadreCount.toLocaleString()} Officers • Gap: <strong className="text-slate-700 dark:text-slate-300">{z.primaryGap}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isOptimal
                          ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
                          : isVulnerable
                          ? "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 animate-pulse"
                          : "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200"
                      }`}
                    >
                      {z.status.replace("_", " ")}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Zone Deep Dive (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-gov-blue dark:text-sky-400 block">
                  Zonal Cadre Intelligence Dossier
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isHi ? selectedZone.nameHi : selectedZone.name}
                </h3>
              </div>
              <span className="text-xl font-black text-gov-blue dark:text-sky-400">
                {selectedZone.readinessScore}%
              </span>
            </div>

            {/* Upcoming Survey Preparedness */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Upcoming National Surveys Preparedness
              </h4>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">Periodic Labour Force Survey (PLFS)</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedZone.plfsReady}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${selectedZone.plfsReady}%` }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">8th Economic Census / Digital Fieldwork</span>
                  <span className={`font-bold ${selectedZone.censusReady < 70 ? "text-red-600" : "text-slate-900"}`}>{selectedZone.censusReady}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${selectedZone.censusReady < 70 ? "bg-red-500" : "bg-gov-blue"}`} style={{ width: `${selectedZone.censusReady}%` }} />
                </div>
              </div>
            </div>

            {/* Targeted Action Plan */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <span className="font-bold text-slate-900 dark:text-white block">
                Recommended Ministry Action Plan:
              </span>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {selectedZone.criticalRisk
                  ? `Immediate deployment of iGOT Karmayogi module '${selectedZone.primaryGap}' required. Field non-sampling error risk elevated for this division.`
                  : "Zone is on track for upcoming survey schedules. Continue standard quarterly competency refresher cycles."}
              </p>
            </div>

            <button
              onClick={handleDeployTargetedCohort}
              className="w-full py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Dispatch Remedial Plan for this Zone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
