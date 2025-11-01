import {
    loginAsAdmin,
    loginAsMember,
    loginAsSuperAdmin,
} from "../support/commands";

describe("User Navigation", () => {
    it("can visit map page", () => {
        cy.visit("/universe/map");
        cy.get("h1").contains("Heritage Universe");
    });
    it("can visit labs page", () => {
        cy.visit("/universe/labs");
        cy.get("h1").contains("Our Heritage Labs");
    });
    it("can visit public stories page", () => {
        cy.visit("/universe/stories");
        cy.get(".h1").contains("Stories");
    });
    it("can visit the universe contact page", () => {
        cy.visit("/universe/contact");
        cy.get(".h1").contains("Contact us");
    });
    it("can visit a labs contact page", () => {
        cy.visit("/test/contact");
        cy.get(".h1").contains("Contact us");
    });
});

const ELEVATION_REQUEST_URL = "/universe/elevation-requests";
describe("Elevation Requests", () => {
    it("Super Admin can visit " + ELEVATION_REQUEST_URL, () => {
        loginAsSuperAdmin();
        cy.visit(ELEVATION_REQUEST_URL);
        cy.get(".h1").contains("Elevation Requests");
    });
    it("Admin cannot visit " + ELEVATION_REQUEST_URL, () => {
        loginAsAdmin();
        cy.visit(ELEVATION_REQUEST_URL);
        cy.get(".next-error-h1").contains("404");
    });
    it("Member cannot visit " + ELEVATION_REQUEST_URL, () => {
        loginAsMember();
        cy.visit(ELEVATION_REQUEST_URL);
        cy.get(".next-error-h1").contains("404");
    });
    it("Guests cannot visit " + ELEVATION_REQUEST_URL, () => {
        cy.visit(ELEVATION_REQUEST_URL);
        cy.url().should("include", "/universe/login");
        cy.get("h2").contains("Login to your account");
    });
});

const DEBUG_SETTINGS_URL = "/universe/debug-settings";
describe("Debug Settings", () => {
    it("Super Admin can visit debug settings page", () => {
        loginAsSuperAdmin();
        cy.visit(DEBUG_SETTINGS_URL);
        cy.get(".h1").contains("Debug Settings");
    });
    it("Admin cannot visit debug settings page", () => {
        loginAsAdmin();
        cy.visit(DEBUG_SETTINGS_URL);
        cy.get(".next-error-h1").contains("404");
    });
    it("Member cannot visit debug settings page", () => {
        loginAsMember();
        cy.visit(DEBUG_SETTINGS_URL);
        cy.get(".next-error-h1").contains("404");
    });
    it("Guests cannot visit debug settings page", () => {
        cy.visit(DEBUG_SETTINGS_URL);
        cy.url().should("include", "/universe/login");
        cy.get("h2").contains("Login to your account");
    });
});

describe("Lab Management", () => {
    it("Super Admin can visit labs manage page", () => {
        loginAsSuperAdmin();
        cy.visit("/universe/labs/manage");
        cy.get(".h1").contains("Manage Heritage Labs");
    });
    it("Admin cannot visit labs manage page", () => {
        loginAsAdmin();
        cy.visit("/universe/labs/manage");
        cy.get(".next-error-h1").contains("404");
    });
    it("Member cannot visit labs manage page", () => {
        loginAsMember();
        cy.visit("/universe/labs/manage");
        cy.get(".next-error-h1").contains("404");
    });
    it("Guests cannot visit labs manage page", () => {
        cy.visit("/universe/labs/manage");
        cy.url().should("include", "/universe/login");
        cy.get("h2").contains("Login to your account");
    });
});

describe("Lab Settings", () => {
    it("Super Admin can visit lab settings page", () => {
        loginAsSuperAdmin();
        cy.visit("/test/lab/settings");
        cy.get(".h1").contains("Lab Settings");
    });
    it("Admin can visit lab settings page", () => {
        loginAsAdmin();
        cy.visit("/test/lab/settings");
        cy.get(".h1").contains("Lab Settings");
    });
    it("Member cannot visit lab settings page", () => {
        loginAsMember();
        cy.visit("/test/lab/settings");
        cy.get(".next-error-h1").contains("404");
    });
    it("Guests cannot visit lab settings page", () => {
        cy.visit("/test/lab/settings");
        cy.url().should("include", "/test/login");
        cy.get("h2").contains("Login to your account");
    });
});

describe("Lab Member Management", () => {
    it("Super Admin can visit Lab Member Management page", () => {
        loginAsSuperAdmin();
        cy.visit("/test/lab/manage");
        cy.get(".h1").contains("Manage Lab Members");
    });
    it("Admin can visit Lab Member Management page", () => {
        loginAsAdmin();
        cy.visit("/test/lab/manage");
        cy.get(".h1").contains("Manage Lab Members");
    });
    it("Member cannot visit Lab Member Management page", () => {
        loginAsMember();
        cy.visit("/test/lab/manage");
        cy.get(".next-error-h1").contains("404");
    });
    it("Guests cannot visit Lab Member Management page", () => {
        cy.visit("/test/lab/manage");
        cy.url().should("include", "/test/login");
        cy.get("h2").contains("Login to your account");
    });
});

describe("Stories Management", () => {
    it("Super Admin can visit Stories Management page", () => {
        loginAsSuperAdmin();
        cy.visit("/test/stories/manage");
        cy.get(".h1").contains("Manage Lab Stories");
    });
    it("Admin can visit Stories Management page", () => {
        loginAsAdmin();
        cy.visit("/test/stories/manage");
        cy.get(".h1").contains("Manage Lab Stories");
    });
    it("Member cannot visit Stories Management page", () => {
        loginAsMember();
        cy.visit("/test/stories/manage");
        cy.get(".h1").contains("Manage Lab Stories");
    });
    it("Guests cannot visit Stories Management page", () => {
        cy.visit("/test/stories/manage");
        cy.url().should("include", "/test/login");
        cy.get("h2").contains("Login to your account");
    });
});
