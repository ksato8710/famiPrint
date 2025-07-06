import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/lib/supabase'; // Import once at the top
import { addCategory, getAllCategories, updateCategoryName, deleteCategory, uploadPrint, getAllPrints, updatePrintCategory, deletePrint as deletePrintFromStorage } from '@/lib/storage';

// Mock supabase client at the top level
vi.mock('@/lib/supabase', () => {
  const mockResponse = (data: any, error: any = null) => ({ data, error });

  // Factory to create a mock object that can be chained
  const createChainableMock = () => {
    const mock: any = {};

    // Methods that return 'this' for chaining
    const chainableMethods = ['insert', 'select', 'update', 'delete', 'eq', 'order'];
    chainableMethods.forEach(method => {
      mock[method] = vi.fn(() => mock); // Return itself for chaining
    });

    // Methods that resolve promises
    mock.single = vi.fn(() => Promise.resolve(mockResponse(null)));
    mock.upload = vi.fn(() => Promise.resolve(mockResponse(null)));
    mock.remove = vi.fn(() => Promise.resolve(mockResponse(null)));

    // Special case for getPublicUrl
    mock.getPublicUrl = vi.fn(() => ({ data: { publicUrl: '' } }));

    return mock;
  };

  const mockFrom = vi.fn((tableName) => createChainableMock());
  const mockStorageFrom = vi.fn(() => createChainableMock());

  return {
    supabase: {
      from: mockFrom,
      storage: {
        from: mockStorageFrom,
      },
    },
  };
});

describe('Category CRUD operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks for each test
    vi.mocked(supabase.from).mockClear();
    vi.mocked(supabase.storage.from).mockClear();
  });

  it('should add a new category', async () => {
    const mockCategory = { id: '1', name: 'Test Category', created_at: new Date().toISOString() };
    vi.mocked(supabase.from('categories').insert().select().single).mockResolvedValueOnce({ data: mockCategory, error: null });

    const category = await addCategory('Test Category');
    expect(category).toEqual(mockCategory);
    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(vi.mocked(supabase.from('categories').insert)).toHaveBeenCalledWith({ name: 'Test Category' });
  });

  it('should throw error if category already exists', async () => {
    vi.mocked(supabase.from('categories').insert().select().single).mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'Duplicate key' } });

    await expect(addCategory('Existing Category')).rejects.toThrow('Category already exists.');
  });

  it('should get all categories', async () => {
    const mockCategories = [
      { id: '1', name: 'Category A', created_at: new Date().toISOString() },
      { id: '2', name: 'Category B', created_at: new Date().toISOString() },
    ];
    vi.mocked(supabase.from('categories').select().order).mockResolvedValueOnce({ data: mockCategories, error: null });

    const categories = await getAllCategories();
    expect(categories).toEqual(mockCategories);
    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(vi.mocked(supabase.from('categories').select)).toHaveBeenCalledWith('*');
  });

  it('should update a category name', async () => {
    const updatedCategory = { id: '1', name: 'Updated Category', created_at: new Date().toISOString() };
    vi.mocked(supabase.from('categories').update().eq().select().single).mockResolvedValueOnce({ data: updatedCategory, error: null });

    const category = await updateCategoryName('1', 'Updated Category');
    expect(category).toEqual(updatedCategory);
    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(vi.mocked(supabase.from('categories').update)).toHaveBeenCalledWith({ name: 'Updated Category' });
    expect(vi.mocked(supabase.from('categories').update().eq)).toHaveBeenCalledWith('id', '1');
  });

  it('should delete a category and nullify prints', async () => {
    vi.mocked(supabase.from('prints').update().eq).mockResolvedValueOnce({ error: null });
    vi.mocked(supabase.from('categories').delete().eq).mockResolvedValueOnce({ error: null });

    const success = await deleteCategory('1');
    expect(success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('prints');
    expect(vi.mocked(supabase.from('prints').update)).toHaveBeenCalledWith({ category_id: null });
    expect(vi.mocked(supabase.from('prints').update().eq)).toHaveBeenCalledWith('category_id', '1');
    expect(supabase.from).toHaveBeenCalledWith('categories');
    expect(vi.mocked(supabase.from('categories').delete)).toHaveBeenCalled();
    expect(vi.mocked(supabase.from('categories').delete().eq)).toHaveBeenCalledWith('id', '1');
  });
});

