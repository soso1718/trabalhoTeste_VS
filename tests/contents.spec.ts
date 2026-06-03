import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

async function deletarTodosSeExistir(page: any, nome: string) {
  while (true) {
    const linha = page.locator('tr', { hasText: nome }).first();
    const visivel = await linha.isVisible().catch(() => false);
    if (!visivel) break;
    await linha.getByRole('button', { name: 'Excluir' }).click();
    await page.getByRole('button', { name: 'Sim, excluir' }).click();
    await page.waitForTimeout(1000);
  }
}

test.describe.serial('CRUD de conteúdos', () => {
  test.describe('Casos felizes', () => {
    test('O usuário pode adicionar um novo conteúdo', async ({ page }) => {
      await page.goto(`${BASE_URL}/contents`);
      await deletarTodosSeExistir(page, 'Modernismo');
      await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
      await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Modernismo');
      await page.locator('#modalContentSubject').selectOption('16');
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Prof. Silva');
      await page.locator('#modalContentSemester').selectOption('9');
      await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
      await expect(page.getByRole('cell', { name: 'Modernismo' }).first()).toBeVisible();
    });

    test('O usuário pode excluir um conteúdo existente', async ({ page }) => {
      await page.goto(`${BASE_URL}/contents`);
      await deletarTodosSeExistir(page, 'Orações');
      await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
      await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Orações');
      await page.locator('#modalContentSubject').selectOption('147');
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Prof. Silva');
      await page.locator('#modalContentSemester').selectOption('9');
      await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
      const linha = page.locator('tr', { hasText: 'Orações' }).first();
      await linha.waitFor({ state: 'visible', timeout: 15000 });
      await linha.getByRole('button', { name: 'Excluir' }).click();
      await page.getByRole('button', { name: 'Sim, excluir' }).click();
      await expect(page.locator('td', { hasText: 'Orações' })).not.toBeVisible();
    });

    test('O usuário deve conseguir editar um conteúdo existente', async ({ page }) => {
      await page.goto(`${BASE_URL}/contents`);
      await deletarTodosSeExistir(page, 'Funções');
      await deletarTodosSeExistir(page, 'Função exponencial');
      await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
      await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Funções');
      await page.locator('#modalContentSubject').selectOption('16');
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Prof. Silva');
      await page.locator('#modalContentSemester').selectOption('9');
      await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
      const linha = page.locator('tr', { hasText: 'Funções' }).first();
      await linha.waitFor({ state: 'visible', timeout: 15000 });
      await linha.getByRole('button', { name: 'Editar' }).click();
      await page.getByRole('textbox', { name: 'Derivadas e integrais' }).fill('Função exponencial');
      await page.getByRole('button', { name: 'Salvar alterações' }).click();
      await expect(page.locator('td', { hasText: 'Função exponencial' }).first()).toBeVisible();
    });
  });

  test.describe('Casos tristes', () => {
    test('O usuário não deve conseguir adicionar conteúdo sem selecionar o semestre', async ({ page }) => {
      await page.goto(`${BASE_URL}/contents`);
      await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
      await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Genética');
      await page.locator('#modalContentSubject').selectOption('16');
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Prof. Silva');
      await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
      await expect(page.locator('td', { hasText: 'Genética' })).not.toBeVisible();
    });
  });

  test.describe('Casos de borda', () => {
    test('O campo de adicionar conteúdo deve aceitar uma quantidade limitada de caracteres', async ({ page }) => {
      await page.goto(`${BASE_URL}/contents`);
      await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
      await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('b'.repeat(256));
      await page.locator('#modalContentSubject').selectOption('16');
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Prof. Silva');
      await page.locator('#modalContentSemester').selectOption('9');
      await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
      await expect(page.locator('td', { hasText: 'b'.repeat(256) })).not.toBeVisible();
    });

    test('O campo de adicionar conteúdo não deve aceitar caracteres especiais', async ({ page }) => {
      await page.goto(`${BASE_URL}/contents`);
      await page.getByRole('button', { name: 'Adicionar conteúdo' }).click();
      await page.getByRole('textbox', { name: 'Ex: Derivadas e integrais,' }).fill('Conteúdo com caracteres especiais !@#$%^&*()');
      await page.locator('#modalContentSubject').selectOption('16');
      await page.getByRole('textbox', { name: 'Ex: Prof. João Silva' }).fill('Prof. Silva');
      await page.locator('#modalContentSemester').selectOption('9');
      await page.getByRole('button', { name: 'Salvar conteúdo' }).click();
      await expect(page.locator('td', { hasText: 'Conteúdo com caracteres especiais !@#$%^&*()' })).not.toBeVisible();
    });
  });
});