import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

async function deletarTodosSeExistir(page: any, nome: string) {
  while (true) {
    const linha = page.locator('tr', { hasText: nome }).first();
    if (!(await linha.isVisible())) break;
    await linha.getByRole('button', { name: 'Excluir' }).click();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();
    await page.waitForTimeout(1000);
  }
}

test.describe.serial('CRUD de trabalhos', () => {
  test.describe('Casos felizes', () => {
    test('O usuário pode excluir um trabalho com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await deletarTodosSeExistir(page, 'Relatório de física');
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Relatório de física');
      await page.locator('#workDueDate').fill('2026-06-20');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      const linha = page.locator('tr', { hasText: 'Relatório de física' }).first();
      await linha.waitFor({ state: 'visible', timeout: 15000 });
      await linha.getByRole('button', { name: 'Excluir' }).click();
      await page.getByRole('button', { name: 'Sim, excluir' }).click();
      await expect(page.locator('td', { hasText: 'Relatório de física' }).first()).not.toBeVisible();
    });

    test('O usuário pode cadastrar um trabalho com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Pesquisa de geografia');
      await page.locator('#workDueDate').fill('2026-06-20');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      await expect(page.getByRole('cell', { name: 'Pesquisa de geografia' }).first()).toBeVisible();
    });

    test('O usuário pode editar um trabalho com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/works`);
      await page.getByRole('button', { name: 'Novo trabalho' }).click();
      await page.locator('#workType').selectOption('Seminário');
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Pesquisa de biologia');
      await page.locator('#workDueDate').fill('2026-06-20');
      await page.getByRole('button', { name: 'Salvar Trabalho' }).click();
      const linha = page.locator('tr', { hasText: 'Pesquisa de biologia' }).first();
      await linha.waitFor({ state: 'visible', timeout: 15000 });
      await linha.getByRole('button', { name: 'Editar' }).click();
      await page.getByRole('textbox', { name: 'Ex: Pesquisa de história...' }).fill('Biologia Atualizada');
      await page.getByRole('button', { name: 'Salvar trabalho' }).click();
      await expect(page.locator('td', { hasText: 'Biologia Atualizada' }).first()).toBeVisible();
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