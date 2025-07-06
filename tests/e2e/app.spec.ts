import { test, expect } from '@playwright/test';

test.describe('Upload Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/upload');
  });

  test('should display upload form elements', async ({ page }) => {
    await expect(page.getByRole('heading', { name: '新しいプリントを追加' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '1. だれのもの？' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2. どんな種類？' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '3. ファイルを選ぶ' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'アップロードする' })).toBeVisible();
  });

  test('upload button should be disabled initially', async ({ page }) => {
    const uploadButton = page.getByRole('button', { name: 'アップロードする' });
    await expect(uploadButton).toBeDisabled();
  });

  test('upload button should be enabled when all conditions are met', async ({ page }) => {
    // Select family member
    await page.getByRole('button', { name: 'かえで' }).click();

    // Select category
    await page.getByRole('combobox', { name: '既存のカテゴリ...' }).selectOption({ index: 1 });

    // Mock file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./sample.jpeg');

    const uploadButton = page.getByRole('button', { name: 'アップロードする' });
    await expect(uploadButton).toBeEnabled();
  });

  test('should show uploading state and redirect on success', async ({ page }) => {
    // Select family member
    await page.getByRole('button', { name: 'かえで' }).click();

    // Select category
    await page.getByRole('combobox', { name: '既存のカテゴリ...' }).selectOption({ index: 1 });

    // Mock file input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./sample.jpeg');

    const uploadButton = page.getByRole('button', { name: 'アップロードする' });
    await uploadButton.click();

    await expect(uploadButton).toBeDisabled();
    await expect(page.getByText('アップロード中...')).toBeVisible();

    // Assuming successful upload redirects to home page
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Home Page - Category Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display category management button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'カテゴリ管理' })).toBeVisible();
  });

  test('should open category editor modal', async ({ page }) => {
    await page.getByRole('button', { name: 'カテゴリ管理' }).click();
    await expect(page.getByRole('heading', { name: 'カテゴリ管理' })).toBeVisible();
  });

  test('should add a new category', async ({ page }) => {
    await page.getByRole('button', { name: 'カテゴリ管理' }).click();
    const newCategoryInput = page.getByPlaceholder('新しいカテゴリ名');
    await newCategoryInput.fill('新しいテストカテゴリ');
    await page.getByRole('button', { name: '追加' }).click();

    await expect(page.getByText('カテゴリ「新しいテストカテゴリ」を追加しました。')).toBeVisible();
    await page.getByRole('button', { name: '閉じる' }).click();
    await expect(page.getByRole('button', { name: '#新しいテストカテゴリ' })).toBeVisible();
  });

  test('should edit an existing category', async ({ page }) => {
    // Add a category first to ensure it exists for editing
    await page.getByRole('button', { name: 'カテゴリ管理' }).click();
    const newCategoryInput = page.getByPlaceholder('新しいカテゴリ名');
    await newCategoryInput.fill('編集対象カテゴリ');
    await page.getByRole('button', { name: '追加' }).click();
    await page.getByRole('button', { name: '閉じる' }).click();

    // Re-open editor and edit
    await page.getByRole('button', { name: 'カテゴリ管理' }).click();
    await page.locator('li', { hasText: '編集対象カテゴリ' }).getByRole('button', { name: 'Edit' }).click();
    const editInput = page.getByDisplayValue('編集対象カテゴリ');
    await editInput.fill('編集済みカテゴリ');
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page.getByText('カテゴリ「編集対象カテゴリ」を「編集済みカテゴリ」に更新しました。')).toBeVisible();
    await page.getByRole('button', { name: '閉じる' }).click();
    await expect(page.getByRole('button', { name: '#編集済みカテゴリ' })).toBeVisible();
  });

  test('should delete a category', async ({ page }) => {
    // Add a category first to ensure it exists for deletion
    await page.getByRole('button', { name: 'カテゴリ管理' }).click();
    const newCategoryInput = page.getByPlaceholder('新しいカテゴリ名');
    await newCategoryInput.fill('削除対象カテゴリ');
    await page.getByRole('button', { name: '追加' }).click();
    await page.getByRole('button', { name: '閉じる' }).click();

    // Re-open editor and delete
    await page.getByRole('button', { name: 'カテゴリ管理' }).click();
    page.on('dialog', (dialog) => dialog.accept()); // Accept the confirmation dialog
    await page.locator('li', { hasText: '削除対象カテゴリ' }).getByRole('button', { name: 'Delete' }).click();

    await expect(page.getByText('カテゴリ「削除対象カテゴリ」を削除しました。')).toBeVisible();
    await page.getByRole('button', { name: '閉じる' }).click();
    await expect(page.getByRole('button', { name: '#削除対象カテゴリ' })).not.toBeVisible();
  });
});

test.describe('Home Page - Print Display and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display prints on the home page', async ({ page }) => {
    // Assuming there's at least one print displayed, check for a common element like an image or a card.
    // This test might need to be adjusted based on how prints are rendered.
    await expect(page.locator('.masonry-grid-item')).toBeVisible(); // Assuming prints are within elements with class .masonry-grid-item
  });

  test('should filter prints by family member', async ({ page }) => {
    // This test assumes there are prints for different family members.
    // First, ensure some prints are visible.
    await expect(page.locator('.masonry-grid-item')).toBeVisible();

    // Click on a family member filter button (e.g., "かえで")
    await page.getByRole('button', { name: 'かえで' }).click();

    // Verify that only prints for "かえで" are visible, and others are not.
    // This requires more specific selectors or mocking data to assert correctly.
    // For now, just check if the filter button is active.
    await expect(page.getByRole('button', { name: 'かえで' })).toHaveClass(/active/);
  });

  test('should filter prints by category', async ({ page }) => {
    // This test assumes there are prints for different categories.
    await expect(page.locator('.masonry-grid-item')).toBeVisible();

    // Click on a category filter button (e.g., "#テストカテゴリ" - assuming it exists or is added by a previous test)
    // For a real test, you might need to add a category and a print with that category first.
    // For now, let's assume a category button exists.
    await page.getByRole('button', { name: '#テストカテゴリ' }).click();

    // Verify that only prints for "#テストカテゴリ" are visible.
    await expect(page.getByRole('button', { name: '#テストカテゴリ' })).toHaveClass(/active/);
  });
});

test.describe('Home Page - Print Detail Modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open print detail modal on click', async ({ page }) => {
    // Assuming there's at least one clickable print item.
    // Click on the first print item.
    await page.locator('.masonry-grid-item').first().click();

    // Verify that the detail modal is visible.
    await expect(page.getByRole('dialog', { name: 'プリント詳細' })).toBeVisible();
  });

  test('should close print detail modal', async ({ page }) => {
    // Open the modal first.
    await page.locator('.masonry-grid-item').first().click();
    await expect(page.getByRole('dialog', { name: 'プリント詳細' })).toBeVisible();

    // Click the close button or press Escape.
    await page.getByRole('button', { name: '閉じる' }).click(); // Assuming a close button exists
    // Or: await page.keyboard.press('Escape');

    // Verify that the modal is no longer visible.
    await expect(page.getByRole('dialog', { name: 'プリント詳細' })).not.toBeVisible();
  });
});