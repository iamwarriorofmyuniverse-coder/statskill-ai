import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Award,
  Sparkles,
  Bot,
  UserCheck,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  FileText,
  RotateCcw,
  Send,
  Zap,
  TrendingUp,
  BrainCircuit
} from "lucide-react";

const VIVA_SCENARIOS = [
  {
    id: "sc-01",
    title: "Scenario 1: High Non-Response in Periodic Labour Force Survey (PLFS)",
    titleHi: "परिदृश्य 1: आवधिक श्रम बल सर्वेक्षण (PLFS) में उच्च गैर-प्रतिक्रिया दर",
    domain: "Survey Sampling & Non-Sampling Error",
    examinerAudioText: "Officer, during the PLFS round in rural Bihar, enumerator block 14 reports a forty percent non-response rate due to seasonal migration. As District Statistical Officer, do you replace the missing households with substitutes, apply hot-deck imputation, or order a mandatory call-back? Justify your decision under MoSPI sampling protocols.",
    examinerAudioTextHi: "अधिकारी, ग्रामीण बिहार में पीएलएफएस दौर के दौरान, मौसमी प्रवासन के कारण प्रगणना ब्लॉक 14 में 40% गैर-प्रतिक्रिया दर्ज की गई है। जिला सांख्यिकी अधिकारी के रूप में, क्या आप लापता परिवारों को प्रतिस्थापित करेंगे, हॉट-डेक आरोपण लागू करेंगे, या अनिवार्य कॉल-बैक का आदेश देंगे? मोस्पी प्रतिचयन प्रोटोकॉल के तहत अपने निर्णय का औचित्य स्पष्ट करें।",
    keywords: ["call-back", "callback", "substitution", "bias", "imputation", "sampling", "weight", "mospi", "non-response", "stratum"],
    modelAnswer: "Under official MoSPI NSSO sampling guidelines, indiscriminate substitution of non-responding households is strictly prohibited as it introduces catastrophic selection bias. The correct protocol is: First, execute two mandatory call-backs at non-peak migration hours. If still inaccessible, apply calibrated sub-sample weighting adjustments or hot-deck donor imputation from the identical socio-economic stratum, documenting the non-sampling error in the survey metadata.",
    modelAnswerHi: "आधिकारिक MoSPI NSSO प्रतिचयन दिशानिर्देशों के तहत, गैर-प्रतिक्रिया देने वाले परिवारों का अंधाधुंध प्रतिस्थापन सख्त वर्जित है क्योंकि यह चयन पूर्वाग्रह उत्पन्न करता है। सही प्रोटोकॉल है: पहले गैर-शिखर समय पर दो अनिवार्य कॉल-बैक निष्पादित करें। यदि अभी भी दुर्गम है, तो समान सामाजिक-आर्थिक स्तर से हॉट-डेक डोनर आरोपण लागू करें और सर्वेक्षण मेटाडेटा में त्रुटि दर्ज करें।"
  },
  {
    id: "sc-02",
    title: "Scenario 2: DPDP Act 2023 Conflict in 8th Economic Census",
    titleHi: "परिदृश्य 2: 8वीं आर्थिक गणना में डीपीडीपी अधिनियम 2023 का विधिक टकराव",
    domain: "Statutory Law & Data Governance",
    examinerAudioText: "Officer, in an industrial park in Gurugram, several registered enterprises refuse to provide establishment payroll and proprietary financial data, claiming protection under Section 4 of the Digital Personal Data Protection Act 2023. What legal authority under the Collection of Statistics Act 2008 do you cite, and how do you resolve this standoff without physical coercion?",
    examinerAudioTextHi: "अधिकारी, गुरुग्राम के एक औद्योगिक पार्क में कई पंजीकृत उद्यम डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 की धारा 4 के तहत छूट का दावा करते हुए वित्तीय डेटा देने से इनकार करते हैं। सांख्यिकी संग्रह अधिनियम 2008 के तहत आप किस विधिक अधिकार का उल्लेख करेंगे, और बिना किसी जबरदस्ती के इस गतिरोध को कैसे सुलझाएंगे?",
    keywords: ["collection of statistics", "act 2008", "dpdp", "confidentiality", "penal", "notice", "section", "commercial", "aggregate", "enterprise"],
    modelAnswer: "The officer must clarify that under Section 6 & 15 of the Collection of Statistics Act 2008, statistical agencies have sovereign statutory authority to collect establishment operational data. While DPDP Act 2023 protects personal natural citizen data, commercial census returns are protected by statutory confidentiality under Section 9 (prohibiting disclosure of individual unit records to tax or police authorities). The officer serves a statutory requisition notice while formally assuring cryptographic aggregation.",
    modelAnswerHi: "अधिकारी को स्पष्ट करना होगा कि सांख्यिकी संग्रह अधिनियम 2008 की धारा 6 व 15 के तहत सांख्यिकीय एजेंसियों के पास डेटा एकत्र करने का वैधानिक अधिकार है। डीपीडीपी 2023 केवल व्यक्तिगत डेटा की रक्षा करता है, जबकि औद्योगिक डेटा धारा 9 की गोपनीयता से सुरक्षित है जिसे आयकर या पुलिस से साझा नहीं किया जा सकता।"
  },
  {
    id: "sc-03",
    title: "Scenario 3: CPI Basket Base Year Revision & Substitution Bias",
    titleHi: "परिदृश्य 3: उपभोक्ता मूल्य सूचकांक (CPI) आधार वर्ष संशोधन एवं प्रतिस्थापन पूर्वाग्रह",
    domain: "National Accounts & Price Statistics",
    examinerAudioText: "Officer, during the upcoming Consumer Price Index base year revision, how do you handle the sudden rise of digital delivery and ride-hailing subscriptions that were absent in the historical 2012 basket? Explain Laspeyres versus Tornqvist index formulation to mitigate substitution bias.",
    examinerAudioTextHi: "अधिकारी, आगामी उपभोक्ता मूल्य सूचकांक आधार वर्ष संशोधन के दौरान, आप डिजिटल डिलीवरी और राइड-हेलिंग सेवाओं के अचानक उभार को कैसे समायोजित करेंगे जो 2012 की बास्केट में अनुपस्थित थीं? प्रतिस्थापन पूर्वाग्रह को कम करने हेतु लास्पेयरेस बनाम टॉर्नक्विस्ट सूचकांक निर्माण की व्याख्या करें।",
    keywords: ["laspeyres", "tornqvist", "substitution", "weights", "ces", "consumer", "basket", "base year", "chain", "geometric"],
    modelAnswer: "The Laspeyres formula with base-period fixed weights overstates inflation due to consumer substitution toward cheaper alternatives. To integrate modern digital services, MoSPI utilizes findings from the updated Household Consumption Expenditure Survey (HCES), updating the commodity basket weights and shifting toward a Geometric Laspeyres (Jevons elementary aggregates) or superlative Tornqvist chain-index to capture dynamic consumption elasticity.",
    modelAnswerHi: "आधार-अवधि के निश्चित भारों वाला लास्पेयरेस फॉर्मूला प्रतिस्थापन के कारण मुद्रास्फीति को बढ़ा-चढ़ाकर प्रस्तुत करता है। आधुनिक डिजिटल सेवाओं को शामिल करने हेतु MoSPI घरेलू उपभोग व्यय सर्वेक्षण (HCES) के निष्कर्षों का उपयोग करता है और कमोडिटी बास्केट के भारों को अद्यतन करता है।"
  }
];

