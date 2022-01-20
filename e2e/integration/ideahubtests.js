context( 'Test for Idea Hub', () => {

    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'QA_HOST' ) + 'ideas/' );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } );
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );

    it( 'Test for post a new idea', () => {
        cy.wait(2000)
        cy.contains( 'Post a new idea!', { timeout: 5000 } ).click({force:true});
        cy.get( '#title' ).type( 'e2e test automation' ,{force:true});
        cy.get( '#description' ).type( 'e2e test automation' ,{force:true});
        cy.get( '[aria-label="Options menu"]' ).click({force:true});
        cy.contains( 'automation' ).click( { force: true } );
        cy.contains( 'Post my idea!' ).click({force:true});
        cy.wait( 5000 );
        cy.get( '.pf-c-card__body' ).first().should( 'contain.text', 'e2e test automation' );
    } );

    it( 'Test for top header section', () => {
        cy.get( '.pf-c-page__main-section' ).first().within( () => {
            cy.get( '.pf-c-title' ).should( 'include.text', 'Innovation Hub' );
            cy.get( '.pf-c-content' ).should( 'include.text', 'A place to share your ideas and find other passionate people' );
        } );
    } );

    it( 'Test for commenting an idea', () => {
        cy.get( '.pf-l-stack' ).within( () => {
            cy.get( '.pf-l-stack__item' ).first().click({force:true});
        } );
        cy.get( '#comment' ).type( 'test' );
        cy.get( '.pf-c-form__actions' ).within( () => {
            cy.contains( 'Submit' ).click({force:true});
        })
        cy.get( '[aria-label="comment-content"]',{ timeout: 10000 } ).should( 'be.visible' );
    } );

    it( 'Test for liking the comment', () => {
        cy.contains( 'Like' ).click();
        cy.contains( 'Unlike', { timeout: 10000 } ).should( 'be.visible' );
    } );

    it( 'Test for voting an idea', () => {
        cy.contains( 'VOTE' ).click({force:true});
        cy.contains( 'VOTED', { timeout: 10000 } ).should( 'be.visible' );
    } )

    it( 'Test for recent ideas table', () => {
        cy.visit( Cypress.env( 'QA_HOST' ) + 'ideas/' );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ),{force:true} );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
        cy.get( '.pf-l-stack' ).within( () =>{
            cy.get( '.pf-l-stack__item' ).each( () => {
                cy.get( '.pf-c-card__body' ).should( 'be.visible' ).within( () => {
                    cy.get('.pf-l-flex').should('be.visible')
                })
            })
        })
    } )

    it( 'Test for archive an idea', () => {
        cy.get( '.pf-l-stack' ).within( () => {
            cy.get( '.pf-l-stack__item' ).first().within( () => {
                cy.get( '.pf-c-dropdown', { timeout: 5000 } ).click({force:true});
                cy.contains( 'Archive my idea' ).click({force:true});
            } );
        } );
        cy.contains( 'Successfully archived' ).should( 'be.visible' );
        cy.get( '.pf-l-stack' ).within( () => {
            cy.get( '.pf-l-stack__item' ).first().within( () => {
                cy.get( '.pf-c-dropdown' ).click();
                cy.contains( 'Unarchive my idea' ).click({force:true});
            } );
        } );
        cy.contains( 'Successfully unarchived' ).should( 'be.visible' );
    } )

    it( 'Test for popular ideas table', () => {
        cy.get( '.pf-c-tabs__item-text' ).last().click({force:true})
        cy.get( '.pf-l-stack' ).within( () => {
            cy.get( '.pf-l-stack__item' ).each( () => {
                cy.get( '.pf-c-card__body' ).should( 'be.visible' ).within( () => {
                    cy.get( '.pf-l-flex' ).should( 'be.visible' );
                } );
            } );
        } )
    } )

    it( 'Test for my ideas', () => {
        cy.contains( 'My ideas' ).click({force:true})
        cy.get( '.pf-l-stack' ).within( () => {
            cy.get( '.pf-l-stack__item' ).each( () => {
                cy.get( '.pf-c-card__body' ).should( 'be.visible' ).within( () => {
                    cy.get( '.pf-l-flex' ).should( 'be.visible' );
                    cy.contains('one-portal-test sso-tester').should('be.visible')
                } );
            } );
        } )
    } )
})
