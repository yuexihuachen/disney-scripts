#!/usr/bin/env node

import debug from 'debug';
import runScripts from './index';

const log = debug('bin')

const [executor, , script, ...args] = process.argv;

log(executor)

runScripts(script, { args });
