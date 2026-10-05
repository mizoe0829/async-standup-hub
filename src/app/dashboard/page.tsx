'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { StandupModal } from '@/components/StandupModal';
import { SlackExportModal } from '@/components/SlackExportModal';
import { Standup, User } from '@/types';
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
  Filter,
  Layers,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Flame,
  Award
} from 'lucide-react';

interface ProjectMetric {
  id: string;
  name: string;
  repo: string;
  category: string;
  progress: number;
  status: 'healthy' | 'blocked' | 'steady';
  lead: string;
  contributors: string[];
  commitsThisWeek: number;
  openPRs: number;
  activeBlockers: number;
  description: string;
  recentMilestones: string[];
  blockerDetail?: string;
  resolutionTimeAvg: string;
}

export default function DashboardPage() {
  const [standups, setStandups] = useState<Standup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [chartMetric, setChartMetric] = useState<'activity' | 'blockers' | 'hoursSaved'>('activity');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isSlackExportOpen, setIsSlackExportOpen] = useState(false);

  // Load standups from API
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

  // Project Definitions
  const projects: ProjectMetric[] = [
    {
      id: 'task-matrix',
      name: 'TaskMatrix 基幹サービス',
      repo: 'mizoe0829/task-matrix',
      category: 'Core Product',
      progress: 88,
      status: 'healthy',
      lead: 'Ken Mizoe (溝江 研)',
      contributors: ['Ken Mizoe', '高橋 美咲'],
      commitsThisWeek: 18,
      openPRs: 2,
      activeBlockers: 0,
      description: 'フルリモート開発のタスク依存関係・階層分析を視覚化する基盤Webアプリケーション。',
      recentMilestones: [
        '全モーダルのレスポンシブ内部スクロール最適化完了 (PR #12)',
        '階層フロー分析ダッシュボードのデータ同期安定化',
        'Next.js 15 Client/Server Components の分離境界リファクタ',
      ],
      resolutionTimeAvg: '35分',
    },
    {
      id: 'async-standup-hub',
      name: 'AsyncStandup Hub',
      repo: 'mizoe0829/async-standup-hub',
      category: 'Productivity & Remote',
      progress: 94,
      status: 'healthy',
      lead: 'Ken Mizoe (溝江 研)',
      contributors: ['Ken Mizoe', '田中 雄大'],
      commitsThisWeek: 24,
      openPRs: 1,
      activeBlockers: 0,
      description: '地方フルリモート＆フレックスチームのためのGitHub連携・非同期スタンドアップミーティングツール。',
      recentMilestones: [
        'GitHub Events API によるPR・コミット実績のワンクリック自動同期',
        'ブロッカー早期検知レーダーUIの構築',
        '国内フルリモート開発チーム向け日本語最適化',
      ],
      resolutionTimeAvg: '28分',
    },
    {
      id: 'ec-checkout-engine',
      name: 'EC Checkout Pipeline',
      repo: 'org/ec-checkout-engine',
      category: 'Payments & E-Commerce',
      progress: 68,
      status: 'blocked',
      lead: '佐藤 葵 (Aoi Sato)',
      contributors: ['佐藤 葵', 'Ken Mizoe', '田中 雄大'],
      commitsThisWeek: 9,
      openPRs: 3,
      activeBlockers: 1,
      description: 'Svelte-EC 決済基盤パイプラインとStripe本番Webhook署名検証の決済エンジン。',
      recentMilestones: [
        'Stripe Checkout セッション生成APIの結合テスト',
        'Staging DB（PostgreSQL）に対する Prisma クエリレイテンシ計測',
      ],
      blockerDetail: 'ステージング環境の Stripe Webhook 署名シークレット不整合で 400 エラー中（Ken Mizoe が1Password経由で最新シークレット配布し対応中）',
      resolutionTimeAvg: '52分',
    },
    {
      id: 'infra-core-services',
      name: 'Infra & Cloud Platform',
      repo: 'org/infra-core-services',
      category: 'DevOps & SRE',
      progress: 82,
      status: 'steady',
      lead: '田中 雄大 (Yudai Tanaka)',
      contributors: ['田中 雄大', '佐藤 葵'],
      commitsThisWeek: 12,
      openPRs: 2,
      activeBlockers: 0,
      description: 'Dockerマルチステージビルド、AWS ECS Fargate、RDS PostgreSQL コネクション管理基盤。',
      recentMilestones: [
        'Docker マルチステージビルドによるステージングイメージの64%軽量化',
        'AWS Secrets Manager のアクセス権限再配布とローテーションテスト完了',
        'PgBouncer による PostgreSQL コネクションプーリング設定見直し',
      ],
      resolutionTimeAvg: '40分',
    },
  ];

  // Filtered Project
  const currentProject = projects.find((p) => p.id === selectedProject);

  // Trend Chart Data (Monday to Friday output)
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
  const averageProgress = Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Header
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenSlackExport={() => setIsSlackExportOpen(true)}
        currentUser={currentUser}
        standupsCount={standups.length}
        blockersCount={totalActiveBlockers}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top Control Bar: Title & Project Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span>エンジニアリング＆チームヘルス ダッシュボード</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Live Telemetry
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  同期ミーティングを排除し、非同期スタンドアップとGitHub活動からチームの健全性・成果を可視化
                </p>
              </div>
            </div>
          </div>

          {/* Project Switcher Tabs */}
          <div className="flex items-center gap-2 flex-wrap bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setSelectedProject('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedProject === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>全社・全体サマリー</span>
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedProject === p.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{p.name.split(' ')[0]}</span>
                {p.status === 'blocked' && (
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Core KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Team Health Score */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">チーム健全性スコア</span>
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {selectedProject === 'all' ? '94%' : `${currentProject?.progress}%`}
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +4.2% vs 先週
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {selectedProject === 'all'
                ? '4名全員が同期完了・高いコンディションを維持'
                : `主担当: ${currentProject?.lead}`}
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${selectedProject === 'all' ? 94 : currentProject?.progress}%` }}
              />
            </div>
          </div>

          {/* KPI 2: MTG Hours Saved & Deep Work */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">同期MTG削減・集中時間創出</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                14.5<span className="text-sm font-semibold text-slate-400 ml-1">時間/週</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                +2.5h
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              毎朝のZoom朝会を非同期化し、Deep Workに転換
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '82%' }} />
            </div>
          </div>

          {/* KPI 3: Blocker MTTR (Resolution Speed) */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">平均ブロッカー解消速度 (MTTR)</span>
              <Clock className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {selectedProject === 'all' ? '38' : currentProject?.resolutionTimeAvg.replace('分', '')}
                <span className="text-sm font-semibold text-slate-400 ml-1">分</span>
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
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '75%' }} />
            </div>
          </div>

          {/* KPI 4: Output Velocity (Commits & PRs) */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold">週次開発アウトプット</span>
              <GitPullRequest className="h-4 w-4 text-cyan-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {selectedProject === 'all'
                  ? totalCommitsThisWeek
                  : currentProject?.commitsThisWeek}
                <span className="text-sm font-semibold text-slate-400 ml-1">commits</span>
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" />
                {selectedProject === 'all' ? totalOpenPRs : currentProject?.openPRs} PRs
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              {selectedProject === 'all'
                ? '4プロジェクト合計のコミット・PR実績'
                : `対象リポジトリ: ${currentProject?.repo}`}
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '90%' }} />
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Velocity & Trends Chart */}
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

          {/* Rich SVG Bar / Trend Chart */}
          <div className="grid grid-cols-5 gap-3 sm:gap-6 pt-4 pb-2 items-end h-56 border-b border-slate-100 dark:border-slate-800">
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
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 dark:bg-slate-800 text-white px-2 py-1 rounded-lg shadow-lg font-mono text-center pointer-events-none mb-1">
                    {chartMetric === 'activity'
                      ? `${item.commits} commits / ${item.prs} PRs`
                      : chartMetric === 'hoursSaved'
                      ? `${item.hoursSaved}h 削減`
                      : `${item.blockers}件の課題`}
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800/80 rounded-t-xl h-44 relative overflow-hidden flex items-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ${barColor}`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Day Label */}
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

        {/* Section 3: Project Breakdown / Deep Dive */}
        {selectedProject === 'all' ? (
          /* All Projects Grid */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-indigo-500" />
                <span>稼働中プロジェクト一覧・進捗マトリクス ({projects.length}件)</span>
              </h3>
              <span className="text-xs text-slate-500">クリックしてプロジェクト詳細にフォーカス</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => setSelectedProject(proj.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
                    proj.status === 'blocked'
                      ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20 dark:bg-slate-900/90 hover:border-rose-400'
                      : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400 dark:hover:border-indigo-600'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">
                          {proj.name}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            proj.status === 'blocked'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {proj.status === 'blocked' ? '要サポート' : '順調稼働'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                        <FolderGit2 className="h-3 w-3 text-slate-400" />
                        {proj.repo}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                        {proj.progress}%
                      </span>
                      <span className="text-[10px] text-slate-400 block">スプリント進捗</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {/* Blocker Callout if exists */}
                  {proj.blockerDetail && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 mb-4 text-xs text-rose-900 dark:text-rose-200">
                      <div className="flex items-center gap-1.5 font-bold mb-1 text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>発生中の課題:</span>
                      </div>
                      <p className="pl-5 text-slate-700 dark:text-slate-300">
                        {proj.blockerDetail}
                      </p>
                    </div>
                  )}

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
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 text-[11px]">
                      詳細を見る <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Single Project Deep Dive */
          <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedProject('all')}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    ← 全体一覧に戻る
                  </button>
                  <span className="text-slate-400">/</span>
                  <span className="text-xs text-slate-500">{currentProject?.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1 flex items-center gap-2">
                  <span>{currentProject?.name}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      currentProject?.status === 'blocked'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {currentProject?.status === 'blocked' ? '要サポート (ブロッカー発生中)' : '正常稼働中'}
                  </span>
                </h3>
                <a
                  href={`https://github.com/${currentProject?.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-mono flex items-center gap-1 mt-1"
                >
                  <span>https://github.com/{currentProject?.repo}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center min-w-[90px]">
                  <span className="text-xs text-slate-400 block">スプリント進捗</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentProject?.progress}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-center min-w-[90px]">
                  <span className="text-xs text-slate-400 block">今週の成果</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white">
                    {currentProject?.commitsThisWeek} <span className="text-xs font-normal">commits</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Blocker Deep Dive */}
            {currentProject?.blockerDetail && (
              <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs">
                <div className="flex items-center gap-2 font-bold mb-2 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>プロジェクト発生中のブロッカー（即時アンブロック対象）:</span>
                </div>
                <p className="pl-6 text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {currentProject.blockerDetail}
                </p>
                <div className="pl-6 mt-3 flex items-center gap-2">
                  <span className="text-[11px] bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                    対応リーダー: Ken Mizoe (1Password 連携済み)
                  </span>
                </div>
              </div>
            )}

            {/* Milestones & Accomplishments */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                直近の達成マイルストーン＆完了PR
              </h4>
              <div className="space-y-2.5">
                {currentProject?.recentMilestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contributors */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                アサインメンバー＆貢献
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                {currentProject?.contributors.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                      {c.charAt(0)}
                    </div>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Team Member Health & Location Matrix */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>メンバー稼働マトリクス＆活動ステータス</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                地方在住メンバーの勤務形態、今日のコンディション、非同期連携状況
              </p>
            </div>
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
