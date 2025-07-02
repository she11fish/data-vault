import { expect, type Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /Sign in/i }).click();
  await expect(page).toHaveURL('/dashboard');
}

export async function register(page: Page, email: string, password: string) {
  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByLabel('Confirm Password').fill(password);
  await page.getByRole('button', { name: /Create account/i }).click();
  await expect(page).toHaveURL('/login');
}

export async function uploadFile(page: Page, filePath: string) {
  await page.goto('/dashboard');
  const fileInput = await page.getByLabel('Upload file');
  await fileInput.setInputFiles(filePath);
  await expect(page.getByText('Upload successful')).toBeVisible();
}

export async function convertFile(page: Page, fileId: string) {
  await page.goto(`/dashboard`);
  await page.getByRole('button', { name: /Convert/i }).click();
  await expect(page.getByText('Conversion successful')).toBeVisible();
}

export async function deleteFile(page: Page, fileId: string) {
  await page.goto(`/dashboard`);
  await page.getByRole('button', { name: /Delete/i }).click();
  await page.getByRole('button', { name: /Confirm/i }).click();
  await expect(page.getByText('File deleted successfully')).toBeVisible();
}

export function generateTestEmail() {
  return `test-${Date.now()}@example.com`;
} 