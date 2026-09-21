import { ProductsPage } from '../../pages/ProductsPage';

describe('Product sorting', () => {
  const productsPage = new ProductsPage();

  beforeEach(() => {
    cy.loginAsStandardUser();
  });

  it('sorts products by name A to Z (default)', () => {
    productsPage.getProductNames().then((names) => {
      const sorted = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).to.deep.equal(sorted);
    });
  });

  it('sorts products by name Z to A', () => {
    productsPage.sortBy('za');

    productsPage.getProductNames().then((names) => {
      const sorted = [...names].sort((a, b) => b.localeCompare(a));
      expect(names).to.deep.equal(sorted);
    });
  });

  it('sorts products by price low to high', () => {
    productsPage.sortBy('lohi');

    productsPage.getProductPrices().then((prices) => {
      const sorted = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sorted);
    });
  });

  it('sorts products by price high to low', () => {
    productsPage.sortBy('hilo');

    productsPage.getProductPrices().then((prices) => {
      const sorted = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sorted);
    });
  });
});
