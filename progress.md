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