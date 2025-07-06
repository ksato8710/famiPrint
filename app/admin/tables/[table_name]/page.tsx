import BackButton from '@/components/BackButton';
import TableContent from '@/components/TableContent';

export default function TableContentPage() {
  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <BackButton />
        <h1 className="text-2xl font-bold">Table Details</h1>
      </div>
      <TableContent />
    </div>
  );
}