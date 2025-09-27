describe("Routing", () => {
    it("should navigate to the universe map page when visiting /", () => {
        cy.visit("/");
        cy.url().should("include", "/universe/map");
    });
    it("should navigate to the lab map page when visiting /{lab_slug}", () => {
        cy.visit("/test");
        cy.url().should("include", "/test/map");
    });
});
