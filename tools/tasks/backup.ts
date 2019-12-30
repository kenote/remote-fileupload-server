import * as path from 'path'
import * as fs from 'fs-extra'
import * as inquirer from 'inquirer'
import { TaskSpinner } from 'kenote-task-helper'
import { pickFiles } from 'kenote-config-helper/dist/utils.server'
import { dirChoices, footChoices } from './utils'
import { oc } from 'ts-optchain'
import { trim } from 'lodash'
import { ITask } from '../task'

const deployRoot: string = path.resolve(process.cwd(), '.deploy')

export default async function backupDeploy (): Promise<any> {
  try {
    let options: Record<'name', string> = await inquirer.prompt([
      {
        type: 'list',
        name: 'name',
        message: '选择一个部署目录',
        choices: dirChoices(deployRoot, { name: '创建新目录', value: '--> create' }).concat(footChoices)
      }
    ])
    let nameMatch = oc(options).name('').match(/^(\-{2}\>{1}\s{1})(\S+)$/)
    if (oc(nameMatch)(['', '', ''])[2] === 'goback') {
      return await ITask.start()
    }
    if (oc(nameMatch)(['', '', ''])[2] === 'exit') {
      return await TaskSpinner(Promise.resolve(`Exit Finished.`))
    }
    if (oc(nameMatch)(['', '', ''])[2] === 'create') {
      let opts: Record<'name', string> = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '请填写新目录名称',
          validate (val: string): string | true {
            if (!trim(val)) {
              return '请填写新目录名称'
            }
            return true
          }
        }
      ])
      options.name = opts.name
    }
    let confirm: Record<'runing', boolean> = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'runing',
        message: '您确定要导出配置到部署目录吗？',
        default: false
      }
    ])
    if (!confirm.runing) {
      return await backupDeploy()
    }
    // 创建主目录/清空文件
    let rootDir: string = path.resolve(deployRoot, options.name)
    !fs.existsSync(rootDir) && fs.mkdirSync(rootDir)
    // 1、备份 /data/ 目录
    let dataDir: string = path.resolve(rootDir, 'data')
    if (fs.existsSync(dataDir)) {
      let dataDirFiles: string[] = await pickFiles(['.**/**', '**'], { cwd: dataDir, nodir: true, realpath: true, ignore: ['**/release.yml'] })
      for (let item of dataDirFiles) {
        await fs.remove(item)
      }
    }
    fs.copySync(path.resolve(process.cwd(), 'data'), dataDir)
    // Backup Finished.
    return await TaskSpinner(Promise.resolve(`Backup Finished.`))
  } catch (error) {
    console.log(``)
    console.error(error)
  }
}
