import debugFactory from 'debug';

const debug = debugFactory('config:prettier');

const config = {
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  proseWrap: 'always',
}

debug('prettier code');

module.exports = config

