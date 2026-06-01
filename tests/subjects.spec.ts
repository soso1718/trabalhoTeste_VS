import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login-page';
import { BASE_URL } from '../config';

const EMAIL_VALIDO_MATERIA = process.env.TEST_EMAIL_MATERIA!;
const SENHA_VALIDA_MATERIA = process.env.TEST_PASSWORD_MATERIA!;

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto(`${BASE_URL}/login`);
  await loginPage.login(EMAIL_VALIDO_MATERIA, SENHA_VALIDA_MATERIA);
  await expect(page).toHaveURL(/\/dashboard/);

  await page.getByRole('button', { name: 'Fixar menu' }).click();
  await page.getByRole('link', { name: 'Matérias Matérias' }).click();
  await page.getByRole('link', { name: 'Ver matérias' }).click();
});

test('O usuário pode cadastrar uma matéria com sucesso', async ({ page }) => {
  await page.getByRole('button', { name: 'Adicionar matéria' }).click();
  await page.locator('#modalSubjectName').selectOption({ label: 'Português' });
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('João');
  await page.locator('#modalSubjectSemester').selectOption('5');
  await page.getByRole('button', { name: 'Salvar matéria' }).click();

  await expect(page.getByRole('cell', { name: 'Português' })).toBeVisible();
});


test('O usuário pode editar uma matéria com sucesso', async ({ page }) => {
  await page.getByRole('button', { name: 'Adicionar matéria' }).click();
  await page.locator('#modalSubjectName').selectOption({ label: 'Literatura' });
  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Maria');
  await page.locator('#modalSubjectSemester').selectOption('5');
  await page.getByRole('button', { name: 'Salvar matéria' }).click();

  const linha = page.locator('tr', { hasText: 'Literatura' }).first();
  await linha.waitFor({ state: 'visible', timeout: 5000 });
  await linha.getByRole('button', { name: 'Editar' }).click();

  await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('João Atualizado');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();

  await expect(page.locator('td', { hasText: 'João Atualizado' })).toBeVisible();
});


test('O usuário não pode cadastrar sem professor', async ({ page }) => {
  await page.getByRole('button', { name: 'Adicionar matéria' }).click();
  await page.locator('#modalSubjectName').selectOption({ label: 'Biologia' });
  await page.locator('#modalSubjectSemester').selectOption('8');
  await page.getByRole('button', { name: 'Salvar matéria' }).click();

  await expect(page.locator('td', { hasText: 'Biologia' })).not.toBeVisible();
});


test('O usuário não pode atualizar para um valor inválido', async ({page}) => {
    await page.getByRole('button', { name: 'Adicionar matéria' }).click();
    await page.locator('#modalSubjectName').selectOption({ label: 'Filosofia' });
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Joana');
    await page.locator('#modalSubjectSemester').selectOption('5');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    const linha = page.locator('tr', { hasText: 'Filosofia' }).first();
    await linha.waitFor({ state: 'visible', timeout: 5000 });
    await linha.getByRole('button', { name: 'Editar' }).click();

    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('0');
    await page.getByRole('button', { name: 'Salvar alterações' }).click();

    await expect(page.locator('td', { hasText: '0' })).not.toBeVisible();
});


test('O campo de professor só pode ter 255 caracteres', async ({page}) =>{
    await page.getByRole('button', { name: 'Adicionar matéria' }).click();
    await page.locator('#modalSubjectName').selectOption({ label: 'Química' });
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('a'.repeat(256));
    await page.locator('#modalSubjectSemester').selectOption('9');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    await expect(page.locator('td', { hasText: 'Química' })).not.toBeVisible();
});


test('O campo de professor não pode ter caracteres especiais', async ({page}) =>{
    await page.getByRole('button', { name: 'Adicionar matéria' }).click();
    await page.locator('#modalSubjectName').selectOption({ label: 'Sociologia' });
    await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Maria198478197371');
    await page.locator('#modalSubjectSemester').selectOption('2');
    await page.getByRole('button', { name: 'Salvar matéria' }).click();

    await expect(page.locator('td', { hasText: 'Sociologia' })).not.toBeVisible();
});

