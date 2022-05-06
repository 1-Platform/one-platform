/// <reference types="Cypress" />
import { microservicesDesc } from '../helper/apps.list';
import Footer from '../pageObject/Footer';
import Home from '../pageObject/HomePage';
context( 'Home Page Tests', () => {
    const footerPage = new Footer();
    const homePage = new Home();
    before( () => {

        cy.visit( Cypress.env( 'QA_HOST' ));
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
    } );
    beforeEach( () => {
        cy.viewport( Cypress.env( 'width' ), Cypress.env( 'height' ) );
    })
    it( 'Check whether the heading is visible', () => {
        cy.contains('We connect users to an experience').should('be.visible')
    } )
    it( 'Test for visibility of apps', () => {
        cy.get('.apps',{force:true}).should('be.visible')
    } )
    it( 'Check whether the count of apps displayed is 12', () => {
        homePage.getAppList().should( 'have.length', 12 );
    } )
    it( 'Check the redirection of apps', () => {
        homePage.getAllApps().within( () => {
            homePage.getAppNames().contains( 'User Group' ).should( 'be.visible' );
            cy.get( '.app:nth-child(1)' ).should( 'have.attr', 'href', '/user-groups' );
            homePage.getAppNames().contains( 'Home' ).should( 'be.visible' );
            cy.get( '.app:nth-child(2)' ).should( 'have.attr', 'href', '/' );
            homePage.getAppNames().contains( 'Documentation' ).should( 'be.visible' );
            cy.get( '.app:nth-child(3)' ).should( 'have.attr', 'href', '/get-started' );
            homePage.getAppNames().contains( 'Notifications' ).should( 'be.visible' );
            cy.get( '.app:nth-child(4)' ).should( 'have.attr', 'href', '/feedback' );

            homePage.getAppNames().contains( 'Feedback' ).should( 'be.visible' );
            cy.get( '.app:nth-child(5)' ).should( 'have.attr', 'href', '/notifications' );
            homePage.getAppNames().contains( 'Search' ).should( 'be.visible' );
            cy.get( '.app:nth-child(6)' ).should( 'have.attr', 'href', '/search' );

            homePage.getAppNames().contains( 'Component Catalog' ).should( 'be.visible' );
            cy.get( '.app:nth-child(7)' ).should( 'have.attr', 'href', '/components' );

            homePage.getAppNames().contains( 'Developer Console' ).should( 'be.visible' );
            cy.get( '.app:nth-child(8)' ).should( 'have.attr', 'href', '/console' );

            homePage.getAppNames().contains( 'Lighthouse' ).should( 'be.visible' );
            cy.get( '.app:nth-child(9)' ).should( 'have.attr', 'href', '/lighthouse' );
        } )
    })

    it( 'Test whether on clicking View More Opens the side bar', () => {
        cy.get( '.applications__view-more button' ).click( { force: true } );
        cy.get( '.opc-menu-drawer' ).should( 'be.visible' );
        cy.wait(4000)
        cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } );

    } )
    it( 'Test for visibility of Deploy deliver section', () => {
        cy.get( '.deliver.container', { force: true } ).should( 'be.visible' );

    } )
    it( 'Test whether the graphic beside deploy deliver section is loaded', () => {
        cy.get( '.deliver__illustration' ).should( 'be.visible' );
    } )
    it( 'Check whether view more analytics link is visible', () => {
        cy.contains( 'View more Analytics' ).should( 'be.visible' ).should( 'have.attr', 'href', '/console' );
    })
    it( 'Check whether the get started button in the Deploy Deliver section is redirecting to Dev Console', () => {
        homePage.getDeployDeliverContainer().within( () => {
            cy.contains( 'Get Started' ).should( 'be.visible' ).should( 'have.attr', 'href', '/console' );
        })
    })
    it( 'Check whether authentication heading is visible', () => {
        cy.contains( 'Authentication',{force:true} ).should( 'be.visible' );
    } )
    it( 'Check whether the authentication description is visible', () => {
        cy.contains( microservicesDesc[ 0 ] ).should( 'be.visible' );
    })
    it( 'Check hether the image beside Authentication header is visible', () => {
        homePage.getAuthenticationImage().should( 'be.visible' );
    } )
    it( 'Check Learn more link redirection in authentication section', () => {
        cy.xpath( '//body/section[@class="services"]/div[1]/div[2]/div[1]' ).within( () => {
            homePage.getLearnMoreLinks().should('have.attr','href','/get-started/docs/microservices/authorization/')
        })
    })
    it( 'Check whether Feedback heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title'][normalize-space()='Feedback']").should('be.visible')
    } )
    it( 'Check whether the image beside Feedback header is visible', () => {
        homePage.getFeedbackImage().should( 'be.visible' );
    } )
    it( 'Check whether the feedback description is visible', () => {
        cy.contains( microservicesDesc[ 1 ] ).should( 'be.visible' );
    } )

    it( 'Check Learn more link redirection in feedback section', () => {
        cy.xpath( '//body/section[@class="services"]/div[2]/div[2]/div[1]' ).within( () => {
            homePage.getLearnMoreLinks().should('have.attr','href','/get-started/docs/microservices/feedback-service/')
        })
    })
    it( 'Check whether Notification heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'Notification')]",{force:true}).should('be.visible')
    } )
    it( 'Check whether the image beside Notification header is visible', () => {
        homePage.getNotificationImage().should( 'be.visible' );
    } )
    it( 'Check whether the notification description is visible', () => {
        cy.contains( microservicesDesc[ 2 ] ).should( 'be.visible' );
    } )
    it( 'Check Learn more link redirection in notification section', () => {
        cy.xpath( '//body/section[@class="services"]/div[3]/div[2]/div[1]' ).within( () => {
            homePage.getLearnMoreLinks().should('have.attr','href','/get-started/docs/microservices/notifications-service/')
        })
    })
    it( 'Check whether User group heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'User Group')]",{force:true}).should('be.visible')
    } )
    it( 'Check whether the image beside User Group header is visible', () => {
        homePage.getUserGroupImage().should( 'be.visible' );
    } )
    it( 'Check whether the user group  description is visible', () => {
        cy.contains( microservicesDesc[ 3 ] ).should( 'be.visible' );
    })
    it( 'Check whether  User Group image is visible', () => {
        homePage.getUserGroupImage().should( 'be.visible' );
    } )
    it( 'Check whether the user group  description is visible', () => {
        cy.contains( microservicesDesc[ 3 ] ).should( 'be.visible' );
    } )
    it( 'Check Learn more link redirection in user group section', () => {
        cy.xpath( '//body/section[@class="services"]/div[4]/div[2]/div[1]' ).within( () => {
        homePage.getLearnMoreLinks().should('have.attr','href','/get-started/docs/microservices/user-groups-service/')
        })
    })
    it( 'Check whether Search heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'Search')]",{force:true}).should('be.visible')
    } )
    it( 'Check hether the image beside Search header is visible', () => {
        homePage.getSearchImage().should( 'be.visible' );
    } )
    it( 'Check whether the search description is visible', () => {
        cy.contains( microservicesDesc[ 4] ).should( 'be.visible' );
    } )

    it( 'Check Learn more link redirection in search section', () => {
        cy.xpath( '//body/section[@class="services"]/div[5]/div[2]/div[1]' ).within( () => {
        homePage.getLearnMoreLinks().should('have.attr','href','/get-started/docs/microservices/search-service/')
        })
    })
    it( 'Check the Header at the bottom is visible', () => {
        cy.get('.deploy__info-title').should('contain.text','Deploy your app on One Platform')
    } )

    it( 'Check the links in footer section', () => {
        footerPage.footerLinks().shadow().find( "a[name='One Platform on The Source']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="/contact-us"' ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='https://source.redhat.com/groups/public/one_platform/sample_channel']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='https://access.redhat.com/']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='https://connect.redhat.com/']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='https://catalog.redhat.com/']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="https://source.redhat.com/groups/public/pnt-devops/oneportal/one_portal_wiki/faqs_one_platform"]' ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="mailto:one-portal@redhat.com"]' ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="https://github.com/1-platform/one-platform"]' ).should( 'be.visible' );


    } )
    it( 'Check redirection from Get Started Button in bottom', () => {
        cy.xpath( '//a[@class="deploy__get-started"]' ).should( 'be.visible' ).invoke( 'removeAttr', 'target' ).click( { force: true } );
         cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
        cy.get('.pf-c-form').should('be.visible')
    })


    })
