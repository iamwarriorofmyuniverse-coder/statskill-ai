import React from "react";
import ThemeToggle from "../components/common/ThemeToggle.jsx";
import LanguageToggle from "../components/common/LanguageToggle.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import {
  ShieldCheck,
  Award,
  BookOpen,
  Target,
  ArrowRight,
  Layers,
  Sparkles,
  Lock,
  Compass
} from "lucide-react";

export default function AuthPage() {
  const {
    loginWithGoogle,
    loginAsDemoOfficer,
    loginAsDemoTrainer,
    authError
  } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      {/* Top Gov Header */}
      <div className="bg-gov-navy text-white border-b-4 border-gov-saffron px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-gov-sky" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide text-white">{t("appTitle", "StatSkill AI")}</span>
              <p className="text-xs text-slate-300">
                {isHi ? "सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) • भारत सरकार" : "Ministry of Statistics and Programme Implementation (MoSPI) • Government of India"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right text-xs text-slate-300 mr-2">
              <span className="font-semibold text-gov-sky">{isHi ? "स्मार्ट इंडिया हैकाथॉन" : "Smart India Hackathon"}</span>
              <p className="text-[11px] text-slate-400">{isHi ? "समस्या विवरण 26101" : "Problem Statement 26101"}</p>
            </div>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Authentication & Showcase Hero */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full">
          {/* Left Column: Platform Overview & Core Loop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-gov-sky/80 text-gov-blue px-3 py-1 rounded-full text-xs font-bold border border-gov-sky">
              <Sparkles className="w-3.5 h-3.5 text-gov-accent" />
              <span>{isHi ? "राष्ट्रीय सांख्यिकी क्षमता निर्माण 2026" : "National Statistical Capacity Building 2026"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {isHi
                ? <>भारतीय <span className="text-gov-blue dark:text-sky-400">आधिकारिक सांख्यिकी प्रणाली</span> हेतु एआई-संचालित दक्षता विश्लेषण</>
                : <>AI-Powered Competency Intelligence for <span className="text-gov-blue dark:text-sky-400">India's Official Statistical System</span></>
              }
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {isHi
                ? "अधीनस्थ सांख्यिकी सेवा (SSS) एवं भारतीय सांख्यिकी सेवा (ISS) हेतु मनोवैज्ञानिक रूप से अंशांकित व्यक्तिगत अध्ययन मंच।"
                : "An intelligent, psychometrically calibrated learning architecture tailored for the Subordinate Statistical Service (SSS) and Indian Statistical Service (ISS)."
              }
            </p>

            {/* Core Loop Cards */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-gov-blue dark:text-sky-400" />
                <span>{t("competencyGrowthLoop")}</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-sky-950 text-gov-blue dark:text-sky-300 font-extrabold text-xs flex items-center justify-center mx-auto mb-1 border border-blue-200 dark:border-sky-800">1</span>
                  <strong className="block text-slate-900 dark:text-white">{isHi ? "मापें" : "MEASURE"}</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isHi ? "दक्षता आंकलन" : "Benchmark capability"}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-extrabold text-xs flex items-center justify-center mx-auto mb-1 border border-orange-200 dark:border-orange-800">2</span>
                  <strong className="block text-slate-900 dark:text-white">{isHi ? "निदान" : "DIAGNOSE"}</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isHi ? "कौशल अंतराल मैपिंग" : "Map skill deficits"}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center mx-auto mb-1 border border-emerald-200 dark:border-emerald-800">3</span>
                  <strong className="block text-slate-900 dark:text-white">{isHi ? "सीखें" : "LEARN"}</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isHi ? "लक्षित पाठ्यक्रम" : "Targeted modules"}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold text-xs flex items-center justify-center mx-auto mb-1 border border-purple-200 dark:border-purple-800">4</span>
                  <strong className="block text-slate-900 dark:text-white">{isHi ? "पुनर्मूल्यांकन" : "REASSESS"}</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{isHi ? "निरंतर विकास" : "Continuous growth"}</span>
                </div>
              </div>
            </div>

            {/* Cadre Competency Domains */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                <strong className="text-gov-blue dark:text-sky-400 block">1. {isHi ? "सांख्यिकी" : "Statistical"}</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? "सर्वेक्षण, प्रतिचयन, डेटा गुणवत्ता" : "Survey, Sampling, Data Quality"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                <strong className="text-cyan-700 dark:text-cyan-300 block">2. {isHi ? "तकनीकी" : "Technical"}</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? "पायथन, एसक्यूएल, विज़ुअलाइज़ेशन" : "Python, SQL, GIS, AI/ML"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                <strong className="text-indigo-700 dark:text-indigo-300 block">3. {isHi ? "डिजिटल शासन" : "Digital Gov"}</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? "डीपीडीपी 2023, साइबर सुरक्षा" : "DPDP Act 2023, Security"}</span>
              </div>
              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                <strong className="text-emerald-700 dark:text-emerald-300 block">4. {isHi ? "व्यवहार एवं प्रबंधन" : "Behavioural"}</strong>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? "नैतिकता, प्रशासनिक संप्रेषण" : "Leadership, Ethics, Mgmt"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl space-y-6">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-xl bg-gov-navy text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <ShieldCheck className="w-6 h-6 text-gov-sky" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isHi ? "आधिकारिक पोर्टल लॉगिन" : "Official Portal Login"}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isHi ? "भारत सरकार सिंगल साइन-ऑन अथवा गूगल द्वारा प्रमाणित करें" : "Authenticate using Government of India Single Sign-On or Google"}
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs">
                  {authError}
                </div>
              )}

              {/* Real Google Sign-In Button */}
              <button
                onClick={loginWithGoogle}
                className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center space-x-3 transition-colors shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isHi ? "गूगल साइन-इन से आगे बढ़ें" : "Continue with Google Sign-In"}</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="shrink mx-3 text-slate-400 dark:text-slate-400 text-[11px] uppercase font-semibold">
                  {isHi ? "अथवा प्रोटोटाइप त्वरित मूल्यांकन" : "Or Instant Prototype Evaluation"}
                </span>
                <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              {/* 1-Click Demo Logins for Judges & Evaluators */}
              <div className="space-y-2.5">
                <button
                  onClick={loginAsDemoOfficer}
                  className="w-full py-3 px-4 rounded-xl bg-gov-navy hover:bg-gov-blue text-white text-xs font-bold flex items-center justify-between shadow-xs transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-4 h-4 text-gov-sky" />
                    <div className="text-left">
                      <span className="block leading-tight">{isHi ? "अधिकारी के रूप में प्रवेश (अनन्या शर्मा)" : "Enter as Officer (Ananya Sharma)"}</span>
                      <span className="text-[10px] text-slate-300 font-normal">
                        {isHi ? "सांख्यिकी अधिकारी, आधिकारिक सांख्यिकी" : "Statistical Officer, Official Statistics"}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={loginAsDemoTrainer}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-between shadow-xs transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                    <div className="text-left">
                      <span className="block leading-tight">{isHi ? "प्रशिक्षक के रूप में प्रवेश (डॉ. राजेश वर्मा)" : "Enter as Trainer (Dr. Rajesh Verma)"}</span>
                      <span className="text-[10px] text-emerald-100 font-normal">
                        {isHi ? "एनएसएसटीए संकाय / मूल्यांकनकर्ता" : "NSSTA Faculty / Evaluator"}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-emerald-100 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{isHi ? "SIH 26101 सुरक्षा प्रोटोकॉल:" : "SIH 26101 Security Protocol:"}</p>
                <p>
                  {isHi
                    ? "प्रशिक्षक भूमिका सर्वर-साइड कोड सत्यापन द्वारा सुरक्षित है। गुप्त कुंजी क्लाइंट कोड में प्रदर्शित नहीं होती।"
                    : "Trainer role is protected by server-side code validation. Secret key is never exposed in client source code."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>{isHi ? "राष्ट्रीय सांख्यिकी प्रणाली प्रशिक्षण अकादमी (NSSTA) • सांख्यिकी और कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI)" : "National Statistical Systems Training Academy (NSSTA) • Ministry of Statistics and Programme Implementation (MoSPI)"}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">{isHi ? "भारत सरकार • स्मार्ट इंडिया हैकाथॉन समस्या विवरण 26101 हेतु विकसित" : "Government of India • Built for Smart India Hackathon Problem Statement 26101"}</p>
      </div>
    </div>
  );
}

