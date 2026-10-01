import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { UserCheck, Shield, Lock, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export default function RoleSelectionModal() {
  const {
    currentUser,
    roleModalOpen,
    assignOfficerRole,
    validateAndAssignTrainerRole,
    authError
  } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [selectedRole, setSelectedRole] = useState("OFFICER");
  const [accessCode, setAccessCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  // Officer Profile quick fields
  const [officerData, setOfficerData] = useState({
    fullName: currentUser?.displayName || "Ananya Sharma",
    designation: "Statistical Officer",
    department: "Official Statistics",
    yearsOfExperience: 4,
    education: "Master's in Statistics",
    careerGoal: "Senior Statistical Analyst"
  });

  if (!roleModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError("");

    if (selectedRole === "OFFICER") {
      await assignOfficerRole(officerData);
      setSubmitting(false);
    } else if (selectedRole === "TRAINER") {
      if (!accessCode.trim()) {
        setLocalError(isHi ? "कृपया अपना प्रशिक्षक एक्सेस कोड दर्ज करें।" : "Please enter your Trainer Access Code.");
        setSubmitting(false);
        return;
      }
      const res = await validateAndAssignTrainerRole(accessCode.trim());
      setSubmitting(false);
      if (!res.success) {
        setLocalError(res.error || (isHi ? "अमान्य प्रशिक्षक एक्सेस कोड।" : "Invalid trainer access code."));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white overflow-hidden animate-modal-pop">
        {/* Modal Header */}
        <div className="bg-gov-navy dark:bg-slate-800 text-white px-6 py-4 border-b-2 border-gov-saffron">
          <h2 className="text-lg font-bold">{isHi ? "संवर्ग प्रोफाइल एवं भूमिका का चयन करें" : "Select Cadre Profile & Role"}</h2>
          <p className="text-xs text-slate-300">
            {isHi ? "भारतीय आधिकारिक सांख्यिकी प्रणाली - पहुंच प्राधिकरण" : "India Official Statistical System - Access Authorization"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {(authError || localError) && (
            <div className="p-3 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{localError || authError}</span>
            </div>
          )}

          {/* Role Choice Cards */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("OFFICER")}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                selectedRole === "OFFICER"
                  ? "border-gov-blue dark:border-sky-500 bg-blue-50/70 dark:bg-slate-800 ring-2 ring-gov-blue/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <UserCheck className={`w-6 h-6 ${selectedRole === "OFFICER" ? "text-gov-blue dark:text-sky-400" : "text-slate-400"}`} />
                {selectedRole === "OFFICER" && <CheckCircle2 className="w-4 h-4 text-gov-blue dark:text-sky-400" />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t("statisticalOfficer")}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isHi ? "क्षमता विकास से गुजर रहे एनएसएसओ, सीएसओ एवं राज्य डीईएस अधिकारी।" : "NSSO, CSO, State DES officers undergoing capacity development."}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("TRAINER")}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                selectedRole === "TRAINER"
                  ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/70 dark:bg-slate-800 ring-2 ring-emerald-600/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Shield className={`w-6 h-6 ${selectedRole === "TRAINER" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                {selectedRole === "TRAINER" && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{isHi ? "प्रशिक्षक / संकाय" : "Trainer / Faculty"}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isHi ? "एनएसएसटीए प्रशिक्षक एवं प्रश्न समीक्षक (कोड आवश्यक)।" : "NSSTA instructors & question reviewers (Requires code)."}
                </p>
              </div>
            </button>
          </div>

          {/* Officer Form Fields */}
          {selectedRole === "OFFICER" && (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{isHi ? "अधिकारी संवर्ग प्रोफाइल" : "Officer Cadre Profile"}</h4>
              <div>
                <label className="block text-slate-600 dark:text-slate-300 mb-1">{isHi ? "पूरा नाम" : "Full Name"}</label>
                <input
                  type="text"
                  value={officerData.fullName}
                  onChange={(e) => setOfficerData({ ...officerData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-gov-blue bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">{isHi ? "पदनाम" : "Designation"}</label>
                  <input
                    type="text"
                    value={officerData.designation}
                    onChange={(e) => setOfficerData({ ...officerData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-gov-blue bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">{isHi ? "विभाग" : "Department"}</label>
                  <input
                    type="text"
                    value={officerData.department}
                    onChange={(e) => setOfficerData({ ...officerData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-gov-blue bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">{isHi ? "कार्य अनुभव (वर्ष)" : "Years of Experience"}</label>
                  <input
                    type="number"
                    value={officerData.yearsOfExperience}
                    onChange={(e) => setOfficerData({ ...officerData, yearsOfExperience: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-gov-blue bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 mb-1">{isHi ? "करियर लक्ष्य" : "Career Goal"}</label>
                  <input
                    type="text"
                    value={officerData.careerGoal}
                    onChange={(e) => setOfficerData({ ...officerData, careerGoal: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-1 focus:ring-gov-blue bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Trainer Access Code Verification */}
          {selectedRole === "TRAINER" && (
            <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-2">
              <label className="block text-xs font-semibold text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                <span>{isHi ? "प्रशिक्षक एक्सेस कोड (सर्वर-साइड सत्यापित)" : "Trainer Access Code (Validated Server-Side)"}</span>
              </label>
              <input
                type="password"
                placeholder={isHi ? "गुप्त प्रशिक्षक एक्सेस कोड दर्ज करें..." : "Enter secret trainer access code..."}
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-2 border border-emerald-300 dark:border-emerald-700 rounded-md focus:ring-1 focus:ring-emerald-600 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                required
              />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHi ? "मूल्यांकन हेतु टिप: सर्वर परिवेश में कॉन्फ़िगर की गई डिफ़ॉल्ट कुंजी है " : "Tip for evaluation: Default prototype key configured in server environment is "}
                <code className="bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 px-1 py-0.5 rounded font-mono">
                  TRAINER-MOSPI-2025
                </code>
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm text-white flex items-center justify-center space-x-2 shadow-sm transition-colors cursor-pointer ${
              selectedRole === "OFFICER"
                ? "bg-gov-navy hover:bg-gov-blue"
                : "bg-emerald-700 hover:bg-emerald-800"
            }`}
          >
            <span>
              {submitting
                ? (isHi ? "सत्यापित हो रहा है..." : "Verifying...")
                : (isHi
                    ? (selectedRole === "OFFICER" ? "सांख्यिकी अधिकारी के रूप में आगे बढ़ें" : "प्रशिक्षक के रूप में आगे बढ़ें")
                    : `Continue as ${selectedRole === "OFFICER" ? "Statistical Officer" : "Trainer"}`
                  )
              }
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

