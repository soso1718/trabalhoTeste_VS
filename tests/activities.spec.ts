import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

test.describe.serial('CRUD de atividades', () => {

    test.describe('Casos felizes', () => {
        test('Criar uma nova atividade com dados válidos', async ({ page }) => {
            await page.goto(`${BASE_URL}/activities`);
            await page.getByRole('button', { name: 'Nova atividade' }).click();
            await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('oi');
            await page.locator('#modalSubjectId').selectOption('16');
            await page.locator('#modalDueDateQuick').selectOption('3dias');
            await page.getByRole('button', { name: 'Salvar atividade' }).click();
            await expect(page.getByRole('button', { name: 'Nova atividade' })).toBeVisible();
        });

        test('Editar uma atividade existente', async ({ page }) => {
            await page.goto(`${BASE_URL}/activities`);
            await page.getByRole('button', { name: 'Editar' }).first().click();
            await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('ei');
            await page.locator('#modalStatus').selectOption('completed');
            await page.getByRole('button', { name: 'Salvar alterações' }).click();
        });
    });

    test.describe('Casos tristes', () => {
        test('Não deve criar atividade sem descrição', async ({ page }) => {
            await page.goto(`${BASE_URL}/activities`);
            await page.getByRole('button', { name: 'Nova atividade' }).click();
            await page.getByRole('button', { name: 'Salvar atividade' }).click();
            await expect(page.getByRole('button', { name: 'Salvar atividade' })).toBeVisible();
        });

        test('Não deve criar atividade sem data de vencimento', async ({ page }) => {
            await page.goto(`${BASE_URL}/activities`);
            await page.getByRole('button', { name: 'Nova atividade' }).click();
            await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('oi');
            await page.getByRole('button', { name: 'Salvar atividade' }).click();
            await expect(page.getByRole('button', { name: 'Salvar atividade' })).toBeVisible();
        });
    });

    test.describe('Casos de borda', () => {
        test('Criar atividade com descrição muito longa', async ({ page }) => {
            await page.goto(`${BASE_URL}/activities`);
            await page.getByRole('button', { name: 'Nova atividade' }).click();
            await page.getByRole('textbox', { name: 'Ex: Fazer exercícios do capí' }).fill('a'.repeat(255));
            await page.locator('#modalSubjectId').selectOption('16');
            await page.locator('#modalDueDateQuick').selectOption('3dias');
            await page.getByRole('button', { name: 'Salvar atividade' }).click();
            await expect(page.getByRole('button', { name: 'Nova atividade' })).toBeVisible();
        });

        test('Excluir uma atividade existente', async ({ page }) => {
            await page.goto(`${BASE_URL}/activities`);
            await page.getByRole('button', { name: 'Excluir' }).first().click();
            await page.getByRole('button', { name: 'Sim, excluir' }).click();
            await expect(page.getByRole('button', { name: 'Nova atividade' })).toBeVisible();
        });
    });

});