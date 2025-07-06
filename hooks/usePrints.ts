'use client';

import { useState, useEffect, useCallback } from 'react';
import { PrintData, getAllPrints, updatePrintCategory, deletePrint, getAllCategories, Category } from '@/lib/storage';

export function usePrints(selectedFamilyMember: string | null) {
  const [prints, setPrints] = useState<PrintData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadPrints = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // 全てのプリントを取得し、そこからカテゴリを抽出
      const allPrints = await getAllPrints(null);
      setPrints(allPrints.reverse()); // 新しい順に表示

      // Extract unique categories
      const allCategories = await getAllCategories();
      setCategories(allCategories); // Add this line
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prints');
      console.error('Failed to load prints:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (printId: string, categoryName: string | null) => {
    try {
      const success = await updatePrintCategory(printId, categoryName);
      if (success) {
        setPrints(prevPrints => 
          prevPrints.map(print => 
            print.id === printId ? { ...print, category_name: categoryName } : print
          )
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update category:', err);
      return false;
    }
  }, []);

  const removePrint = useCallback(async (printId: string) => {
    try {
      const success = await deletePrint(printId);
      if (success) {
        setPrints(prevPrints => prevPrints.filter(print => print.id !== printId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete print:', err);
      return false;
    }
  }, []);

  const refreshPrints = useCallback(() => {
    loadPrints();
  }, [loadPrints]);

  useEffect(() => {
    loadPrints();
  }, [loadPrints]);

  return {
    prints,
    isLoading,
    error,
    updateCategory,
    removePrint,
    refreshPrints,
    categories,
  };
}
