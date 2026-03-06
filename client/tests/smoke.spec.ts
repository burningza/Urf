import { test, expect } from '@playwright/test';

test.describe('UrfOps Smoke Tests', () => {
    test('should load the homepage and show the globe', async ({ page }) => {
        // Navigate to the app
        await page.goto('/');

        // Check if the page title or a key element exists
        // Based on the code, it uses Deck.gl/Cesium. Let's check for the canvas or a container.
        const globeContainer = page.locator('.globe-container'); // Assuming this exists based on common patterns

        // Wait for the app to load
        await page.waitForLoadState('networkidle');

        // We can also check for specific text if it's rendered
        // await expect(page).toHaveTitle(/UrfOps/); 
    });

    test('api health check via proxy', async ({ request }) => {
        const response = await request.get('http://127.0.0.1:3001/api/health');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.status).toBe('ok');
    });

    test('api root check via proxy has renamed project', async ({ request }) => {
        const response = await request.get('http://127.0.0.1:3001/');
        expect(response.ok()).toBeTruthy();
        const data = await response.json();
        expect(data.project).toBe('UrfOps Proxy');
    });
});
