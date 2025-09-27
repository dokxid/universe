describe("Stories", () => {
    it("can visit stories page", () => {
        cy.visit("/universe/stories");
        cy.get("h1").contains("Stories");
    });
    it("unauthenticated users can open a story", () => {
        cy.visit("/universe/stories");
        cy.get("a[href*='/test/stories/view/']").first().click();
        cy.url().should("include", "/stories/view/");
    });
});
