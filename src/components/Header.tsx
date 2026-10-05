'use client';

import React from 'react';
import { GitPullRequest, Plus, MessageSquareShare, Sparkles, Clock, Globe } from 'lucide-react';

interface HeaderProps {
  onOpenCheckIn: () => void;
  onOpenSlackExport: () => void;
  standupsCount: number;
  blockersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCheckIn,
  onOpenSlackExport,
  standupsCount,
  blockersCount,
}) => {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Branding & Team Info */}
        <div className="flex items-center gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <GitPullRequest className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                AsyncStandup Hub
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Remote Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Engineering Core Team</span>
              <span>•</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{todayFormatted}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick Stats & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status summary tag */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
            <Globe className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-slate-600 dark:text-slate-300">
              4 Timezones (UTC-8 ~ UTC+9)
            </span>
          </div>

          {/* Export to Slack button */}
          <button
            onClick={onOpenSlackExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <MessageSquareShare className="h-4 w-4 text-emerald-500" />
            <span>Slack Export</span>
          </button>

          {/* Post Standup Check-in button */}
          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Today's Standup</span>
          </button>
        </div>
      </div>
    </header>
  );
};
