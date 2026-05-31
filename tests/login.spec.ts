import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';
import { LoginPage } from '../pages/login-page';

const EMAIL_VALIDO = process.env.TEST_EMAIL!;
const SENHA_VALIDA = process.env.TEST_PASSWORD!;

test('O usuário pode fazer login com credenciais válidas', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill(EMAIL_VALIDO);
  await page.getByRole('textbox', { name: '••••••••' }).fill(SENHA_VALIDA);
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
});

test('O usuário pode fazer login e a URL muda para o dashboard', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill(EMAIL_VALIDO);
  await page.getByRole('textbox', { name: '••••••••' }).fill(SENHA_VALIDA);
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
});


test('O usuário não consegue fazer login com senha incorreta', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill(EMAIL_VALIDO);
  await page.getByRole('textbox', { name: '••••••••' }).fill('senhaErrada');
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('O usuário não consegue fazer login com e-mail não cadastrado', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill('naoexiste@email.com');
  await page.getByRole('textbox', { name: '••••••••' }).fill(SENHA_VALIDA);
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
  await expect(page).toHaveURL(/\/login/);
});


test('O formulário não deve ser enviado com campos vazios', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
  await expect(page).toHaveURL(/\/login/);
});

test('O formulário não deve aceitar e-mail com formato inválido', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.getByRole('textbox', { name: 'nome@exemplo.com' }).fill('emailsemarroba');
  await page.getByRole('button', { name: 'Entrar na plataforma' }).click();
  await expect(page).toHaveURL(/\/login/);
});