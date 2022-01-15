# Progress Tracker

## Add `ESLINT` [15 Jan 2022]
- Added eslint `npm i -D eslint`.
- Run `npx eslint --init` and provide answers for asked questions.
- Used `standard` linting styles.
- Create two new scripts in `package.json`
  - First one will be used to detect the eslint issues.
  - Second will be used to fix possible linting issues.

```json
  "lint": "eslint .",
  "lint:fix": "eslint . --fix"
```
<hr />

## Add `JEST` unit testing framework [15 Jan 2022]
- Add `npm i -D jest babel-jest eslint-plugin-jest supertest`.
- `jest`: Jest is a JavaScript testing framework.
- `eslint-plugin-jest`: ESLint plugin for Jest DOM that helps users to follow best practices and anticipate common mistakes when writing tests.
- `supertest`: SuperTest is an HTTP assertions library that allows you to test your Node. js HTTP servers.
- Added below script to run the test cases.

```json
  "test": "jest"
```
<hr />

## Adding GitHub actions
- GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline.  
- You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.
- You can configure a GitHub Actions workflow to be triggered when an event occurs in your repository, such as a pull request being opened or an issue being created.
- Workflow contains one or more jobs which can run in sequential order or in parallel.
- For detailed document please check https://github.com/NandKumarGangai/github-actions-poc/blob/master/documentation.md.
