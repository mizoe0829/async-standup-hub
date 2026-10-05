'use client';

import React, { useState } from 'react';
import { Standup } from '../types';
import { X, Copy, Check, MessageSquareShare } from 'lucide-react';

interface SlackExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  standups: Standup[];
}

export const SlackExportModal: React.FC<SlackExportModalProps> = ({
  isOpen,
  onClose,
  standups,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  // Format into rich Slack Markdown
  const formattedSlackText = `*🚀 本日の非同期スタンドアップ共有 — ${todayStr}*
_${standups.length}名のメンバーが全国フルリモートから非同期連携中_

${standups
  .map((s) => {
    const moodIcon =
      s.mood === 'great'
        ? ':fire:'
        : s.mood === 'blocked'
        ? ':rotating_light:'
        : s.mood === 'tired'
        ? ':sleeping:'
        : ':white_check_mark:';
    const blockerText = s.hasBlocker && s.blockers ? `\n> *⚠️ 発生中のブロッカー:* ${s.blockers}` : '';

    return `*${s.user.name}* (${s.user.role} • ${s.user.location}) ${moodIcon}
*昨日の成果:*
${s.yesterday.split('\n').map((l) => `> ${l}`).join('\n')}
*今日の予定:*
${s.today.split('\n').map((l) => `> ${l}`).join('\n')}${blockerText}
`;
  })
  .join('\n---\n\n')}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedSlackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 relative overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <MessageSquareShare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Slack / Discord 向けエクスポート
              </h3>
              <p className="text-xs text-slate-400">
                引用マークダウン・絵文字・ブロッカー警告付きで整形されています。
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Text Preview */}
        <div className="flex-1 overflow-y-auto py-4">
          <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap border border-slate-800 overflow-x-auto selection:bg-indigo-500 selection:text-white">
            {formattedSlackText}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400">
            コピーしてチームの #daily-standup チャンネルに貼り付けできます
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 transition-all"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'コピー完了！' : 'Slack形式でコピー'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
