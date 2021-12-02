/// <reference types="Cypress" />
context( 'Test search', () => {
    before( () => {
        cy.visit( Cypress.env( 'QA_HOST' ) );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Test for valid search count', () => {
        cy.get( '.opc-nav-search__btn' ).click( { force: true } )
        cy.wait(5000)
        cy.get( 'input[name="query"]' ).type( 'Feedback' ,{force:true});
        cy.get( '.opc-nav-search__btn' ).click();
        cy.get( '.pf-u-mt-xl' ).should( 'include.text','results found')
    })

    it( 'Test for search result', () => {
        cy.get( '.search-result-section', { timeout: 20000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' )
        } )
    } )

    it( 'Test for search timestamp', () => {
        cy.get( '.search-result-section', { timeout: 20000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( () => {
                cy.get( '.search-timestamp', { timeout: 20000 } ).should( 'be.visible' );
            } );
        } );
    } )

    it( 'Test for search title', () => {
        cy.get( '.search-result-section', { timeout: 20000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( () => {
                cy.get( '.search-title' ).should( 'be.visible' );
            } );
        } );
    } )

    it( 'Test for search abstract', () => {
        cy.get( '.search-result-section', { timeout: 20000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( () => {
                cy.get( '.search-abstract' ).should( 'be.visible' );
            } );
        } );
    } )

    it( 'Test for search tag', () => {
        cy.get( '.search-result-section', { timeout: 20000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( () => {
                cy.get( '.search-tag' ).should( 'be.visible' );
            } );
        } );
    } )

    it( 'Test for Related Searched keywords visibility', () => {
        cy.get( '.pf-u-mt-md' ).last().within( () => {
            cy.contains( 'Related Searched keywords' ).should( 'be.visible' );
            cy.get( '.search-cursor' ).should( 'be.visible' );
        })
    })

    it( 'Test for select application', () => {
        cy.get( '#select-checkbox-expanded-toggle' ).first().click( { force: true } );
        cy.get( '.pf-c-select__menu' ).within( () => {
            cy.contains( 'Feedback' ).click();
        } )
        cy.get( '.search-result-section', { timeout: 5000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( (elem,index) => {
                cy.get( '.search-tag' ).each( ( elem2, index ) => {
                    cy.wrap( elem2 ).should( 'be.visible' ).should( 'contain.text', 'Feedback, BUG' );
                })
            } );
        } )
        cy.get( '#select-checkbox-expanded-toggle' ).first().click( { force: true } );
    } )

    it( 'Test for invalid search', () => {
        cy.get( 'input[name="query"]' ).click( { force: true } ).clear( { force: true } ).type( 'qwertyuiopasdgthchgbtnjkmnvxs' ,{force:true});
        cy.get( '.op-search__btn' ).click();
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.get( '.search-result-section', { timeout: 5000 } ).should( 'be.visible' ).within( () => {
            cy.contains( "Can't find anything related to ", { timeout: 5000 }).should( 'be.visible' );
            } );
    } )

})
