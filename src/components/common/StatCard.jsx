import React from "react";

export default function StatCard({ title, value, subtitle, icon: Icon, color = "blue", trend, cascadeClass = "" }) {
  const iconBgStyles = {
    blue: "bg-gradient-to-br from-gov-blue to-blue-700 text-white shadow-blue-500/20",
    amber: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-amber-500/20",
    emerald: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
    purple: "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/20",
    red: "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-500/20"
  };

  return (
    <div className={`group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-gov-blue/40 dark:hover:border-sky-500/40 transition-all duration-200 cursor-pointer ${cascadeClass}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1 pr-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-gov-blue dark:group-hover:text-sky-400 transition-colors">
            {title}
          </p>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:scale-105 transition-transform origin-left">
              {value}
            </h3>
            {trend && (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 flex items-center space-x-1 animate-pulse">
                <span>{trend}</span>
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-tight">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${iconBgStyles[color] || iconBgStyles.blue}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
