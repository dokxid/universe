import { loginAsSuperAdmin } from "../support/commands";

describe("Elevation Requests", () => {
    it("Super Admin can visit /universe/elevation-requests", () => {
        loginAsSuperAdmin();
        cy.visit("/universe/elevation-requests");
        cy.get(".h1").contains("Elevation Requests");
    });
    it("Super Admin can visit lab elevation requests page", () => {
        loginAsSuperAdmin();
        cy.visit("/test/elevation-requests");
        cy.get(".h1").contains("Elevation Requests");
    });
});

it('author name should link to user view page', function() {
    loginAsSuperAdmin()
    cy.visit('/test/elevation-requests')
    
});
