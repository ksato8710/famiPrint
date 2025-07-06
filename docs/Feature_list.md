# 機能一覧

## 1. プリント管理機能
### 1.1. アップロード
- **概要**: JPEG/PDFファイルをドラッグ＆ドロップでアップロードし、Supabase Storageに保存します。
- **実装状況**: 完了
- **関連ファイル**: `app/upload/page.tsx`, `lib/storage.ts`

### 1.2. 表示（サムネイル）
- **概要**: アップロードされたプリントをサムネイル形式で一覧表示します。
- **実装状況**: 完了
- **関連ファイル**: `app/page.tsx`, `components/MasonryGrid.tsx`

### 1.3. フィルタリング（カテゴリー、日付）
- **概要**: カテゴリーや日付でプリントを絞り込み表示します。
- **実装状況**: 完了
- **関連ファイル**: `app/page.tsx`, `hooks/usePrints.ts`

### 1.4. 詳細表示（原寸プレビュー）
- **概要**: 個別のプリントを原寸でプレビューします。
- **実装状況**: 完了
- **関連ファイル**: `components/DetailModal.tsx`

### 1.5. ダウンロード
- **概要**: 詳細表示からプリントをダウンロードします。
- **実装状況**: 完了
- **関連ファイル**: `components/DetailModal.tsx`

## 2. 認証機能
### 2.1. パスワードレスメールリンク認証
- **概要**: Supabase Authを利用したパスワードレス認証を提供します。
- **実装状況**: 完了
- **関連ファイル**: `lib/supabase.ts`

## 3. カテゴリー管理機能
### 3.1. カテゴリーの追加・編集
- **概要**: プリントに付与するカテゴリーの追加や編集を行います。
- **実装状況**: 完了
- **関連ファイル**: `components/CategoryEditor.tsx`, `supabase/migrations/*create_categories_table.sql`

## 4. データ永続化
### 4.1. Supabase Storageへのファイル保存
- **概要**: アップロードされたファイルをSupabase Storageに保存します。
- **実装状況**: 完了
- **関連ファイル**: `lib/storage.ts`

### 4.2. PostgreSQLへのメタデータ保存
- **概要**: プリントのメタデータ（ファイル名、カテゴリー、ユーザーIDなど）をSupabase PostgreSQLに保存します。
- **実装状況**: 完了
- **関連ファイル**: `lib/database.types.ts`, `supabase/migrations/*create_prints_table.sql`