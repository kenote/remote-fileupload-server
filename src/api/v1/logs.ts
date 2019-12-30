import { Request, Response, NextFunction } from 'express'
import { Controller, Router, Filter, Path } from 'kenote-express-helper'
import { IResponse } from '@/types/restful'
import config from '~/config'
import { loadError } from '@/utils/error'
import { authenticate } from '~/middleware/auth'
import * as path from 'path'
import { pickFiles } from 'kenote-config-helper/dist/utils.server'
import * as fs from 'fs-extra'
import * as mime from 'mime-types'
import { oc } from 'ts-optchain'
import { compact } from 'lodash'

const { language } = config
const { CustomError } = loadError(language)

interface FileInfo {
  name      : string
  mime      : string
  size      : number
  mtime     : Date
}

@Path('/logs')
export default class Logs extends Controller {

  /**
   * 获取日志列表
   */
  @Router({ method: 'get', path: '' })
  @Filter( authenticate )
  public async list (req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let rootDir: string = path.resolve(process.cwd(), 'logs', process.env.NODE_ENV || 'development')
    try {
      let files: string[] = await pickFiles(['**/*'], { cwd: rootDir, nodir: true, realpath: true, ignore: ['!**/*.log'] })
      let fileList: FileInfo[] = files.map( file => {
        let stats: fs.Stats = fs.statSync(file)
        return {
          name: file.replace(new RegExp(`^(${rootDir}\/)`), ''),
          mime: mime.lookup(file) || 'application/octet-stream',
          size: stats.size,
          mtime: stats.ctime
        }
      })
      return res.api(fileList)
    } catch (error) {
      if (CustomError(error)) {
        return res.api(null, error)
      }
      return next(error)
    }
  }

  /**
   * 下载日志文件
   */
  @Router({ method: 'get', path: '/:filename' })
  @Filter( authenticate )
  public async download (req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let { filename } = req.params
    let { download } = req.query
    let rootDir: string = path.resolve(process.cwd(), 'logs', process.env.NODE_ENV || 'development')
    try {
      let filePath: string = path.resolve(rootDir, oc(filename)('').replace(/^\//, ''))
      return res.downloadFile(filePath, { download })
    } catch (error) {
      if (CustomError(error)) {
        return res.api(null, error)
      }
      return next(error)
    }
  }

  /**
   * 删除日志文件
   */
  @Router({ method: 'delete', path: '' })
  @Filter( authenticate )
  public async remove (req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let { files } = req.body
    let rootDir: string = path.resolve(process.cwd(), 'logs', process.env.NODE_ENV || 'development')
    let _files: string[] = compact(Array.isArray(files) ? files : [ files ])
    try {
      for (let file of _files) {
        let filePath: string = path.resolve(rootDir, file)
        if (!fs.existsSync(filePath)) continue
        let stats: fs.Stats = fs.statSync(filePath)
        if (stats.isDirectory()) continue
        await fs.remove(filePath)
      }
      return res.api('ok')
    } catch (error) {
      if (CustomError(error)) {
        return res.api(null, error)
      }
      return next(error)
    }
  }
}

