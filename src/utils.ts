import path from 'path';
import fs from 'fs';
import which from 'which';
import npmExecutor from 'npm-which';
import resolve from 'resolve';
import spawn from 'cross-spawn';
import debug from 'debug';
import chalk from 'chalk';

const log = debug('scripts')

type ResolveBinOptions = {
    executable?: string;
    cwd?: string;
    fullPath?: boolean;
  };

const relative = (p1: string, p2: string = process.cwd()): string => {
  return `./${path.relative(p2, p1)}`;
};

const getUtils = (cwd = process.cwd()) => {
  // 读取package.json文件内容和路径
  // 返回规范化的绝对路径。
  // const { packageJson = {}, path: pkgPath } = readPackage({
  //   cwd: fs.realpathSync(cwd),
  // });
  const pkgPath = path.resolve(fs.realpathSync(cwd), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  // 获取根目录
  const rootDir = path.dirname(pkgPath || cwd);
  // 根据根目录获取组合当前路径
  const fromRoot = (...p: string[]): string => {
    return path.join(rootDir, ...p)
  };
  // 判断当前的路径是否存在
  const hasFile = (...p: string[]): boolean => {
    return fs.existsSync(fromRoot(...p))
  };

  // 查找node可执行文件
  function resolveBin(
    modName: string,
    {
      executable = modName,
      cwd: givenCWD = cwd,
      fullPath = false,
    }: ResolveBinOptions = {}
  ): string {
    const originalCWD = process.cwd();
    try {
        //指定当前工作目录
      process.chdir(givenCWD);
      // 查找指定可执行文件
      const pathFromWhich = which.sync(executable);
      log('first:',chalk.red(pathFromWhich))
      if (pathFromWhich) {
        // realpathSync 返回规范化的绝对路径。
        return fullPath ? fs.realpathSync(pathFromWhich) : executable;
      }
    } catch (error) {
    } finally {
      process.chdir(originalCWD);
    }
    try {
      const npmExecutorInstance = npmExecutor(givenCWD);
      const pathFromWhich = npmExecutorInstance.sync(executable);
      log('second:',chalk.red(pathFromWhich))
      if (pathFromWhich) {
        const realPathFromWhich = fs.realpathSync(pathFromWhich);
        return fullPath
          ? realPathFromWhich
          : realPathFromWhich.replace(givenCWD, '.');
      }
    } catch (error) {
    }
    const modPkgPath = resolve.sync(path.join(modName, 'package.json'), {
      basedir: givenCWD,
    });
    log('modPkgPath:',chalk.red(modPkgPath))
    const modPkgDir = path.dirname(modPkgPath);
    log('modPkgDir:',chalk.red(modPkgDir))
    const { bin } = require(modPkgPath);
    log('bin:',chalk.red(bin))
    const binPath = typeof bin === 'string' ? bin : bin[executable];
    log('binPath:',chalk.red(binPath))
    const fullPathToBin = path.join(modPkgDir, binPath);
    log('fullPathToBin:',chalk.red(fullPathToBin))
    return fullPath ? fullPathToBin : fullPathToBin.replace(givenCWD, '.');
  }

  const serverDir = fromRoot('server');

  const isTypeScript =
    hasFile('tsconfig.json') ||
    hasFile('client/tsconfig.json') ||
    hasFile('server/tsconfig.json');

  return {
    relative: (p1: string) => relative(p1, cwd),
    isTypeScript,
    rootDir,
    serverDir,
    fromRoot,
    hasFile,
    packageJson,
    resolveBin,
  };
}

const defaultUtils = getUtils();

function utilsFor(subdir: 'client' | 'server'): ReturnType<typeof getUtils> {
  let subDirUtils = getUtils(defaultUtils.fromRoot(subdir))
  return subDirUtils
}

const spawnSync = (
  bin: string,
  params: string[] = [],
  options?: Parameters<typeof spawn.sync>[2],
) => {
  //return 子进程的信号，如果子进程不是由于信号而终止则为 null。
  return spawn.sync(bin, params, options)
}

export const utils = {
  spawnSync,
  utilsFor,
  ...defaultUtils
}