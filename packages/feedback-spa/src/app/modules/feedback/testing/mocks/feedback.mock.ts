// the feedback mock data to test its page.
let date: Date = new Date();  
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
