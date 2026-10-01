const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '..', 'src', 'components', 'common', 'Sidebar.jsx');
let content = fs.readFileSync(sidebarPath, 'utf8');

const targetSnippet = `<div className="grid grid-cols-4 gap-1 text-[10px] text-center font-medium">
              <span className="bg-white dark:bg-slate-900 dark:text-slate-200 py-0.5 rounded shadow-xs border border-slate-200 dark:border-slate-700">1. Measure</span>
              <span className="bg-white dark:bg-slate-900 dark:text-slate-200 py-0.5 rounded shadow-xs border border-slate-200 dark:border-slate-700">2. Diagnose</span>
              <span className="bg-white dark:bg-slate-900 dark:text-slate-200 py-0.5 rounded shadow-xs border border-slate-200 dark:border-slate-700">3. Learn</span>
              <span className="bg-white dark:bg-slate-900 dark:text-slate-200 py-0.5 rounded shadow-xs border border-slate-200 dark:border-slate-700">4. Reassess</span>
            </div>`;

const replacementSnippet = `<div className="grid grid-cols-4 gap-1 text-center">
              {[
                { num: "1", label: "Measure" },
                { num: "2", label: "Diagnose" },
                { num: "3", label: "Learn" },
                { num: "4", label: "Reassess" }
              ].map((step) => (
                <div
                  key={step.num}
                  className="bg-white dark:bg-slate-900 py-1 px-0.5 rounded-md shadow-xs border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[38px]"
                >
                  <span className="text-[10px] font-bold text-gov-accent dark:text-sky-400 leading-none">{step.num}.</span>
                  <span className="text-[9px] font-semibold leading-tight mt-0.5 text-slate-700 dark:text-slate-200">{step.label}</span>
                </div>
              ))}
            </div>`;

content = content.replace(targetSnippet, replacementSnippet);
fs.writeFileSync(sidebarPath, content, 'utf8');
console.log('Sidebar.jsx alignment updated successfully');
