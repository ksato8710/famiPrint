
Gemini が自律的に FamiPrint を開発・保守するためのルールブックです。Gemini はコミットやファイル変更前に必ず本セクションを読み込み、遵守してください。

2‑1. 目的
少人数開発でのスピードと品質を両立する。
ヒューマンレビューの負荷を減らし、家族テスト→リファクタのループを短縮する。

2‑2. 必読ファイル / 優先ロード順
/README.md
/src/components/**
/lib/supabase.ts
/supabase/migrations/**（変更を加えるときのみ）

2‑3. 作業フロー

（これから、どんどん加筆・更新していきましょう）

テスト・Lint 通過後、自動 PR 作成

2‑4. ブランチ・コミット規約

ブランチ名 : feat/<issue-id>-<slug> ／ fix/<issue-id>-<slug> など。
Commit メッセージ : Conventional Commits を遵守 (feat:, fix:, docs:)。
LOC 制限 : 1 PR あたり 300 行以内。超える場合はタスクを分割。

2‑5. コーディング規約（要約）
UI : shadcn/ui 生成コンポーネントをコピーして改変。
スタイル : Tailwind ユーティリティクラスを優先。CSS in JS は禁止。
型安全 : strict モードを維持。any は原則禁止。
テスト : hooks・utils は Vitest、コンポーネントは Storybook でビジュアル回帰。
i18n : 将来拡張のためテキストは @/lib/i18n.ts を経由。

2‑6. 禁止事項
/node_modules 直編集
外部 API キーのハードコード
大規模スキーマ変更を一括で行うこと（think hard で事前計画必須）

2‑7. よく使うコマンドチートシート

- 開発サーバー起動: `./start-server.sh`
- 開発サーバー停止: `./stop-server.sh`
- 開発サーバー再起動: `./stop-server.sh && ./start-server.sh`

2‑8. 参照リンク

shadcn/ui 公式: https://ui.shadcn.com/
Supabase JS クライアント: https://supabase.com/docs/reference/javascript

