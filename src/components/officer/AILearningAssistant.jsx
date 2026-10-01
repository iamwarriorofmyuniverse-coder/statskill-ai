import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { api } from "../../services/api.js";
import {
  getSkillGaps,
  getRecommendations,
  getUploadedMaterials
} from "../../services/firestoreService.js";
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  BookOpen,
  Target,
  GraduationCap,
  ShieldCheck,
  BrainCircuit,
  CheckCircle2,
  UserCheck,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Layers,
  HelpCircle,
  Award
} from "lucide-react";

// Helper to format bold markdown, bullet lists, and paragraphs cleanly for dark/light themes
function FormattedMessage({ content }) {
  if (!content) return null;

  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-xs leading-relaxed text-slate-800 dark:text-slate-100">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Bullet point line
        if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
          const bulletText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start space-x-2 pl-1.5 my-1">
              <span className="text-gov-blue dark:text-sky-400 font-bold shrink-0 mt-0.5">•</span>
              <span className="flex-1 text-slate-800 dark:text-slate-200">
                {renderBoldSpans(bulletText)}
              </span>
            </div>
          );
        }

        // Regular paragraph line
        return (
          <p key={idx} className="text-slate-800 dark:text-slate-200">
            {renderBoldSpans(line)}
          </p>
        );
      })}
    </div>
  );
}

function renderBoldSpans(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={i} className="font-extrabold text-slate-900 dark:text-white">
          {boldContent}
        </strong>
      );
    }
    return part;
  });
}

