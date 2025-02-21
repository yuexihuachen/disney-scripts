import yargsParser from 'yargs-parser';
import path from 'path';
import { utils } from '../utils';

const {
    hasFile,
    fromRoot,
    spawnSync,
    resolveBin
} = utils;

const args = process.argv.slice(2)
const parsedArgs = yargsParser(args)

const here = (p: string) => path.join(__dirname, p)

// https://zh-hans.eslint.org/docs/latest/use/command-line-interface
const useBuiltinConfig =
  !args.includes('--config') &&
  !hasFile('eslint.config.js') &&
  !hasFile('eslint.config.mjs') &&
  !hasFile('eslint.config.cjs') &&
  !hasFile('eslint.config.ts') &&
  !hasFile('eslint.config.mts') &&
  !hasFile('eslint.config.cts') 
  
const config = useBuiltinConfig
  ? ['--config', here('../config/eslint.config.js')]
  : []

const cache = args.includes('--no-cache')
  ? []
  : [
      '--cache',
      '--cache-location',
      fromRoot('node_modules/.cache/eslint/cache'),
    ]

const filesGiven = parsedArgs._.length > 0
const filesToApply = filesGiven ? [] : ['.']

let argsToCallWith = [
  ...config,
  ...cache,
  ...filesToApply,
  ...args,
]


const result = spawnSync(resolveBin('eslint'), argsToCallWith, {
  stdio: 'inherit',
})

process.exit(result.status)