# AsyncStandup Hub (Git-Synced Distributed Standup Platform)

> **フルリモート＆多拠点チーム向け、GitHubコミット・PR自動集約＆ブロッカー早期解消プラットフォーム**  
> Next.js 15 (App Router), TypeScript, Prisma ORM (SQLite/PostgreSQL), Tailwind CSS によるフルスタックWebアプリケーション。

![AsyncStandup Hub Preview](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80)

---

## 🎯 開発の背景と解決する課題

- **時差や勤務時間のズレ**: 地方や海外に分散したフルリモートチームでは、同期的なZoom朝会がメンバーの「集中時間（Deep Work）」を分断する。
- **日報作成の手間**: 「昨日何をやったか」を毎朝思い出すコストが高く、GitHubのログを確認して手入力する二度手間が発生。
- **ブロッカー（詰まり）の見落とし**: チャットに埋もれた「権限がなくて止まっています」「PRレビュー待ちです」という声が放置され、スプリント全体が遅延。

### 💡 解決策
1. **GitHub Magic Sync**: ワンクリックで直近のマージ済みPRやコミット履歴を自動取得し、日報に箇条書きで即時展開。
2. **Blocker Radar**: チーム内で困っている・止まっているメンバーを赤色バッジで最上部にハイライト。即座にチームが助け合える。
3. **Slack / Discord Export**: チーム全員のスタンドアップを美しくフォーマットされたMarkdownとしてワンクリックで一括生成・コピー。

---

## 🚀 主な機能・アーキテクチャ

### 1. フロントエンド (Client-side)
- **Today's Check-in モーダル**:
  - `Auto-Sync from GitHub` ボタンによる自動入力
  - 今日の目標、ブロッカー入力、コンディション（Mood）選択
- **Blocker Radar (ブロッカー検知バナー)**:
  - 詰まっているエンジニアがいる場合、一目でわかるヘルプアラートを表示
- **分散チーム・タイムライン**:
  - 各メンバーのタイムゾーン（Tokyo UTC+9, London UTC+0, SF UTC-8, Berlin UTC+1）と現在ステータス（Online, Deep Work, Offline）
  - スタンドアップカード、昨日・今日・ブロッカー表示
  - 応援リアクション（👏）、ヘルプ返信コメントスレッド
- **地域・タイムゾーンフィルター**:
  - All, Asia, Europe, Americas のワンクリック絞り込み

### 2. バックエンド & DB (Fullstack API)
- **Next.js 15 Route Handlers (`/api/...`)**:
  - `GET /api/standups`: 日付別スタンドアップ一覧取得（ユーザー情報・コメントリレーション付き）
  - `POST /api/standups`: スタンドアップ新規投稿・更新（Upsert処理）
  - `GET /api/github/sync?username={user}`: GitHub Public Events API と通信し、直近のPush/PRイベントを自動解析・Markdownフォーマット化
  - `POST /api/reactions`: スタンドアップへのリアクション加算
  - `POST /api/comments`: ブロッカーに対するヘルプコメントの投稿
- **Prisma ORM & SQLite**:
  - 型安全なDBクエリ、リレーショナル設計（`User`, `Standup`, `GitActivity`, `Comment`）

---

## 🛠 技術スタック

| レイヤー | 採用技術 |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React |
| **Backend API** | Next.js Route Handlers (RESTful API), GitHub REST API |
| **Database & ORM** | SQLite, Prisma ORM 5 (Type-safe Schema & Migrations) |
| **Language** | TypeScript 100% (Strict Mode) |

---

## 📦 セットアップ・起動方法

### 1. 依存関係のインストール

```bash
npm install
```

### 2. データベースの初期化＆シード投入

```bash
npx prisma db push
npx -y tsx prisma/seed.ts
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてご利用ください。

---

## 📂 ディレクトリ構成

```
src/
├── app/
│   ├── api/
│   │   ├── comments/route.ts   # ブロッカー返信コメントAPI
│   │   ├── github/sync/route.ts # GitHubコミット/PR自動連携API
│   │   ├── reactions/route.ts  # 応援リアクションAPI
│   │   └── standups/route.ts   # スタンドアップCRUD API
│   ├── globals.css             # テーマ設定・ガラスモーフィズム
│   ├── layout.tsx              # SEOメタデータ・Geistフォント
│   └── page.tsx                # メインタイムライン画面
├── components/
│   ├── Header.tsx              # ナビゲーション・アクションバー
│   ├── BlockerRadar.tsx        # ブロッカー検知・ヘルプバナー
│   ├── StandupCard.tsx         # メンバー日報カード・コメントスレッド
│   ├── StandupModal.tsx        # スタンドアップ投稿モーダル（GitHub自動同期）
│   └── SlackExportModal.tsx    # Slack/Discord用Markdown一括生成
├── lib/
│   └── prisma.ts               # Prismaクライアントシングルトン
└── types/
    └── index.ts                # TypeScript型定義
prisma/
├── schema.prisma               # DBスキーマ定義
└── seed.ts                     # 初期シードデータ投入スクリプト
```
