import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

describe('Login', () => {
  const loginPage = new LoginPage();
  const productsPage = new ProductsPage();

  it('valid login navigates a standard user to the products page', () => {
    loginPage.visit().login('standard_user', 'secret_sauce');

    cy.url().should('include', '/inventory.html');
    productsPage.pageTitle().should('have.text', 'Products');
  });

  it('invalid password shows an error message', () => {
    loginPage.visit().login('standard_user', 'wrong_password');

    loginPage.expectErrorMessage('Username and password do not match any user in this service');
    cy.url().should('eq', 'https://www.saucedemo.com/');
  });

  it('locked out user cannot log in', () => {
    loginPage.visit().login('locked_out_user', 'secret_sauce');

    loginPage.expectErrorMessage('Sorry, this user has been locked out.');
    cy.url().should('eq', 'https://www.saucedemo.com/');
  });

  it('empty credentials show a required-field error', () => {
    loginPage.visit().submitEmptyForm();

    loginPage.expectErrorMessage('Username is required');
  });
});
