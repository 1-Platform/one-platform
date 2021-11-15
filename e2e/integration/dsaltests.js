/// <reference types="Cypress" />


context( 'Test dsal', () => {

    before( () => {
        cy.visit( Cypress.env( 'STAGE_HOST' ) + 'dsal/'  );
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ).click();
    } )
    Cypress.on( 'uncaught:exception', ( err, runnable ) => {
        return false;
    } );
    it( 'FAQs Link and Documentation Link Test', () => {
        cy.contains( 'FAQs' ).click( { force: true } );
        cy.go( 'back' );
        cy.get( '#links' ).within( () => {
         cy.contains('Documentation').click({force:true})
        })
        cy.get('h1').should('contain.text','Getting Started Guide')
        cy.go( 'back' );
    })
    it( 'My Projects Section', () => {
        cy.contains( 'My Projects' ).click()
        cy.contains( 'Systems' ).click()
        cy.wait( 10000 )
        cy.get( ".toolbar" ).contains( "Template: Any" ).click( { force: true } );

        // Get the open dropdown menu items.
        cy.get( ".toolbar .dropdown-menu.show > a" ).then( ( elements ) => {
            // Get a random number using the max number of elements.
            const max = elements.length;
            const min = 1;
            const randomNumber = Math.floor( Math.random() * ( max - min )+min);

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap( elements[ randomNumber ] ).click({force:true});
        } );
        cy.get( 'op-dropdown:nth-child(2) > div:nth-child(1) > button:nth-child(1) > span:nth-child(2)' ).invoke( 'text' ).then( ( text ) => {
            text = text.split( ":" )[ 1 ].trim()
            if ( text != 'Any' ) {
                cy.get( 'span[class="template"]' ).each( ( elem, index ) => {
                    cy.wrap( elem ).should( 'contain.text', text );
                } );
            }
        } )

        cy.get( 'op-dropdown:nth-child(2) > div:nth-child(1) > button:nth-child(1) > span:nth-child(2)' ).click( { force: true } ).then( () => {
            cy.get( '.dropdown-menu.show' ).within( () => {
                cy.get( 'a' ).first().click();
            } );
        } )
        cy.contains( 'Next' ).parent( 'li' ).prev( 'li' ).children( 'a' ).invoke( 'text' ).then( ( text ) => {
            let text1 = parseInt( text.split( " " )[ 1 ].trim() );
            for ( let i = 1; i <= text1; i++ ) { cy.contains( 'Next' ).click( { force: true } ); }
        } );
        cy.contains( 'Previous' ).parent( 'li' ).next( 'li' ).next( 'li' ).children( 'a[tabindex="0"]' ).click( { force: true } )
        cy.get( ".toolbar" ).contains( "Location: Any" ).click( { force: true } );

        // Get the open dropdown menu items.
        cy.get( ".toolbar .dropdown-menu.show > a" ).then( ( elements ) => {
            // Get a random number using the max number of elements.
            const max = elements.length;
            const min = 1;
            const randomNumber = Math.floor( Math.random() * ( max - min )+min );

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap( elements[ randomNumber ] ).click( { force: true } );
        } );
        cy.get( 'op-dropdown:nth-child(3) > div:nth-child(1) > button:nth-child(1) > span:nth-child(2)' ).invoke( 'text' ).then( ( text ) => {
            text = text.split( ":" )[ 1 ].trim();
            if ( !(text.includes('Any')) ) {
                cy.get( 'span[class="lab"] strong' ).each( ( elem, index ) => {
                    cy.wrap( elem ).should( 'contain.text', text );
                } );
            }
        } );
        cy.get( 'op-dropdown:nth-child(3) > div:nth-child(1) > button:nth-child(1) > span:nth-child(2)' ).click( { force: true } ).then( () => {
            cy.get( '.dropdown-menu.show' ).within( () => {
                cy.get( 'a' ).first().click();
            } );
        } )
        cy.contains( 'Next' ).parent( 'li' ).prev( 'li' ).children( 'a' ).invoke( 'text' ).then( ( text ) => {
            let text1 = parseInt( text.split( " " )[ 1 ].trim() );
            for ( let i = 1; i <= text1; i++ ) { cy.contains( 'Next' ).click( { force: true } ); }
        } );
        cy.contains( 'Previous' ).parent( 'li' ).next( 'li' ).next( 'li' ).children( 'a[tabindex="0"]' ).click( { force: true } )

        cy.get( ".toolbar" ).contains( "Status: Any" ).click( { force: true } );

        // Get the open dropdown menu items.
        cy.get( ".toolbar .dropdown-menu.show > a" ).then( ( elements ) => {
            // Get a random number using the max number of elements.
            const max = elements.length;
            const min = 1;
            const randomNumber = Math.floor( Math.random() * ( max - min )+min );

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap( elements[ randomNumber ] ).click( { force: true } );
        } );
        cy.get( 'op-dropdown:nth-child(4) > div:nth-child(1) > button:nth-child(1) > span:nth-child(2)' ).invoke( 'text' ).then( ( text ) => {
            text = text.split( ":" )[ 1 ].trim();
            cy.log(text)
            if ( text === 'Under Mai...' ) {
                cy.get( 'op-dropdown:nth-child(4) > div:nth-child(1) > button:nth-child(1) > span:nth-child(2)' ).click( { force: true } ).then( () => {
                    cy.get( '.dropdown-menu.show' ).within( () => {
                        cy.get( 'a' ).first().click();
                    } );
                } );
            }
            else if ( !(text.includes('Under Mai...')) || !(text.includes('Any'))) {
                cy.get( 'h5[title="Status"]' ).each( ( elem, index ) => {
                    cy.wrap( elem ).should( 'contain.text', text );
                } );
            }
        } );
        cy.get( 'op-dropdown:nth-child(4) > div:nth-child(1) > button:nth-child(1) > span:nth-child(2)' ).click( { force: true } ).then( () => {
            cy.get( '.dropdown-menu.show' ).within( () => {
                cy.get( 'a' ).first().click();
            } );
        } )
        cy.contains( 'Next' ).parent( 'li' ).prev( 'li' ).children( 'a' ).invoke( 'text' ).then( ( text ) => {
            let text1 = parseInt( text.split( " " )[ 1 ].trim() );
            for ( let i = 1; i <= text1; i++ ) { cy.contains( 'Next' ).click( { force: true } ); }
        } );
        cy.contains( 'Previous' ).parent( 'li' ).next( 'li' ).next( 'li' ).children( 'a[tabindex="0"]' ).click( { force: true } )
        cy.get( ".toolbar" ).contains( "Sort by: Any" ).click( { force: true } );

        // Get the open dropdown menu items.
        cy.get( ".toolbar .dropdown-menu.show > a" ).then( ( elements ) => {
            // Get a random number using the max number of elements.
            const max = elements.length;
            const min = 1;
            const randomNumber = Math.floor( Math.random() * ( max - min )+min);

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap( elements[ randomNumber ] ).click( { force: true } );
        } );
        cy.contains( 'Next' ).parent( 'li' ).prev( 'li' ).children( 'a' ).invoke( 'text' ).then( ( text ) => {
            let text1 = parseInt( text.split( " " )[ 1 ].trim() );
            for ( let i = 1; i <= text1; i++ ) { cy.contains( 'Next' ).click( { force: true } ); }
        } );


        cy.get( 'input[placeholder="Search Systems"]', { timeout: 10000 } ).type( 'hv01' )
        cy.wait(5000)
        cy.get('li h5 a').should('include.text','hv01')
        cy.contains( 'Templates' ).click()
        cy.get( ".toolbar" ).contains( "Lab: Any" ).click( { force: true } );

        // Get the open dropdown menu items.
        cy.get( ".toolbar .dropdown-menu.show > a" ).then( ( elements ) => {
            // Get a random number using the max number of elements.
            const max = elements.length;
            const min = 1;
            const randomNumber = Math.floor( Math.random() * ( max - min ) );

            // Wrap the DOM element so we can execute new cypress commands.
            // Use the randomized number to select a DOM element, then click it.
            cy.wrap( elements[ randomNumber ] ).click( { force: true } );
        } );
        cy.get( '.btn.dropdown-toggle.no-outline.op-outline-black span').invoke( 'text' ).then( ( text ) => {
            text = text.split( ":" )[ 1 ].trim();
            if ( !( text.includes( 'Any' ) ) ) {
                cy.get( 'li div:nth-child(1) p:nth-child(3)' ).each( ( elem, index ) => {
                    cy.wrap( elem ).should( 'contain.text', text );
                } );
            }
        } );

        cy.get( '.btn.dropdown-toggle.no-outline.op-outline-black span' ).click( { force: true } ).then( () => {
            cy.get( '.dropdown-menu.show' ).within( () => {
                cy.get( 'a' ).first().click();
            } );

        } );
        cy.contains( 'Next' ).parent( 'li' ).prev( 'li' ).children( 'a' ).invoke( 'text' ).then( ( text ) => {
            let text1 = parseInt( text.split( " " )[ 1 ].trim() );
            for ( let i = 1; i <= text1; i++ ) { cy.contains( 'Next' ).click( { force: true } ); }
        } );
        cy.get( 'ul[class="dsal-tabs"] li:nth-child(1)' ).click( { force: true })
    })
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
        cy.get( '[for= "cpu"]' ).should( 'include.text', 'Applied: 0' );
        cy.get( '[for= "cpu"]' ).first().click( { force: true })
        cy.contains( '1 x Intel Xeon E5-2630 v4 @ 2.20GHz (10c/20t)' ).click( { force: true } );
        cy.get( '[for= "cpu"]' ).should( 'include.text', 'Applied: 1' );
        cy.get( '.applied-filters' ).should( 'include.text', '1 x Intel Xeon E5-2630 v4 @ 2.20GHz (10c/20t)' );

    } )

    it( 'Select RAM', () => {
        cy.get( '[for= "ram"]' ).first().should( 'include.text', 'Applied: 0' ).click( { force: true });
        cy.contains( '128 GB' ).click( { force: true });
        cy.get( '[for= "ram"]' ).should( 'include.text', 'Applied: 1' );
        cy.get( '.applied-filters' ).should( 'include.text', '128 GB' );

    } )
    it( 'Select Any Available System', () => {
        cy.contains( 'Any available Systems' ).click( { force: true } );
    } )
    it( 'Click Save and Continue', () => {
        cy.get( '.op-btn-primary' ).click( { force: true } );
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
        cy.wait( 250 );
        cy.get( 'aside[ id = "preview-modal" ] button.op-btn-primary').click({force: true})
        cy.contains( 'Project Requested Successfully' ).should( 'be.visible' );
        } );
    })
