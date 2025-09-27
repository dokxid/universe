describe("Map Features", () => {
    it("can visit map page", () => {
        cy.visit("/universe/map");
        cy.get("canvas#deckgl-overlay").should("exist");
    });
    it("experience selector can change search params", () => {
        cy.visit("/universe/map");
        cy.get("[aria-label='Experience Selector']").click();
        cy.get("[data-value='test']")
            .click()
            .url()
            .should("include", "?exp=test");
    });
});
