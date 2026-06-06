import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

test.describe.serial('CRUD de trabalhos', () => {
  test.describe('Casos felizes', () => {

    test('O usuário pode cadastrar um trabalho com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Pesquisa de geografia');
      await page.locator('#workDueDate').fill('2026-06-20');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      await expect(page.getByRole('cell', { name: 'Pesquisa de geografia' }).first()).toBeVisible();
    });

  });

  test.describe('Casos tristes', () => {
    test('O usuário não pode cadastrar um trabalho sem tipo', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Redação');
      await page.locator('#workDueDate').fill('2026-06-20');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      await expect(page.locator('td', { hasText: 'Redação' })).not.toBeVisible();
    });

    test('O usuário não pode cadastrar um trabalho sem nome', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.locator('#workDueDate').fill('2026-06-20');
      await page.getByRole('button', { name: 'Salvar Trabalho'}).click();
      await expect( page.getByRole('button', { name: 'Salvar Trabalho' })).toBeVisible();
    });

    test('O usuário não pode cadastrar um trabalho sem data de entrega', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Redação');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      await expect(page.locator('td', { hasText: 'Redação' })).not.toBeVisible();
    });

  });

  test.describe('Casos de borda', () => {
    test('O usuário não pode cadastrar um trabalho pendente com data de entrega no passado', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Sociologia');
      await page.locator('#workDueDate').fill('2026-04-20');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      await expect(page.locator('td', { hasText: 'Sociologia' })).not.toBeVisible();
    });

    test('O campo de nome do trabalho deve aceitar no máximo 100 caracteres', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('A'.repeat(101));
      await page.locator('#workDueDate').fill('2026-06-20');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      await expect(page.locator('td', { hasText: 'A'.repeat(101) })).not.toBeVisible();
    });
  });
});