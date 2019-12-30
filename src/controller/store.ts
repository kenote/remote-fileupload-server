import { Request, Response, NextFunction } from 'express'
import { Controller, Router, Filter } from 'kenote-express-helper'
import { StroeOptions, ProxyResult } from 'kenote-store-helper'
import { IResponse } from '@/types/restful'
import storeFilter from '~/filters/controller/store'
import config from '~/config'
import { loadError } from '@/utils/error'
import { IStore } from '@/utils/store'
import { authenticate } from '~/middleware/auth'
import * as path from 'path'
import { oc } from 'ts-optchain'

const { language } = config
const { ErrorInfo, CustomError, __ErrorCode } = loadError(language)
const IStoreErrorInfo = (code: number, opts?: any) => ErrorInfo(code, opts, true)

export default class Store extends Controller {

  /**
   * 上传文件 
   */
  @Router(
    { method: 'post', path: '/upload' },
    { method: 'post', path: '/upload/:type' }
  )
  @Filter( authenticate, storeFilter.setting )
  public async upload (options: StroeOptions, request: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    try {
      let result: ProxyResult[] = await new IStore({ request, options }).asyncSave(IStoreErrorInfo)
      if (result.length === 0) {
        return res.api(null, __ErrorCode.ERROR_UPLOAD_NOT_FILE)
      }
      return res.api(result)
    } catch (error) {
      if (CustomError(error)) {
        return res.api(null, error)
      }
      return next(error)
    }
  }

  /**
   * 下载文件
   */
  @Router(
    { method: 'get', path: '/download/:filename' },
    { method: 'get', path: '/download/:type/:filename' }
  )
  @Filter( authenticate, storeFilter.setting )
  public async download (options: StroeOptions, req: Request, res: IResponse, next: NextFunction): Promise<Response | void> {
    let { root_dir } = options
    let { filename } = req.params
    let { sub_dir, download } = req.query
    let rootDir: string = path.resolve(process.cwd(), root_dir!)
    try {
      let filePath: string = path.resolve(rootDir, oc(sub_dir)('').replace(/^\//, ''), oc(filename)('').replace(/^\//, ''))
      return res.downloadFile(filePath, { download })
    } catch (error) {
      if (CustomError(error)) {
        return res.api(null, error)
      }
      return next(error)
    }

  }
}
