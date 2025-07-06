'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MasonryGrid from '@/components/MasonryGrid';

import Modal from '@/components/Modal';
import CategoryEditor from '@/components/CategoryEditor';
import { usePrints } from '@/hooks/usePrints';
import { PrintData } from '@/lib/storage';

// M3 Icon components
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>;

// Tab Component for Family Members
const FamilyTab = ({ text, selected, onClick }: { text: string; selected: boolean; onClick: () => void; }) => (
  <button 
    onClick={onClick}
    className={`family-tab ${selected ? 'selected' : ''}`}
  >
    {text}
    {selected && (
      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary transform scale-x-100 transition-transform duration-200" />
    )}
  </button>
);

// Chip Component for Categories
const CategoryChip = ({ text, selected, onClick }: { text: string; selected: boolean; onClick: () => void; }) => (
  <button 
    onClick={onClick}
    className={`category-chip ${selected ? 'selected' : ''}`}
  >
    {selected && <span className="check-icon-container"><CheckIcon /></span>}
    {text}
  </button>
);

export default function Home() {
  const router = useRouter();
  const [selectedPrint, setSelectedPrint] = useState<PrintData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryEditor, setShowCategoryEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const familyMembers = ['かえで', 'しおり', 'あん', 'ママ', 'パパ'];
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<string | null>(null);

  const { prints, isLoading, updateCategory, refreshPrints, categories } = usePrints(selectedFamilyMember);

  const handlePrintClick = (print: PrintData) => {
    console.log('handlePrintClick called for:', print.id);
    router.push(`/print/${print.id}`); // Navigate to detail page
    console.log('Attempting to navigate to:', `/print/${print.id}`);
  };

  const filteredByCategory = selectedCategory
    ? prints.filter(print => print.category_name === selectedCategory)
    : prints;

  const searchedPrints = searchTerm
    ? filteredByCategory.filter(print =>
        print.filename.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredByCategory;

  return (
    <div className="page-container">
      <main className="main-content">
        {/* Filters */}
        <div className="filters-section">
          {/* Family Tabs */}
          <section className="family-tabs-section">
            <div className="family-tabs-container">
              <FamilyTab text="全員" selected={selectedFamilyMember === null} onClick={() => setSelectedFamilyMember(null)} />
              {familyMembers.map(member => (
                <FamilyTab key={member} text={member} selected={selectedFamilyMember === member} onClick={() => setSelectedFamilyMember(member)} />
              ))}
            </div>
          </section>
          {/* Category Chips */}
          <section>
            <div className="category-chips-container">
              <CategoryChip key="all-categories" text="#すべて" selected={selectedCategory === null} onClick={() => setSelectedCategory(null)} />
              {categories.map(category => (
                <CategoryChip key={category.id} text={`#${category.name}`} selected={selectedCategory === category.name} onClick={() => setSelectedCategory(category.name)} />
              ))}
              <button onClick={() => setShowCategoryEditor(true)} className="category-manage-button">
                カテゴリ管理
              </button>
            </div>
          </section>
        </div>

        {/* Content */}
        <section className="content-section">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">読み込み中...</p>
            </div>
          ) : (
            <MasonryGrid prints={searchedPrints} onPrintClick={handlePrintClick} />
          )}
        </section>

        {/* Floating Action Button (FAB) */}
        <Link href="/upload">
          <div className="fab-button">
            <AddIcon />
          </div>
        </Link>

        {/* Modals */}
        <Modal isOpen={showCategoryEditor} onClose={() => setShowCategoryEditor(false)} title="カテゴリ管理">
          <CategoryEditor 
            onClose={() => setShowCategoryEditor(false)}
            existingCategories={categories}
            onCategoryUpdated={refreshPrints}
          />
        </Modal>
      </main>
    </div>
  );
}
