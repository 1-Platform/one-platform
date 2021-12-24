/// <reference types="Cypress" />
context( 'Test feedback form', () => {

    before( () => {
        cy.viewport( 1280, 720 );
        cy.visit( Cypress.env( 'QA_HOST' ) );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Report bug', () => {
        cy.get( '#feedback-popup', { timeout: 10000 } ).click().wait( 1000 );
        cy.get( `[data-feedback-type="bug"]`, { timeout: 10000 } ).click();
        cy.contains( 'Other', { timeout: 10000 } ).click( { force: true } );
        cy.get( '#bugsummary' ).should( 'not.be.disabled' )
        cy.get( '#bugsummary' ).type( 'e2e test automation',{force:true} );
        cy.contains( 'Submit', { timeout: 10000 } ).click();
        cy.contains( "Thanks for your feedback. Your experience is important to us!" ).should( 'be.visible' );
    } );

    it( 'Share feedback', () => {
        cy.get( '#feedback-popup', { timeout: 10000 } ).click().wait( 1000 );
        cy.get( `[data-feedback-type="feedback"]`, { timeout: 10000 } ).click();
        cy.contains( 'Excellent', { timeout: 10000 } ).click( { force: true } );
        cy.get( '#feedbacksummary' ).type( 'e2e test automation' ,{force:true});
        cy.contains( 'Submit', { timeout: 10000 } ).click( { force: true } );
        cy.contains( "Thanks for your feedback. Your experience is important to us!" ).should( 'be.visible' );
    } );

    it( 'Verify documentation link', () => {
        cy.get( '#feedback-popup', { timeout: 10000 } ).click().wait( 1000 );
        cy.get( 'a[href = "/get-started"]', { timeout: 10000 } ).should( 'contain.text', 'Documentation' );
    } );

    it( 'Test if feedback and bug counts are visible in view existing feedback section', () => {
        cy.visit( Cypress.env( 'QA_HOST' ) + 'feedback' );
        cy.get( '#username', { timeout: 20000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.get( '#card-action', { timeout: 20000 } ).should( 'be.visible' ).each( () => {
            cy.get( '.pf-c-card__header' ).within( () => {
                cy.get( '.count' ).should( 'be.visible' );
            } );
            cy.get( '#card-action-check-label' ).should( 'be.visible' );
        } );
    } );

    it( 'Test if list of feedback is visible', () => {

        cy.get( '.feedback-item' ).should( 'be.visible' ).each( () => {
            cy.get( '.feedback-title' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.get( '.feedback-description' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.get( '.tag-module-name' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.get( '.pf-u-display-flex' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.get( '.feedback-experience' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.get( '.feedback-assignees' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
        } );
    } );

    it( 'Test for expansion of feedback from feedback list', () => {
        cy.get( '.feedback-item' ).should( 'be.visible' ).first().within( () => {
            cy.get( '.feedback-title' ).should( 'be.visible' ).click();
            cy.get( '.feedback-description' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.get( '.pf-u-display-flex' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.get( '.pf-u-font-size-sm' ).should( 'be.visible' ).invoke( 'text' ).its( 'length' ).should( 'to.be.greaterThan', 1 );
            cy.contains( 'View Details' ).should( 'be.visible' );
            cy.get( `a[ href ^= "${ Cypress.env( 'JIRA' ) }"]` ).invoke( 'text' ).then( ( text ) => {
                expect( text.replace( /\u00a0/g, ' ' ) ).equal( 'JIRA Link ' );
            })
        } );
    } );

    it( 'Test for search feedback from feedback list', () => {
        cy.get( '#input-search' ).type( 'test' );
        cy.get( '.feedback-item' ).should( 'be.visible' ).each( () => {
            cy.get( '.feedback-title' ).should( 'include.text', 'test' );
        } );
        cy.get( '#input-search' ).clear();
    } );

    it( 'Test for pagination in feedback list', () => {
        //Go to next page validation
        cy.get( '.feedback-item' ).should( 'be.visible' ).first().invoke( 'text' ).then( ( BeforeNextPage ) => {
            cy.get( 'button[aria-label="Go to next page"]' ).click();
            cy.get( '.feedback-item' ).first().invoke( 'text' ).then( ( AfterNextPage ) => {
                expect( BeforeNextPage ).not.to.eq( AfterNextPage );
            } );
        } );
        cy.get( 'button[aria-label="Go to previous page"]' ).click();
        //per Page items division validation
        cy.get( '.feedback-item' ).should( 'be.visible' ).should( 'have.length', 10 );
        cy.get( '#perPage' ).select( '5 per page' );
        cy.get( '.feedback-item' ).should( 'be.visible' ).should( 'have.length', 5 );
    } );

} );
