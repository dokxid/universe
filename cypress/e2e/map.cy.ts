describe("Map Features", () => {
    it("can visit map page", () => {
        cy.visit("/universe/map");
        cy.get("canvas#deckgl-overlay").should("exist");
    });
    it("experience selector can change search params", () => {
        cy.visit("/universe/map");
        cy.get('[href="/universe/map?exp=istanbul"] > .bg-card > .overflow-hidden > [data-radix-aspect-ratio-wrapper=""] > div > .group-hover\:opacity-75').click();
        cy.url().should("include", "?exp=istanbul");
    });
});
