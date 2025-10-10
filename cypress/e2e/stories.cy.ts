describe("Stories", () => {
    it("can visit stories page", () => {
        cy.visit("/universe/stories");
        cy.get("h1").contains("Stories");
    });
    it("unauthenticated users can open a story", () => {
        cy.visit("/universe/stories");
        cy.get('[data-testid="story-card-link"]').then(($link) => {
            const href = $link[0].getAttribute("href");
            cy.visit(href as string);
        });
        cy.url().should("include", "/stories/view/");
    });
});
