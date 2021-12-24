/// <reference types="Cypress" />

context( 'Test search', () => {
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
    it( 'Test for valid search count', () => {
        cy.wait( 10000 )
        cy.get('input[name="query"]' ,{timeout:5000}).focus().type('Feedback{enter}', { force: true } );
        cy.wait(500)
        cy.contains('results found' ).should( 'be.visible')
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
            cy.contains( 'Feedback' ).click({force:true});
        } )
        cy.get( '.search-result-section', { timeout: 5000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( (elem,index) => {
                cy.get( '.search-tag' ).each( ( elem2, index ) => {
                    cy.wrap( elem2 ).should( 'be.visible' ).should( 'contain.text', 'Feedback' );
                })
            } );
        } )
        cy.get( '#select-checkbox-expanded-toggle' ).first().click( { force: true } );
    } )

    it( 'Test for sort application', () => {
        cy.get('#select-checkbox-expanded-toggle')
    })
    it( 'Test for invalid search', () => {
        cy.wait( 15000 );
        cy.get('.opc-nav-search__btn', { timeout: 5000 } ).click( { force: true } );
        cy.wait(3000)
        cy.get( 'input[name="query"]',{timeout:5000} ).focus().type( 'qwertyuiopasdgthchgbtnjkmnvxs', { force: true } );
        cy.wait(500)
        cy.get('.opc-nav-search__btn' ).click( { force: true } );

        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.get( '.search-result-section', { timeout: 5000 } ).should( 'be.visible' ).within( () => {
            cy.contains( "Can't find anything related to ", { timeout: 5000 }).should( 'be.visible' );
            } );
    } )
})
