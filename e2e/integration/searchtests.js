/// <reference types="Cypress" />
/// <reference types="cypress-xpath" />

context( 'Test search', () => {
    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'QA_HOST' ) +'search');
        cy.get( '#username').type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    it( 'Test for valid search count', () => {
        cy.wait( 10000 )
        cy.get('input[name="query"]' ,{timeout:5000}).focus().type('*.*{enter}', { force: true } );
        cy.wait(500)
        cy.contains('results found' ).should( 'be.visible')
    })

    it( 'Test for search result', () => {
        cy.get( '.search-result-section', { timeout: 20000 } ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' )
        } )
    } )

    it( 'Test for search timestamp', () => {
        cy.get( '.search-result-section' ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( () => {
                cy.get( '.search-timestamp').should( 'be.visible' );
            } );
        } );
    } )

    it( 'Test for search title', () => {
        cy.get( '.search-result-section' ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( () => {
                cy.get( '.search-title' ).should( 'be.visible' );
            } );
        } );
    } )

    it( 'Test for search abstract', () => {
        cy.get( '.search-result-section').should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( () => {
                cy.get( '.search-abstract' ).should( 'be.visible' );
            } );
        } );
    } )

    it( 'Test for search tag', () => {
        cy.get( '.search-result-section' ).should( 'be.visible' ).within( () => {
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
            cy.contains( 'Apps' ).click({force:true});
        } )
        cy.get( '.search-result-section' ).should( 'be.visible' ).within( () => {
            cy.get( '.pf-u-mt-md' ).should( 'be.visible' ).each( (elem,index) => {
                cy.get( '.search-tag' ).each( ( elem2, index ) => {
                    cy.wrap( elem2 ).should( 'be.visible' ).should( 'contain.text', 'Apps' );
                })
            } );
        } )
        cy.get( '#select-checkbox-expanded-toggle' ).first().click( { force: true } );
    } )

    it( 'Test for sort application', () => {
        cy.xpath( '(//button[@id="select-checkbox-expanded-toggle"])[2]' ).click({force:true}).then( () => {
            cy.get( '.pf-c-select__menu' ).should( 'be.visible' )
            cy.contains('Oldest First').click({force:true})
        })
    })
    it( 'Test for invalid search', () => {
        cy.wait( 15000 );
        cy.get('.opc-nav-search__btn').click( { force: true } );
        cy.wait(3000)
        cy.get( 'input[name="query"]' ).focus().type( 'qwertyuiopasdgthchgbtnjkmnvxs', { force: true } );
        cy.wait(500)
        cy.get('.opc-nav-search__btn' ).click( { force: true } );

        cy.get( '#username' ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.get( '.search-result-section' ).should( 'be.visible' ).within( () => {
            cy.contains( "Can't find anything related to ").should( 'be.visible' );
            } );
    } )
})
