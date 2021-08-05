context( 'Test devloper console', () => {
    before( () => {
        cy.visit( Cypress.env( 'QA_HOST' ) + 'console' );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Test for create the application', () => {
        cy.contains( 'Create new App', { timeout: 5000 } ).click();
        cy.get( '#app-name' ).type( 'e2e test automation' );
        cy.get( '#app-path' ).type( 'e2e test automation' );
        cy.get( '#app-desc' ).type( 'e2e test automation' );
        cy.contains( 'Create App' ).click();
        cy.contains( 'App Created Successfully!' ).should( 'be.visible' );
    } );

    it( 'Test for update the application', () => {
        cy.contains( 'App Settings' ).click();
        cy.get( '#name' ).clear().type( 'e2e test automation update' );
        cy.contains( 'Update' ).click();
        cy.contains( 'App Updated Successfully!' ).should( 'be.visible' );
    } );

    it( 'Test for delete the application', () => {
        cy.contains( 'Delete this App' ).click();
        cy.get( '#delete-app', { timeout: 5000 } ).type( 'e2e test automation update' );
        cy.contains( 'I understand the consequences, delete this app' ).click();
        cy.contains( 'App Deleted Successfully!' ).should( 'be.visible' );
    } );
} )
