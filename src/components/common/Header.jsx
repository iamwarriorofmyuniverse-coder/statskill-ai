import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { LogOut, User, ShieldCheck, Award, Bell, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

export default function Header({ toggleMobileSidebar }) {
  const { currentUser, officerProfile, logout, setRoleModalOpen } = useAuth();
  const { t } = useLanguage();

  const isOfficer = currentUser?.role === "OFFICER";
  const isTrainer = currentUser?.role === "TRAINER";

  return (
    <header className="bg-gov-navy dark:bg-slate-900 text-white border-b-4 border-gov-saffron sticky top-0 z-40 shadow-md transition-colors duration-200">
      {/* Official Government of India / MoSPI Masthead Strip */}
      <div className="bg-slate-950/80 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-1 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-200">{t("govMasthead")}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-slate-400">
            <span>{t("govMastheadSih")}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-medium">{t("govMastheadNssta")}</span>
          </div>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* National Emblem & Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-7 h-7 text-gov-sky" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wide text-white">{t("appTitle", "StatSkill AI")}</span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                {t("appSubtitle", "Competency Intelligence & Personalized Learning Platform")}
              </p>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Bilingual En / हि Switcher */}
          <LanguageToggle />

          {/* Dark / Light / System Auto Theme Toggle */}
          <ThemeToggle />

          {currentUser && (
            <div className="flex items-center space-x-3">
              {/* Role badge */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-white leading-tight">
                  {isOfficer ? (officerProfile?.fullName || currentUser.displayName) : currentUser.displayName}
                </span>
                <span className="text-xs text-slate-300 flex items-center space-x-1">
                  {isOfficer && (
                    <>
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>{officerProfile?.designation || t("statisticalOfficer", "Statistical Officer")}</span>
                    </>
                  )}
                  {isTrainer && (
                    <>
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{t("authorizedFaculty", "Authorized Faculty")}</span>
                    </>
                  )}
                </span>
              </div>

              {/* Avatar */}
              <img
                src={currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                alt={currentUser.displayName}
                className="w-9 h-9 rounded-full border-2 border-gov-accent/60 object-cover"
              />

              {/* Role Indicator Pill */}
              <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                isOfficer
                  ? "bg-blue-900/80 text-blue-200 border border-blue-500/40"
                  : "bg-emerald-900/80 text-emerald-200 border border-emerald-500/40"
              }`}>
                {isOfficer ? t("officer", "OFFICER") : isTrainer ? t("trainer", "TRAINER") : currentUser.role || t("guest", "GUEST")}
              </span>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Logout from session"
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1 text-xs cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">{t("logout", "Logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
