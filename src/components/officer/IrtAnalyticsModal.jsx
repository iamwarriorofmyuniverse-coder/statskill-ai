import React from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  BrainCircuit,
  TrendingUp,
  Award,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
  Calculator,
  ArrowRight
} from "lucide-react";

export default function IrtAnalyticsModal({ isOpen, onClose, currentTheta = 1.84 }) {
  const { language } = useLanguage();
  const isHi = language === "hi";

  if (!isOpen) return null;

  // 2PL IRT calculation parameters for benchmark items
  const items = [
    { id: "Q1", topic: "NSSO Stratified Sampling", difficulty_b: 0.42, discrimination_a: 1.65, answered: "Correct", pValue: "88%" },
    { id: "Q2", topic: "DPDP Act 2023 Section 8", difficulty_b: 1.15, discrimination_a: 1.92, answered: "Correct", pValue: "71%" },
    { id: "Q3", topic: "Laspeyres Substitution Bias", difficulty_b: 1.78, discrimination_a: 2.10, answered: "Correct", pValue: "52%" },
    { id: "Q4", topic: "ASI Capital GVA Accounting", difficulty_b: 2.25, discrimination_a: 1.80, answered: "Review", pValue: "41%" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gov-sky dark:bg-sky-950 text-gov-blue dark:text-sky-300 border border-gov-sky dark:border-sky-800 uppercase tracking-wider">
              <Calculator className="w-3 h-3" />
              <span>{isHi ? "मनोमितीय आईआरटी इंजन" : "2PL Item Response Theory (IRT) Engine"}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <BrainCircuit className="w-6 h-6 text-gov-blue dark:text-sky-400" />
              <span>{isHi ? "कंप्यूटरीकृत अनुकूली क्षमता विश्लेषण (θ)" : "Computerized Adaptive Ability Analysis (θ)"}</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-300 font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Theoretical Distinction Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-2">
          <p className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>Why IRT Outclasses Standard Percentage Quizzes:</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            In standard quizzes, getting 7/10 questions right equals 70%, completely ignoring whether the questions were trivial or advanced. StatSkill AI utilizes the <strong>2-Parameter Logistic Model</strong>:
          </p>
          <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl font-mono text-[11px] text-center text-gov-blue dark:text-sky-300 border border-slate-200 dark:border-slate-700">
            P_i(θ) = 1 / (1 + e^[ -a_i * (θ - b_i) ])
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">
            Where <strong>θ</strong> is latent cadre ability, <strong>b_i</strong> is question difficulty, and <strong>a_i</strong> is item discrimination power.
          </p>
        </div>

        {/* Latent Ability Metric Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Estimated Ability (θ)</span>
            <span className="text-3xl font-black text-gov-blue dark:text-sky-400">+{currentTheta}</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">Top 3.8% of ISS Cadre</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Standard Error SE(θ)</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">± 0.18</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">High Convergence Precision</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Test Information (I)</span>
            <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">30.8</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Fisher Information Peak</span>
          </div>
        </div>

        {/* Item Parameter Breakdown Table */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Item Characteristic Parameters (Calibrated via NSSTA Benchmark Bank)
          </h4>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="py-2.5 px-3">Item ID</th>
                  <th className="py-2.5 px-3">MoSPI Competency Focus</th>
                  <th className="py-2.5 px-3">Difficulty (b)</th>
                  <th className="py-2.5 px-3">Discrimination (a)</th>
                  <th className="py-2.5 px-3 text-right">Cadre Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                {items.map((it) => (
                  <tr key={it.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">{it.id}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{it.topic}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{it.difficulty_b}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">{it.discrimination_a}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        it.answered === "Correct" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}>
                        {it.answered}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-colors"
        >
          {isHi ? "विश्लेषण बंद करें" : "Return to Assessment"}
        </button>
      </div>
    </div>
  );
}
