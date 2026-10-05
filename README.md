# AsyncStandup Hub (Git-Synced Distributed Standup Platform)

> **地方フルリモート＆フレックス開発チーム向け、GitHubコミット・PR自動集約＆ブロッカー早期解消ダッシュボード**  
> Next.js 15 (App Router), TypeScript, Prisma ORM (SQLite), Tailwind CSS によるフルスタックWebアプリケーション。

![AsyncStandup Hub Preview](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80)

---

## 🎯 開発の背景と解決する課題（フルリモート適性の体現）

地方からのフルリモートワークや、コアタイムなしフレックス（育児・介護・時短など）が広がる現代の開発現場において、**「毎朝決まった時間のZoom朝会」はメンバーの集中作業（Deep Work）を分断し、自走力を妨げる要因**になっていました。

- **勤務時間帯のズレと非同期キャッチアップ**: 朝型・夜型・時短勤務など活動時間帯が異なるため、同期ミーティングを開かずに全体の進捗を把握したい。
- **日報作成の手間を自動化**: 「昨日何をやったか」を毎朝思い出すコストを、GitHubのPR・コミット自動同期によりゼロにする。
- **ブロッカー（課題・詰まり）の見落とし防止**: チャットに埋もれがちな「環境変数や権限待ちで止まっています」「PRレビュー待ちです」という声を最上部にアラート表示し、チームで即座にアンブロック（助け合い）できる。

---

## 🗺️ 画面構成＆主要機能

### 1. 全体エンジニアリング・ダッシュボード (`/`)
トップページでチーム全体のアクティビティと健全性を一目で俯瞰できます。
- **4大主要 KPI カード**:
  - **チーム健全性スコア (94%)**: 4名全員の同期完了状況とコンディション指標
  - **削減された同期MTG時間 (14.5時間/週)**: 朝会を非同期化し、創出された集中時間（Deep Work）
  - **平均ブロッカー解消速度 MTTR (38分)**: 検知レーダーによる迅速な相互アンブロック実績
  - **週次開発アウトプット (63 commits / 8 PRs)**: チーム全体のGitHub成果総量
- **週次アウトプット推移チャート**:
  - 月曜〜金曜のアクティビティ（コミット・PR量 / 削減MTG時間 / ブロッカー発生数）を切り替え可能なSVGチャート
- **ブロッカー検知レーダー (Blocker Radar)**:
  - 課題が発生しているメンバーを赤色バッジで最上部にアラート表示。即座に「アンブロック」アクションが可能
- **稼働中プロジェクト一覧カード**:
  - 各プロジェクトのスプリント進捗度・ブロッカー状況・コミット数を一覧表示し、個別ダッシュボードへワンクリック遷移
- **地方フルリモート稼働マトリクス**:
  - 北海道、福岡、長野、東京のメンバーの稼働ステータス（オンライン、集中作業中、オフライン）

---

### 2. プロジェクト個別ダッシュボード (`/task` または `/projects/[id]`)
各プロジェクト（プロダクト・決済基盤・インフラ等）ごとの詳細なマトリクス画面です。
- **プロジェクト単位の達成度・メトリクス**:
  - 📦 **TaskMatrix 基幹サービス** (`/task` または `/projects/task-matrix` / 進捗 88%)
  - 🌐 **AsyncStandup Hub** (`/projects/async-standup-hub` / 進捗 94%)
  - 💳 **EC Checkout Pipeline** (`/projects/ec-checkout-engine` / 進捗 68% / 🔴 要サポート)
  - ⚙️ **Infra & Cloud Platform** (`/projects/infra-core-services` / 進捗 82%)
- **達成マイルストーン＆完了PR一覧**:
  - 直近のマージ済みPRや仕様策定の進捗ログ
- **発生中のブロッカー詳細＆アンブロック進捗**:
  - 権限待ちや環境トラブルの内容と、テックリードによる対応アクション（1Password展開等）
- **アサインメンバー＆直近コミットストリーム**:
  - 担当エンジニアと最新のGitHubコミット履歴

---

