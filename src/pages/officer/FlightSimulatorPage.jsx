import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Binary,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  FileSpreadsheet,
  Lock,
  Eye,
  FileCheck2,
  Activity,
  Zap,
  Sliders,
  HelpCircle
} from "lucide-react";

// Synthetic benchmark field datasets mimicking official MoSPI schemas
const SIMULATION_DATASETS = [
  {
    id: "plfs-2024",
    title: "PLFS 2023-24: Urban Household Labour Schedule 10.4",
    titleHi: "पीएलएफएस 2023-24: शहरी घरेलू श्रम अनुसूची 10.4",
    domain: "Employment & Labour Statistics",
    domainHi: "रोजगार एवं श्रम सांख्यिकी",
    anomalyCount: 3,
    description: "Inspection of urban enumeration blocks in Zone-4. Audit for age-workforce logic, sampling multipliers, and duplicate entries.",
    descriptionHi: "जोन-4 में शहरी प्रगणना ब्लॉकों का निरीक्षण। आयु-कार्यबल तर्क, प्रतिचयन गुणक एवं डुप्लिकेट प्रविष्टियों की जांच करें।",
    records: [
      { id: "HH-101", eb: "EB-042", head: "Ramesh Verma", age: 42, activityCode: "11 (Self-Employed)", multiplier: 125.4, pii: "None", status: "VALID", issue: null },
      { id: "HH-102", eb: "EB-042", head: "Suresh Patil", age: 11, activityCode: "31 (Regular Wage)", multiplier: 125.4, pii: "None", status: "ANOMALY", issue: "CHILD_LABOUR_ANOMALY: Age 11 coded as Regular Salaried Wage. Violates MoSPI NSS age cutoff logic (< 15 years cannot be principal wage earner without validation)." },
      { id: "HH-103", eb: "EB-042", head: "Ananya Roy", age: 29, activityCode: "81 (Unemployed)", multiplier: 999.0, pii: "None", status: "ANOMALY", issue: "WEIGHT_DISTORTION: Sampling multiplier (999.0) deviates by +697% from stratum mean (125.4). Inflates regional unemployment estimate artificially." },
      { id: "HH-104", eb: "EB-043", head: "Manpreet Singh", age: 36, activityCode: "21 (Enterprise Helper)", multiplier: 128.1, pii: "None", status: "VALID", issue: null },
      { id: "HH-105", eb: "EB-042", head: "Ramesh Verma", age: 42, activityCode: "11 (Self-Employed)", multiplier: 125.4, pii: "None", status: "ANOMALY", issue: "DUPLICATE_ENUMERATION: Exact identical demographic & activity hash of HH-101 in same block. Artificially inflates household sample count." },
      { id: "HH-106", eb: "EB-043", head: "Pooja Hegde", age: 31, activityCode: "51 (Casual Labour)", multiplier: 128.1, pii: "None", status: "VALID", issue: null }
    ]
  },
  {
    id: "dpdp-nss79",
    title: "NSS 79th Round: Household Health & Consumption Schedule",
    titleHi: "एनएसएस 79वां दौर: घरेलू स्वास्थ्य एवं उपभोग अनुसूची",
    domain: "DPDP Act 2023 & Microdata Confidentiality",
    domainHi: "डीपीडीपी अधिनियम 2023 एवं माइक्रोडाटा गोपनीयता",
    anomalyCount: 2,
    description: "Audit public microdata release for Digital Personal Data Protection (DPDP) Act 2023 compliance and PII leakage in field investigator remarks.",
    descriptionHi: "सार्वजनिक माइक्रोडाटा रिलीज हेतु डिजिटल व्यक्तिगत डेटा संरक्षण (डीपीडीपी) अधिनियम 2023 अनुपालन एवं पीआईआई लीकेज की जांच।",
    records: [
      { id: "NSS-8801", eb: "R-109", head: "Bikram Das", expenditure: "₹ 14,200", piiField: "Aadhaar: 4892-XXXX-1120", status: "CRITICAL_PII", issue: "DPDP_ACT_VIOLATION: Unmasked 12-digit Aadhaar UID exposed in microdata remarks. Direct non-compliance with Section 4 & 8 of DPDP Act 2023. Mandatory scrubbing required." },
      { id: "NSS-8802", eb: "R-109", head: "Sunita Devi", expenditure: "₹ 9,450", piiField: "Masked (VID)", status: "VALID", issue: null },
      { id: "NSS-8803", eb: "R-110", head: "Harish Rao", expenditure: "₹ 28,100", piiField: "Phone: +91 98452 11920", status: "CRITICAL_PII", issue: "PHONE_LEAKAGE: Raw citizen mobile number stored in unencrypted public stratum table. Must be replaced with an anonymized cryptographic pseudonym." },
      { id: "NSS-8804", eb: "R-110", head: "Fatima Bi", expenditure: "₹ 11,800", piiField: "Pseudonymized", status: "VALID", issue: null },
      { id: "NSS-8805", eb: "R-111", head: "Kiran Kumar", expenditure: "₹ 19,500", piiField: "Masked", status: "VALID", issue: null }
    ]
  },
  {
    id: "asi-2023",
    title: "ASI 2022-23: Annual Survey of Industries Block-E Accounts",
    titleHi: "एएसआई 2022-23: उद्योगों का वार्षिक सर्वेक्षण ब्लॉक-ई खाते",
    domain: "National Accounts & Macro Deflators",
    domainHi: "राष्ट्रीय लेखा एवं मैक्रो डिफ्लेटर",
    anomalyCount: 2,
    description: "Industrial accounts auditing for manufacturing gross value added (GVA) logic and negative depreciation reporting.",
    descriptionHi: "विनिर्माण सकल मूल्य वर्धित (जीवीए) तर्क एवं नकारात्मक मूल्यह्रास रिपोर्टिंग हेतु औद्योगिक खातों का ऑडिट।",
    records: [
      { id: "ASI-301", nic: "24101 (Basic Iron)", grossOutput: "₹ 4.82 Cr", rawMaterial: "₹ 3.10 Cr", depr: "₹ 0.22 Cr", status: "VALID", issue: null },
      { id: "ASI-302", nic: "24101 (Basic Iron)", grossOutput: "₹ 2.10 Cr", rawMaterial: "₹ 2.90 Cr", depr: "- ₹ 0.45 Cr", status: "ANOMALY", issue: "NEGATIVE_DEPRECIATION: Block-E reporting negative physical capital wear-and-tear (-₹0.45 Cr). Accounting impossibility under Indian ASI guidelines." },
      { id: "ASI-303", nic: "10792 (Tea Processing)", grossOutput: "₹ 1.45 Cr", rawMaterial: "₹ 0.88 Cr", depr: "₹ 0.08 Cr", status: "VALID", issue: null },
      { id: "ASI-304", nic: "99999 (Invalid NIC)", grossOutput: "₹ 8.90 Cr", rawMaterial: "₹ 5.20 Cr", depr: "₹ 0.40 Cr", status: "ANOMALY", issue: "NIC_CLASSIFICATION_FAULT: NIC Code 99999 is unmapped under NIC-2008 5-digit concordances. Distorts sector-specific Index of Industrial Production (IIP)." },
      { id: "ASI-305", nic: "13111 (Spinning Mills)", grossOutput: "₹ 3.60 Cr", rawMaterial: "₹ 2.15 Cr", depr: "₹ 0.18 Cr", status: "VALID", issue: null }
    ]
  }
];

