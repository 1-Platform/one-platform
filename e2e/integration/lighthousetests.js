/// <reference types="Cypress" />
import { gaugechart } from "../helper/apps.list";

context( 'Test lighthouse', () => {
    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'STAGE_HOST' ) +'lighthouse');
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
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
  it( 'Verify projects count', () => {
   cy.get( '.pf-c-page__main.pf-l-stack' ).scrollTo( 'bottom' );
    cy.get( '.pf-l-split__item.pf-u-font-size-sm.pf-m-fill.pf-u-pt-xs' ).then( ( elem ) => {
      const projectcount = (elem.text().trim().split(" "))[0]
      console.log(projectcount)
      cy.xpath( '(//app-property-card)' ).should( 'have.length', projectcount );

    }
    );
  })
 it( 'Search for individual Project',()=> {
    cy.get( '#project-search-form' ).type( 'one.redhat.com', { force: true } )
   cy.get( '.pf-c-page__main.pf-l-stack' ).scrollTo( 'bottom' );
    cy.xpath( '//h6[contains(text(),"One.redhat.com")]' ,{force:true}).should( 'be.visible' );

  } )
  it( 'Clear the search box', () => {
    cy.get( '#project-search-form' ).clear();
  } )
  it( 'Perform invalid search test', () => {
    cy.get( '#project-search-form' ).type( 'assadsadssadsadsa', { force: true } )
    cy.contains( 'No Project found' ).should( 'be.visible' );
  } )
    it( 'Clear the search box', () => {
    cy.get( '#project-search-form' ).clear();
  } )


  it( 'Test for Accessing Individual Project', () => {
    cy.get( 'app-property-card div div div' ).within( () => {
cy.xpath( '//h6[contains(text(),"One.redhat.com")]' ).click({force:true})
    })

  } )
  it( 'Check Last Report Generated text is visible', () => {
    cy.get( '.pf-l-flex__item.pf-u-font-size-sm.pf-u-color-300' ).should( 'contain.text','Last report generated' );
  } )
  it( 'Check branch names are visible', () => {
    cy.get( '.pf-c-context-selector__toggle.pf-m-text.pf-m-plain' ).should( 'be.visible' );
  } )
  it( 'Clicking on a branch name and check visibility of the options in dropdown', () => {
    cy.get( '.pf-c-context-selector__toggle.pf-m-text.pf-m-plain' ).click( { force: true } );
    cy.get( '.pf-c-context-selector__menu-list li' ).should( 'be.visible' ).should( 'have.length.gte', 1 );

  } )
  it( 'Perform valid branch search', () => {
    cy.get( '#context-input' ).should( 'be.visible' ).type( 'Search' );
    cy.get( "ul[class$='pf-c-context-selector__menu-list'] li" ).should( 'contain.text', 'Search' );
  } )
  it( 'Perform invalid branch search', () => {
    cy.get( '#context-input' ).clear().type( 'dsdaasddsadsasad' );
    cy.get( "ul[class$='pf-c-context-selector__menu-list'] li" ).should( 'contain.text', 'No data to show' );
  })
  it( 'Sort Test based on Accessibility inside Project', () => {
        cy.contains( 'Accessibility' ).click( { force: true } )
        cy.get('tr td:nth-child(3)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const access = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( access ).to.be.sorted( { descending: true })
        } )
      cy.wait(2000)
    } )
    it( 'Sort Test based on Best Practices inside Project', () => {
      cy.contains( 'Best Practices' ).click( { force: true } )
        cy.wait(2000)
        cy.get('tr td:nth-child(4)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const bestpractice = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( bestpractice ).to.be.sorted( { descending: true })
        } )
    } )
    it( 'Sort Test based on Performance inside Project ', () => {
      cy.get('button').contains( 'Performance' ).click( { force: true } )
        cy.wait(2000)
        cy.get('tr td:nth-child(5)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const perf = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( perf ).to.be.sorted( { descending: true })
        } )
              cy.wait(2000)
    } )
     it( 'Sort Test based on PWA inside Project ', () => {
       cy.get('button').contains( 'PWA' ).click( { force: true } )
         cy.wait(2000)
        cy.get('tr td:nth-child(6)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted( { descending: true })
        } )
             cy.wait(2000)
     } )
      it( 'Sort Test based on SEO inside Project', () => {
        cy.get('button').contains( 'SEO' ).click( { force: true } )
          cy.wait(2000)
        cy.get('tr td:nth-child(7)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const seo = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( seo ).to.be.sorted( { descending: true })
        } )
              cy.wait(2000)
      } )
  it( 'Sort Test based on Total inside Project ', () => {
    cy.reload();
      cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
        cy.get('tr td:nth-child(8)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const total = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( total ).to.be.sorted( {descending:true})
        } )
            cy.wait(2000)
     } )

    it( 'Individual Performance metrics visibility test', () => {
gaugechart.forEach( function ( item ) {
            cy.get( '.gauge-chart' ).should( 'be.visible' ).each( () => {
                cy.contains( `${ item }` ).should( 'be.visible' );
            })
        } );
  } )
  it( 'Check lighthouse linechart visibility test', () => {
    cy.get('.pf-c-card__body.line-chart-container').should('be.visible')
  } )
  it( 'Going to Home', () => {
    cy.get('.pf-c-breadcrumb__link[routerlink="/"]').contains('Home' ).should('be.visible').click({force:true});
  } )
     it( 'verify documentation link', () => {
        cy.get( 'a[ href = "/get-started/docs/apps/internal/lighthouse" ]' ).should( 'have.text', 'Documentation' );
    } )

    it( 'verify Lighthouse CI link', () => {
        cy.get( 'a' ).should( 'contain.text', 'Lighthouse CI' );
    } )
  it( 'Verify blog link redirect', () => {
    cy.get( '.pf-l-stack.pf-m-gutter' ).within( () => {
      cy.contains( 'Blog' ).should( 'have.attr', 'href', '/get-started/blog' ).should( 'be.visible' );
    })

  } )
  it( 'Verify contact us link redirection', () => {
    cy.get( '.pf-l-stack.pf-m-gutter' ).within( () => {
      cy.contains( 'Contact us' ).should( 'have.attr', 'href', '/contact-us' );
    } );
  })
  it( 'Verify Docs link redirection', () => {
    cy.contains( 'Docs' ).should( 'have.attr', 'href', '/get-started/docs' );
  })
    it( 'Generate report for Performance Type', () => {
        cy.get( '#sites' ).should( 'be.visible' ).type( 'https://www.google.com/' )
        cy.contains( ' Generate Report ' ).click()
        cy.contains( 'Audit started successfully').should( 'be.visible' )
        cy.get( '#codeBlock' ).should( 'be.visible' )
        cy.contains( 'Audit completed').should( 'be.visible' );
        gaugechart.forEach( function ( item ) {
            cy.get( '.gauge-chart' ).should( 'be.visible' ).each( () => {
                cy.contains( `${ item }` ).should( 'be.visible' );
            })
        } );
       cy.get('.lh-score-card__range').its('length').should('eq', 3)
    } );
  it( 'Generate report for Desktop type Selected', () => {
    cy.get( '.pf-c-nav__list' ).within( () => {
      cy.contains( 'Home' ).should( 'be.visible' ).click( { force: true } );
        })
      cy.get( "div[class='pf-l-stack__item pf-u-w-100'] div:nth-child(3) input:nth-child(1)" ).should( 'be.visible' ).click( { force: true } );
      cy.get( '#sites' ).should( 'be.visible' ).clear().type( 'https://www.google.com/' )
      cy.contains( ' Generate Report ' ).click()
      cy.contains( 'Audit started successfully').should( 'be.visible' )
      cy.get( '#codeBlock' ).should( 'be.visible' )
      cy.contains( 'Audit completed').should( 'be.visible' );
        gaugechart.forEach( function ( item ) {
            cy.get( '.gauge-chart' ).should( 'be.visible' ).each( () => {
                cy.contains( `${ item }` ).should( 'be.visible' );
            })
        } );
       cy.get('.lh-score-card__range').its('length').should('eq', 3)
  } )
  it( 'Generate report for Experimental type Selected', () => {
    cy.get( '.pf-c-nav__list' ).within( () => {
      cy.contains( 'Home' ).should( 'be.visible' ).click( { force: true } );
        })
        cy.get( "div:nth-child(4) input:nth-child(1)" ).should( 'be.visible' ).click( { force: true } );
        cy.get( '#sites' ).should( 'be.visible' ).clear().type( 'https://www.google.com/' )
        cy.contains( ' Generate Report ' ).click()
        cy.contains( 'Audit started successfully').should( 'be.visible' )
        cy.get( '#codeBlock' ).should( 'be.visible' )
        cy.contains( 'Audit completed').should( 'be.visible' );
        gaugechart.forEach( function ( item ) {
            cy.get( '.gauge-chart' ).should( 'be.visible' ).each( () => {
                cy.contains( `${ item }` ).should( 'be.visible' );
            })
        } );
       cy.get('.lh-score-card__range').its('length').should('eq', 3)
  })


    it( 'Check Leaderboard link', () => {
        cy.contains( 'Leaderboard').should( 'be.visible' ).click( { force: true } );


    } )
  it( 'Search Test for Project in Leaderboard', () => {
    cy.xpath( "//input[@placeholder='Find by project name']" ).type( 'Rhc-certification-workflow', { force: true } );
    cy.get( 'tr td:nth-child(2)' ).should( 'contain.text', 'Rhc-certification-workflow' ).click( { force: true } );
      cy.get( "input[type^='text']" ).clear()
      cy.wait(3000)
  } )
  it( 'Perform invalid Project search in Leaderboard', () => {
    cy.xpath( "//input[@placeholder='Find by project name']" ).type( 'adsassadsad', { force: true } );
    cy.contains( 'No data to show' ).should( 'be.visible' );
    cy.xpath( "//input[@placeholder='Find by project name']" ).clear();
  })

    it( 'Sort Test based on Accessibility ', () => {
        cy.contains( 'Accessibility' ).click( { force: true } )
        cy.get('tr td:nth-child(3)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const access = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( access ).to.be.sorted( { descending: true })
        } )
      cy.wait(2000)
      cy.contains( 'Accessibility' ).click( { force: true } )
        cy.get('tr td:nth-child(3)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const access = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( access ).to.be.sorted( )
        } )
            cy.wait(2000)
    } )
    it( 'Sort Test based on Best Practices ', () => {
        cy.contains( 'Best Practices' ).click( { force: true } )
        cy.get('tr td:nth-child(4)').then(($cells)=> {
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
        cy.get('tr td:nth-child(4)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const bestpractice = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
                 // and use an assertion from chai-sorted to confirm
            expect( bestpractice ).to.be.sorted( )
        } )
            cy.wait(2000)
    } )
    it( 'Sort Test based on Performance ', () => {
      cy.contains( 'Performance' ).click( { force: true } )
       cy.wait(2000)
        cy.get('tr td:nth-child(5)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const perf = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( perf ).to.be.sorted( { descending: true })
        } )
            cy.wait(2000)
        cy.contains( 'Performance' ).click( { force: true } )
        cy.get('tr td:nth-child(5)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const perf = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( perf).to.be.sorted( )
        } )
            cy.wait(2000)
    } )
     it( 'Sort Test based on PWA ', () => {
       cy.contains( 'PWA' ).click( { force: true } )
        cy.wait(2000)
        cy.get('tr td:nth-child(6)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted( { descending: true })
        } )
             cy.wait(2000)
       cy.contains( 'PWA' ).click( { force: true } )
        cy.wait(2000)
        cy.get('tr td:nth-child(6)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted( )
        } )
             cy.wait(2000)
     } )
      it( 'Sort Test based on SEO ', () => {
        cy.contains( 'SEO' ).click( { force: true } )
         cy.wait(2000)
        cy.get('tr td:nth-child(7)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const seo = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim()
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( seo ).to.be.sorted( { descending: true })
        } )
              cy.wait(2000)
        cy.contains( 'SEO' ).click( { force: true } )
        cy.get('tr td:nth-child(7)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const seo = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim()
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( seo ).to.be.sorted( )
        } )
              cy.wait(2000)
      } )
    it( 'Sort Test based on Total ', () => {
        cy.contains( 'Total' ).click( { force: true } )
      cy.wait(4000)
      cy.get( 'tr td:nth-child(8)' ).then( ( $cells ) => {
            // again, convert the date strings into timestamps
            const total = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim()
            )
              .map((str) => parseInt(str))
               // and use an assertion from chai-sorted to confirm
            expect( total ).to.be.sorted( {descending:true})
        } )
              cy.wait(2000)
        cy.contains( 'Total' ).click( { force: true } )
        cy.wait(3000)
        cy.get('tr td:nth-child(8)').then(($cells)=> {
            // again, convert the date strings into timestamps
            const pwa = Cypress._.map(
                $cells,
              ($cell) => $cell.innerText.trim(),
            )
              .map((str) => parseInt(str))
            // and use an assertion from chai-sorted to confirm
            expect( pwa ).to.be.sorted()
        } )
            cy.wait(2000)
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
