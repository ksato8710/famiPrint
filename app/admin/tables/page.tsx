'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Table {
  table_name: string;
}

export default function AdminPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const appTables = [
      { table_name: 'prints' },
      { table_name: 'categories' },
    ];
    setTables(appTables);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-4">Loading tables...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Tables</h1>
      <ul>
        {tables.map((table) => (
          <li key={table.table_name} className="mb-2">
            <Link href={`/admin/tables/${table.table_name}`} className="text-blue-600 hover:underline">
              {table.table_name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
