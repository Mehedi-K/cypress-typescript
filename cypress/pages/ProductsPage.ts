export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Page Object for the inventory / products page (https://www.saucedemo.com/inventory.html).
 */
export class ProductsPage {
  readonly pageTitle = () => cy.get('[data-test="title"]');
  readonly sortDropdown = () => cy.get('[data-test="product-sort-container"]');
  readonly inventoryItems = () => cy.get('[data-test="inventory-item"]');
  readonly inventoryItemNames = () => cy.get('[data-test="inventory-item-name"]');
  readonly inventoryItemPrices = () => cy.get('[data-test="inventory-item-price"]');
  readonly cartLink = () => cy.get('[data-test="shopping-cart-link"]');
  readonly cartBadge = () => cy.get('[data-test="shopping-cart-badge"]');

  visit(): this {
    cy.visit('/inventory.html');
    return this;
  }

  /** Converts a product name into the slug used in saucedemo's data-test attributes. */
  private static toSlug(productName: string): string {
    return productName.toLowerCase().replace(/\s+/g, '-');
  }

  addToCartButton(productName: string) {
    return cy.get(`[data-test="add-to-cart-${ProductsPage.toSlug(productName)}"]`);
  }

  removeFromCartButton(productName: string) {
    return cy.get(`[data-test="remove-${ProductsPage.toSlug(productName)}"]`);
  }

  addProductToCart(productName: string): this {
    this.addToCartButton(productName).click();
    return this;
  }

  removeProductFromCart(productName: string): this {
    this.removeFromCartButton(productName).click();
    return this;
  }

  sortBy(option: SortOption): this {
    this.sortDropdown().select(option);
    return this;
  }

  getProductNames(): Cypress.Chainable<string[]> {
    return this.inventoryItemNames().then(($els) =>
      Cypress._.map($els.toArray(), (el) => el.textContent?.trim() ?? '')
    );
  }

  getProductPrices(): Cypress.Chainable<number[]> {
    return this.inventoryItemPrices().then(($els) =>
      Cypress._.map($els.toArray(), (el) => parseFloat((el.textContent ?? '').replace('$', '')))
    );
  }

  goToCart(): this {
    this.cartLink().click();
    return this;
  }

  expectCartBadgeCount(count: number): this {
    this.cartBadge().should('have.text', String(count));
    return this;
  }

  expectCartBadgeHidden(): this {
    this.cartBadge().should('not.exist');
    return this;
  }
}

export default ProductsPage;
