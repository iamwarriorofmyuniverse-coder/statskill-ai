import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { getLatestAssessmentAttempt } from "../../services/firestoreService.js";
import DiagnosticReportModal from "../../components/officer/DiagnosticReportModal.jsx";
import { User, Award, BookOpen, Briefcase, Target, Shield, Check, Save, FileText, Printer } from "lucide-react";

export default function OfficerProfile() {
  const { currentUser, officerProfile, updateProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [fullName, setFullName] = useState(officerProfile?.fullName || "Ananya Sharma");
  const [designation, setDesignation] = useState(officerProfile?.designation || "Statistical Officer");
  const [cadre, setCadre] = useState(officerProfile?.cadre || "Subordinate Statistical Service");
  const [department, setDepartment] = useState(officerProfile?.department || "National Statistical Systems Training Academy (NSSTA)");
  const [careerGoal, setCareerGoal] = useState(officerProfile?.careerGoal || "Senior Statistical Analyst");
  const [saved, setSaved] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState(null);

  useEffect(() => {
    if (officerProfile) {
      setFullName(officerProfile.fullName || "Ananya Sharma");
      setDesignation(officerProfile.designation || "Statistical Officer");
      setCadre(officerProfile.cadre || "Subordinate Statistical Service");
      setDepartment(officerProfile.department || "National Statistical Systems Training Academy (NSSTA)");
      setCareerGoal(officerProfile.careerGoal || "Senior Statistical Analyst");
    }
  }, [officerProfile]);

  useEffect(() => {
    async function loadAttempt() {
      const uid = currentUser?.uid || "officer_ananya_001";
      const att = await getLatestAssessmentAttempt(uid);
      if (att) {
        setLatestAttempt(att);
      }
    }
    loadAttempt();
  }, [currentUser]);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      fullName,
      designation,
      cadre,
      department,
      careerGoal
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const displayName = t(fullName, fullName);
  const displayDesig = t(designation, designation);
  const displayGoal = t(careerGoal, careerGoal);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <User className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "आधिकारिक सांख्यिकी संवर्ग प्रोफाइल" : "Official Statistical Cadre Profile"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "अधिकारी कार्मिक रिकॉर्ड एवं प्रोफाइल" : "Officer Personnel Record & Profile"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? "MoSPI अधीनस्थ सांख्यिकी सेवा संवर्ग हेतु योग्यता और सेवा विवरण प्रबंधित करें।"
              : "Manage competency alignment, role milestones, and service particulars for MoSPI Subordinate Statistical Service cadre."
            }
          </p>
        </div>

        {/* Action button to export / print diagnostic report */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-gov-navy to-gov-blue text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-2 hover:opacity-95 transition-opacity shrink-0"
        >
          <FileText className="w-4 h-4 text-gov-sky" />
          <span>{t("exportReport")}</span>
        </button>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isHi ? "व्यक्तिगत एवं सेवा विवरण" : "Personal & Service Details"}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "अधिकारी का पूरा नाम" : "Full Name of Officer"}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "आधिकारिक ईमेल" : "Official Email Address"}
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser?.email || "ananya.sharma@mospi.gov.in"}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "वर्तमान पदनाम" : "Current Designation"}
                </label>
                <select
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-gov-blue"
                >
                  <option value="Statistical Officer">{t("statisticalOfficer")}</option>
                  <option value="Senior Statistical Analyst">{t("seniorAnalyst")}</option>
                  <option value="Junior Statistical Officer">{t("Junior Statistical Officer", "Junior Statistical Officer")}</option>
                  <option value="Assistant Director">{t("Assistant Director", "Assistant Director")}</option>
                  <option value="Deputy Director">{t("Deputy Director", "Deputy Director")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "करियर मील का पत्थर लक्ष्य" : "Career Milestone Target"}
                </label>
                <select
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-gov-blue"
                >
                  <option value="Senior Statistical Analyst">{t("seniorAnalyst")}</option>
                  <option value="Assistant Director">{t("Assistant Director", "Assistant Director")}</option>
                  <option value="Deputy Director">{t("Deputy Director", "Deputy Director")}</option>
                  <option value="Director">{t("Director", "Director")}</option>
                  <option value="Director General">{t("Director General", "Director General")}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isHi ? "संवर्ग / सेवा" : "Cadre / Statistical Service"}
              </label>
              <input
                type="text"
                value={cadre}
                onChange={(e) => setCadre(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {isHi ? "मंत्रालय / विभाग / प्रभाग" : "Ministry / Department / Division"}
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:outline-hidden focus:border-gov-blue"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isHi ? "परिवर्तन तुरंत आपकी सिफारिशों और रडार बेंचमार्क को पुनः कैलिब्रेट करेंगे।" : "Changes will immediately recalibrate your recommendations and radar benchmarks."}
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-2 transition-colors"
              >
                {saved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4 text-white" />}
                <span>{saved ? (isHi ? "परिवर्तन सहेजे गए!" : "Changes Saved!") : t("saveChanges")}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Cadre Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-gradient-to-br from-gov-navy to-gov-blue rounded-xl p-6 text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded">
                {t("officialCadre")}
              </span>
              <Shield className="w-5 h-5 text-gov-sky" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold">{displayName}</h3>
              <p className="text-xs text-sky-200 mt-0.5">{displayDesig}</p>
            </div>

            <div className="pt-3 border-t border-white/15 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">{isHi ? "संवर्ग आईडी" : "Cadre ID"}:</span>
                <span className="font-mono font-bold">SSS-2024-ND-491</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">{isHi ? "सत्यापन स्थिति" : "Status"}:</span>
                <span className="text-emerald-300 font-bold">{isHi ? "सत्यापित अधिकारी" : "Active Officer"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">{isHi ? "लक्ष्य पद" : "Target Role"}:</span>
                <span className="text-amber-300 font-bold">{displayGoal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isReportOpen && (
        <DiagnosticReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          assessmentAttempt={latestAttempt}
        />
      )}
    </div>
  );
}
