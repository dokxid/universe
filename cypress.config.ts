import { defineConfig } from "cypress";

export default defineConfig({
  projectId: '6fm31q',
    e2e: {
        watchForFileChanges: false,
        pageLoadTimeout: 10000,
        setupNodeEvents() {
            // implement node event listeners here
        },
        baseUrl: "http://localhost:3000",
    },
    blockHosts: ["*amazonaws.com", "/api/images/**"],
});
