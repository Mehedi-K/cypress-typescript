/**
 * Page Object covering the full checkout flow:
 *   checkout-step-one.html (info form) ->
 *   checkout-step-two.html (overview)  ->
 *   checkout-complete.html (confirmation)
 */
export class CheckoutPage {
  // Step one - customer information
  readonly firstNameInput = () => cy.get('[data-test="firstName"]');
  readonly lastNameInput = () => cy.get('[data-test="lastName"]');
  readonly postalCodeInput = () => cy.get('[data-test="postalCode"]');
  readonly continueButton = () => cy.get('[data-test="continue"]');
  readonly cancelButton = () => cy.get('[data-test="cancel"]');
  readonly errorMessage = () => cy.get('[data-test="error"]');

  // Step two - overview
  readonly finishButton = () => cy.get('[data-test="finish"]');
  readonly subtotalLabel = () => cy.get('[data-test="subtotal-label"]');
  readonly taxLabel = () => cy.get('[data-test="tax-label"]');
  readonly totalLabel = () => cy.get('[data-test="total-label"]');
  readonly summaryItems = () => cy.get('[data-test="inventory-item"]');

  // Complete
  readonly completeHeader = () => cy.get('[data-test="complete-header"]');
  readonly completeText = () => cy.get('[data-test="complete-text"]');
  readonly backHomeButton = () => cy.get('[data-test="back-to-products"]');

  fillInformation(firstName: string, lastName: string, postalCode: string): this {
    this.firstNameInput().clear().type(firstName);
    this.lastNameInput().clear().type(lastName);
    this.postalCodeInput().clear().type(postalCode);
    return this;
  }

  continueToOverview(): this {
    this.continueButton().click();
    return this;
  }

  finish(): this {
    this.finishButton().click();
    return this;
  }

  expectOrderComplete(): this {
    this.completeHeader().should('have.text', 'Thank you for your order!');
    return this;
  }

  expectErrorMessage(message: string): this {
    this.errorMessage().should('be.visible').and('contain.text', message);
    return this;
  }
}

export default CheckoutPage;
