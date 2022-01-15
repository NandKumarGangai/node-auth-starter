/**
 * This command line utility will help generate unit test case files in existing project.
 * Just run this file via package.json
 * Add a new script in scripts
 * "test:gen": "node gentests.js <folder name>"
 *
 * In folder name you can pass directory name in which you want to generate the empty test files.
 */

const fs = require('fs');
const path = require('path');

const dir = process.argv[2];

const template = `
describe('Test suite', () => {
    it('Test case for', () => {
        expect(true).toBe(true)
    })
})
`;
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const parseAndGenerateTemplate = (dir) => {
  const providedDirName = path.join(__dirname, dir);
  console.info('DIR: ', providedDirName);
  fs.readdir(providedDirName, (err, files) => {
    if (err) {
      return console.error(`Unable to scan provided directory ${dir}`);
    }

    files.forEach(file => {
      const fullPath = path.resolve(path.join(__dirname, dir, file));
      const stat = fs.statSync(fullPath);

      if (stat.isFile() && extensions.indexOf(path.extname(fullPath)) > -1) {
        fs.writeFileSync(path.resolve(path.join(__dirname, dir, `${file.split('.')[0]}.spec.js`)), template.trim());
      } else if (stat.isDirectory()) {
        parseAndGenerateTemplate(path.join(dir, file));
      }
    });
  });
};

parseAndGenerateTemplate(dir);
