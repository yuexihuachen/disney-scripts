import yargsParser from 'yargs-parser';
import path from 'path';
import { utils } from '../utils';
import debugFactory from 'debug';
import chalk from 'chalk';

const debug = debugFactory('format');


/**
 * node命令行参数
 * node process-args.js one two=three four 
 * output: one two=three two=three
 */
const args = process.argv.slice(2);
/**
 * 解析命令行参数
 * 支持格式: node example.js --foo=33 --bar hello --foo-bar
 * { _: [], foo: 33, bar: 'hello', 'foo-bar': true, fooBar: true }
 */
const parseArgs = yargsParser(args);

const here = (p: string) => path.join(__dirname, p);
const hereRelative = (p: string) => here(p).replace(process.cwd(), '.');

// https://prettier.io/docs/en/configuration
const useBuiltinConfig =
  !args.includes('--config') &&
  !utils.hasFile('.prettierrc') &&
  !utils.hasFile('.prettierrc.js') &&
  !utils.hasFile('prettier.config.js') &&
  !utils.hasFile('.prettierrc.json') &&
  !utils.hasFile('.prettierrc.yaml');

debug(chalk.red('useBuiltinConfig'), useBuiltinConfig)

const config = useBuiltinConfig
  ? ['--config', hereRelative('../config/prettier.config.js')]
  : [];

// https://prettier.io/docs/en/cli
const useBuiltinIgnore =
  !args.includes('--ignore-path') && !utils.hasFile('.prettierignore');
const ignore = useBuiltinIgnore
  ? ['--ignore-path', hereRelative('../config/.prettierignore')]
  : [];

//https://prettier.io/docs/en/cli#--write
const write = args.includes('--no-write') ? [] : ['--write'];

const relativeArgs = args.map((a) => a.replace(`${process.cwd()}/`, ''));

const filesToApply = parseArgs._.length
  ? []
  : ['**/*.+(js|ts|tsx|json|less|css|md|mdx|html|graphql)'];

let argsToCallWith = [
  ...config,
  ...ignore,
  ...write,
  ...filesToApply,
  ...relativeArgs,
];

const result = utils.spawnSync(utils.resolveBin('prettier'), argsToCallWith, {
  stdio: 'inherit',
});

process.exit(result.status);
