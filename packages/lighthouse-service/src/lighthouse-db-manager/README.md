# Lighthouse DB Manager

Lighthouse DB Manager is a JS module that is used to communicate with the Lighthouse CI server database to reduce latency. This is decoupled into a seperate module to avoid any corruption to the CI database. Only **read** operations are allowed.

This module was introduced as API produced high latency given our usecases

## The API methods provided

1. `getAllProjects`: To fetch project list with pagination and search enabled
2. `getAllBranches`: To fetch branches of a project with pagination and search enabled
3. `getAllBuilds`: To fetch build list of a project's branch
4. `getLHScores`: To fetch scores of a build or multiple builds
5. `getLeaderBoard`: To fetch leaderboard list of a particular category like SEO, PWA etc

## Sidenote

1. Lighthouse DB mainly contains 4 database model
    - Project: Information of a project
    - Build: Information of a build that happened to project's branch
    - Statistic - Information of various stats of a build
    - Run - Contains the entire LH report in JSON format

2. Lighthouse doesn't use foreign key relations, instead it uses reference key. Reference key as the name suggest doesn't contain any constraints but rather hold just a reference to the table row. Reference key don't work like foreign key meaning JOIN, subquery operations etc are not available. Therefore leaderboard takes 4 DB calls to fetch all required details
