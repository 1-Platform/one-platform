// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add("login", (username, password) => {
    cy.get('#username', { timeout: 5000 }).type(username);
    cy.get('#password').type(password,{log:false});
    cy.get('#submit').click();
} )
Cypress.Commands.add("SortFilterSelection", () => {
    cy.contains("Sort").click({ force: true });

        // Get the open dropdown menu items.
        cy.get("ul[role='listbox'] li button").then((elements) => {
            // Get a random number using the max number of elements.
            const max = elements.length;
            const min = 0;
            const randomNumber = Math.floor(Math.random() * (max - min) + min);

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap(elements[randomNumber]).click({ force: true });
        });
})
