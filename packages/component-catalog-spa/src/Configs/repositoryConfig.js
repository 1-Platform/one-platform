export const Repositories = [
  {
    owner: "1-platform",
    repo: "op-components",
    folderName: "packages",
  },
  {
    owner: "patternfly",
    repo: "patternfly-elements",
    folderName: "elements",
  },
];

export const RepoAPI = (repo) => {
  return `https://api.github.com/repos/${repo.owner}/${repo.repo}/contents/${repo.folderName}?ref=master`;
};
