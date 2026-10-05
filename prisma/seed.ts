import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Japanese domestic remote team data...');

  // Clear existing
  await prisma.comment.deleteMany({});
  await prisma.standup.deleteMany({});
  await prisma.gitActivity.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users (Domestic Remote Team)
  const user1 = await prisma.user.create({
    data: {
      name: 'Ken Mizoe (溝江 研)',
      email: 'mizoe@example.com',
      avatar: 'https://github.com/mizoe0829.png',
      githubUsername: 'mizoe0829',
      role: 'フルスタック / テックリード',
      timezone: 'JST (フルフレックス・裁量)',
      location: '地方フルリモート (北海道)',
      status: 'online',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: '佐藤 葵 (Aoi Sato)',
      email: 'aoi.sato@example.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      githubUsername: 'aoi-frontend',
      role: 'フロントエンドエンジニア',
      timezone: 'JST (9:00〜18:00)',
      location: '地方フルリモート (福岡)',
      status: 'deep_work',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: '田中 雄大 (Yudai Tanaka)',
      email: 'tanaka.backend@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      githubUsername: 'tanaka-backend',
      role: 'バックエンド / SRE',
      timezone: 'JST (10:00〜19:00)',
      location: '東京 (本社ハイブリッド)',
      status: 'online',
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: '高橋 美咲 (Misaki Takahashi)',
      email: 'misaki.design@example.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      githubUsername: 'misaki-design',
      role: 'UI/UXデザイナー & QA',
      timezone: 'JST (時短フレックス 10:00〜16:00)',
      location: '地方フルリモート (長野・育児フレックス)',
      status: 'offline',
    },
  });

  const today = new Date().toISOString().split('T')[0];

  // 2. Create Standups for Today
  await prisma.standup.create({
    data: {
      userId: user1.id,
      date: today,
      yesterday: `- PR #42 マージ: \`feat: Add Global Dashboard & responsive modal controls\`
- Svelte-EC 決済パイプラインの動作検証とリファクタ
- 非同期スタンドアップ用の Prisma スキーマ最適化`,
      today: `- Next.js 15 Route Handlers による GitHub PR 自動同期機能の強化
- チーム内の課題・詰まりを早期発見する「ブロッカー検知レーダー」UIの実装
- Slack / Discord 向け非同期通知エクスポートフォーマットの策定`,
      blockers: null,
      hasBlocker: false,
      mood: 'great',
      reactions: 4,
    },
  });

  const standup2 = await prisma.standup.create({
    data: {
      userId: user2.id,
      date: today,
      yesterday: `- Next.js 15 App Router の Server/Client Components 境界見直し
- Docker マルチステージビルドによるステージング環境のイメージ軽量化`,
      today: `- Stripe 本番用 Webhook 署名検証ロジックの実装
- ステージング DB（PostgreSQL）に対する Prisma クエリのレイテンシ検証`,
      blockers: `ステージング環境の Stripe Webhook 署名シークレット更新で 400 Bad Signature が発生中。DevOpsの環境変数再適用待ちで結合テストがストップしています。`,
      hasBlocker: true,
      mood: 'blocked',
      reactions: 2,
    },
  });

  await prisma.standup.create({
    data: {
      userId: user3.id,
      date: today,
      yesterday: `- RDS PostgreSQL のコネクションプーリング設定見直し（PgBouncer）
- ステージング環境の ECS Fargate オートスケーリング閾値調整`,
      today: `- AWS Secrets Manager のアクセス権限再配布とローテーションテスト
- API レスポンス高速化のための Redis キャッシュ層の設計`,
      blockers: null,
      hasBlocker: false,
      mood: 'good',
      reactions: 5,
    },
  });

  await prisma.standup.create({
    data: {
      userId: user4.id,
      date: today,
      yesterday: `- ダークモード用デザイントークンの Figma コンポーネント整理
- 非同期スタンドアップ投稿フローのスマホ実機ユーザビリティテスト`,
      today: `- グラスモーフィズム調のステータスバッジのスタイルガイド作成
- モバイル用ボトムナビゲーションの仕様を Ken さんに連携`,
      blockers: null,
      hasBlocker: false,
      mood: 'good',
      reactions: 3,
    },
  });

  // 3. Comments on blocker (Ken solving Aoi's blocker)
  await prisma.comment.create({
    data: {
      standupId: standup2.id,
      userId: user1.id,
      content: '佐藤さん、AWS Secrets Manager のステージング権限を先ほど更新しました！1Password の共有ボルトに最新の Stripe シークレットを展開したので確認をお願いします🙌',
    },
  });

  // 4. Git Activities for Ken Mizoe
  await prisma.gitActivity.createMany({
    data: [
      {
        userId: user1.id,
        type: 'pr',
        repo: 'mizoe0829/task-matrix',
        title: 'PR #12: Enable responsive internal scrolling for all modals',
        url: 'https://github.com/mizoe0829/task-matrix/pull/12',
      },
      {
        userId: user1.id,
        type: 'commit',
        repo: 'mizoe0829/task-matrix',
        title: 'feat: add global dashboard and hierarchy flow analytics',
        url: 'https://github.com/mizoe0829/task-matrix/commit/6789abc',
      },
      {
        userId: user1.id,
        type: 'commit',
        repo: 'mizoe0829/async-standup-hub',
        title: 'chore: initialize Next.js 15, Prisma schema and SQLite connection',
        url: 'https://github.com/mizoe0829/async-standup-hub/commit/1234def',
      },
    ],
  });

  console.log('Domestic remote team seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
