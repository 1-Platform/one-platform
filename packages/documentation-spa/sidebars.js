module.exports = {
  someSidebar: {
    CLI: [ 'cli/op-cli' ],
    Components: [ 'components/component-library' ],
    Documentation: [ 'documentation/styleguide' ],
    Applications: [
      {Hosted : [ 'apps/hosted/analyst-papers/analyst-papers-spa' ]},
      {
        Internal: [
          'apps/internal/feedback/feedback-spa',
          'apps/internal/home/home-spa',
          'apps/internal/notifications/notifications-spa',
          'apps/internal/ssi-service/ssi-service'
        ]
      },
      'apps/assets',
    ],
    FAQs: ['faqs'],
  },
};
