import {
    loginAsAdmin,
    loginAsEditor,
    loginAsSuperAdmin,
} from "../support/commands";

describe("Sign In Prompt", () => {
    it("unauthenticated users should see a login button in universe map", () => {
        cy.visit("/universe/map");
        cy.get("a[href='/universe/login']").should("exist");
    });
    it("unauthenticated users should see a login button in lab map", () => {
        cy.visit("/test/map");
        cy.get("a[href='/test/login']").should("exist");
    });
});

describe("Super Admin", () => {
    it("can login as Super Admin", () => {
        loginAsSuperAdmin();
        cy.visit("/universe/map");
        cy.get("a[href='/universe/login']").should("not.exist");
        cy.get(".h-5 > p.text-xs").should("contain", "Super Admin");
    });
});

describe("Admin", () => {
    it("can login as Admin", () => {
        loginAsAdmin();
        cy.visit("/test/map");
        cy.get("a[href='/test/login']").should("not.exist");
        cy.get(".h-5 > p.text-xs").should("contain", "Admin");
    });
    it("Admin should not see super admin features", () => {
        loginAsAdmin();
        cy.visit("/test/map");
        cy.get("a[href='/universe/labs/manage']").should("not.exist");
    });
});

describe("Editor", () => {
    it("can login as Editor", () => {
        loginAsEditor();
        cy.visit("/test/map");
        cy.get("a[href='/test/login']").should("not.exist");
        cy.get(".h-5 > p.text-xs").should("contain", "Editor");
    });
    it("Editor should not see super admin features", () => {
        loginAsEditor();
        cy.visit("/test/map");
        cy.get("a[href='/universe/labs/manage']").should("not.exist");
    });
    it("Editor should not see admin features", () => {
        loginAsEditor();
        cy.visit("/test/map");
        cy.get("a[href='/test/lab/settings']").should("not.exist");
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
