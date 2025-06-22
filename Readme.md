✨ FamiPrint とは？

FamiPrint は、子どもが学校や塾から持ち帰るプリントをスマホ／PCで簡単にデジタル管理できる、家族向けの軽量 Web アプリです。アップロード・分類・閲覧をシンプルな操作で行えます。

MVP（v0.1）の範囲

画面

主な機能

**ホーム **/

サムネイル（2 列 Masonry）表示、カテゴリー／日付フィルタ

**アップロード **/upload

JPEG／PDF をドラッグ & ドロップで追加、Supabase へ保存

**詳細 **/print/[id]

原寸プレビュー、ダウンロードボタン

認証

Supabase Auth のパスワードレスメールリンク

採用技術

Next.js 15（App Router, TypeScript）

Tailwind CSS + shadcn/ui（UI コンポーネント）

Supabase ― Auth・Storage・PostgreSQL（RLS）

デプロイ先 Vercel（CI は GitHub Actions）

クイックスタート