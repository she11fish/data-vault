import { test, expect } from '@playwright/test';
import { generateTestEmail, login, register } from './helpers';

test.describe('Navigation and Layout', () => {
  const testPassword = 'Test123!@#';
  let userEmail: string;

  test.beforeEach(async ({ page }) => {
    userEmail = generateTestEmail();
  });

  test('should navigate to all public pages', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    await page.getByRole('link', { name: /Login/i }).click();
    await expect(page).toHaveURL('/login');
    
    await page.getByRole('link', { name: /Register/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should maintain authentication state across navigation', async ({ page }) => {
    await register(page, userEmail, testPassword);
    await login(page, userEmail, testPassword);
    
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
    
    await page.goto('/');
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should have responsive navigation menu', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
    await page.getByRole('button', { name: /menu/i }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should toggle theme', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    
    // Toggle to dark mode
    await themeToggle.click();
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
    
    // Toggle back to light mode
    await themeToggle.click();
    await expect(page.locator('html')).not.toHaveAttribute('class', /dark/);
  });

  test('should show appropriate navigation items based on auth state', async ({ page }) => {
    // Unauthenticated
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Login/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Register/i })).toBeVisible();
    
    // Authenticated
    await register(page, userEmail, testPassword);
    await login(page, userEmail, testPassword);
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Dashboard/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Logout/i })).toBeVisible();
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByText(/page not found/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /back to home/i })).toBeVisible();
  });
}); 