// inspect the caught error
cy.on("uncaught:exception", (e) => {
    if (e.message.includes("cannot have a negative time stamp.")) {
        // we expected this error, so let's ignore it
        // and let the test continue
        return false;
    }
    // on any other error message the test fails
});
