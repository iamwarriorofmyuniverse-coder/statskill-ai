import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Printer,
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  Download
} from "lucide-react";

export default function DiagnosticReportModal({
  attempt,
  officerProfile,
  onClose
}) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  if (!attempt) return null;

  const handlePrint = () => {
    window.print();
  };

  const isPassed = (attempt.overallScore || 0) >= 75;
  const reportRefNo = attempt.id
    ? `MOSPI/NSSTA/${attempt.id.toUpperCase()}`
    : `MOSPI/NSSTA/DIAG-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  const reportDate = attempt.completedAt
    ? new Date(attempt.completedAt).toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : new Date().toLocaleDateString(isHi ? "hi-IN" : "en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      });

  const domainScores = attempt.domainScores || {};
  const gaps = attempt.gaps || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto print:p-0 print:static print:bg-white">
      {/* Modal Container */}
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-auto print:shadow-none print:border-none print:max-w-none print:rounded-none print:w-full print-container">
        
        {/* Modal Top Bar - Screen Only */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-sky-400" />
            <span className="font-bold text-sm tracking-wide">
              {isHi ? "आधिकारिक सांख्यिकी अधिकारी मूल्यांकन एवं अपार बेंचमार्क रिपोर्ट" : "Official Officer Diagnostic & APAR Benchmark Report"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? "प्रिंट / पीडीएफ सहेजें" : "Print / Save as PDF"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Body */}
        <div className="p-6 sm:p-10 space-y-6 text-slate-900 bg-white">
          
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1.5 relative">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center bg-slate-50 font-serif font-black text-slate-900 text-xs shadow-xs">
                MoSPI
              </div>
            </div>
            <div className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
              {isHi ? "भारत सरकार • सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)" : "Government of India • Ministry of Statistics and Programme Implementation (MoSPI)"}
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase font-serif">
              {isHi ? "राष्ट्रीय सांख्यिकी प्रणाली प्रशिक्षण अकादमी (NSSTA)" : "National Statistical Systems Training Academy (NSSTA)"}
            </h1>
            <div className="inline-block px-3 py-0.5 bg-slate-100 rounded text-xs font-bold text-slate-800 uppercase tracking-wider border border-slate-300">
              {isHi ? "सांख्यिकी संवर्ग दक्षता मूल्यांकन एवं क्षमता आंकलन अभिलेख" : "Statistical Cadre Competency Diagnostic & Capacity Assessment Record"}
            </div>

            {/* Document Reference Metadata */}
            <div className="flex flex-wrap justify-between text-[11px] text-slate-600 pt-3 font-mono border-t border-slate-200 mt-3">
              <div><strong>{isHi ? "संदर्भ सं:" : "Ref No:"}</strong> {reportRefNo}</div>
              <div><strong>{isHi ? "दिनांक:" : "Generated:"}</strong> {reportDate}</div>
              <div><strong>{isHi ? "ढांचा:" : "Framework:"}</strong> NSSTA / Karmayogi Bharat 2026</div>
            </div>
          </div>

          {/* Section A: Officer Dossier Table */}
          <div className="space-y-2 page-break-inside-avoid">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-300 pb-1">
              <User className="w-3.5 h-3.5 text-gov-blue" />
              <span>{isHi ? "खंड क: अधिकारी प्रोफाइल एवं संवर्ग पहचान" : "Section A: Officer Profile & Cadre Identification"}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "अधिकारी का नाम" : "Officer Name"}</span>
                <strong className="text-slate-900">{officerProfile?.fullName ? t(officerProfile.fullName, officerProfile.fullName) : (isHi ? "अनन्या शर्मा" : "Ananya Sharma")}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "कर्मचारी आईडी" : "Employee ID"}</span>
                <span className="font-mono font-semibold text-slate-900">{officerProfile?.employeeId || "MOSPI-SO-2022-841"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "संवर्ग सेवा" : "Cadre Service"}</span>
                <span className="font-medium text-slate-900">{isHi ? "अधीनस्थ सांख्यिकी सेवा (SSS)" : "Subordinate Statistical Service (SSS)"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "वर्तमान पदनाम" : "Current Designation"}</span>
                <span className="font-medium text-slate-900">{officerProfile?.designation ? t(officerProfile.designation, officerProfile.designation) : t("statisticalOfficer")}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "प्रभाग / विभाग" : "Division / Dept"}</span>
                <span className="font-medium text-slate-900">{officerProfile?.department || (isHi ? "क्षेत्र संचालन प्रभाग (FOD)" : "Field Operations Division (FOD)")}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "अनुभव" : "Experience"}</span>
                <span className="font-medium text-slate-900">{officerProfile?.yearsOfExperience || 4} {isHi ? "वर्ष का संवर्ग अनुभव" : "Years in Cadre"}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "करियर आकांक्षा" : "Career Aspiration"}</span>
                <span className="font-medium text-slate-900">{officerProfile?.careerGoal ? t(officerProfile.careerGoal, officerProfile.careerGoal) : t("seniorAnalyst")}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">{isHi ? "तैनाती स्थल" : "Posting Station"}</span>
                <span className="font-medium text-slate-900">{officerProfile?.officeLocation || (isHi ? "सरदार पटेल भवन, नई दिल्ली" : "Sardar Patel Bhawan, New Delhi")}</span>
              </div>
            </div>
          </div>

          {/* Section B: Executive Assessment Summary */}
          <div className="space-y-2 page-break-inside-avoid">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-300 pb-1">
              <Award className="w-3.5 h-3.5 text-gov-blue" />
              <span>{isHi ? "खंड ख: कार्यकारी दक्षता सूचकांक एवं अपार बेंचमार्क" : "Section B: Executive Competency Index & APAR Benchmark"}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex items-center space-x-4 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex flex-col items-center justify-center shrink-0">
                  <span className="text-lg font-black leading-none">{attempt.overallScore}%</span>
                  <span className="text-[8px] font-bold text-slate-300 uppercase">{isHi ? "सूचकांक" : "Index"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{isHi ? "समग्र स्कोर" : "Overall Score"}</span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {attempt.totalCorrect || 0} / {attempt.totalQuestions || 22} {isHi ? "सही" : "Correct"}
                  </h3>
                  <span className="text-[10px] text-slate-600">{isHi ? "सटीकता:" : "Accuracy:"} {attempt.overallScore}%</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{isHi ? "संवर्ग मानक" : "Cadre Benchmark"}</span>
                  <h3 className="text-sm font-bold text-slate-900">{isHi ? "75% न्यूनतम" : "75% Minimum"}</h3>
                  <span className="text-[10px] text-slate-600">{isHi ? "मानक MoSPI अधीनस्थ सांख्यिकी संवर्ग सीमा" : "Standard MoSPI Subordinate Statistical Cadre Threshold"}</span>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-[10px] uppercase font-bold text-slate-500">{isHi ? "मूल्यांकन स्थिति" : "Diagnostic Status"}</span>
                <div className="mt-1">
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md border ${
                    isPassed
                      ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                      : "bg-amber-100 text-amber-900 border-amber-300"
                  }`}>
                    {isPassed
                      ? (isHi ? "✓ मानक योग्य (उत्तीर्ण)" : "✓ BENCHMARK QUALIFIED")
                      : (isHi ? "⚠ लक्षित कौशल विकास अनिवार्य" : "⚠ TARGETED UPSKILLING MANDATED")
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Domain Performance Breakdown */}
          <div className="space-y-2 page-break-inside-avoid">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-300 pb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gov-blue" />
              <span>{isHi ? "खंड ग: डोमेन प्रदर्शन विश्लेषण" : "Section C: Domain Performance Analysis"}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(domainScores).map(([domain, score]) => (
                <div key={domain} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">{t(domain, domain)}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-extrabold text-slate-900">{score}%</span>
                    <span className={`text-[10px] font-bold ${score >= 75 ? "text-emerald-700" : "text-amber-700"}`}>
                      {score >= 75 ? (isHi ? "संतोषजनक" : "Adequate") : (isHi ? "ध्यान दें" : "Needs Focus")}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${score >= 75 ? "bg-emerald-600" : "bg-amber-500"}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section D: Complete 11-Competency Matrix Table */}
          <div className="space-y-2 page-break-inside-avoid">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-300 pb-1">
              <GraduationCap className="w-3.5 h-3.5 text-gov-blue" />
              <span>{isHi ? "खंड घ: व्यापक 11-दक्षता अपार मैट्रिक्स" : "Section D: Comprehensive 11-Competency APAR Matrix"}</span>
            </h2>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[10px] font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="py-2 px-3">#</th>
                    <th className="py-2 px-3">{isHi ? "दक्षता क्षेत्र" : "Competency Area"}</th>
                    <th className="py-2 px-3">{isHi ? "डोमेन" : "Domain"}</th>
                    <th className="py-2 px-2.5 text-center">{isHi ? "स्कोर" : "Score"}</th>
                    <th className="py-2 px-2.5 text-center">{isHi ? "मानक" : "Benchmark"}</th>
                    <th className="py-2 px-2.5 text-center">{isHi ? "अंतर" : "Variance"}</th>
                    <th className="py-2 px-3 text-center">{isHi ? "अपार प्राथमिकता" : "APAR Priority"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {gaps.map((gap, idx) => (
                    <tr key={gap.competencyId || idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="py-2 px-3 font-mono text-slate-500 text-[10px]">{idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{t(gap.competencyName, gap.competencyName)}</td>
                      <td className="py-2 px-3 text-slate-600 text-[10px]">{t(gap.domain, gap.domain)}</td>
                      <td className="py-2 px-2.5 text-center font-bold text-slate-900">{gap.currentLevel}%</td>
                      <td className="py-2 px-2.5 text-center text-slate-500">{gap.targetLevel}%</td>
                      <td className="py-2 px-2.5 text-center font-bold">
                        <span className={gap.rawGap <= 0 ? "text-emerald-700" : "text-orange-700"}>
                          {gap.rawGap <= 0 ? `+${Math.abs(gap.rawGap)}%` : `-${gap.rawGap}%`}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                          gap.priority === "MEETS_REQUIREMENT"
                            ? "bg-emerald-100 text-emerald-800"
                            : gap.priority === "LOW"
                            ? "bg-blue-100 text-blue-800"
                            : gap.priority === "MEDIUM"
                            ? "bg-amber-100 text-amber-800"
                            : gap.priority === "HIGH"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {t(gap.priority, gap.priorityLabel || gap.priority)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section E: Priority Action & Recommended Learning Pathways */}
          <div className="space-y-2 page-break-inside-avoid">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5 border-b border-slate-300 pb-1">
              <Sparkles className="w-3.5 h-3.5 text-gov-blue" />
              <span>{isHi ? "खंड ङ: iGOT कर्मयोगी एवं एनएसएसटीए अनुशंसित पाठ्यक्रम" : "Section E: iGOT Karmayogi & NSSTA Recommended Curricula"}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{isHi ? "सांख्यिकी विश्लेषण एवं एनएसएस डेटा हेतु पायथन" : "Python for Statistical Analysis & NSS Data"}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 uppercase">{isHi ? "अति महत्वपूर्ण" : "Critical"}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {isHi
                    ? "संगणकीय स्क्रिप्टिंग में 33% अंतर को हल करता है। लक्षित: Pandas, Microdata ETL, Tabulation।"
                    : "Remediates identified 33% gap in computational scripting. Target: Pandas, Microdata ETL, Tabulation."
                  }
                </p>
                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-200">
                  <span>{isHi ? "प्रदाता: iGOT कर्मयोगी / MoSPI" : "Provider: iGOT Karmayogi / MoSPI"}</span>
                  <span>{isHi ? "अवधि: 20 घंटे" : "Duration: 20 Hours"}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{isHi ? "डीपीडीपी अधिनियम 2023 एवं माइक्रोडाटा अनामीकरण" : "DPDP Act 2023 & Microdata Anonymization"}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 uppercase">{isHi ? "उच्च प्राथमिकता" : "High Priority"}</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {isHi
                    ? "सार्वजनिक प्रकाशन हेतु डिजिटल गोपनीयता अनुपालन में 30% अंतर को हल करता है।"
                    : "Remediates identified 30% gap in digital privacy compliance for public dissemination."
                  }
                </p>
                <div className="text-[10px] text-slate-500 flex justify-between pt-1 border-t border-slate-200">
                  <span>{isHi ? "प्रदाता: NSSTA ग्रेटर नोएडा" : "Provider: NSSTA Greater Noida"}</span>
                  <span>{isHi ? "अवधि: 15 घंटे" : "Duration: 15 Hours"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section F: Sign-off & Verification Footer */}
          <div className="border-t-2 border-slate-900 pt-4 text-[10px] text-slate-600 space-y-4 page-break-inside-avoid">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-2">
              <div className="space-y-1 max-w-sm">
                <p className="font-bold text-slate-800">{isHi ? "स्टेटस्किल एआई स्वायत्त सत्यापन प्रोटोकॉल" : "StatSkill AI Autonomous Verification Protocol"}</p>
                <p>
                  {isHi
                    ? "यह आधिकारिक मूल्यांकन अभिलेख MoSPI एवं NSSTA दक्षता ढांचे के मानकों के अनुसार तैयार किया गया है और iGOT कर्मयोगी से जुड़ा है।"
                    : "This official diagnostic record is generated according to MoSPI & NSSTA Competency Framework standards and integrates with iGOT Karmayogi capacity building pipelines."
                  }
                </p>
                <p className="font-mono text-[9px] text-slate-500">
                  Digital Hash: {attempt.id || "STATSKILL-AUDIT-VALIDATED"} • ISO/IEC 27001 Certified Architecture
                </p>
              </div>

              <div className="flex space-x-8 text-center pt-4 sm:pt-0">
                <div className="border-t border-slate-400 pt-1 w-32">
                  <span className="block font-bold text-slate-800">{isHi ? "अधिकारी हस्ताक्षर" : "Officer Signature"}</span>
                  <span className="text-[9px] text-slate-500">{officerProfile?.fullName || (isHi ? "अनन्या शर्मा" : "Ananya Sharma")}</span>
                </div>
                <div className="border-t border-slate-400 pt-1 w-36">
                  <span className="block font-bold text-slate-800">{isHi ? "एनएसएसटीए मूल्यांकन प्रकोष्ठ" : "NSSTA Evaluation Cell"}</span>
                  <span className="text-[9px] text-slate-500">{isHi ? "आधिकारिक MoSPI मुहर" : "Official MoSPI Stamp"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Bar - Screen Only */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200 print:hidden">
          <span className="text-xs text-slate-500">
            {isHi ? "वार्षिक कार्य निष्पादन मूल्यांकन रिपोर्ट (APAR) के साथ प्रस्तुत करने हेतु तैयार।" : "Ready for submission with Annual Performance Appraisal Report (APAR)."}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              {isHi ? "बंद करें" : "Close"}
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-gov-blue hover:bg-gov-navy text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? "आधिकारिक पीडीएफ प्रिंट करें" : "Print Official PDF"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

