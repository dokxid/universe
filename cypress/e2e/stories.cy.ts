describe("Stories", () => {
    it("can visit stories page", () => {
        cy.visit("/universe/stories");
        cy.get("h1").contains("Stories");
    });
    it("unauthenticated users can open a story", () => {
        cy.visit("/universe/stories");
        cy.get("a[href='/test/stories/view/68dda462d90f3ee95fa40a21']").click();
        cy.url().should("include", "/stories/view/");
    });
});
