module.exports = {
  someSidebar: [
    'getting-started/getting-started',
    {
      type: 'category',
      label: 'Applications',
      collapsed: false,
      items: [
        'apps/assets',
        {
          type: 'category',
          label: 'Hosted',
          items: [
            'apps/hosted/research-repository/research-repository-spa',
            'apps/hosted/mod-handovers/mod-handover-spa'
          ]
        },
        {
          type: 'category',
          label: 'Internal',
          items: [
            'apps/internal/feedback/feedback-spa',
            'apps/internal/home/home-spa',
            'apps/internal/lighthouse/lighthouse-spa',
            'apps/internal/notifications/notifications-spa',
            'apps/internal/user-groups/user-groups-spa',
            'apps/internal/ssi-service/ssi-service'
          ]
        },
      ]
    },
    {
      type: 'category',
      label: 'Microservices',
      collapsed: false,
      items: [
        'microservices/api-gateway/api-gateway',
        'microservices/authorization/authorization-service',
        'microservices/apps-service/apps-service',
        'microservices/feedback/feedback-service',
        'microservices/home/home-service',
        'microservices/lighthouse-service/lighthouse-service',
        {
          type: 'category',
          label: 'Notifications',
          items: [
            'microservices/notifications/notifications-service',
            'microservices/notifications/notifications-get-started',
          ]
        },
        'microservices/user-groups/user-groups-service',
        'microservices/search/search-service',
      ]
    },
    {
      type: 'category',
      label: 'Component Library',
      items: [
        'components/component-library',
        'documentation/styleguide',
      ],
    },
    'cli/op-cli',
    'faqs',
  ],
};
