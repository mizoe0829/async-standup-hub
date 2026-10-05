'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { StandupModal } from '@/components/StandupModal';
import { SlackExportModal } from '@/components/SlackExportModal';
import { Standup } from '@/types';
import {
  FolderGit2,
  GitPullRequest,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ArrowLeft,
  Users,
  ShieldCheck,
  TrendingUp,
  Layers,
  ChevronRight,
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';

interface ProjectDetail {
  id: string;
  name: string;
  repo: string;
  category: string;
  progress: number;
  status: 'healthy' | 'blocked' | 'steady';
  lead: string;
  contributors: Array<{ name: string; role: string; avatar: string; location: string }>;
  commitsThisWeek: number;
  openPRs: number;
  activeBlockers: number;
  description: string;
  recentMilestones: Array<{ title: string; date: string; author: string; pr?: string }>;
  recentCommits: Array<{ sha: string; message: string; date: string; author: string }>;
  blockerDetail?: string;
  resolutionAction?: string;
  resolutionTimeAvg: string;
}

const allProjects: Record<string, ProjectDetail> = {
  'task-matrix': {
    id: 'task-matrix',
    name: 'TaskMatrix 基幹サービス',
    repo: 'mizoe0829/task-matrix',
    category: 'Core Service',
    progress: 88,
    status: 'healthy',
    lead: 'Ken Mizoe (溝江 研)',
    contributors: [
      {
        name: 'Ken Mizoe (溝江 研)',
        role: 'フルスタック / テックリード',
        avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&auto=format&fit=crop&q=80', // 柴犬 🐶
        location: '地方フルリモート (北海道)',
      },
      {
        name: '高橋 美咲 (Misaki Takahashi)',
        role: 'UI/UXデザイナー & QA',
        avatar: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=120&auto=format&fit=crop&q=80', // ウサギ 🐰
        location: '地方フルリモート (長野・時短フレックス)',
      },
    ],
    commitsThisWeek: 18,
    openPRs: 2,
    activeBlockers: 0,
    description: 'フルリモート開発のタスク依存関係・階層分析・分散ワークフローを視覚化する基盤Webサービス。',
    recentMilestones: [
      {
        title: '全モーダルのレスポンシブ内部スクロール最適化とタッチ操作改善',
        date: '2026-10-05',
        author: 'Ken Mizoe',
        pr: '#12',
      },
      {
        title: '階層フロー分析ダッシュボードのデータ同期安定化とキャッシュ最適化',
        date: '2026-10-04',
        author: 'Ken Mizoe',
        pr: '#10',
      },
      {
        title: 'FigmaデザイントークンとTailwind CSSの同期コンポーネント作成',
        date: '2026-10-03',
        author: '高橋 美咲',
        pr: '#8',
      },
    ],
    recentCommits: [
      { sha: '6789abc', message: 'feat: add global dashboard and hierarchy flow analytics', date: '2026-10-05', author: 'Ken Mizoe' },
      { sha: 'f2419a1', message: 'fix(modal): prevent body scrolling when detail view is active', date: '2026-10-04', author: 'Ken Mizoe' },
      { sha: '39a8c2d', message: 'style: polish glassmorphic badges and card layout', date: '2026-10-03', author: '高橋 美咲' },
    ],
    resolutionTimeAvg: '35分',
  },
  'async-standup-hub': {
    id: 'async-standup-hub',
    name: 'AsyncStandup Hub',
    repo: 'mizoe0829/async-standup-hub',
    category: 'Productivity Tool',
    progress: 94,
    status: 'healthy',
    lead: 'Ken Mizoe (溝江 研)',
    contributors: [
      {
        name: 'Ken Mizoe (溝江 研)',
        role: 'フルスタック / テックリード',
        avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&auto=format&fit=crop&q=80', // 柴犬 🐶
        location: '地方フルリモート (北海道)',
      },
      {
        name: '田中 雄大 (Yudai Tanaka)',
        role: 'バックエンド / SRE',
        avatar: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=120&auto=format&fit=crop&q=80', // ペンギン 🐧
        location: '東京 (本社ハイブリッド)',
      },
    ],
    commitsThisWeek: 24,
    openPRs: 1,
    activeBlockers: 0,
    description: '地方フルリモート＆フレックスチームのためのGitHub連携・非同期朝会ダッシュボード。',
    recentMilestones: [
      {
        title: 'GitHub Events API によるPR・コミット実績のワンクリック自動同期',
        date: '2026-10-05',
        author: 'Ken Mizoe',
        pr: '#42',
      },
      {
        title: 'ブロッカー早期検知レーダーUIの構築とリアルタイムアラート',
        date: '2026-10-05',
        author: 'Ken Mizoe',
        pr: '#43',
      },
      {
        title: 'Slack / Discord 向け引用マークダウン出力機能の実装',
        date: '2026-10-04',
        author: '田中 雄大',
        pr: '#39',
      },
    ],
    recentCommits: [
      { sha: '0bde386', message: 'feat(dashboard): add dedicated dashboard routes and metrics', date: '2026-10-05', author: 'Ken Mizoe' },
      { sha: 'b9b8e28', message: 'feat(i18n): localize platform to domestic remote team', date: '2026-10-05', author: 'Ken Mizoe' },
    ],
    resolutionTimeAvg: '28分',
  },
  'ec-checkout-engine': {
    id: 'ec-checkout-engine',
    name: 'EC Checkout Pipeline',
    repo: 'org/ec-checkout-engine',
    category: 'Payments Engine',
    progress: 68,
    status: 'blocked',
    lead: '佐藤 葵 (Aoi Sato)',
    contributors: [
      {
        name: '佐藤 葵 (Aoi Sato)',
        role: 'フロントエンドエンジニア',
        avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80', // 猫 🐱
        location: '地方フルリモート (福岡)',
      },
      {
        name: 'Ken Mizoe (溝江 研)',
        role: 'フルスタック / テックリード',
        avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&auto=format&fit=crop&q=80', // 柴犬 🐶
        location: '地方フルリモート (北海道)',
      },
      {
        name: '田中 雄大 (Yudai Tanaka)',
        role: 'バックエンド / SRE',
        avatar: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=120&auto=format&fit=crop&q=80', // ペンギン 🐧
        location: '東京 (本社ハイブリッド)',
      },
    ],
    commitsThisWeek: 9,
    openPRs: 3,
    activeBlockers: 1,
    description: 'Svelte-EC 決済パイプライン・Stripe本番Webhook署名検証の決済エンジン。',
    blockerDetail: 'ステージング環境の Stripe Webhook 署名シークレット更新で 400 Bad Signature が発生中。結合テストがストップしています。',
    resolutionAction: 'Ken Mizoe が AWS Secrets Manager のアクセス権限を更新し、1Password共有ボルトに最新シークレットを展開済み（反映テスト待ち）',
    recentMilestones: [
      {
        title: 'Stripe Checkout セッション生成APIの結合テストとクエリ最適化',
        date: '2026-10-04',
        author: '佐藤 葵',
        pr: '#21',
      },
      {
        title: 'Prisma クエリレイテンシ検証とコネクションプール設定',
        date: '2026-10-03',
        author: '田中 雄大',
        pr: '#19',
      },
    ],
    recentCommits: [
      { sha: '8c91a0f', message: 'test: add unit tests for Stripe signature verification', date: '2026-10-05', author: '佐藤 葵' },
      { sha: '412e09b', message: 'refactor: split checkout components for better tree-shaking', date: '2026-10-04', author: '佐藤 葵' },
    ],
    resolutionTimeAvg: '52分',
  },
  'infra-core-services': {
    id: 'infra-core-services',
    name: 'Infra & Cloud Platform',
    repo: 'org/infra-core-services',
    category: 'DevOps & SRE',
    progress: 82,
    status: 'steady',
    lead: '田中 雄大 (Yudai Tanaka)',
    contributors: [
      {
        name: '田中 雄大 (Yudai Tanaka)',
        role: 'バックエンド / SRE',
        avatar: 'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=120&auto=format&fit=crop&q=80', // ペンギン 🐧
        location: '東京 (本社ハイブリッド)',
      },
      {
        name: '佐藤 葵 (Aoi Sato)',
        role: 'フロントエンドエンジニア',
        avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=120&auto=format&fit=crop&q=80', // 猫 🐱
        location: '地方フルリモート (福岡)',
      },
    ],
    commitsThisWeek: 12,
    openPRs: 2,
    activeBlockers: 0,
    description: 'Dockerマルチステージビルド・AWS ECS Fargate・PgBouncer接続プール。',
    recentMilestones: [
      {
        title: 'Docker マルチステージビルドによるステージングイメージの64%軽量化',
        date: '2026-10-04',
        author: '佐藤 葵',
        pr: '#108',
      },
      {
        title: 'AWS Secrets Manager のアクセス権限再配布とローテーションテスト完了',
        date: '2026-10-05',
        author: '田中 雄大',
        pr: '#112',
      },
    ],
    recentCommits: [
      { sha: '992a10c', message: 'chore: tune PgBouncer connection limits for staging DB', date: '2026-10-05', author: '田中 雄大' },
      { sha: '11a78e4', message: 'build: optimize Docker Alpine cache layers', date: '2026-10-04', author: '佐藤 葵' },
    ],
    resolutionTimeAvg: '40分',
  },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = (params?.id as string) || 'task-matrix';
  const project = allProjects[projectId] || allProjects['task-matrix'];

  const [standups, setStandups] = useState<Standup[]>([]);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isSlackExportOpen, setIsSlackExportOpen] = useState(false);

  useEffect(() => {
    fetch('/api/standups')
      .then((r) => r.json())
      .then((d) => {
        if (d.standups) setStandups(d.standups);
      })
      .catch((e) => console.error(e));
  }, []);

  const currentUser =
    standups.map((s) => s.user).find((u) => u.githubUsername === 'mizoe0829') ||
    standups.find((s) => s.user.name.includes('Ken Mizoe') || s.user.name.includes('溝江'))?.user;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <Header
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenSlackExport={() => setIsSlackExportOpen(true)}
        currentUser={currentUser}
        standupsCount={standups.length}
        blockersCount={project.activeBlockers}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Back navigation & Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>全体ダッシュボード</span>
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 font-medium">プロジェクト個別ダッシュボード</span>
            <span className="text-slate-400">/</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{project.name}</span>
          </div>

          {/* Quick Project Switcher Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1">他のプロジェクト:</span>
            {Object.values(allProjects).map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  p.id === project.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.name.split(' ')[0]}
              </Link>
            ))}
          </div>
        </div>

        {/* Project Hero Header */}
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <FolderGit2 className="h-5 w-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {project.name}
                </h1>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    project.status === 'blocked'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}
                >
                  {project.status === 'blocked' ? '要サポート (ブロッカー発生中)' : '正常稼働中 ⚡'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  {project.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {project.description}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono pt-1">
                <a
                  href={`https://github.com/${project.repo}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>https://github.com/{project.repo}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">
                  主担当: <strong className="text-slate-700 dark:text-slate-300">{project.lead}</strong>
                </span>
              </div>
            </div>

            {/* Progress Gauge */}
            <div className="flex items-center gap-4 self-start lg:self-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-medium">スプリント達成度</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {project.progress}%
                </span>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-medium">週次コミット</span>
                <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {project.commitsThisWeek}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Red Blocker Notice if Blocked */}
        {project.blockerDetail && (
          <div className="p-5 rounded-2xl border-2 border-rose-500/40 bg-rose-50/60 dark:bg-slate-900/90 shadow-sm relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-rose-500/30 animate-pulse">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                    発生中のプロジェクト課題（要アンブロック）
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    解決対応中
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {project.blockerDetail}
                </p>
                {project.resolutionAction && (
                  <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 text-xs">
                    <strong className="text-slate-900 dark:text-white mr-1">アンブロック進捗:</strong>
                    <span className="text-slate-600 dark:text-slate-300">
                      {project.resolutionAction}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Project Layout: Milestones & Team Contributors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Milestones & Commits */}
          <div className="lg:col-span-2 space-y-6">
            {/* Milestones Card */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>達成マイルストーン＆完了PR一覧</span>
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  平均解決時間: {project.resolutionTimeAvg}
                </span>
              </div>

              <div className="space-y-3">
                {project.recentMilestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {m.pr && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[11px]">
                            {m.pr}
                          </span>
                        )}
                        <span className="font-bold text-slate-900 dark:text-white">
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                        {m.date}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>完了担当: {m.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commits Stream */}
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-indigo-500" />
                <span>直近のGitHubコミット履歴 (最新3件)</span>
              </h3>

              <div className="space-y-2.5 font-mono text-xs">
                {project.recentCommits.map((c) => (
                  <div
                    key={c.sha}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {c.sha}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {c.message}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-2">
                      {c.author} • {c.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Assigned Contributors & Location */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-500" />
                <span>アサインメンバー ({project.contributors.length}名)</span>
              </h3>

              <div className="space-y-3">
                {project.contributors.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-9 w-9 rounded-full object-cover ring-1 ring-indigo-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {member.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {member.role}
                      </p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">
                        📍 {member.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Link
                  href="/standups"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 transition-colors"
                >
                  <span>メンバーの日報を確認する</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <StandupModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSubmit={async () => {}}
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
