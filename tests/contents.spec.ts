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
  await page.getByRole('link', { name: 'Matérias Matérias' }).click();
  await page.getByRole('link', { name: 'Ver conteúdos' }).click();
});

test.describe.serial('CRUD de conteúdos', () => {
    test.describe('Casos felizes', () => {
        test('O usuário pode adicionar um novo conteúdo', async ({page}) =>{
            await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
            await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Modernismo');
            await page.locator('#modalContentSubject').selectOption('16');
            await page.locator('#modalContentSemester').selectOption('9');
            await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

            await expect(page.getByRole('cell', { name: 'Modernismo' })).toBeVisible();
        });

        test('O usuário pode excluir um conteúdo existente', async ({page}) =>{
            await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
            await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Orações');
            await page.locator('#modalContentSubject').selectOption('147');
            await page.locator('#modalContentSemester').selectOption('9');
            await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

            const linha = page.locator('tr', { hasText: 'Orações' }).first();
            await linha.waitFor({ state: 'visible', timeout: 5000 });

            await page.getByRole('button', { name: 'Excluir' }).nth(1).click();
            await page.getByRole('button', { name: 'Sim, excluir' }).click();

            await expect(page.locator('td', { hasText: 'Orações' })).not.toBeVisible();
        });

        test('O usuário deve conseguir editar um conteúdo existente', async ({page}) =>{
            await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
            await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Funções');
            await page.locator('#modalContentSubject').selectOption('192');
            await page.locator('#modalContentSemester').selectOption('9');
            await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

            const linha = page.locator('tr', { hasText: 'Funções' }).first();
            await linha.waitFor({ state: 'visible', timeout: 5000 });
            await linha.getByRole('button', { name: 'Editar' }).click();

            await page.getByRole('textbox', { name: 'Derivadas e integrais' }).fill('Função exponencial');
            await page.getByRole('button', { name: 'Salvar alterações' }).click();

            await expect(page.locator('td', { hasText: 'Função exponencial' })).toBeVisible();
        });
    });

    test.describe('Casos tristes', () => {
        test('O usuário não deve conseguir adicionar conteúdo sem selecionar o semestre', async ({page}) =>{
            await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
            await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Genética');
            await page.locator('#modalContentSubject').selectOption('16');
            await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

            await expect(page.locator('td', { hasText: 'Genética' })).not.toBeVisible();
        });
    });

    test.describe('Casos de borda', () => {
        test('O campo de adicionar conteúdo deve aceitar uma quantidade limitada de caracteres', async ({page}) =>{
            await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
            await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('b'.repeat(256));
            await page.locator('#modalContentSubject').selectOption('211');
            await page.locator('#modalContentSemester').selectOption('9');
            await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

            await expect(page.locator('td', { hasText: 'b'.repeat(256) })).not.toBeVisible();
        });


        test('O campo de adicionar conteúdo não deve aceitar caracteres especiais', async ({page}) =>{
            await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
            await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Conteúdo com caracteres especiais !@#$%^&*()');
            await page.locator('#modalContentSubject').selectOption('212');
            await page.locator('#modalContentSemester').selectOption('9');
            await page.getByRole('button', { name: 'Salvar conteúdo' }).click();

            await expect(page.locator('td', { hasText: 'Conteúdo com caracteres especiais !@#$%^&*()' })).not.toBeVisible();
        });
    });

});
