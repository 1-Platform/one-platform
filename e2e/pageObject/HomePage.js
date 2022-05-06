class Home{
    getAuthenticationImage () {
        return cy.get( 'img[src="/static/img/auth.svg"]' );
    }
    getNotificationImage () {
        return cy.get( 'img[src="/static/img/notification.svg"]' )
    }

    getFeedbackImage () {
        return cy.get( 'img[src="/static/img/feedback.svg"]' )
    }
    getSearchImage () {
        return cy.get( 'img[src="/static/img/feedback.svg"]' )
    }
    getUserGroupImage () {
        return cy.get( 'img[src="/static/img/user_group.svg"]' )
    }
    getAllApps () {
        return cy.get('.apps')
    }
    getAppList () {
        return cy.get( '.app');
    }
    getAppNames () {
        return cy.get('.app__label')
    }
    getLearnMoreLinks () {
        return cy.contains('Learn more')
    }
    getDeployDeliverContainer () {
        return cy.get('.deliver__analytics')
    }
}
export default Home;
