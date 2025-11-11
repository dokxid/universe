import { loginAsMember } from "../support/commands";

const STORY_TITLE_PUBLIC_LAB = "E2E Test Story, no draft, not elevated";
const STORY_TITLE_DRAFT_LAB = "E2E Test Story, draft, not elevated";
const STORY_TITLE_PUBLIC_ELEVATED = "E2E Test Story, not draft, elevated";
const STORY_TITLE_DRAFT_ELEVATED = "E2E Test Story, draft, elevated";

function createStory(title: string, isDraft: boolean, isElevated: boolean) {
    cy.visit("/test/stories/create");
    cy.intercept("POST", "/test/stories/create").as("createStory");
    cy.get('input[data-testid="title-input"]').type(title);
    cy.get(".text-node").type(
        "This is a test story created during E2E testing.",
    );
    cy.fixture("blender1.png", null).as("e2e_testImage");
    cy.get('input[data-testid="file-input"]').selectFile("@e2e_testImage");
    cy.contains("Add Tag").click();
    cy.get(".bg-popover > .h-9").click().type("computer{enter}");
    cy.get('input[data-testid="longitude-input"]').type("-122.4194");
    cy.get('input[data-testid="latitude-input"]').type("37.7749");
    cy.get("button[value='CC_BY']").click();
    cy.get('button[data-testid="draft-input"]').then(($button) => {
        if ($button.prop("value") === (isDraft ? "off" : "on")) {
            cy.wrap($button).click();
        }
    });
    cy.get('[data-testid="elevate-input"]').then(($button) => {
        if ($button.prop("value") === (isElevated ? "off" : "on")) {
            cy.wrap($button).click();
        }
    });
    cy.wait(1000); // Wait for any UI updates before submitting
    // cy.get('form[data-testid="add-story-form"]').submit();
    cy.get('button[data-testid="submit-story-button"]', { timeout: 10000 })
        .should("be.visible")
        .and("not.be.disabled")
        .click({ force: true });
    cy.wait("@createStory");
    cy.url().should("include", "/stories/view/", { timeout: 10000 });
    cy.get(".prose-h1").contains(title);
}

describe("Create Stories", () => {
    it("unauthenticated users should navigate to the login page when trying to create a story", () => {
        cy.request({ url: "/test/stories/create", followRedirect: false }).then(
            (response) => {
                expect(response.redirectedToUrl).to.include("/test/login");
            },
        );
    });
    it("authenticated users can access the create story page", () => {
        loginAsMember();
        cy.request({ url: "/test/stories/create", followRedirect: false }).then(
            (response) => {
                expect(response.status).to.not.eq(307);
            },
        );
    });
    it("authenticated users can create a new story (no draft, not elevated)", () => {
        loginAsMember();
        createStory(STORY_TITLE_PUBLIC_LAB, false, false);
    });
    it("authenticated users can create a new story (draft, not elevated)", () => {
        loginAsMember();
        createStory(STORY_TITLE_DRAFT_LAB, true, false);
    });
    it("authenticated users can create a new story (no draft, elevated)", () => {
        loginAsMember();
        createStory(STORY_TITLE_PUBLIC_ELEVATED, false, true);
    });
    it("authenticated users can create a new story (draft, elevated)", () => {
        loginAsMember();
        createStory(STORY_TITLE_DRAFT_ELEVATED, true, true);
    });
});

describe("Stories", () => {
    it("can visit stories page", () => {
        cy.visit("/universe/stories");
        cy.get(".prose-h1").contains("Stories");
    });
    it("unauthenticated users can open a public lab story", () => {
        cy.visit("/test/stories");
        cy.get('input[data-testid="story-title-filter-input"]').type(
            STORY_TITLE_PUBLIC_LAB,
        );
        cy.contains(STORY_TITLE_PUBLIC_LAB).click();
        cy.url().should("include", "/stories/view/");
        cy.get(".prose-h1").contains(STORY_TITLE_PUBLIC_LAB);
    });
    it("unauthenticated users can not see a draft lab story", () => {
        cy.visit("/test/stories");
        cy.get('input[data-testid="story-title-filter-input"]').type(
            STORY_TITLE_DRAFT_LAB,
        );
        cy.contains(STORY_TITLE_DRAFT_LAB).should("not.exist");
    });
    it("story author can see their draft story", () => {
        loginAsMember();
        cy.visit("/test/stories");
        cy.get('input[data-testid="story-title-filter-input"]').type(
            STORY_TITLE_DRAFT_LAB,
        );
        cy.contains(STORY_TITLE_DRAFT_LAB).click();
        cy.url().should("include", "/stories/view/");
        cy.get(".prose-h1").contains(STORY_TITLE_DRAFT_LAB);
    });
});
