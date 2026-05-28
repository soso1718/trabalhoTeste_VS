import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';
import { LoginPage } from '../pages/login-page';

const EMAIL_VALIDO = process.env.TEST_EMAIL!;
const SENHA_VALIDA = process.env.TEST_PASSWORD!;


test('O usuário pode fazer login com credenciais válidas', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(EMAIL_VALIDO, SENHA_VALIDA);
  await expect(page).not.toHaveURL(/\/login/);
});

test('O usuário não consegue fazer login com senha incorreta', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(EMAIL_VALIDO, 'senhaErrada');
  await expect(page).toHaveURL(/\/login/);
});


test('O usuário não consegue fazer login com e-mail não cadastrado', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login('naoexiste@email.com', SENHA_VALIDA);
  await expect(page).toHaveURL(/\/login/);
});


test('O formulário não deve ser enviado com campos vazios', async ({ page }) => {
  await page.goto('${BASE_URL}/login');
  await page.click('button[type="submit"]');
  const emailInput = page.locator('input[name="email"]');
  await expect(emailInput).toHaveAttribute('type', 'email');
  await expect(page).toHaveURL(/\/login/);
});