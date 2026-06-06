import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

async function deletarSeExistir(page: any, nome: string) {
  const linha = page.locator('tr', { hasText: nome }).first();
  const visivel = await linha.isVisible().catch(() => false);
  if (!visivel) return;
  await linha.getByRole('button', { name: 'Excluir' }).click();
  await page.getByRole('button', { name: 'Sim, excluir' }).click();
}

test.describe.serial('CRUD de matérias', () => {

  test.describe('Casos felizes', () => {
    test('O usuário pode cadastrar uma matéria com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/subjects`);
      await deletarSeExistir(page, 'Português');
      await page.getByRole('button', { name: 'Adicionar matéria' }).click();
      await page.locator('#modalSubjectName').selectOption({ label: 'Português' });
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('João');
      await page.locator('#modalSubjectSemester').selectOption('5');
      await page.getByRole('button', { name: 'Salvar matéria' }).click();
      await expect(page.getByRole('cell', { name: 'Português' })).toBeVisible();
    });

    test('O usuário pode excluir uma matéria com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/subjects`);
      await deletarSeExistir(page, 'Literatura');
      await page.getByRole('button', { name: 'Adicionar matéria' }).click();
      await page.locator('#modalSubjectName').selectOption({ label: 'Literatura' });
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Maria');
      await page.locator('#modalSubjectSemester').selectOption('5');
      await page.getByRole('button', { name: 'Salvar matéria' }).click();
      const linha = page.locator('tr', { hasText: 'Literatura' }).first();
      await linha.waitFor({ state: 'visible', timeout: 15000 });
      await linha.getByRole('button', { name: 'Excluir' }).click();
      await page.getByRole('button', { name: 'Sim, excluir' }).click();
      await expect(page.locator('td', { hasText: 'Literatura' })).not.toBeVisible();
    });
  });

  test.describe('Casos tristes', () => {
    test('O usuário não pode cadastrar sem professor', async ({ page }) => {
      await page.goto(`${BASE_URL}/subjects`);
      await deletarSeExistir(page, 'Biologia');
      await page.getByRole('button', { name: 'Adicionar matéria' }).click();
      await page.locator('#modalSubjectName').selectOption({ label: 'Biologia' });
      await page.locator('#modalSubjectSemester').selectOption('8');
      await page.getByRole('button', { name: 'Salvar matéria' }).click();
      await expect(page.locator('td', { hasText: 'Biologia' })).not.toBeVisible();
    });

    test('O usuário não pode cadastrar uma matéria duplicada', async ({ page }) => {
      await page.goto(`${BASE_URL}/subjects`);
      await deletarSeExistir(page, 'Filosofia');
      await page.getByRole('button', { name: 'Adicionar matéria' }).click();
      await page.locator('#modalSubjectName').selectOption({ label: 'Filosofia' });
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Joana');
      await page.locator('#modalSubjectSemester').selectOption('5');
      await page.getByRole('button', { name: 'Salvar matéria' }).click();
      await page.getByRole('button', { name: 'Adicionar matéria' }).click();
      await page.locator('#modalSubjectName').selectOption({ label: 'Filosofia' });
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Joana');
      await page.locator('#modalSubjectSemester').selectOption('5');
      await page.getByRole('button', { name: 'Salvar matéria' }).click();
      await expect(page.getByRole('cell', { name: 'Filosofia' }).nth(1)).not.toBeVisible();
    });
  });

  test.describe('Casos de borda', () => {
    test('O campo de professor só pode ter 255 caracteres', async ({ page }) => {
      await page.goto(`${BASE_URL}/subjects`);
      await deletarSeExistir(page, 'Química');
      await page.getByRole('button', { name: 'Adicionar matéria' }).click();
      await page.locator('#modalSubjectName').selectOption({ label: 'Química' });
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('a'.repeat(256));
      await page.locator('#modalSubjectSemester').selectOption('9');
      await page.getByRole('button', { name: 'Salvar matéria' }).click();
      await expect(page.locator('td', { hasText: 'Química' })).not.toBeVisible();
    });

    test('O campo de professor não pode ter caracteres especiais', async ({ page }) => {
      await page.goto(`${BASE_URL}/subjects`);
      await deletarSeExistir(page, 'Sociologia');
      await page.getByRole('button', { name: 'Adicionar matéria' }).click();
      await page.locator('#modalSubjectName').selectOption({ label: 'Sociologia' });
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Maria198478197371');
      await page.locator('#modalSubjectSemester').selectOption('2');
      await page.getByRole('button', { name: 'Salvar matéria' }).click();
      await expect(page.locator('td', { hasText: 'Sociologia' })).not.toBeVisible();
    });
  });

});