### 3. 非同期スタンドアップ共有タイムライン (`/standups`)
チーム全員の日々の成果と予定をタイムライン形式で閲覧・投稿・サポートできます。
- **スタンドアップ入力モーダル (GitHub Magic Sync)**:
  - `GitHubから自動取得` ボタンにより、GitHub Events API（`mizoe0829/task-matrix` 等）から直近コミット・PR実績をワンクリック自動展開
  - コンディション（🔥 絶好調 / 😊 順調 / 😐 進行中 / 😴 お疲れ気味 / 🔴 要フォロー）選択
  - 発生中のブロッカー入力（入力すると即座にレーダーへ反映）
- **チームからのサポート返信（Reply & Unblock）**:
  - メンバーのブロッカーや日報に対して、解決策やアドバイスをスレッド形式で返信
- **Slack / Discord 向けエクスポート**:
  - チームの `#daily-standup` チャンネルへそのまま貼り付けられる引用マークダウンを一括生成・コピー

---

## 👥 チーム設定（親しみやすい動物アイコン）

| メンバー | 役割 / GitHub | 拠点・勤務形態 | アイコン |
| :--- | :--- | :--- | :---: |
| **Ken Mizoe (溝江 研) あなた** | フルスタック / テックリード (`@mizoe0829`) | 地方フルリモート (北海道) / フルフレックス | 柴犬 🐶 |
| **佐藤 葵 (Aoi Sato)** | フロントエンドエンジニア (`@aoi-frontend`) | 地方フルリモート (福岡) / 9:00〜18:00 | 白猫 🐱 |
| **田中 雄大 (Yudai Tanaka)** | バックエンド / SRE (`@tanaka-backend`) | 東京 (本社ハイブリッド) / 10:00〜19:00 | ペンギン 🐧 |
| **高橋 美咲 (Misaki Takahashi)** | UI/UXデザイナー & QA (`@misaki-design`) | 地方フルリモート (長野) / 時短フレックス | ウサギ 🐰 |

---

## 🛠 技術スタック

| レイヤー | 採用技術 | 特徴・選定理由 |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React | 高速なSPAクライアントサイドルーティングとモダンなグラスモーフィズムUI |
| **Backend API** | Next.js Route Handlers (RESTful API), GitHub REST API | 日報CRUD、リアクション加算、ブロッカー返信、GitHub Events自動解析 |
| **Database & ORM** | SQLite, Prisma ORM 5 | 完全な型安全性を備えたリレーショナルモデリング（User, Standup, Comment, GitActivity） |
| **Language** | TypeScript 100% | 厳格な型定義（Strict Mode）による保守性 |

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
│   │   ├── comments/route.ts        # ブロッカー返信コメントAPI
│   │   ├── github/sync/route.ts     # GitHubコミット/PR自動連携API
│   │   ├── reactions/route.ts       # 応援リアクションAPI
│   │   └── standups/route.ts        # スタンドアップCRUD API
│   ├── projects/[id]/page.tsx       # プロジェクト個別ダッシュボード（動的ルーティング）
│   ├── standups/page.tsx            # スタンドアップ共有タイムライン画面
│   ├── task/page.tsx                # TaskMatrix 個別ダッシュボード
│   ├── globals.css                  # テーマ設定・グラスモーフィズム
│   ├── layout.tsx                   # SEOメタデータ・Geistフォント
│   └── page.tsx                     # 全体エンジニアリング・ダッシュボード
├── components/
│   ├── Header.tsx                   # ナビゲーション・アクションバー・ログインユーザー表示
│   ├── BlockerRadar.tsx             # ブロッカー検知・ヘルプバナー
│   ├── StandupCard.tsx              # メンバー日報カード・コメントスレッド
│   ├── StandupModal.tsx             # スタンドアップ投稿モーダル（GitHub自動同期）
│   └── SlackExportModal.tsx         # Slack/Discord用Markdown一括生成
├── lib/
│   └── prisma.ts                    # Prismaクライアントシングルトン
└── types/
    └── index.ts                     # TypeScript型定義
prisma/
├── schema.prisma                    # DBスキーマ定義
└── seed.ts                          # 初期シードデータ投入スクリプト
```
