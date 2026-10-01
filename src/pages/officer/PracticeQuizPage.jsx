import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  getQuestionBank,
  getSkillGaps,
  recordQuizAttempt
} from '../../services/firestoreService.js';
import { MASTER_ASSESSMENT_QUESTIONS } from '../../data/assessmentQuestions.js';
import { api } from '../../services/api.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  Sliders,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  FileText,
  Target,
  Layers,
  HelpCircle,
  Command
} from 'lucide-react';

export default function PracticeQuizPage({ setCurrentTab, initialCompetencyId }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const { showSuccess, showInfo } = useToast();
  const isHi = language === 'hi';

  const [step, setStep] = useState('CONFIG'); // 'CONFIG' | 'RUNNING' | 'RESULTS'
  const [skillGaps, setSkillGaps] = useState([]);
  const [selectedCompetencyId, setSelectedCompetencyId] = useState(initialCompetencyId || 'comp-stat-01');
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialCompetencyId) {
      setSelectedCompetencyId(initialCompetencyId);
    }
  }, [initialCompetencyId]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const uid = currentUser?.uid || 'officer_ananya_001';
        const gaps = await getSkillGaps(uid);
        setSkillGaps(gaps || []);
      } catch (e) {
        console.error('Practice quiz load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  // Keyboard shortcut listener during active quiz
  useEffect(() => {
    if (step !== 'RUNNING' || !quizQuestions.length) return;

    function handleKeyDown(e) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const currentQ = quizQuestions[currentIndex];
      if (!currentQ) return;

      const key = e.key.toLowerCase();
      if (key === 'a' || key === '1') {
        handleSelectOption(currentQ.id, 0);
      } else if (key === 'b' || key === '2') {
        handleSelectOption(currentQ.id, 1);
      } else if (key === 'c' || key === '3') {
        handleSelectOption(currentQ.id, 2);
      } else if (key === 'd' || key === '4') {
        handleSelectOption(currentQ.id, 3);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1));
      } else if (e.key === 'Enter') {
        if (currentIndex < quizQuestions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else if (Object.keys(userAnswers).length > 0) {
          handleSubmitQuiz();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, currentIndex, quizQuestions, userAnswers]);

  const handleStartQuiz = () => {
    // Filter master questions by selected competency
    const matched = MASTER_ASSESSMENT_QUESTIONS.filter(
      (q) => q.competencyId === selectedCompetencyId
    );

    // If fewer questions than requested, fallback to any questions
    const pool = matched.length >= numQuestions
      ? matched
      : [...matched, ...MASTER_ASSESSMENT_QUESTIONS.filter((q) => q.competencyId !== selectedCompetencyId)];

    const selected = pool.slice(0, numQuestions);
    setQuizQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setStep('RUNNING');
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      let correctCount = 0;
      const questionBreakdown = quizQuestions.map((q) => {
        const selected = userAnswers[q.id];
        const isCorrect = selected === q.correctAnswer;
        if (isCorrect) correctCount++;
        return {
          questionId: q.id,
          question: isHi && q.questionHi ? q.questionHi : q.question,
          competencyName: t(q.competencyName, q.competencyName),
          selectedOption: selected,
          correctOption: q.correctAnswer,
          isCorrect,
          explanation: isHi && q.explanationHi ? q.explanationHi : q.explanation
        };
      });

      const scorePercent = Math.round((correctCount / quizQuestions.length) * 100);
      const uid = currentUser?.uid || 'officer_ananya_001';

      // Find matched gap to calibrate
      const matchedGap = skillGaps.find(g => g.competencyId === selectedCompetencyId) || {};
      const previousScore = matchedGap.currentLevel || 60;
      const calibratedScore = Math.min(100, Math.round(previousScore * 0.7 + scorePercent * 0.3));
      const improvement = calibratedScore - previousScore;

      const attemptRecord = {
        userId: uid,
        competencyId: selectedCompetencyId,
        competencyName: matchedGap.competencyName || 'Official Statistics',
        domain: matchedGap.domain || 'Statistical',
        quizScore: scorePercent,
        scorePercent,
        previousScore,
        newScore: calibratedScore,
        improvement,
        totalQuestions: quizQuestions.length,
        correctCount,
        breakdown: questionBreakdown,
        completedAt: new Date().toISOString()
      };

      await recordQuizAttempt(attemptRecord);
      setQuizResult(attemptRecord);
      setStep('RESULTS');

      showSuccess(
        isHi
          ? `प्रश्नोत्तरी पूर्ण! दक्षता स्कोर ${previousScore}% से बढ़कर ${calibratedScore}% हो गया है।`
          : `Practice quiz completed! Competency calibrated from ${previousScore}% to ${calibratedScore}%.`,
        isHi ? "दक्षता पुनर्गणना सफल" : "Competency Recalibrated"
      );
    } catch (e) {
      console.error('Quiz submission error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-96'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gov-blue'></div>
      </div>
    );
  }

  // Current Running Question
  const currentQ = quizQuestions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className='space-y-6'>
      {/* 1. CONFIG STEP */}
      {step === 'CONFIG' && (
        <div className='space-y-6'>
          <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <div className='flex items-center space-x-2 text-gov-blue dark:text-sky-400'>
                <BrainCircuit className='w-5 h-5' />
                <span className='text-xs font-bold uppercase tracking-wider'>
                  {t('step4Reassess')}
                </span>
              </div>
              <h1 className='text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1'>
                {isHi ? 'अनुकूली अभ्यास प्रश्नोत्तरी एवं स्व-मूल्यांकन' : 'Adaptive Practice Quiz & Self-Assessment'}
              </h1>
              <p className='text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5'>
                {isHi
                  ? 'विशिष्ट सांख्यिकीय कार्यप्रणाली, पायथन, एसक्यूएल, डीपीडीपी 2023 और आधिकारिक प्रणालियों में दक्षता सुधारें।'
                  : 'Calibrate and sharpen competencies in Official Statistics, Survey Sampling, Python, SQL, and Data Privacy with instant explanation.'
                }
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Quiz Configuration Form */}
            <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4'>
              <h3 className='text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2'>
                <Sliders className='w-4 h-4 text-gov-blue' />
                <span>{isHi ? 'प्रश्नोत्तरी सेटिंग्स चुनें' : 'Select Quiz Parameters'}</span>
              </h3>

              <div>
                <label className='block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1'>
                  {isHi ? 'लक्षित दक्षता चुनें' : 'Target Competency to Practice'}
                </label>
                <select
                  value={selectedCompetencyId}
                  onChange={(e) => setSelectedCompetencyId(e.target.value)}
                  className='w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:border-gov-blue'
                >
                  <option value='comp-stat-01'>{t('Survey Design')}</option>
                  <option value='comp-stat-02'>{t('Sampling Methods & Survey Design')}</option>
                  <option value='comp-stat-03'>{t('Official Statistics')}</option>
                  <option value='comp-stat-04'>{t('Data Quality')}</option>
                  <option value='comp-tech-01'>{t('Python for Statistical Analysis')}</option>
                  <option value='comp-tech-02'>{t('SQL Databases')}</option>
                  <option value='comp-tech-03'>{t('AI/ML')}</option>
                  <option value='comp-tech-04'>{t('Data Visualization')}</option>
                  <option value='comp-gov-01'>{t('Data Privacy')}</option>
                  <option value='comp-gov-02'>{t('Cybersecurity')}</option>
                  <option value='comp-gov-03'>{t('Ethics')}</option>
                  <option value='comp-beh-01'>{t('Project Mgmt')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? "प्रश्नों की संख्या" : "Number of Questions"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNumQuestions(num)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-colors ${
                        numQuestions === num
                          ? "bg-gov-blue text-white border-gov-blue"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                      }`}
                    >
                      {num} {isHi ? "प्रश्न" : "Questions"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="w-full py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-gov-sky" />
                  <span>{isHi ? "प्रश्नोत्तरी प्रारंभ करें" : "Start Targeted Practice Quiz"}</span>
                </button>
              </div>
            </div>

            {/* Officer Skill Gap Focus Area */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center space-x-2">
                <Target className="w-4 h-4 text-orange-600" />
                <span>{isHi ? "उच्च प्राथमिकता कौशल अंतराल (अनुशंसित)" : "High Priority Skill Gaps (Recommended)"}</span>
              </h3>

              <div className="space-y-2.5">
                {skillGaps.slice(0, 3).map((gap) => (
                  <div
                    key={gap.id}
                    onClick={() => setSelectedCompetencyId(gap.competencyId)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedCompetencyId === gap.competencyId
                        ? "bg-blue-50/80 dark:bg-slate-800 border-gov-blue dark:border-sky-500"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {t(gap.competencyName, gap.competencyName)}
                      </span>
                      <StatusBadge type="priority" value={gap.priority} />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {t("currentLabel")}: {gap.currentLevel}% • {t("targetLabel")}: {gap.targetLevel}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RUNNING STEP */}
      {step === "RUNNING" && currentQ && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Question Palette Header */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isHi ? "प्रश्नावली नेविगेशन:" : "Question Navigator:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quizQuestions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 rounded text-[11px] border font-bold flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? "ring-2 ring-gov-saffron bg-gov-blue text-white border-gov-blue"
                          : isAnswered
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-400">
              {answeredCount} / {quizQuestions.length} {isHi ? "उत्तर दिए गए" : "Answered"}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-gov-blue dark:text-sky-400 uppercase tracking-wider">
                  {isHi ? `प्रश्न ${currentIndex + 1} / ${quizQuestions.length}` : `Question ${currentIndex + 1} of ${quizQuestions.length}`}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {t(currentQ.competencyName, currentQ.competencyName)}
                </span>
              </div>
              <StatusBadge type="domain" value={currentQ.domain || "Statistical"} />
            </div>

            {/* Question Body */}
            <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
              {isHi && currentQ.questionHi ? currentQ.questionHi : currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-2.5 pt-2">
              {(isHi && currentQ.optionsHi ? currentQ.optionsHi : currentQ.options).map((opt, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs font-medium transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 border-gov-blue dark:border-sky-500 text-gov-navy dark:text-sky-200 shadow-xs"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 border ${
                      isSelected
                        ? "bg-gov-blue text-white border-gov-blue"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-normal">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Keyboard shortcuts hint bar */}
            <div className='py-2 px-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400'>
              <span className='flex items-center space-x-1.5'>
                <Command className='w-3.5 h-3.5 text-gov-blue dark:text-sky-400' />
                <span><strong>Shortcuts:</strong> [A/B/C/D] Select • [←/→] Navigate • [Enter] Next</span>
              </span>
            </div>

            {/* Footer Navigation */}
            <div className='flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800'>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className='px-3.5 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg disabled:opacity-30 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center space-x-1 cursor-pointer'
              >
                <ChevronLeft className='w-4 h-4' />
                <span>{isHi ? 'पिछला' : 'Previous'}</span>
              </button>

              {currentIndex < quizQuestions.length - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                  className='px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1 cursor-pointer'
                >
                  <span>{isHi ? 'अगला' : 'Next'}</span>
                  <ChevronRight className='w-4 h-4' />
                </button>
              ) : (
                <button
                  disabled={submitting || answeredCount === 0}
                  onClick={handleSubmitQuiz}
                  className='px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer'
                >
                  <CheckCircle2 className='w-4 h-4' />
                  <span>{submitting ? (isHi ? 'सबमिट हो रहा है...' : 'Submitting...') : (isHi ? 'प्रश्नोत्तरी सबमिट करें' : 'Submit Practice Quiz')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULTS STEP */}
      {step === 'RESULTS' && quizResult && (
        <div className='max-w-3xl mx-auto space-y-6'>
          <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs text-center space-y-3'>
            <div className='w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800'>
              <Award className='w-6 h-6' />
            </div>

            <h2 className='text-xl font-extrabold text-slate-900 dark:text-white'>
              {isHi ? 'अभ्यास प्रश्नोत्तरी परिणाम' : 'Practice Quiz Performance Result'}
            </h2>

            <div className='text-3xl font-black text-gov-blue dark:text-sky-400'>
              {quizResult.scorePercent}%
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? `${quizResult.totalQuestions} में से ${quizResult.correctCount} प्रश्न सही उत्तर दिए गए। दक्षता स्कोर ${quizResult.previousScore}% से बढ़कर ${quizResult.newScore}% हो गया।`
                : `You correctly answered ${quizResult.correctCount} out of ${quizResult.totalQuestions} questions. Competency score calibrated from ${quizResult.previousScore}% → ${quizResult.newScore}%.`
              }
            </p>

            <div className='flex justify-center space-x-3 pt-3'>
              <button
                onClick={() => setStep('CONFIG')}
                className='px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-1.5 cursor-pointer'
              >
                <RotateCcw className='w-3.5 h-3.5' />
                <span>{isHi ? 'पुनः अभ्यास करें' : 'Practice Again'}</span>
              </button>

              <button
                onClick={() => setCurrentTab('dashboard')}
                className='px-4 py-2 bg-gov-blue text-white text-xs font-bold rounded-lg shadow-xs hover:bg-gov-navy flex items-center space-x-1.5 cursor-pointer'
              >
                <span>{isHi ? 'डैशबोर्ड पर लौटें' : 'Return to Dashboard'}</span>
                <ArrowRight className='w-3.5 h-3.5' />
              </button>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className='bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4'>
            <h3 className='text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2'>
              {isHi ? 'विस्तृत प्रश्न समीक्षा एवं व्याख्या' : 'Detailed Question Review & Explanation'}
            </h3>

            <div className='space-y-4'>
              {quizResult.breakdown.map((item, idx) => (
                <div key={idx} className='p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs'>
                  <div className='flex items-start justify-between gap-2'>
                    <span className='font-bold text-slate-800 dark:text-slate-200'>
                      Q{idx + 1}. {item.question}
                    </span>
                    {item.isCorrect ? (
                      <span className='flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold shrink-0'>
                        <CheckCircle2 className='w-4 h-4' />
                        <span>{isHi ? 'सही' : 'Correct'}</span>
                      </span>
                    ) : (
                      <span className='flex items-center space-x-1 text-red-600 dark:text-red-400 font-bold shrink-0'>
                        <XCircle className='w-4 h-4' />
                        <span>{isHi ? 'गलत' : 'Incorrect'}</span>
                      </span>
                    )}
                  </div>

                  <div className='text-[11px] text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded border border-slate-100 dark:border-slate-700'>
                    <strong className='text-gov-blue dark:text-sky-400 block mb-0.5'>{isHi ? 'आधिकारिक व्याख्या:' : 'Official Explanation:'}</strong>
                    {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
