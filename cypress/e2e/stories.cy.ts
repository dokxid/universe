describe("Stories", () => {
    it("can visit stories page", () => {
        cy.visit("/universe/stories");
        cy.get("h1").contains("Stories");
    });
    it("unauthenticated users can open a story", () => {
        cy.visit("/universe/stories");
        cy.get("a").contains("Test Story").click();
        cy.url().should("include", "/universe/stories/test-story-1");
    });
});
