# AsyncStandup Hub (Git-Synced Distributed Standup Platform)

> **地方フルリモート＆フレックス開発チーム向け、GitHubコミット・PR自動集約＆ブロッカー早期解消プラットフォーム**  
> Next.js 15 (App Router), TypeScript, Prisma ORM (SQLite), Tailwind CSS によるフルスタックWebアプリケーション。

![AsyncStandup Hub Preview](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80)

---

## 🎯 開発の背景と解決する課題（フルリモート適性の体現）

地方からのフルリモートワークや、コアタイムなしフレックス（育児・介護・時短など）が広がる現代の開発現場において、**「毎朝決まった時間のZoom朝会」はメンバーの集中作業（Deep Work）を分断し、自走力を妨げる要因**になっていました。

- **勤務時間のズレと非同期キャッチアップ**: 朝型・夜型・時短勤務など活動時間帯が異なるため、同期ミーティングを開かずに状況を可視化したい。
- **日報作成の手間を自動化**: 「昨日何をやったか」を毎朝思い出すコストを、GitHubのPR・コミット自動同期によりゼロにする。
- **ブロッカー（課題・詰まり）の見落とし防止**: チャットに埋もれがちな「環境変数や権限待ちで止まっています」「PRレビュー待ちです」という声を最上部にアラート表示し、チームで即座にアンブロック（助け合い）できる。

### 💡 解決策
1. **GitHub Magic Sync**: ワンクリックで直近のマージ済みPRやコミット履歴を自動取得し、スタンドアップに箇条書きで即時展開。
2. **ブロッカー検知レーダー (Blocker Radar)**: チーム内で困っている・作業停止しているメンバーを最上部に強調表示。テックリードやチームメンバーが迅速にフォロー可能。
3. **Slack / Discord Export**: チーム全員のスタンドアップを美しくフォーマットされた引用マークダウンとしてワンクリックで一括生成・コピー。

---

## 🚀 主な機能・アーキテクチャ

### 1. フロントエンド (Client-side)
- **スタンドアップ入力モーダル**:
  - `GitHubから自動取得` ボタンによるコミット・PR自動挿入
  - 今日のコミットメント、ブロッカー入力、コンディション選択
- **ブロッカー検知レーダー**:
  - 詰まっているエンジニアがいる場合、一目でわかるヘルプアラートと「アンブロック」ボタンを表示
- **国内リモート・タイムライン**:
  - 地方フルリモート（北海道、福岡、長野）や東京本社のメンバーの勤務形態・稼働ステータス（オンライン、集中作業中、オフライン）
  - スタンドアップカード、昨日・今日・ブロッカー表示
  - 応援リアクション（👏）、サポート返信コメントスレッド
- **勤務スタイル絞り込みフィルター**:
  - 「全メンバー」「地方フルリモート」「東京本社」「要サポート」のワンクリック切り替え

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
