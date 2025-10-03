describe("Authentication", () => {
    it("unauthenticated users should see a login button in lab map", () => {
        cy.visit("/test/map");
        cy.get("a[href='/auth/login']").should("exist");
    });
});

describe("Permissions", () => {
    it("unauthenticated users should navigate to the login page when trying to create a story", () => {
        cy.request({ url: "/test/stories/create", followRedirect: false }).then(
            (response) => {
                expect(response.status).to.eq(307);
                expect(response.redirectedToUrl).to.include(
                    "https://api.workos.com"
                );
            }
        );
    });
});
