export const Repositories = [
  {
    owner: '1-platform',
    repo: 'op-components',
    folderName: 'packages',
    branch: 'master',
  },
  {
    owner: 'patternfly',
    repo: 'patternfly-elements',
    folderName: 'elements',
    branch: 'master',
  },
  {
    owner: 'chapeaux',
    repo: 'cpx-components',
    folderName: 'components',
    branch: 'main',
  }
];

export const RepoAPI = (repo) => {
  return `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/${repo.folderName}?ref=${repo.branch}`;
};
