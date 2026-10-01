import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import {
  X,
  Target,
  Award,
  BookOpen,
  BrainCircuit,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function CompetencyDetailModal({
  isOpen,
  onClose,
  gap,
  onLaunchQuiz,
  onLaunchCourse
}) {
  const { language, t } = useLanguage();
  const isHi = language === 'hi';
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'ai-brief' | 'history'

  if (!isOpen || !gap) return null;

  const competencyName = t(gap.competencyName, gap.competencyName);
  const domain = t(gap.domain || 'Statistical', gap.domain || 'Statistical');

  const isPercentScale = gap.targetLevel > 5;
  const currentPct = isPercentScale ? gap.currentLevel : Math.round((gap.currentLevel / 5) * 100);
  const targetPct = isPercentScale ? gap.targetLevel : Math.round((gap.targetLevel / 5) * 100);
  const gapVal = gap.rawGap !== undefined ? gap.rawGap : (targetPct - currentPct);

  // Micro study notes generator based on competency domain
  const getStudyBrief = (comp) => {
    const name = comp.competencyName || '';
    if (name.includes('Sampling') || name.includes('Survey')) {
      return {
        formulas: [
          'Horvitz-Thompson Estimator: \\hat{Y}_{HT} = \\sum_{i=1}^n \\frac{y_i}{\\pi_i}',
          'PPSWOR Variance: \\hat{V}(\\hat{Y}_{HT}) = \\sum_{i < j} \\frac{\\pi_i \\pi_j - \\pi_{ij}}{\\pi_{ij}} \\left(\\frac{y_i}{\\pi_i} - \\frac{y_j}{\\pi_j}\\right)^2'
        ],
        keyRules: [
          'First Stage Units (FSUs) in NSS rural sectors are Census Villages (or Census Enumeration Blocks in urban areas).',
          'Second Stage Stratification (SSS) balances household affluence categories to avoid sampling bias.',
          'Multiplier calculation: \\text{Multiplier} = \\frac{N_s}{n_s} \\times \\frac{H_{si}}{h_{si}}.'
        ],
        practicalApplication: 'Used in PLFS (Periodic Labour Force Survey) quarterly rounds and NSS 80th Round Household Consumption Expenditure Surveys.'
      };
    } else if (name.includes('Python') || name.includes('Data') || name.includes('Analytics')) {
      return {
        formulas: [
          'Pandas Aggregation: df.groupby([\'state\', \'sector\']).agg({\'expenditure\': [\'mean\', \'std\']})',
          'Survey Weighting in Statsmodels: WLS(y, X, weights=sample_weights).fit()'
        ],
        keyRules: [
          'Always validate duplicate household serial numbers across Sub-Sample 1 and Sub-Sample 2.',
          'Treat missing values as per MoSPI codebooks (e.g., Code 99/999 for Not Reported).',
          'Vectorized Pandas/Numpy operations are mandatory for NSS datasets exceeding 1,000,000 unit-level records.'
        ],
        practicalApplication: 'Automating Annual Survey of Industries (ASI) tabulation and PLFS state-level microdata extraction.'
      };
    } else if (name.includes('Index') || name.includes('Inflation') || name.includes('CPI') || name.includes('IIP')) {
      return {
        formulas: [
          'Laspeyres Price Index: I_L = \\frac{\\sum (P_t \\times Q_0)}{\\sum (P_0 \\times Q_0)} \\times 100',
          'Paasche Price Index: I_P = \\frac{\\sum (P_t \\times Q_t)}{\\sum (P_0 \\times Q_t)} \\times 100'
        ],
        keyRules: [
          'MoSPI CPI (Rural, Urban, Combined) uses 2012 as the base year with modified Laspeyres formula.',
          'Item weights in CPI basket are derived from Consumer Expenditure Survey (CES) expenditure shares.',
          'Outlier price validation requires dual verification if price relative exceeds +/- 20% in single month.'
        ],
        practicalApplication: 'Monthly calculation and release of All-India Consumer Price Index (CPI) and Index of Industrial Production (IIP).'
      };
    } else {
      return {
        formulas: [
          'Data Quality Metric: \\text{Completeness Rate} = \\frac{\\text{Valid Submissions}}{\\text{Total Canvassed Units}} \\times 100%',
          'Response Rate Threshold: Minimum 85% required for statistical validity in socio-economic surveys.'
        ],
        keyRules: [
          'Adhere strictly to MoSPI National Data Warehouse (NDW) metadata schema standards.',
          'Ensure PII masking and cryptographic pseudonymization in compliance with DPDP Act 2023.',
          'Audit trail must record every manual modification with officer timestamp and authorization code.'
        ],
        practicalApplication: 'Official Statistical Cadre governance and administrative registry integration.'
      };
    }
  };

  const brief = getStudyBrief(gap);

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md transition-all duration-300'>
      <div
        className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-modal-pop'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 flex items-start justify-between'>
          <div>
            <div className='flex items-center space-x-2'>
              <span className='text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-gov-blue dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 rounded'>
                {domain} {isHi ? 'डोमेन' : 'Domain'}
              </span>
              <StatusBadge type='priority' value={gap.priority} />
              <StatusBadge type='status' value={gap.status} />
            </div>
            <h3 className='text-lg font-extrabold text-slate-900 dark:text-white mt-1.5'>
              {competencyName}
            </h3>
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
              {isHi ? 'MoSPI सांख्यिकी संवर्ग मानक एवं उपचारात्मक अध्ययन योजना' : 'MoSPI Statistical Cadre Standard & Remediation Blueprint'}
            </p>
          </div>

          <button
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40 px-5 pt-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "overview"
                ? "border-gov-blue text-gov-blue dark:border-sky-400 dark:text-sky-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isHi ? "अवलोकन एवं अंतराल" : "Overview & Gap"}</span>
          </button>
          <button
            onClick={() => setActiveTab("ai-brief")}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === "ai-brief"
                ? "border-gov-blue text-gov-blue dark:border-sky-400 dark:text-sky-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-gov-accent" />
            <span>{isHi ? "एआई माइक्रो-स्टडी नोट्स" : "AI Micro-Study Notes"}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === "overview" && (
            <>
              {/* Mastery Comparison */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {isHi ? "दक्षता स्तर तुलना" : "Cadre Mastery Comparison"}
                  </span>
                  <span className={`font-extrabold px-2 py-0.5 rounded text-xs ${
                    gapVal > 0 ? "bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300"
                  }`}>
                    {gapVal > 0 ? `${isHi ? "कमी" : "Deficiency"}: -${gapVal} pts` : (isHi ? "मानक पूर्ण" : "Standard Met")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t("currentLabel")}</span>
                    <span className="text-xl font-extrabold text-gov-blue dark:text-sky-400">{currentPct}%</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">{t("targetLabel")}</span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">{targetPct}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${gapVal > 0 ? "bg-orange-500" : "bg-emerald-500"}`}
                      style={{ width: `${Math.min(100, currentPct)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>0% (Foundational)</span>
                    <span>100% (Expert)</span>
                  </div>
                </div>
              </div>

              {/* Assessment Context Note */}
              <div className='p-3.5 bg-blue-50/60 dark:bg-slate-800/70 rounded-xl border border-blue-100 dark:border-slate-700 text-xs text-blue-950 dark:text-sky-200 space-y-1.5'>
                <div className='flex items-center space-x-1.5 font-bold text-gov-blue dark:text-sky-400'>
                  <ShieldCheck className='w-4 h-4 text-gov-accent' />
                  <span>{isHi ? 'आधिकारिक संवर्ग भूमिका आवश्यकता' : 'Official MoSPI Role Expectation'}</span>
                </div>
                <p className='text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]'>
                  {gap.notes || (isHi
                    ? 'सांख्यिकी अधिकारी के पद हेतु इस विषय क्षेत्र में कम से कम 75% स्कोर अपेक्षित है ताकि सर्वेक्षण डेटा संकलन एवं विश्लेषण बिना किसी पद्धतिगत त्रुटि के पूर्ण किया जा सके।'
                    : 'A minimum 75% proficiency benchmark is required for Statistical Officers to ensure zero methodological errors in field survey compilation and national data dissemination.'
                  )}
                </p>
              </div>

              {/* Action Remediation Paths */}
              <div className='space-y-2.5 pt-1'>
                <h4 className='text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5'>
                  <Sparkles className='w-3.5 h-3.5 text-gov-accent' />
                  <span>{isHi ? 'उपचारात्मक अध्ययन एवं त्वरित सुधार पथ' : 'Immediate Remediation & Skill Gap Resolution'}</span>
                </h4>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {/* Action 1: Targeted Practice Quiz */}
                  <div className='p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-gov-blue/50 dark:hover:border-sky-500/50 shadow-xs flex flex-col justify-between space-y-3'>
                    <div>
                      <div className='flex items-center space-x-2 text-gov-blue dark:text-sky-400 mb-1'>
                        <Award className='w-4 h-4' />
                        <span className='font-bold text-xs'>{isHi ? 'लक्षित अभ्यास प्रश्नोत्तरी' : 'Targeted Practice Quiz'}</span>
                      </div>
                      <p className='text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed'>
                        {isHi ? '5 अनुकूलित प्रश्नों के माध्यम से अपनी दक्षता का परीक्षण करें और स्कोर पुनः कैलिब्रेट करें।' : 'Test mastery with 5 focused questions and recalibrate your competency score immediately.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onLaunchQuiz) onLaunchQuiz(gap.competencyId);
                      }}
                      className='w-full py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-xs'
                    >
                      <span>{isHi ? '5-प्रश्न क्विज शुरू करें' : 'Launch 5-Q Quiz'}</span>
                      <ArrowRight className='w-3.5 h-3.5' />
                    </button>
                  </div>

                  {/* Action 2: iGOT Karmayogi Course */}
                  <div className='p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 shadow-xs flex flex-col justify-between space-y-3'>
                    <div>
                      <div className='flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 mb-1'>
                        <BookOpen className='w-4 h-4' />
                        <span className='font-bold text-xs'>{isHi ? 'iGOT कर्मयोगी मॉड्यूल' : 'iGOT Interactive Module'}</span>
                      </div>
                      <p className='text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed'>
                        {isHi ? 'पाठ्यक्रम अध्याय पूर्ण करें, +25% प्रगति प्राप्त करें और प्रमाण पत्र अर्जित करें।' : 'Study interactive syllabus chapters, advance +25% per chapter, and earn official certification.'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        if (onLaunchCourse) onLaunchCourse(gap);
                      }}
                      className='w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center space-x-1.5 transition-colors shadow-xs'
                    >
                      <span>{isHi ? 'पाठ्यक्रम खोलें' : 'Open Course Console'}</span>
                      <ArrowRight className='w-3.5 h-3.5' />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'ai-brief' && (
            <div className='space-y-4 text-xs leading-relaxed'>
              <div className='p-3.5 bg-blue-50/70 dark:bg-slate-800/80 rounded-xl border border-blue-200 dark:border-slate-700 space-y-2'>
                <div className='flex items-center space-x-1.5 text-gov-blue dark:text-sky-400 font-bold'>
                  <BrainCircuit className='w-4 h-4 text-gov-accent' />
                  <span>{isHi ? 'मुख्य सांख्यिकीय सूत्र एवं गणना' : 'Core Formulas & Mathematical Formulations'}</span>
                </div>
                <div className='space-y-1.5 font-mono text-[11px] bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-blue-100 dark:border-slate-800 text-slate-900 dark:text-sky-300'>
                  {brief.formulas.map((f, i) => (
                    <div key={i} className='py-0.5'>{f}</div>
                  ))}
                </div>
              </div>

              <div className='p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2'>
                <div className='flex items-center space-x-1.5 text-slate-900 dark:text-white font-bold'>
                  <CheckCircle2 className='w-4 h-4 text-emerald-500' />
                  <span>{isHi ? 'एनएसएसओ / एमओएसपीआई मानक नियम' : 'MoSPI / NSS Standard Guidelines'}</span>
                </div>
                <ul className='space-y-1 text-slate-700 dark:text-slate-300 pl-4 list-disc text-[11px]'>
                  {brief.keyRules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className='p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 space-y-1'>
                <span className='font-bold block'>{isHi ? 'व्यावहारिक उपयोग' : 'Practical Cadre Application'}:</span>
                <p className='text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed'>
                  {brief.practicalApplication}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-end space-x-2'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors'
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
