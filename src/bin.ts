#!/usr/bin/env node

import debug from 'debug';
import runScripts from './index';

const logger = debug('bin')

const [executor, , script, ...args] = process.argv;

logger(executor)

runScripts(script, { args });
