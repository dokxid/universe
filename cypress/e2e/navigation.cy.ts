describe("User Navigation", () => {
    it("can visit map page", () => {
        cy.visit("/universe/experiences");
        cy.get("h1").contains("Our Co-Lab Communities");
    });
    it("can visit experiences page", () => {
        cy.visit("/universe/experiences");
        cy.get("h1").contains("Our Co-Lab Communities");
    });
    it("can visit public stories page", () => {
        cy.visit("/universe/stories");
        cy.get("h1").contains("Stories");
    });
});
