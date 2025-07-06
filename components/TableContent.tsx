'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

export default function TableContent() {
  const params = useParams();
  const tableName = params.table_name as string;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!tableName) return;

      try {
        const { data: tableData, error: tableError } = await supabase
          .from(tableName)
          .select('*');

        if (tableError) {
          throw tableError;
        }
        setData(tableData || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [tableName]);

  if (loading) {
    return <div className="p-4">Loading data from {tableName}...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div className="p-4">No data found in {tableName}.</div>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => (
                <td key={`${rowIndex}-${col}`} className={col === 'url' ? 'url-column' : ''}>
                  {JSON.stringify(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
