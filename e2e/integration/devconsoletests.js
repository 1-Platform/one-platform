/// <reference types="Cypress" />
context( 'Test developer console', () => {
    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'QA_HOST' ) +'console');
        cy.get( '#username' ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click({force:true});
    } );


    it( 'Check whether the app is already existing', () => {
        cy.wait( 10000 )
        cy.get( 'h2' ).each( ( elem, index ) => {
            var heading = elem.text()
            cy.log( heading )
            if ( heading == 'e2e test automation' )  {
                cy.xpath( '//a//h2[text()="e2e test automation"]/ancestor::section/following-sibling::aside/descendant::button' ).click( { force: true } )
                cy.contains( 'Delete' ).click( { force: true } )
                  cy.get( '#delete-app').type( 'e2e test automation' );
        cy.contains( 'I understand the consequences, delete this app' ).click();
        cy.contains( 'App Deleted Successfully!' ).should( 'be.visible' );

            }
        })

    } )
    it( 'Check the count of apps existing on the dev console main page', () => {
        cy.get( 'article' ).its('length').as( 'countofapps' );
    } )
    it( 'Test for create the application', () => {
        cy.contains( 'Create new App').click();
        cy.get( '#app-name' ).type( 'e2e test automation' );
        cy.get( '#app-desc' ).type( 'e2e test automation' );
        cy.contains( 'Create App' ).click();
        cy.contains( 'App Created Successfully!').should( 'be.visible' );
    } );
    it( 'Verifying the count of apps displayed in dropdown',function () {
        cy.get( 'button[aria-label^="Options"]' ).click( { force: true } )
        cy.get( 'ul[role*="menu"] > li' ).then( ( elem ) => {
            var len = elem.length
            expect( len ).to.be.eq( this.countofapps );
        } )
        cy.get( 'button[aria-label^="Options"]' ).click( { force: true } )
        cy.wait(1000)
    })
    it( 'Get Count of Integrations', () => {

        cy.get(".pf-l-grid__item.pf-m-3-col.pf-m-2-col-on-xl nav ul li").its('length').as('lengthofintegration')
    } )
    it( 'Verify the integrations count same as Rows in Table of Overview', function () {
        cy.get( "article button span[class='pf-c-menu__item-text']" ).then( ( elem ) => {
            var lengthoftable = elem.length;
            expect(lengthoftable).to.be.eq(this.lengthofintegration-3)
        })
    } )
    it( 'Check OP Navbar Link and count of steps should be 5', () => {
        cy.get( '.app-details--sidebar--main-nav' ).within( () => {
            cy.contains('OP Navbar').should('be.visible').click({force:true});
        } )
        cy.get('code').should('have.length',5)
    } )

    it( 'Check Database link', () => {
          cy.get( '.app-details--sidebar--main-nav' ).within( () => {
            cy.contains('Database').click({force:true});
          } )

    } )
    it( 'Check Lighthouse config options page visiblity', () => {
        cy.get( '.app-details--sidebar--main-nav' ).within( () => {
            cy.contains( 'Lighthouse' ).should( 'be.visible' ).click( { force: true } );
        })
         cy.contains( 'Configure Lighthouse' ).should( 'be.visible' )
        cy.get( '.pf-c-empty-state__body' ).within( () => {
            cy.get( 'img' ).should( 'be.visible' )
            cy.contains( 'Learn more' ).should( 'be.visible' )
            cy.contains('Get Started').should('be.visible')
        })

    } )

    it( 'Test for header section of feedback page', () => {
        cy.get( '.app-details--sidebar--main-nav' ).within( () => {
            cy.contains('Feedback').click({force:true});
        } )

    } );

    it( 'Test for feedback target header', () => {
               cy.get( 'h3').should( 'contain.text', 'User Feedback')
        } )

it( 'Click on Edit Feedback', () => {
    cy.xpath( "//button[normalize-space()='Edit Feedback Config']" ).click();
    })

    it( 'Test for feedback target help circle', () => {
        cy.get('[name=help-circle-outline]').click()
        cy.contains( 'The target where the feeback should be submitted as an issue or a ticket.' ).should('be.visible')
    } )

    it( 'Test for selecting feedback target and save it', () => {
        cy.get( '.pf-c-form' ).within( () => {
            cy.contains( 'JIRA' ).click()
            cy.get( '#projectKey' ).type( 'Test' )
            cy.get( '#feedbackEmail' ).type( 'test@redhat.com' )
            cy.get( '[aria-disabled="true"]' ).should( 'be.visible' );
            cy.contains( 'Save' ).click()
        } )
    })

    it( 'Test for update the application', () => {
        cy.wait(3000)
        cy.contains( 'App Settings').click({force:true});
        cy.wait(3000)
        cy.get( '#name').clear().type( 'e2e test automation update' );
        cy.contains( 'Save' ).click();
        cy.wait( 3000 )
        cy.contains( 'App Updated Successfully!' ).should( 'be.visible' );
    } );

    it( 'Test for delete the application', () => {
        cy.contains( 'Delete this App' ).click({force:true});
        cy.get( '#delete-app').type( 'e2e test automation update' );
        cy.contains( 'I understand the consequences, delete this app' ).click();
        cy.contains( 'App Deleted Successfully!' ).should( 'be.visible' );
    } );
} )
