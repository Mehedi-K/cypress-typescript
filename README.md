# Cypress TypeScript Test Automation

[![CI](https://github.com/Mehedi-K/cypress-typescript/actions/workflows/ci.yml/badge.svg)](https://github.com/Mehedi-K/cypress-typescript/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-17202C?logo=cypress&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

A test automation portfolio project built with [Cypress](https://www.cypress.io/) and TypeScript, using Cypress's built-in Mocha-based test runner. It covers both **UI end-to-end testing** with the Page Object Model and **REST API testing** via `cy.request()`.

## What's tested

- **UI** — [saucedemo.com](https://www.saucedemo.com/), a demo e-commerce site: login (valid, invalid, and locked-out users), product sorting, cart management, and the full checkout flow.
- **API** — [reqres.in](https://reqres.in/api), a public fake REST API: `GET /users`, `GET /users/{id}`, `POST /users`, `PUT /users/{id}`, and `DELETE /users/{id}`, asserting status codes and response bodies via `cy.request()`.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (20 LTS recommended)
- npm

## Setup

```bash
npm install
```

Cypress downloads its own bundled browser binary during `npm install`; no separate browser install step is required.

## Running the tests

Headless (the mode CI uses):

```bash
npx cypress run
```

Interactive test runner (for watching tests execute and debugging):

```bash
npx cypress open
```

Run a subset:

```bash
npm run test:ui     # UI specs only
npm run test:api    # API specs only
```

## Project structure

```
cypress-typescript/
  cypress.config.ts          # baseUrl (saucedemo.com), e2e config, TypeScript support
  tsconfig.json                # TypeScript config for the project
  cypress/
    e2e/
      ui/                       # UI specs (saucedemo.com), built on the POM classes
        login.cy.ts
        sorting.cy.ts
        cart.cy.ts
        checkout.cy.ts
      api/                      # API specs (reqres.in), using cy.request()
        users.cy.ts
    pages/                      # Page Object Model classes
      LoginPage.ts
      ProductsPage.ts
      CartPage.ts
      CheckoutPage.ts
    support/
      e2e.ts                    # loaded before every spec
      commands.ts                # custom commands (cy.login, cy.loginAsStandardUser)
  .github/workflows/ci.yml     # GitHub Actions workflow
```

### Page Object Model

The UI suite follows the Page Object Model pattern: each page of the app (`LoginPage`, `ProductsPage`, `CartPage`, `CheckoutPage`) is a small TypeScript class wrapping `cy.get(...)` locators and actions. Locators use `[data-test="..."]` selectors matching saucedemo.com's real `data-test` attributes, so tests rely on Cypress's built-in retry-ability (`cy.get`, `.should`) instead of manual waits or sleeps.

### Custom commands

`cypress/support/commands.ts` adds `cy.login(username, password)` and `cy.loginAsStandardUser()` so specs that need an authenticated starting point (cart, checkout, sorting) don't repeat the login flow.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request to `main`, using the official `cypress-io/github-action`, which handles Node setup, `npm install`, and running the suite against Chrome in one step. Screenshots are uploaded as a build artifact on failure; videos are uploaded on every run.

## Notes on the targets under test

- **saucedemo.com** is a public Sauce Labs demo app used for practicing UI automation. Standard credentials: `standard_user` / `secret_sauce`; the `locked_out_user` account (same password) is used to exercise the error path.
- **reqres.in** is a public fake REST API for practicing API automation. Its `/api/users` endpoints work without an API key for a limited number of anonymous requests per day, per IP; the spec sends a placeholder `x-api-key` header regardless so the suite keeps working if the anonymous tier is ever restricted further.

This repo sits alongside a Playwright TypeScript/JavaScript project in the same portfolio, testing the same sites, to demonstrate familiarity with both major JavaScript E2E frameworks.