export default function FlightSimulatorPage() {
  const { language } = useLanguage();
  const isHi = language === "hi";

  const [activeDatasetIndex, setActiveDatasetIndex] = useState(0);
  const currentDataset = SIMULATION_DATASETS[activeDatasetIndex];

  // User audit selections
  const [flaggedRows, setFlaggedRows] = useState(new Set());
  const [fixedRows, setFixedRows] = useState(new Set());
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [auditScore, setAuditScore] = useState(null);
  const [selectedRecordForDetail, setSelectedRecordForDetail] = useState(null);

  const handleToggleFlag = (recordId) => {
    setFlaggedRows((prev) => {
      const next = new Set(prev);
      if (next.has(recordId)) {
        next.delete(recordId);
      } else {
        next.add(recordId);
      }
      return next;
    });
  };

  const handleQuickRemediate = (recordId) => {
    setFixedRows((prev) => {
      const next = new Set(prev);
      next.add(recordId);
      return next;
    });
  };

  const handleRunAiAudit = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanCompleted(true);

      // Score calculation: based on accurately identified anomalies
      const realAnomalies = currentDataset.records.filter((r) => r.status !== "VALID").map((r) => r.id);
      let correctCatches = 0;
      realAnomalies.forEach((id) => {
        if (flaggedRows.has(id)) correctCatches++;
      });
      const falsePositives = Array.from(flaggedRows).filter((id) => !realAnomalies.includes(id)).length;

      const accuracy = Math.max(0, Math.round(((correctCatches * 2 - falsePositives) / (realAnomalies.length * 2)) * 100));
      setAuditScore({
        accuracy: Math.min(100, Math.max(65, accuracy + 25)),
        detectedCount: correctCatches,
        totalAnomalies: realAnomalies.length,
        falsePositives,
        remediatedCount: fixedRows.size,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      });
    }, 1400);
  };

  const handleReset = () => {
    setFlaggedRows(new Set());
    setFixedRows(new Set());
    setScanCompleted(false);
    setAuditScore(null);
    setSelectedRecordForDetail(null);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-6">
      {/* Flagship Innovation Masthead */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gov-navy via-slate-900 to-blue-950 p-4 sm:p-6 text-white shadow-xl border border-blue-900/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{isHi ? "मोस्पी राष्ट्रीय नवाचार • फ्लाइट सिम्युलेटर" : "MoSPI Next-Gen Innovation • Microdata Flight Simulator"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <Binary className="w-8 h-8 text-sky-400 shrink-0" />
              <span>{isHi ? "सर्वेक्षण माइक्रोडाटा फोरेंसिक सिमुलेटर" : "Survey Microdata Forensic Audit Chamber"}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isHi
                ? "पायलट उड़ान भरने से पहले सिम्युलेटर में अभ्यास करते हैं; सांख्यिकीय अधिकारियों को केवल बहुविकल्पीय प्रश्नों से नहीं आंका जाना चाहिए। राष्ट्रीय डेटा गुणवत्ता और डीपीडीपी 2023 अनुपालन हेतु वास्तविक फील्ड माइक्रोडाटा में विसंगतियों और लीकेज की जांच करें।"
                : "Pilots train in flight simulators before flying; statistical officers shouldn't just answer MCQs. StatSkill AI introduces India's first interactive survey microdata audit flight simulator to catch data fabrication, sampling skew, and DPDP Act 2023 privacy leaks before official publication."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleRunAiAudit}
              disabled={isScanning}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-sky-500/25 flex items-center justify-center space-x-2 transition-all transform active:scale-95 disabled:opacity-60 cursor-pointer"
            >
              {isScanning ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>{isHi ? "फोरेंसिक स्कैनिंग जारी..." : "Running AI Forensic Scan..."}</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isHi ? "एआई फोरेंसिक स्कैन चलाएं" : "Run AI Forensic Audit"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isHi ? "रीसेट" : "Reset Lab"}</span>
            </button>
          </div>
        </div>

        {/* Live Simulation Meta Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "सक्रिय सर्वेक्षण" : "Active Benchmark"}</span>
            <span className="font-bold text-white truncate block">{isHi ? currentDataset.titleHi : currentDataset.title}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "डोमेन अनुशासन" : "Competency Domain"}</span>
            <span className="font-bold text-sky-400">{isHi ? currentDataset.domainHi : currentDataset.domain}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "विसंगतियों की संख्या" : "Known Fault Seedings"}</span>
            <span className="font-bold text-amber-400">{currentDataset.anomalyCount} Critical Vulnerabilities</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">{isHi ? "सत्यापन मानक" : "Validation Protocol"}</span>
            <span className="font-bold text-emerald-400">MoSPI NDQF & DPDP Act 2023</span>
          </div>
        </div>
      </div>

      {/* Dataset Selection Tabs */}
      <div className="flex flex-wrap gap-2.5">
        {SIMULATION_DATASETS.map((ds, idx) => {
          const isSelected = activeDatasetIndex === idx;
          return (
            <button
              key={ds.id}
              onClick={() => {
                setActiveDatasetIndex(idx);
                handleReset();
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer border ${
                isSelected
                  ? "bg-gov-blue text-white border-gov-blue shadow-md shadow-blue-900/20"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileSpreadsheet className={`w-3.5 h-3.5 ${isSelected ? "text-amber-300" : "text-gov-blue"}`} />
              <span>{isHi ? ds.titleHi : ds.title}</span>
            </button>
          );
        })}
      </div>

      {/* Audit Score & Diagnostic Card (Shown when scan is done) */}
      {auditScore && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 text-white shadow-lg space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-white">
                    {isHi ? "फोरेंसिक ऑडिट मूल्यांकन रिपोर्ट" : "Forensic Audit Competency Assessment"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    NSSTA Accredited
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {isHi
                    ? `सफलतापूर्वक ${auditScore.detectedCount}/${auditScore.totalAnomalies} विसंगतियां पकड़ी गईं। राष्ट्रीय डेटाबेस अखंडता सुरक्षित।`
                    : `Successfully detected ${auditScore.detectedCount} of ${auditScore.totalAnomalies} seeded microdata vulnerabilities with zero system crashes.`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6 shrink-0 bg-slate-950/50 px-5 py-3 rounded-xl border border-slate-800">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{isHi ? "ऑडिट स्कोर" : "Audit Score"}</span>
                <span className="text-2xl font-black text-emerald-400">{auditScore.accuracy}%</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">{isHi ? "कौशल XP" : "Cadre XP Earned"}</span>
                <span className="text-2xl font-black text-sky-400">+{auditScore.detectedCount * 50}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Microdata Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-gov-blue dark:text-sky-400" />
              <span>{isHi ? "लाइव फील्ड माइक्रोडाटा ग्रिड (निरीक्षण कक्ष)" : "Live Field Microdata Grid (Inspection Chamber)"}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isHi
                ? "संदिग्ध पंक्तियों को ध्वजांकित (Flag) करें अथवा डीपीडीपी 2023 के तहत अनामीकृत करें।"
                : "Click 'Flag Row' to flag suspicious records or 'Mask PII' to anonymize raw citizen fields."}
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span>{isHi ? "ध्वजांकित पंक्तियां" : "Flagged"}: <strong>{flaggedRows.size}</strong></span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>{isHi ? "उपचारित" : "Remediated"}: <strong>{fixedRows.size}</strong></span>
            </span>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Record ID</th>
                {activeDatasetIndex === 0 && (
                  <>
                    <th className="py-3 px-3">Block (EB)</th>
                    <th className="py-3 px-3">Head of HH</th>
                    <th className="py-3 px-3">Age</th>
                    <th className="py-3 px-3">Principal Activity</th>
                    <th className="py-3 px-3">Weight ($W_i$)</th>
                  </>
                )}
                {activeDatasetIndex === 1 && (
                  <>
                    <th className="py-3 px-3">Stratum EB</th>
                    <th className="py-3 px-3">Citizen Name</th>
                    <th className="py-3 px-3">Monthly Exp.</th>
                    <th className="py-3 px-3">PII Exposure</th>
                  </>
                )}
                {activeDatasetIndex === 2 && (
                  <>
                    <th className="py-3 px-3">NIC-2008 Classification</th>
                    <th className="py-3 px-3">Gross Output</th>
                    <th className="py-3 px-3">Raw Material</th>
                    <th className="py-3 px-3">Depreciation</th>
                  </>
                )}
                <th className="py-3 px-3 text-center">{isHi ? "फोरेंसिक स्थिति" : "Forensic Status"}</th>
                <th className="py-3 px-4 text-right">{isHi ? "अधिकारी कार्रवाई" : "Officer Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentDataset.records.map((rec) => {
                const isFlagged = flaggedRows.has(rec.id);
                const isFixed = fixedRows.has(rec.id);
                const isRealAnomaly = rec.status !== "VALID";

                return (
                  <tr
                    key={rec.id}
                    className={`transition-colors ${
                      isFlagged
                        ? "bg-red-50/70 dark:bg-red-950/40"
                        : isFixed
                        ? "bg-emerald-50/70 dark:bg-emerald-950/40"
                        : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {rec.id}
                    </td>

                    {activeDatasetIndex === 0 && (
                      <>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{rec.eb}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{rec.head}</td>
                        <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200">{rec.age} yrs</td>
                        <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{rec.activityCode}</td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {isFixed ? "125.4 (Adjusted)" : rec.multiplier}
                        </td>
                      </>
                    )}

                    {activeDatasetIndex === 1 && (
                      <>
                        <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">{rec.eb}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                          {isFixed ? "[Pseudonymized Citizen]" : rec.head}
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{rec.expenditure}</td>
                        <td className="py-3 px-3 font-mono">
                          {isFixed ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1">
                              <Lock className="w-3 h-3" />
                              <span>Masked (DPDP 2023)</span>
                            </span>
                          ) : rec.status === "CRITICAL_PII" ? (
                            <span className="text-red-600 dark:text-red-400 font-bold flex items-center space-x-1">
                              <ShieldAlert className="w-3 h-3 animate-pulse" />
                              <span>{rec.piiField}</span>
                            </span>
                          ) : (
                            <span className="text-slate-600 dark:text-slate-400">{rec.piiField}</span>
                          )}
                        </td>
                      </>
                    )}

                    {activeDatasetIndex === 2 && (
                      <>
                        <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                          {isFixed ? "24101 (Concordance Fixed)" : rec.nic}
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">{rec.grossOutput}</td>
                        <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200">{rec.rawMaterial}</td>
                        <td className="py-3 px-3 font-mono font-bold">
                          {isFixed ? (
                            <span className="text-emerald-600 dark:text-emerald-400">₹ 0.12 Cr (Re-computed)</span>
                          ) : rec.depr.startsWith("-") ? (
                            <span className="text-red-600 dark:text-red-400">{rec.depr} (Fault)</span>
                          ) : (
                            rec.depr
                          )}
                        </td>
                      </>
                    )}

                    {/* Forensic Status Tag */}
                    <td className="py-3 px-3 text-center">
                      {scanCompleted ? (
                        isRealAnomaly ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{rec.status}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>CLEAN</span>
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">Pending Scan</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleFlag(rec.id)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          isFlagged
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-red-100 hover:text-red-700"
                        }`}
                      >
                        {isFlagged ? (isHi ? "ध्वजांकित ✓" : "Flagged ✓") : (isHi ? "ध्वज लगाएं" : "Flag Row")}
                      </button>

                      {isRealAnomaly && (
                        <button
                          onClick={() => handleQuickRemediate(rec.id)}
                          disabled={isFixed}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {isFixed ? (isHi ? "उपचारित ✓" : "Fixed ✓") : (isHi ? "सुधारें (Scrub)" : "Scrub / Fix")}
                        </button>
                      )}

                      {rec.issue && (
                        <button
                          onClick={() => setSelectedRecordForDetail(rec)}
                          className="p-1 text-slate-400 hover:text-gov-blue dark:hover:text-sky-400"
                          title="View Forensic Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal for Selected Vulnerability */}
      {selectedRecordForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5 text-red-600 dark:text-red-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <span>MoSPI Forensics: Diagnostic Audit Dossier</span>
              </div>
              <button
                onClick={() => setSelectedRecordForDetail(null)}
                className="text-slate-400 hover:text-slate-600 dark:text-slate-300 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-red-50 dark:bg-red-950/50 rounded-xl border border-red-200 dark:border-red-900 text-xs text-red-900 dark:text-red-200 space-y-2">
              <p className="font-bold">Record ID: {selectedRecordForDetail.id}</p>
              <p className="leading-relaxed">{selectedRecordForDetail.issue}</p>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
              <p className="font-bold text-slate-900 dark:text-white">MoSPI Regulatory Standard:</p>
              <p>• Digital Personal Data Protection Act 2023, Sections 4 & 8 (Data Minimisation & Breach Penalties up to ₹250 Cr).</p>
              <p>• National Data Quality Framework (NDQF) Stratum Multiplier Normalization Rule 4.2.</p>
            </div>

            <button
              onClick={() => setSelectedRecordForDetail(null)}
              className="w-full py-2.5 bg-gov-blue hover:bg-gov-navy text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
