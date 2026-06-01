import {Page} from '@playwright/test';
import { BASE_URL } from '../config';

export class SubjectsPage {
    constructor(private page: Page) {}

    async openSubjects() 
    {
        await this.page.getByRole('link', { name: 'Matérias Matérias' }).click();
        await this.page.getByRole('link', { name: 'Ver matérias' }).click();
    }

    async addSubjectSucesso() {
        await this.page.getByRole('button', { name: 'Adicionar matéria' }).click();
        await this.page.locator('#modalSubjectName').selectOption('Redação');
        await this.page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Maria');
        await this.page.locator('#modalSubjectSemester').selectOption('5');
        await this.page.getByRole('button', { name: 'Salvar matéria' }).click();
    }

    async editSubjectSucesso() {
        await this.page.getByRole('button', { name: 'Editar' }).nth(1).click();
        await this.page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('João');
        await this.page.getByRole('button', { name: 'Salvar alterações' }).click();
    }


    async addSubjectSemProfessor() {   
        await this.page.getByRole('button', { name: 'Adicionar matéria' }).click();
        await this.page.locator('#modalSubjectName').selectOption('Biologia');
        await this.page.locator('#modalSubjectSemester').selectOption('8');
        await this.page.getByRole('button', { name: 'Salvar matéria' }).click();
    }
}
