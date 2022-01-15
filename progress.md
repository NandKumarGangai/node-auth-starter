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