import { test, expect } from '@playwright/test';
import { BASE_URL } from '../config';
import { LoginPage } from '../pages/login-page';

const EMAIL_VALIDO = process.env.TEST_EMAIL!;
const SENHA_VALIDA = process.env.TEST_PASSWORD!;

// ✅ Casos felizes
test('O usuário pode fazer login com credenciais válidas', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(EMAIL_VALIDO, SENHA_VALIDA);
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 20000 });
  await expect(page).not.toHaveURL(/\/login/);
});

test('O usuário pode fazer login e a URL muda para a página inicial', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login(EMAIL_VALIDO, SENHA_VALIDA);
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 20000 });
  await expect(page).toHaveURL(/\/dashboard/);
});

// ❌ Casos tristes
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

// 🔲 Casos de borda
test('O formulário não deve ser enviado com campos vazios', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.click('button[id="submitBtn"]');
  const emailInput = page.locator('input[id="email"]');
  await expect(emailInput).toHaveAttribute('type', 'email');
  await expect(page).toHaveURL(/\/login/);
});

test('O formulário não deve aceitar e-mail com formato inválido', async ({ page }) => {
  await page.goto(`${BASE_URL}/login`);
  await page.type('input[id="email"]', 'emailsemarroba');
  await page.click('button[id="submitBtn"]');
  const emailInput = page.locator('input[id="email"]');
  await expect(emailInput).toHaveAttribute('type', 'email');
  await expect(page).toHaveURL(/\/login/);
});