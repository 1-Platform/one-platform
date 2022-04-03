class Sidebar{


    getApplicationSearchResults () {
        return cy.get('.opc-menu-drawer-link-group:nth-child(2)')
    }

    getBuiltInServiceSearchResults () {
        return cy.get('.opc-menu-drawer-link-group:nth-child(3)')
    }
    getAllApplicationSearchResults () {
         return cy.get('.opc-menu-drawer-link-group:nth-child(2) a ')

    }
     getAllBuiltInServiceSearchResults () {
         return cy.get('.opc-menu-drawer-link-group:nth-child(3) a ')

    }
}
export default Sidebar;
