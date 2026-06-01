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
  await page.getByRole('link', { name: 'Ver Provas' }).click();
});

test.describe.serial('CRUD de atividades', () => {
    test.describe('Casos felizes', () => {
        test('O usuário pode cadastrar uma prova com sucesso', async ({ page }) => {
            await page.getByRole('button', { name: 'Adicionar' }).first().click();
            await page.locator('#modalType').selectOption('Prova Final');
            await page.locator('#modalDesc').selectOption('Matemática');
            await page.getByText('🔄 Andamento').click();
            await page.getByRole('button', { name: 'Salvar prova' }).click();

            await expect(page.getByText('Prova Final Matemática')).toBeVisible();
        });

        test('O usuário pode editar uma prova com sucesso', async ({ page }) => {
            await page.getByRole('button', { name: 'Adicionar' }).first().click();
            await page.locator('#modalType').selectOption('Prova Final');
            await page.locator('#modalDesc').selectOption('Filosofia');
            await page.getByText('🔄 Andamento').click();
            await page.getByRole('button', { name: 'Salvar prova' }).click();

            const linha = page.locator('tr', { hasText: 'Filosofia' }).first();
            await linha.waitFor({ state: 'visible', timeout: 5000 });
            await page.getByText('Prova Final Filosofia').click();
            await page.locator('#modalDesc').selectOption('Redação');
            await page.getByRole('button', { name: 'Salvar alterações' }).click();

            await expect(page.getByText('Prova Final Redação')).toBeVisible();
        });
  
        test('O usuário pode excluir uma prova com sucesso', async ({ page }) => {
            await page.getByRole('button', { name: 'Adicionar' }).first().click();
            await page.locator('#modalType').selectOption('Prova Final');
            await page.locator('#modalDesc').selectOption('Literatura');
            await page.getByText('🔄 Andamento').click();
            await page.getByRole('button', { name: 'Salvar prova' }).click();

            const linha = page.locator('tr', { hasText: 'Literatura' }).first();
            await linha.waitFor({ state: 'visible', timeout: 5000 });
            await page.getByText('Literatura', { exact: true }).click();
            await page.getByRole('button', { name: 'Excluir' }).click();
            await page.getByRole('button', { name: 'Sim, excluir' }).click();

            await expect(page.getByText('Prova Final Literatura')).not.toBeVisible();
        });
    });

    test.describe('Casos tristes', () => {
        test('O usuário não pode cadastrar uma prova sem tipo', async ({ page }) => {
            await page.getByRole('button', { name: 'Adicionar' }).first().click();
            await page.locator('#modalDesc').selectOption('Literatura');
            await page.getByText('🔄 Andamento').click();
            await page.getByRole('button', { name: 'Salvar prova' }).click();

            await expect(page.getByText('Prova Final Literatura')).not.toBeVisible();
        });

    });
});

