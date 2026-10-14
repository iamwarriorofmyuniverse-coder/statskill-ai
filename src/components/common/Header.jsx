import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLanguage } from "../../context/LanguageContext.jsx";
import { LogOut, User, ShieldCheck, Award, Bell, Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";
import LanguageToggle from "./LanguageToggle.jsx";

import InstallAppButton from "./InstallAppButton.jsx";

export default function Header({ toggleMobileSidebar }) {
  const { currentUser, officerProfile, logout, setRoleModalOpen } = useAuth();
  const { t } = useLanguage();

  const isOfficer = currentUser?.role === "OFFICER";
  const isTrainer = currentUser?.role === "TRAINER";
  const isGoogleUser = currentUser?.email && currentUser.email.includes("@") && !currentUser.uid?.startsWith("google_officer_demo");

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
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg focus:outline-none shrink-0"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* National Emblem & Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1.5 shadow-inner shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 text-gov-sky" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-bold text-sm sm:text-lg tracking-wide text-white truncate">{t("appTitle", "StatSkill AI")}</span>
              </div>
              <p className="text-[11px] text-slate-300 hidden md:block truncate max-w-xs lg:max-w-md">
                {t("appSubtitle", "Competency Intelligence & Personalized Learning Platform")}
              </p>
            </div>
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
          {/* PWA Install Button */}
          <InstallAppButton variant="header" />

          {/* Bilingual En / हि Switcher */}
          <LanguageToggle />

          {/* Dark / Light / System Auto Theme Toggle */}
          <ThemeToggle />

          {currentUser && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Role badge */}
              <div className="hidden lg:flex flex-col items-end">
                <span className="text-sm font-semibold text-white leading-tight truncate max-w-[140px]">
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
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-gov-accent/60 object-cover shrink-0"
              />

              {/* Role Indicator Pill */}
              <span className={`hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                isOfficer
                  ? "bg-blue-900/80 text-blue-200 border border-blue-500/40"
                  : "bg-emerald-900/80 text-emerald-200 border border-emerald-500/40"
              }`}>
                {isOfficer ? t("officer", "OFFICER") : isTrainer ? t("trainer", "TRAINER") : currentUser.role || t("guest", "GUEST")}
              </span>

              {/* Google SSO Verified Indicator */}
              {isGoogleUser && (
                <span
                  title="Authenticated via Google OAuth (Verified Identity)"
                  className="hidden md:inline-flex items-center space-x-1 text-[10px] bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 px-2 py-0.5 rounded-full font-medium"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Google SSO</span>
                </span>
              )}

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Logout from session"
                className="p-1.5 sm:p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center space-x-1 text-xs cursor-pointer shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{t("logout", "Logout")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
