import * as path from 'path'
import * as fs from 'fs-extra'

/**
 * 定制返回上级节点
 */
export const footChoices: Array<Record<'name' | 'value', string>> = [
  {
    name: '返回上级',
    value: '--> goback'
  },
  {
    name: '退出',
    value: '--> exit'
  }
]


export function dirChoices (dir: string, opts?: Record<'name' | 'value', string>): Array<Record<'name' | 'value', string>> {
  let choices: Array<Record<'name' | 'value', string>> = []
  let dirs: string[] = fs.readdirSync(dir)
  for (let item of dirs) {
    let stat: fs.Stats = fs.statSync(path.resolve(dir, item))
    if (stat.isDirectory() && !/^(\.)/.test(item)) {
      choices.push({ name: item, value: item })
    }
  }
  opts && choices.push(opts)
  return choices
}

