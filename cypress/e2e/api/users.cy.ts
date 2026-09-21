/**
 * API tests against the public reqres.in fake REST API, driven with cy.request()
 * instead of the browser (baseUrl for this project points at saucedemo.com for the
 * UI suite, so these requests use the full reqres.in URL directly).
 *
 * Note on authentication: reqres.in's public /api/users endpoints work without an
 * API key for a limited number of anonymous requests per day, per IP. Signing up
 * for a free account issues a personal x-api-key, which raises that limit. We send
 * a placeholder key on every request below so the suite keeps working unchanged if
 * the anonymous tier is ever tightened further.
 */
const API_BASE_URL = 'https://reqres.in/api';
const API_HEADERS = { 'x-api-key': 'reqres-free-v1' };

describe('reqres.in Users API', () => {
  it('GET /users returns a paginated list of users', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users?page=2`,
      headers: API_HEADERS,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.page).to.eq(2);
      expect(response.body.data).to.be.an('array').that.is.not.empty;

      const firstUser = response.body.data[0];
      expect(firstUser).to.have.property('id');
      expect(firstUser).to.have.property('email');
      expect(firstUser).to.have.property('first_name');
      expect(firstUser).to.have.property('last_name');
    });
  });

  it('GET /users/{id} returns a single user', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users/2`,
      headers: API_HEADERS,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.data.id).to.eq(2);
      expect(response.body.data).to.have.property('email');
      expect(response.body.data).to.have.property('first_name');
      expect(response.body.data).to.have.property('last_name');
      expect(response.body.data).to.have.property('avatar');
    });
  });

  it('GET /users/{id} returns 404 for a non-existent user', () => {
    cy.request({
      method: 'GET',
      url: `${API_BASE_URL}/users/23`,
      headers: API_HEADERS,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it('POST /users creates a new user', () => {
    const payload = { name: 'morpheus', job: 'leader' };

    cy.request({
      method: 'POST',
      url: `${API_BASE_URL}/users`,
      headers: API_HEADERS,
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.name).to.eq(payload.name);
      expect(response.body.job).to.eq(payload.job);
      expect(response.body).to.have.property('id');
      expect(response.body).to.have.property('createdAt');
    });
  });

  it('PUT /users/{id} updates an existing user', () => {
    const payload = { name: 'morpheus', job: 'zion resident' };

    cy.request({
      method: 'PUT',
      url: `${API_BASE_URL}/users/2`,
      headers: API_HEADERS,
      body: payload,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.name).to.eq(payload.name);
      expect(response.body.job).to.eq(payload.job);
      expect(response.body).to.have.property('updatedAt');
    });
  });

  it('DELETE /users/{id} removes a user and returns 204', () => {
    cy.request({
      method: 'DELETE',
      url: `${API_BASE_URL}/users/2`,
      headers: API_HEADERS,
    }).then((response) => {
      expect(response.status).to.eq(204);
      expect(response.body).to.be.empty;
    });
  });
});
