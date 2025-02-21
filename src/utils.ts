import path from 'path';
import fs from 'fs';
import which from 'which';
import resolve from 'resolve';
import npmExecutor from 'npm-which';
import spawn from 'cross-spawn';

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
      // 类似linux which命令，在 PATH 环境变量中查找指定可执行文件的第一个实例
      const pathFromWhich = which.sync(executable);
      if (pathFromWhich) {
        // realpathSync 返回规范化的绝对路径。
        return fullPath ? fs.realpathSync(pathFromWhich) : executable;
      }
    } catch (error) {
    } finally {
      process.chdir(originalCWD);
    }
    try {
      // 从本地或者parent目录node_modules/.bin查找可执行文件
      const npmExecutorInstance = npmExecutor(givenCWD);
      const pathFromWhich = npmExecutorInstance.sync(executable);
      if (pathFromWhich) {
        const realPathFromWhich = fs.realpathSync(pathFromWhich);
        return fullPath
          ? realPathFromWhich
          : realPathFromWhich.replace(givenCWD, '.');
      }
    } catch (error) {
    }
    // 没有就直接使用当前默认可执行文件
    const modPkgPath = resolve.sync(path.join(modName, 'package.json'), {
      basedir: givenCWD,
    })
    console.log(modPkgPath)
    const modPkgDir = path.dirname(modPkgPath)
    const { bin } = require(modPkgPath)
    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modPkgDir, binPath)
    return fullPath ? fullPathToBin : fullPathToBin.replace(givenCWD, '.')
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