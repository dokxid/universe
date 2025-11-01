import {
    loginAsAdmin,
    loginAsMember,
    loginAsSuperAdmin,
} from "../support/commands";

const STORY_CREATE_BUTTON_LABEL = "Create story here";

describe("Map Overlay Interactions", () => {
    it("map settings button changes link to settings", () => {
        cy.visit("/universe/map");
        cy.get("a[href='/universe/map-settings']").should("exist");
    });
    it("map settings button opens settings modal", () => {
        cy.visit("/universe/map");
        cy.get("a[href='/universe/map-settings']").click();
        cy.contains("Map Settings").should("exist");
    });
    it("map settings standalone page should work", () => {
        cy.visit("/universe/map-settings");
        cy.contains("Map Settings").should("exist");
    });
    it("right clicking on map opens context menu", () => {
        cy.visit("/universe/map");
        cy.get("#mainMap").rightclick();
        cy.contains("Copy location").should("exist");
    });
    it("guests cannot see create story button on context menu on /universe/map", () => {
        cy.visit("/universe/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("not.exist");
    });
    it("superadmins cannot see create story button on context menu on /universe/map", () => {
        loginAsSuperAdmin();
        cy.visit("/universe/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("not.exist");
    });
    it("admins cannot see create story button on context menu on /universe/map", () => {
        loginAsAdmin();
        cy.visit("/universe/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("not.exist");
    });
    it("members cannot see create story button on context menu on /universe/map", () => {
        loginAsMember();
        cy.visit("/universe/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("not.exist");
    });
    it("guests cannot see create story button on context menu", () => {
        cy.visit("/test/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("not.exist");
    });
    it("superadmins can see create story button on context menu on /test/map", () => {
        loginAsSuperAdmin();
        cy.visit("/test/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("exist");
    });
    it("admins can see create story button on context menu on /test/map", () => {
        loginAsAdmin();
        cy.visit("/test/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("exist");
    });
    it("members can see create story button on context menu on /test/map", () => {
        loginAsMember();
        cy.visit("/test/map");
        cy.get("#mainMap").rightclick();
        cy.contains(STORY_CREATE_BUTTON_LABEL).should("exist");
    });
});
