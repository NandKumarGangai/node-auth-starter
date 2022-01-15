const styles = {
  blue: { open: '\u001b[34m', close: '\u001b[39m' },
  dim: { open: '\u001b[2m', close: '\u001b[22m' },
  red: { open: '\u001b[31m', close: '\u001b[39m' },
  green: { open: '\u001b[32m', close: '\u001b[39m' }
};

const color = (string, modifier) => `${styles[modifier].open}${string}${styles[modifier].close}`;

const logger = {
  blue: (_) => console.log(color(_, 'blue')),
  dim: (_) => console.log(color(_, 'dim')),
  red: (_) => console.log(color(_, 'red')),
  green: (_) => console.log(color(_, 'green')),
  err: (_) => console.error(color(_, 'red'))
};

const log = (_) => console.info(_);

module.exports = { logger, log };
