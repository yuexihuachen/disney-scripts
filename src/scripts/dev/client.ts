import path from 'path';
import { utils } from '../../utils';

const {
    hasFile,
    fromRoot,
    spawnSync,
    resolveBin
} = utils;

const args = process.argv.slice(2)

const here = (p: string) => path.join(__dirname, p);

const webpackConfig = hasFile('webpack.config.js')
  ? fromRoot('webpack.config.js') 
  : here('../../config/webpack5.config')

  console.log('webpack client')

const result = spawnSync(
  resolveBin('webpack'),
  ['serve', '--config', webpackConfig, ...args],
  {
    stdio: 'inherit',
    env: Object.assign({ BUILD_WEBPACK: true }, process.env),
  },
)

process.exit(result.status)