import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

describe('Checkout', () => {
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    cy.loginAsStandardUser();
  });

  it('completes a full end-to-end checkout for a single item', () => {
    productsPage.addProductToCart('Sauce Labs Backpack').goToCart();
    cartPage.expectItemCount(1);

    cartPage.checkout();
    cy.url().should('include', '/checkout-step-one.html');

    checkoutPage.fillInformation('John', 'Doe', '12345').continueToOverview();
    cy.url().should('include', '/checkout-step-two.html');

    checkoutPage.summaryItems().should('have.length', 1);
    checkoutPage.totalLabel().should('contain.text', 'Total:');

    checkoutPage.finish();
    cy.url().should('include', '/checkout-complete.html');
    checkoutPage.expectOrderComplete();
  });

  it('completes checkout for multiple items and totals reflect subtotal + tax', () => {
    productsPage
      .addProductToCart('Sauce Labs Backpack')
      .addProductToCart('Sauce Labs Bike Light')
      .goToCart();
    cartPage.checkout();

    checkoutPage.fillInformation('Jane', 'Smith', '94107').continueToOverview();

    checkoutPage.summaryItems().should('have.length', 2);

    checkoutPage.subtotalLabel().invoke('text').then((subtotalText) => {
      checkoutPage.taxLabel().invoke('text').then((taxText) => {
        checkoutPage.totalLabel().invoke('text').then((totalText) => {
          const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
          const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
          const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));

          expect(total).to.be.closeTo(subtotal + tax, 0.01);
        });
      });
    });

    checkoutPage.finish();
    cy.url().should('include', '/checkout-complete.html');
    checkoutPage.expectOrderComplete();
  });

  it('requires first name, last name and postal code before continuing', () => {
    productsPage.addProductToCart('Sauce Labs Backpack').goToCart();
    cartPage.checkout();

    checkoutPage.continueToOverview();

    checkoutPage.expectErrorMessage('First Name is required');
    cy.url().should('include', '/checkout-step-one.html');
  });

  it('back-to-products button returns to the inventory page after an order', () => {
    productsPage.addProductToCart('Sauce Labs Backpack').goToCart();
    cartPage.checkout();
    checkoutPage.fillInformation('John', 'Doe', '12345').continueToOverview();
    checkoutPage.finish();
    checkoutPage.expectOrderComplete();

    checkoutPage.backHomeButton().click();
    cy.url().should('include', '/inventory.html');
    productsPage.expectCartBadgeHidden();
  });
});
