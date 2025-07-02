import { test, expect } from '@playwright/test';
import { generateTestEmail, login, register } from './helpers';

test.describe('Authentication', () => {
  const testPassword = 'Test123!@#';

  test('should register a new user', async ({ page }) => {
    const email = generateTestEmail();
    await register(page, email, testPassword);
    await expect(page.getByText('Account created successfully')).toBeVisible();
  });

  test('should not register with invalid email', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Email').fill('invalid-email');
    await page.getByLabel('Password').fill(testPassword);
    await page.getByLabel('Confirm Password').fill(testPassword);
    await page.getByRole('button', { name: /Create account/i }).click();
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should not register with weak password', async ({ page }) => {
    await page.goto('/register');
    await page.getByLabel('Email').fill(generateTestEmail());
    await page.getByLabel('Password').fill('weak');
    await page.getByLabel('Confirm Password').fill('weak');
    await page.getByRole('button', { name: /Create account/i }).click();
    await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    const email = generateTestEmail();
    await register(page, email, testPassword);
    await login(page, email, testPassword);
    await expect(page.getByText('Welcome back')).toBeVisible();
  });

  test('should not login with invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('nonexistent@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /Sign in/i }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const email = generateTestEmail();
    await register(page, email, testPassword);
    await login(page, email, testPassword);
    await page.getByRole('button', { name: /Logout/i }).click();
    await expect(page).toHaveURL('/');
  });
}); 