import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { BASE_URL } from '../config';

const EMAIL_VALIDO = process.env.TEST_EMAIL!;
const SENHA_VALIDA = process.env.TEST_PASSWORD!;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(`${BASE_URL}/login`);
  await loginPage.login(EMAIL_VALIDO, SENHA_VALIDA);
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Fixar menu' }).click();
  await page.getByRole('link', { name: 'Exames Exames' }).click();
  await page.getByRole('link', { name: 'Ver Trabalhos' }).click();
});

test('O usuário pode cadastrar um trabalho com sucesso', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo trabalho' }).click();
    await page.locator('#workType').selectOption('Seminário');
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Pesquisa de geografia');
    await page.locator('#workDueDate').fill('2026-06-20');
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.getByRole('cell', { name: 'Pesquisa de geografia' })).toBeVisible();
});

test('O usuário pode editar um trabalho com sucesso', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo trabalho' }).click();
    await page.locator('#workType').selectOption('Seminário');
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Pesquisa de biologia');
    await page.locator('#workDueDate').fill('2026-06-20');
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    const linha = page.locator('tr', { hasText: 'Pesquisa de biologia' }).first();
    await linha.waitFor({ state: 'visible', timeout: 5000 });
    await linha.getByRole('button', { name: 'Editar' }).click();

    await page.getByRole('textbox', { name: 'Ex: Pesquisa de história...' }).fill('Biologia Atualizada');
    await page.getByRole('button', { name: 'Salvar trabalho' }).click();

    await expect(page.locator('td', { hasText: 'Biologia Atualizada' })).toBeVisible();
});

test('O usuário pode excluir um trabalho com sucesso', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo trabalho' }).click();
    await page.locator('#workType').selectOption('Seminário');
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Relatório de química');
    await page.locator('#workDueDate').fill('2026-06-20');
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    const linha = page.locator('tr', { hasText: 'Relatório de química' }).first();
    await linha.waitFor({ state: 'visible', timeout: 5000 });

    await page.getByRole('button', { name: 'Excluir' }).nth(1).click();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();

    await expect(page.locator('td', { hasText: 'Relatório de química' })).not.toBeVisible();
});


test('O usuário não pode cadastrar um trabalho sem tipo', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo trabalho' }).click();
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Redação');
    await page.locator('#workDueDate').fill('2026-06-20');
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.locator('td', { hasText: 'Redação' })).not.toBeVisible();
});


test('O usuário não pode cadastrar um trabalho pendente com data de entrega no passado', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo trabalho' }).click();
    await page.locator('#workType').selectOption('Seminário');
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('Sociologia');
    await page.locator('#workDueDate').fill('2026-04-20');
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.locator('td', { hasText: 'Sociologia' })).not.toBeVisible();
});


test('O campo de nome do tranalho deve aceitar no máximo 100 caracteres', async ({ page }) => {
    await page.getByRole('button', { name: 'Novo trabalho' }).click();
    await page.locator('#workType').selectOption('Seminário');
    await page.getByRole('textbox', { name: 'Ex: Pesquisa de História...' }).fill('A'.repeat(101));
    await page.locator('#workDueDate').fill('2026-06-20');
    await page.getByRole('button', { name: 'Salvar Trabalho' }).click();

    await expect(page.locator('td', { hasText: 'A'.repeat(101) })).not.toBeVisible();
});
