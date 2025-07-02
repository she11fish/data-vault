import { test, expect } from '@playwright/test';
import { generateTestEmail, login, register, uploadFile, convertFile, deleteFile } from './helpers';
import path from 'path';

test.describe('Data Management', () => {
  const testPassword = 'Test123!@#';
  let userEmail: string;

  test.beforeEach(async ({ page }) => {
    userEmail = generateTestEmail();
    await register(page, userEmail, testPassword);
    await login(page, userEmail, testPassword);
  });

  test('should upload a file', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../public/placeholder.jpg');
    await uploadFile(page, testFilePath);
    await expect(page.getByText('placeholder.jpg')).toBeVisible();
  });

  test('should not upload invalid file type', async ({ page }) => {
    await page.goto('/dashboard');
    const fileInput = await page.getByLabel('Upload file');
    await fileInput.setInputFiles({
      name: 'test.invalid',
      mimeType: 'application/octet-stream',
      buffer: Buffer.from('test content'),
    });
    await expect(page.getByText('Invalid file type')).toBeVisible();
  });

  test('should convert an image file', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../public/placeholder.jpg');
    await uploadFile(page, testFilePath);
    await page.getByRole('button', { name: /Convert/i }).first().click();
    await expect(page.getByText('Conversion successful')).toBeVisible();
  });

  test('should delete a file', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../public/placeholder.jpg');
    await uploadFile(page, testFilePath);
    const fileName = 'placeholder.jpg';
    await page.getByRole('button', { name: new RegExp(`Delete ${fileName}`, 'i') }).click();
    await page.getByRole('button', { name: /Confirm/i }).click();
    await expect(page.getByText(fileName)).not.toBeVisible();
  });

  test('should display file details', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../public/placeholder.jpg');
    await uploadFile(page, testFilePath);
    await page.getByText('placeholder.jpg').click();
    await expect(page.getByRole('heading', { name: 'File Details' })).toBeVisible();
    await expect(page.getByText('placeholder.jpg')).toBeVisible();
    await expect(page.getByText(/Upload Date/)).toBeVisible();
  });

  test('should list all uploaded files', async ({ page }) => {
    const testFiles = ['placeholder.jpg', 'placeholder.svg'];
    for (const file of testFiles) {
      const testFilePath = path.join(__dirname, '../public', file);
      await uploadFile(page, testFilePath);
    }
    for (const file of testFiles) {
      await expect(page.getByText(file)).toBeVisible();
    }
  });

  test('should handle file conversion errors gracefully', async ({ page }) => {
    // Upload a file that will cause conversion error
    const testFilePath = path.join(__dirname, '../public/placeholder.svg');
    await uploadFile(page, testFilePath);
    await page.getByRole('button', { name: /Convert/i }).first().click();
    await expect(page.getByText(/Error converting file/)).toBeVisible();
  });

  test('should show loading state during file operations', async ({ page }) => {
    const testFilePath = path.join(__dirname, '../public/placeholder.jpg');
    await page.goto('/dashboard');
    const fileInput = await page.getByLabel('Upload file');
    await fileInput.setInputFiles(testFilePath);
    await expect(page.getByRole('progressbar')).toBeVisible();
    await expect(page.getByText('Upload successful')).toBeVisible();
  });
}); 