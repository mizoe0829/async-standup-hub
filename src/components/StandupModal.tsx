'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, AlertTriangle, GitCommit, Check, Loader2 } from 'lucide-react';

interface StandupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    yesterday: string;
    today: string;
    blockers: string;
    mood: string;
  }) => Promise<void>;
  githubUsername?: string;
}

export const StandupModal: React.FC<StandupModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  githubUsername = 'mizoe0829',
}) => {
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  const [mood, setMood] = useState('good');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  if (!isOpen) return null;

  // GitHub Auto-Sync Handler
  const handleGitHubSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      const res = await fetch(`/api/github/sync?username=${githubUsername}`);
      const data = await res.json();
      if (data.formattedMarkdown) {
        setYesterday((prev) => (prev ? `${prev}\n${data.formattedMarkdown}` : data.formattedMarkdown));
        setSyncSuccess(true);
        setTimeout(() => setSyncSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to sync from GitHub', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!yesterday.trim() || !today.trim()) {
      alert('Please fill out both Yesterday and Today sections.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        yesterday,
        today,
        blockers,
        mood,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const moods = [
    { id: 'great', label: '🔥 絶好調' },
    { id: 'good', label: '😊 順調' },
    { id: 'neutral', label: '😐 進行中' },
    { id: 'tired', label: '😴 お疲れ気味' },
    { id: 'blocked', label: '🔴 要フォロー' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-6 relative overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              本日の非同期スタンドアップを入力
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              集中作業（Deep Work）を中断することなく、非同期で進捗と予定をチームに共有します。
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-5 text-xs">
          {/* Mood Selector */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              コンディション・作業ステータス
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    mood === m.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Yesterday (with GitHub Magic Sync button) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                1. 昨日完了したこと・成果
              </label>
              {/* GitHub Magic Sync Button */}
              <button
                type="button"
                onClick={handleGitHubSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-indigo-500/10 border border-indigo-300 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-all shadow-sm"
              >
                {isSyncing ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : syncSuccess ? (
                  <Check className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Sparkles className="h-3 w-3 text-indigo-500" />
                )}
                <span>{isSyncing ? 'GitHubから取得中...' : syncSuccess ? 'GitHubから同期完了！' : 'GitHubから自動取得'}</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
              placeholder="- PR #14 をマージ（task-matrix）&#10;- モバイル表示時のモーダル内部スクロールを修正&#10;- Prisma クエリのパフォーマンス改善"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono leading-relaxed"
            />
          </div>

          {/* Today Plan */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
              2. 本日の予定・コミットメント
            </label>
            <textarea
              rows={4}
              value={today}
              onChange={(e) => setToday(e.target.value)}
              placeholder="- ブロッカー検知レーダーのUI実装&#10;- Slack通知用Webhookフォーマットの策定&#10;- 佐藤さんのDockerマルチステージPRレビュー"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono leading-relaxed"
            />
          </div>

          {/* Blockers */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-1.5 mb-2 font-semibold text-slate-700 dark:text-slate-300">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <span>3. 詰まっている点・課題（ブロッカー）※任意</span>
            </div>
            <textarea
              rows={2}
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              placeholder="順調な場合は空欄で構いません。詰まっている点や確認待ちのPR・権限があれば記載してください。"
              className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            {blockers.trim().length > 0 && (
              <p className="mt-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                ⚠️ ブロッカーを記入すると、チームの「ブロッカー検知レーダー」に即座に表示されサポートを募ることができます。
              </p>
            )}
          </div>

          {/* Footer Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isSubmitting ? '送信中...' : 'チームに共有する'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
