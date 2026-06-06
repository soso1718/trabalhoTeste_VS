import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';

test.describe.serial('CRUD de notas', () => {
  test.describe('Casos felizes', () => {
    test('O usuário pode cadastrar uma nota com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/bulletin`);
      await page.getByRole('button', { name: 'Nova nota' }).click();
      await page.locator('#gradeModalSubjectId').selectOption('16');
      await page.locator('#gradeModalBimester').selectOption('1');
      await page.getByPlaceholder('2026').fill('2026');
      await page.locator('#gradeModalMidterm').fill('8');
      await page.locator('#gradeModalEndterm').fill('10');
      await page.getByRole('button', { name: 'Salvar nota' }).click();
      await expect(page.getByRole('button', { name: 'Nova nota' })).toBeVisible();
    });

    test('O usuário pode editar uma nota com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/bulletin`);
      await page.getByRole('button', { name: 'Nova nota' }).click();
      await page.locator('#gradeModalSubjectId').selectOption('16');
      await page.locator('#gradeModalBimester').selectOption('2');
      await page.getByPlaceholder('2026').fill('2026');
      await page.locator('#gradeModalMidterm').fill('7');
      await page.locator('#gradeModalEndterm').fill('9');
      await page.getByRole('button', { name: 'Salvar nota' }).click();
      await page.locator('.w-7').first().click();
      await page.locator('#gradeModalMidterm').fill('6');
      await page.locator('#gradeModalEndterm').fill('8');
      await page.getByRole('button', { name: 'Salvar alterações' }).click();
      await expect(page.getByRole('button', { name: 'Nova nota' })).toBeVisible();
    });

    test('O usuário pode excluir uma nota com sucesso', async ({ page }) => {
      await page.goto(`${BASE_URL}/bulletin`);
      await page.getByRole('button', { name: 'Nova nota' }).click();
      await page.locator('#gradeModalSubjectId').selectOption('16');
      await page.locator('#gradeModalBimester').selectOption('3');
      await page.getByPlaceholder('2026').fill('2026');
      await page.locator('#gradeModalMidterm').fill('5');
      await page.locator('#gradeModalEndterm').fill('7');
      await page.getByRole('button', { name: 'Salvar nota' }).click();
      await page.locator('.w-7.h-7.flex.items-center.justify-center.rounded-lg.bg-red-50').first().click();
      await page.getByRole('button', { name: 'Sim, excluir' }).click();
      await expect(page.getByRole('button', { name: 'Nova nota' })).toBeVisible();
    });
  });

  test.describe('Casos tristes', () => {
    test('O usuário não pode cadastrar uma nota sem selecionar a matéria', async ({ page }) => {
      await page.goto(`${BASE_URL}/bulletin`);
      await page.getByRole('button', { name: 'Nova nota' }).click();
      await page.locator('#gradeModalBimester').selectOption('1');
      await page.getByPlaceholder('2026').fill('2026');
      await page.locator('#gradeModalMidterm').fill('8');
      await page.locator('#gradeModalEndterm').fill('10');
      await page.getByRole('button', { name: 'Salvar nota' }).click();
      await expect(page.getByRole('button', { name: 'Salvar nota' })).toBeVisible();
    });

    test('O usuário não pode cadastrar uma nota sem preencher as notas', async ({ page }) => {
      await page.goto(`${BASE_URL}/bulletin`);
      await page.getByRole('button', { name: 'Nova nota' }).click();
      await page.locator('#gradeModalSubjectId').selectOption('16');
      await page.locator('#gradeModalBimester').selectOption('1');
      await page.getByPlaceholder('2026').fill('2026');
      await page.getByRole('button', { name: 'Salvar nota' }).click();
      await expect(page.getByRole('button', { name: 'Salvar nota' })).toBeVisible();
    });
  });

  test.describe('Casos de borda', () => {
    test('O usuário não pode cadastrar uma nota maior que 10', async ({ page }) => {
      await page.goto(`${BASE_URL}/bulletin`);
      await page.getByRole('button', { name: 'Nova nota' }).click();
      await page.locator('#gradeModalSubjectId').selectOption('16');
      await page.locator('#gradeModalBimester').selectOption('1');
      await page.getByPlaceholder('2026').fill('2026');
      await page.locator('#gradeModalMidterm').fill('11');
      await page.locator('#gradeModalEndterm').fill('11');
      await page.getByRole('button', { name: 'Salvar nota' }).click();
      await expect(page.getByRole('button', { name: 'Salvar nota' })).toBeVisible();
    });

    test('O usuário não pode cadastrar uma nota negativa', async ({ page }) => {
      await page.goto(`${BASE_URL}/bulletin`);
      await page.getByRole('button', { name: 'Nova nota' }).click();
      await page.locator('#gradeModalSubjectId').selectOption('16');
      await page.locator('#gradeModalBimester').selectOption('1');
      await page.getByPlaceholder('2026').fill('2026');
      await page.locator('#gradeModalMidterm').fill('-1');
      await page.locator('#gradeModalEndterm').fill('-1');
      await page.getByRole('button', { name: 'Salvar nota' }).click();
      await expect(page.getByRole('button', { name: 'Salvar nota' })).toBeVisible();
    });
  });
});