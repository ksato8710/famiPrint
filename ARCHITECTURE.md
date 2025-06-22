@startuml
Browser -> Next.js : CSR/SSR
Next.js --> Supabase Auth : JWT (email link)
Next.js --> Supabase Storage : signed URL (prints バケット)
Next.js --> Supabase Postgres : REST RPC (prints テーブル)
@enduml

ディレクトリ構成（抜粋）
src/
  app/
    page.tsx            # 一覧
    upload/page.tsx     # アップロード
    print/[id]/page.tsx # 詳細
  components/
    UploadForm.tsx
    PrintCard.tsx
    DetailModal.tsx
  features/print/
    hooks.ts            # CRUD ヘルパ
    types.ts
lib/
  supabase.ts           # createClient ラッパ
public/
  icons/*               # アイコン類