export default function AILearningAssistant({ setCurrentTab, onLaunchQuiz }) {
  const { currentUser, officerProfile } = useAuth();
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const defaultWelcome = isHi
    ? `नमस्ते, **${officerProfile?.fullName || "सांख्यिकी अधिकारी"}**! मैं आपका **स्टेटस्किल एआई संवर्ग अध्ययन सहायक** हूँ, जो जेमिनी इंटरैक्शन मॉडल द्वारा संचालित है।\n\nआपके संवर्ग का विवरण:\n- **पद एवं विभाग:** ${t(officerProfile?.designation || "सांख्यिकी अधिकारी")}, ${officerProfile?.department || "आधिकारिक सांख्यिकी"}\n- **मुख्य लक्ष्य:** पहचाने गए कौशल अंतरालों को पाटना, एनएसएसओ/एएसआई/पीएलएफएस कार्यप्रणाली को समझना, और iGOT कर्मयोगी पाठ्यक्रमों की तैयारी।\n\nआज आपकी सांख्यिकीय अध्ययन यात्रा में मैं किस प्रकार सहायता कर सकता हूँ?`
    : `Namaste, **${officerProfile?.fullName || currentUser?.displayName || "Ananya Sharma"}**! I am your **StatSkill AI Cadre Learning Assistant**, powered by server-side Gemini intelligence.\n\nI have loaded your active cadre context:\n- **Role & Dept:** ${officerProfile?.designation || "Statistical Officer"}, ${officerProfile?.department || "Official Statistics"}\n- **Core Focus:** Bridging diagnosed skill gaps, explaining statistical survey concepts (NSSO, ASI, PLFS), navigating iGOT Karmayogi courses, and preparing for practice reassessments.\n\nHow may I assist your statistical learning journey today?`;

  const [messages, setMessages] = useState([
    {
      id: "welcome-msg",
      role: "assistant",
      content: defaultWelcome,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loadingContext, setLoadingContext] = useState(true);
  const messagesEndRef = useRef(null);

  // Speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    async function loadOfficerContext() {
      setLoadingContext(true);
      try {
        const uid = currentUser?.uid || "officer_ananya_001";
        const [gaps, recs, mats] = await Promise.all([
          getSkillGaps(uid),
          getRecommendations(uid),
          getUploadedMaterials()
        ]);
        setSkillGaps(gaps || []);
        setRecommendations(recs || []);
        setMaterials(mats || []);
      } catch (err) {
        console.error("Context load error:", err);
      } finally {
        setLoadingContext(false);
      }
    }
    loadOfficerContext();
  }, [currentUser]);

  // Speech Recognition hook
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = isHi ? "hi-IN" : "en-IN";

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputQuery((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };
      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, [isHi]);

  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert(isHi ? "आपका ब्राउज़र ध्वनि पहचान का समर्थन नहीं करता है।" : "Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.lang = isHi ? "hi-IN" : "en-IN";
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Could not start speech recognition:", err);
        setIsListening(false);
      }
    }
  };

  // Text-to-Speech state
  const [speakingMsgId, setSpeakingMsgId] = useState(null);

  const handleToggleSpeak = (msgId, text) => {
    if (!('speechSynthesis' in window)) {
      alert(isHi ? "आपका ब्राउज़र टेक्स्ट-टू-स्पीच का समर्थन नहीं करता है।" : "Text-to-speech is not supported in this browser.");
      return;
    }
    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const clean = (text || "").replace(/[*#_`]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = isHi ? "hi-IN" : "en-IN";
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsTyping(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== "welcome-msg")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }]
        }));

      const response = await api.askAssistantChat({
        question: text,
        chatHistory,
        officerProfile,
        skillGaps,
        recommendations,
        materialsCount: materials.length,
        language: isHi ? "hi" : "en"
      });

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer || (isHi ? "मुझे उत्तर देने में कठिनाई हो रही है।" : "I apologize, but I could not formulate a response at this moment."),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingScore: response.groundingScore,
        suggestedActions: response.suggestedActions || []
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat response error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: isHi
            ? "⚠️ एआई ट्यूटर से कनेक्ट करने में त्रुटि। कृपया पुनः प्रयास करें।"
            : "⚠️ I encountered an error connecting to the AI assistant service. Please retry.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome-msg-reset",
        role: "assistant",
        content: defaultWelcome,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
    ]);
  };

  const quickPrompts = isHi ? [
    { icon: Target, title: "शीर्ष कौशल अंतराल पाटें", query: "मेरे शीर्ष कौशल अंतराल क्या हैं और मुझे पहले किस पर ध्यान देना चाहिए?" },
    { icon: GraduationCap, title: "iGOT पाठ्यक्रमों की अनुशंसा", query: "मेरे वरिष्ठ सांख्यिकी विश्लेषक लक्ष्य के लिए कौन से iGOT पाठ्यक्रम उपयुक्त हैं?" },
    { icon: BookOpen, title: "स्तरीकृत बनाम पीपीएस प्रतिचयन", query: "एनएसएसओ सर्वेक्षणों में स्तरीकृत प्रतिचयन और संभाव्यता आनुपातिक आकार (PPS) में क्या अंतर है?" },
    { icon: ShieldCheck, title: "डीपीडीपी अधिनियम 2023 अनुपालन", query: "डीपीडीपी अधिनियम 2023 के तहत आधिकारिक सांख्यिकी में माइक्रोडाटा अनामीकरण के प्रमुख नियम क्या हैं?" },
    { icon: BrainCircuit, title: "अभ्यास प्रश्नोत्तरी स्कोर सुधारें", query: "पायथन और सांख्यिकीय डेटा शोधन में अभ्यास प्रश्नोत्तरी स्कोर कैसे सुधारें?" }
  ] : [
    { icon: Target, title: "Bridge My Top Skill Gap", query: "What are my top skill gaps and what should I focus on first to advance my career milestone?" },
    { icon: GraduationCap, title: "Recommend iGOT Courses", query: "Which iGOT Karmayogi accredited courses directly bridge my Senior Statistical Analyst gaps?" },
    { icon: BookOpen, title: "Explain Stratified vs PPS Sampling", query: "Explain Stratified Sampling vs Probability Proportional to Size (PPS) sampling in NSS rounds." },
    { icon: ShieldCheck, title: "DPDP Act 2023 Compliance", query: "Explain microdata anonymization and consent protocols under DPDP Act 2023 for MoSPI official releases." },
    { icon: BrainCircuit, title: "Improve Practice Quiz Score", query: "Provide high-yield study tips to improve my diagnostic score in Python for Official Statistics and SQL." }
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <Bot className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "संवर्ग अध्ययन एवं संदर्भ सहायक" : "Cadre Intelligence & Learning Assistant"}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            {isHi ? "स्टेटस्किल एआई अध्ययन सहायक" : "StatSkill AI Learning Assistant"}
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? "MoSPI दिशानिर्देश, सांख्यिकीय सर्वेक्षण कार्यप्रणाली और अनुशंसित पाठ्यक्रमों पर 24/7 संवादात्मक मार्गदर्शन।"
              : "24/7 conversational assistance grounded in MoSPI guidelines, statistical methodology, and your personalized competency profile."
            }
          </p>
        </div>

        <button
          onClick={clearChat}
          className="px-3.5 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{isHi ? "चैट साफ़ करें" : "Clear Chat"}</span>
        </button>
      </div>

      {/* Top Quick Inquiries & Practical Prompts */}
      <div className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-xl border border-slate-800 p-4 shadow-sm">
        <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{isHi ? "त्वरित पूछताछ एवं व्यावहारिक संकेत:" : "Quick Inquiries & Practical Prompts:"}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {quickPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(qp.query)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white dark:text-slate-100 border border-white/15 dark:border-slate-700/60 text-xs font-semibold flex items-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
              >
                <Icon className="w-3.5 h-3.5 text-sky-300" />
                <span>{qp.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Feed Container */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                msg.role === "user"
                  ? "bg-gov-blue text-white"
                  : "bg-blue-100 dark:bg-slate-800 text-gov-blue dark:text-sky-300 border border-blue-200 dark:border-slate-700"
              }`}>
                {msg.role === "user" ? <UserCheck className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="flex flex-col max-w-[85%]">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {msg.role === "user" ? (officerProfile?.fullName || "Officer") : "StatSkill AI"}
                    </span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {msg.role === "assistant" && !msg.isError && (
                    <button
                      type="button"
                      onClick={() => handleToggleSpeak(msg.id, msg.content)}
                      title={speakingMsgId === msg.id ? (isHi ? "ऑडियो बंद करें" : "Stop voice playback") : (isHi ? "ऑडियो सुनें (Multimodal Voice)" : "Listen to audio response (Multimodal Voice)")}
                      className="p-1 rounded hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-gov-blue dark:hover:text-sky-400 transition-colors cursor-pointer flex items-center space-x-1"
                    >
                      {speakingMsgId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                          <span className="text-[10px] text-red-500 font-bold">{isHi ? "रोकें" : "Stop"}</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{isHi ? "सुनें" : "Listen"}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <div className={`rounded-xl p-4 shadow-xs transition-colors ${
                  msg.role === "user"
                    ? "bg-gov-blue text-white"
                    : msg.isError
                    ? "bg-red-50 dark:bg-red-950/80 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800"
                    : "bg-white dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80"
                }`}>
                  <FormattedMessage content={msg.content} />

                  {msg.role === "assistant" && !msg.isError && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-700/60">
                      <button
                        onClick={() => onLaunchQuiz ? onLaunchQuiz("comp-stat-01") : setCurrentTab("practice-quiz")}
                        className="px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-gov-blue dark:text-sky-300 border border-blue-200 dark:border-sky-800 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <BrainCircuit className="w-3 h-3 text-gov-accent" />
                        <span>{isHi ? "🎯 अभ्यास क्विज लें" : "🎯 Take Practice Quiz"}</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab("learning")}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3 h-3 text-emerald-500" />
                        <span>{isHi ? "📘 iGOT पाठ्यक्रम" : "📘 iGOT Courses"}</span>
                      </button>
                      <button
                        onClick={() => setCurrentTab("dashboard")}
                        className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Layers className="w-3 h-3 text-gov-blue" />
                        <span>{isHi ? "📊 रडार चार्ट देखें" : "📊 View Radar"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-gov-blue dark:text-sky-300 border border-blue-200 dark:border-slate-700">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shadow-xs flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-gov-blue dark:bg-sky-400 animate-ping" />
                <span>{isHi ? "एआई सहायक आधिकारिक संदर्भ का विश्लेषण कर रहा है..." : "AI Assistant is analyzing official statistical context..."}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Listening Indicator */}
        {isListening && (
          <div className="px-5 py-2 bg-red-50 dark:bg-red-950/70 border-t border-red-200 dark:border-red-800 text-xs text-red-900 dark:text-red-300 flex items-center justify-between animate-pulse">
            <span className="font-bold flex items-center space-x-2">
              <Mic className="w-4 h-4 text-red-600 animate-bounce" />
              <span>{t("listening")}</span>
            </span>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className="px-2.5 py-0.5 bg-red-600 text-white rounded text-[10px] font-bold"
            >
              {isHi ? "रोकें" : "Stop"}
            </button>
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? t("stopListening") : t("speakQuery")}
            className={`p-2.5 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
              isListening
                ? "bg-red-600 text-white shadow-md animate-pulse"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-gov-blue dark:text-sky-400" />}
          </button>

          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder={isHi ? "सांख्यिकी, पाठ्यक्रम अथवा करियर संबंधी प्रश्न पूछें..." : "Ask questions about survey design, DPDP Act, Python, SQL, or learning paths..."}
            className="flex-1 px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:outline-hidden focus:border-gov-blue dark:focus:border-sky-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping || !inputQuery.trim()}
            className="px-4 py-2.5 bg-gov-blue hover:bg-gov-navy dark:bg-sky-600 dark:hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors shrink-0"
          >
            <span>{t("send")}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
