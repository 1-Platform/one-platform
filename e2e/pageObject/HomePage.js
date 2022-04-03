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
}
export default Home;
