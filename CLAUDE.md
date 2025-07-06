Claude Code が自律的に FamiPrint を開発・保守するためのルールブックです。Claude はコミットやファイル変更前に必ず本セクションを読み込み、遵守してください。

2‑1. 目的

少人数開発でのスピードと品質を両立する。

ヒューマンレビューの負荷を減らし、家族テスト→リファクタのループを短縮する。

2‑2. 必読ファイル / 優先ロード順

/README.md

/src/components/**

/lib/supabase.ts

/supabase/migrations/**（変更を加えるときのみ）

2‑3. 作業フロー

フェーズ

Claude コマンド例

出力物

Think

claude think "UploadForm の Props と State を設計"

箇条書きの設計メモ

Plan (think hard)

claude think hard "Supabase schema 変更計画"

ステップ別タスクリスト

Implement

claude edit src/components/UploadForm.tsx

実装コード（≤300 LOC）

Commit & PR

claude ci

テスト・Lint 通過後、自動 PR 作成

2‑4. ブランチ・コミット規約

ブランチ名 : feat/<issue-id>-<slug> ／ fix/<issue-id>-<slug> など。

Commit メッセージ : Conventional Commits を遵守 (feat:, fix:, docs:)。

LOC 制限 : 1 PR あたり 300 行以内。超える場合はタスクを分割。

2‑5. コーディング規約（要約）

UI : shadcn/ui 生成コンポーネントをコピーして改変。

スタイル : カスタムCSSクラスを優先。CSS in JS は禁止。

型安全 : strict モードを維持。any は原則禁止。

テスト : hooks・utils は Vitest、コンポーネントは Storybook でビジュアル回帰。

i18n : 将来拡張のためテキストは @/lib/i18n.ts を経由。

2‑6. 禁止事項

/node_modules 直編集

外部 API キーのハードコード

大規模スキーマ変更を一括で行うこと（think hard で事前計画必須）

2‑7. よく使うコマンドチートシート

# Claude を使った設計フェーズ
claude think "新しいカテゴリフィルター UI を設計"

# 特定ファイルを 1 回修正
claude edit src/features/print/hooks.ts

# CI & PR 作成（テスト/ビルド→GitHub PR）
claude ci

2‑8. 参照リンク

shadcn/ui 公式: https://ui.shadcn.com/

Supabase JS クライアント: https://supabase.com/docs/reference/javascript

