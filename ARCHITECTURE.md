@startuml
Browser -> Next.js : CSR/SSR
Next.js --> Supabase Auth : JWT (email link)
Next.js --> Supabase Storage : signed URL (prints バケット)
Next.js --> Supabase Postgres : REST RPC (prints テーブル)
@enduml

ディレクトリ構成（抜粋）
app/
  page.tsx            # 一覧
  upload/page.tsx     # アップロード
  print/[id]/page.tsx # 詳細
components/
  UploadForm.tsx
  PrintCard.tsx
  DetailModal.tsx
hooks/
  usePrints.ts        # CRUD ヘルパ
lib/
  storage.ts          # Supabase Storage ラッパー
public/
  icons/*               # アイコン類