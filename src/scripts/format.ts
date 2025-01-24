import yargsParser from 'yargs-parser';
import path from 'path';
import { utils } from '../utils';

// prettier 格式化 code

const args = process.argv.slice(2);
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
