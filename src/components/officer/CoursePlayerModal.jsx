import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { recordCourseProgress } from '../../services/firestoreService.js';
import StatusBadge from '../common/StatusBadge.jsx';
import {
  X,
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Printer,
  RotateCcw,
  PlayCircle,
  ExternalLink,
  ListOrdered,
  Calculator,
  Workflow
} from 'lucide-react';

export default function CoursePlayerModal({
  isOpen,
  onClose,
  course,
  onCourseCompleted
}) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const { showSuccess, showInfo } = useToast();
  const isHi = language === 'hi';

  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [completedChapters, setCompletedChapters] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [certificateData, setCertificateData] = useState(null);

  // Sync state when modal opens or course changes
  useEffect(() => {
    if (isOpen && course) {
      const rawProg = course.progressPercent !== undefined ? course.progressPercent : (course.status === 'COMPLETED' ? 100 : 0);
      const count = Math.min(4, Math.floor((rawProg / 100) * 4));
      const initial = [];
      for (let i = 0; i < count; i++) {
        initial.push(i);
      }
      setCompletedChapters(initial);
      // Select the first uncompleted chapter (or last if all done)
      setActiveChapterIndex(count >= 4 ? 3 : count);
      setCertificateData(null);
    }
  }, [isOpen, course]);

  const chapters = [
    {
      id: 'ch-1',
      title: isHi ? 'अध्याय 1: आधारभूत अवधारणाएं एवं एमओएसपीआई मानक' : 'Chapter 1: Foundational Framework & MoSPI Guidelines',
      duration: '45 mins',
      summary: isHi
        ? 'आधिकारिक सांख्यिकी प्रणाली के वैधानिक अधिदेश, एनएसएसओ सर्वेक्षण नियमावली और संवर्ग मानकों का परिचय।'
        : 'Introduction to official statistical mandates, NSSO survey manuals, and foundational cadre benchmarks.',
      intro: isHi
        ? 'यह अध्याय राष्ट्रीय सांख्यिकी प्रणाली की संरचना, एनएसएसओ / सीएसओ के एकीकरण, और राष्ट्रीय डेटा वेयरहाउस (NDW) के तहत डेटा गवर्नेंस मानकों को विस्तार से समझाता है।'
        : 'This chapter details the architecture of India\'s official statistical system, the integration of NSSO/CSO under MoSPI, and the data governance protocols under the National Data Warehouse (NDW).',
      sectionTitle: isHi ? 'मुख्य अवधारणाएं एवं नियम:' : 'Key Concepts & Directives:',
      sectionType: 'numbered',
      items: isHi
        ? [
            'प्रथम चरण इकाइयां (FSUs) और द्वितीय चरण स्तरीकरण (SSS) का राष्ट्रव्यापी नमूना चयन में महत्व।',
            'डेटा गोपनीयता और डीपीडीपी अधिनियम 2023 के तहत उत्तरदाताओं के व्यक्तिगत डेटा का वैधानिक संरक्षण।',
            'सर्वेक्षण जांचकर्ताओं के लिए अनिवार्य पूर्व-कैनवासिंग गुणवत्ता नियंत्रण चेकलिस्ट।'
          ]
        : [
            'Role of Primary Sampling Units (FSUs) and Ultimate Stage Units (USUs) in nation-wide sample selection.',
            'Strict data confidentiality protocols ensuring compliance with the Digital Personal Data Protection (DPDP) Act 2023.',
            'Mandatory pre-canvassing validation rules to prevent field non-sampling errors.'
          ]
    },
    {
      id: 'ch-2',
      title: isHi ? 'अध्याय 2: मुख्य सांख्यिकीय पद्धतियां एवं सूत्र' : 'Chapter 2: Core Methodologies & Mathematical Formulations',
      duration: '60 mins',
      summary: isHi
        ? 'प्रतिचयन विधियां, प्रसरण आकलन और भारित गुणांक (Multipliers) की गणना।'
        : 'Sampling designs, variance estimation algorithms, and survey multiplier calculations.',
      intro: isHi
        ? 'प्रतिस्थापन रहित प्रायिकता आनुपातिक प्रतिचयन (PPSWOR) और होर्विट्ज़-थॉम्पसन निष्पक्ष आकलक के गणितीय सिद्धांतों का विस्तृत अध्ययन।'
        : 'Deep dive into Probability Proportional to Size Without Replacement (PPSWOR) and Horvitz-Thompson unbiased estimation theory.',
      sectionTitle: isHi ? 'गणितीय सूत्र एवं गुणक गणना:' : 'Mathematical Formulations & Estimators:',
      sectionType: 'formula',
      items: isHi
        ? [
            'कुल का आकलक (Aggregate Estimator): Ŷ_HT = Σ (y_i / π_i)',
            'भार गुणक (Weight Multiplier) = (Ns / ns) × (Hsi / hsi)',
            'पीएलएफएस और घरेलू उपभोग व्यय सर्वेक्षण (HCES) के अखिल भारतीय अनुमान तैयार करने में प्रयुक्त सूत्र।'
          ]
        : [
            'Aggregate Estimator: Ŷ_HT = Σ (y_i / π_i)',
            'Weight Multiplier = (Ns / ns) × (Hsi / hsi)',
            'These multipliers ensure sampled household aggregates are accurately inflated to represent state and national census populations.'
          ]
    },
    {
      id: 'ch-3',
      title: isHi ? 'अध्याय 3: क्षेत्रीय डेटा संकलन एवं विसंगति निवारण' : 'Chapter 3: Field Compilation, Validation & Anomaly Resolution',
      duration: '50 mins',
      summary: isHi
        ? 'पीएलएफएस, एएसआई और सीपीआई/आईआईपी डेटा की जांच एवं विसंगति समाधान।'
        : 'Practical validation rules, outlier detection, and imputation for PLFS, ASI, and CPI datasets.',
      intro: isHi
        ? 'सर्वेक्षण डेटा में बहिर्वेशी मानों (Outliers) और अनुपलब्ध प्रतिक्रियाओं (Missing Values) के समाधान हेतु एमओएसपीआई मानक प्रोटोकॉल।'
        : 'Official MoSPI validation workflows for outlier detection, boundary trimming, and automated range checks across field survey microdata.',
      sectionTitle: isHi ? 'क्षेत्रीय सत्यापन प्रक्रिया के चरण:' : 'Field Validation Execution Steps:',
      sectionType: 'steps',
      items: isHi
        ? [
            'उप-प्रतिदर्श 1 (Central) और उप-प्रतिदर्श 2 (State) की स्वतंत्र संगति जांच।',
            'मद-वार व्यय में +/- 3 मानक विचलन से अधिक विसंगति पाए जाने पर स्वचालित फ्लैगिंग।',
            'केंद्रीय MoSPI सर्वर पर अपलोड करने से पूर्व डिजिटल हस्ताक्षर एवं एन्क्रिप्शन।'
          ]
        : [
            'Independent consistency validation between Sub-sample 1 (Central) and Sub-sample 2 (State).',
            'Automated flagging of outliers exceeding +/- 3 standard deviations in item-level expenditures.',
            'Digital sign-off, validation hash verification, and encryption before uploading to central MoSPI servers.'
          ]
    },
    {
      id: 'ch-4',
      title: isHi ? 'अध्याय 4: केस स्टडी एवं अंतिम संवर्ग मूल्यांकन' : 'Chapter 4: Cadre Case Study & Final Verification',
      duration: '40 mins',
      summary: isHi
        ? 'वास्तविक सांख्यिकी रिपोर्ट संकलन का व्यावहारिक अभ्यास एवं योग्यता प्रमाणीकरण।'
        : 'Practical case study on MoSPI bulletin compilation and competency certification.',
      intro: isHi
        ? 'इस अंतिम अध्याय में वास्तविक आवधिक श्रम बल सर्वेक्षण (PLFS) त्रैमासिक बुलेटिन के डेटा सेट का विश्लेषण कर बेरोजगारी दर और श्रमिक जनसंख्या अनुपात की गणना का अभ्यास कराया जाता है।'
        : 'In this capstone module, officers synthesize unit-level PLFS microdata to compute Labour Force Participation Rate (LFPR) and Worker Population Ratio (WPR) adhering to official dissemination templates.',
      sectionTitle: isHi ? 'अंतिम सक्षमता उद्देश्य:' : 'Final Competency Deliverables:',
      sectionType: 'numbered',
      items: isHi
        ? [
            'त्रैमासिक पीएलएफएस बुलेटिन के लिए मानक तालिकाओं का संकलन।',
            'प्रतिदर्श त्रुटियों (Standard Errors) एवं विश्वास अंतरालों का सत्यापन।',
            'संवर्ग दक्षता प्रमाणीकरण एवं राष्ट्रीय सांख्यिकी अकादमी (NSSTA) डिजिटल बैज प्राप्ति।'
          ]
        : [
            'Compilation of standard statistical dissemination tables for quarterly PLFS bulletins.',
            'Verification of sampling standard errors and confidence interval margins.',
            'Issuance of official National Statistical Systems Training Academy (NSSTA) Credential.'
          ]
    }
  ];

  if (!isOpen || !course) return null;

  const title = course.title || 'Official MoSPI Competency Course';
  const provider = course.provider || 'NSSTA / MoSPI & iGOT Karmayogi';
  const domain = course.domain || 'Statistical';
  const currentChapter = chapters[activeChapterIndex] || chapters[0];

  const totalChapters = chapters.length;
  const progressPercent = Math.round((completedChapters.length / totalChapters) * 100);

  const handleCompleteChapter = async () => {
    setIsProcessing(true);
    try {
      const uid = currentUser?.uid || 'officer_ananya_001';
      const courseId = course.courseId || course.id || 'igot-course-01';

      const res = await recordCourseProgress(uid, courseId, activeChapterIndex, totalChapters);

      const nextCompleted = Array.from(new Set([...completedChapters, activeChapterIndex]));
      setCompletedChapters(nextCompleted);

      if (nextCompleted.length >= totalChapters || res.isCompleted) {
        setCertificateData({
          certificateId: res.certificateId || `CERT-${Date.now().toString().slice(-6)}`,
          officerName: officerProfile?.fullName || 'Ananya Sharma',
          courseTitle: title,
          completedAt: new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          calibratedComp: res.calibratedComp
        });

        showSuccess(
          isHi
            ? `बधाई हो! आपने ${title} पूर्ण कर लिया है। आपकी दक्षता को अपग्रेड कर दिया गया है।`
            : `Congratulations! You completed ${title}. Your competency score has been calibrated upwards.`,
          isHi ? 'पाठ्यक्रम पूर्ण!' : 'Course Completed!'
        );

        if (onCourseCompleted) onCourseCompleted(res);
      } else {
        showInfo(
          isHi
            ? `अध्याय ${activeChapterIndex + 1} पूर्ण हुआ (+25% प्रगति)`
            : `Chapter ${activeChapterIndex + 1} marked complete (+25% Progress)`,
          isHi ? 'प्रगति सहेजी गई' : 'Progress Updated'
        );

        if (activeChapterIndex < totalChapters - 1) {
          setActiveChapterIndex(activeChapterIndex + 1);
        }
      }
    } catch (err) {
      console.error('Course progress error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all duration-300'>
      <div
        className='bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-modal-pop'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900 flex items-start justify-between'>
          <div>
            <div className='flex items-center space-x-2'>
              <span className='text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded'>
                iGOT Karmayogi Learning Console
              </span>
              <StatusBadge type='domain' value={domain} />
              <span className='text-xs text-slate-500 dark:text-slate-400'>
                • {provider}
              </span>
            </div>
            <h3 className='text-lg font-extrabold text-slate-900 dark:text-white mt-1'>
              {title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Progress Bar */}
        <div className='px-6 py-2.5 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs'>
          <div className='flex items-center space-x-2'>
            <span className='font-bold text-slate-700 dark:text-slate-300'>
              {isHi ? 'पाठ्यक्रम प्रगति:' : 'Course Completion:'}
            </span>
            <span className='font-extrabold text-gov-blue dark:text-sky-400'>{progressPercent}%</span>
          </div>
          <div className='w-48 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden'>
            <div
              className='h-full bg-emerald-500 rounded-full transition-all duration-300'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Content Body: Sidebar + Main Viewer */}
        <div className='flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden'>
          {/* Chapter Tree Sidebar */}
          <div className='md:col-span-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 p-4 overflow-y-auto space-y-2'>
            <h4 className='text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 px-1'>
              {isHi ? 'पाठ्यक्रम अनुक्रमणिका' : 'Course Syllabus'}
            </h4>

            {chapters.map((ch, idx) => {
              const isSelected = activeChapterIndex === idx;
              const isDone = completedChapters.includes(idx);
              const cascadeClass = `cascade-${Math.min(idx + 1, 8)}`;

              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-2.5 ${cascadeClass} ${
                    isSelected
                      ? 'bg-gov-blue/10 dark:bg-sky-950/40 border-gov-blue dark:border-sky-500 text-gov-blue dark:text-sky-300 shadow-xs'
                      : isDone
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-300'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className='mt-0.5 shrink-0'>
                    {isDone ? (
                      <CheckCircle2 className='w-4 h-4 text-emerald-500' />
                    ) : (
                      <PlayCircle className='w-4 h-4 text-slate-400' />
                    )}
                  </div>
                  <div className='flex-1 pr-1'>
                    <div className='text-xs font-bold leading-tight'>{ch.title}</div>
                    <div className='text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-1'>
                      <Clock className='w-3 h-3' />
                      <span>{ch.duration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Lesson Reader / Certificate View */}
          <div className='md:col-span-8 p-6 overflow-y-auto flex flex-col justify-between space-y-6'>
            {certificateData ? (
              /* Verified MoSPI / NSSTA Certificate View */
              <div className='p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border-2 border-amber-300 dark:border-amber-600/60 shadow-lg text-center space-y-4 animate-modal-pop'>
                <div className='flex justify-center relative'>
                  {/* Glowing halo ripple ring */}
                  <div className='absolute w-16 h-16 rounded-full bg-amber-400/30 dark:bg-amber-500/20 animate-halo-ripple pointer-events-none' />
                  <div className='w-14 h-14 bg-amber-100 dark:bg-amber-950 rounded-full flex items-center justify-center border-2 border-amber-400 shadow-md animate-badge-drop relative z-10'>
                    <Award className='w-8 h-8 text-amber-600 dark:text-amber-400' />
                  </div>
                </div>

                <div>
                  <span className='text-[11px] font-extrabold uppercase tracking-widest text-amber-800 dark:text-amber-300 block'>
                    Ministry of Statistics & Programme Implementation
                  </span>
                  <span className='text-[10px] font-bold text-slate-600 dark:text-slate-400 block'>
                    National Statistical Systems Training Academy (NSSTA)
                  </span>
                  <h3 className='text-xl font-black text-slate-900 dark:text-white mt-2'>
                    {isHi ? 'संवर्ग दक्षता प्रवीणता प्रमाण पत्र' : 'Certificate of Cadre Competency'}
                  </h3>
                </div>

                <div className='py-2 text-xs text-slate-700 dark:text-slate-300 space-y-1.5'>
                  <p>{isHi ? 'यह प्रमाणित किया जाता है कि अधिकारी' : 'This is to officially certify that Officer'}</p>
                  <p className='text-base font-extrabold text-gov-blue dark:text-sky-400'>
                    {certificateData.officerName}
                  </p>
                  <p>{isHi ? 'ने निम्नलिखित आधिकारिक संवर्ग पाठ्यक्रम सफलतापूर्वक पूर्ण किया है:' : 'has successfully mastered and completed the cadre module:'}</p>
                  <p className='font-bold text-slate-900 dark:text-white text-sm'>
                    {certificateData.courseTitle}
                  </p>
                </div>

                <div className='p-3 bg-white/90 dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400'>
                  <div>
                    <span className='block text-[10px] font-mono uppercase text-slate-400'>Certificate ID</span>
                    <span className='font-mono font-bold text-slate-800 dark:text-slate-200'>{certificateData.certificateId}</span>
                  </div>
                  <div>
                    <span className='block text-[10px] font-mono uppercase text-slate-400'>Issue Date</span>
                    <span className='font-bold text-slate-800 dark:text-slate-200'>{certificateData.completedAt}</span>
                  </div>
                </div>

                <div className='flex items-center justify-center space-x-3 pt-2'>
                  <button
                    onClick={() => window.print()}
                    className='px-4 py-2 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors shadow-xs'
                  >
                    <Printer className='w-3.5 h-3.5' />
                    <span>{isHi ? 'प्रमाण पत्र प्रिंट करें' : 'Print Certificate'}</span>
                  </button>
                  <button
                    onClick={onClose}
                    className='px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors'
                  >
                    {isHi ? 'डैशबोर्ड पर लौटें' : 'Return to Dashboard'}
                  </button>
                </div>
              </div>
            ) : (
              /* Regular Chapter Study View */
              <>
                <div className='space-y-4'>
                  <div>
                    <div className='flex items-center space-x-2 text-xs text-gov-blue dark:text-sky-400 font-bold'>
                      <span>{currentChapter.title}</span>
                    </div>
                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                      {currentChapter.summary}
                    </p>
                  </div>

                  {/* Chapter Content Card with Structured Lists */}
                  <div className='p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs leading-relaxed text-slate-800 dark:text-slate-200'>
                    {currentChapter.intro && (
                      <p className='text-slate-700 dark:text-slate-300 text-xs leading-relaxed font-normal'>
                        {currentChapter.intro}
                      </p>
                    )}

                    {currentChapter.items && currentChapter.items.length > 0 && (
                      <div className='space-y-2.5 pt-1'>
                        <div className='flex items-center space-x-1.5 text-slate-900 dark:text-white font-bold text-xs'>
                          {currentChapter.sectionType === 'formula' ? (
                            <Calculator className='w-3.5 h-3.5 text-gov-accent' />
                          ) : currentChapter.sectionType === 'steps' ? (
                            <Workflow className='w-3.5 h-3.5 text-gov-blue dark:text-sky-400' />
                          ) : (
                            <ListOrdered className='w-3.5 h-3.5 text-gov-blue dark:text-sky-400' />
                          )}
                          <span>{currentChapter.sectionTitle}</span>
                        </div>

                        <div className='space-y-2'>
                          {currentChapter.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className={`p-3 rounded-lg border text-xs flex items-start space-x-2.5 ${
                                currentChapter.sectionType === 'formula'
                                  ? 'bg-blue-50/60 dark:bg-slate-800/90 border-blue-200/80 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-100'
                                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5 ${
                                currentChapter.sectionType === 'formula'
                                  ? 'bg-gov-blue text-white'
                                  : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-600'
                              }`}>
                                {iIdx + 1}
                              </span>
                              <span className='flex-1 leading-relaxed font-medium text-slate-800 dark:text-slate-200'>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {!currentChapter.items && currentChapter.content && (
                      <p className='whitespace-pre-line text-slate-800 dark:text-slate-200'>{currentChapter.content}</p>
                    )}
                  </div>

                  {/* Takeaway Box */}
                  <div className='p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-200 text-xs space-y-1'>
                    <div className='flex items-center space-x-1.5 font-bold'>
                      <ShieldCheck className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
                      <span>{isHi ? 'संवर्ग गुणवत्ता सत्यापन' : 'Cadre Verification Checkpoint'}</span>
                    </div>
                    <p className='text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed'>
                      {isHi
                        ? 'इस अध्याय को पूर्ण करने से आपकी दक्षता में वृद्धि दर्ज होगी और संवर्ग प्रगति मीटर उन्नत होगा।'
                        : 'Advancing through this chapter validates your understanding against official MoSPI cadre specifications.'
                      }
                    </p>
                  </div>
                </div>

                {/* Chapter Action Footer */}
                <div className='pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between'>
                  <div className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                    {isHi ? `अध्याय ${activeChapterIndex + 1} / ${totalChapters}` : `Chapter ${activeChapterIndex + 1} of ${totalChapters}`}
                  </div>

                  <button
                    onClick={handleCompleteChapter}
                    disabled={isProcessing}
                    className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center space-x-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer'
                  >
                    {isProcessing ? (
                      <span>{isHi ? 'प्रगति सहेजी जा रही है...' : 'Saving Progress...'}</span>
                    ) : (
                      <>
                        <span>
                          {activeChapterIndex === totalChapters - 1
                            ? (isHi ? 'पाठ्यक्रम पूर्ण करें एवं प्रमाण पत्र पाएं (+25%)' : 'Complete Course & Issue Certificate (+25%)')
                            : (isHi ? 'अध्याय पूर्ण करें एवं अगला पढ़ें (+25%)' : 'Mark Complete & Next (+25%)')}
                        </span>
                        <ArrowRight className='w-4 h-4' />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
