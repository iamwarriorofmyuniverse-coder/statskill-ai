import React, { useState, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";
import {
  Upload,
  FileText,
  FileCode,
  FileCheck,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  CheckCircle2,
  BookOpen,
  FolderOpen
} from "lucide-react";
import { SAMPLE_TRAINING_MATERIALS } from "../../data/trainerSampleMaterials.js";

export default function TrainerUpload({ onMaterialReady }) {
  const { language, t } = useLanguage();
  const isHi = language === "hi";

  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("txt");
  const [domain, setDomain] = useState("Statistical");
  const [competency, setCompetency] = useState("Survey Design");
  const [isDragging, setIsDragging] = useState(false);
  const [loadingExtraction, setLoadingExtraction] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  // Handle Drag Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Manual File Pick
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Process File Client-Side / Server-Side
  const processFile = async (file) => {
    setErrorMsg("");
    setSelectedFile(file);
    setFileName(file.name);
    const ext = file.name.split(".").pop().toLowerCase();
    setFileType(ext);

    // Auto-detect domain/competency hints from filename
    if (file.name.toLowerCase().includes("python") || file.name.toLowerCase().includes("sql")) {
      setDomain("Technical");
      setCompetency("Python");
    } else if (file.name.toLowerCase().includes("privacy") || file.name.toLowerCase().includes("dpdp")) {
      setDomain("Digital Governance");
      setCompetency("Data Privacy");
    } else if (file.name.toLowerCase().includes("sample") || file.name.toLowerCase().includes("sampling")) {
      setDomain("Statistical");
      setCompetency("Sampling");
    }

    setLoadingExtraction(true);
    try {
      if (ext === "txt" || ext === "md" || ext === "csv") {
        // Plain text read directly
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target.result;
          setExtractedText(text);
          setLoadingExtraction(false);
        };
        reader.onerror = () => {
          setErrorMsg("Failed to read text file locally.");
          setLoadingExtraction(false);
        };
        reader.readAsText(file);
      } else {
        // PDF or DOCX: send to server text extraction endpoint
        const formData = new FormData();
        formData.append("file", file);
        formData.append("domain", domain);
        formData.append("competency", competency);

        const res = await fetch("/api/trainer/upload-material", {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          setExtractedText(data.extractedText || "");
        } else {
          setErrorMsg(data.error || "Failed to extract text from document.");
        }
        setLoadingExtraction(false);
      }
    } catch (err) {
      console.error("Extraction error:", err);
      setErrorMsg("Error processing document: " + err.message);
      setLoadingExtraction(false);
    }
  };

  // Quick-load Sample Document
  const handleLoadSample = (sample) => {
    setSelectedFile(null);
    setFileName(sample.fileName);
    setFileType(sample.fileType);
    setExtractedText(sample.content);
    setDomain(sample.domain);
    setCompetency(sample.competency);
    setErrorMsg("");
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  const handleProceed = () => {
    if (!extractedText || extractedText.trim().length < 50) {
      setErrorMsg("Training text must be at least 50 characters long to generate MCQs.");
      return;
    }

    onMaterialReady({
      fileName: fileName || "Pasted Material.txt",
      fileType: fileType || "txt",
      text: extractedText,
      domain,
      competency,
      wordCount,
      charCount,
      rawFile: selectedFile
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-blue dark:text-sky-400">
            <Upload className="w-5 h-5 text-gov-accent" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHi ? "चरण 1: प्रशिक्षण सामग्री अपलोड एवं पाठ निष्कर्षण" : "Step 1: Upload & Extract Training Material"}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {isHi ? "प्रशिक्षण दस्तावेज़ अंतर्ग्रहण एवं टेक्स्ट पार्सर" : "Training Document Ingestion & Text Parser"}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            {isHi
              ? "सत्यापित प्रश्न निर्माण हेतु आधिकारिक MoSPI नियमावली, परिपत्र एवं पाठ्यक्रम दिशानिर्देश (PDF, DOCX, TXT) अपलोड करें।"
              : "Ingest official MoSPI manuals, circulars, and course guidelines (PDF, DOCX, TXT) for grounded question generation."
            }
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
          <FileCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t("supportedFormats")}</span>
        </div>
      </div>

      {/* Preset MoSPI Official Training Materials */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-gov-blue dark:text-sky-400" />
            <span>{t("presetManualsTitle")}</span>
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{isHi ? "तत्काल एआई निर्माण हेतु तैयार" : "Ready for instant AI generation"}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_TRAINING_MATERIALS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                fileName === sample.fileName
                  ? "bg-white dark:bg-slate-900 border-gov-blue ring-2 ring-blue-200 dark:ring-sky-800 shadow-xs"
                  : "bg-white/80 hover:bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-sky-950 text-gov-blue dark:text-sky-300 border border-blue-200 dark:border-sky-800">
                  {t(sample.domain, sample.domain)}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">.{sample.fileType}</span>
              </div>
              <strong className="block text-xs font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                {sample.fileName}
              </strong>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-gov-blue bg-blue-50/80 dark:bg-sky-950/40 scale-[1.005]"
            : "border-slate-300 dark:border-slate-700 hover:border-gov-blue/60 dark:hover:border-sky-500/60 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.doc,.md"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-100/80 dark:bg-slate-800 text-gov-blue dark:text-sky-400 flex items-center justify-center shadow-xs">
            {loadingExtraction ? (
              <RefreshCw className="w-7 h-7 animate-spin text-gov-blue dark:text-sky-400" />
            ) : selectedFile ? (
              <FileCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Upload className="w-7 h-7 text-gov-blue dark:text-sky-400" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedFile ? selectedFile.name : t("dragDropManuals")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isHi
                ? "मंत्रालय नियमावली पीडीएफ, वर्ड फाइलें (.docx) अथवा सादा टेक्स्ट (.txt) समर्थित"
                : "Supports Ministry manual PDFs, Word guidelines (.docx), or plain text (.txt)"
              }
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 pt-1">
            <button
              type="button"
              className="px-4 py-1.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isHi ? "फ़ाइलें चुनें" : "Browse Local Files"}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Extracted Text Preview & Metadata Editor */}
      {extractedText && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-gov-blue dark:text-sky-400" />
                <span>{isHi ? "निष्कर्षित सामग्री एवं प्रशिक्षण मेटाडेटा" : "Extracted Content & Training Metadata"}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi
                  ? "जेमिनी एमसीक्यू निर्माण प्रारंभ करने से पूर्व दस्तावेज़ से निष्कर्षित पाठ का सत्यापन करें।"
                  : "Verify the text extracted from the document before launching Gemini MCQ generation."
                }
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-600 dark:text-slate-300">
              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                {wordCount} {isHi ? "शब्द" : "Words"}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded font-mono text-[11px] border border-slate-200 dark:border-slate-700">
                {charCount} {isHi ? "अक्षर" : "Characters"}
              </span>
            </div>
          </div>

          {/* Classification Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("selectDomainPrompt")}</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none"
              >
                <option value="Statistical">{t("Statistical")}</option>
                <option value="Technical">{t("Technical")}</option>
                <option value="Digital Governance">{t("Digital Governance")}</option>
                <option value="Behavioural & Managerial">{t("Behavioural & Managerial")}</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">{t("selectCompPrompt")}</label>
              <select
                value={competency}
                onChange={(e) => setCompetency(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none"
              >
                <option value="Survey Design">{t("Survey Design")}</option>
                <option value="Sampling">{t("Sampling")}</option>
                <option value="Data Quality">{t("Data Quality")}</option>
                <option value="Official Statistics">{t("Official Statistics")}</option>
                <option value="Python">{t("Python")}</option>
                <option value="SQL">{t("SQL")}</option>
                <option value="Data Visualization">{t("Data Visualization")}</option>
                <option value="Data Privacy">{t("Data Privacy")}</option>
                <option value="Cybersecurity">{t("Cybersecurity")}</option>
                <option value="Ethics">{t("Ethics")}</option>
                <option value="Communication">{t("Communication")}</option>
              </select>
            </div>
          </div>

          {/* Text Editor / Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {isHi ? "निष्कर्षित प्रशिक्षण सामग्री (संपादन योग्य)" : "Extracted Training Text (Editable)"}
            </label>
            <textarea
              rows={8}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder={isHi ? "प्रशिक्षण सामग्री यहाँ पेस्ट करें या संपादित करें..." : "Paste or edit training text here..."}
              className="w-full p-3 font-mono text-xs text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-gov-blue dark:focus:ring-sky-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Action CTA */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleProceed}
              className="px-6 py-2.5 bg-gov-blue hover:bg-gov-navy text-white text-xs font-bold rounded-lg shadow-sm flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-gov-sky" />
              <span>{t("ingestAndGenerate")}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
