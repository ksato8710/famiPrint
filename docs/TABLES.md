# FamiPrint Application Tables

This document lists the core database tables used by the FamiPrint application, identified through migration files and TypeScript type definitions.

## Table List

### `prints`

Stores information about uploaded prints, including their URL, filename, upload timestamp, and associated metadata. It also links to the `categories` table and includes user and family member information.

**Columns:**
- `id` (UUID): Primary key, unique identifier for each print.
- `url` (TEXT): URL where the print image/document is stored.
- `filename` (TEXT): Original filename of the uploaded print.
- `uploaded_at` (TIMESTAMPTZ): Timestamp when the print was uploaded.
- `metadata` (JSONB): Additional metadata in JSON format.
- `user_id` (UUID): ID of the user who uploaded the print (references `auth.users`).
- `family_member` (TEXT): Name or identifier of the family member associated with the print.
- `category_id` (UUID): Foreign key referencing the `categories` table.

### `categories`

Stores categories for organizing prints. Each category has a unique name.

**Columns:**
- `id` (UUID): Primary key, unique identifier for each category.
- `name` (TEXT): Unique name of the category (e.g., "School", "Cram School").
- `created_at` (TIMESTAMPTZ): Timestamp when the category was created.
