import type { Page } from '@playwright/test';
import { BASE_URL } from '../config';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async login(email: string, password: string) {
        await this.page.goto(`${BASE_URL}/login`);
        await this.page.type('input[id="email"]', email);
        await this.page.type('input[id="password"]', password);
        await this.page.waitForTimeout(1000);
        await this.page.click('button[id="submitBtn"]');
        await this.page.waitForTimeout(2000);
    }
}