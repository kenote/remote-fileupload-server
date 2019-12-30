
import { TaskHelper, Connect, TaskItem } from 'kenote-task-helper'
import { loadData } from 'kenote-config-helper/dist/utils.server'
import { Deploy as IDeploy } from 'kenote-config-helper'
import { oc } from 'ts-optchain'
import startDeploy from './tasks/deploy'
import backupDeploy from './tasks/backup'

const deployConfig: IDeploy.Configuration = loadData('.deploy/deploy.config.yml', false, {
  assign: {
    workspace: process.cwd()
  }
}) as IDeploy.Configuration
const deployTask: TaskItem[] = []
if (oc(deployConfig).projects()) {
  deployTask.push({
    name: '部署服务器',
    value: 'deploy',
    script: () => startDeploy(deployConfig.projects)
  })
}

@Connect({
  title: '选择操作类型',
  tasks: [
    ...deployTask,
    {
      name: '备份当前部署',
      value: 'backup',
      script: backupDeploy 
    },
    {
      name: '退出',
      value: 'exit',
      script: () => process.exit(0)
    }
  ]
})
class Task extends TaskHelper {}

export const ITask: Task = new Task()

ITask.start()
