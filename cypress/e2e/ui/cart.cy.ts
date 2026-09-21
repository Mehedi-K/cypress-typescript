import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';

describe('Cart', () => {
  const productsPage = new ProductsPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.loginAsStandardUser();
  });

  it('adding a product updates the cart badge', () => {
    productsPage.addProductToCart('Sauce Labs Backpack');
    productsPage.expectCartBadgeCount(1);
  });

  it('adding multiple products accumulates the cart badge count', () => {
    productsPage
      .addProductToCart('Sauce Labs Backpack')
      .addProductToCart('Sauce Labs Bike Light')
      .addProductToCart('Sauce Labs Bolt T-Shirt');

    productsPage.expectCartBadgeCount(3);
  });

  it('removing a product from the products page updates the badge', () => {
    productsPage.addProductToCart('Sauce Labs Backpack');
    productsPage.expectCartBadgeCount(1);

    productsPage.removeProductFromCart('Sauce Labs Backpack');
    productsPage.expectCartBadgeHidden();
  });

  it('cart page lists the products that were added', () => {
    productsPage
      .addProductToCart('Sauce Labs Backpack')
      .addProductToCart('Sauce Labs Bike Light')
      .goToCart();

    cartPage.expectItemCount(2);
    cartPage.getCartItemNames().then((names) => {
      expect(names).to.include('Sauce Labs Backpack');
      expect(names).to.include('Sauce Labs Bike Light');
    });
  });

  it('removing a product from the cart page removes it from the list', () => {
    productsPage
      .addProductToCart('Sauce Labs Backpack')
      .addProductToCart('Sauce Labs Bike Light')
      .goToCart();

    cartPage.removeItem('Sauce Labs Backpack');

    cartPage.expectItemCount(1);
    cartPage.getCartItemNames().then((names) => {
      expect(names).to.not.include('Sauce Labs Backpack');
    });
  });
});
