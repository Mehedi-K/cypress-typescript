/**
 * Page Object for the cart page (https://www.saucedemo.com/cart.html).
 */
export class CartPage {
  readonly cartItems = () => cy.get('[data-test="inventory-item"]');
  readonly cartItemNames = () => cy.get('[data-test="inventory-item-name"]');
  readonly checkoutButton = () => cy.get('[data-test="checkout"]');
  readonly continueShoppingButton = () => cy.get('[data-test="continue-shopping"]');

  visit(): this {
    cy.visit('/cart.html');
    return this;
  }

  expectItemCount(count: number): this {
    if (count === 0) {
      this.cartItems().should('not.exist');
    } else {
      this.cartItems().should('have.length', count);
    }
    return this;
  }

  expectItemPresent(productName: string): this {
    this.cartItemNames().should('contain.text', productName);
    return this;
  }

  getCartItemNames(): Cypress.Chainable<string[]> {
    return this.cartItemNames().then(($els) =>
      Cypress._.map($els.toArray(), (el) => el.textContent?.trim() ?? '')
    );
  }

  removeButton(productName: string) {
    const slug = productName.toLowerCase().replace(/\s+/g, '-');
    return cy.get(`[data-test="remove-${slug}"]`);
  }

  removeItem(productName: string): this {
    this.removeButton(productName).click();
    return this;
  }

  checkout(): this {
    this.checkoutButton().click();
    return this;
  }
}

export default CartPage;
