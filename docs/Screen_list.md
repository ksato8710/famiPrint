# 画面一覧

## 1. ホーム画面 (Home Screen)
- **パス**: `/`
- **概要**: アップロードされたプリントのサムネイルを一覧表示します。カテゴリーや日付でフィルタリングが可能です。
- **実装状況**: 完了
- **関連ファイル**: `app/page.tsx`, `components/MasonryGrid.tsx`, `components/CategoryEditor.tsx`

## 2. アップロード画面 (Upload Screen)
- **パス**: `/upload`
- **概要**: JPEGやPDFファイルをドラッグ＆ドロップでアップロードし、Supabaseに保存します。
- **実装状況**: 完了
- **関連ファイル**: `app/upload/page.tsx`

## 3. 詳細画面 (Detail Screen)
- **パス**: `/print/[id]` (モーダル表示)
- **概要**: 個別のプリントを原寸でプレビューし、ダウンロードする機能を提供します。
- **実装状況**: 完了
- **関連ファイル**: `components/DetailModal.tsx`