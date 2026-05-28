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

    async createSubject(nameId: string, abreviationId: string, teacher: string, semesterId: string) {
        await this.page.click('text=Adicionar matéria');
        await this.page.selectOption('#modalSubjectName', nameId);
        await this.page.selectOption('#modalSubjectAbreviation', abreviationId);
        await this.page.fill('#modalSubjectTeacher', teacher);
        await this.page.selectOption('#modalSubjectSemester', semesterId);
        await this.page.click('text=Salvar matéria');
    }
}