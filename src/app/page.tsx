'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { BlockerRadar } from '@/components/BlockerRadar';
import { StandupModal } from '@/components/StandupModal';
import { SlackExportModal } from '@/components/SlackExportModal';
import { Standup } from '@/types';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  Sparkles,
  GitPullRequest,
  GitCommit,
  CheckCircle2,
  FolderGit2,
  Users,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  MessageSquareShare,
  Layers,
  ArrowRight,
  Radio
} from 'lucide-react';

interface ProjectSummary {
  id: string;
  name: string;
  repo: string;
  category: string;
  progress: number;
  status: 'healthy' | 'blocked' | 'steady';
  lead: string;
  commitsThisWeek: number;
  openPRs: number;
  activeBlockers: number;
  description: string;
  href: string;
}

export default function GlobalDashboardPage() {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartMetric, setChartMetric] = useState<'activity' | 'hoursSaved' | 'blockers'>('activity');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isSlackExportOpen, setIsSlackExportOpen] = useState(false);

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

  const currentUser =
    standups.map((s) => s.user).find((u) => u.githubUsername === 'mizoe0829') ||
    standups.find((s) => s.user.name.includes('Ken Mizoe') || s.user.name.includes('溝江'))?.user;

  // Projects Definition
  const projects: ProjectSummary[] = [
    {
      id: 'task-matrix',
      name: 'TaskMatrix 基幹サービス',
      repo: 'mizoe0829/task-matrix',
      category: 'Core Service',
      progress: 88,
      status: 'healthy',
      lead: 'Ken Mizoe (溝江 研)',
      commitsThisWeek: 18,
      openPRs: 2,
      activeBlockers: 0,
      description: 'タスク依存関係・階層分析・分散ワークフローの全体最適化エンジン。',
      href: '/projects/task-matrix',
    },
    {
      id: 'async-standup-hub',
      name: 'AsyncStandup Hub',
      repo: 'mizoe0829/async-standup-hub',
      category: 'Productivity Tool',
      progress: 94,
      status: 'healthy',
      lead: 'Ken Mizoe (溝江 研)',
      commitsThisWeek: 24,
      openPRs: 1,
      activeBlockers: 0,
      description: '地方フルリモート＆フレックスチームのGitHub自動同期・非同期朝会ハブ。',
      href: '/projects/async-standup-hub',
    },
    {
      id: 'ec-checkout-engine',
      name: 'EC Checkout Pipeline',
      repo: 'org/ec-checkout-engine',
      category: 'Payments Engine',
      progress: 68,
      status: 'blocked',
      lead: '佐藤 葵 (Aoi Sato)',
      commitsThisWeek: 9,
      openPRs: 3,
      activeBlockers: 1,
      description: 'Svelte-EC 決済パイプライン・Stripe本番Webhook署名検証基盤。',
      href: '/projects/ec-checkout-engine',
    },
    {
      id: 'infra-core-services',
      name: 'Infra & Cloud Platform',
      repo: 'org/infra-core-services',
      category: 'DevOps & SRE',
      progress: 82,
      status: 'steady',
      lead: '田中 雄大 (Yudai Tanaka)',
      commitsThisWeek: 12,
      openPRs: 2,
      activeBlockers: 0,
      description: 'Dockerマルチステージビルド・AWS ECS Fargate・PgBouncer接続プール。',
      href: '/projects/infra-core-services',
    },
  ];

  // Weekly Activity Trend Data
  const weeklyData = [
    { day: '月', commits: 14, prs: 3, blockers: 1, hoursSaved: 2.5 },
    { day: '火', commits: 19, prs: 5, blockers: 0, hoursSaved: 3.0 },
    { day: '水', commits: 22, prs: 6, blockers: 2, hoursSaved: 3.0 },
    { day: '木', commits: 16, prs: 4, blockers: 0, hoursSaved: 3.0 },
    { day: '金 (本日)', commits: 24, prs: 7, blockers: 1, hoursSaved: 3.0 },
  ];

  const totalCommitsThisWeek = projects.reduce((acc, p) => acc + p.commitsThisWeek, 0);
  const totalOpenPRs = projects.reduce((acc, p) => acc + p.openPRs, 0);
  const totalActiveBlockers = projects.reduce((acc, p) => acc + p.activeBlockers, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Header
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenSlackExport={() => setIsSlackExportOpen(true)}
        currentUser={currentUser}
        standupsCount={standups.length}
        blockersCount={totalActiveBlockers}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-7">
        {/* Blocker Radar Banner */}
        <BlockerRadar
          standups={standups}
          onSelectStandup={() => {
            window.location.href = '/standups';
          }}
        />

        {/* Global Dashboard Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/25">
                <BarChart3 className="h-5 w-5" />
              </span>
              <span>全体エンジニアリング・ダッシュボード</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Radio className="h-3 w-3 animate-pulse text-emerald-500" />
                JST 非同期稼働中
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              同期朝会を排除し、各プロジェクトの自走度・スプリント健全性・ブロッカー解消速度をリアルタイム集約
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/standups"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all"
            >
              <MessageSquareShare className="h-4 w-4 text-indigo-500" />
              <span>スタンドアップ詳細タイムライン</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Core High-Impact KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Team Health */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">チーム健全性スコア</span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">94%</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +4.2% vs 先週
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              4名全員が非同期同期完了・高稼働を維持
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94%' }} />
            </div>
          </div>

          {/* Card 2: Meeting Time Saved */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">削減された同期MTG時間</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                14.5<span className="text-sm font-semibold text-slate-400 ml-1">時間/週</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                集中時間創出
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              毎朝のZoom朝会を非同期化し、Deep Workに転換
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Card 3: Blocker MTTR */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">平均ブロッカー解消速度 (MTTR)</span>
              <Clock className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                38<span className="text-sm font-semibold text-slate-400 ml-1">分</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowDownRight className="h-3.5 w-3.5" />
                業界平均比 -65%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              検知レーダーによりチーム内での相互アンブロックが迅速化
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          {/* Card 4: Output Velocity */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">週次開発アウトプット</span>
              <GitPullRequest className="h-4 w-4 text-cyan-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalCommitsThisWeek}
                <span className="text-sm font-semibold text-slate-400 ml-1">commits</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {totalOpenPRs} PRs
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              4プロジェクト合計のGitHubプッシュ・マージ実績
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Activity & Velocity Trend Chart */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <span>週次アウトプット＆非同期アクティビティ推移</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                月曜から金曜にかけてのコミット量・マージ済みPR数・創出された集中時間の推移
              </p>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setChartMetric('activity')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartMetric === 'activity'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                コミット・PR量
              </button>
              <button
                onClick={() => setChartMetric('hoursSaved')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartMetric === 'hoursSaved'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                削減MTG時間
              </button>
              <button
                onClick={() => setChartMetric('blockers')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  chartMetric === 'blockers'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ブロッカー発生
              </button>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="grid grid-cols-5 gap-3 sm:gap-6 pt-4 pb-2 items-end h-52 border-b border-slate-100 dark:border-slate-800">
            {weeklyData.map((item) => {
              const heightPercent =
                chartMetric === 'activity'
                  ? Math.min(100, (item.commits / 25) * 100)
                  : chartMetric === 'hoursSaved'
                  ? (item.hoursSaved / 3.5) * 100
                  : Math.max(15, item.blockers * 45);

              const barColor =
                chartMetric === 'activity'
                  ? 'bg-gradient-to-t from-indigo-600 to-cyan-400'
                  : chartMetric === 'hoursSaved'
                  ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                  : item.blockers > 0
                  ? 'bg-gradient-to-t from-rose-600 to-rose-400'
                  : 'bg-emerald-500';

              return (
                <div key={item.day} className="flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 dark:bg-slate-800 text-white px-2 py-1 rounded-lg shadow-lg font-mono text-center pointer-events-none mb-1">
                    {chartMetric === 'activity'
                      ? `${item.commits} commits / ${item.prs} PRs`
                      : chartMetric === 'hoursSaved'
                      ? `${item.hoursSaved}h 削減`
                      : `${item.blockers}件の課題`}
                  </div>

                  <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800/80 rounded-t-xl h-40 relative overflow-hidden flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${barColor}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
            <span>集計期間: 今週 (月曜〜金曜)</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                コミット・PR
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                削減されたMTG時間
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Project Cards (Individual Dashboard Links) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-indigo-500" />
                <span>プロジェクト別ダッシュボード一覧 ({projects.length}件)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                カードをクリックすると各プロジェクトの詳細ダッシュボード（個別マトリクス）へ遷移します
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <Link
                key={proj.id}
                href={proj.href}
                className={`p-5 rounded-2xl border transition-all duration-200 block shadow-sm hover:shadow-md group ${
                  proj.status === 'blocked'
                    ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20 dark:bg-slate-900/90 hover:border-rose-400'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {proj.name}
                      </h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          proj.status === 'blocked'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {proj.status === 'blocked' ? '要サポート 🔴' : '順調稼働 ⚡'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                      <FolderGit2 className="h-3 w-3 text-slate-400" />
                      {proj.repo}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {proj.progress}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">進捗</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {proj.description}
                </p>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      proj.status === 'blocked' ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500">
                      主担当: <strong className="text-slate-800 dark:text-slate-200">{proj.lead}</strong>
                    </span>
                    <span>•</span>
                    <span className="text-slate-500 font-mono">
                      {proj.commitsThisWeek} コミット
                    </span>
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 text-xs group-hover:translate-x-1 transition-transform">
                    個別ダッシュボード <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Section 4: Team Member Health & Location Matrix */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>メンバー稼働マトリクス＆地方フルリモート連携</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                北海道・福岡・長野・東京のエンジニアが非同期で自走する稼働状況
              </p>
            </div>
            <Link
              href="/standups"
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              全員の日報を見る <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {standups.map((s) => {
              const isLead = s.user.githubUsername === 'mizoe0829';
              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xl border ${
                    s.hasBlocker
                      ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20'
                      : isLead
                      ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50/10'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <img
                      src={s.user.avatar}
                      alt={s.user.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          {s.user.name.split(' ')[0]}
                        </span>
                        {isLead && (
                          <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.2 rounded font-bold">
                            Tech Lead
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">
                        @{s.user.githubUsername}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span>拠点:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{s.user.location}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>勤務:</span>
                      <span className="text-slate-500">{s.user.timezone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>状態:</span>
                      <span
                        className={`font-semibold ${
                          s.hasBlocker
                            ? 'text-rose-600 dark:text-rose-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {s.hasBlocker ? '要サポート 🔴' : '順調 ⚡'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Standup Modals */}
      <StandupModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmit={async () => {
          await fetchStandups();
        }}
        githubUsername="mizoe0829"
      />

      <SlackExportModal
        isOpen={isSlackExportOpen}
        onClose={() => setIsSlackExportOpen(false)}
        standups={standups}
      />
    </div>
  );
}
