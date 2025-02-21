import { utils } from '../../utils';

const { spawnSync, resolveBin } = utils;

type Scripts = {
    client: string;
    server: string;
}

const mangoScriptsBin = resolveBin('disney-scripts');

const scripts: Scripts = {
  client: `${mangoScriptsBin} dev/client`,
  server: `${mangoScriptsBin} dev/server`,
};

const getConcurrentlyArgs = (scripts: Scripts) => {
  return [
    '--kill-others-on-fail',
    '--handle-input',
    '--prefix', '[{name}]',
    '--names', Object.keys(scripts).join(','),
    ...Object.values(scripts).map(s => JSON.stringify(s)),
  ].filter(Boolean);
}

const result = spawnSync(
  resolveBin('concurrently'),
  getConcurrentlyArgs(scripts),
  {
    stdio: 'inherit'
  }
);

process.exit(result.status);
