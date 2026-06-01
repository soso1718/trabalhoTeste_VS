import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

async function globalSetup() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://studylab.free.laravel.cloud/login');
    await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill(process.env.TEST_EMAIL!);
    await page.getByRole('textbox', { name: '••••••••' }).fill(process.env.TEST_PASSWORD!);
    await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
    await page.waitForTimeout(3000);
    await context.storageState({ path: 'auth.json' });
    await browser.close();
}

export default globalSetup;