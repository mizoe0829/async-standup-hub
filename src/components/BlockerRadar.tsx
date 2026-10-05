'use client';

import React from 'react';
import { Standup } from '../types';
import { AlertCircle, ArrowRight, ShieldAlert, Sparkles, HeartHandshake } from 'lucide-react';

interface BlockerRadarProps {
  standups: Standup[];
  onSelectStandup: (standupId: string) => void;
}

export const BlockerRadar: React.FC<BlockerRadarProps> = ({ standups, onSelectStandup }) => {
  const blockedStandups = standups.filter((s) => s.hasBlocker);

  if (blockedStandups.length === 0) {
    return (
      <div className="p-4 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              順調に進行中 — 現在ブロッカーはありません
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              全メンバーが未解決の依存関係なく、各々のリモート環境でスムーズに開発を進めています。
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
          開発好調 ⚡
        </span>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl border-2 border-rose-500/40 bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-transparent dark:bg-slate-900/90 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-500/25 animate-pulse">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                ブロッカー検知レーダー（{blockedStandups.length}件の要フォロー課題）
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white tracking-wide">
                要サポート
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              メンバーが外部権限や環境依存で作業停止しています。非同期開発では早期のアンブロックが重要です。
            </p>
          </div>
        </div>

        {/* Blocker Jump Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {blockedStandups.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectStandup(s.id)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-white dark:bg-slate-900 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 shadow-sm transition-all"
            >
              <img
                src={s.user.avatar}
                alt={s.user.name}
                className="h-5 w-5 rounded-full object-cover"
              />
              <span>{s.user.name.split(' ')[0]}さんをアンブロック</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
