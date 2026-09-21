/// <reference types="cypress" />

import { LoginPage } from '../pages/LoginPage';

/**
 * Logs in via the UI and waits for navigation to the inventory page.
 * Shared by specs that need an authenticated starting point (cart, checkout, sorting).
 */
Cypress.Commands.add('login', (username: string, password: string) => {
  const loginPage = new LoginPage();
  loginPage.visit().login(username, password);
  cy.url().should('include', '/inventory.html');
});

/** Logs in as the standard, non-locked-out demo user. */
Cypress.Commands.add('loginAsStandardUser', () => {
  cy.login('standard_user', 'secret_sauce');
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** Logs in via the saucedemo.com login form with the given credentials. */
      login(username: string, password: string): Chainable<void>;
      /** Logs in as the standard demo user (standard_user / secret_sauce). */
      loginAsStandardUser(): Chainable<void>;
    }
  }
}

export {};
