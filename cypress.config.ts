import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        watchForFileChanges: false,
        pageLoadTimeout: 10000,
        setupNodeEvents() {
            // implement node event listeners here
        },
        baseUrl: "http://localhost:3000",
    },
    blockHosts: ["*stadiamaps.com", "*amazonaws.com", "/api/images/**"],
});