describe('Print operations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mocks for each test
    vi.mocked(supabase.from).mockClear();
    vi.mocked(supabase.storage.from).mockClear();
  });

  it('should upload a print and save metadata', async () => {
    const mockFile = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const mockPublicUrl = 'http://example.com/test.jpg';
    const mockCategoryId = 'cat-123';
    const mockCategoryName = 'TestCategory';

    // Mock storage upload
    vi.mocked(supabase.storage.from('prints').upload).mockResolvedValue({ data: { path: 'test.jpg' }, error: null });
    vi.mocked(supabase.storage.from('prints').getPublicUrl).mockReturnValue({ data: { publicUrl: mockPublicUrl } });

    // Mock category fetch/create
    vi.mocked(supabase.from('categories').select().eq().single).mockResolvedValueOnce({ data: { id: mockCategoryId }, error: null }); // Category exists
    vi.mocked(supabase.from('categories').insert().select().single).mockResolvedValueOnce({ data: null, error: { code: '23505', message: 'Duplicate key' } }); // Simulate category already exists for the insert part
    vi.mocked(supabase.from('prints').insert().select()).mockResolvedValueOnce({ data: [{ id: 'print-1', url: mockPublicUrl }], error: null });

    const url = await uploadPrint(mockFile, 'Mom', mockCategoryName);
    expect(url).toBe(mockPublicUrl);
    expect(supabase.storage.from).toHaveBeenCalledWith('prints');
    expect(vi.mocked(supabase.storage.from('prints').upload)).toHaveBeenCalledWith(expect.any(String), mockFile, expect.any(Object));
    expect(supabase.from).toHaveBeenCalledWith('prints');
    expect(vi.mocked(supabase.from('prints').insert)).toHaveBeenCalledWith(expect.objectContaining({
      url: mockPublicUrl,
      filename: mockFile.name,
      family_member: 'Mom',
      category_id: mockCategoryId,
    }));
  });

  it('should get all prints', async () => {
    const mockPrints = [
      { id: '1', filename: 'a.jpg', category: { name: 'CatA' } },
      { id: '2', filename: 'b.jpg', category: { name: 'CatB' } },
    ];
    vi.mocked(supabase.from('prints').select().order).mockResolvedValueOnce({ data: mockPrints, error: null });

    const prints = await getAllPrints(null);
    expect(prints).toEqual([
      { id: '1', filename: 'a.jpg', category: { name: 'CatA' }, category_name: 'CatA' },
      { id: '2', filename: 'b.jpg', category: { name: 'CatB' }, category_name: 'CatB' },
    ]);
    expect(supabase.from).toHaveBeenCalledWith('prints');
    expect(vi.mocked(supabase.from('prints').select)).toHaveBeenCalledWith('*, category:categories(name)');
  });

  it('should update print category', async () => {
    vi.mocked(supabase.from('categories').select().eq().single).mockResolvedValueOnce({ data: { id: 'cat-123' }, error: null });
    vi.mocked(supabase.from('prints').update().eq().select()).mockResolvedValueOnce({ data: [{ id: 'print-1', category_id: 'cat-123' }], error: null });

    const success = await updatePrintCategory('print-1', 'NewCategory');
    expect(success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('prints');
    expect(vi.mocked(supabase.from('prints').update)).toHaveBeenCalledWith({ category_id: 'cat-123' });
    expect(vi.mocked(supabase.from('prints').update().eq)).toHaveBeenCalledWith('id', 'print-1');
  });

  it('should delete a print', async () => {
    const mockPrint = { id: 'print-1', filename: 'test.jpg', url: 'http://example.com/test.jpg' };
    vi.mocked(supabase.from('prints').select().eq().single).mockResolvedValueOnce({ data: mockPrint, error: null });
    vi.mocked(supabase.from('prints').delete().eq).mockResolvedValueOnce({ error: null });
    vi.mocked(supabase.storage.from('prints').remove).mockResolvedValueOnce({ error: null });

    const success = await deletePrintFromStorage('print-1');
    expect(success).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('prints');
    expect(vi.mocked(supabase.from('prints').select)).toHaveBeenCalledWith('filename, url');
    expect(vi.mocked(supabase.from('prints').select().eq)).toHaveBeenCalledWith('id', 'print-1');
    expect(supabase.storage.from).toHaveBeenCalledWith('prints');
    expect(vi.mocked(supabase.storage.from('prints').remove)).toHaveBeenCalledWith(['test.jpg']);
    expect(vi.mocked(supabase.from('prints').delete)).toHaveBeenCalled();
    expect(vi.mocked(supabase.from('prints').delete().eq)).toHaveBeenCalledWith('id', 'print-1');
  });
});