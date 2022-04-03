/// <reference types="Cypress" />
import Footer from '../pageObject/Footer';
import Home from '../pageObject/HomePage';
context( 'Home Page Tests', () => {
    const footerPage = new Footer();
    const homePage = new Home();
    before( () => {
        cy.viewport( Cypress.env( 'width' ), Cypress.env( 'height' ) );
        cy.visit( Cypress.env( 'QA_HOST' ));
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
    } );
    it( 'Check whether the heading is visible', () => {
        cy.contains('We connect users to an experience').should('be.visible')
    } )
    it( 'Test for visibility of apps', () => {
        cy.get('.apps',{force:true}).should('be.visible')
    } )
    it( 'Test whether on clicking View More Opens the side bar', () => {
        cy.get( '.applications__view-more button' ).click( { force: true } );
        cy.get( '.opc-menu-drawer' ).should( 'be.visible' );
        cy.wait(4000)
        cy.get( ".opc-notification-drawer__header > button" ).click( { force: true } );

    })
    it( 'Test for visibility of Deploy deliver section', () => {
        cy.get( '.deliver.container', { force: true } ).should( 'be.visible' );

    } )
    it( 'Test whether the graphic beside deploy deliver section is loaded', () => {
        cy.get( '.deliver__illustration' ).should( 'be.visible' );
    })
    it( 'Check whether authentication heading is visible', () => {
        cy.contains( 'Authentication',{force:true} ).should( 'be.visible' );
    } )
    it( 'Check hether the image beside Authentication header is visible', () => {
        homePage.getAuthenticationImage().should( 'be.visible' );
    })
    it( 'Check whether Feedback heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title'][normalize-space()='Feedback']").should('be.visible')
    } )
    it( 'Check whether the image beside Feedback header is visible', () => {
        homePage.getFeedbackImage().should( 'be.visible' );
    })
    it( 'Check whether Notification heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'Notification')]",{force:true}).should('be.visible')
    } )
    it( 'Check whether the image beside Notification header is visible', () => {
        homePage.getNotificationImage().should( 'be.visible' );
    })
    it( 'Check whether User group heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'User Group')]",{force:true}).should('be.visible')
    } )
    it( 'Check whether the image beside User Group header is visible', () => {
        homePage.getUserGroupImage().should( 'be.visible' );
    })
    it( 'Check whether Search heading is visible', () => {
        cy.xpath("//h3[@class='services__service-title' and contains(text(),'Search')]",{force:true}).should('be.visible')
    } )
    it( 'Check hether the image beside Search header is visible', () => {
        homePage.getSearchImage().should( 'be.visible' );
    })
    it( 'Check the Header at the bottom is visible', () => {
        cy.get('.deploy__info-title').should('contain.text','Deploy your app on One Platform')
    } )
    it( 'Check the links in footer section', () => {
        footerPage.footerLinks().shadow().find( "a[name='One Platform on The Source']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="/contact-us"' ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='/get-started/blog/']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='https://access.redhat.com/']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='https://connect.redhat.com/']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( "a[href='https://catalog.redhat.com/']" ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="https://source.redhat.com/groups/public/pnt-devops/oneportal/one_portal_wiki/faqs_one_platform"]' ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="mailto:one-portal@redhat.com"]' ).should( 'be.visible' );
        footerPage.footerLinks().shadow().find( 'a[href="https://github.com/1-platform/one-platform"]' ).should( 'be.visible' );


        })


    })
