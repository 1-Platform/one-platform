context( 'Test dsal', () => {

    before( () => {
        cy.visit( Cypress.env( 'STAGE_HOST' ) + 'dsal/'  );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    //Create dsal project
    it( 'Number of systems should be between 1-8', () => {
        cy.contains( 'New Project' ).click()
        //number of systems should be between 1 and 8
        cy.get( '#systemCount' ).clear( { force: true }).type( '0' );
        cy.contains( 'Should be between 1-8' ).should( 'be.visible' )
        cy.get( '#systemCount' ).clear( { force: true }).type( '9' );
        cy.contains( 'Should be between 1-8' ).should( 'be.visible' )
        cy.get( '#systemCount' ).clear( { force: true } ).type( '1' );
    } )

    it( 'Select region', () => {
        cy.get( '.empty-state-container', { timeout: 10000 }).should('be.visible')
        cy.get( '#region' ).select( 'RDU2 - VC1', { force: true } )
    } )

    it( 'Select CPU', () => {
        cy.get( '[for= "cpu"]' ).should( 'include.text', 'Applied: 0' )
        cy.get( '[for= "cpu"]' ).first().click( { force: true })
        cy.contains( '1 x Intel Xeon E5-2630 v4 @ 2.20GHz (10c/20t)' ).click( { force: true })
        cy.get( '[for= "cpu"]' ).should( 'include.text', 'Applied: 1' )
        cy.get( '.applied-filters' ).should( 'include.text', '1 x Intel Xeon E5-2630 v4 @ 2.20GHz (10c/20t)' )
    } )

    it( 'Select RAM', () => {
        cy.get( '[for= "ram"]' ).first().should( 'include.text', 'Applied: 0' ).click( { force: true });
        cy.contains( '128 GB' ).click( { force: true });
        cy.get( '[for= "ram"]' ).should( 'include.text', 'Applied: 1' )
        cy.get( '.applied-filters' ).should( 'include.text', '128 GB' )
        cy.get( '.op-btn-primary' ).click( { force: true })
    } )

    it( 'Enter project title', () => {
        cy.faker = require( 'faker' );
        const words = cy.faker.lorem.words();
        cy.get( '#projectTitle' ).type( words );
    } )

    it( 'Select floating IPS', () => {
        cy.get( '#floatingIPs' ).select( '5' );
        cy.get( '#notes' ).type( 'test' );
        cy.get( '.op-btn-primary' ).click( { force: true })
    } )

    it( 'Enter Project desc', () => {
        cy.get( '#projectDescription' ).type( 'Test' );
    } )

    it( 'Enter Project sponsors', () => {
        cy.get( '#projectSponsors' ).click( { force: true }).type('Test');
    } )

    it( 'Select Red Hat technology', () => {
        cy.get( '.multiselect-pills' ).within( () => {
            cy.contains( 'Containers' ).click( { force: true })
        } )
        cy.get( '.op-btn-primary' ).click( { force: true })
    } )

    /*it( 'Go back from confirm project request page', () => {
        cy.get( '.modal-footer' ).within( () => {
            cy.contains( 'Back' ).click( { force: true })
        } )
        cy.get( '#projectSponsors' ).should('be.visible')
    } )*/

    it( 'Confirm the project request', () => {
        cy.wait( 150 );
        cy.on( "window:alert", ( str ) => {
            expect( str ).to.get( ".modal-footer" );
            cy.get( '.modal-footer' ).within( () => {
                cy.contains( ' Confirm Request ' ).click( {force: true} );
            } );
            cy.contains( 'Project Requested Successfully' ).should( 'be.visible' );
        } );
    })
})
