describe("Availability", () => {
    it("universe page is available on /universe/map", () => {
        cy.visit("/universe/map");
        cy.contains("Heritage Universe");
    });
    it("universe page is available on /universe", () => {
        cy.request({ url: "/universe", followRedirect: false }).then(
            (response) => {
                expect(response.status).to.eq(308);
                expect(response.redirectedToUrl).to.include("/universe/map");
            }
        );
    });
    it("universe page is available on /", () => {
        cy.request({ url: "/", followRedirect: false }).then((response) => {
            expect(response.status).to.eq(308);
            expect(response.redirectedToUrl).to.include("/universe/map");
        });
    });
});

describe("Functionality", () => {
    it("map exists on universe map", () => {
        cy.visit("/universe/map");
        cy.get("canvas#deckgl-overlay").should("exist");
    });
});

describe("Layout Features", () => {
    it("can visit map page", () => {
        cy.visit("/universe/map");
        cy.get("canvas#deckgl-overlay").should("exist");
    });
    it("explore button is visible", () => {
        cy.visit("/universe/map");
        cy.contains("Explore").should("exist");
    });
    it("experience selector can change search params", () => {
        cy.visit("/universe/map");
        cy.get(
            '[href="/universe/map?exp=test"] > .rounded-xl > .p-4 > .flex-row > .flex-1 > .text-base'
        ).click();
        cy.url().should("include", "?exp=test");
    });
});

describe("Map Overlay Interactions", () => {
    it("back to universe button clears search params", () => {
        cy.visit("/universe/map?exp=test");
        cy.get(".top-0.left-0 > .gap-3 > .flex").click();
        cy.url().should("not.include", "?exp=test");
    });
});

describe("Authorization", () => {
    it("unauthenticated users should not see a login button in universe map", () => {
        cy.visit("/universe/map");
        cy.get("button").contains("Log in").should("not.exist");
    });
    it("unauthenticated users should not see Super Admin Features in universe map", () => {
        cy.visit("/universe/map");
        cy.contains("Super Admin Features").should("not.exist");
    });
});
