1. プロジェクト初期化
Claude プロンプト: Next.js15 TS プロジェクト「FamiPrint」を作成し、origin に push

2. UploadForm UI
プロンプト: components/UploadForm.tsx を実装。Props: onUploaded(urls:string[])

3. Storage ラッパー実装
プロンプト: lib/storage.ts に uploadPrint(file):Promise<string> を追加

4. ホーム画面（一覧）
プロンプト: app/page.tsx に Masonry レイアウトでプリント一覧を表示

5. 詳細モーダル
プロンプト: DetailModal を追加し、原寸プレビューとダウンロードボタンを実装

6. カテゴリー登録機能
プロンプト: prints テーブルに category 列を追加し、CRUD hooks を作成

7. Vercel へのデプロイ
手動または Claude 指示で vercel --prod を実行し、本番 URL を発行

8. バグ修正バッチ
プロンプト: Issue #1-#N を修正

9. PWA 化
プロンプト: next-pwa で manifest と icons を追加