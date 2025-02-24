import path from 'path';
import { utils } from '../utils';

const { hasFile, spawnSync, resolveBin } = utils;

const args = process.argv.slice(2);
const here = (p: string) => path.join(__dirname, p);

const config = args.includes('--config')
  ? []
  : hasFile('webpack.config.js')
  ? []
  : ['--config', here('../config/webpack5.config')];

const result = spawnSync(resolveBin('webpack-cli'), [...config, ...args], {
  stdio: 'inherit',
});

process.exit(result.status);
