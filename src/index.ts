import resolve from 'resolve';
import path from 'path';
import { utils } from './utils';

type Env = {
  [key: string]: string
}

type ScriptOptions = {
  args?: string[]
  exit?: boolean
  spawnOptions?: { env?: Env }
}

// 获取当前模块文件所在的目录的绝对路径
/**
 * __dirname：当前node运行文件的目录
 * join： 拼接多个路径片段成一个完整的路径
 */
// const here = (...p: string[]) => path.join(__dirname, ...p)

/**
 * 
 * @param script 命令参数
 * @param param 扩展参数
 * @returns 
 */
function runScripts(
  script: string,
  { args = [], exit = true, spawnOptions = {} }: ScriptOptions = {},
) {
  const scriptPath = attemptResolve(path.join(__dirname, './scripts', script))

  if (!scriptPath) {
    throw new Error(`Unknown script "${script}"`)
  }

  const bin = utils.resolveBin('node');
  console.log([scriptPath, ...args])
  const result = utils.spawnSync(bin, [scriptPath, ...args], {
    stdio: 'inherit',
    ...spawnOptions,
    env: {
      ...getEnv(),
      ...(spawnOptions.env || {}),
    },
  })

  if (result.signal) {
    process.exit(1)
  } else if (exit) {
    process.exit(result.status)
  }
  return result
}

/**
 * 
 * @returns process.env
 */
function getEnv(): Env {
  return Object.keys(process.env)
    .filter((key) => process.env[key] !== undefined)
    .reduce(
      (envCopy: any, key) => {
        envCopy[key] = String(process.env[key])
        return envCopy
      },
      {}
    )
}

//来查找和解析模块的路径，找到并返回模块的结果
function attemptResolve(modulePath: string) {
  try {
    return resolve.sync(modulePath, { extensions: ['.js', '.ts', '.tsx'] })
  } catch (error) {
    return null
  }
}

export default runScripts
