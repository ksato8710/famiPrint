import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePrints } from '@/hooks/usePrints';
import * as storage from '@/lib/storage';

// Mock the storage functions
vi.mock('@/lib/storage', () => ({
  getAllPrints: vi.fn(),
  updatePrintCategory: vi.fn(),
  deletePrint: vi.fn(),
  getAllCategories: vi.fn(),
}));

describe('usePrints', () => {
  const originalMockPrints = [
    { id: '1', filename: 'print1.jpg', category_name: 'School', family_member: 'John', created_at: '2023-01-01T00:00:00Z', url: 'http://example.com/print1.jpg' },
    { id: '2', filename: 'print2.pdf', category_name: 'Home', family_member: 'Jane', created_at: '2023-01-02T00:00:00Z', url: 'http://example.com/print2.pdf' },
  ];

  const mockCategories = [
    { id: 'cat1', name: 'School' },
    { id: 'cat2', name: 'Home' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Ensure a fresh copy of mockPrints for each test to avoid mutation issues
    vi.mocked(storage.getAllPrints).mockResolvedValue([...originalMockPrints]);
    vi.mocked(storage.getAllCategories).mockResolvedValue(mockCategories);
  });

  it('should return initial state correctly', () => {
    const { result } = renderHook(() => usePrints(null));

    expect(result.current.prints).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.categories).toEqual([]);
  });

  it('should load prints and categories on mount', async () => {
    const { result } = renderHook(() => usePrints(null));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(storage.getAllPrints).toHaveBeenCalledTimes(1);
    expect(storage.getAllCategories).toHaveBeenCalledTimes(1);
    // Expect prints to be reversed as per hook logic
    expect(result.current.prints).toEqual([...originalMockPrints].reverse());
    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.error).toBeNull();
  });

  it('should handle error when loading prints', async () => {
    const errorMessage = 'Failed to fetch prints';
    vi.mocked(storage.getAllPrints).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => usePrints(null));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.prints).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
  });

  it('should update print category successfully', async () => {
    vi.mocked(storage.updatePrintCategory).mockResolvedValue(true);

    const { result } = renderHook(() => usePrints(null));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Find the print to update by ID from the current state
    const printToUpdateId = result.current.prints[0].id; // Assuming the first print in the reversed list
    const newCategory = 'Updated Category';

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.updateCategory(printToUpdateId, newCategory);
    });

    expect(success).toBe(true);
    expect(storage.updatePrintCategory).toHaveBeenCalledWith(printToUpdateId, newCategory);

    // Find the updated print in the current state and assert its category_name
    const updatedPrint = result.current.prints.find(p => p.id === printToUpdateId);
    expect(updatedPrint?.category_name).toBe(newCategory);
  });

  it('should handle error when updating print category', async () => {
    vi.mocked(storage.updatePrintCategory).mockResolvedValue(false); // Simulate failure

    const { result } = renderHook(() => usePrints(null));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const initialPrints = [...result.current.prints]; // Deep copy to compare
    const printToUpdateId = initialPrints[0].id;
    const newCategory = 'Updated Category';

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.updateCategory(printToUpdateId, newCategory);
    });

    expect(success).toBe(false);
    expect(storage.updatePrintCategory).toHaveBeenCalledWith(printToUpdateId, newCategory);
    expect(result.current.prints).toEqual(initialPrints); // State should not change on failure
  });

  it('should remove print successfully', async () => {
    vi.mocked(storage.deletePrint).mockResolvedValue(true);

    const { result } = renderHook(() => usePrints(null));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const initialPrintsCount = result.current.prints.length;
    const printToRemoveId = result.current.prints[0].id; // Assuming the first print in the reversed list

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.removePrint(printToRemoveId);
    });

    expect(success).toBe(true);
    expect(storage.deletePrint).toHaveBeenCalledWith(printToRemoveId);
    expect(result.current.prints.length).toBe(initialPrintsCount - 1);
    expect(result.current.prints.find(p => p.id === printToRemoveId)).toBeUndefined();
  });

  it('should handle error when removing print', async () => {
    vi.mocked(storage.deletePrint).mockResolvedValue(false); // Simulate failure

    const { result } = renderHook(() => usePrints(null));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const initialPrints = [...result.current.prints]; // Deep copy
    const printToRemoveId = initialPrints[0].id;

    let success: boolean | undefined;
    await act(async () => {
      success = await result.current.removePrint(printToRemoveId);
    });

    expect(success).toBe(false);
    expect(storage.deletePrint).toHaveBeenCalledWith(printToRemoveId);
    expect(result.current.prints).toEqual(initialPrints); // State should not change on failure
  });

  it('should refresh prints when refreshPrints is called', async () => {
    const { result } = renderHook(() => usePrints(null));
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    vi.mocked(storage.getAllPrints).mockClear(); // Clear mock calls after initial load
    vi.mocked(storage.getAllCategories).mockClear();

    await act(async () => {
      result.current.refreshPrints();
    });

    await waitFor(() => expect(storage.getAllPrints).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(storage.getAllCategories).toHaveBeenCalledTimes(1));
  });
});