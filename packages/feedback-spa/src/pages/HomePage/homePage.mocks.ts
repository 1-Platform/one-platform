import { FeedbackCategoryAPI } from 'types';

export const mockApps = [
  {
    id: '1',
    name: 'hello',
  },
  {
    id: '2',
    name: 'world',
  },
];

export const mockFeedbacks = [
  {
    id: '61f657a002a477692',
    module: 'hello',
    summary: 'lorem ipsum',
    description: 'lorem ipsum',
    experience: 'lorem',
    error: '',
    category: FeedbackCategoryAPI.BUG,
    createdOn: '2022-01-27T07:55:55.555Z',
    createdBy: {
      cn: 'lore',
      mail: 'lorem@ipsum.com',
    },
    state: 'To Do',
    stackInfo: {
      stack: 'lorem',
      path: '/hello-world',
    },
    assignee: {
      name: 'lorem',
    },
    source: 'JIRA',
    ticketUrl: 'https://google.com',
  },
  {
    id: '61f6002a477692',
    module: 'world',
    summary: 'lorem ipsum',
    description: 'lorem ipsum',
    experience: 'lorem',
    error: null,
    category: FeedbackCategoryAPI.FEEDBACK,
    createdOn: '2022-01-27T07:55:55.555Z',
    createdBy: {
      cn: 'lore',
      mail: 'lorem@ipsum.com',
    },
    state: 'To Do',
    stackInfo: {
      stack: 'lorem',
      path: '/hello-world',
    },
    assignee: {
      name: 'lorem',
    },
    source: 'JIRA',
    ticketUrl: 'https://google.com',
  },
];

export const mockFilteredApps = Object.fromEntries(mockApps.map((app) => [app.id, app]));
