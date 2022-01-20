/// <reference types="Cypress" />
import { gaugechart } from "../helper/apps.list";

context( 'Test lighthouse', () => {
    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'QA_HOST' ) + 'lighthouse' );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'measure performance steps', () => {
        cy.contains( 'Measure performance of your application' ).should( 'be.visible' )
        cy.contains( ' Run Tests on your site ' ).should( 'be.visible' )
        cy.contains( "Enter your site's url to see how well it performs across all audits." ).should( 'be.visible' )
        cy.contains( ' Look at what matters ' ).should( 'be.visible' )
        cy.contains( " See your site's performance across the areas you care about. " ).should( 'be.visible' )
        cy.contains( ' Get tips for improving ' ).should( 'be.visible' )
        cy.contains( "Each test comes with helpful steps to improve your site's results." ).should( 'be.visible' )
    } );

    it( 'generate report', () => {
        cy.get( '#sites' ).should( 'be.visible' ).type( 'https://www.google.com/' )
        cy.contains( ' Generate Report ' ).click()
        cy.contains( 'Audit started successfully', { timeout: 20000 } ).should( 'be.visible' )
        cy.get( '#codeBlock' ).should( 'be.visible' )
        cy.contains( 'Audit Completed', { timeout: 60000 } ).should( 'be.visible' );
        gaugechart.forEach( function ( item ) {
            cy.get( '.gauge-chart', { timeout: 60000 } ).should( 'be.visible' ).each( () => {
                cy.contains( `${ item }` ).should( 'be.visible' );
            })
        } );
       cy.get('.lh-score-card__range').its('length').should('eq', 3)
    } );

    it( 'verify documentation link', () => {
        cy.get( 'a[ href = "/get-started/docs/apps/internal/lighthouse" ]' ).should( 'have.text', 'Documentation' );
    })
})
