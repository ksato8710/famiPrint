'use client';

import Link from 'next/link';

export default function BackButton() {
  return (
    <Link href="/admin/tables" className="icon-button mr-2">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>
    </Link>
  );
}
