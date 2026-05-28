import { test, expect } from '@playwright/test';
import { SubjectsPage } from '../pages/SubjectsPage';

test.describe('CRUD de matérias', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('${BASE_URL}/subjects');
    });
});

test('Criar matéria válida', async ({ page }) => {
    await page.click('text=Adicionar matéria');
    await page.selectOption('#modalSubjectName', {label:'Matemática'});
    await page.selectOption('#modalSubjectAbreviation', {label:'MAT'});
    await page.fill('#modalSubjectTeacher', 'Professor de Matemática');
    await page.selectOption('#modalSubjectSemester', {label:'1º Semestre'});
    await page.click('text=Salvar matéria');

    await expect(page.getByText('Matemática')).toBeVisible();
});

test('Editar matéria existente', async ({ page }) => {
    await page.click('text=Editar');
    await page.selectOption('#modalSubjectTeacher', 'Professor de Matemática Atualizado');
    await page.click('text=Salvar alterações');
    await expect(page.getByText('Professor de Matemática Atualizado')).toBeVisible();
});


test('Erro ao criar matéria sem preencher campos', async ({ page }) => {
    await page.click('text=Adicionar matéria');
    await page.click('text=Salvar matéria');

    await expect(page.getByText('Selecione ou informe a matéria')).toBeVisible();
    await expect(page.getByText('Selecione ou informe o código')).toBeVisible();
    await expect(page.getByText('Informe o nome do professor')).toBeVisible();
    await expect(page.getByText('Selecione ou informe o semestre')).toBeVisible();
});

test('Erro ao tentar deletar matéria inexistente', async ({ page }) => {
    await page.goto('${BASE_URL}/subjects/delete/9999');
    await expect(page.locator('text=404')).toBeVisible();
});