// the feedback mock data to test its page.
const date: Date = new Date();
export const FeedbackMock = {
  type: 'Team',
  typeName: 'Test Team',
  typeID: 'mockobjectid',
  notify: false,
  summary: 'Some Test Summary',
  experience: 'Great',
  isActive: true,
  averageWeight: 5,
  timestamp: {
    createdAt: date,
    createdBy: {
      kerberosID: 'dpandey',
      name: 'Diwanshi Pandey',
      email: 'dpandey@redhat.com'
    }
  }
};

export const FeedbackMockResponse = [ {
  description: 'Hello, I believe a reduction to ~30% of space would be more efficient.↵↵ friendly regards,↵Theo',
  experience: 'Need Improvement',
  feedbackType: 'Feedback',
  iid: '2967',
  module: null,
  portalFeedback: true,
  timestamp: {createdAt: '2019-05-30T11:22:48.706Z', createdBy: {email: 'anjsharm@redhat.com',
  kerberosID: 'anjsharm', name: 'Anjnee Sharma'}, modifiedAt: '2019-05-30T11:22:48.706Z' },
  title: 'Just created for testing purpose', _id: '5cefbd0d43e943bcc5060901'
  }
];
