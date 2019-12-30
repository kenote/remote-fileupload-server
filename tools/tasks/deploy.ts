import * as inquirer from 'inquirer'
import { TaskSpinner } from 'kenote-task-helper'
import { Maps, Deploy } from 'kenote-config-helper'
import { Deploy as IDeploy } from 'kenote-config-helper/dist/utils.server'
import { ITask } from '../task'
import { footChoices } from './utils'
import { oc } from 'ts-optchain'
import { exec } from 'child_process'
import { isString } from 'lodash'


export default async function startDeploy (projects: Deploy.Project[]): Promise<any> {
  try {
    // 选择项目
    let project: Deploy.Project | string = <Deploy.Project | string> await selectProject(projects)
    // 选择类型
    await startType(project as Deploy.Project, projects)
    // Deploy Finished.
    return await TaskSpinner(Promise.resolve(`Deploy Finished.`))
  } catch (error) {
    console.log(``)
    console.error(error)
  }
  
}

/**
 * 从选择类型启动
 * @param project 
 * @param projects 
 */
async function startType (project: Deploy.Project, projects: Deploy.Project[]): Promise<any> {
  let type: string = await selectType(project)
  if (type === '--> goback') {
    return await startDeploy(projects)
  }
  else if (type === '--> exit') {
    return await TaskSpinner(Promise.resolve(`Exit Finished.`))
  }
  else if (type === '--> command') {
    // 选择脚本
    let command: Deploy.Command | string = await selectScript(project.command || [])
    if (command === '--> goback') {
      return await startType(project, projects)
    }
    else if (command === '--> exit') {
      return process.exit(0)
    }
    // 运行脚本
    let deploy: IDeploy = new IDeploy()
    if (oc(<Deploy.Command> command).connect()) {
      await deploy.command(<Deploy.Command> command)
    }
    else {
      await new Promise((resolve, reject) => {
        exec(oc(<Deploy.Command> command).command([]).join(' && '), (error, stdout, stderr) => {
          if (error) {
            reject(error)
          }
          else {
            console.log('\n' + stdout)
            stderr && console.log('stderr: ' + stderr + '\n')
            resolve(null)
          }
        })
      })
    }
  }
  else if (/^(ftp|sftp)$/.test(type)) {
    // 上传文件
    let deploy: IDeploy = new IDeploy()
    let options: Deploy.SFTPOptins = project[type]
    options.ignore = toIgnore(options.ignore)
    await deploy.upload(options, type === 'ftp' ? 'ftp' : 'sftp')
  }
  // 完成后返回类型选择
  await new Promise((resolve, reject) => {
    setTimeout(async () => {
      await startType(project, projects)
    }, 500)
  })
}

function toIgnore (ignore: any[]): string[] {
  for (let item of ignore) {
    if (Array.isArray(item)) {
      return [].concat(...ignore)
    }
  }
  return ignore
}

/**
 * 选择项目
 * @param projects Deploy.Project[]
 * @returns Deploy.Project
 */
async function selectProject (projects: Deploy.Project[]): Promise<Deploy.Project | void | string> {
  let options: Maps<string>  = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'project',
      message: `选择项目:`,
      choices: projects.map( item => (<Maps<string>> { name: item.name, value: item.index })).concat(footChoices)
    }
  ])
  if (options.project === '--> goback') {
    return await ITask.start()
  }
  else if (options.project === '--> exit') {
    return process.exit(0)
  }
  return <Deploy.Project> projects.find( item => item.index === options.project )
}

/**
 * 选择操作类型
 * @param project Deploy.Project
 * @returns string
 */
async function selectType (project: Deploy.Project): Promise<string> {
  let options: Maps<string>  = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'type',
      message: `操作类型:`,
      choices: Object.keys(project).filter( item => /^(ftp|sftp|command)$/.test(item) ).map(toTypeChoice).concat(footChoices)
    }
  ])
  return options.type
}

/**
 * 选择运行脚本
 * @param scripts Deploy.Script
 * @returns any
 */
async function selectScript (scripts: Deploy.Command[]): Promise<Deploy.Command | string> {
  let options: Maps<string>  = await inquirer.prompt([
    {
      type: 'rawlist',
      name: 'script',
      message: `运行脚本:`,
      choices: scripts.map( item => (<Maps<string>> { name: item.name, value: item.index })).concat(footChoices)
    }
  ])
  if (options.script === '--> goback') {
    return options.script
  }
  else if (options.script === '--> exit') {
    return process.exit(0)
  }
  return <Deploy.Command> scripts.find( item => item.index === options.script )
}

/**
 * 转换类型选择器
 * @param value string
 * @returns Maps<string>
 */
function toTypeChoice (value: string): Maps<string> {
  let name: string = ''
  if (/^(ftp|sftp)$/.test(value)) {
    name = value.toLocaleUpperCase() + '上传'
  }
  else if (/^(command)$/.test(value)) {
    name = '运行命令'
  }
  return { name, value }
}
