/**
 * Page Object for the Swag Labs login page (https://www.saucedemo.com/).
 */
export class LoginPage {
  private readonly usernameInput = () => cy.get('[data-test="username"]');
  private readonly passwordInput = () => cy.get('[data-test="password"]');
  private readonly loginButton = () => cy.get('[data-test="login-button"]');
  private readonly errorMessage = () => cy.get('[data-test="error"]');

  visit(): this {
    cy.visit('/');
    return this;
  }

  login(username: string, password: string): this {
    this.usernameInput().clear().type(username);
    this.passwordInput().clear().type(password);
    this.loginButton().click();
    return this;
  }

  submitEmptyForm(): this {
    this.loginButton().click();
    return this;
  }

  expectErrorMessage(message: string): this {
    this.errorMessage().should('be.visible').and('contain.text', message);
    return this;
  }
}

export default LoginPage;
