/// <reference types="Cypress" />

import { lorem } from 'faker';

context( 'Test for UserGroup', () => {

    before( () => {
        cy.viewport(Cypress.env('width'), Cypress.env('height') );
        cy.visit( Cypress.env( 'QA_HOST' ) +'user-groups');
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
    } );

    it( 'Test for top header section', () => {
        cy.get( '.app' ).within( () => {
            cy.get( '.opc-header' ).within( () => {
                cy.get( '.opc-header__top-row--header-name' ).should( 'contain.text', 'User Group SPA' )
                })
            })
    } );

    it( 'Test for bottom header section', () => {
        cy.get( '.app' ).within( () => {
            cy.get( '.opc-header' ).within( () => {
                cy.get( '.opc-header__bottom-row' ).should( 'be.visible' );
            } );
        } )
    } )
    it( 'Get rover group name', () => {
        cy.get( 'tr:nth-child(1) td:nth-child(2)' ).invoke( 'text' ).as( 'search' );
        cy.get('tr:nth-child(1) td:nth-child(1)' ).invoke( 'text' ).as( 'searchname' );
    })

    it( 'Test for search user group by rover group', function()  {
        cy.get( '#searchText' ).type( this.search );
        cy.get( 'tbody' ).within( () => {
            cy.get( '[data-label^="LDAP"]' ).first().should( 'have.text', this.search );
        } )
        cy.get( '.pf-c-search-input__text-input' ).clear();
    } )

    it( 'Test for invalid search', () => {
        cy.get( '#searchText' ).type( 'dsadsadsadsadsas' )
        cy.contains( 'No Groups Found' ).should( 'be.visible' );
    } )
    it( 'Test Clear Search Visibility and Functionality', () => {
        cy.contains( 'Clear Search' ).should( 'be.visible' ).click( { force: true } );
        cy.get( '#searchText' ).should( 'have.text', '' );
    })
it( 'Test for search user group by name',function ()  {
        cy.get( '#searchText' ).type( this.searchname )
        cy.get( 'tbody' ).within( () => {
            cy.get( '[data-label^="Group Name"]' ).first().should( 'have.text',this.searchname)
        })
    } )
    it( 'Test for user group table record display count as per filter', () => {
            cy.get( '.pf-c-options-menu__toggle-button-icon' ).click( { force: true } )
        cy.get( "ul[role='menu'] li:nth-child(1)" ).click( { force: true } )
        cy.get( 'table tbody tr' ).should( 'have.length.lte', 10 );
           cy.get( '.pf-c-options-menu__toggle-button-icon' ).click( { force: true } )
        cy.get( "ul[role='menu'] li:nth-child(2)" ).click( { force: true } )
        cy.get( 'table tbody tr' ).should( 'have.length.lte', 20 );
           cy.get( '.pf-c-options-menu__toggle-button-icon' ).click( { force: true } )
        cy.get( "ul[role='menu'] li:nth-child(3)" ).click( { force: true } )
        cy.get( 'table tbody tr' ).should( 'have.length.lte', 50 );
           cy.get( '.pf-c-options-menu__toggle-button-icon' ).click( { force: true } )
        cy.get( "ul[role='menu'] li:nth-child(4)" ).click( { force: true } )
        cy.get( 'table tbody tr' ).should( 'have.length.lte', 100 );




    })

    it( 'Test for the headers of the table', () => {
        cy.get( 'tr' ).within( () => {
            cy.get( '[data-label="Group Name"]' ).should( 'be.visible' )
            cy.get( '[data-label="LDAP/Rover Common Name"]' ).should( 'be.visible' )
       })
    } )

    it( 'Test to check Create Group Button enablement', () => {
        cy.contains( 'Add New Group' ).click( { force: true } );
        cy.contains('Group Name').should('be.visible')
        cy.get( '[data-ouia-component-type="PF4/Button"]' ).should( 'be.disabled' )
        cy.get( '#groupName' ).type( 'test automation' )
        cy.contains( 'Select Rover Group' ).should( 'be.visible' );
        cy.get( '[aria-label="Search input"]' ).type( 'test' )
        cy.get( '[data-ouia-component-type="PF4/Button"]' ).should( 'not.be.disabled' )
    } )

    it( 'Test to check cancel button visibility', () => {
           cy.contains('Cancel').should('be.visible')
    } )

    it( 'Test to check cancel button redirection', () => {
        cy.contains( 'Cancel' ).click( { force: true } );
        cy.get( 'table' ).should( 'be.visible' );
    } )
    it( 'Creating new Group Test', () => {
        cy.contains('Add New Group').click()
        const words = lorem.words();
        cy.get( '#groupName' ).type( words, { force: true } );
        cy.get( '[aria-label="Search input"]' ).type( words, { force: true } );
         cy.get( '[aria-label="Search input"]' ).invoke('val').as('ldapname')
        cy.xpath( '//button[normalize-space()="Add Group"]' ).click( { force: true } );
    } )
    it( 'Check whether Group created message is visible', () => {
        cy.contains('Group created successfully!').should('be.visible')
    } )
    it( 'Test whether breadcrumb contains the ldap rover name', function() {
        cy.get( '.pf-c-breadcrumb__list' ).should( 'contain.text', this.ldapname );
         cy.get( '.pf-c-description-list__group' ).first().within( () => {
             cy.get( '.pf-c-description-list__term' ).should( 'have.text', 'LDAP/Rover Common Name' );
                cy.get( '.pf-c-description-list__description' ).should( 'have.text', this.ldapname);
            } );
    })
    it( 'Edit User Profile Group Test', () => {
        cy.xpath( '//a[normalize-space()="Edit Group"]' ).should( 'be.visible' ).click( { force: true } );
        cy.wait( 2000 );
        cy.contains( 'Update Group' ).click( { force: true } )
    } )

    it( 'Check whether Group Updated message is visible', () => {
        cy.contains('Group updated successfully!').should('be.visible')
    })
    it( 'Test for trying to add new group with existing name', () => {
        cy.xpath('//a[normalize-space()="User Groups"]').click({force:true})
       cy.contains( 'Add New Group' ).click( { force: true } );
        cy.get( '#groupName' ).type( 'test1' );
        cy.get( '[aria-label="Search input"]' ).type( 'one - portal - devel' );
        cy.xpath( '//button[normalize-space()="Add Group"]' ).click({force:true});
        cy.contains( 'Could not create the group').should('be.visible')
    } )
   //Test for my profile
    it( 'Test for my profile name', () => {
        cy.contains( 'My Profile' ).click();
        cy.get( '.pf-c-toolbar__item' ).should( 'have.text', 'one-portal-test sso-tester' );
    })

    it( 'Test for my profile title', () => {
            cy.get( '.pf-c-description-list__group' ).first().within( () => {
                cy.get( '.pf-c-description-list__term' ).should( 'have.text', 'Title' );
            } );
    } )

    it( 'Test for my profile Email', () => {
            cy.get( '.pf-c-description-list__group' ).eq( 1 ).within( () => {
                cy.get( '.pf-c-description-list__term' ).should( 'have.text', 'Email' );
                cy.get( '.pf-c-description-list__description' ).should( 'have.text', 'one-portal-test@redhat.com' );
            } );
    } )

        it( 'Test for my profile Kerberos ID', () => {
            cy.get( '.pf-c-description-list__group' ).eq( 2 ).within( () => {
                cy.get( '.pf-c-description-list__term' ).should( 'have.text', 'Kerberos ID' );
                cy.get( '.pf-c-description-list__description' ).should( 'have.text', 'one-portal-test' );
            } );
        } )

    it( 'Test for my profile Rover Group', () => {
        cy.get( '.pf-c-description-list__group' ).eq( 3 ).within( () => {
            cy.get( '.pf-c-description-list__term' ).should( 'have.text', 'Rover Groups' );

        } );
            cy.contains( 'uma_authorization' ).should( 'be.visible' );
    } )

    it( 'Test for my profile Authorization Section', () => {
        cy.get( '.pf-c-accordion' ).should( 'have.text', 'Authorization & API PermissionsUnder Development' );
    } )
    it( 'Test for Documentation link redirection', () => {
        cy.get( '.pf-c-button.pf-m-link' ).should( 'contain.text', 'Documentation' ).should( 'have.attr', 'href', '/get-started/docs/apps/internal/user-groups' ).click( { force: true } );
        cy.login( Cypress.env( 'USERNAME' ), Cypress.env( 'PASSWORD' ) );
        cy.contains('User Groups').should('be.visible')
    })
})
