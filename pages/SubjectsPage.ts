import {Page} from '@playwright/test';
import { BASE_URL } from '../config';

export class SubjectsPage {
    readonly page: Page;
    readonly url: string;

    constructor(page: Page) {
        this.page = page;
        this.url = `${BASE_URL}/subjects`;
    }

    async goto() {
        await this.page.goto(this.url);
    }

}