import * as path from 'path'
import * as log4js from 'log4js'
import * as bytes from 'bytes'
import { ServerConfiguration } from 'kenote-config-helper'
import { loadData } from 'kenote-config-helper/dist/utils.server'

const env: string = process.env.NODE_ENV || 'development'
const config: ServerConfiguration = loadData('data/config') as ServerConfiguration

log4js.configure({
  appenders: {
    out: { type: 'stdout' },
    app: {
      type: 'dateFile',
      filename: path.resolve(process.cwd(), `logs/${env}/bak`),
      pattern: 'yyyy-MM-dd-hh.log',
      alwaysIncludePattern: true
    },
    file: {
      type: 'file',
      filename: path.resolve(process.cwd(), `logs/${env}.log`),
      maxLogSize: bytes.parse('10MB'),
      backups: 5,
      compress: true,
      encoding: 'utf-8',
      mode: 0o0640,
      flags: 'w+'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    cheese: { appenders: ['out', 'app', 'file'], level: 'all' },
    development: { appenders: ['out', 'app', 'file'], level: 'all' },
    production: { appenders: ['out', 'app', 'file'], level: 'all' },
  },
  pm2: true,
  pm2InstanceVar: config.session_secret || 'INSTANCE_ID',
  disableClustering: true
})

export default log4js.getLogger(env)
