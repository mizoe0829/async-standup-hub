'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BlockerRadar } from '@/components/BlockerRadar';
import { StandupCard } from '@/components/StandupCard';
import { StandupModal } from '@/components/StandupModal';
import { SlackExportModal } from '@/components/SlackExportModal';
import { Standup } from '@/types';
import { Users, Globe, Clock, Filter, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function StandupsPage() {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isSlackExportOpen, setIsSlackExportOpen] = useState(false);
  const [workStyleFilter, setWorkStyleFilter] = useState<'all' | 'remote' | 'tokyo' | 'blocked'>('all');

  // Resolve current user as Ken Mizoe (@mizoe0829)
  const currentUser =
    standups.map((s) => s.user).find((u) => u.githubUsername === 'mizoe0829') ||
    standups.find((s) => s.user.name.includes('Ken Mizoe') || s.user.name.includes('溝江'))?.user ||
    standups[0]?.user;

  const currentUserId = currentUser?.id || '';

  // Fetch standups from API
  const fetchStandups = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/standups');
      const data = await res.json();
      if (data.standups) {
        setStandups(data.standups);
      }
    } catch (err) {
      console.error('Failed to load standups', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandups();
  }, []);

  // Handle new standup submission for Ken Mizoe
  const handleSubmitStandup = async (formData: {
    yesterday: string;
    today: string;
    blockers: string;
    mood: string;
  }) => {
    try {
      if (!currentUser) return;
      const res = await fetch('/api/standups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          yesterday: formData.yesterday,
          today: formData.today,
          blockers: formData.blockers,
          mood: formData.mood,
        }),
      });

      if (res.ok) {
        await fetchStandups();
      }
    } catch (err) {
      console.error('Failed to submit standup', err);
    }
  };

  // Handle reaction click
  const handleReact = async (standupId: string) => {
    // Optimistic UI update
    setStandups((prev) =>
      prev.map((s) => (s.id === standupId ? { ...s, reactions: s.reactions + 1 } : s))
    );

    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ standupId }),
      });
    } catch (err) {
      console.error('Failed to react', err);
    }
  };

  // Handle adding comment to standup as Ken Mizoe
  const handleAddComment = async (standupId: string, content: string) => {
    if (!currentUser) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          standupId,
          userId: currentUser.id,
          content,
        }),
      });

      if (res.ok) {
        await fetchStandups();
      }
    } catch (err) {
      console.error('Failed to add comment', err);
    }
  };

  const filteredStandups = standups
    .filter((s) => {
      if (workStyleFilter === 'remote') return s.user.location.includes('地方') || s.user.location.includes('リモート');
      if (workStyleFilter === 'tokyo') return s.user.location.includes('東京') || s.user.location.includes('本社');
      if (workStyleFilter === 'blocked') return s.hasBlocker;
      return true;
    })
    .sort((a, b) => {
      // Pin current user (Ken Mizoe) to the top of the feed for clear personal perspective
      const isA = a.user.githubUsername === 'mizoe0829' || a.userId === currentUser?.id;
      const isB = b.user.githubUsername === 'mizoe0829' || b.userId === currentUser?.id;
      if (isA && !isB) return -1;
      if (!isA && isB) return 1;
      return 0;
    });

  const blockersCount = standups.filter((s) => s.hasBlocker).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Navigation */}
      <Header
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenSlackExport={() => setIsSlackExportOpen(true)}
        standupsCount={standups.length}
        blockersCount={blockersCount}
        currentUser={currentUser}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Blocker Radar Banner */}
        <BlockerRadar
          standups={standups}
          onSelectStandup={(id) => {
            const el = document.getElementById(`standup-${id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Filter and View Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-500" />
              <span>本日の非同期スタンドアップ共有</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {standups.length}名 連携完了
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Work Style Filter */}
            <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              {(
                [
                  { id: 'all', label: '全メンバー' },
                  { id: 'remote', label: '地方フルリモート' },
                  { id: 'tokyo', label: '東京本社' },
                  { id: 'blocked', label: '要サポート' },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setWorkStyleFilter(r.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    workStyleFilter === r.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Refresh */}
            <button
              onClick={fetchStandups}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm"
              title="データを再読み込み"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-indigo-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Standup Feed */}
        <div className="space-y-5">
          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              スタンドアップデータを取得中...
            </div>
          ) : filteredStandups.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              選択されたフィルターに一致するスタンドアップはありません。
            </div>
          ) : (
            filteredStandups.map((standup) => (
              <StandupCard
                key={standup.id}
                standup={standup}
                currentUserId={currentUserId}
                isCurrentUser={standup.user.githubUsername === 'mizoe0829' || standup.userId === currentUser?.id}
                onReact={handleReact}
                onAddComment={handleAddComment}
              />
            ))
          )}
        </div>
      </main>

      {/* Check-In Modal with GitHub Sync */}
      <StandupModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmit={handleSubmitStandup}
        githubUsername="mizoe0829"
      />

      {/* Slack Export Modal */}
      <SlackExportModal
        isOpen={isSlackExportOpen}
        onClose={() => setIsSlackExportOpen(false)}
        standups={standups}
      />
    </div>
  );
}
