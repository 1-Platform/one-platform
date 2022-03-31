/// <reference types="Cypress" />
context( 'Test feedback form', () => {

    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'QA_HOST' ) +'feedback');
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
    } );

    it( 'Report bug', () => {
        cy.get( '#feedback-popup'  ).click().wait( 1000 );
        cy.get( `[data-feedback-type="bug"]`).click();
        cy.contains( 'Other' ).click( { force: true } );
        cy.get( '#bugsummary' ).should( 'not.be.disabled' );
        cy.get( '#bugsummary' ).type( 'e2e test automation',{force:true} );
        cy.contains( 'Submit').click({force:true});
        cy.contains( "Thanks for your feedback. Your experience is important to us!" ).should( 'be.visible' );
    } );

    it( 'Share feedback', () => {
        cy.get( '#feedback-popup' ).click({force:true}).wait( 1000 );
        cy.get( `[data-feedback-type="feedback"]` ).click();
        cy.contains( 'Excellent' ).click( { force: true } );
        cy.get( '#feedbacksummary' ).type( 'e2e test automation' ,{force:true});
        cy.contains( 'Submit').click( { force: true } )
        cy.contains( "Thanks for your feedback. Your experience is important to us!" ).should( 'be.visible' );
    } );

    it( 'Verify documentation link', () => {
        cy.get( '#feedback-popup').click().wait( 1000 );
        cy.get( 'a[href = "/get-started"]').should( 'contain.text', 'Documentation' );
    } );

    it( 'Test if feedback and bug counts are visible in view existing feedback section', () => {
        cy.visit( Cypress.env( 'QA_HOST' ) + 'feedback' );
        cy.login(Cypress.env('USERNAME'),Cypress.env('PASSWORD'));
        cy.get('h1').should('have.text','Feedback')
    } );

    it( 'Test if list of feedback is visible', () => {

        cy.get( '.pf-l-grid__item.pf-m-9-col .pf-l-stack.pf-m-gutter .pf-l-stack').should( 'have.length', 20 )
    } );
    it( 'Test for no of records being displayed', () => {
        cy.get( '.pf-c-options-menu__toggle-button-icon' ).click( { force: true } )
        cy.get( "ul[role='menu'] li:nth-child(1)" ).click( { force: true } )
        cy.get( '.pf-l-grid__item.pf-m-9-col .pf-l-stack.pf-m-gutter .pf-l-stack' ).should( 'have.length', 10 )
        cy.get( '.pf-c-options-menu__toggle-button-icon' ).click( { force: true } )
        cy.get( "ul[role='menu'] li:nth-child(3)" ).click( { force: true } )
        cy.get( '.pf-l-grid__item.pf-m-9-col .pf-l-stack.pf-m-gutter .pf-l-stack' ).should( 'have.length', 50 )
        cy.get( '.pf-c-options-menu__toggle-button-icon' ).click( { force: true } )
        cy.get( "ul[role='menu'] li:nth-child(4)" ).click( { force: true } )
          cy.get( '.pf-l-grid__item.pf-m-9-col .pf-l-stack.pf-m-gutter .pf-l-stack').should( 'have.length', 100 )
    })

    it( 'Test for expansion of feedback from feedback list', () => {
        cy.get( '.pf-c-button.pf-m-link.pf-m-inline' ).then( ( elements ) => {
             const max = elements.length;
            const min = 1;
            const randomNumber = Math.floor(Math.random() * (max - min) + min);

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap(elements[randomNumber]).click({ force: true });
        })
    } );
    it( 'Test for modal opening ', () => {
        cy.get( '.pf-c-modal-box__header' ).within( () => {
            cy.contains( 'ONEPLAT-' ).should( 'be.visible' );
        } );
    } )
    it( 'Test for JIRA button visibility', () => {
        cy.contains( 'See JIRA Issue' ).should( 'be.visible' );
    } )
    it( 'Test for Close Button', () => {
        cy.get( '.pf-c-modal-box__footer' ).within( () => {
            cy.contains( 'Close' ).click( { force: true } );
        })
    } )
    it( 'Test for search feedback from feedback list', () => {
        cy.get( '.pf-c-search-input__text-input' ).type( 'test' );
        cy.get( '.pf-l-grid__item.pf-m-9-col .pf-l-stack.pf-m-gutter .pf-l-stack').should( 'be.visible' ).each( () => {
            cy.get( '.pf-l-stack__item:nth-child(2)' ).should( 'include.text', 'test' );
        } );
        cy.get( '.pf-c-search-input__text-input' ).clear();
    } );
    it( 'Test for clicking User Groups', () => {
        cy.get( '.pf-c-check__input' ).then( ( elements ) => {
            const max = elements.length;
            const min = 1;
            const randomNumber = Math.floor(Math.random() * (max - min) + min);

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap(elements[randomNumber]).click({ force: true });
        })
    } )
    it( 'Test for click on clear in User Groups', () => {
         cy.get( '.pf-l-stack.pf-m-gutter' ).within( () => {
            cy.xpath('//button[text()="clear"]').click({force:true})
        })

    })
    it( 'Test for Selecting Bug Type and verifying the results are of Bug only', () => {
        cy.get( '#feedback-type-1' ).click( { force: true } )
        cy.get( '.pf-l-grid.pf-m-gutter' ).within( ( elem ) =>{
            cy.get( 'img' ).should('have.attr','src','/feedback/assets/bug.18e51875.svg')
        })
    } )

    it( 'Test for Selecting Feedback Type and verifying the results are of Feedback only', () => {
        cy.get( '#feedback-type-2' ).click( { force: true } )
        cy.get( '.pf-l-grid.pf-m-gutter' ).within( (  ) =>{
            cy.get( 'img' ).should('have.attr','src','/feedback/assets/feedback.8b7099a9.svg')
        })
    } )
    it( 'Test for click on clear in type section', () => {
        cy.get( '.pf-l-stack.pf-m-gutter' ).within( () => {
            cy.xpath( '//button[text()="clear"]' ).click( { force: true } );
        } );
    })

    it( 'Test for selecting Open Status and Checking whether To Do is visible on the feedback', () => {
        cy.get( '#feedback-status-1' ).click( { force: true } );
        cy.get( '.pf-l-grid.pf-m-gutter' ).within( () => {
            cy.contains( 'To Do' ).should( 'be.visible' );
        } );
    })
  it( 'Test for checking Closed Status', () => {
            cy.get( '#feedback-status-2' ).should( 'be.visible' ).click( { force: true } )
            cy.contains('No feedback found').should('be.visible')
  } )
     it( 'Test for click on clear in Status section', () => {
         cy.get( '.pf-l-stack.pf-m-gutter' ).within( () => {
            cy.xpath('//button[text()="clear"]').click({force:true})
        })

    })
    it( 'Test for click on expand to see more apps', () => {
        cy.contains('Expand to see more apps').click({force:true})
    } )
    it( 'Test to see whether  modal opens on clicking more apps', () => {
        cy.get( '#pf-modal-part-1' ).should( 'be.visible' )

        cy.get( '#pf-modal-part-1' ).within( () => {
            cy.xpath( '//button[@aria-label="Close"]' ).click( { force: true } )

        } )
        cy.wait(4000)
    } )
    it( 'Test whether My Feedback Option is Visible and clickable', () => {
        cy.contains('My Feedback').should('be.visible').click({force:true})
    } )
    it( 'Test whether All Feedback Option is Visible and clickable', () => {
        cy.wait( 3000 )
        cy.xpath('//button[contains(text(),"All Feedback")]').should('be.visible').click({force:true})
    } )
    it( 'Test whether Export functionality works', () => {
        cy.contains( 'Export' ).click( { force: true } )
        cy.contains('Export sucessfully completed').should('be.visible')
    } )
    it( 'Select Home option and verify home is present in the table', () => {
        cy.xpath( '//label[contains(text(),"Home")]/preceding-sibling::input' ).click( { force: true } ).then( () => {
            cy.get( '.pf-l-grid__item.pf-m-9-col  >.pf-l-stack.pf-m-gutter .pf-l-stack__item .pf-l-split__item:nth-child(3) > span').each( ( elem, index ) => {
                cy.wrap( elem ).should( 'contain.text', 'Home' );
            } );

        } );
    })

    })
