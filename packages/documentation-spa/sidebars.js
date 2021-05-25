module.exports = {
  someSidebar: {
    Applications: [
      'apps/assets',
      {
        Hosted: [
          'apps/hosted/research-repository/research-repository-spa',
          'apps/hosted/mod-handovers/mod-handover-spa'
        ]
      },
      {
        Internal: [
          'apps/internal/feedback/feedback-spa',
          'apps/internal/home/home-spa',
          'apps/internal/notifications/notifications-spa',
          'apps/internal/user-groups/user-groups-spa',
          'apps/internal/ssi-service/ssi-service'
        ]
      },
    ],
    CLI: [ 'cli/op-cli' ],
    Components: [ 'components/component-library' ],
    GettingStarted: [ 'getting-started/getting-started' ],
    Documentation: [ 'documentation/styleguide' ],
    Microservices: [
      'microservices/authorization/authorization-service',
      'microservices/feedback/feedback-service',
      'microservices/home/home-service',
      {
        Notifications: [
          'microservices/notifications/notifications-service',
          'microservices/notifications/notifications-get-started',
        ]
      },
      'microservices/user-groups/user-groups-service',
      'microservices/search/search-service',
    ],
    FAQs: [ 'faqs' ],
  },
};
