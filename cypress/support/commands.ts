/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

function enterCredentials(username: string, password: string) {
    cy.get('input[name="email"]', { timeout: 10000 }).should("be.visible");
    cy.get('input[name="email"]').type(username);

    cy.get('input[name="password"]', { timeout: 10000 }).should("be.visible");
    cy.get('input[name="password"]').type(password, {
        parseSpecialCharSequences: false,
    });
    cy.get('button[type="submit"]').click();
}

function isLoggedIn() {
    cy.visit("/universe/map");
    cy.get("a[href='/universe/login']").should("not.exist");
}

export function loginAsSuperAdmin() {
    cy.session(
        "superadmin",
        () => {
            cy.visit("/universe/login");
            enterCredentials(
                Cypress.env("superadmin_email"),
                Cypress.env("superadmin_password"),
            );
            cy.url({ timeout: 10000 }).should("not.include", "/universe/login");
        },
        {
            validate: isLoggedIn,
        },
    );
}

export function loginAsAdmin() {
    cy.session(
        "admin",
        () => {
            cy.visit("/test/login");
            enterCredentials(
                Cypress.env("admin_email"),
                Cypress.env("admin_password"),
            );
            cy.url({ timeout: 10000 }).should("not.include", "/test/login");
        },
        {
            validate: isLoggedIn,
        },
    );
}

export function loginAsMember() {
    cy.session(
        "member",
        () => {
            cy.visit("/test/login");
            enterCredentials(
                Cypress.env("member_email"),
                Cypress.env("member_password"),
            );
            cy.url({ timeout: 10000 }).should("not.include", "/test/login");
        },
        {
            validate: isLoggedIn,
        },
    );
}
