/// <reference types="Cypress" />
import { gaugechart } from "../helper/apps.list";

context( 'Test lighthouse', () => {
    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'STAGE_HOST' ) + 'lighthouse' ,{timeout:10000});
        cy.get( '#username', { timeout: 5000 } ).type( Cypress.env( 'USERNAME' ) );
        cy.get( '#password' ,{timeout:10000}).type( Cypress.env( 'PASSWORD' ) );
        cy.get( '#submit' ,{timeout:10000}).click();
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
        cy.contains( 'Audit completed', { timeout: 100000 } ).should( 'be.visible' );
        gaugechart.forEach( function ( item ) {
            cy.get( '.gauge-chart', { timeout: 60000 } ).should( 'be.visible' ).each( () => {
                cy.contains( `${ item }` ).should( 'be.visible' );
            })
        } );
       cy.get('.lh-score-card__range').its('length').should('eq', 3)
    } );

    it( 'verify documentation link', () => {
        cy.get( 'a[ href = "/get-started/docs/apps/internal/lighthouse" ]' ).should( 'have.text', 'Documentation' );
    } )
    it( 'Check Leaderboard link', () => {
        cy.contains( 'Leaderboard' ,{timeout:10000}).should( 'be.visible' ).click( { force: true } );


    } )
    it( 'Search Test for Project', () => {
        cy.xpath( "//input[@placeholder='Find by project name']" ).type( 'Rhc-certification-workflow',{force:true} );
        cy.get('tr td:nth-child(2)').should('contain.text','Rhc-certification-workflow')
        cy.xpath( "//input[@placeholder='Find by project name']" ).clear()
    } )

    it( 'Sort Test based on Accessibility ', () => {
        cy.wait(6000)
        cy.contains( 'Accessibility' ).click( { force: true } )
        cy.get('tr td:nth-child(3)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const access = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( access ).to.be.sorted( { descending: true })
        } )
        cy.wait(5000)
        cy.contains( 'Accessibility' ).click( { force: true } )
        cy.wait(3000)
        cy.get('tr td:nth-child(3)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const access = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( access ).to.be.sorted( )
        })
    } )
    it( 'Sort Test based on Best Practices ', () => {
        cy.wait(6000)
        cy.contains( 'Best Practices' ).click( { force: true } )
        cy.get('tr td:nth-child(4)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const bestpractice = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( bestpractice ).to.be.sorted( { descending: true })
        } )
        cy.wait(5000)
        cy.contains( 'Best Practices' ).click( { force: true } )
        cy.wait(3000)
        cy.get('tr td:nth-child(4)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const bestpractice = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
                 // and use an assertion from chai-sorted to confirm
            expect( bestpractice ).to.be.sorted( )
        })
    } )
    it( 'Sort Test based on Performance ', () => {
        cy.wait(6000)
        cy.contains( 'Performance' ).click( { force: true } )
        cy.get('tr td:nth-child(5)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const perf = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( perf ).to.be.sorted( { descending: true })
        } )
        cy.wait(5000)
        cy.contains( 'Performance' ).click( { force: true } )
        cy.wait(3000)
        cy.get('tr td:nth-child(5)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const perf = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( perf).to.be.sorted( )
        })
    } )
     it( 'Sort Test based on PWA ', () => {
        cy.wait(6000)
        cy.contains( 'PWA' ).click( { force: true } )
        cy.get('tr td:nth-child(6)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted( { descending: true })
        } )
        cy.wait(5000)
        cy.contains( 'PWA' ).click( { force: true } )
        cy.wait(3000)
        cy.get('tr td:nth-child(6)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted( )
        })
     } )
      it( 'Sort Test based on SEO ', () => {
        cy.wait(6000)
        cy.contains( 'SEO' ).click( { force: true } )
        cy.get('tr td:nth-child(7)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted( { descending: true })
        } )
        cy.wait(5000)
        cy.contains( 'SEO' ).click( { force: true } )
        cy.wait(3000)
        cy.get('tr td:nth-child(7)',{timeout:60000}).then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted( )
        })
     } )
    it( 'Verify count of rows being printed', () => {
        cy.wait(4000)
        cy.get( "button[aria-label^='Items']" ).click( { force: true } );
        cy.wait(4000)
        cy.contains( "5 per page" ).click( { force: true } )
        cy.get('tr').should('have.length',6)
    } )
      function checkpagination() {
            cy.get( 'body' ).then( $mainContainer => {
                const isVisible = $mainContainer.find( "button[aria-label='Go to next page']" ).is( ':enabled' );
                if ( isVisible ) {
                    cy.get( "button[aria-label='Go to next page']" ).click();
                    checkpagination();
                }
            } );
        }
    it( 'Test for Pagination', () => {
        checkpagination();
     })

    })
