const feedbackConfigMock = {
  id: '6191eaac89973e0f703f232c',
  appId: '2',
  feedbackEmail: 'test@redhat.com',
  projectKey: 'TEST',
  sourceApiUrl: 'https://test.jira.com',
  sourceHeaders: {
    key: 'Content-Type',
    value: 'Application/json',
  },
  sourceType: 'JIRA',
};

const feedbackMock = {
  id: '5ffbdb0e3d4cc359de53e7c7',
  summary: 'Testing the Feedback in demo',
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  stackInfo: {
    stack: 'Mozilla',
    path: '/',
  },
  createdBy: '7ab20a62-0d75-11e7-ae22-28d244ea5a6d',
  category: 'FEEDBACK',
  experience: 'Good',
};

export default { feedbackMock, feedbackConfigMock };