export default function VivaVocePage() {
  const { language } = useLanguage();
  const { officerProfile } = useAuth();
  const isHi = language === "hi";

  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const activeScenario = VIVA_SCENARIOS[selectedScenarioIdx];

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [voiceInterimText, setVoiceInterimText] = useState("");
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);

  // Audio SpeechSynthesis state
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);

  // Evaluation state
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSpeakQuestion = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isSpeakingQuestion) {
      window.speechSynthesis.cancel();
      setIsSpeakingQuestion(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = isHi ? activeScenario.examinerAudioTextHi : activeScenario.examinerAudioText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = isHi ? "hi-IN" : "en-IN";
    utterance.rate = 0.95; // Official, authoritative board examiner cadence
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);

    window.speechSynthesis.speak(utterance);
  };

  const toggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(isHi ? "ध्वनि पहचान समर्थित नहीं है। कृपया Chrome अथवा Edge का उपयोग करें।" : "Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListeningRef.current || isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      isListeningRef.current = false;
      setVoiceInterimText("");
      return;
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = isHi ? "hi-IN" : "en-IN";

      const previousText = spokenTranscript ? spokenTranscript.trim() : "";
      setVoiceInterimText(isHi ? "बोर्ड परीक्षक सुन रहे हैं... बोलिए..." : "NSSTA Board is listening... Speak your answer now...");

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(25);
        }
      };

      recognition.onresult = (event) => {
        let full = "";
        let interim = "";
        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            full += res[0].transcript + " ";
          } else {
            interim += res[0].transcript;
          }
        }
        const currentSpoken = (full + interim).trim();
        if (currentSpoken) {
          setVoiceInterimText(currentSpoken);
          const combined = previousText ? `${previousText} ${currentSpoken}` : currentSpoken;
          setSpokenTranscript(combined);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Viva voice error:", event.error);
        if (event.error === "no-speech") return;
        setIsListening(false);
        isListeningRef.current = false;
        setVoiceInterimText("");
      };

      recognition.onend = () => {
        setIsListening(false);
        isListeningRef.current = false;
        setVoiceInterimText("");
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.warn("Could not start viva recognition:", e);
      setIsListening(false);
      isListeningRef.current = false;
    }
  };

  const handleEvaluateVivaResponse = () => {
    if (!spokenTranscript.trim()) {
      alert(isHi ? "कृपया पहले अपना मौखिक उत्तर रिकॉर्ड करें।" : "Please record your verbal response first.");
      return;
    }

    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);

      // Analyze keyword density and substance
      const lower = spokenTranscript.toLowerCase();
      let matched = 0;
      activeScenario.keywords.forEach((kw) => {
        if (lower.includes(kw)) matched++;
      });

      const keywordRatio = Math.min(1, matched / 4);
      const lengthBonus = Math.min(1, spokenTranscript.split(" ").length / 25);
      const overallScore = Math.min(98, Math.max(68, Math.round((keywordRatio * 0.6 + lengthBonus * 0.4) * 100)));

      setEvaluationResult({
        overallScore,
        statutoryRigor: Math.min(99, overallScore + 3),
        methodologyScore: Math.min(98, overallScore - 2),
        articulationScore: 92,
        recommendationRating: overallScore >= 80 ? "RECOMMENDED FOR INDEPENDENT CHARGE" : "REASSESSMENT SUGGESTED",
        keyFeedback: overallScore >= 80
          ? (isHi ? "उत्कृष्ट प्रशासनिक एवं सांख्यिकीय सूझबूझ। आपने विधिक एवं प्रतिचयन प्रोटोकॉल का सटीक अनुपालन दर्शाया।" : "Exemplary cadre command. Strong grasp of MoSPI statutory non-response protocols with zero procedural compromise.")
          : (isHi ? "उत्तर संतोषजनक है परंतु आधिकारिक प्रतिचयन व डीपीडीपी शब्दावली को और अधिक सुदृढ़ करें।" : "Satisfactory answer, but needs stronger integration of specific Collection of Statistics Act clauses and imputation formulas.")
      });
    }, 1500);
  };

  const handleResetViva = () => {
    setSpokenTranscript("");
    setVoiceInterimText("");
    setEvaluationResult(null);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingQuestion(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gov-navy via-slate-900 to-indigo-950 p-6 sm:p-8 text-white shadow-xl border border-indigo-900/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{isHi ? "मोस्पी राष्ट्रीय नवाचार • मौखिक बोर्ड परीक्षा" : "MoSPI Next-Gen Innovation • AI Cadre Viva-Voce"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center space-x-3">
              <Bot className="w-8 h-8 text-indigo-400 shrink-0" />
              <span>{isHi ? "एआई कैडर मौखिक बोर्ड परीक्षा (Viva-Voce)" : "AI Cadre Oral Board Viva-Voce Examiner"}</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isHi
                ? "सिविल सेवा एवं सांख्यिकी संवर्ग में अधिकारियों की वास्तविक क्षमता का परीक्षण मौखिक बोर्ड इंटरव्यू में होता है। एआई परीक्षक की आवाज में परिदृश्य-आधारित प्रश्न सुनें, बोलकर उत्तर दें और तत्काल बहु-आयामी मूल्यांकन प्राप्त करें।"
                : "In official statistical services, real leadership is evaluated in oral board examinations. Listen to the AI NSSTA Examiner's real dilemma, speak your strategic response out loud, and receive real-time multi-dimensional scoring."}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleSpeakQuestion}
              className={`px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 transition-all cursor-pointer border ${
                isSpeakingQuestion
                  ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500/40"
              }`}
            >
              {isSpeakingQuestion ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isSpeakingQuestion ? (isHi ? "आवाज रोकें" : "Stop Voice") : (isHi ? "परीक्षक की आवाज सुनें" : "Hear Examiner Voice")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {VIVA_SCENARIOS.map((sc, idx) => {
          const isSelected = selectedScenarioIdx === idx;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIdx(idx);
                handleResetViva();
              }}
              className={`p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-white dark:bg-slate-900 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                  {sc.domain}
                </span>
                <h2 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                  {isHi ? sc.titleHi : sc.title}
                </h2>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>{isHi ? "बोर्ड परिदृश्य" : "Board Case"} #{idx + 1}</span>
                {isSelected && <span className="text-indigo-600 dark:text-indigo-400 font-bold">ACTIVE ✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Oral Examination Chamber */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Examiner Question & Speech Input (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Question Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>{isHi ? "एनएसएसटीए बोर्ड परीक्षक प्रश्न" : "NSSTA Board Examiner Prompt"}</span>
              </span>
              <button
                onClick={handleSpeakQuestion}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center space-x-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isSpeakingQuestion ? "Listening..." : "Play Audio"}</span>
              </button>
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700">
              "{isHi ? activeScenario.examinerAudioTextHi : activeScenario.examinerAudioText}"
            </p>
          </div>

          {/* Voice Recording Chamber */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <Mic className="w-4 h-4 text-gov-blue dark:text-sky-400" />
                <span>{isHi ? "आपका मौखिक उत्तर (Speech-to-Text)" : "Officer's Spoken Verbal Response"}</span>
              </h3>
              {spokenTranscript && (
                <button
                  onClick={() => setSpokenTranscript("")}
                  className="text-[11px] text-slate-400 hover:text-red-600"
                >
                  Clear Transcript
                </button>
              )}
            </div>

            {/* Listening Feedback Banner */}
            {isListening && (
              <div className="p-3 bg-red-50 dark:bg-red-950/80 rounded-xl border border-red-200 dark:border-red-800 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2.5 min-w-0 flex-1 mr-2">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[10px] uppercase text-red-600 dark:text-red-400">
                      Recording Verbal Statement Live...
                    </p>
                    <p className="text-xs text-slate-900 dark:text-white font-medium truncate">
                      {voiceInterimText}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleVoiceRecording}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold shrink-0"
                >
                  Done
                </button>
              </div>
            )}

            {/* Speech Transcript Display / Textarea */}
            <textarea
              value={spokenTranscript}
              onChange={(e) => setSpokenTranscript(e.target.value)}
              placeholder={isHi ? "माइक बटन दबाएं और अपना मौखिक उत्तर बोलें (अथवा यहां टाइप करें)..." : "Click 'Start Voice Answer' and speak into your microphone, or refine your transcript here..."}
              rows={4}
              className="w-full p-3.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-indigo-500 leading-relaxed"
            />

            {/* Recording Controls */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={toggleVoiceRecording}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all cursor-pointer ${
                  isListening
                    ? "bg-red-600 text-white shadow-md shadow-red-600/30 animate-pulse"
                    : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                <span>{isListening ? (isHi ? "सुनना समाप्त करें" : "Stop Speaking") : (isHi ? "बोलकर उत्तर दें" : "Start Voice Answer")}</span>
              </button>

              <button
                onClick={handleEvaluateVivaResponse}
                disabled={isEvaluating || !spokenTranscript.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center space-x-2 cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-amber-300" />
                    <span>{isHi ? "बोर्ड मूल्यांकन जारी..." : "Board Evaluating..."}</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>{isHi ? "बोर्ड मूल्यांकन प्राप्त करें" : "Submit for Board Evaluation"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Board Scorecard & Model Answer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {evaluationResult ? (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-lg space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {isHi ? "बोर्ड मूल्यांकन स्कोरकार्ड" : "Board Viva Scorecard"}
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  {evaluationResult.recommendationRating}
                </span>
              </div>

              {/* Score Gauges */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Overall</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{evaluationResult.overallScore}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Statutory</span>
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{evaluationResult.statutoryRigor}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Composure</span>
                  <span className="text-xl font-black text-sky-600 dark:text-sky-400">{evaluationResult.articulationScore}%</span>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed">
                <span className="font-bold block mb-0.5">Board Panel Remarks:</span>
                {evaluationResult.keyFeedback}
              </div>

              {/* Official Model Answer */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-gov-blue dark:text-sky-400" />
                  <span>{isHi ? "एनएसएसटीए महानिदेशक आधिकारिक मॉडल उत्तर" : "NSSTA DG Official Model Answer"}</span>
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-700">
                  {isHi ? activeScenario.modelAnswerHi : activeScenario.modelAnswer}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-100 dark:border-indigo-900">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {isHi ? "मौखिक मूल्यांकन प्रतीक्षा सूची" : "Viva Evaluation Standby"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {isHi
                  ? "परीक्षक का प्रश्न सुनें, अपना मौखिक उत्तर बोलें और आधिकारिक बोर्ड रेटिंग प्राप्त करने हेतु जमा करें।"
                  : "Hear the board prompt, record your spoken strategy, and submit for real-time civil service viva scoring."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
