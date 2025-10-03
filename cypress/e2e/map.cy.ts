describe("Map Overlay Interactions", () => {
    it("map settings button changes link to settings", () => {
        cy.visit("/universe/map");
        cy.get("a > .inline-flex").click();
        cy.url().should("include", "/map-settings");
    });
    it("map settings button opens settings modal", () => {
        cy.visit("/universe/map");
        cy.get("a > .inline-flex").click();
        cy.contains("Map Settings").should("exist");
    });
    it("map settings standalone page should work", () => {
        cy.visit("/universe/map-settings");
        cy.contains("Map Settings").should("exist");
    });
});
