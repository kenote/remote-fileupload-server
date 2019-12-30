import { Request, Response, NextFunction } from 'express'
import { Controller, Router, Filter } from 'kenote-express-helper'
import { StroeOptions } from 'kenote-store-helper'
import { IResponse } from '@/types/restful'
import config from '~/config'
import { loadError } from '@/utils/error'
import { authenticate } from '~/middleware/auth'
import storeFilter from '~/filters/controller/store'

import * as path from 'path'
import * as fs from 'fs-extra'
import * as mime from 'mime-types'
import { unzip } from '@/utils/zip'
import { oc } from 'ts-optchain'
import { compact } from 'lodash'

const { language } = config
const { CustomError } = loadError(language)

interface FileInfo {
  name           : string
  mime           : string
  size           : number
  mtime          : Date
  directory     ?: boolean
}

interface FileList {
  list           : FileInfo[]
  directory      ?: string
}

export default class Store extends Controller {

  /**
   * 获取上传文件列表
   */
  @Router(
    { method: 'post', path: '/uploadfiles' },
    { method: 'post', path: '/uploadfiles/:type' }
  )
  @Filter( authenticate, storeFilter.setting )
  public async list (options: StroeOptions, req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let { dir } = req.query
    try {
      let fileList: FileList = await getFileList(options, dir)
      return res.api(fileList)
    } catch (error) {
      if (CustomError(error)) {
        return res.api(null, error)
      }
      return next(error)
    }
  }

  /**
   * 删除上传文件
   */
  @Router(
    { method: 'delete', path: '/uploadfiles' },
    { method: 'delete', path: '/uploadfiles/:type' }
  )
  @Filter( authenticate, storeFilter.setting )
  public async remove (options: StroeOptions, req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let { root_dir } = options
    let { files } = req.body
    let rootDir: string = path.resolve(process.cwd(), root_dir!)
    let _files: string[] = compact(Array.isArray(files) ? files : [ files ])
    try {
      for (let file of _files) {
        let filePath: string = path.resolve(rootDir, file)
        if (!fs.existsSync(filePath)) continue
        // let stats: fs.Stats = fs.statSync(filePath)
        // if (stats.isDirectory()) continue
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

  /**
   * 解压ZIP文件 
   */
  @Router(
    { method: 'post', path: '/unzip' },
    { method: 'post', path: '/unzip/:type' }
  )
  @Filter( authenticate, storeFilter.setting )
  public async unzip (options: StroeOptions, req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let { root_dir } = options
    let { zipfile, target, remove } = req.body
    let rootDir: string = path.resolve(process.cwd(), root_dir!)
    try {
      let filePath: string = path.resolve(rootDir, zipfile)
      let mimeType: string = mime.lookup(zipfile) || 'application/octet-stream'
      if (fs.existsSync(filePath)) {
        let stats: fs.Stats = fs.statSync(filePath)
        if (stats.isFile() && ['application/zip'].includes(mimeType)) {
          let targetDir: string = path.resolve(rootDir, oc(target)('').replace(/^\//, ''))
          await unzip(filePath, targetDir)
          if (!!remove) {
            await fs.remove(filePath)
          }
        }
        else {
          // 
        }
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

/**
 * 获取文件列表
 * @param options StroeOptions
 * @param directory string
 */
async function getFileList (options: StroeOptions, directory?: string): Promise<FileList> {
  let { root_dir, type } = options
  if (type === 'local') {
    directory = oc(directory)('').replace(/^\//, '')
    let rootDir: string = path.resolve(process.cwd(), root_dir!, directory)
    let files: string[] = fs.readdirSync(rootDir)
    let list: FileInfo[] = []
    for (let item of files) {
      let itemPath: string = path.resolve(rootDir, item)
      let stats = fs.statSync(itemPath)
      list.push({
        name: item,
        mime: mime.lookup(item) || '--',
        size: stats.isFile() ? stats.size : NaN,
        mtime: stats.mtime,
        directory: stats.isDirectory()
      })
    }
    return { list, directory }
  }
  else {
    return { list: [] }
  }
}
